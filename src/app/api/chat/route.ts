import { NextRequest, NextResponse } from 'next/server'
import type { TextBlock } from '@anthropic-ai/sdk/resources/messages'
import { getAnthropicClient, parseAssistantResponse, shouldCaptureLead } from '@/lib/claude'
import { getSystemPrompt, detectUserRole, detectPainPoint } from '@/lib/agent-prompts'
import { analyzeMessageForBlocks, generateBlockData, shouldShowBlock } from '@/lib/block-triggers'
import type { FunctionType, Message, BlockType, ContentBlock } from '@/types'
import type { FunctionContext } from '@/lib/rag'

// Convert FunctionType to FunctionContext for RAG
const functionTypeToContext: Record<FunctionType, FunctionContext> = {
  'it-infrastructure': 'it-infrastructure',
  'revenue-operations': 'revenue-operations',
  'customer-success': 'customer-success',
  'demand-generation': 'demand-generation',
}

// Use Node.js runtime for Anthropic SDK compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ChatRequest {
  messages: Message[]
  functionType: FunctionType
  userRole?: string | null
  previousBlocks?: BlockType[]
  messageCount?: number
  lastBlockShownAt?: number
  context?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const {
      messages,
      functionType,
      userRole: existingRole,
      previousBlocks = [],
      messageCount = messages.length,
      lastBlockShownAt = 0,
      context = {},
    } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!functionType) {
      return NextResponse.json(
        { error: 'Function type is required' },
        { status: 400 }
      )
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]
    if (latestMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 }
      )
    }

    // Detect user role if not already known
    let userRole = existingRole
    if (!userRole) {
      userRole = detectUserRole(messages)
    }

    // Detect pain point from conversation
    const painPoint = detectPainPoint(messages)
    const painPoints = painPoint ? [painPoint] : []

    // Analyze message for potential content blocks
    const recommendedBlocks = analyzeMessageForBlocks(
      latestMessage.content,
      functionType,
      userRole,
      previousBlocks
    )

    // Determine which blocks to show
    const blocksToShow: ContentBlock[] = []
    for (const blockType of recommendedBlocks) {
      // Calculate a simple score based on keyword matches
      const score = 15 // Base score for recommended blocks

      if (shouldShowBlock(messageCount, lastBlockShownAt, score)) {
        const blockData = generateBlockData(blockType, functionType, context)
        blocksToShow.push({
          id: `block-${Date.now()}-${blockType}`,
          type: blockType,
          data: blockData,
          displayedAt: new Date(),
        })
        break // Only show one block per response
      }
    }

    // Try to retrieve RAG context if configured
    let ragContext = ''
    let ragConfidence = 0
    const isRagEnabled = process.env.WEAVIATE_URL && process.env.OPENAI_API_KEY

    if (isRagEnabled) {
      try {
        const { retrieve, getRetrievalDecision } = await import('@/lib/rag')
        const ragResult = await retrieve(
          latestMessage.content,
          { final_top_k: 3 },
          {
            functionType: functionTypeToContext[functionType],
            userRole: userRole || undefined,
            previousQueries: messages.slice(-5).filter(m => m.role === 'user').map(m => m.content),
          }
        )

        ragConfidence = ragResult.confidence
        const decision = getRetrievalDecision(ragConfidence)

        if (ragResult.chunks.length > 0 && decision.action !== 'escalate') {
          ragContext = `\n\n<KNOWLEDGE_CONTEXT confidence="${ragConfidence.toFixed(2)}">\n${ragResult.chunks.map(c => c.chunk.text).join('\n\n---\n\n')}\n</KNOWLEDGE_CONTEXT>`
          console.log(`[RAG] Retrieved ${ragResult.chunks.length} chunks with confidence ${ragConfidence.toFixed(2)}`)
        }
      } catch (ragError) {
        console.warn('[RAG] Retrieval failed, continuing without context:', ragError)
      }
    }

    // Build system prompt with context
    const systemPrompt = getSystemPrompt(functionType, {
      userRole,
      painPoints,
      previousBlocks,
      companyName: context.company as string | undefined,
    })

    // Enhance system prompt with RAG context if available
    const ragInstructions = ragContext ? `

## Knowledge Base Context
The following context has been retrieved from the ArqAI knowledge base. Use this information to provide accurate, specific answers. Always prefer information from this context over general knowledge. If the context doesn't contain relevant information, acknowledge that and offer to connect the user with the right person.

${ragContext}` : ''

    // Format messages for Claude API
    const claudeMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Add hint about blocks if we're showing one
    let enhancedSystemPrompt = systemPrompt
    if (blocksToShow.length > 0) {
      const blockType = blocksToShow[0].type
      enhancedSystemPrompt += `\n\n[SYSTEM NOTE: A ${blockType.replace('-', ' ')} content block will be displayed alongside your response. Reference it naturally in your reply.]`
    }

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.log('[Chat] No ANTHROPIC_API_KEY found, using mock responses')
      // Return a mock response for development
      return NextResponse.json({
        message: getMockResponse(latestMessage.content, functionType, userRole, messageCount),
        blocks: blocksToShow,
        detectedRole: userRole,
        painPoints,
        shouldCaptureLead: false,
        ragEnabled: false,
        usingMock: true,
      })
    }

    console.log('[Chat] Using Claude API with key:', apiKey.substring(0, 10) + '...')

    // Build final system prompt with RAG context
    const finalSystemPrompt = enhancedSystemPrompt + ragInstructions

    // Call Claude API - keep responses concise (300 tokens max)
    const client = getAnthropicClient()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: finalSystemPrompt + '\n\nIMPORTANT: Keep responses concise (under 150 words). Use bullet points and bold text for structure. After 4-5 exchanges, naturally ask for the user\'s email to send detailed materials.',
      messages: claudeMessages,
    })

    // Extract text content from response
    const textContent = response.content
      .filter((block): block is TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    // Parse the response for any embedded block commands
    const parsedResponse = parseAssistantResponse(textContent)

    // Check if we should capture lead
    const { should: captureLeadNow } = shouldCaptureLead(parsedResponse.text, messages.length)

    return NextResponse.json({
      message: parsedResponse.text,
      blocks: blocksToShow,
      detectedRole: userRole,
      painPoints,
      shouldCaptureLead: captureLeadNow,
      ragEnabled: isRagEnabled,
      ragConfidence: ragConfidence > 0 ? ragConfidence : undefined,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

// Mock responses for development without API key
function getMockResponse(
  userMessage: string,
  functionType: FunctionType,
  userRole: string | null,
  messageCount: number = 1
): string {
  const lowerMessage = userMessage.toLowerCase()
  const functionName = formatFunction(functionType)

  // After 4-5 exchanges, ask for contact naturally
  if (messageCount >= 8) {
    return getLeadCaptureResponse(functionType)
  }

  // FIRST MESSAGE - Welcome based on function
  if (messageCount <= 1) {
    return getWelcomeResponse(functionType)
  }

  // Handle vague responses
  if (lowerMessage.length < 15 || lowerMessage.includes('tell me') || lowerMessage.includes('go on') || lowerMessage.includes('more') || lowerMessage.includes('yes') || lowerMessage.includes('sure')) {
    return getContinuationResponse(functionType, messageCount)
  }

  // Help questions
  if (lowerMessage.includes('help') || lowerMessage.includes('can you') || lowerMessage.includes('what can')) {
    return `For **${functionName}**, I can help with:

• **Solutions** — How we automate workflows with governance
• **ROI** — 30-40% cost reduction, 85% automation rates
• **Security** — SOC 2, HIPAA, GDPR capabilities
• **Implementation** — 30-day deployment

What matters most to you?`
  }

  // Marketing questions
  if (lowerMessage.includes('marketing') || lowerMessage.includes('demand') || lowerMessage.includes('campaign')) {
    return `**Autonomous Demand Generation** helps with:

• **Campaigns** — Multi-channel with brand guardrails
• **Lead Scoring** — AI-powered routing to the right rep
• **Personalization** — Dynamic content at scale

**Results**: 50% faster launches, 35% better conversion.

Want to see how it integrates with your stack?`
  }

  // Use cases / customers
  if (lowerMessage.includes('use case') || lowerMessage.includes('customer') || lowerMessage.includes('example') || lowerMessage.includes('case stud') || lowerMessage.includes('results')) {
    return `**12 enterprise customers**, $500K ARR, zero churn:

• **Finance** — MTTR reduced from 4 hours to 18 minutes
• **Healthcare** — HIPAA-compliant automation
• **Telecom** — 85% of incidents handled autonomously

All deployed in **30 days**. What industry are you in?`
  }

  // Contact / demo questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('demo') || lowerMessage.includes('call') || lowerMessage.includes('meeting')) {
    return `Happy to connect you with our team!

• **Technical** — Solutions Architect walkthrough
• **Business** — ROI and customer references
• **Security** — Compliance deep-dive

What's your work email? I'll have the right person reach out.`
  }

  // ROI / pricing questions
  if (lowerMessage.includes('roi') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('pricing')) {
    return `Typical ROI for **${functionName}**:

• **30-40%** cost reduction in 90 days
• **85%** automation rate
• **Positive ROI** in first quarter

Pricing is outcome-based, not per-seat. Want a personalized ROI estimate?`
  }

  // Security questions
  if (lowerMessage.includes('security') || lowerMessage.includes('compliance') || lowerMessage.includes('soc') || lowerMessage.includes('hipaa') || lowerMessage.includes('gdpr')) {
    return `**Security & Compliance**:

• SOC 2 Type II (in progress)
• HIPAA-compliant architecture
• GDPR ready with data residency
• Zero-trust, end-to-end encryption
• Cryptographic audit trails

Want to see our security documentation?`
  }

  // Architecture / technical questions
  if (lowerMessage.includes('architecture') || lowerMessage.includes('how does') || lowerMessage.includes('technical') || lowerMessage.includes('patent')) {
    return `**Three Patented Technologies**:

1. **Trust-Aware Orchestration™** — Risk-scores every action
2. **Compliance-Aware Compiler™** — Validates before execution
3. **Adaptive RAG™** — Self-correcting knowledge retrieval

Production-ready from day one. Want the architecture diagram?`
  }

  // Integration questions
  if (lowerMessage.includes('integrate') || lowerMessage.includes('connect') || lowerMessage.includes('salesforce') || lowerMessage.includes('servicenow')) {
    return `**Integration-first design**:

${getIntegrationList(functionType)}

Cloud, model, and vertical agnostic. Most integrations take **< 1 day**.

What's in your current stack?`
  }

  // Timeline questions
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('deploy') || lowerMessage.includes('30 day')) {
    return `**30-Day Deployment**:

• **Week 1** — Blueprint & discovery
• **Weeks 2-3** — Integration & configuration
• **Week 4** — Go-live with monitoring

Zero churn, 100% customer expansion. Ready to start?`
  }

  // Competitor questions
  if (lowerMessage.includes('vs') || lowerMessage.includes('compare') || lowerMessage.includes('zapier') || lowerMessage.includes('langchain')) {
    return `**vs. Zapier/Make** — No governance or audit trails
**vs. LangChain** — Framework, not a platform
**vs. ServiceNow AI** — Vendor-locked

ArqAI: **Governance-first**, three patents, stack-agnostic.

Want a detailed comparison?`
  }

  // What is ArqAI
  if (lowerMessage.includes('what is') || lowerMessage.includes('arqai') || lowerMessage.includes('explain') || lowerMessage.includes('overview')) {
    return `**ArqAI** — AI agents enterprises trust in production.

**Problem**: 87% of AI pilots never reach production.
**Solution**: Governance built-in, not bolted-on.

• Three patents
• 30-day deployment
• Zero customer churn

What would you like to explore—ROI, architecture, or use cases?`
  }

  // Default response
  return getDefaultResponse(functionType, messageCount)
}

function formatFunction(functionType: FunctionType): string {
  const names: Record<FunctionType, string> = {
    'it-infrastructure': 'IT Infrastructure',
    'revenue-operations': 'Revenue Operations',
    'customer-success': 'Customer Success',
    'demand-generation': 'Demand Generation',
  }
  return names[functionType]
}

function getIntegrationList(functionType: FunctionType): string {
  const integrations: Record<FunctionType, string> = {
    'it-infrastructure': `• **ServiceNow** - Full ITSM integration
• **PagerDuty** - Alert routing & escalation
• **Jira** - Issue tracking sync
• **Slack/Teams** - Real-time notifications`,
    'revenue-operations': `• **Salesforce** - Complete CRM sync
• **HubSpot** - Marketing automation
• **Outreach** - Sales engagement
• **Gong** - Conversation intelligence`,
    'customer-success': `• **Zendesk** - Ticket automation
• **Intercom** - Chat routing
• **Gainsight** - Health scoring
• **Freshdesk** - Multi-channel support`,
    'demand-generation': `• **HubSpot** - Campaign orchestration
• **Marketo** - Lead scoring
• **6sense** - Intent data
• **LinkedIn** - Ads & targeting`,
  }
  return integrations[functionType]
}

function getWelcomeResponse(functionType: FunctionType): string {
  const welcomes: Record<FunctionType, string> = {
    'it-infrastructure': `Hi! I'm here to help with **IT Infrastructure** automation.

ArqAI automates incident response, deployments, and infrastructure—with enterprise governance.

Ask me about **ROI**, **integrations**, **security**, or **how it works**.`,

    'revenue-operations': `Hi! I'm here to help with **Revenue Operations** automation.

ArqAI automates CRM, pipeline, and forecasting—with full audit trails.

Ask me about **ROI**, **Salesforce integration**, or **deployment**.`,

    'customer-success': `Hi! I'm here to help with **Customer Success** automation.

ArqAI automates tickets, health scoring, and engagement—while maintaining quality.

Ask me about **automation rates**, **integrations**, or **compliance**.`,

    'demand-generation': `Hi! I'm here to help with **Demand Generation** automation.

ArqAI automates campaigns, lead scoring, and personalization—with brand guardrails.

Ask me about **results**, **HubSpot/Marketo**, or **ROI**.`,
  }

  return welcomes[functionType]
}

function getContinuationResponse(functionType: FunctionType, messageCount: number): string {
  const functionName = formatFunction(functionType)

  // After several exchanges, prompt for contact
  if (messageCount >= 6) {
    return `I'd love to share more specifics for your situation.

What's your work email? I can send you:
• Detailed ROI calculator
• Architecture whitepaper
• Customer case studies

Or we can set up a quick call with our team.`
  }

  const continuations = [
    `For **${functionName}**, customers typically see:

• **30-40%** cost reduction
• **85%** automation rate
• **Zero** compliance violations

Want to explore ROI, architecture, or case studies?`,

    `What makes us unique:

• **30 days** to production
• **3 patents** on governance tech
• **Zero churn** to date

Technology, outcomes, or integrations—what's your priority?`,

    `I can dive into:

• **Technical** — Our patented architecture
• **Business** — ROI and case studies
• **Practical** — Timeline and integrations

What's most useful for you?`,
  ]

  return continuations[Math.floor(Math.random() * continuations.length)]
}

function getLeadCaptureResponse(functionType: FunctionType): string {
  const functionName = formatFunction(functionType)

  return `This has been a great conversation about **${functionName}**!

To send you personalized materials and set up a deeper dive:

**What's your work email?**

I'll have our team reach out with:
• Custom ROI analysis
• Relevant case studies
• Architecture overview`
}

function getDefaultResponse(functionType: FunctionType, messageCount: number): string {
  const functionName = formatFunction(functionType)

  // After several exchanges, nudge toward contact
  if (messageCount >= 6) {
    return `Happy to explore any aspect of **${functionName}** further.

For detailed materials, what's your work email? Or ask me about ROI, security, or integrations.`
  }

  const defaults: Record<FunctionType, string> = {
    'it-infrastructure': `For **IT Infrastructure**, we handle:

• Incident response (85% MTTR reduction)
• CI/CD with compliance
• Infrastructure monitoring

What's your biggest challenge?`,

    'revenue-operations': `For **Revenue Ops**, we automate:

• CRM data quality
• Pipeline forecasting
• Cross-system sync

What's your current pain point?`,

    'customer-success': `For **Customer Success**, we deliver:

• 70% tier-1 auto-resolution
• Health scoring
• Smart escalation

What matters most to you?`,

    'demand-generation': `For **Demand Gen**, we enable:

• 50% faster campaigns
• AI lead scoring
• Brand-safe personalization

What's your focus area?`,
  }

  return defaults[functionType]
}

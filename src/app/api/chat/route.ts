import { NextRequest, NextResponse } from 'next/server'
import type { TextBlock } from '@anthropic-ai/sdk/resources/messages'
import { getAnthropicClient, parseAssistantResponse, shouldCaptureLead } from '@/lib/claude'
import { getSystemPrompt, detectUserRole, detectPainPoint } from '@/lib/agent-prompts'
import { analyzeMessageForBlocks, generateBlockData, shouldShowBlock } from '@/lib/block-triggers'
import { detectIntents, detectConversationIntents } from '@/lib/intent-detection'
import type { FunctionType, Message, BlockType, ContentBlock } from '@/types'
import type { FunctionContext } from '@/lib/rag'
import type { ConversationTopic } from '@/stores/conversation-store'

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

    // Detect intents from the conversation for dynamic content
    const messageIntent = detectIntents(latestMessage.content)
    const conversationIntent = detectConversationIntents(
      claudeMessages.map(m => ({ role: m.role, content: m.content }))
    )

    // Combine intents - prioritize current message but include conversation context
    const allTopics = [...messageIntent.topics, ...conversationIntent.topics]
    const uniqueTopics = allTopics.filter((topic, index) => allTopics.indexOf(topic) === index)
    const detectedTopics: ConversationTopic[] = uniqueTopics.slice(0, 4)

    const highlightBlock = messageIntent.highlightBlock || conversationIntent.highlightBlock

    console.log('[Intent] Detected topics:', detectedTopics, 'Highlight:', highlightBlock)

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
        // Dynamic content data
        detectedTopics,
        highlightBlock,
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
      system: finalSystemPrompt + `

IMPORTANT RULES:
1. Keep responses concise (under 100 words).
2. Use bullet points and bold text for structure.
3. When user wants to schedule a meeting or connect with sales, ONLY ask for their name first. Wait for their response before asking for email.
4. Ask ONE question at a time. Never ask multiple qualifying questions in one message.
5. After getting their name, ask for work email.
6. After getting email, thank them and say the team will reach out.
7. Be conversational, not interrogative.`,
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
      // Dynamic content data
      detectedTopics,
      highlightBlock,
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

  // Detect if this looks like a name (short response, no common keywords)
  const looksLikeName = userMessage.length < 30 &&
    !lowerMessage.includes('?') &&
    !lowerMessage.includes('what') &&
    !lowerMessage.includes('how') &&
    !lowerMessage.includes('yes') &&
    !lowerMessage.includes('no') &&
    /^[a-zA-Z\s]+$/.test(userMessage.trim()) &&
    userMessage.split(' ').length <= 3

  // Detect if this looks like an email
  const looksLikeEmail = lowerMessage.includes('@') && lowerMessage.includes('.')

  // If they just gave us an email
  if (looksLikeEmail) {
    const name = userMessage.match(/^(\w+)/)?.[1] || ''
    return `Thanks${name ? `, ${name}` : ''}! I've got your email.

Our team will reach out within 24 hours with:
• Personalized demo scheduling link
• ROI calculator customized to your use case

One quick question—**what's your main goal** with AI automation?`
  }

  // If they just gave us a name (after being asked)
  if (looksLikeName && messageCount > 2) {
    const name = userMessage.trim().split(' ')[0]
    return `Nice to meet you, **${name}**!

What's your **work email**? I'll send over some materials and have our team reach out to schedule a call.`
  }

  // After 5 exchanges, ask for name/email naturally
  if (messageCount >= 6) {
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

  // Use cases / customers / case study - REFERENCE THE LEFT PANEL
  if (lowerMessage.includes('use case') || lowerMessage.includes('customer') || lowerMessage.includes('example') || lowerMessage.includes('case stud') || lowerMessage.includes('results') || lowerMessage.includes('show')) {
    return `I've highlighted a **Case Study** on the left panel for you.

This shows a **40% reduction** in manual work for a financial services client.

By the way, what's your name? I'd love to personalize this conversation!`
  }

  // ROI / pricing questions - REFERENCE THE CALCULATOR
  if (lowerMessage.includes('roi') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('save') || lowerMessage.includes('money')) {
    return `Check out the **ROI Calculator** on the left—you can input your own numbers!

Typical results: **30-40% cost reduction** in 90 days.

What's your name? I can customize the analysis for you.`
  }

  // Security questions - REFERENCE SECURITY REVIEW
  if (lowerMessage.includes('security') || lowerMessage.includes('compliance') || lowerMessage.includes('soc') || lowerMessage.includes('hipaa') || lowerMessage.includes('gdpr')) {
    return `I've brought up the **Security & Compliance** section on the left.

We're SOC 2 ready with HIPAA and GDPR capabilities.

What compliance requirements does your organization have?`
  }

  // Architecture / technical questions - REFERENCE ARCHITECTURE
  if (lowerMessage.includes('architecture') || lowerMessage.includes('how does') || lowerMessage.includes('technical') || lowerMessage.includes('patent') || lowerMessage.includes('work')) {
    return `The **Architecture Diagram** on the left shows our three patented technologies.

Our Trust-Aware Orchestration™ is what makes us production-ready from day one.

Would you like me to explain any specific component?`
  }

  // Integration questions - REFERENCE INTEGRATION CHECKLIST
  if (lowerMessage.includes('integrate') || lowerMessage.includes('connect') || lowerMessage.includes('salesforce') || lowerMessage.includes('servicenow') || lowerMessage.includes('stack')) {
    return `The **Integration Checklist** on the left shows our pre-built connectors.

Most integrations take **less than a day** to set up.

What tools are in your current stack?`
  }

  // Timeline questions - REFERENCE TIMELINE
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('deploy') || lowerMessage.includes('30 day') || lowerMessage.includes('start')) {
    return `Check the **Deployment Timeline** on the left—we do 30 days from contract to production.

Week 1 is discovery, Weeks 2-3 are integration, Week 4 is go-live.

What's driving your timeline?`
  }

  // Demo / video questions
  if (lowerMessage.includes('demo') || lowerMessage.includes('video') || lowerMessage.includes('see it') || lowerMessage.includes('watch')) {
    return `I've highlighted the **Product Demo** on the left for you.

This shows the governance controls in action.

Want me to schedule a live walkthrough with our team?`
  }

  // Competitor questions - REFERENCE COMPARISON
  if (lowerMessage.includes('vs') || lowerMessage.includes('compare') || lowerMessage.includes('zapier') || lowerMessage.includes('langchain') || lowerMessage.includes('different')) {
    return `The **Comparison Table** on the left shows how we stack up.

Key difference: governance-first architecture with three patents.

What alternatives are you considering?`
  }

  // Contact / meeting / schedule questions - ASK ONE QUESTION AT A TIME
  if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('call') || lowerMessage.includes('meeting') || lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('connect')) {
    return `Absolutely! I'd love to connect you with our team.

First, **what's your name?**`
  }

  // What is ArqAI / help
  if (lowerMessage.includes('what is') || lowerMessage.includes('arqai') || lowerMessage.includes('explain') || lowerMessage.includes('help') || lowerMessage.includes('can you')) {
    return `**ArqAI** deploys AI agents that enterprises trust in production.

Browse the content on the left—I'll highlight the most relevant sections as we chat.

What would you like to explore first?`
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

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

    // Call Claude API
    const client = getAnthropicClient()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: finalSystemPrompt,
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

  // FIRST MESSAGE - Welcome based on function
  if (messageCount <= 1) {
    return getWelcomeResponse(functionType, userRole)
  }

  // Handle very short or vague responses
  if (lowerMessage.length < 15 || lowerMessage.includes('tell me') || lowerMessage.includes('go on') || lowerMessage.includes('continue') || lowerMessage.includes('more') || lowerMessage.includes('yes') || lowerMessage.includes('sure')) {
    return getContinuationResponse(functionType, userRole)
  }

  // Help / how can you help questions
  if (lowerMessage.includes('help') || lowerMessage.includes('can you') || lowerMessage.includes('what can')) {
    return `Absolutely! For **${functionName}**, I can help you understand:

**🎯 Specific Solutions**: How ArqAI automates ${functionName.toLowerCase()} workflows with full governance

**💰 ROI & Value**: Typical results our customers see (30-40% cost reduction, 85% automation rates)

**🔒 Security & Compliance**: Our SOC 2, HIPAA, GDPR capabilities

**🏗️ Architecture**: Our three patented technologies that make this possible

**📅 Implementation**: Our 30-day deployment methodology

What's most important to you right now? I can dive deep into any of these areas.`
  }

  // Marketing-specific questions (even on wrong page)
  if (lowerMessage.includes('marketing') || lowerMessage.includes('demand') || lowerMessage.includes('campaign') || lowerMessage.includes('lead gen')) {
    return `Great question about marketing automation! ArqAI's **Autonomous Demand Generation** solution helps with:

**Campaign Automation**: Multi-channel orchestration with brand guardrails
**Lead Qualification**: AI-powered scoring that routes to the right rep
**Content Personalization**: Dynamic content at scale while maintaining brand compliance
**Attribution**: Full-funnel tracking with explainable AI

Our customers typically see **50% faster campaign launches** and **35% improvement in conversion rates**.

Would you like to explore this vertical specifically? I can show you how it integrates with HubSpot, Marketo, or your existing marketing stack.`
  }

  // Use cases / customers / proof questions
  if (lowerMessage.includes('use case') || lowerMessage.includes('customer') || lowerMessage.includes('solved') || lowerMessage.includes('who uses') || lowerMessage.includes('example') || lowerMessage.includes('case stud') || lowerMessage.includes('proof') || lowerMessage.includes('results')) {
    return `Great question! ArqAI is currently deployed across **12 enterprise customers** with **$500K ARR** and zero churn. Here are some specific examples:

**Finance Sector**: A Fortune 500 bank automated their incident response workflow, reducing MTTR from 4 hours to 18 minutes while maintaining full audit compliance for Fed SR 11-7.

**Healthcare**: A major health system uses our agents to automate patient data workflows, achieving HIPAA compliance with cryptographic audit trails.

**Telecom**: One of the largest carriers automated their network operations, handling 85% of routine incidents autonomously.

We've also expanded into **Retail**, **Manufacturing**, and **Real Estate**. Each deployment follows our **30-day production** methodology.

What industry are you in? I can share more relevant examples.`
  }

  // Contact / speak to someone questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('talk to') || lowerMessage.includes('demo') || lowerMessage.includes('call') || lowerMessage.includes('meeting')) {
    return `I'd be happy to connect you with our team! Here's how we can help:

**For Technical Deep-Dives**: Our Solutions Architects can walk through the architecture and integration specifics for your stack.

**For Business Discussions**: Our VP of Client Success can discuss ROI, deployment timelines, and customer references.

**For Security Reviews**: We can arrange a call with our security team to discuss compliance requirements (SOC 2, HIPAA, GDPR, etc.).

To get you connected, could you share:
1. Your email address
2. Your role/company (helps us match you with the right person)

Or if you prefer, you can book directly at **demo.thearq.ai**. What works best for you?`
  }

  // ROI-related questions
  if (lowerMessage.includes('roi') || lowerMessage.includes('cost') || lowerMessage.includes('save') || lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('budget')) {
    return `Great question about ROI! Based on our customer data for ${formatFunction(functionType)}, organizations typically see:

**30-40% reduction** in operational costs within the first 90 days
**50%+ improvement** in response times
**85% automation rate** for routine tasks

Our customers achieve **positive ROI within the first quarter**. Pricing is customized based on scope, but we focus on outcomes—you pay for value delivered, not seats or API calls.

${userRole ? `As a ${userRole}, ` : ''}would you like me to walk through a personalized ROI calculation? I can factor in your team size, current tooling, and specific workflows.`
  }

  // Security-related questions
  if (lowerMessage.includes('security') || lowerMessage.includes('compliance') || lowerMessage.includes('soc') || lowerMessage.includes('hipaa') || lowerMessage.includes('gdpr') || lowerMessage.includes('audit')) {
    return `Security and governance are foundational to ArqAI—it's literally in our name. Here's what sets us apart:

**Certifications & Compliance**:
• SOC 2 Type II (in progress, expected Q2 2026)
• HIPAA compliant architecture
• GDPR ready with data residency options
• FedRAMP-ready architecture
• Supports Colorado AI Act and EU AI Act requirements

**Security Architecture**:
• Zero-trust architecture with end-to-end encryption
• Cryptographic audit trails (one of our 3 patents)
• Capability tokens for least-privilege access
• We never train on customer data

**For Your Auditors**: We generate automated compliance evidence and audit reports. Would you like to see our security documentation or schedule a call with our security team?`
  }

  // Architecture / how it works questions
  if (lowerMessage.includes('architecture') || lowerMessage.includes('how does it work') || lowerMessage.includes('technical') || lowerMessage.includes('patent') || lowerMessage.includes('technology')) {
    return `ArqAI's architecture is built on **three patented innovations** that differentiate us from tools like Zapier or LangChain:

**1. Trust-Aware Agent Orchestration™**
Risk-scores every action before execution. If risk exceeds threshold, it escalates to humans. Every action generates an auditable evidence packet.

**2. Compliance-Aware Prompt Compiler™**
Validates AI responses against your policy rules before they reach users. Prevents hallucinations and ensures brand/regulatory compliance.

**3. Observability-Driven Adaptive RAG™**
Closed-loop system that detects knowledge drift and automatically updates. Unlike static RAG, our system improves over time.

For ${formatFunction(functionType)}, this means agents that are **production-ready from day one**, not endless pilots. Want me to show you the architecture diagram?`
  }

  // Integration questions
  if (lowerMessage.includes('integrate') || lowerMessage.includes('connect') || lowerMessage.includes('salesforce') || lowerMessage.includes('servicenow') || lowerMessage.includes('stack') || lowerMessage.includes('tool')) {
    return `We're designed to be **integration-first**. ArqAI connects to your existing stack without rip-and-replace:

${getIntegrationList(functionType)}

**Key Differentiators**:
• **Cloud agnostic**: AWS, Azure, GCP, or on-prem
• **Model agnostic**: Works with OpenAI, Anthropic, Llama, or your custom models
• **Vertical agnostic**: Adapts to Finance, Healthcare, Retail, Manufacturing, etc.

Each integration typically takes **less than a day** to configure. What's in your current stack? I can give you specific compatibility details.`
  }

  // Timeline / deployment questions
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('deploy') || lowerMessage.includes('implement') || lowerMessage.includes('30 day')) {
    return `Our **30-day deployment** isn't marketing—it's our standard methodology. Here's how:

**Week 1: Blueprint**
• Discovery workshop with your team
• Integration mapping
• Workflow identification

**Week 2-3: Wire In**
• Connect to your systems
• Configure agents and policies
• Set up governance rules

**Week 4: Ship**
• User acceptance testing
• Go-live with monitoring
• Optimization based on real usage

${userRole === 'CTO' || userRole === 'CIO' ? 'Your engineering team will have full visibility throughout, but we handle the implementation burden.' : 'We assign a dedicated success manager to ensure smooth deployment.'}

This is how we've achieved **zero churn** and **100% expansion** with our customers. Ready to see a detailed timeline for your organization?`
  }

  // Competitor comparison questions
  if (lowerMessage.includes('vs') || lowerMessage.includes('versus') || lowerMessage.includes('compare') || lowerMessage.includes('competitor') || lowerMessage.includes('zapier') || lowerMessage.includes('langchain') || lowerMessage.includes('make.com')) {
    return `Great question! Here's how ArqAI compares to common alternatives:

**vs. Zapier/Make.com**:
They're great for simple workflows, but lack governance, audit trails, and can't handle complex multi-step reasoning. ArqAI is built for enterprise-grade automation.

**vs. LangChain/LlamaIndex**:
These are developer frameworks—you still need to build and maintain the infrastructure. ArqAI is a complete platform with governance built-in, not bolted-on.

**vs. ServiceNow AI/Salesforce Einstein**:
Vendor-locked solutions that only work within their ecosystem. ArqAI is stack-agnostic and integrates across all your tools.

**Our Unique Advantage**: We're the only platform with **governance-by-design**—three patents specifically protecting the trust, compliance, and observability layers. Would you like to see a detailed feature comparison?`
  }

  // What is ArqAI / introduction questions
  if (lowerMessage.includes('what is') || lowerMessage.includes('tell me about') || lowerMessage.includes('arqai') || lowerMessage.includes('explain') || lowerMessage.includes('overview')) {
    return `**ArqAI** is the AI Agent Platform that enterprises trust to run in production.

Here's the problem we solve: **87% of enterprise AI pilots never make it to production**. Why? Lack of governance, compliance concerns, and the "black box" problem.

**What We Do**:
We provide governed AI agents that automate complex workflows—from IT operations to sales to customer success—with full audit trails, compliance controls, and human oversight built in.

**Why We're Different**:
• **Three patents** protecting our trust, compliance, and observability technology
• **30 days to production**, not quarters
• **Zero customer churn** since launch
• Built by the team behind ACI InfoTech (20+ years of Fortune 500 delivery)

For ${formatFunction(functionType)} specifically, our agents can handle sophisticated automation while maintaining the governance your enterprise requires. What would you like to explore first—architecture, use cases, or ROI?`
  }

  // Default response - make it specific to the function
  const functionSpecificIntro: Record<FunctionType, string> = {
    'it-infrastructure': `For IT Infrastructure automation, ArqAI agents can autonomously handle:

• **Incident Response**: Auto-triage, escalate, and resolve common issues
• **Deployment Automation**: CI/CD with compliance checks built-in
• **Infrastructure Management**: Monitoring, alerting, and remediation
• **Change Management**: Risk-scored approvals with audit trails`,
    'revenue-operations': `For Revenue Operations, ArqAI agents streamline your entire pipeline:

• **CRM Automation**: Data entry, enrichment, and hygiene
• **Pipeline Management**: Forecasting, alerts, and opportunity scoring
• **Sales Enablement**: Automated outreach, follow-ups, and reporting
• **Cross-System Sync**: Keep Salesforce, HubSpot, and your tools in sync`,
    'customer-success': `For Customer Success, ArqAI agents deliver exceptional experiences:

• **Ticket Automation**: Smart routing, auto-responses, and resolution
• **Onboarding**: Guided workflows and proactive engagement
• **Health Scoring**: Real-time customer health monitoring
• **Escalation**: Intelligent human handoff when needed`,
    'demand-generation': `For Demand Generation, ArqAI agents scale your marketing:

• **Lead Qualification**: AI-powered scoring and routing
• **Campaign Automation**: Multi-channel orchestration
• **Content Personalization**: Dynamic content at scale
• **Attribution**: Full-funnel tracking and optimization`
  }

  return `${functionSpecificIntro[functionType]}

All of this with **full governance**: audit trails, compliance controls, and human oversight.

What would you like to explore? I can show you:
• **ROI potential** for your specific situation
• **Case studies** from similar organizations
• **Architecture** and how it integrates with your stack
• **Security & compliance** capabilities

What matters most to you right now?`
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

function getWelcomeResponse(functionType: FunctionType, userRole: string | null): string {
  const functionName = formatFunction(functionType)
  const roleGreeting = userRole ? `As a ${userRole}, you'll appreciate that ` : ''

  const welcomes: Record<FunctionType, string> = {
    'it-infrastructure': `Welcome! I'm here to help you explore **Autonomous IT Infrastructure** solutions.

${roleGreeting}ArqAI can automate incident response, deployment pipelines, and infrastructure management—all with enterprise-grade governance.

**What would you like to know?**
• How we reduce MTTR by 85%
• Our integration with ServiceNow, PagerDuty, Jira
• The 30-day deployment methodology
• Security and compliance (SOC 2, HIPAA)

Just ask anything—I'm here to help!`,

    'revenue-operations': `Welcome! I'm here to help you explore **Autonomous Revenue Operations**.

${roleGreeting}ArqAI can automate your entire revenue pipeline—from lead scoring to forecasting to CRM hygiene—with full audit trails.

**What would you like to know?**
• How we improve sales productivity by 30%
• Integration with Salesforce, HubSpot, Outreach
• Our AI-powered pipeline management
• Compliance and data governance

What's on your mind?`,

    'customer-success': `Welcome! I'm here to help you explore **Autonomous Customer Success** solutions.

${roleGreeting}ArqAI can automate ticket resolution, customer health scoring, and proactive engagement—while maintaining service quality.

**What would you like to know?**
• How we achieve 70% tier-1 auto-resolution
• Integration with Zendesk, Intercom, Gainsight
• Our intelligent escalation system
• Maintaining CSAT while automating

How can I help you today?`,

    'demand-generation': `Welcome! I'm here to help you explore **Autonomous Demand Generation**.

${roleGreeting}ArqAI can automate campaign execution, lead qualification, and content personalization—all within brand and compliance guardrails.

**What would you like to know?**
• How we achieve 50% faster campaign launches
• Integration with HubSpot, Marketo, 6sense
• AI-powered lead scoring
• Brand safety and compliance controls

What interests you most?`,
  }

  return welcomes[functionType]
}

function getContinuationResponse(functionType: FunctionType, userRole: string | null): string {
  const functionName = formatFunction(functionType)

  const continuations = [
    `Happy to elaborate! For **${functionName}**, our customers typically see:

• **30-40% cost reduction** within 90 days
• **85% automation rate** for routine tasks
• **Zero compliance violations** with built-in governance

The key is our **three patented technologies** that make AI agents production-ready. Would you like me to explain our architecture, share customer examples, or discuss ROI for your specific situation?`,

    `Of course! Let me share what makes ArqAI unique for **${functionName}**:

**Speed**: 30 days to production, not quarters
**Trust**: Three patents protecting governance, compliance, and observability
**Results**: 12 customers, $500K ARR, zero churn

What aspect interests you most—the technology, the business outcomes, or how it integrates with your existing stack?`,

    `Absolutely! Here's what I can dive deeper into:

**Technical**: Our Trust-Aware Agent Orchestration™, Compliance-Aware Prompt Compiler™, and Observability-Driven Adaptive RAG™

**Business**: ROI calculations, customer case studies, competitive comparisons

**Practical**: Integration options, deployment timeline, security requirements

Which would be most valuable for you?`,
  ]

  // Return a random continuation for variety
  return continuations[Math.floor(Math.random() * continuations.length)]
}

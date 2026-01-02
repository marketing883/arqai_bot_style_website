import { NextRequest, NextResponse } from 'next/server'
import type Anthropic from '@anthropic-ai/sdk'
import { getAnthropicClient, parseAssistantResponse, shouldCaptureLead } from '@/lib/claude'
import { getSystemPrompt, detectUserRole, detectPainPoint } from '@/lib/agent-prompts'
import { analyzeMessageForBlocks, generateBlockData, shouldShowBlock } from '@/lib/block-triggers'
import type { FunctionType, Message, BlockType, ContentBlock } from '@/types'

export const runtime = 'edge'

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

    // Build system prompt with context
    const systemPrompt = getSystemPrompt(functionType, {
      userRole,
      painPoints,
      previousBlocks,
      companyName: context.company as string | undefined,
    })

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
      // Return a mock response for development
      return NextResponse.json({
        message: getMockResponse(latestMessage.content, functionType, userRole),
        blocks: blocksToShow,
        detectedRole: userRole,
        painPoints,
        shouldCaptureLead: false,
      })
    }

    // Call Claude API
    const client = getAnthropicClient()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: enhancedSystemPrompt,
      messages: claudeMessages,
    })

    // Extract text content from response
    const textContent = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
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
  userRole: string | null
): string {
  const lowerMessage = userMessage.toLowerCase()

  // ROI-related questions
  if (lowerMessage.includes('roi') || lowerMessage.includes('cost') || lowerMessage.includes('save')) {
    return `Great question about ROI! Based on our customer data for ${formatFunction(functionType)}, organizations typically see:

**30-40% reduction** in operational costs within the first 90 days
**50%+ improvement** in response times
**85% automation rate** for routine tasks

${userRole ? `As a ${userRole}, you'll particularly appreciate that ` : ''}our platform pays for itself within the first quarter. Would you like me to walk through a personalized ROI calculation based on your specific metrics?`
  }

  // Security-related questions
  if (lowerMessage.includes('security') || lowerMessage.includes('compliance') || lowerMessage.includes('soc')) {
    return `Security is foundational to everything we do at ArqAI. Here's what sets us apart:

**SOC 2 Type II** certified with annual audits
**HIPAA compliant** for healthcare deployments
**GDPR ready** with data residency options
**Zero-trust architecture** with end-to-end encryption

We never train on customer data, and all processing happens in isolated environments. Would you like to see our security documentation or speak with our CISO?`
  }

  // Architecture questions
  if (lowerMessage.includes('architecture') || lowerMessage.includes('how does it work') || lowerMessage.includes('technical')) {
    return `ArqAI's architecture is built on three patented innovations:

1. **Semantic Action Graph** - Maps your business processes as executable workflows
2. **Context-Aware Reasoning** - Maintains state across complex, multi-step operations
3. **Adaptive Learning Layer** - Improves accuracy based on your specific domain

For ${formatFunction(functionType)}, this means we can handle sophisticated automation that other tools simply can't. Want me to show you a detailed architecture diagram?`
  }

  // Integration questions
  if (lowerMessage.includes('integrate') || lowerMessage.includes('connect') || lowerMessage.includes('salesforce') || lowerMessage.includes('servicenow')) {
    return `We have deep integrations across the enterprise stack. For ${formatFunction(functionType)}, our most popular integrations include:

${getIntegrationList(functionType)}

Each integration takes **less than a day** to configure, and we handle the heavy lifting. What tools are in your current stack?`
  }

  // Timeline questions
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('deploy') || lowerMessage.includes('implement')) {
    return `Our implementation timeline is aggressive by design—we get you to production in **30 days or less**. Here's how:

**Week 1**: Discovery & integration setup
**Week 2**: Configuration & workflow mapping
**Week 3**: Testing & refinement
**Week 4**: Go-live & optimization

${userRole === 'CTO' || userRole === 'CIO' ? 'Your engineering team will have full visibility throughout, but we handle the implementation burden.' : 'We assign a dedicated success manager to ensure smooth deployment.'}

Ready to see a detailed timeline for your organization?`
  }

  // Default response
  return `Thanks for your interest in ArqAI for ${formatFunction(functionType)}!

I'm here to help you understand how we can automate and optimize your operations. ${userRole ? `As a ${userRole}, ` : ''}you might be interested in:

• **ROI potential** - Most customers see 40%+ cost reduction
• **Security posture** - SOC 2, HIPAA, GDPR ready
• **Quick deployment** - 30 days to production

What aspect would you like to explore first?`
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

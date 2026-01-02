import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
// Note: Will use ANTHROPIC_API_KEY from environment variables
let anthropicClient: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set')
    }

    anthropicClient = new Anthropic({
      apiKey,
    })
  }

  return anthropicClient
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  functionType: string
  systemPrompt?: string
}

export interface ChatResponse {
  content: string
  blocks?: {
    type: string
    data: Record<string, unknown>
  }[]
  shouldCaptureLead?: boolean
  captureFields?: string[]
}

// Parse assistant response to extract block commands
export function parseAssistantResponse(content: string): {
  text: string
  blocks: { type: string; data: Record<string, unknown> }[]
} {
  const blocks: { type: string; data: Record<string, unknown> }[] = []
  let text = content

  // Look for block commands in format: [BLOCK:type:data]
  const blockPattern = /\[BLOCK:(\w+[-\w]*):(\{[^}]+\})\]/g
  let match

  while ((match = blockPattern.exec(content)) !== null) {
    try {
      const blockType = match[1]
      const blockData = JSON.parse(match[2])
      blocks.push({ type: blockType, data: blockData })
      text = text.replace(match[0], '')
    } catch {
      // Invalid JSON, skip this block
    }
  }

  // Also support simpler format: [SHOW:type]
  const simplePattern = /\[SHOW:(\w+[-\w]*)\]/g
  while ((match = simplePattern.exec(content)) !== null) {
    const blockType = match[1]
    blocks.push({ type: blockType, data: {} })
    text = text.replace(match[0], '')
  }

  return {
    text: text.trim(),
    blocks,
  }
}

// Check if response indicates lead capture should happen
export function shouldCaptureLead(content: string, messageCount: number): {
  should: boolean
  fields: string[]
} {
  const lowerContent = content.toLowerCase()

  // Trigger lead capture after certain conditions
  const triggers = [
    'send you',
    'email you',
    'share with you',
    'get in touch',
    'schedule',
    'contact you',
    'follow up',
  ]

  const shouldCapture =
    messageCount >= 5 ||
    triggers.some((trigger) => lowerContent.includes(trigger))

  const fields: string[] = []
  if (shouldCapture) {
    fields.push('name', 'email')
    if (messageCount >= 7) {
      fields.push('company', 'title')
    }
  }

  return { should: shouldCapture, fields }
}

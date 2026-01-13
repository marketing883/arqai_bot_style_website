import type { ConversationTopic } from '@/stores/conversation-store'
import type { BlockType } from '@/types'

// Keyword patterns for each topic
const topicKeywords: Record<ConversationTopic, string[]> = {
  'roi': [
    'roi', 'return', 'investment', 'cost', 'save', 'saving', 'money', 'budget',
    'price', 'pricing', 'expensive', 'cheap', 'afford', 'value', 'worth',
    'payback', 'benefit', 'gain', 'profit', 'reduce', 'reduction', 'efficiency'
  ],
  'security': [
    'security', 'secure', 'safe', 'compliance', 'compliant', 'soc', 'hipaa',
    'gdpr', 'encrypt', 'encryption', 'audit', 'privacy', 'protect', 'risk',
    'vulnerability', 'threat', 'breach', 'certificate', 'trust', 'permission'
  ],
  'integration': [
    'integrate', 'integration', 'connect', 'api', 'webhook', 'sync', 'import',
    'export', 'salesforce', 'servicenow', 'jira', 'slack', 'zendesk', 'hubspot',
    'marketo', 'pagerduty', 'teams', 'plugin', 'connector', 'compatible', 'stack'
  ],
  'architecture': [
    'architecture', 'architect', 'design', 'diagram', 'technical', 'tech',
    'how does', 'how it works', 'under the hood', 'system', 'infrastructure',
    'patent', 'engine', 'platform', 'framework', 'component', 'module'
  ],
  'timeline': [
    'timeline', 'time', 'long', 'deploy', 'deployment', 'implement', 'implementation',
    'start', 'begin', 'launch', 'go live', 'production', 'schedule', 'week',
    'month', 'day', '30 day', 'onboard', 'onboarding', 'setup', 'install'
  ],
  'case-study': [
    'case study', 'case-study', 'customer', 'client', 'example', 'story',
    'success', 'result', 'outcome', 'testimonial', 'reference', 'who uses',
    'enterprise', 'company', 'industry', 'use case', 'real world'
  ],
  'demo': [
    'demo', 'demonstration', 'show', 'see', 'watch', 'video', 'live',
    'preview', 'trial', 'test', 'try', 'hands on', 'walkthrough', 'tour'
  ],
  'pricing': [
    'price', 'pricing', 'cost', 'fee', 'subscription', 'license', 'pay',
    'payment', 'plan', 'tier', 'enterprise', 'quote', 'proposal', 'contract'
  ],
  'comparison': [
    'compare', 'comparison', 'vs', 'versus', 'alternative', 'competitor',
    'different', 'difference', 'better', 'worse', 'zapier', 'make', 'langchain',
    'other', 'option', 'choice'
  ],
  'general': [
    'what is', 'tell me', 'explain', 'help', 'arqai', 'hello', 'hi', 'hey'
  ]
}

// Map topics to their primary block type for highlighting
const topicHighlightBlock: Record<ConversationTopic, BlockType> = {
  'roi': 'roi-calculator',
  'security': 'security-review',
  'integration': 'integration-checklist',
  'architecture': 'architecture-diagram',
  'timeline': 'deployment-timeline',
  'case-study': 'case-study',
  'demo': 'demo-video',
  'pricing': 'roi-calculator',
  'comparison': 'comparison-table',
  'general': 'roi-calculator'
}

export interface IntentResult {
  topics: ConversationTopic[]
  primaryTopic: ConversationTopic
  highlightBlock: BlockType | null
  confidence: number
}

/**
 * Detect intents/topics from a user message
 */
export function detectIntents(message: string): IntentResult {
  const lowerMessage = message.toLowerCase()
  const detectedTopics: { topic: ConversationTopic; score: number }[] = []

  // Check each topic's keywords
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    let score = 0
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        // Boost score for exact matches or phrase matches
        if (keyword.includes(' ')) {
          score += 3 // Multi-word phrases are more specific
        } else {
          score += 1
        }
      }
    }
    if (score > 0) {
      detectedTopics.push({ topic: topic as ConversationTopic, score })
    }
  }

  // Sort by score
  detectedTopics.sort((a, b) => b.score - a.score)

  // If no specific topics detected, default to general
  if (detectedTopics.length === 0) {
    return {
      topics: ['general'],
      primaryTopic: 'general',
      highlightBlock: null,
      confidence: 0.3
    }
  }

  // Take top topics (those with score >= 50% of max score)
  const maxScore = detectedTopics[0].score
  const significantTopics = detectedTopics
    .filter(t => t.score >= maxScore * 0.5)
    .map(t => t.topic)
    .slice(0, 3) // Max 3 topics

  const primaryTopic = detectedTopics[0].topic
  const confidence = Math.min(maxScore / 5, 1) // Normalize to 0-1

  return {
    topics: significantTopics,
    primaryTopic,
    highlightBlock: confidence > 0.4 ? topicHighlightBlock[primaryTopic] : null,
    confidence
  }
}

/**
 * Detect intents from a full conversation history
 * Gives more weight to recent messages
 */
export function detectConversationIntents(
  messages: { role: string; content: string }[]
): IntentResult {
  const topicScores: Record<ConversationTopic, number> = {
    'roi': 0,
    'security': 0,
    'integration': 0,
    'architecture': 0,
    'timeline': 0,
    'case-study': 0,
    'demo': 0,
    'pricing': 0,
    'comparison': 0,
    'general': 0.5 // Small baseline for general
  }

  // Analyze each message, giving more weight to recent ones
  const userMessages = messages.filter(m => m.role === 'user')
  userMessages.forEach((msg, index) => {
    const weight = 0.5 + (index / userMessages.length) * 0.5 // 0.5 to 1.0
    const result = detectIntents(msg.content)

    result.topics.forEach(topic => {
      topicScores[topic] += result.confidence * weight * 2
    })
  })

  // Find top topics
  const sortedTopics = Object.entries(topicScores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0.5)
    .map(([topic]) => topic as ConversationTopic)

  if (sortedTopics.length === 0) {
    sortedTopics.push('general')
  }

  const primaryTopic = sortedTopics[0]
  const maxScore = topicScores[primaryTopic]

  return {
    topics: sortedTopics.slice(0, 3),
    primaryTopic,
    highlightBlock: maxScore > 1 ? topicHighlightBlock[primaryTopic] : null,
    confidence: Math.min(maxScore / 3, 1)
  }
}

/**
 * Get suggested follow-up topics based on current conversation
 */
export function getSuggestedTopics(
  currentTopics: ConversationTopic[]
): ConversationTopic[] {
  const topicFlow: Record<ConversationTopic, ConversationTopic[]> = {
    'general': ['roi', 'case-study', 'demo'],
    'roi': ['case-study', 'pricing', 'timeline'],
    'security': ['architecture', 'case-study', 'integration'],
    'integration': ['timeline', 'architecture', 'demo'],
    'architecture': ['security', 'integration', 'timeline'],
    'timeline': ['pricing', 'demo', 'case-study'],
    'case-study': ['roi', 'demo', 'integration'],
    'demo': ['timeline', 'pricing', 'case-study'],
    'pricing': ['roi', 'comparison', 'timeline'],
    'comparison': ['case-study', 'demo', 'roi']
  }

  const suggestions = new Set<ConversationTopic>()

  for (const topic of currentTopics) {
    const nextTopics = topicFlow[topic] || []
    nextTopics.forEach(t => {
      if (!currentTopics.includes(t)) {
        suggestions.add(t)
      }
    })
  }

  return Array.from(suggestions).slice(0, 3)
}

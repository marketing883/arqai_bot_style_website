import type { BlockType, FunctionType } from '@/types'

// Block trigger configuration
interface BlockTrigger {
  keywords: string[]
  weight: number
  requiresContext?: string[]
}

// Define triggers for each block type
export const BLOCK_TRIGGERS: Record<BlockType, BlockTrigger> = {
  'roi-calculator': {
    keywords: ['roi', 'cost', 'save', 'budget', 'price', 'expensive', 'worth', 'value', 'return on investment', 'money'],
    weight: 10,
  },
  'demo-video': {
    keywords: ['demo', 'show me', 'see it', 'how does it work', 'video', 'watch', 'demonstration', 'walk through'],
    weight: 8,
  },
  'security-review': {
    keywords: ['security', 'compliance', 'audit', 'soc 2', 'hipaa', 'gdpr', 'secure', 'risk', 'governance', 'policy'],
    weight: 10,
  },
  'architecture-diagram': {
    keywords: ['architecture', 'how it works', 'technical', 'infrastructure', 'system design', 'diagram', 'under the hood'],
    weight: 7,
  },
  'integration-checklist': {
    keywords: ['integrate', 'connect', 'work with', 'compatible', 'api', 'salesforce', 'servicenow', 'zendesk', 'hubspot', 'tech stack'],
    weight: 9,
  },
  'deployment-timeline': {
    keywords: ['timeline', 'how long', 'deploy', 'implement', 'schedule', 'when', 'start', 'go live', 'launch', '30 days'],
    weight: 8,
  },
  'case-study': {
    keywords: ['case study', 'customer', 'example', 'proof', 'reference', 'success story', 'who uses', 'testimonial'],
    weight: 9,
  },
  'live-stats': {
    keywords: ['stats', 'statistics', 'numbers', 'metrics', 'how many', 'growth', 'traction'],
    weight: 5,
  },
  'code-snippet': {
    keywords: ['code', 'api', 'sdk', 'developer', 'technical', 'implementation', 'example code', 'sample'],
    weight: 6,
  },
  'comparison-table': {
    keywords: ['compare', 'vs', 'versus', 'competitor', 'alternative', 'different from', 'zapier', 'langchain', 'servicenow'],
    weight: 9,
  },
}

// Function-specific block recommendations
export const FUNCTION_BLOCK_PREFERENCES: Record<FunctionType, BlockType[]> = {
  'it-infrastructure': ['integration-checklist', 'deployment-timeline', 'security-review', 'case-study'],
  'revenue-operations': ['roi-calculator', 'integration-checklist', 'case-study', 'demo-video'],
  'customer-success': ['demo-video', 'case-study', 'integration-checklist', 'deployment-timeline'],
  'demand-generation': ['roi-calculator', 'case-study', 'comparison-table', 'integration-checklist'],
}

// Role-specific block recommendations
export const ROLE_BLOCK_PREFERENCES: Record<string, BlockType[]> = {
  CEO: ['roi-calculator', 'live-stats', 'case-study'],
  CTO: ['architecture-diagram', 'code-snippet', 'integration-checklist'],
  CISO: ['security-review', 'architecture-diagram', 'case-study'],
  CFO: ['roi-calculator', 'case-study', 'deployment-timeline'],
  CIO: ['integration-checklist', 'deployment-timeline', 'security-review'],
  CMO: ['roi-calculator', 'case-study', 'demo-video'],
}

// Analyze message to determine which blocks might be relevant
export function analyzeMessageForBlocks(
  message: string,
  functionType: FunctionType,
  userRole?: string | null,
  previousBlocks: BlockType[] = []
): BlockType[] {
  const lowerMessage = message.toLowerCase()
  const scores: Record<BlockType, number> = {} as Record<BlockType, number>

  // Score based on keyword matches
  for (const [blockType, trigger] of Object.entries(BLOCK_TRIGGERS)) {
    const matchCount = trigger.keywords.filter((kw) => lowerMessage.includes(kw)).length
    if (matchCount > 0) {
      scores[blockType as BlockType] = matchCount * trigger.weight
    }
  }

  // Boost function-preferred blocks
  const functionPrefs = FUNCTION_BLOCK_PREFERENCES[functionType]
  for (const blockType of functionPrefs) {
    if (scores[blockType]) {
      scores[blockType] *= 1.5
    }
  }

  // Boost role-preferred blocks
  if (userRole && ROLE_BLOCK_PREFERENCES[userRole]) {
    for (const blockType of ROLE_BLOCK_PREFERENCES[userRole]) {
      if (scores[blockType]) {
        scores[blockType] *= 1.3
      }
    }
  }

  // Penalize already-shown blocks
  for (const blockType of previousBlocks) {
    if (scores[blockType]) {
      scores[blockType] *= 0.3
    }
  }

  // Sort by score and return top recommendations
  const sortedBlocks = Object.entries(scores)
    .filter(([_, score]) => score > 5) // Minimum threshold
    .sort(([_, a], [__, b]) => b - a)
    .map(([blockType]) => blockType as BlockType)

  return sortedBlocks.slice(0, 2) // Return max 2 recommendations
}

// Get initial block recommendation for a new conversation
export function getInitialBlockRecommendation(
  functionType: FunctionType
): BlockType | null {
  // For new conversations, start with live stats or demo video
  const functionPrefs = FUNCTION_BLOCK_PREFERENCES[functionType]
  if (functionPrefs.includes('demo-video')) {
    return 'live-stats' // Show stats first, then demo can come later
  }
  return 'live-stats'
}

// Determine if this is a good time to show a block
export function shouldShowBlock(
  messageCount: number,
  lastBlockShownAt: number,
  currentScore: number
): boolean {
  // Don't show blocks on every message
  const messagesSinceLastBlock = messageCount - lastBlockShownAt

  // First block can come early
  if (lastBlockShownAt === 0 && messageCount >= 2) {
    return currentScore > 5
  }

  // After that, space them out
  if (messagesSinceLastBlock >= 3 && currentScore > 10) {
    return true
  }

  // High-relevance blocks can appear sooner
  if (messagesSinceLastBlock >= 2 && currentScore > 20) {
    return true
  }

  return false
}

// Generate block data based on context
export function generateBlockData(
  blockType: BlockType,
  functionType: FunctionType,
  context: Record<string, unknown>
): Record<string, unknown> {
  switch (blockType) {
    case 'roi-calculator':
      return {
        functionType,
        defaultInputs: getDefaultROIInputs(functionType),
      }

    case 'demo-video':
      return {
        videoId: `demo-${functionType}`,
        title: `ArqAI ${formatFunctionName(functionType)} Demo`,
      }

    case 'case-study':
      return {
        industry: context.industry || getDefaultIndustry(functionType),
        functionType,
      }

    case 'comparison-table':
      return {
        functionType,
        competitors: getCompetitors(functionType),
      }

    case 'deployment-timeline':
      return {
        companyName: context.company || 'Your Company',
        functionType,
      }

    case 'integration-checklist':
      return {
        techStack: context.techStack || [],
        functionType,
      }

    default:
      return { functionType }
  }
}

// Helper functions
function getDefaultROIInputs(functionType: FunctionType): Record<string, number> {
  const defaults: Record<FunctionType, Record<string, number>> = {
    'it-infrastructure': { incidents: 100, avgResolutionTime: 4, teamSize: 10 },
    'revenue-operations': { deals: 500, dataEntryHours: 20, teamSize: 15 },
    'customer-success': { tickets: 1000, avgHandleTime: 30, teamSize: 20 },
    'demand-generation': { leads: 5000, qualificationTime: 10, teamSize: 8 },
  }
  return defaults[functionType]
}

function getDefaultIndustry(functionType: FunctionType): string {
  const industries: Record<FunctionType, string> = {
    'it-infrastructure': 'Technology',
    'revenue-operations': 'SaaS',
    'customer-success': 'Financial Services',
    'demand-generation': 'Healthcare',
  }
  return industries[functionType]
}

function getCompetitors(functionType: FunctionType): string[] {
  const competitors: Record<FunctionType, string[]> = {
    'it-infrastructure': ['ServiceNow', 'PagerDuty AI', 'Zapier'],
    'revenue-operations': ['Zapier', 'Make.com', 'Salesforce Einstein'],
    'customer-success': ['Zendesk AI', 'Intercom', 'Ada'],
    'demand-generation': ['HubSpot AI', 'Marketo', '6sense'],
  }
  return competitors[functionType]
}

function formatFunctionName(functionType: FunctionType): string {
  const names: Record<FunctionType, string> = {
    'it-infrastructure': 'IT Infrastructure',
    'revenue-operations': 'Revenue Operations',
    'customer-success': 'Customer Success',
    'demand-generation': 'Demand Generation',
  }
  return names[functionType]
}

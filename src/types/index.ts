// ArqAI CDI Website Type Definitions

// ============================================
// Function Types
// ============================================

export type FunctionType =
  | 'it-infrastructure'
  | 'revenue-operations'
  | 'customer-success'
  | 'demand-generation'

export interface FunctionConfig {
  id: FunctionType
  name: string
  title: string
  description: string
  color: string
  icon: string
}

// ============================================
// Chat & Conversation Types
// ============================================

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  blocks?: ContentBlock[]
}

export interface Conversation {
  id: string
  function: FunctionType
  messages: Message[]
  createdAt: Date
  leadCaptured: boolean
}

// ============================================
// Content Block Types
// ============================================

export type BlockType =
  | 'roi-calculator'
  | 'demo-video'
  | 'security-review'
  | 'architecture-diagram'
  | 'integration-checklist'
  | 'deployment-timeline'
  | 'case-study'
  | 'live-stats'
  | 'code-snippet'
  | 'comparison-table'

export interface ContentBlock {
  id: string
  type: BlockType
  data: Record<string, unknown>
  displayedAt: Date
}

export interface ROICalculatorData {
  inputs: {
    currentCost?: number
    timeSpent?: number
    teamSize?: number
    errorRate?: number
  }
  results?: {
    timeSaved: number
    costSaved: number
    productivityGain: number
    roi: number
  }
}

export interface DemoVideoData {
  videoUrl: string
  title: string
  duration: string
}

export interface SecurityReviewData {
  checklist: {
    category: string
    items: {
      name: string
      checked: boolean
      description: string
    }[]
  }[]
}

export interface CaseStudyData {
  industry: string
  company: string
  quote: string
  metrics: {
    label: string
    value: string
  }[]
  logoUrl?: string
}

export interface ComparisonTableData {
  competitors: string[]
  features: {
    name: string
    arqai: boolean | string
    competitors: (boolean | string)[]
  }[]
}

export interface CodeSnippetData {
  language: string
  code: string
  title: string
  description: string
}

export interface LiveStatsData {
  metrics: {
    label: string
    value: number
    suffix?: string
    prefix?: string
  }[]
}

export interface IntegrationChecklistData {
  techStack: string[]
  checklist: {
    name: string
    status: 'compatible' | 'requires-config' | 'not-supported'
    notes?: string
  }[]
}

export interface DeploymentTimelineData {
  companyName: string
  milestones: {
    week: number
    title: string
    deliverables: string[]
  }[]
}

export interface ArchitectureDiagramData {
  components: {
    id: string
    name: string
    description: string
    position: { x: number; y: number }
  }[]
  connections: {
    from: string
    to: string
    label?: string
  }[]
}

// ============================================
// Lead Types
// ============================================

export type LeadTier = 'hot' | 'warm' | 'cold'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type CompanySize = 'enterprise' | 'mid-market' | 'smb' | 'startup'

export interface Lead {
  id: string
  createdAt: Date
  updatedAt: Date

  // Basic Info (required)
  email: string

  // Basic Info (optional)
  name?: string
  title?: string
  company?: string
  phone?: string
  companySize?: CompanySize

  // Scoring
  score: number
  tier: LeadTier
  status: LeadStatus

  // Context from conversation
  functionType: FunctionType
  blocksViewed?: BlockType[]
  painPoints?: string[]
  conversationLength?: number

  // Additional enrichment (future)
  industry?: string
  techStack?: string[]
  notes?: string
  assignedTo?: string
}

// ============================================
// Team Types
// ============================================

export interface TeamMember {
  id: string
  name: string
  title: string
  bio?: string
  imageUrl: string
  linkedinUrl?: string
  isAdvisor?: boolean
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  label: string
  href?: string
  children?: NavItem[]
}

// ============================================
// API Response Types
// ============================================

export interface ChatResponse {
  message: string
  blocks?: ContentBlock[]
  shouldCaptureLead?: boolean
  captureFields?: ('name' | 'email' | 'company' | 'title')[]
}

export interface LeadsResponse {
  leads: Lead[]
  total: number
  page: number
  pageSize: number
}

// ============================================
// Filter Types
// ============================================

export interface LeadFilters {
  scoreRange?: [number, number]
  tiers?: LeadTier[]
  statuses?: LeadStatus[]
  functionTypes?: FunctionType[]
  dateRange?: [Date, Date]
  search?: string
}

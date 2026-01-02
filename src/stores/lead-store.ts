import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, FunctionType, BlockType, CompanySize } from '@/types'
import { generateId } from '@/lib/utils'

// Input type for creating a new lead (without computed fields)
export interface LeadInput {
  email: string
  name?: string
  title?: string
  company?: string
  phone?: string
  companySize?: CompanySize
  functionType: FunctionType
  blocksViewed?: BlockType[]
  painPoints?: string[]
  conversationLength?: number
  industry?: string
  techStack?: string[]
  notes?: string
}

interface LeadState {
  leads: Lead[]

  // Actions
  addLead: (lead: LeadInput) => Lead
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void
  getLeadById: (id: string) => Lead | undefined
  getLeadsByFunction: (functionType: FunctionType) => Lead[]
  getLeadsByScore: (minScore: number) => Lead[]
  getRecentLeads: (count: number) => Lead[]

  // Bulk operations
  exportLeads: () => string
  clearAllLeads: () => void
}

// Calculate lead score based on various factors
export function calculateLeadScore(lead: Partial<Lead>): number {
  let score = 0

  // Base score for having contact info
  if (lead.email) score += 10
  if (lead.name) score += 5
  if (lead.company) score += 10
  if (lead.title) score += 10
  if (lead.phone) score += 5

  // Score based on title seniority
  const title = (lead.title || '').toLowerCase()
  if (title.includes('ceo') || title.includes('chief executive')) score += 25
  else if (title.includes('cto') || title.includes('chief technology')) score += 25
  else if (title.includes('cio') || title.includes('chief information')) score += 25
  else if (title.includes('ciso') || title.includes('security')) score += 25
  else if (title.includes('cfo') || title.includes('chief financial')) score += 20
  else if (title.includes('cmo') || title.includes('chief marketing')) score += 20
  else if (title.includes('vp') || title.includes('vice president')) score += 15
  else if (title.includes('director')) score += 10
  else if (title.includes('manager')) score += 5

  // Score based on company size (if available)
  if (lead.companySize) {
    if (lead.companySize === 'enterprise') score += 20
    else if (lead.companySize === 'mid-market') score += 15
    else if (lead.companySize === 'smb') score += 5
  }

  // Score based on engagement
  if (lead.conversationLength) {
    score += Math.min(lead.conversationLength * 2, 20) // Max 20 points
  }

  // Score based on blocks viewed
  if (lead.blocksViewed && lead.blocksViewed.length > 0) {
    score += Math.min(lead.blocksViewed.length * 3, 15) // Max 15 points
  }

  // Score based on pain points identified
  if (lead.painPoints && lead.painPoints.length > 0) {
    score += Math.min(lead.painPoints.length * 5, 15) // Max 15 points
  }

  // Normalize to 0-100
  return Math.min(score, 100)
}

// Determine lead tier based on score
export function getLeadTier(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 70) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set, get) => ({
      leads: [],

      addLead: (leadData) => {
        const score = calculateLeadScore(leadData)
        const newLead: Lead = {
          id: generateId(),
          ...leadData,
          score,
          tier: getLeadTier(score),
          status: 'new',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          leads: [newLead, ...state.leads],
        }))

        return newLead
      },

      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map((lead) => {
            if (lead.id === id) {
              const updatedLead = {
                ...lead,
                ...updates,
                updatedAt: new Date(),
              }
              // Recalculate score if relevant fields changed
              if (updates.title || updates.company || updates.companySize ||
                  updates.blocksViewed || updates.painPoints || updates.conversationLength) {
                updatedLead.score = calculateLeadScore(updatedLead)
                updatedLead.tier = getLeadTier(updatedLead.score)
              }
              return updatedLead
            }
            return lead
          }),
        }))
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        }))
      },

      getLeadById: (id) => {
        return get().leads.find((lead) => lead.id === id)
      },

      getLeadsByFunction: (functionType) => {
        return get().leads.filter((lead) => lead.functionType === functionType)
      },

      getLeadsByScore: (minScore) => {
        return get().leads.filter((lead) => lead.score >= minScore)
      },

      getRecentLeads: (count) => {
        return get().leads.slice(0, count)
      },

      exportLeads: () => {
        const leads = get().leads
        const headers = [
          'Name', 'Email', 'Company', 'Title', 'Phone',
          'Function', 'Score', 'Tier', 'Status',
          'Pain Points', 'Blocks Viewed', 'Created At'
        ]

        const rows = leads.map((lead) => [
          lead.name || '',
          lead.email,
          lead.company || '',
          lead.title || '',
          lead.phone || '',
          lead.functionType,
          lead.score.toString(),
          lead.tier,
          lead.status,
          (lead.painPoints || []).join('; '),
          (lead.blocksViewed || []).join('; '),
          lead.createdAt.toISOString(),
        ])

        return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
      },

      clearAllLeads: () => {
        set({ leads: [] })
      },
    }),
    {
      name: 'arqai-leads',
      // Custom serialization for dates
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          // Rehydrate dates
          if (parsed.state?.leads) {
            parsed.state.leads = parsed.state.leads.map((lead: Lead) => ({
              ...lead,
              createdAt: new Date(lead.createdAt),
              updatedAt: new Date(lead.updatedAt),
            }))
          }
          return parsed
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)

// Selectors
export const selectLeads = (state: LeadState) => state.leads
export const selectHotLeads = (state: LeadState) => state.leads.filter((l) => l.tier === 'hot')
export const selectWarmLeads = (state: LeadState) => state.leads.filter((l) => l.tier === 'warm')
export const selectColdLeads = (state: LeadState) => state.leads.filter((l) => l.tier === 'cold')

'use client'

import { create } from 'zustand'

export type PageSectionId =
  // Platform page sections
  | 'platform-hero'
  | 'platform-problem'
  | 'platform-capabilities'
  | 'platform-orchestration'
  | 'platform-compiler'
  | 'platform-rag'
  | 'platform-architecture'
  | 'platform-integrations'
  | 'platform-comparison'
  // Security page sections
  | 'security-hero'
  | 'security-certifications'
  | 'security-compliance'
  | 'security-features'
  | 'security-audit-trails'
  | 'security-zero-trust'
  | 'security-data-residency'
  | 'security-resources'
  // Generic
  | 'general'

interface PageHighlightState {
  highlightedSection: PageSectionId | null
  sectionScores: Record<PageSectionId, number>
  currentPage: string | null
  scrollToSection: PageSectionId | null

  setCurrentPage: (page: string) => void
  highlightSection: (sectionId: PageSectionId | null) => void
  scrollAndHighlight: (sectionId: PageSectionId) => void
  updateFromIntent: (keywords: string[], page: string) => void
  clearScrollTarget: () => void
}

// Map keywords to page sections
const keywordToSectionMap: Record<string, Record<string, PageSectionId[]>> = {
  platform: {
    // Orchestration related
    'orchestration': ['platform-orchestration', 'platform-capabilities'],
    'agent': ['platform-orchestration', 'platform-capabilities'],
    'trust': ['platform-orchestration'],
    'risk': ['platform-orchestration'],
    // Compiler related
    'compliance': ['platform-compiler', 'platform-capabilities'],
    'compiler': ['platform-compiler'],
    'policy': ['platform-compiler'],
    'governance': ['platform-compiler', 'platform-capabilities'],
    // RAG related
    'rag': ['platform-rag'],
    'retrieval': ['platform-rag'],
    'knowledge': ['platform-rag'],
    'observability': ['platform-rag'],
    // Architecture
    'architecture': ['platform-architecture'],
    'fabric': ['platform-architecture'],
    'control plane': ['platform-architecture'],
    // Integrations
    'integration': ['platform-integrations'],
    'cloud': ['platform-integrations'],
    'aws': ['platform-integrations'],
    'azure': ['platform-integrations'],
    'salesforce': ['platform-integrations'],
    'servicenow': ['platform-integrations'],
    // Problem/Competition
    'pilot': ['platform-problem'],
    'production': ['platform-problem', 'platform-comparison'],
    'deploy': ['platform-problem'],
    'zapier': ['platform-comparison'],
    'langchain': ['platform-comparison'],
    // Customer service / automation
    'customer service': ['platform-orchestration', 'platform-capabilities'],
    'automation': ['platform-orchestration', 'platform-capabilities'],
    'automate': ['platform-orchestration', 'platform-capabilities'],
    'workflow': ['platform-orchestration', 'platform-integrations'],
  },
  security: {
    // Certifications
    'soc': ['security-certifications'],
    'soc 2': ['security-certifications'],
    'iso': ['security-certifications'],
    'fedramp': ['security-certifications'],
    'nist': ['security-certifications'],
    // Compliance
    'hipaa': ['security-compliance'],
    'gdpr': ['security-compliance'],
    'eu ai': ['security-compliance'],
    'colorado': ['security-compliance'],
    'regulation': ['security-compliance'],
    // Security features
    'audit': ['security-audit-trails', 'security-features'],
    'cryptographic': ['security-audit-trails'],
    'zero trust': ['security-zero-trust', 'security-features'],
    'zero-trust': ['security-zero-trust', 'security-features'],
    'authentication': ['security-zero-trust'],
    'data residency': ['security-data-residency', 'security-features'],
    'sovereignty': ['security-data-residency'],
    'capability token': ['security-features'],
    'anomaly': ['security-features'],
    // Resources
    'documentation': ['security-resources'],
    'penetration': ['security-resources'],
    'pentest': ['security-resources'],
    'dpa': ['security-resources'],
  }
}

export const usePageHighlightStore = create<PageHighlightState>((set, get) => ({
  highlightedSection: null,
  sectionScores: {} as Record<PageSectionId, number>,
  currentPage: null,
  scrollToSection: null,

  setCurrentPage: (page) => set({ currentPage: page, highlightedSection: null }),

  highlightSection: (sectionId) => set({ highlightedSection: sectionId }),

  scrollAndHighlight: (sectionId) => set({
    highlightedSection: sectionId,
    scrollToSection: sectionId
  }),

  clearScrollTarget: () => set({ scrollToSection: null }),

  updateFromIntent: (keywords, page) => {
    const pageKeywords = keywordToSectionMap[page]
    if (!pageKeywords) return

    const scores: Record<string, number> = {}

    // Score each section based on keyword matches
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase()
      for (const [mapKey, sections] of Object.entries(pageKeywords)) {
        if (lowerKeyword.includes(mapKey) || mapKey.includes(lowerKeyword)) {
          for (const section of sections) {
            scores[section] = (scores[section] || 0) + 1
          }
        }
      }
    }

    // Find the highest scoring section
    let bestSection: PageSectionId | null = null
    let bestScore = 0
    for (const [section, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score
        bestSection = section as PageSectionId
      }
    }

    if (bestSection && bestScore > 0) {
      set({
        highlightedSection: bestSection,
        scrollToSection: bestSection,
        sectionScores: scores as Record<PageSectionId, number>
      })

      // Clear highlight after 8 seconds
      setTimeout(() => {
        const current = get()
        if (current.highlightedSection === bestSection) {
          set({ highlightedSection: null })
        }
      }, 8000)
    }
  }
}))

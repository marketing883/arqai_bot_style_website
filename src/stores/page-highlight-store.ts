'use client'

import { create } from 'zustand'
import { detectIntents, type IntentResult } from '@/lib/intent-detection'
import type { ConversationTopic } from '@/stores/conversation-store'

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
  currentPage: string | null
  scrollToSection: PageSectionId | null
  lastIntent: IntentResult | null

  setCurrentPage: (page: string) => void
  highlightSection: (sectionId: PageSectionId | null) => void
  scrollAndHighlight: (sectionId: PageSectionId) => void
  updateFromMessage: (message: string, page: string) => void
  clearScrollTarget: () => void
  clearHighlight: () => void
}

// Map conversation intents to page sections
const intentToSectionMap: Record<string, Record<ConversationTopic, PageSectionId[]>> = {
  platform: {
    'roi': ['platform-capabilities', 'platform-comparison'],
    'security': ['platform-architecture', 'platform-capabilities'],
    'integration': ['platform-integrations', 'platform-capabilities'],
    'architecture': ['platform-architecture', 'platform-capabilities'],
    'timeline': ['platform-problem', 'platform-comparison'],
    'case-study': ['platform-capabilities', 'platform-comparison'],
    'demo': ['platform-hero', 'platform-capabilities'],
    'pricing': ['platform-comparison', 'platform-capabilities'],
    'comparison': ['platform-comparison'],
    'general': ['platform-hero']
  },
  security: {
    'roi': ['security-features', 'security-certifications'],
    'security': ['security-features', 'security-certifications', 'security-compliance'],
    'integration': ['security-compliance', 'security-features'],
    'architecture': ['security-features'],
    'timeline': ['security-certifications'],
    'case-study': ['security-resources'],
    'demo': ['security-hero'],
    'pricing': ['security-resources'],
    'comparison': ['security-certifications', 'security-compliance'],
    'general': ['security-hero']
  }
}

export const usePageHighlightStore = create<PageHighlightState>((set, get) => ({
  highlightedSection: null,
  currentPage: null,
  scrollToSection: null,
  lastIntent: null,

  setCurrentPage: (page) => set({ currentPage: page, highlightedSection: null }),

  highlightSection: (sectionId) => set({ highlightedSection: sectionId }),

  scrollAndHighlight: (sectionId) => set({
    highlightedSection: sectionId,
    scrollToSection: sectionId
  }),

  clearScrollTarget: () => set({ scrollToSection: null }),

  clearHighlight: () => set({ highlightedSection: null }),

  updateFromMessage: (message, page) => {
    // Use the intent detection system
    const intent = detectIntents(message)

    // Only highlight if confidence is high enough
    if (intent.confidence < 0.4 || intent.primaryTopic === 'general') {
      return
    }

    const pageSections = intentToSectionMap[page]
    if (!pageSections) return

    // Get the best matching section for the primary intent
    const matchingSections = pageSections[intent.primaryTopic]
    if (!matchingSections || matchingSections.length === 0) return

    const targetSection = matchingSections[0]

    set({
      highlightedSection: targetSection,
      scrollToSection: targetSection,
      lastIntent: intent
    })

    // Clear highlight after 6 seconds
    setTimeout(() => {
      const current = get()
      if (current.highlightedSection === targetSection) {
        set({ highlightedSection: null })
      }
    }, 6000)
  }
}))

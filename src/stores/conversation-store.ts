import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  FunctionType,
  Message,
  ContentBlock,
  BlockType
} from '@/types'
import { generateId } from '@/lib/utils'

// Topic types for intent detection
export type ConversationTopic =
  | 'roi'
  | 'security'
  | 'integration'
  | 'architecture'
  | 'timeline'
  | 'case-study'
  | 'demo'
  | 'pricing'
  | 'comparison'
  | 'general'

// Map topics to relevant block types
export const topicBlockMap: Record<ConversationTopic, BlockType[]> = {
  'roi': ['roi-calculator', 'case-study', 'live-stats'],
  'security': ['security-review', 'architecture-diagram'],
  'integration': ['integration-checklist', 'code-snippet'],
  'architecture': ['architecture-diagram', 'deployment-timeline'],
  'timeline': ['deployment-timeline', 'case-study'],
  'case-study': ['case-study', 'live-stats'],
  'demo': ['demo-video', 'live-stats'],
  'pricing': ['roi-calculator', 'comparison-table'],
  'comparison': ['comparison-table', 'case-study'],
  'general': ['roi-calculator', 'case-study'],
}

interface ConversationState {
  // Current session
  currentFunction: FunctionType | null
  messages: Message[]
  displayedBlocks: ContentBlock[]
  isLoading: boolean
  error: string | null

  // Navigation history for back/forward
  historyIndex: number
  history: { messages: Message[]; blocks: ContentBlock[] }[]

  // AI context
  detectedRole: string | null
  painPoints: string[]
  lastBlockShownAt: number
  context: Record<string, unknown>

  // Dynamic content state
  activeTopics: ConversationTopic[]
  topicScores: Record<ConversationTopic, number>
  activeBlocks: BlockType[]
  highlightedBlock: BlockType | null
  blockOrder: BlockType[]

  // Lead capture state
  leadCaptured: boolean
  shouldShowLeadCapture: boolean
  capturedFields: {
    name?: string
    email?: string
    company?: string
    title?: string
  }

  // Actions
  setFunction: (func: FunctionType) => void
  addMessage: (role: 'user' | 'assistant', content: string, blocks?: ContentBlock[]) => void
  addBlock: (type: BlockType, data: Record<string, unknown>) => void
  removeBlock: (blockId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // AI context actions
  setDetectedRole: (role: string | null) => void
  setPainPoints: (painPoints: string[]) => void
  setLastBlockShownAt: (index: number) => void
  updateContext: (updates: Record<string, unknown>) => void
  setShouldShowLeadCapture: (show: boolean) => void

  // Dynamic content actions
  setActiveTopics: (topics: ConversationTopic[]) => void
  updateTopicScores: (scores: Partial<Record<ConversationTopic, number>>) => void
  setActiveBlocks: (blocks: BlockType[]) => void
  setHighlightedBlock: (block: BlockType | null) => void
  setBlockOrder: (order: BlockType[]) => void
  updateContentFromIntent: (topics: ConversationTopic[], highlight?: BlockType) => void

  // Navigation
  canGoBack: () => boolean
  canGoForward: () => boolean
  goBack: () => void
  goForward: () => void

  // Lead capture
  setLeadField: (field: keyof ConversationState['capturedFields'], value: string) => void
  markLeadCaptured: () => void

  // Reset
  resetConversation: () => void
  clearAll: () => void
}

// Default block order for each function type
const defaultBlockOrder: Record<FunctionType, BlockType[]> = {
  'it-infrastructure': [
    'architecture-diagram',
    'roi-calculator',
    'integration-checklist',
    'deployment-timeline',
    'security-review',
    'case-study',
    'live-stats',
    'comparison-table',
    'demo-video',
    'code-snippet',
  ],
  'revenue-operations': [
    'roi-calculator',
    'integration-checklist',
    'case-study',
    'live-stats',
    'deployment-timeline',
    'comparison-table',
    'architecture-diagram',
    'security-review',
    'demo-video',
    'code-snippet',
  ],
  'customer-success': [
    'roi-calculator',
    'case-study',
    'integration-checklist',
    'live-stats',
    'deployment-timeline',
    'demo-video',
    'architecture-diagram',
    'security-review',
    'comparison-table',
    'code-snippet',
  ],
  'demand-generation': [
    'roi-calculator',
    'case-study',
    'integration-checklist',
    'live-stats',
    'comparison-table',
    'deployment-timeline',
    'architecture-diagram',
    'security-review',
    'demo-video',
    'code-snippet',
  ],
}

const initialState = {
  currentFunction: null,
  messages: [],
  displayedBlocks: [],
  isLoading: false,
  error: null,
  historyIndex: -1,
  history: [],
  detectedRole: null,
  painPoints: [],
  lastBlockShownAt: 0,
  context: {},
  activeTopics: ['general'] as ConversationTopic[],
  topicScores: {
    'roi': 0,
    'security': 0,
    'integration': 0,
    'architecture': 0,
    'timeline': 0,
    'case-study': 0,
    'demo': 0,
    'pricing': 0,
    'comparison': 0,
    'general': 1,
  } as Record<ConversationTopic, number>,
  activeBlocks: ['roi-calculator', 'case-study', 'integration-checklist'] as BlockType[],
  highlightedBlock: null,
  blockOrder: defaultBlockOrder['it-infrastructure'],
  leadCaptured: false,
  shouldShowLeadCapture: false,
  capturedFields: {},
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFunction: (func) => {
        set({
          currentFunction: func,
          messages: [],
          displayedBlocks: [],
          historyIndex: -1,
          history: [],
          error: null,
          activeTopics: ['general'],
          topicScores: initialState.topicScores,
          activeBlocks: defaultBlockOrder[func].slice(0, 3),
          highlightedBlock: null,
          blockOrder: defaultBlockOrder[func],
        })
      },

      addMessage: (role, content, blocks) => {
        const newMessage: Message = {
          id: generateId(),
          role,
          content,
          timestamp: new Date(),
          blocks,
        }

        const state = get()
        const newMessages = [...state.messages, newMessage]
        const newBlocks = blocks
          ? [...state.displayedBlocks, ...blocks]
          : state.displayedBlocks

        // Add to history for back/forward navigation
        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push({
          messages: newMessages,
          blocks: newBlocks,
        })

        set({
          messages: newMessages,
          displayedBlocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        })
      },

      addBlock: (type, data) => {
        const newBlock: ContentBlock = {
          id: generateId(),
          type,
          data,
          displayedAt: new Date(),
        }

        set((state) => ({
          displayedBlocks: [...state.displayedBlocks, newBlock],
        }))
      },

      removeBlock: (blockId) => {
        set((state) => ({
          displayedBlocks: state.displayedBlocks.filter((b) => b.id !== blockId),
        }))
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setDetectedRole: (role) => set({ detectedRole: role }),

      setPainPoints: (painPoints) => set({ painPoints }),

      setLastBlockShownAt: (index) => set({ lastBlockShownAt: index }),

      updateContext: (updates) => {
        set((state) => ({
          context: { ...state.context, ...updates },
        }))
      },

      setShouldShowLeadCapture: (show) => set({ shouldShowLeadCapture: show }),

      // Dynamic content actions
      setActiveTopics: (topics) => set({ activeTopics: topics }),

      updateTopicScores: (scores) => {
        set((state) => ({
          topicScores: { ...state.topicScores, ...scores },
        }))
      },

      setActiveBlocks: (blocks) => set({ activeBlocks: blocks }),

      setHighlightedBlock: (block) => set({ highlightedBlock: block }),

      setBlockOrder: (order) => set({ blockOrder: order }),

      // Main function to update content based on detected intents
      updateContentFromIntent: (topics, highlight) => {
        const state = get()
        const currentFunc = state.currentFunction || 'it-infrastructure'

        // Update topic scores - boost detected topics
        const newScores = { ...state.topicScores }
        topics.forEach(topic => {
          newScores[topic] = Math.min((newScores[topic] || 0) + 2, 10)
        })

        // Decay other topics slightly
        Object.keys(newScores).forEach(key => {
          const topic = key as ConversationTopic
          if (!topics.includes(topic)) {
            newScores[topic] = Math.max(newScores[topic] * 0.8, 0)
          }
        })

        // Determine active blocks based on topic scores
        const scoredBlocks: { block: BlockType; score: number }[] = []
        const baseOrder = defaultBlockOrder[currentFunc]

        baseOrder.forEach((block, index) => {
          let score = 10 - index // Base score from default order

          // Boost score based on topic relevance
          Object.entries(topicBlockMap).forEach(([topic, blocks]) => {
            if (blocks.includes(block)) {
              score += newScores[topic as ConversationTopic] * 2
            }
          })

          scoredBlocks.push({ block, score })
        })

        // Sort by score and take top blocks
        scoredBlocks.sort((a, b) => b.score - a.score)
        const newActiveBlocks = scoredBlocks.slice(0, 4).map(sb => sb.block)
        const newBlockOrder = scoredBlocks.map(sb => sb.block)

        set({
          activeTopics: topics.length > 0 ? topics : ['general'],
          topicScores: newScores,
          activeBlocks: newActiveBlocks,
          highlightedBlock: highlight || null,
          blockOrder: newBlockOrder,
        })
      },

      canGoBack: () => get().historyIndex > 0,

      canGoForward: () => {
        const state = get()
        return state.historyIndex < state.history.length - 1
      },

      goBack: () => {
        const state = get()
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1
          const historyState = state.history[newIndex]
          set({
            messages: historyState.messages,
            displayedBlocks: historyState.blocks,
            historyIndex: newIndex,
          })
        }
      },

      goForward: () => {
        const state = get()
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1
          const historyState = state.history[newIndex]
          set({
            messages: historyState.messages,
            displayedBlocks: historyState.blocks,
            historyIndex: newIndex,
          })
        }
      },

      setLeadField: (field, value) => {
        set((state) => ({
          capturedFields: {
            ...state.capturedFields,
            [field]: value,
          },
        }))
      },

      markLeadCaptured: () => set({ leadCaptured: true }),

      resetConversation: () => {
        const currentFunc = get().currentFunction
        set({
          ...initialState,
          currentFunction: currentFunc,
          blockOrder: currentFunc ? defaultBlockOrder[currentFunc] : initialState.blockOrder,
          activeBlocks: currentFunc ? defaultBlockOrder[currentFunc].slice(0, 3) : initialState.activeBlocks,
        })
      },

      clearAll: () => set(initialState),
    }),
    {
      name: 'arqai-conversation',
      // Don't persist between sessions for privacy
      partialize: () => ({}),
    }
  )
)

// Selectors for common patterns
export const selectMessages = (state: ConversationState) => state.messages
export const selectBlocks = (state: ConversationState) => state.displayedBlocks
export const selectIsLoading = (state: ConversationState) => state.isLoading
export const selectCurrentFunction = (state: ConversationState) => state.currentFunction
export const selectActiveBlocks = (state: ConversationState) => state.activeBlocks
export const selectHighlightedBlock = (state: ConversationState) => state.highlightedBlock
export const selectBlockOrder = (state: ConversationState) => state.blockOrder

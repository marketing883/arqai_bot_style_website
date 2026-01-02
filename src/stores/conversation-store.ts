import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  FunctionType,
  Message,
  ContentBlock,
  BlockType
} from '@/types'
import { generateId } from '@/lib/utils'

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

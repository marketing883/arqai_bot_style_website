'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import { ChatSidebar } from '@/components/canvas/chat-sidebar'
import { useConversationStore } from '@/stores/conversation-store'
import { usePageHighlightStore } from '@/stores/page-highlight-store'
import type { FunctionType } from '@/types'

interface PageWithChatProps {
  children: React.ReactNode
  pageContext: 'platform' | 'security' | 'about' | 'demo' | 'contact'
  initialMessage?: string
}

// Context-aware welcome messages for each page
const pageWelcomeMessages: Record<string, { functionType: FunctionType; welcomeMessage: string }> = {
  platform: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Welcome to the **ArqAI Platform** page!

I'm here to guide you through our technology. As we chat, I'll **highlight relevant sections** on this page to help you find exactly what you need.

What brings you here today? Are you looking to:
• Automate workflows with AI agents?
• Ensure compliance and governance?
• Integrate with your existing systems?`
  },
  security: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Welcome to our **Security & Compliance** center!

As we discuss your requirements, I'll **highlight relevant sections** on this page to show you exactly how ArqAI addresses your needs.

What compliance or security requirements are most important to your organization?`
  },
  about: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Welcome! I'm here to tell you about **ArqAI**.

We're on a mission to make AI agents **enterprise-ready**. Our team brings experience from leading tech companies.

What would you like to know about us?`
  },
  demo: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Ready to see ArqAI in action?

I can help you:
• Understand what the demo covers
• Prepare questions for the call
• Get a custom ROI estimate first

What's driving your interest in ArqAI today?`
  },
  contact: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Looking to get in touch?

I can help connect you with:
• **Sales** — for demos and pricing
• **Technical** — for architecture questions
• **Security** — for compliance reviews

What's the best way I can assist you?`
  }
}

// Keywords to detect from user messages for each page context
function extractKeywordsFromMessage(message: string): string[] {
  const words = message.toLowerCase().split(/\s+/)
  const phrases: string[] = []

  // Extract individual words
  phrases.push(...words.filter(w => w.length > 3))

  // Extract common phrases
  const text = message.toLowerCase()
  const phrasePatterns = [
    'customer service', 'zero trust', 'data residency', 'audit trail',
    'soc 2', 'eu ai', 'control plane', 'ai agent', 'workflow automation',
    'compliance', 'governance', 'integration', 'architecture', 'security'
  ]

  for (const phrase of phrasePatterns) {
    if (text.includes(phrase)) {
      phrases.push(phrase)
    }
  }

  return phrases
}

export function PageWithChat({ children, pageContext, initialMessage }: PageWithChatProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  const setFunction = useConversationStore((state) => state.setFunction)
  const addMessage = useConversationStore((state) => state.addMessage)
  const messages = useConversationStore((state) => state.messages)

  const setCurrentPage = usePageHighlightStore((s) => s.setCurrentPage)
  const updateFromIntent = usePageHighlightStore((s) => s.updateFromIntent)
  const highlightedSection = usePageHighlightStore((s) => s.highlightedSection)

  const contextConfig = pageWelcomeMessages[pageContext]

  // Set current page for highlight system
  useEffect(() => {
    setCurrentPage(pageContext)
  }, [pageContext, setCurrentPage])

  // Watch for new user messages and update highlights
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        const keywords = extractKeywordsFromMessage(lastMessage.content)
        updateFromIntent(keywords, pageContext)
      }
    }
  }, [messages, pageContext, updateFromIntent])

  // Set function type and show welcome message on mount
  useEffect(() => {
    if (contextConfig && !hasShownWelcome) {
      setFunction(contextConfig.functionType)

      // Add context-aware welcome message after a short delay
      const timer = setTimeout(() => {
        if (messages.length === 0) {
          addMessage('assistant', initialMessage || contextConfig.welcomeMessage)
          setHasShownWelcome(true)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [contextConfig, hasShownWelcome, setFunction, addMessage, messages.length, initialMessage])

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsChatOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          w-16 h-16 rounded-full
          bg-gradient-to-br from-arq-deep-blue to-blue-600
          text-white shadow-lg
          flex items-center justify-center
          hover:shadow-xl hover:scale-105
          transition-all duration-200
          ${isChatOpen ? 'hidden' : ''}
        `}
      >
        <MessageCircle className="w-7 h-7" />
        {/* Notification dot - animated when section is highlighted */}
        <motion.span
          animate={highlightedSection ? {
            scale: [1, 1.3, 1],
            backgroundColor: ['#a7ff83', '#34d399', '#a7ff83']
          } : {}}
          transition={{ duration: 1, repeat: highlightedSection ? Infinity : 0 }}
          className="absolute top-0 right-0 w-4 h-4 bg-arq-lime rounded-full border-2 border-white"
        />
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop - semi-transparent to still see highlighted sections */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
              onClick={() => setIsChatOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-white/95 backdrop-blur-md shadow-2xl flex flex-col border-l border-arq-lime/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-arq-deep-blue to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Sparkles className="w-5 h-5 text-arq-lime" />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0"
                    >
                      <Sparkles className="w-5 h-5 text-arq-lime" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Interactive Guide</h3>
                    <p className="text-sm text-white/70">I'll highlight relevant sections as we chat</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Highlight indicator */}
              <AnimatePresence>
                {highlightedSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gradient-to-r from-arq-lime/20 to-emerald-400/20 border-b border-arq-lime/30 overflow-hidden"
                  >
                    <div className="px-4 py-2 flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-arq-lime rounded-full"
                      />
                      <span className="text-sm text-arq-deep-blue font-medium">
                        Section highlighted on page
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden">
                <ChatSidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

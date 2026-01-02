'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { ChatSidebar } from '@/components/canvas/chat-sidebar'
import { useConversationStore } from '@/stores/conversation-store'
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

I see you're exploring our **three patented technologies**:
• Trust-Aware Orchestration™
• Compliance-Aware Compiler™
• Adaptive RAG™

What aspect of our platform interests you most?`
  },
  security: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Welcome to our **Security & Compliance** page!

ArqAI is built for enterprises with strict requirements:
• **SOC 2 Type II** certified
• **HIPAA** compliant architecture
• **GDPR** ready with data residency

What compliance requirements does your organization have?`
  },
  about: {
    functionType: 'it-infrastructure',
    welcomeMessage: `Welcome! I'm here to tell you about **ArqAI**.

We're on a mission to make AI agents **enterprise-ready**. Our team brings experience from leading tech companies, and we've raised funding to solve the #1 problem in enterprise AI: **governance**.

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

export function PageWithChat({ children, pageContext, initialMessage }: PageWithChatProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  const setFunction = useConversationStore((state) => state.setFunction)
  const addMessage = useConversationStore((state) => state.addMessage)
  const messages = useConversationStore((state) => state.messages)

  const contextConfig = pageWelcomeMessages[pageContext]

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
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-arq-lime rounded-full border-2 border-white" />
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsChatOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-arq-deep-blue to-blue-600 text-white">
                <div>
                  <h3 className="font-semibold">Chat with ArqBot</h3>
                  <p className="text-sm text-white/70">Ask about {pageContext}</p>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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

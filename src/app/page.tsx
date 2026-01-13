'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/homepage/hero'
import { FunctionSelector } from '@/components/homepage/function-selector'
import { TrustIndicators } from '@/components/homepage/trust-indicators'
import { ValueProposition } from '@/components/homepage/value-proposition'
import { ChatSidebar } from '@/components/canvas/chat-sidebar'
import { useConversationStore } from '@/stores/conversation-store'

export default function HomePage() {
  const setFunction = useConversationStore((state) => state.setFunction)
  const currentFunction = useConversationStore((state) => state.currentFunction)

  // Initialize with a generic function type for homepage
  useEffect(() => {
    if (!currentFunction) {
      setFunction('it-infrastructure')
    }
  }, [setFunction, currentFunction])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Layout with 70/30 split */}
      <div className="flex-1 pt-16 flex">
        {/* Main Content - 70% on desktop, full on mobile */}
        <main className="flex-1 md:w-[70%] overflow-y-auto">
          {/* Hero Section */}
          <HeroSection />

          {/* Function Selector */}
          <FunctionSelector />

          {/* Trust Indicators */}
          <TrustIndicators />

          {/* Value Proposition */}
          <ValueProposition />

          {/* Footer inside main content area */}
          <Footer />
        </main>

        {/* Chat Sidebar - 30% on desktop, hidden on mobile */}
        <motion.aside
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="hidden md:flex md:w-[30%] h-[calc(100vh-4rem)] sticky top-16 border-l border-border bg-white"
        >
          <ChatSidebar />
        </motion.aside>
      </div>

      {/* Mobile Chat Button */}
      <MobileChatButton />
    </div>
  )
}

// Mobile floating chat button component
function MobileChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button for mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-arq-deep-blue text-white shadow-lg hover:bg-arq-deep-blue/90 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Mobile chat drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ChatSidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

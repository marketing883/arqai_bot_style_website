'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversationStore } from '@/stores/conversation-store'
import { ChatSidebar } from './chat-sidebar'
import { ContentArea } from './content-area'
import { CanvasHeader } from './canvas-header'
import { MobileChatDrawer } from './mobile-chat-drawer'
import type { FunctionType } from '@/types'
import { cn } from '@/lib/utils'

interface CanvasLayoutProps {
  functionId: FunctionType
  functionName: string
  functionDescription: string
}

export function CanvasLayout({
  functionId,
  functionName,
  functionDescription,
}: CanvasLayoutProps) {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)
  const setFunction = useConversationStore((state) => state.setFunction)
  const currentFunction = useConversationStore((state) => state.currentFunction)

  // Initialize function on mount
  useEffect(() => {
    if (currentFunction !== functionId) {
      setFunction(functionId)
    }
  }, [functionId, currentFunction, setFunction])

  return (
    <div className="min-h-screen bg-arq-slate">
      {/* Canvas Header */}
      <CanvasHeader
        functionName={functionName}
        onOpenChat={() => setIsMobileChatOpen(true)}
      />

      {/* Main Canvas Area */}
      <div className="pt-16 h-screen flex">
        {/* Content Area - 70% on desktop, full width on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 lg:w-[70%] h-full overflow-hidden"
        >
          <ContentArea
            functionName={functionName}
            functionDescription={functionDescription}
          />
        </motion.div>

        {/* Chat Sidebar - 30% on desktop, hidden on mobile */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="hidden lg:flex lg:w-[30%] h-full border-l border-white/10"
        >
          <ChatSidebar />
        </motion.div>
      </div>

      {/* Mobile Chat Drawer */}
      <AnimatePresence>
        {isMobileChatOpen && (
          <MobileChatDrawer onClose={() => setIsMobileChatOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

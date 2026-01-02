'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatSidebar } from './chat-sidebar'

interface MobileChatDrawerProps {
  onClose: () => void
}

export function MobileChatDrawer({ onClose }: MobileChatDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      />

      {/* Drawer */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-arq-slate rounded-t-2xl lg:hidden overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 rounded-full bg-white/20" />
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Chat Content */}
        <div className="h-full pt-2">
          <ChatSidebar />
        </div>
      </motion.div>
    </>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, RotateCcw } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { useConversationStore } from '@/stores/conversation-store'

interface CanvasHeaderProps {
  functionName: string
  onOpenChat: () => void
}

export function CanvasHeader({ functionName, onOpenChat }: CanvasHeaderProps) {
  const resetConversation = useConversationStore((state) => state.resetConversation)
  const messagesCount = useConversationStore((state) => state.messages.length)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-arq-slate/95 backdrop-blur-md border-b border-white/10">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>

          <div className="hidden sm:block h-6 w-px bg-white/20" />

          <Link href="/" className="flex items-center gap-2">
            <svg
              width={32}
              height={32}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 90L40 10H60L90 90H70L62 70H38L30 90H10ZM42 55H58L50 30L42 55Z"
                fill="white"
              />
              <circle cx="70" cy="30" r="12" fill="#A7FF83" />
            </svg>
            <span className="hidden md:block text-white font-semibold">ArqAI</span>
          </Link>
        </div>

        {/* Center: Function Name */}
        <div className="flex-1 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-medium text-sm md:text-base truncate px-4"
          >
            {functionName}
          </motion.h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetConversation}
            className="text-white/70 hover:text-white hover:bg-white/10"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          {/* Mobile Chat Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenChat}
            className="lg:hidden text-white/70 hover:text-white hover:bg-white/10 relative"
          >
            <MessageSquare className="w-4 h-4" />
            {messagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-arq-lime text-arq-slate text-xs rounded-full flex items-center justify-center">
                {messagesCount > 9 ? '9+' : messagesCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

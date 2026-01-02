'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConversationStore } from '@/stores/conversation-store'
import { cn } from '@/lib/utils'

export function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const addMessage = useConversationStore((state) => state.addMessage)
  const setLoading = useConversationStore((state) => state.setLoading)
  const isLoading = useConversationStore((state) => state.isLoading)
  const canGoBack = useConversationStore((state) => state.canGoBack)
  const canGoForward = useConversationStore((state) => state.canGoForward)
  const goBack = useConversationStore((state) => state.goBack)
  const goForward = useConversationStore((state) => state.goForward)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    // Add user message
    addMessage('user', trimmedInput)
    setInput('')

    // Simulate AI response (will be replaced with Claude API in Phase 4)
    setLoading(true)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock response
    const mockResponses = [
      "That's a great question! Let me show you how ArqAI can help with that specific use case.",
      "I understand your concern. ArqAI's governance features are specifically designed to address that challenge.",
      "Excellent point. Our Trust-Aware Orchestration technology ensures that every agent action is properly governed.",
      "I can demonstrate that for you. Would you like to see our ROI calculator or a deployment timeline?",
    ]

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    addMessage('assistant', randomResponse)
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-white/10 p-4">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={!canGoBack()}
          className="text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={goForward}
          disabled={!canGoForward()}
          className="text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <span className="text-white/30 text-xs ml-2">Navigate history</span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask ArqBot anything..."
          disabled={isLoading}
          rows={1}
          className={cn(
            'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12',
            'text-white placeholder:text-white/40 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-arq-lime/50 focus:border-arq-lime/50',
            'resize-none min-h-[48px] max-h-[120px]',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isLoading}
          className={cn(
            'absolute right-2 bottom-2',
            'bg-arq-lime text-arq-slate hover:bg-arq-lime/90',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'w-8 h-8 p-0'
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Character hint */}
      <p className="text-white/30 text-xs mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}

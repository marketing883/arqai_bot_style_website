'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConversationStore } from '@/stores/conversation-store'
import { cn } from '@/lib/utils'
import type { ContentBlock, BlockType } from '@/types'

export function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentFunction = useConversationStore((state) => state.currentFunction)
  const messages = useConversationStore((state) => state.messages)
  const displayedBlocks = useConversationStore((state) => state.displayedBlocks)
  const detectedRole = useConversationStore((state) => state.detectedRole)
  const lastBlockShownAt = useConversationStore((state) => state.lastBlockShownAt)
  const context = useConversationStore((state) => state.context)

  const addMessage = useConversationStore((state) => state.addMessage)
  const setLoading = useConversationStore((state) => state.setLoading)
  const setError = useConversationStore((state) => state.setError)
  const isLoading = useConversationStore((state) => state.isLoading)
  const canGoBack = useConversationStore((state) => state.canGoBack)
  const canGoForward = useConversationStore((state) => state.canGoForward)
  const goBack = useConversationStore((state) => state.goBack)
  const goForward = useConversationStore((state) => state.goForward)

  const setDetectedRole = useConversationStore((state) => state.setDetectedRole)
  const setPainPoints = useConversationStore((state) => state.setPainPoints)
  const setLastBlockShownAt = useConversationStore((state) => state.setLastBlockShownAt)
  const setShouldShowLeadCapture = useConversationStore((state) => state.setShouldShowLeadCapture)

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
    if (!trimmedInput || isLoading || !currentFunction) return

    // Add user message
    addMessage('user', trimmedInput)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Prepare messages for API
      const apiMessages = [...messages, { role: 'user' as const, content: trimmedInput, id: 'temp', timestamp: new Date() }]
        .map((m) => ({ role: m.role, content: m.content }))

      // Get previous block types
      const previousBlocks: BlockType[] = displayedBlocks.map((b) => b.type)

      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          functionType: currentFunction,
          userRole: detectedRole,
          previousBlocks,
          messageCount: messages.length + 1,
          lastBlockShownAt,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Update detected role if provided
      if (data.detectedRole && data.detectedRole !== detectedRole) {
        setDetectedRole(data.detectedRole)
      }

      // Update pain points if provided
      if (data.painPoints && data.painPoints.length > 0) {
        setPainPoints(data.painPoints)
      }

      // Track when blocks are shown
      if (data.blocks && data.blocks.length > 0) {
        setLastBlockShownAt(messages.length + 1)
      }

      // Check if we should show lead capture
      if (data.shouldCaptureLead) {
        setShouldShowLeadCapture(true)
      }

      // Add assistant message with any blocks
      const blocks: ContentBlock[] = data.blocks || []
      addMessage('assistant', data.message, blocks.length > 0 ? blocks : undefined)
    } catch (error) {
      console.error('Chat error:', error)
      setError('Failed to get response. Please try again.')

      // Add a fallback error message
      addMessage(
        'assistant',
        "I apologize, but I'm having trouble responding right now. Please try again in a moment."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={!canGoBack()}
          className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={goForward}
          disabled={!canGoForward()}
          className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <span className="text-muted-foreground/70 text-xs ml-2">Navigate history</span>
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
            'w-full bg-muted border border-border rounded-xl px-4 py-3 pr-12',
            'text-foreground placeholder:text-muted-foreground text-sm',
            'focus:outline-none focus:ring-2 focus:ring-arq-deep-blue/30 focus:border-arq-deep-blue/50',
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
            'bg-arq-deep-blue text-white hover:bg-arq-deep-blue/90',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'w-8 h-8 p-0'
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Character hint */}
      <p className="text-muted-foreground/70 text-xs mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}

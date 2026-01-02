'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConversationStore } from '@/stores/conversation-store'
import { cn } from '@/lib/utils'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [showPulse, setShowPulse] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const messages = useConversationStore((state) => state.messages)
  const isLoading = useConversationStore((state) => state.isLoading)
  const addMessage = useConversationStore((state) => state.addMessage)
  const setFunction = useConversationStore((state) => state.setFunction)

  // Initialize with a generic function type
  useEffect(() => {
    setFunction('it-infrastructure')
  }, [setFunction])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Hide pulse after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    addMessage('user', input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg transition-all duration-300',
            isOpen
              ? 'bg-muted hover:bg-muted/80 text-foreground'
              : 'bg-arq-deep-blue hover:bg-arq-deep-blue/90 text-white'
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageSquare className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Pulse Animation */}
        {showPulse && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arq-lime opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-arq-lime" />
          </span>
        )}
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[500px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-background flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-arq-lime/20 flex items-center justify-center">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 90L40 10H60L90 90H70L62 70H38L30 90H10ZM42 55H58L50 30L42 55Z"
                    fill="#0A2463"
                  />
                  <circle cx="70" cy="30" r="12" fill="#A7FF83" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-semibold text-sm">ArqBot</h3>
                <p className="text-muted-foreground text-xs">Ask me anything about ArqAI</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px]">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <p className="text-foreground text-sm mb-2">
                    Hi! I'm ArqBot.
                  </p>
                  <p className="text-muted-foreground text-xs max-w-[250px] mx-auto">
                    I can help you learn about how ArqAI automates enterprise workflows with governed AI agents.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {['What is ArqAI?', 'How does it work?', 'Show me ROI'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          addMessage('user', q)
                        }}
                        className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs hover:bg-arq-deep-blue/10 hover:text-foreground transition-colors border border-border"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message List */}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2',
                      message.role === 'user'
                        ? 'bg-arq-deep-blue text-white rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={cn(
                        'text-[10px] mt-1',
                        message.role === 'user' ? 'text-white/50' : 'text-muted-foreground'
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="w-2 h-2 rounded-full bg-muted-foreground/40"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-3">
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
                    'w-full bg-muted border border-border rounded-xl px-4 py-2.5 pr-12',
                    'text-foreground placeholder:text-muted-foreground text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-arq-deep-blue/30 focus:border-arq-deep-blue/50',
                    'resize-none min-h-[42px] max-h-[100px]',
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

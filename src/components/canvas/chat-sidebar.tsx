'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useConversationStore } from '@/stores/conversation-store'
import { MessageBubble } from './message-bubble'
import { ChatInput } from './chat-input'
import { TypingIndicator } from './typing-indicator'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ChatSidebar() {
  const messages = useConversationStore((state) => state.messages)
  const isLoading = useConversationStore((state) => state.isLoading)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border bg-white">
        <h2 className="text-foreground font-medium text-sm">Chat with ArqBot</h2>
        <p className="text-muted-foreground text-xs">Ask about this use case</p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-arq-lime/20 flex items-center justify-center">
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
              <p className="text-foreground text-sm mb-2">
                Hi! I'm ArqBot.
              </p>
              <p className="text-muted-foreground text-xs max-w-[200px] mx-auto">
                Ask me anything about this use case, and I'll show you how ArqAI can help.
              </p>
            </motion.div>
          )}

          {/* Message List */}
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput />
    </div>
  )
}

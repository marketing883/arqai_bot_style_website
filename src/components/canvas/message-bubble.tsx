'use client'

import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'
import type { Message } from '@/types'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-2',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-arq-deep-blue' : 'bg-arq-lime/20'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-arq-deep-blue" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-arq-deep-blue text-white rounded-tr-sm'
            : 'bg-white border border-border shadow-sm text-foreground rounded-tl-sm'
        )}
      >
        <div className={cn(
          'text-sm leading-relaxed',
          isUser ? 'text-white' : 'text-foreground'
        )}>
          <FormattedMessage content={message.content} isUser={isUser} />
        </div>

        {/* Timestamp */}
        <p
          className={cn(
            'text-[10px] mt-2',
            isUser ? 'text-white/50' : 'text-muted-foreground'
          )}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}

// Simple markdown-like formatter
function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  // Split by lines and process each
  const lines = content.split('\n')

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => {
        // Skip empty lines but add spacing
        if (!line.trim()) {
          return <div key={lineIndex} className="h-1" />
        }

        // Check if it's a bullet point
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-')

        if (isBullet) {
          const bulletContent = line.trim().replace(/^[•\-]\s*/, '')
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-1">
              <span className={cn(
                "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                isUser ? "bg-arq-lime" : "bg-arq-deep-blue"
              )} />
              <span>{formatInlineText(bulletContent, isUser)}</span>
            </div>
          )
        }

        // Check if it's a numbered item
        const numberedMatch = line.trim().match(/^(\d+)\.\s*(.*)/)
        if (numberedMatch) {
          return (
            <div key={lineIndex} className="flex items-start gap-2 pl-1">
              <span className={cn(
                "font-semibold text-xs mt-0.5 w-5 shrink-0",
                isUser ? "text-arq-lime" : "text-arq-deep-blue"
              )}>
                {numberedMatch[1]}.
              </span>
              <span>{formatInlineText(numberedMatch[2], isUser)}</span>
            </div>
          )
        }

        // Regular line
        return (
          <p key={lineIndex}>
            {formatInlineText(line, isUser)}
          </p>
        )
      })}
    </div>
  )
}

// Format inline text (bold, etc.)
function formatInlineText(text: string, isUser: boolean): React.ReactNode {
  // Split by bold markers **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    // Check if this part is bold
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2)
      return (
        <strong
          key={index}
          className={cn(
            "font-semibold",
            isUser ? "text-arq-lime" : "text-arq-deep-blue"
          )}
        >
          {boldText}
        </strong>
      )
    }

    // Check for em dashes and format nicely
    if (part.includes('—')) {
      const [before, after] = part.split('—')
      if (after) {
        return (
          <span key={index}>
            {before}<span className="opacity-60">—</span>{after}
          </span>
        )
      }
    }

    return part
  })
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

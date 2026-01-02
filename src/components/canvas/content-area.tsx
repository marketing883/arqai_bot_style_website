'use client'

import { motion } from 'framer-motion'
import { useConversationStore } from '@/stores/conversation-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BlockRenderer } from './block-renderer'
import { Server, TrendingUp, HeadphonesIcon, Megaphone } from 'lucide-react'
import type { FunctionType } from '@/types'

interface ContentAreaProps {
  functionName: string
  functionDescription: string
}

const functionIcons: Record<FunctionType, React.ElementType> = {
  'it-infrastructure': Server,
  'revenue-operations': TrendingUp,
  'customer-success': HeadphonesIcon,
  'demand-generation': Megaphone,
}

const functionColors: Record<FunctionType, string> = {
  'it-infrastructure': 'from-blue-500 to-blue-600',
  'revenue-operations': 'from-green-500 to-green-600',
  'customer-success': 'from-purple-500 to-purple-600',
  'demand-generation': 'from-orange-500 to-orange-600',
}

export function ContentArea({ functionName, functionDescription }: ContentAreaProps) {
  const currentFunction = useConversationStore((state) => state.currentFunction)
  const displayedBlocks = useConversationStore((state) => state.displayedBlocks)
  const messages = useConversationStore((state) => state.messages)

  const FunctionIcon = currentFunction ? functionIcons[currentFunction] : Server
  const colorClass = currentFunction ? functionColors[currentFunction] : 'from-blue-500 to-blue-600'

  return (
    <ScrollArea className="h-full">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-arq-deep-blue to-arq-slate p-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <div className="relative">
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} text-white mb-6`}
            >
              <FunctionIcon className="w-8 h-8" />
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {functionName}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/70 max-w-2xl">
              {functionDescription}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="px-4 py-2 rounded-lg bg-white/10">
                <span className="text-arq-lime font-semibold">30 days</span>
                <span className="text-white/60 ml-2">to production</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/10">
                <span className="text-arq-lime font-semibold">3 patents</span>
                <span className="text-white/60 ml-2">protecting innovation</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Getting Started Prompt */}
        {messages.length === 0 && displayedBlocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-white font-semibold mb-3">Get Started</h2>
            <p className="text-white/60 text-sm mb-4">
              Ask ArqBot about this use case to explore how ArqAI can help. Try questions like:
            </p>
            <div className="flex flex-wrap gap-2">
              {getSuggestedQuestions(currentFunction).map((question, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content Blocks */}
        {displayedBlocks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-white font-semibold">Generated Content</h2>
            {displayedBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlockRenderer block={block} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Placeholder for future content */}
        {messages.length > 0 && displayedBlocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/40 text-sm">
              Content blocks will appear here as you chat with ArqBot.
            </p>
            <p className="text-white/30 text-xs mt-2">
              Try asking about ROI, security, architecture, or deployment timelines.
            </p>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  )
}

function getSuggestedQuestions(functionType: FunctionType | null): string[] {
  const baseQuestions = [
    "What's the ROI?",
    "How secure is it?",
    "Show me the architecture",
  ]

  const functionQuestions: Record<FunctionType, string[]> = {
    'it-infrastructure': [
      "How does it handle incidents?",
      "Can it integrate with ServiceNow?",
      "What about compliance?",
    ],
    'revenue-operations': [
      "How does it sync with Salesforce?",
      "Can it automate data entry?",
      "What metrics does it track?",
    ],
    'customer-success': [
      "How does it handle tickets?",
      "Can it escalate to humans?",
      "What's the response time?",
    ],
    'demand-generation': [
      "How does it qualify leads?",
      "Can it personalize campaigns?",
      "What integrations are supported?",
    ],
  }

  return functionType
    ? [...baseQuestions, ...functionQuestions[functionType]].slice(0, 6)
    : baseQuestions
}

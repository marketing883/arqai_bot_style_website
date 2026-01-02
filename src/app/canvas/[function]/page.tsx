'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'

const functionNames: Record<string, string> = {
  'it-infrastructure': 'Autonomous IT Infrastructure',
  'revenue-operations': 'Revenue Operations Automation',
  'customer-success': 'Autonomous Customer Success',
  'demand-generation': 'Autonomous Demand Generation',
}

export default function CanvasPage() {
  const params = useParams()
  const functionId = params.function as string
  const functionName = functionNames[functionId] || 'ArqAI Canvas'

  return (
    <div className="min-h-screen flex flex-col bg-arq-slate">
      <Header />

      <main className="flex-1 pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-arq-lime/20 mb-6">
            <MessageSquare className="w-10 h-10 text-arq-lime" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {functionName}
          </h1>

          <p className="text-xl text-white/70 mb-4">
            CDI Canvas Coming Soon
          </p>

          <p className="text-white/50 mb-8">
            The Conversation-Driven Interface will be available in Phase 3.
            This is where you'll interact with ArqBot to explore {functionName.toLowerCase()}.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="lime">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/demo">
                Book a Demo
              </Link>
            </Button>
          </div>

          {/* Preview of canvas layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <p className="text-xs text-white/40 mb-4">Preview: Canvas Layout (Phase 3)</p>
            <div className="grid grid-cols-3 gap-4 h-48">
              <div className="col-span-2 rounded-lg bg-white/5 border border-white/10 p-4">
                <div className="text-xs text-white/30 mb-2">Content Area (70%)</div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                  <div className="h-16 w-full bg-white/5 rounded mt-4" />
                </div>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <div className="text-xs text-white/30 mb-2">Chat (30%)</div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-arq-lime/20 rounded" />
                  <div className="h-3 w-3/4 bg-white/10 rounded ml-auto" />
                  <div className="h-3 w-full bg-arq-lime/20 rounded" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

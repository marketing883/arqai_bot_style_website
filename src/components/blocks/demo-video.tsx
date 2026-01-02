'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { FunctionType } from '@/types'

interface DemoVideoProps {
  functionType: FunctionType
  videoId?: string
  title?: string
}

const videoConfigs: Record<FunctionType, {
  title: string
  description: string
  duration: string
  thumbnail: string
  highlights: string[]
}> = {
  'it-infrastructure': {
    title: 'IT Infrastructure Automation Demo',
    description: 'See how ArqAI handles incident response and deployment automation',
    duration: '4:32',
    thumbnail: '/demos/it-infrastructure-thumb.jpg',
    highlights: [
      'Automated incident detection',
      'Self-healing infrastructure',
      'Deployment orchestration',
    ],
  },
  'revenue-operations': {
    title: 'Revenue Operations Demo',
    description: 'Watch ArqAI automate your CRM and sales operations',
    duration: '5:15',
    thumbnail: '/demos/revenue-ops-thumb.jpg',
    highlights: [
      'CRM data sync in real-time',
      'Automated lead scoring',
      'Pipeline intelligence',
    ],
  },
  'customer-success': {
    title: 'Customer Success Automation Demo',
    description: 'Discover how ArqAI transforms your support operations',
    duration: '4:48',
    thumbnail: '/demos/customer-success-thumb.jpg',
    highlights: [
      'Intelligent ticket routing',
      'Automated response generation',
      'Seamless escalation',
    ],
  },
  'demand-generation': {
    title: 'Demand Generation Demo',
    description: 'See ArqAI supercharge your marketing automation',
    duration: '5:02',
    thumbnail: '/demos/demand-gen-thumb.jpg',
    highlights: [
      'Multi-channel orchestration',
      'Lead qualification at scale',
      'Campaign optimization',
    ],
  },
}

export function DemoVideo({ functionType, videoId, title }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const config = videoConfigs[functionType]

  return (
    <Card className="bg-gradient-to-br from-arq-deep-blue/90 to-arq-slate border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Play className="w-5 h-5 text-arq-lime" />
          {title || config.title}
        </CardTitle>
        <p className="text-white/60 text-sm">{config.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-arq-slate to-black group cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(167, 255, 131, 0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* ArqAI Logo Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-arq-lime to-green-400 flex items-center justify-center mb-4 mx-auto">
                <span className="text-arq-slate font-bold text-2xl">Arq</span>
              </div>
              <p className="text-white/50 text-sm">Demo video coming soon</p>
            </motion.div>
          </div>

          {/* Play Button Overlay */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-arq-lime/90 flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-arq-slate ml-1" />
              </motion.div>
            </motion.div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs">
            {config.duration}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Highlights */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-white/50 text-xs mb-2">In this demo:</p>
          <div className="flex flex-wrap gap-2">
            {config.highlights.map((highlight, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

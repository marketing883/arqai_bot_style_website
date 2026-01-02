'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, ArrowRight, Layers, Cpu, Database, Cloud, Lock, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { FunctionType } from '@/types'

interface ArchitectureDiagramProps {
  functionType: FunctionType
  data?: Record<string, unknown>
}

const architectureLayers = [
  {
    id: 'integrations',
    name: 'Integrations Layer',
    icon: Cloud,
    color: 'from-blue-500 to-blue-600',
    description: 'Connects to your existing tools',
    items: ['APIs', 'Webhooks', 'Native Connectors'],
  },
  {
    id: 'orchestration',
    name: 'Trust-Aware Orchestration',
    icon: Layers,
    color: 'from-purple-500 to-purple-600',
    description: 'Governs agent actions with policies',
    items: ['Action Policies', 'Approval Flows', 'Audit Trails'],
  },
  {
    id: 'reasoning',
    name: 'Semantic Reasoning Engine',
    icon: Cpu,
    color: 'from-arq-lime to-green-500',
    description: 'Patented context-aware AI',
    items: ['Semantic Graph', 'Context Memory', 'Domain Models'],
  },
  {
    id: 'data',
    name: 'Secure Data Layer',
    icon: Database,
    color: 'from-orange-500 to-orange-600',
    description: 'Zero-trust data handling',
    items: ['Encryption', 'Isolation', 'Compliance'],
  },
]

export function ArchitectureDiagram({ functionType, data }: ArchitectureDiagramProps) {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  return (
    <Card className="bg-gradient-to-br from-arq-deep-blue/90 to-arq-slate border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Box className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">Platform Architecture</CardTitle>
            <p className="text-white/60 text-sm">How ArqAI works under the hood</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Architecture Visualization */}
        <div className="relative bg-white/5 rounded-xl p-6 overflow-hidden">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Layers */}
          <div className="relative space-y-3">
            {architectureLayers.map((layer, index) => {
              const Icon = layer.icon
              const isSelected = selectedLayer === layer.id

              return (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    onClick={() => setSelectedLayer(isSelected ? null : layer.id)}
                    whileHover={{ scale: 1.01 }}
                    className={`
                      flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
                      ${isSelected ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white/5 hover:bg-white/10'}
                    `}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${layer.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{layer.name}</h4>
                      <p className="text-white/50 text-xs">{layer.description}</p>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 text-white/30 transition-transform ${
                        isSelected ? 'rotate-90' : ''
                      }`}
                    />
                  </motion.div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 ml-14 flex gap-2"
                    >
                      {layer.items.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-1 rounded bg-white/10 text-white/70 text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* Connector Lines */}
                  {index < architectureLayers.length - 1 && (
                    <div className="absolute left-6 top-full w-0.5 h-3 bg-white/20" />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Patent Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-arq-lime/20"
          >
            <Lock className="w-3 h-3 text-arq-lime" />
            <span className="text-arq-lime text-xs font-medium">3 Patents</span>
          </motion.div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <span className="text-white/70 text-xs">Sub-second Latency</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Lock className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <span className="text-white/70 text-xs">Zero-Trust Security</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Cloud className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-white/70 text-xs">Multi-Region Deploy</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 border-t border-white/10">
          <Button size="sm" className="w-full bg-arq-lime text-arq-slate hover:bg-arq-lime/90">
            View Technical Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

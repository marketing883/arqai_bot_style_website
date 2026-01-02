'use client'

import { motion } from 'framer-motion'
import { useConversationStore } from '@/stores/conversation-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Server, TrendingUp, HeadphonesIcon, Megaphone } from 'lucide-react'
import type { FunctionType, BlockType } from '@/types'

// Import all block components
import {
  ROICalculator,
  DemoVideo,
  SecurityReview,
  ArchitectureDiagram,
  IntegrationChecklist,
  DeploymentTimeline,
  CaseStudy,
  LiveStats,
  CodeSnippet,
  ComparisonTable,
} from '@/components/blocks'

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

// Default blocks to show for each function type - all shown from the start
const defaultBlocks: Record<FunctionType, BlockType[]> = {
  'it-infrastructure': [
    'architecture-diagram',
    'roi-calculator',
    'integration-checklist',
    'deployment-timeline',
    'security-review',
    'case-study',
  ],
  'revenue-operations': [
    'roi-calculator',
    'integration-checklist',
    'case-study',
    'live-stats',
    'deployment-timeline',
    'comparison-table',
  ],
  'customer-success': [
    'roi-calculator',
    'case-study',
    'integration-checklist',
    'live-stats',
    'deployment-timeline',
    'demo-video',
  ],
  'demand-generation': [
    'roi-calculator',
    'case-study',
    'integration-checklist',
    'live-stats',
    'comparison-table',
    'deployment-timeline',
  ],
}

export function ContentArea({ functionName, functionDescription }: ContentAreaProps) {
  const currentFunction = useConversationStore((state) => state.currentFunction)

  const FunctionIcon = currentFunction ? functionIcons[currentFunction] : Server
  const colorClass = currentFunction ? functionColors[currentFunction] : 'from-blue-500 to-blue-600'
  const functionType: FunctionType = currentFunction || 'it-infrastructure'

  // Get the default blocks for this function type
  const blocksToShow = defaultBlocks[functionType]

  return (
    <ScrollArea className="h-full">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-white border border-border shadow-sm p-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #0A2463 1px, transparent 0)`,
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
            <h1 className="text-3xl lg:text-4xl font-bold text-arq-deep-blue mb-4">
              {functionName}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl">
              {functionDescription}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="px-4 py-2 rounded-lg bg-arq-lime/10 border border-arq-lime/20">
                <span className="text-arq-deep-blue font-semibold">30 days</span>
                <span className="text-muted-foreground ml-2">to production</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-arq-lime/10 border border-arq-lime/20">
                <span className="text-arq-deep-blue font-semibold">3 patents</span>
                <span className="text-muted-foreground ml-2">protecting innovation</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Blocks - All shown from the start */}
        <div className="space-y-6">
          {blocksToShow.map((blockType, index) => (
            <motion.div
              key={blockType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <BlockWrapper blockType={blockType} functionType={functionType} />
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

// Component to render each block type
function BlockWrapper({ blockType, functionType }: { blockType: BlockType; functionType: FunctionType }) {
  switch (blockType) {
    case 'roi-calculator':
      return <ROICalculator functionType={functionType} />

    case 'demo-video':
      return <DemoVideo functionType={functionType} />

    case 'security-review':
      return <SecurityReview data={{}} />

    case 'architecture-diagram':
      return <ArchitectureDiagram functionType={functionType} data={{}} />

    case 'integration-checklist':
      return <IntegrationChecklist functionType={functionType} data={{}} />

    case 'deployment-timeline':
      return <DeploymentTimeline functionType={functionType} data={{}} />

    case 'case-study':
      return <CaseStudy functionType={functionType} data={{}} />

    case 'live-stats':
      return <LiveStats data={{}} />

    case 'code-snippet':
      return <CodeSnippet functionType={functionType} data={{}} />

    case 'comparison-table':
      return <ComparisonTable functionType={functionType} data={{}} />

    default:
      return null
  }
}

'use client'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useConversationStore } from '@/stores/conversation-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Server, TrendingUp, HeadphonesIcon, Megaphone, Sparkles } from 'lucide-react'
import type { FunctionType, BlockType } from '@/types'
import { cn } from '@/lib/utils'

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

// Block display names for headers
const blockNames: Record<BlockType, string> = {
  'roi-calculator': 'ROI Calculator',
  'demo-video': 'Product Demo',
  'security-review': 'Security & Compliance',
  'architecture-diagram': 'Architecture',
  'integration-checklist': 'Integrations',
  'deployment-timeline': 'Deployment Timeline',
  'case-study': 'Case Study',
  'live-stats': 'Live Metrics',
  'code-snippet': 'API Examples',
  'comparison-table': 'Comparison',
}

export function ContentArea({ functionName, functionDescription }: ContentAreaProps) {
  const currentFunction = useConversationStore((state) => state.currentFunction)
  const activeBlocks = useConversationStore((state) => state.activeBlocks)
  const highlightedBlock = useConversationStore((state) => state.highlightedBlock)
  const blockOrder = useConversationStore((state) => state.blockOrder)
  const activeTopics = useConversationStore((state) => state.activeTopics)

  const FunctionIcon = currentFunction ? functionIcons[currentFunction] : Server
  const colorClass = currentFunction ? functionColors[currentFunction] : 'from-blue-500 to-blue-600'
  const functionType: FunctionType = currentFunction || 'it-infrastructure'

  // Get ordered blocks - active blocks first, then remaining in order
  const orderedBlocks = [...blockOrder]

  // Split into active (expanded) and inactive (collapsed) blocks
  const expandedBlocks = orderedBlocks.filter(b => activeBlocks.includes(b))
  const collapsedBlocks = orderedBlocks.filter(b => !activeBlocks.includes(b))

  return (
    <ScrollArea className="h-full">
      <div className="p-6 lg:p-8 space-y-6">
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

            {/* Active Topics Indicator */}
            {activeTopics.length > 0 && activeTopics[0] !== 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mt-6"
              >
                <span className="text-sm text-muted-foreground">Currently exploring:</span>
                {activeTopics.map(topic => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-arq-lime/20 text-arq-deep-blue text-sm font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {topic.replace('-', ' ')}
                  </span>
                ))}
              </motion.div>
            )}

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

        {/* Active/Expanded Content Blocks */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {expandedBlocks.map((blockType) => (
              <motion.div
                key={blockType}
                layoutId={blockType}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 300, damping: 30 }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 }
                }}
                className={cn(
                  'relative',
                  highlightedBlock === blockType && 'z-10'
                )}
              >
                {/* Highlight glow effect */}
                {highlightedBlock === blockType && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -inset-2 bg-arq-lime/20 rounded-3xl blur-xl -z-10"
                  />
                )}
                <motion.div
                  animate={highlightedBlock === blockType ? {
                    boxShadow: '0 0 0 3px rgba(167, 255, 131, 0.5)',
                  } : {
                    boxShadow: 'none',
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden"
                >
                  <BlockWrapper
                    blockType={blockType}
                    functionType={functionType}
                    isHighlighted={highlightedBlock === blockType}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>

        {/* Collapsed/Minimized Blocks */}
        {collapsedBlocks.length > 0 && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">More resources:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <AnimatePresence>
                {collapsedBlocks.slice(0, 6).map((blockType) => (
                  <CollapsedBlock
                    key={blockType}
                    blockType={blockType}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

// Collapsed block preview card
function CollapsedBlock({ blockType }: { blockType: BlockType }) {
  return (
    <motion.div
      layoutId={blockType}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-muted/50 rounded-xl border border-border cursor-pointer hover:bg-muted transition-colors"
    >
      <p className="text-sm font-medium text-foreground truncate">
        {blockNames[blockType]}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Ask about this →
      </p>
    </motion.div>
  )
}

// Component to render each block type
function BlockWrapper({
  blockType,
  functionType,
  isHighlighted
}: {
  blockType: BlockType
  functionType: FunctionType
  isHighlighted?: boolean
}) {
  const commonProps = { isHighlighted }

  switch (blockType) {
    case 'roi-calculator':
      return <ROICalculator functionType={functionType} {...commonProps} />

    case 'demo-video':
      return <DemoVideo functionType={functionType} {...commonProps} />

    case 'security-review':
      return <SecurityReview data={{}} {...commonProps} />

    case 'architecture-diagram':
      return <ArchitectureDiagram functionType={functionType} data={{}} {...commonProps} />

    case 'integration-checklist':
      return <IntegrationChecklist functionType={functionType} data={{}} {...commonProps} />

    case 'deployment-timeline':
      return <DeploymentTimeline functionType={functionType} data={{}} {...commonProps} />

    case 'case-study':
      return <CaseStudy functionType={functionType} data={{}} {...commonProps} />

    case 'live-stats':
      return <LiveStats data={{}} {...commonProps} />

    case 'code-snippet':
      return <CodeSnippet functionType={functionType} data={{}} {...commonProps} />

    case 'comparison-table':
      return <ComparisonTable functionType={functionType} data={{}} {...commonProps} />

    default:
      return null
  }
}

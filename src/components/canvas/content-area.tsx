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
  'it-infrastructure': 'from-blue-500 to-cyan-400',
  'revenue-operations': 'from-emerald-500 to-teal-400',
  'customer-success': 'from-violet-500 to-purple-400',
  'demand-generation': 'from-orange-500 to-amber-400',
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
  const colorClass = currentFunction ? functionColors[currentFunction] : 'from-blue-500 to-cyan-400'
  const functionType: FunctionType = currentFunction || 'it-infrastructure'

  // Get ordered blocks - active blocks first, then remaining in order
  const orderedBlocks = [...blockOrder]

  // Split into active (expanded) and inactive (collapsed) blocks
  const expandedBlocks = orderedBlocks.filter(b => activeBlocks.includes(b))
  const collapsedBlocks = orderedBlocks.filter(b => !activeBlocks.includes(b))

  return (
    <ScrollArea className="h-full">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pointer-events-none" />

      <div className="relative p-6 lg:p-8 space-y-6">
        {/* Hero Section with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />

          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl border border-white/50" />

          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent" />

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #0A2463 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          <div className="relative p-8">
            {/* Gradient Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} text-white mb-6 shadow-lg`}
            >
              <FunctionIcon className="w-8 h-8" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl lg:text-4xl font-bold text-arq-deep-blue mb-4"
            >
              {functionName}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl"
            >
              {functionDescription}
            </motion.p>

            {/* Active Topics Indicator with glass effect */}
            <AnimatePresence>
              {activeTopics.length > 0 && activeTopics[0] !== 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex flex-wrap gap-2 mt-6"
                >
                  <span className="text-sm text-muted-foreground">Exploring:</span>
                  {activeTopics.map((topic, i) => (
                    <motion.span
                      key={topic}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-arq-lime/30 to-emerald-400/20 backdrop-blur-sm text-arq-deep-blue text-sm font-medium flex items-center gap-1.5 border border-arq-lime/30 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-arq-lime" />
                      {topic.replace('-', ' ')}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Stats with glass effect */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              <div className="px-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-arq-lime/20 shadow-sm">
                <span className="text-arq-deep-blue font-bold">30 days</span>
                <span className="text-muted-foreground ml-2">to production</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-arq-lime/20 shadow-sm">
                <span className="text-arq-deep-blue font-bold">3 patents</span>
                <span className="text-muted-foreground ml-2">protecting innovation</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Active/Expanded Content Blocks with Glass Morphism */}
        <LayoutGroup>
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {expandedBlocks.map((blockType, index) => (
                <motion.div
                  key={blockType}
                  layout
                  layoutId={`block-${blockType}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      delay: index * 0.05
                    }
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    scale: 0.95,
                    transition: { duration: 0.25 }
                  }}
                  className="relative"
                >
                  {/* Highlight glow effect - futuristic */}
                  <AnimatePresence>
                    {highlightedBlock === blockType && (
                      <>
                        {/* Animated gradient sweep */}
                        <motion.div
                          initial={{ opacity: 0, x: '-100%' }}
                          animate={{
                            opacity: [0, 0.6, 0],
                            x: ['100%', '-100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: 'easeInOut'
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-arq-lime/30 to-transparent rounded-2xl pointer-events-none z-20"
                        />

                        {/* Outer diffused glow */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: [0.4, 0.7, 0.4],
                            scale: [1, 1.02, 1]
                          }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          className="absolute -inset-4 bg-gradient-to-r from-arq-lime/30 via-emerald-400/40 to-cyan-400/30 rounded-[2rem] blur-2xl -z-10"
                        />

                        {/* Inner glow ring */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                            scale: 1
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -inset-1 bg-gradient-to-br from-arq-lime/25 via-emerald-400/20 to-arq-lime/25 rounded-3xl blur-lg -z-10"
                        />

                        {/* Sparkle dots */}
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.4,
                              ease: 'easeInOut'
                            }}
                            className="absolute w-2 h-2 bg-arq-lime rounded-full -z-10"
                            style={{
                              top: i === 0 ? '-4px' : i === 1 ? '50%' : i === 2 ? 'auto' : '50%',
                              bottom: i === 2 ? '-4px' : 'auto',
                              left: i === 0 ? '50%' : i === 3 ? '-4px' : 'auto',
                              right: i === 1 ? '-4px' : 'auto',
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  {/* Glass container */}
                  <motion.div
                    initial={false}
                    animate={highlightedBlock === blockType ? {
                      scale: [1, 1.015, 1],
                      y: [0, -4, 0],
                      boxShadow: [
                        '0 0 0 2px rgba(167, 255, 131, 0.4), 0 25px 60px -12px rgba(167, 255, 131, 0.3), 0 0 40px -10px rgba(52, 211, 153, 0.3)',
                        '0 0 0 3px rgba(167, 255, 131, 0.6), 0 30px 70px -12px rgba(167, 255, 131, 0.4), 0 0 50px -8px rgba(52, 211, 153, 0.4)',
                        '0 0 0 2px rgba(167, 255, 131, 0.4), 0 25px 60px -12px rgba(167, 255, 131, 0.3), 0 0 40px -10px rgba(52, 211, 153, 0.3)',
                      ],
                    } : {
                      scale: 1,
                      y: 0,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    }}
                    transition={highlightedBlock === blockType ? {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    } : {
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className={cn(
                      'relative overflow-hidden rounded-2xl',
                      'bg-white/90 backdrop-blur-md border transition-colors duration-300',
                      highlightedBlock === blockType
                        ? 'border-arq-lime/50 z-10'
                        : 'border-white/50'
                    )}
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
          </div>
        </LayoutGroup>

        {/* Collapsed/Minimized Blocks with Glass Effect */}
        <AnimatePresence>
          {collapsedBlocks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-6"
            >
              <p className="text-sm text-muted-foreground mb-4 font-medium">More resources:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {collapsedBlocks.slice(0, 6).map((blockType, i) => (
                  <CollapsedBlock
                    key={blockType}
                    blockType={blockType}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}

// Collapsed block preview card with glass effect
function CollapsedBlock({ blockType, index }: { blockType: BlockType; index: number }) {
  return (
    <motion.div
      layout
      layoutId={`block-${blockType}`}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { delay: index * 0.03 }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        scale: 1.03,
        y: -2,
        transition: { type: 'spring', stiffness: 400 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'p-4 rounded-xl cursor-pointer transition-all duration-200',
        'bg-white/60 backdrop-blur-sm',
        'border border-white/50 hover:border-arq-lime/30',
        'hover:bg-white/80 hover:shadow-lg hover:shadow-arq-lime/10'
      )}
    >
      <p className="text-sm font-medium text-foreground truncate">
        {blockNames[blockType]}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-arq-lime" />
        Ask about this
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

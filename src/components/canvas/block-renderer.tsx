'use client'

import { X } from 'lucide-react'
import type { ContentBlock, FunctionType } from '@/types'
import { useConversationStore } from '@/stores/conversation-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

interface BlockRendererProps {
  block: ContentBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const removeBlock = useConversationStore((state) => state.removeBlock)
  const currentFunction = useConversationStore((state) => state.currentFunction)

  // Default to a function type if not set
  const functionType: FunctionType = currentFunction || 'it-infrastructure'

  const renderBlock = () => {
    switch (block.type) {
      case 'roi-calculator':
        return (
          <ROICalculator
            functionType={functionType}
            defaultInputs={block.data.defaultInputs as Record<string, number> | undefined}
          />
        )

      case 'demo-video':
        return (
          <DemoVideo
            functionType={functionType}
            videoId={block.data.videoId as string | undefined}
            title={block.data.title as string | undefined}
          />
        )

      case 'security-review':
        return <SecurityReview data={block.data} />

      case 'architecture-diagram':
        return <ArchitectureDiagram functionType={functionType} data={block.data} />

      case 'integration-checklist':
        return (
          <IntegrationChecklist
            functionType={functionType}
            techStack={block.data.techStack as string[] | undefined}
            data={block.data}
          />
        )

      case 'deployment-timeline':
        return (
          <DeploymentTimeline
            functionType={functionType}
            companyName={block.data.companyName as string | undefined}
            data={block.data}
          />
        )

      case 'case-study':
        return (
          <CaseStudy
            functionType={functionType}
            industry={block.data.industry as string | undefined}
            data={block.data}
          />
        )

      case 'live-stats':
        return <LiveStats data={block.data} />

      case 'code-snippet':
        return (
          <CodeSnippet
            functionType={functionType}
            language={block.data.language as string | undefined}
            data={block.data}
          />
        )

      case 'comparison-table':
        return (
          <ComparisonTable
            functionType={functionType}
            competitors={block.data.competitors as string[] | undefined}
            data={block.data}
          />
        )

      default:
        return <GenericBlockPlaceholder type={block.type} />
    }
  }

  return (
    <div className="relative group">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeBlock(block.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white/50 hover:text-white hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </Button>

      {renderBlock()}
    </div>
  )
}

// Fallback for unknown block types
function GenericBlockPlaceholder({ type }: { type: string }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white capitalize">{type.replace(/-/g, ' ')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Unknown block type: {type}</p>
        </div>
      </CardContent>
    </Card>
  )
}

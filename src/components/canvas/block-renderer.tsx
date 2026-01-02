'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ContentBlock } from '@/types'
import { useConversationStore } from '@/stores/conversation-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BlockRendererProps {
  block: ContentBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const removeBlock = useConversationStore((state) => state.removeBlock)

  // Placeholder renders for each block type
  // These will be replaced with full implementations in Phase 5
  const renderBlock = () => {
    switch (block.type) {
      case 'roi-calculator':
        return <ROICalculatorPlaceholder data={block.data} />
      case 'demo-video':
        return <DemoVideoPlaceholder data={block.data} />
      case 'security-review':
        return <SecurityReviewPlaceholder data={block.data} />
      case 'architecture-diagram':
        return <ArchitectureDiagramPlaceholder data={block.data} />
      case 'integration-checklist':
        return <IntegrationChecklistPlaceholder data={block.data} />
      case 'deployment-timeline':
        return <DeploymentTimelinePlaceholder data={block.data} />
      case 'case-study':
        return <CaseStudyPlaceholder data={block.data} />
      case 'live-stats':
        return <LiveStatsPlaceholder data={block.data} />
      case 'code-snippet':
        return <CodeSnippetPlaceholder data={block.data} />
      case 'comparison-table':
        return <ComparisonTablePlaceholder data={block.data} />
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

// Placeholder Components (to be replaced in Phase 5)

function ROICalculatorPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">ROI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">ROI Calculator (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DemoVideoPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Demo Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Demo Video (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SecurityReviewPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Security Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Security Review Package (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ArchitectureDiagramPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Architecture Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Interactive Architecture (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function IntegrationChecklistPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Integration Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Integration Checklist (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DeploymentTimelinePlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">30-Day Deployment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Deployment Timeline (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function CaseStudyPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Case Study</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Case Study (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function LiveStatsPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Live Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Live Stats (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function CodeSnippetPlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Code Snippet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-arq-slate font-mono text-sm flex items-center justify-center">
          <p className="text-white/40">Code Snippet (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ComparisonTablePlaceholder({ data }: { data: Record<string, unknown> }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Comparison Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Comparison Table (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function GenericBlockPlaceholder({ type }: { type: string }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white capitalize">{type.replace('-', ' ')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 rounded-lg bg-white/5 flex items-center justify-center">
          <p className="text-white/40 text-sm">Content Block (Phase 5)</p>
        </div>
      </CardContent>
    </Card>
  )
}

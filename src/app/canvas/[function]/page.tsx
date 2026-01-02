'use client'

import { useParams, notFound } from 'next/navigation'
import { CanvasLayout } from '@/components/canvas/canvas-layout'
import type { FunctionType } from '@/types'

const functionConfig: Record<string, { name: string; description: string }> = {
  'it-infrastructure': {
    name: 'Autonomous IT Infrastructure',
    description: 'Automate IT operations with governed agents that handle incidents, deployments, and infrastructure management with full audit trails and compliance.',
  },
  'revenue-operations': {
    name: 'Revenue Operations Automation',
    description: 'Streamline sales workflows, automate data entry, and optimize your revenue pipeline with intelligent agents that respect your data governance policies.',
  },
  'customer-success': {
    name: 'Autonomous Customer Success',
    description: 'Deliver exceptional customer experiences with AI agents that handle support, onboarding, and success workflows while maintaining compliance and quality.',
  },
  'demand-generation': {
    name: 'Autonomous Demand Generation',
    description: 'Scale your marketing with agents that automate campaigns, qualify leads, and drive pipeline growth—all with full transparency and governance.',
  },
}

export default function CanvasPage() {
  const params = useParams()
  const functionId = params.function as string

  // Validate function ID
  if (!functionConfig[functionId]) {
    notFound()
  }

  const config = functionConfig[functionId]

  return (
    <CanvasLayout
      functionId={functionId as FunctionType}
      functionName={config.name}
      functionDescription={config.description}
    />
  )
}

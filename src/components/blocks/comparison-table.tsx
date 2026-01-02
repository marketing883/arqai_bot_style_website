'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, Check, X, Minus, Info, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FunctionType } from '@/types'

interface ComparisonTableProps {
  functionType: FunctionType
  competitors?: string[]
  data?: Record<string, unknown>
}

interface Feature {
  name: string
  arqai: 'yes' | 'no' | 'partial'
  competitors: Record<string, 'yes' | 'no' | 'partial'>
  tooltip?: string
}

const comparisonData: Record<FunctionType, {
  competitors: string[]
  features: Feature[]
}> = {
  'it-infrastructure': {
    competitors: ['ServiceNow AI', 'PagerDuty AIOps', 'Zapier'],
    features: [
      { name: 'Autonomous incident resolution', arqai: 'yes', competitors: { 'ServiceNow AI': 'partial', 'PagerDuty AIOps': 'partial', 'Zapier': 'no' } },
      { name: 'Cross-system orchestration', arqai: 'yes', competitors: { 'ServiceNow AI': 'partial', 'PagerDuty AIOps': 'no', 'Zapier': 'yes' } },
      { name: 'Trust-aware governance', arqai: 'yes', competitors: { 'ServiceNow AI': 'partial', 'PagerDuty AIOps': 'no', 'Zapier': 'no' }, tooltip: 'Patented technology' },
      { name: 'Real-time learning', arqai: 'yes', competitors: { 'ServiceNow AI': 'yes', 'PagerDuty AIOps': 'yes', 'Zapier': 'no' } },
      { name: '30-day deployment', arqai: 'yes', competitors: { 'ServiceNow AI': 'no', 'PagerDuty AIOps': 'partial', 'Zapier': 'yes' } },
      { name: 'No code required', arqai: 'yes', competitors: { 'ServiceNow AI': 'partial', 'PagerDuty AIOps': 'yes', 'Zapier': 'yes' } },
      { name: 'SOC 2 + HIPAA', arqai: 'yes', competitors: { 'ServiceNow AI': 'yes', 'PagerDuty AIOps': 'yes', 'Zapier': 'yes' } },
    ],
  },
  'revenue-operations': {
    competitors: ['Salesforce Einstein', 'Zapier', 'Make.com'],
    features: [
      { name: 'CRM auto-population', arqai: 'yes', competitors: { 'Salesforce Einstein': 'partial', 'Zapier': 'partial', 'Make.com': 'partial' } },
      { name: 'Cross-platform sync', arqai: 'yes', competitors: { 'Salesforce Einstein': 'no', 'Zapier': 'yes', 'Make.com': 'yes' } },
      { name: 'AI-powered forecasting', arqai: 'yes', competitors: { 'Salesforce Einstein': 'yes', 'Zapier': 'no', 'Make.com': 'no' } },
      { name: 'Deal intelligence', arqai: 'yes', competitors: { 'Salesforce Einstein': 'partial', 'Zapier': 'no', 'Make.com': 'no' } },
      { name: 'Real-time data hygiene', arqai: 'yes', competitors: { 'Salesforce Einstein': 'partial', 'Zapier': 'partial', 'Make.com': 'partial' } },
      { name: 'No vendor lock-in', arqai: 'yes', competitors: { 'Salesforce Einstein': 'no', 'Zapier': 'yes', 'Make.com': 'yes' } },
    ],
  },
  'customer-success': {
    competitors: ['Zendesk AI', 'Intercom Fin', 'Ada'],
    features: [
      { name: 'Intelligent ticket routing', arqai: 'yes', competitors: { 'Zendesk AI': 'yes', 'Intercom Fin': 'yes', 'Ada': 'partial' } },
      { name: 'Multi-channel support', arqai: 'yes', competitors: { 'Zendesk AI': 'yes', 'Intercom Fin': 'yes', 'Ada': 'partial' } },
      { name: 'Autonomous resolution', arqai: 'yes', competitors: { 'Zendesk AI': 'partial', 'Intercom Fin': 'yes', 'Ada': 'yes' } },
      { name: 'CRM integration', arqai: 'yes', competitors: { 'Zendesk AI': 'partial', 'Intercom Fin': 'partial', 'Ada': 'no' } },
      { name: 'Human escalation workflow', arqai: 'yes', competitors: { 'Zendesk AI': 'yes', 'Intercom Fin': 'yes', 'Ada': 'yes' } },
      { name: 'Custom domain training', arqai: 'yes', competitors: { 'Zendesk AI': 'partial', 'Intercom Fin': 'partial', 'Ada': 'yes' } },
    ],
  },
  'demand-generation': {
    competitors: ['HubSpot AI', '6sense', 'Marketo'],
    features: [
      { name: 'AI lead scoring', arqai: 'yes', competitors: { 'HubSpot AI': 'yes', '6sense': 'yes', 'Marketo': 'yes' } },
      { name: 'Multi-channel orchestration', arqai: 'yes', competitors: { 'HubSpot AI': 'partial', '6sense': 'partial', 'Marketo': 'yes' } },
      { name: 'Intent-based routing', arqai: 'yes', competitors: { 'HubSpot AI': 'partial', '6sense': 'yes', 'Marketo': 'partial' } },
      { name: 'Real-time personalization', arqai: 'yes', competitors: { 'HubSpot AI': 'partial', '6sense': 'yes', 'Marketo': 'partial' } },
      { name: 'CRM bi-directional sync', arqai: 'yes', competitors: { 'HubSpot AI': 'yes', '6sense': 'partial', 'Marketo': 'yes' } },
      { name: 'Campaign analytics', arqai: 'yes', competitors: { 'HubSpot AI': 'yes', '6sense': 'yes', 'Marketo': 'yes' } },
    ],
  },
}

function FeatureStatus({ status }: { status: 'yes' | 'no' | 'partial' }) {
  if (status === 'yes') {
    return <Check className="w-4 h-4 text-green-600" />
  }
  if (status === 'no') {
    return <X className="w-4 h-4 text-red-500" />
  }
  return <Minus className="w-4 h-4 text-yellow-500" />
}

export function ComparisonTable({ functionType, competitors, data }: ComparisonTableProps) {
  const [expanded, setExpanded] = useState(true)
  const comparison = comparisonData[functionType]
  const displayCompetitors = competitors || comparison.competitors

  // Count ArqAI advantages
  const arqaiWins = comparison.features.filter(
    (f) =>
      f.arqai === 'yes' &&
      displayCompetitors.every((c) => f.competitors[c] !== 'yes')
  ).length

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-arq-lime/20">
              <Scale className="w-5 h-5 text-arq-deep-blue" />
            </div>
            <div>
              <CardTitle className="text-foreground text-lg">Feature Comparison</CardTitle>
              <p className="text-muted-foreground text-sm">
                ArqAI vs. alternatives
              </p>
            </div>
          </div>
          <Badge className="bg-arq-deep-blue/10 text-arq-deep-blue border-arq-deep-blue/30">
            {arqaiWins} unique advantages
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground text-xs font-medium">
                  Feature
                </th>
                <th className="text-center py-2 px-3 text-arq-deep-blue text-xs font-medium">
                  ArqAI
                </th>
                {displayCompetitors.map((competitor) => (
                  <th key={competitor} className="text-center py-2 px-3 text-muted-foreground text-xs font-medium">
                    {competitor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.features
                .slice(0, expanded ? undefined : 4)
                .map((feature, index) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <span className="text-foreground text-sm">{feature.name}</span>
                        {feature.tooltip && (
                          <div className="group relative">
                            <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-10">
                              <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                                {feature.tooltip}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex justify-center">
                        <div className="p-1 rounded bg-arq-deep-blue/10">
                          <FeatureStatus status={feature.arqai} />
                        </div>
                      </div>
                    </td>
                    {displayCompetitors.map((competitor) => (
                      <td key={competitor} className="py-2 px-3 text-center">
                        <div className="flex justify-center">
                          <FeatureStatus status={feature.competitors[competitor]} />
                        </div>
                      </td>
                    ))}
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Show more/less */}
        {comparison.features.length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {expanded ? 'Show Less' : `Show ${comparison.features.length - 4} More Features`}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-600" />
            <span className="text-muted-foreground text-xs">Full support</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="w-3 h-3 text-yellow-500" />
            <span className="text-muted-foreground text-xs">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-3 h-3 text-red-500" />
            <span className="text-muted-foreground text-xs">Not available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

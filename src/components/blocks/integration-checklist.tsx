'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plug, Check, X, Clock, ChevronRight, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { FunctionType } from '@/types'

interface IntegrationChecklistProps {
  functionType: FunctionType
  techStack?: string[]
  data?: Record<string, unknown>
}

const integrations: Record<string, {
  name: string
  category: string
  status: 'available' | 'beta' | 'coming-soon'
  functions: FunctionType[]
  logo?: string
}> = {
  salesforce: {
    name: 'Salesforce',
    category: 'CRM',
    status: 'available',
    functions: ['revenue-operations', 'customer-success', 'demand-generation'],
  },
  hubspot: {
    name: 'HubSpot',
    category: 'Marketing',
    status: 'available',
    functions: ['revenue-operations', 'demand-generation'],
  },
  servicenow: {
    name: 'ServiceNow',
    category: 'ITSM',
    status: 'available',
    functions: ['it-infrastructure', 'customer-success'],
  },
  zendesk: {
    name: 'Zendesk',
    category: 'Support',
    status: 'available',
    functions: ['customer-success'],
  },
  pagerduty: {
    name: 'PagerDuty',
    category: 'Incident',
    status: 'available',
    functions: ['it-infrastructure'],
  },
  jira: {
    name: 'Jira',
    category: 'Project',
    status: 'available',
    functions: ['it-infrastructure', 'revenue-operations'],
  },
  slack: {
    name: 'Slack',
    category: 'Communication',
    status: 'available',
    functions: ['it-infrastructure', 'revenue-operations', 'customer-success', 'demand-generation'],
  },
  teams: {
    name: 'Microsoft Teams',
    category: 'Communication',
    status: 'available',
    functions: ['it-infrastructure', 'revenue-operations', 'customer-success', 'demand-generation'],
  },
  marketo: {
    name: 'Marketo',
    category: 'Marketing',
    status: 'available',
    functions: ['demand-generation'],
  },
  intercom: {
    name: 'Intercom',
    category: 'Support',
    status: 'available',
    functions: ['customer-success', 'demand-generation'],
  },
  snowflake: {
    name: 'Snowflake',
    category: 'Data',
    status: 'beta',
    functions: ['revenue-operations', 'demand-generation'],
  },
  datadog: {
    name: 'Datadog',
    category: 'Monitoring',
    status: 'beta',
    functions: ['it-infrastructure'],
  },
  sap: {
    name: 'SAP',
    category: 'ERP',
    status: 'coming-soon',
    functions: ['revenue-operations'],
  },
  oracle: {
    name: 'Oracle',
    category: 'ERP',
    status: 'coming-soon',
    functions: ['revenue-operations', 'it-infrastructure'],
  },
}

export function IntegrationChecklist({ functionType, techStack = [], data }: IntegrationChecklistProps) {
  const [search, setSearch] = useState('')

  // Filter integrations by function type
  const relevantIntegrations = Object.entries(integrations)
    .filter(([_, int]) => int.functions.includes(functionType))
    .filter(([key, int]) =>
      search
        ? int.name.toLowerCase().includes(search.toLowerCase()) ||
          int.category.toLowerCase().includes(search.toLowerCase())
        : true
    )

  const available = relevantIntegrations.filter(([_, int]) => int.status === 'available')
  const beta = relevantIntegrations.filter(([_, int]) => int.status === 'beta')
  const comingSoon = relevantIntegrations.filter(([_, int]) => int.status === 'coming-soon')

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Plug className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-foreground text-lg">Integrations</CardTitle>
              <p className="text-muted-foreground text-sm">
                {available.length} integrations ready for your stack
              </p>
            </div>
          </div>
          <Badge className="bg-arq-deep-blue/10 text-arq-deep-blue border-arq-deep-blue/30">
            {relevantIntegrations.length} total
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Available Integrations */}
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Available ({available.length})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {available.slice(0, 6).map(([key, int], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group border border-border"
              >
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
                  {int.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm truncate">{int.name}</p>
                  <p className="text-muted-foreground text-xs">{int.category}</p>
                </div>
                <Check className="w-4 h-4 text-green-600" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Beta Integrations */}
        {beta.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Beta ({beta.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {beta.map(([key, int]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                >
                  <span className="text-foreground text-sm">{int.name}</span>
                  <Badge className="bg-yellow-500/20 text-yellow-600 border-0 text-xs">
                    Beta
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Coming Soon ({comingSoon.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {comingSoon.map(([key, int]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground border border-border"
                >
                  <Clock className="w-3 h-3" />
                  <span className="text-sm">{int.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Integration CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-muted-foreground text-xs">
            Need a custom integration?
          </p>
          <Button size="sm" variant="ghost" className="text-arq-deep-blue hover:bg-arq-deep-blue/10">
            Request Integration
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

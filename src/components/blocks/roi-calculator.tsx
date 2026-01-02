'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, DollarSign, Clock, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { FunctionType } from '@/types'

interface ROICalculatorProps {
  functionType: FunctionType
  defaultInputs?: {
    incidents?: number
    avgResolutionTime?: number
    teamSize?: number
    deals?: number
    dataEntryHours?: number
    tickets?: number
    avgHandleTime?: number
    leads?: number
    qualificationTime?: number
  }
}

const functionConfigs: Record<FunctionType, {
  title: string
  description: string
  fields: { key: string; label: string; unit: string; icon: React.ElementType; default: number }[]
  calculate: (inputs: Record<string, number>) => { hoursSaved: number; costSaved: number; roiPercent: number }
}> = {
  'it-infrastructure': {
    title: 'IT Infrastructure ROI',
    description: 'Calculate savings from automating incident response and deployments',
    fields: [
      { key: 'incidents', label: 'Monthly Incidents', unit: 'incidents', icon: TrendingUp, default: 100 },
      { key: 'avgResolutionTime', label: 'Avg Resolution Time', unit: 'hours', icon: Clock, default: 4 },
      { key: 'teamSize', label: 'Team Size', unit: 'engineers', icon: Users, default: 10 },
    ],
    calculate: (inputs) => {
      const hoursSaved = inputs.incidents * inputs.avgResolutionTime * 0.6 // 60% automation
      const hourlyRate = 75 // Average IT engineer rate
      const costSaved = hoursSaved * hourlyRate
      const arqaiCost = 2000 // Monthly ArqAI cost estimate
      const roiPercent = ((costSaved - arqaiCost) / arqaiCost) * 100
      return { hoursSaved, costSaved, roiPercent }
    },
  },
  'revenue-operations': {
    title: 'Revenue Operations ROI',
    description: 'Calculate savings from automating CRM data entry and pipeline management',
    fields: [
      { key: 'deals', label: 'Monthly Deals', unit: 'deals', icon: TrendingUp, default: 500 },
      { key: 'dataEntryHours', label: 'Data Entry Hours/Week', unit: 'hours', icon: Clock, default: 20 },
      { key: 'teamSize', label: 'Team Size', unit: 'reps', icon: Users, default: 15 },
    ],
    calculate: (inputs) => {
      const hoursSaved = inputs.dataEntryHours * 4 * 0.85 // 85% automation, 4 weeks
      const hourlyRate = 50 // Average RevOps rate
      const costSaved = hoursSaved * inputs.teamSize * hourlyRate
      const arqaiCost = 3000
      const roiPercent = ((costSaved - arqaiCost) / arqaiCost) * 100
      return { hoursSaved: hoursSaved * inputs.teamSize, costSaved, roiPercent }
    },
  },
  'customer-success': {
    title: 'Customer Success ROI',
    description: 'Calculate savings from automating ticket handling and customer support',
    fields: [
      { key: 'tickets', label: 'Monthly Tickets', unit: 'tickets', icon: TrendingUp, default: 1000 },
      { key: 'avgHandleTime', label: 'Avg Handle Time', unit: 'minutes', icon: Clock, default: 30 },
      { key: 'teamSize', label: 'Team Size', unit: 'agents', icon: Users, default: 20 },
    ],
    calculate: (inputs) => {
      const hoursSaved = (inputs.tickets * inputs.avgHandleTime * 0.4) / 60 // 40% automation
      const hourlyRate = 35 // Average CS agent rate
      const costSaved = hoursSaved * hourlyRate
      const arqaiCost = 2500
      const roiPercent = ((costSaved - arqaiCost) / arqaiCost) * 100
      return { hoursSaved, costSaved, roiPercent }
    },
  },
  'demand-generation': {
    title: 'Demand Generation ROI',
    description: 'Calculate savings from automating lead qualification and campaign management',
    fields: [
      { key: 'leads', label: 'Monthly Leads', unit: 'leads', icon: TrendingUp, default: 5000 },
      { key: 'qualificationTime', label: 'Qualification Time', unit: 'minutes/lead', icon: Clock, default: 10 },
      { key: 'teamSize', label: 'Team Size', unit: 'marketers', icon: Users, default: 8 },
    ],
    calculate: (inputs) => {
      const hoursSaved = (inputs.leads * inputs.qualificationTime * 0.7) / 60 // 70% automation
      const hourlyRate = 55 // Average marketer rate
      const costSaved = hoursSaved * hourlyRate
      const arqaiCost = 2500
      const roiPercent = ((costSaved - arqaiCost) / arqaiCost) * 100
      return { hoursSaved, costSaved, roiPercent }
    },
  },
}

export function ROICalculator({ functionType, defaultInputs }: ROICalculatorProps) {
  const config = functionConfigs[functionType]
  const [expanded, setExpanded] = useState(true)
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    config.fields.forEach((field) => {
      initial[field.key] = defaultInputs?.[field.key as keyof typeof defaultInputs] ?? field.default
    })
    return initial
  })

  const results = useMemo(() => config.calculate(inputs), [inputs, config])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-arq-lime/20">
              <Calculator className="w-5 h-5 text-arq-deep-blue" />
            </div>
            <div>
              <CardTitle className="text-foreground text-lg">{config.title}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">{config.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {config.fields.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.key} className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={inputs[field.key]}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          [field.key]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="bg-muted border-border text-foreground pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {field.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* Results */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-muted/50 rounded-xl p-4 text-center border border-border"
          >
            <Clock className="w-5 h-5 text-arq-deep-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{formatNumber(results.hoursSaved)}</div>
            <div className="text-muted-foreground text-sm">Hours Saved/Month</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-muted/50 rounded-xl p-4 text-center border border-border"
          >
            <DollarSign className="w-5 h-5 text-arq-deep-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{formatCurrency(results.costSaved)}</div>
            <div className="text-muted-foreground text-sm">Monthly Savings</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-arq-deep-blue rounded-xl p-4 text-center"
          >
            <TrendingUp className="w-5 h-5 text-arq-lime mx-auto mb-2" />
            <div className="text-2xl font-bold text-arq-lime">{formatNumber(results.roiPercent)}%</div>
            <div className="text-white/80 text-sm">ROI in 90 Days</div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-muted-foreground text-xs">
            Based on industry averages. Your results may vary.
          </p>
          <Button size="sm" className="bg-arq-deep-blue text-white hover:bg-arq-deep-blue/90">
            Get Custom Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

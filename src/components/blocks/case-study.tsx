'use client'

import { motion } from 'framer-motion'
import { Building2, TrendingUp, Clock, Users, Quote, ArrowRight, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FunctionType } from '@/types'

interface CaseStudyProps {
  functionType: FunctionType
  industry?: string
  data?: Record<string, unknown>
}

const caseStudies: Record<FunctionType, {
  company: string
  industry: string
  logo?: string
  challenge: string
  solution: string
  quote: {
    text: string
    author: string
    title: string
  }
  metrics: { label: string; value: string; change: string }[]
}> = {
  'it-infrastructure': {
    company: 'Global Financial Services Corp',
    industry: 'Financial Services',
    challenge: 'Managing 500+ daily incidents across 12 data centers with a team of 45 engineers',
    solution: 'ArqAI automated incident triage, resolution, and root cause analysis',
    quote: {
      text: 'ArqAI reduced our MTTR by 73% while our team now focuses on strategic projects instead of firefighting.',
      author: 'Sarah Chen',
      title: 'VP of Infrastructure',
    },
    metrics: [
      { label: 'MTTR Reduction', value: '73%', change: '4.2hrs → 1.1hrs' },
      { label: 'Auto-Resolved', value: '65%', change: 'of incidents' },
      { label: 'Cost Savings', value: '$2.1M', change: 'annual' },
    ],
  },
  'revenue-operations': {
    company: 'FastGrow SaaS',
    industry: 'B2B SaaS',
    challenge: 'Sales reps spending 30% of time on CRM data entry and pipeline hygiene',
    solution: 'ArqAI automated CRM updates, lead enrichment, and pipeline forecasting',
    quote: {
      text: 'Our sales team now spends time selling, not typing. Win rates are up 23% since implementing ArqAI.',
      author: 'Michael Torres',
      title: 'CRO',
    },
    metrics: [
      { label: 'Time Saved', value: '12hrs', change: 'per rep/week' },
      { label: 'Win Rate', value: '+23%', change: 'improvement' },
      { label: 'Data Accuracy', value: '98%', change: 'vs 72% before' },
    ],
  },
  'customer-success': {
    company: 'Enterprise Software Inc',
    industry: 'Enterprise Software',
    challenge: '10,000+ support tickets monthly with 48-hour average response time',
    solution: 'ArqAI handles Tier 1 support and intelligently routes complex issues',
    quote: {
      text: 'Customer satisfaction scores jumped 34 points. ArqAI handles routine queries while our team tackles complex problems.',
      author: 'Jennifer Park',
      title: 'VP of Customer Success',
    },
    metrics: [
      { label: 'Response Time', value: '< 5min', change: 'from 48hrs' },
      { label: 'CSAT Score', value: '+34pts', change: 'improvement' },
      { label: 'Tickets/Agent', value: '3x', change: 'capacity' },
    ],
  },
  'demand-generation': {
    company: 'HealthTech Innovators',
    industry: 'Healthcare Technology',
    challenge: 'Qualifying 50,000 leads monthly with inconsistent criteria and slow follow-up',
    solution: 'ArqAI automated lead scoring, qualification, and personalized nurture campaigns',
    quote: {
      text: 'Our marketing qualified leads are now 3x more likely to convert. The speed of qualification changed everything.',
      author: 'David Kim',
      title: 'CMO',
    },
    metrics: [
      { label: 'MQL to SQL', value: '3x', change: 'conversion rate' },
      { label: 'Lead Response', value: '< 2min', change: 'from 4hrs' },
      { label: 'Campaign ROI', value: '+156%', change: 'improvement' },
    ],
  },
}

export function CaseStudy({ functionType, industry, data }: CaseStudyProps) {
  const study = caseStudies[functionType]

  return (
    <Card className="bg-gradient-to-br from-arq-deep-blue/90 to-arq-slate border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Customer Success Story</CardTitle>
              <p className="text-white/60 text-sm">{study.industry}</p>
            </div>
          </div>
          <Badge className="bg-white/10 text-white/70 border-white/20">
            {study.company}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Challenge & Solution */}
        <div className="space-y-3">
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <h4 className="text-red-400 text-xs font-medium uppercase tracking-wide mb-1">
              The Challenge
            </h4>
            <p className="text-white/80 text-sm">{study.challenge}</p>
          </div>

          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <h4 className="text-green-400 text-xs font-medium uppercase tracking-wide mb-1">
              The Solution
            </h4>
            <p className="text-white/80 text-sm">{study.solution}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {study.metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3 text-center"
            >
              <div className="text-2xl font-bold text-arq-lime">{metric.value}</div>
              <div className="text-white text-xs font-medium">{metric.label}</div>
              <div className="text-white/40 text-xs mt-1">{metric.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative bg-white/5 rounded-lg p-4"
        >
          <Quote className="absolute top-3 left-3 w-6 h-6 text-arq-lime/30" />
          <blockquote className="text-white/80 text-sm italic pl-6 mb-3">
            &ldquo;{study.quote.text}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3 pl-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-arq-lime to-green-500 flex items-center justify-center text-arq-slate text-xs font-bold">
              {study.quote.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{study.quote.author}</p>
              <p className="text-white/50 text-xs">{study.quote.title}</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
          <Button size="sm" className="bg-arq-lime text-arq-slate hover:bg-arq-lime/90 flex-1">
            Read Full Case Study
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

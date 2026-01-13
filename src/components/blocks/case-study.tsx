'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, TrendingUp, Clock, Users, Quote, ArrowRight, ExternalLink, X, CheckCircle2, Target, Lightbulb, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FunctionType } from '@/types'

interface CaseStudyProps {
  functionType: FunctionType
  industry?: string
  data?: Record<string, unknown>
  isHighlighted?: boolean
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
  // Extended content for full view
  fullContent: {
    overview: string
    challenges: string[]
    solutionDetails: string[]
    implementation: { phase: string; duration: string; description: string }[]
    results: { metric: string; before: string; after: string; improvement: string }[]
    testimonial: string
    nextSteps: string[]
  }
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
    fullContent: {
      overview: 'Global Financial Services Corp is a Fortune 500 financial institution managing over $500B in assets. With 12 data centers across 3 continents, their IT infrastructure team was drowning in alerts and incidents.',
      challenges: [
        'Over 500 daily incidents requiring manual triage and investigation',
        'Average MTTR of 4.2 hours impacting SLA compliance',
        'Engineers spending 70% of time on repetitive incident response',
        'Compliance requirements demanding detailed audit trails for every action',
        'Alert fatigue leading to missed critical incidents'
      ],
      solutionDetails: [
        'Deployed ArqAI\'s Trust-Aware Orchestration™ for governed automation',
        'Integrated with ServiceNow, PagerDuty, and Splunk in under 5 days',
        'Implemented AI-driven incident classification and routing',
        'Enabled autonomous resolution for known incident patterns',
        'Created compliance-ready audit trails for all automated actions'
      ],
      implementation: [
        { phase: 'Discovery & Planning', duration: 'Week 1', description: 'Infrastructure audit, integration mapping, and governance policy definition' },
        { phase: 'Integration & Configuration', duration: 'Week 2-3', description: 'Connected to existing tools, trained models on historical incident data' },
        { phase: 'Pilot & Validation', duration: 'Week 3', description: 'Shadow mode testing, human-in-the-loop validation of automated decisions' },
        { phase: 'Production & Optimization', duration: 'Week 4', description: 'Full deployment with continuous learning and feedback loops' }
      ],
      results: [
        { metric: 'Mean Time to Resolution', before: '4.2 hours', after: '1.1 hours', improvement: '73% reduction' },
        { metric: 'Incidents Auto-Resolved', before: '0%', after: '65%', improvement: '65% automation' },
        { metric: 'Engineer Productivity', before: '30%', after: '85%', improvement: '+55% on strategic work' },
        { metric: 'SLA Compliance', before: '89%', after: '99.7%', improvement: '+10.7 points' },
        { metric: 'Annual Cost Savings', before: '-', after: '$2.1M', improvement: 'Direct savings' }
      ],
      testimonial: 'The transformation has been remarkable. ArqAI didn\'t just automate our incident response—it gave us the confidence to automate with governance. Every action is auditable, every decision is explainable, and our compliance team finally sleeps at night.',
      nextSteps: [
        'Expanding to automated capacity planning',
        'Implementing predictive maintenance',
        'Rolling out to 3 additional data centers'
      ]
    }
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
    fullContent: {
      overview: 'FastGrow SaaS is a rapidly scaling B2B company with 150 sales reps. Their revenue operations team struggled with dirty CRM data, inconsistent pipeline management, and inaccurate forecasting.',
      challenges: [
        'Sales reps spending 12+ hours weekly on manual data entry',
        'CRM data accuracy at only 72%, leading to bad forecasts',
        '30% of pipeline data was stale or inaccurate',
        'Compliance team manually reviewing every client interaction',
        'Forecasting errors of 25%+ quarter over quarter'
      ],
      solutionDetails: [
        'Automated lead enrichment and CRM field population',
        'Real-time pipeline hygiene with confidence scoring',
        'Governed approval workflows for high-value opportunities',
        'Compliance-aware communication logging',
        'AI-driven forecasting with scenario modeling'
      ],
      implementation: [
        { phase: 'CRM Integration', duration: 'Week 1', description: 'Salesforce integration, data mapping, and historical analysis' },
        { phase: 'Workflow Design', duration: 'Week 2', description: 'Approval rules, governance policies, and automation triggers' },
        { phase: 'Rep Training', duration: 'Week 3', description: 'User onboarding, feedback collection, and refinement' },
        { phase: 'Full Rollout', duration: 'Week 4', description: 'Company-wide deployment with continuous optimization' }
      ],
      results: [
        { metric: 'Time on Data Entry', before: '12 hrs/week', after: '< 1 hr/week', improvement: '92% reduction' },
        { metric: 'CRM Data Accuracy', before: '72%', after: '98%', improvement: '+26 points' },
        { metric: 'Win Rate', before: '18%', after: '22%', improvement: '+23% relative' },
        { metric: 'Forecast Accuracy', before: '75%', after: '94%', improvement: '+19 points' },
        { metric: 'Pipeline Velocity', before: '45 days', after: '32 days', improvement: '29% faster' }
      ],
      testimonial: 'The ROI was immediate. Within the first month, our reps gained back a full day per week. But the real win was forecast accuracy—our board finally trusts our numbers.',
      nextSteps: [
        'Implementing AI-driven deal coaching',
        'Expanding to marketing automation integration',
        'Rolling out territory optimization'
      ]
    }
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
    fullContent: {
      overview: 'Enterprise Software Inc serves 2,000+ enterprise customers with complex technical products. Their support team was overwhelmed with ticket volume, leading to slow response times and frustrated customers.',
      challenges: [
        'Over 10,000 monthly support tickets with limited staff',
        '48-hour average first response time',
        'CSAT scores declining for 4 consecutive quarters',
        'High-value customers receiving same service as trial users',
        'Compliance requirements for data handling in responses'
      ],
      solutionDetails: [
        'AI-powered Tier 1 ticket resolution with governed responses',
        'Intelligent routing based on customer tier and issue complexity',
        'Proactive health monitoring and intervention',
        'Compliance-safe response generation with audit trails',
        'Seamless escalation to human agents with full context'
      ],
      implementation: [
        { phase: 'Integration Setup', duration: 'Week 1', description: 'Zendesk integration, knowledge base ingestion, response training' },
        { phase: 'Governance Config', duration: 'Week 2', description: 'Response policies, escalation rules, compliance guardrails' },
        { phase: 'Pilot Launch', duration: 'Week 3', description: 'Limited deployment with quality monitoring' },
        { phase: 'Full Deployment', duration: 'Week 4', description: 'All ticket categories with continuous learning' }
      ],
      results: [
        { metric: 'First Response Time', before: '48 hours', after: '< 5 minutes', improvement: '99% faster' },
        { metric: 'CSAT Score', before: '56', after: '90', improvement: '+34 points' },
        { metric: 'Tier 1 Auto-Resolution', before: '0%', after: '72%', improvement: '72% automated' },
        { metric: 'Agent Capacity', before: '50 tickets/day', after: '150 tickets/day', improvement: '3x throughput' },
        { metric: 'Escalation Rate', before: '45%', after: '18%', improvement: '60% reduction' }
      ],
      testimonial: 'What impressed me most was the quality of automated responses. Customers often can\'t tell they\'re interacting with AI, and when they do find out, they\'re impressed rather than frustrated.',
      nextSteps: [
        'Expanding to proactive customer outreach',
        'Implementing churn prediction and intervention',
        'Adding multi-language support'
      ]
    }
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
    fullContent: {
      overview: 'HealthTech Innovators is a fast-growing healthcare technology company generating over 50,000 leads monthly. Their marketing team struggled with consistent qualification and personalization at scale.',
      challenges: [
        '50,000+ monthly leads with inconsistent qualification',
        '4-hour average lead response time losing hot leads',
        'Generic nurture campaigns with low engagement',
        'HIPAA compliance requirements for all communications',
        'Marketing-sales alignment issues around MQL definitions'
      ],
      solutionDetails: [
        'AI-driven lead scoring with transparent criteria',
        'Instant lead qualification and routing',
        'Personalized content recommendations with brand guardrails',
        'HIPAA-compliant communication automation',
        'Unified marketing-sales handoff with audit trails'
      ],
      implementation: [
        { phase: 'Data Integration', duration: 'Week 1', description: 'HubSpot + Marketo integration, historical lead analysis' },
        { phase: 'Scoring Model', duration: 'Week 2', description: 'Custom scoring criteria, qualification workflows' },
        { phase: 'Content Setup', duration: 'Week 3', description: 'Personalization rules, compliance review' },
        { phase: 'Launch', duration: 'Week 4', description: 'Full automation with A/B testing' }
      ],
      results: [
        { metric: 'Lead Response Time', before: '4 hours', after: '< 2 minutes', improvement: '99% faster' },
        { metric: 'MQL to SQL Conversion', before: '8%', after: '24%', improvement: '3x improvement' },
        { metric: 'Email Engagement', before: '12%', after: '34%', improvement: '+183% relative' },
        { metric: 'Campaign ROI', before: '2.1x', after: '5.4x', improvement: '+156% improvement' },
        { metric: 'Sales Accepted Leads', before: '42%', after: '78%', improvement: '+86% acceptance' }
      ],
      testimonial: 'ArqAI didn\'t just speed up our qualification—it made it consistent. Every lead gets the same fair evaluation, and our sales team finally trusts the MQLs we send them.',
      nextSteps: [
        'Expanding to account-based marketing automation',
        'Implementing predictive intent scoring',
        'Adding multi-channel orchestration'
      ]
    }
  },
}

export function CaseStudy({ functionType, industry, data, isHighlighted }: CaseStudyProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const study = caseStudies[functionType]

  return (
    <>
      {/* Compact Card View */}
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-foreground text-lg">Customer Success Story</CardTitle>
                <p className="text-muted-foreground text-sm">{study.industry}</p>
              </div>
            </div>
            <Badge className="bg-muted text-muted-foreground border-border">
              {study.company}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Challenge & Solution */}
          <div className="space-y-3">
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <h4 className="text-red-600 text-xs font-medium uppercase tracking-wide mb-1">
                The Challenge
              </h4>
              <p className="text-foreground/80 text-sm">{study.challenge}</p>
            </div>

            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <h4 className="text-green-600 text-xs font-medium uppercase tracking-wide mb-1">
                The Solution
              </h4>
              <p className="text-foreground/80 text-sm">{study.solution}</p>
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
                className="bg-muted/50 rounded-lg p-3 text-center border border-border"
              >
                <div className="text-2xl font-bold text-arq-deep-blue">{metric.value}</div>
                <div className="text-foreground text-xs font-medium">{metric.label}</div>
                <div className="text-muted-foreground text-xs mt-1">{metric.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative bg-muted/50 rounded-lg p-4 border border-border"
          >
            <Quote className="absolute top-3 left-3 w-6 h-6 text-arq-deep-blue/30" />
            <blockquote className="text-foreground/80 text-sm italic pl-6 mb-3">
              &ldquo;{study.quote.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3 pl-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-arq-deep-blue to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {study.quote.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">{study.quote.author}</p>
                <p className="text-muted-foreground text-xs">{study.quote.title}</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button
              size="sm"
              className="bg-arq-deep-blue text-white hover:bg-arq-deep-blue/90 flex-1"
              onClick={() => setIsExpanded(true)}
            >
              Read Full Case Study
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Case Study Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-arq-deep-blue to-blue-600 text-white p-8 rounded-t-3xl">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="w-5 h-5" />
                </Button>

                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  {study.industry}
                </Badge>
                <h2 className="text-3xl font-bold mb-2">{study.company}</h2>
                <p className="text-white/80 text-lg">{study.fullContent.overview}</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Key Metrics Banner */}
                <div className="grid grid-cols-3 gap-4 -mt-12">
                  {study.metrics.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-xl p-4 shadow-lg border border-border text-center"
                    >
                      <div className="text-3xl font-bold text-arq-deep-blue">{metric.value}</div>
                      <div className="text-sm font-medium text-foreground">{metric.label}</div>
                      <div className="text-xs text-muted-foreground">{metric.change}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Challenges */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <Target className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">The Challenges</h3>
                  </div>
                  <div className="space-y-2">
                    {study.fullContent.challenges.map((challenge, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                      >
                        <span className="mt-0.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-foreground/80">{challenge}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Solution */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">The ArqAI Solution</h3>
                  </div>
                  <div className="space-y-2">
                    {study.fullContent.solutionDetails.map((solution, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{solution}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Implementation Timeline */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">30-Day Implementation</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {study.fullContent.implementation.map((phase, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative p-4 rounded-xl bg-blue-50 border border-blue-100"
                      >
                        <div className="text-xs font-medium text-blue-600 mb-1">{phase.duration}</div>
                        <div className="font-semibold text-foreground mb-2">{phase.phase}</div>
                        <div className="text-xs text-muted-foreground">{phase.description}</div>
                        {i < 3 && (
                          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 text-blue-300 z-10" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Results Table */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-arq-lime/20">
                      <BarChart3 className="w-5 h-5 text-arq-deep-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Measurable Results</h3>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-4 text-sm font-semibold text-foreground">Metric</th>
                          <th className="text-center p-4 text-sm font-semibold text-foreground">Before</th>
                          <th className="text-center p-4 text-sm font-semibold text-foreground">After</th>
                          <th className="text-center p-4 text-sm font-semibold text-arq-deep-blue">Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {study.fullContent.results.map((result, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-t border-border"
                          >
                            <td className="p-4 font-medium text-foreground">{result.metric}</td>
                            <td className="p-4 text-center text-muted-foreground">{result.before}</td>
                            <td className="p-4 text-center font-medium text-foreground">{result.after}</td>
                            <td className="p-4 text-center">
                              <span className="px-3 py-1 rounded-full bg-arq-lime/20 text-arq-deep-blue text-sm font-semibold">
                                {result.improvement}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Extended Testimonial */}
                <section className="bg-gradient-to-br from-arq-deep-blue/5 to-blue-100/50 rounded-2xl p-6">
                  <Quote className="w-10 h-10 text-arq-deep-blue/20 mb-4" />
                  <blockquote className="text-lg text-foreground/80 italic mb-4">
                    &ldquo;{study.fullContent.testimonial}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-arq-deep-blue to-blue-600 flex items-center justify-center text-white font-bold">
                      {study.quote.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{study.quote.author}</p>
                      <p className="text-muted-foreground">{study.quote.title}, {study.company}</p>
                    </div>
                  </div>
                </section>

                {/* CTA */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-arq-deep-blue text-white hover:bg-arq-deep-blue/90"
                    onClick={() => setIsExpanded(false)}
                  >
                    Get Similar Results
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsExpanded(false)}
                  >
                    Back to Overview
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

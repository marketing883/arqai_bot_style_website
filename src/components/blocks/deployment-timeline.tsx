'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Circle, Clock, ArrowRight, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FunctionType } from '@/types'

interface DeploymentTimelineProps {
  functionType: FunctionType
  companyName?: string
  data?: Record<string, unknown>
}

const timelineSteps = [
  {
    week: 1,
    title: 'Discovery & Setup',
    description: 'Technical requirements gathering and integration setup',
    tasks: [
      'Kickoff meeting with your team',
      'Integration credentials & access',
      'Environment configuration',
      'Initial workflow mapping',
    ],
    duration: '3-5 days',
  },
  {
    week: 2,
    title: 'Configuration & Training',
    description: 'Platform configuration and team onboarding',
    tasks: [
      'Custom workflow setup',
      'Policy & governance rules',
      'Team training sessions',
      'Testing environment ready',
    ],
    duration: '5-7 days',
  },
  {
    week: 3,
    title: 'Testing & Refinement',
    description: 'Parallel testing and fine-tuning',
    tasks: [
      'Shadow mode testing',
      'Edge case handling',
      'Performance optimization',
      'User acceptance testing',
    ],
    duration: '5-7 days',
  },
  {
    week: 4,
    title: 'Go-Live & Optimization',
    description: 'Production deployment and ongoing support',
    tasks: [
      'Gradual production rollout',
      'Real-time monitoring',
      'Success metrics review',
      'Ongoing optimization',
    ],
    duration: '3-5 days',
  },
]

export function DeploymentTimeline({ functionType, companyName = 'Your Company', data }: DeploymentTimelineProps) {
  const [company, setCompany] = useState(companyName)
  const [activeStep, setActiveStep] = useState(0)

  const today = new Date()
  const getWeekDate = (weekNumber: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() + (weekNumber - 1) * 7)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className="bg-gradient-to-br from-arq-deep-blue/90 to-arq-slate border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-arq-lime/20">
              <Calendar className="w-5 h-5 text-arq-lime" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">30-Day Deployment Timeline</CardTitle>
              <p className="text-white/60 text-sm">Your path to production</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-arq-lime/20">
            <Clock className="w-4 h-4 text-arq-lime" />
            <span className="text-arq-lime text-sm font-medium">30 Days</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Company Name Input */}
        <div className="flex items-center gap-3">
          <Building className="w-4 h-4 text-white/40" />
          <div className="flex-1">
            <Label className="text-white/50 text-xs">Personalize for</Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 bg-white/10 border-white/20 text-white h-8"
              placeholder="Your company name"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10">
            <motion.div
              className="w-full bg-arq-lime"
              initial={{ height: '0%' }}
              animate={{ height: `${((activeStep + 1) / timelineSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative pl-10 cursor-pointer ${
                  index <= activeStep ? 'opacity-100' : 'opacity-50'
                }`}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Indicator */}
                <div className="absolute left-0 top-0">
                  {index <= activeStep ? (
                    <div className="w-8 h-8 rounded-full bg-arq-lime flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-arq-slate" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-white/40" />
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div
                  className={`p-4 rounded-lg transition-colors ${
                    index === activeStep ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-arq-lime text-xs font-medium">Week {step.week}</span>
                      <h4 className="text-white font-medium">{step.title}</h4>
                    </div>
                    <span className="text-white/40 text-xs">{getWeekDate(step.week)}</span>
                  </div>

                  <p className="text-white/60 text-sm mb-3">{step.description}</p>

                  {index === activeStep && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      {step.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="flex items-center gap-2 text-white/70 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-arq-lime" />
                          {task}
                        </div>
                      ))}
                      <div className="pt-2 text-white/40 text-xs">
                        Duration: {step.duration}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <p className="text-white/50 text-xs">
            Ready to start your deployment?
          </p>
          <Button size="sm" className="bg-arq-lime text-arq-slate hover:bg-arq-lime/90">
            Schedule Kickoff
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Clock, Users } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const benefits = [
  'See ArqAI in action with a live demo',
  'Discuss your specific use case',
  'Get answers to your questions',
  'Understand pricing and timeline',
]

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="py-20 lg:py-28 bg-gradient-to-b from-arq-deep-blue to-arq-slate">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Book a <span className="text-arq-lime">Demo</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  See how ArqAI can help you deploy AI agents in production—in 30 days, not quarters.
                </p>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-arq-lime shrink-0" />
                      <span className="text-white/90">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>30 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>1-on-1 with expert</span>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" required className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Work Email</Label>
                          <Input id="email" type="email" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="title">Job Title</Label>
                          <Input id="title" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="usecase">Primary Use Case</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select use case" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="it">IT Infrastructure Automation</SelectItem>
                              <SelectItem value="revenue">Revenue Operations</SelectItem>
                              <SelectItem value="customer">Customer Success</SelectItem>
                              <SelectItem value="demand">Demand Generation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full bg-arq-lime text-arq-slate hover:bg-arq-lime/90" size="lg">
                          <Calendar className="w-4 h-4 mr-2" />
                          Request Demo
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          We'll reach out within 24 hours to schedule your demo.
                        </p>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <CheckCircle2 className="w-16 h-16 text-arq-lime mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-arq-slate mb-2">Request Received!</h3>
                        <p className="text-muted-foreground">
                          We'll contact you within 24 hours to schedule your demo.
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

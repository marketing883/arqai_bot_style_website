'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Shield,
  Zap,
  Eye,
  CheckCircle2,
  Download,
  Mail,
  Building2,
  Target,
  Linkedin,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const marketStats = [
  { value: 28, suffix: 'B', prefix: '$', label: 'AI Governance Market' },
  { value: 235, suffix: 'B', prefix: '$', label: 'Enterprise Workflows' },
  { value: 87, suffix: '%', label: 'AI Pilots That Fail' },
]

const patents = [
  {
    icon: Shield,
    title: 'Trust-Aware Agent Orchestration™',
    description: 'Real-time risk scoring, capability tokens, cryptographic audit trails.',
  },
  {
    icon: Zap,
    title: 'Compliance-Aware Prompt Compiler™',
    description: 'Policy enforcement at compile time, automated compliance evidence.',
  },
  {
    icon: Eye,
    title: 'Observability-Driven Adaptive RAG™',
    description: 'Drift detection, self-healing knowledge base, adaptive retrieval.',
  },
]

const traction = [
  { value: 500, suffix: 'K', prefix: '$', label: 'ARR', icon: DollarSign },
  { value: 3.2, suffix: 'M', prefix: '$', label: 'Pipeline', decimals: 1, icon: TrendingUp },
  { value: 12, label: 'Enterprise Customers', icon: Building2 },
  { value: 6, label: 'Verticals', icon: Target },
]

const verticals = ['Finance', 'Healthcare', 'Telecom', 'Industrial', 'Real Estate', 'Retail']

const teamHighlights = [
  '150+ years collective enterprise experience',
  'ACI InfoTech pedigree (20 years Fortune 500 delivery)',
  'GEC 2025 Award – AI Governance Innovation',
  'Zero churn, 100% expansion rate',
]

export default function InvestorsPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual deck download
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center py-20 bg-gradient-to-b from-arq-deep-blue via-arq-slate to-arq-slate overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <Container className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Problem Statement */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-arq-coral text-lg md:text-xl font-medium mb-4"
              >
                87% of enterprise AI pilots never deploy to production.
              </motion.p>

              {/* Solution */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                The Governed Control Plane for{' '}
                <span className="text-arq-lime">Enterprise AI Agents</span>
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                ArqAI makes AI agents production-ready with three patented technologies
                for trust, compliance, and observability.
              </p>

              {/* Raise Info */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-arq-lime/20 border border-arq-lime/30"
              >
                <span className="text-arq-lime font-semibold text-lg">Raising $20M Seed</span>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Market/TAM */}
        <section className="py-20 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-arq-deep-blue/10 text-arq-deep-blue text-sm font-medium mb-4">
                Market Opportunity
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-arq-slate mb-4">
                Massive, Growing Market
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every enterprise needs governed AI. Regulated industries are first movers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {marketStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center p-8 rounded-2xl bg-arq-off-white"
                >
                  <div className="text-4xl md:text-5xl font-bold text-arq-deep-blue mb-2">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Three Patents */}
        <section className="py-20 bg-arq-slate">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-arq-lime/20 text-arq-lime text-sm font-medium mb-4">
                Defensible Technology
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Three Patents. One Platform.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {patents.map((patent, index) => (
                <motion.div
                  key={patent.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-arq-lime text-arq-slate mb-4">
                        <patent.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{patent.title}</h3>
                      <p className="text-white/60 text-sm">{patent.description}</p>
                      <span className="inline-block mt-4 px-2 py-1 rounded text-xs font-medium bg-arq-lime/20 text-arq-lime">
                        Patent Pending
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Traction */}
        <section className="py-20 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Award className="w-12 h-12 text-arq-lime mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-arq-slate mb-4">
                Proven Traction
              </h2>
              <p className="text-lg text-muted-foreground">
                Real revenue. Real customers. Real pipeline.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {traction.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-arq-off-white"
                >
                  <item.icon className="w-8 h-8 text-arq-deep-blue mx-auto mb-3" />
                  <div className="text-3xl font-bold text-arq-slate mb-1">
                    <AnimatedCounter
                      end={item.value}
                      prefix={item.prefix}
                      suffix={item.suffix}
                      decimals={item.decimals}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Verticals */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground mb-4">Across 6 verticals:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {verticals.map((vertical) => (
                  <span
                    key={vertical}
                    className="px-4 py-2 rounded-full bg-arq-deep-blue/10 text-arq-deep-blue text-sm font-medium"
                  >
                    {vertical}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-2xl bg-arq-lime/10 border border-arq-lime/20 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-arq-deep-blue">0%</div>
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-arq-deep-blue">100%</div>
                  <p className="text-sm text-muted-foreground">Expansion Rate</p>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Team */}
        <section className="py-20 bg-arq-off-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Users className="w-12 h-12 text-arq-deep-blue mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-arq-slate mb-4">
                Experienced Team
              </h2>
            </motion.div>

            {/* CEO Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto mb-12"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-32 bg-gradient-to-br from-arq-deep-blue to-arq-slate flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <Users className="w-10 h-10 text-white/50" />
                      {/* TODO: Replace with actual CEO photo */}
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-arq-slate">Jag Kanumuri</h3>
                    <p className="text-arq-deep-blue font-medium mb-3">President & CEO</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      25+ years transforming Fortune 500 enterprises through technology innovation.
                    </p>
                    <a
                      href="https://linkedin.com/in/jagkanumuri"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-arq-deep-blue hover:text-arq-lime transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Highlights */}
            <div className="max-w-2xl mx-auto space-y-3">
              {teamHighlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white"
                >
                  <CheckCircle2 className="w-5 h-5 text-arq-lime shrink-0" />
                  <span className="text-arq-slate">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Deck Download */}
        <section className="py-20 bg-arq-deep-blue">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto text-center"
            >
              <Download className="w-12 h-12 text-arq-lime mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Download the Pitch Deck
              </h2>
              <p className="text-white/70 mb-8">
                Get the full story: market, technology, traction, and team.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left">
                    <Label htmlFor="email" className="text-white/70">
                      Work Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-arq-lime text-arq-slate hover:bg-arq-lime/90"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Pitch Deck
                  </Button>
                  <p className="text-xs text-white/40">
                    We respect your privacy. Your email will only be used to send the deck.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-arq-lime/20 border border-arq-lime/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-arq-lime mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Check Your Email!</h3>
                  <p className="text-white/70">
                    The pitch deck is on its way to {email}
                  </p>
                  {/* TODO: Implement actual PDF download */}
                </motion.div>
              )}
            </motion.div>
          </Container>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-arq-slate mb-4">
                Let's Talk
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Interested in learning more? We'd love to connect.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-arq-deep-blue hover:bg-arq-deep-blue/90"
              >
                <a href="mailto:investors@thearq.ai">
                  <Mail className="w-4 h-4 mr-2" />
                  investors@thearq.ai
                </a>
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

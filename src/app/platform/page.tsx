'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Zap,
  Eye,
  Cloud,
  Cpu,
  Building2,
  CheckCircle2,
  ArrowRight,
  Lock,
  FileCheck,
  Activity
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container, SectionHeader, SectionWrapper } from '@/components/shared/section-wrapper'
import { CTAButton } from '@/components/shared/cta-button'
import { Card, CardContent } from '@/components/ui/card'

const patents = [
  {
    icon: Shield,
    title: 'Trust-Aware Agent Orchestration™',
    tagline: 'Patent Pending',
    description: 'Every agent action is scored for risk in real-time. Capability tokens enforce what agents can do. Cryptographic audit trails prove what they did.',
    outcomes: [
      'Risk-scored actions before execution',
      'Capability-based access control',
      'Tamper-proof audit evidence',
    ],
  },
  {
    icon: Zap,
    title: 'Compliance-Aware Prompt Compiler™',
    tagline: 'Patent Pending',
    description: 'Natural language requests are compiled into governed execution plans. Your policies are enforced automatically, not as an afterthought.',
    outcomes: [
      'Policy enforcement at compile time',
      'Automated compliance evidence',
      'Human-readable execution plans',
    ],
  },
  {
    icon: Eye,
    title: 'Observability-Driven Adaptive RAG™',
    tagline: 'Patent Pending',
    description: 'Continuous monitoring detects model drift and data staleness. The system automatically adapts retrieval strategies to maintain accuracy.',
    outcomes: [
      'Real-time drift detection',
      'Self-healing knowledge base',
      'Adaptive retrieval optimization',
    ],
  },
]

const integrations = {
  cloud: ['AWS', 'Azure', 'GCP', 'On-Premises'],
  models: ['OpenAI', 'Anthropic', 'Llama', 'Custom Models'],
  systems: ['Salesforce', 'ServiceNow', 'Workday', 'SAP', 'Custom APIs'],
}

const competitors = [
  { name: 'Zapier/Make', weakness: 'No governance layer' },
  { name: 'LangChain', weakness: 'Framework, not platform' },
  { name: 'Point AI Tools', weakness: 'Bolted-on compliance' },
]

export default function PlatformPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-b from-arq-deep-blue to-arq-slate overflow-hidden">
          {/* Background Pattern */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-arq-lime/20 text-arq-lime text-sm font-medium mb-6">
                The Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                The Governed AI Platform{' '}
                <span className="text-arq-lime">Built for Production</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                ArqAI is the control plane that makes AI agents enterprise-ready.
                Three patented technologies. One unified platform. Zero compromises on governance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CTAButton href="/demo" showArrow glow>
                  Book a Demo
                </CTAButton>
                <CTAButton href="#capabilities" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Explore Capabilities
                </CTAButton>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* The Problem */}
        <SectionWrapper className="bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                subtitle="The Problem"
                title="Why 87% of AI Pilots Never Deploy"
                align="center"
              />

              <div className="grid md:grid-cols-3 gap-6 text-center">
                {[
                  { stat: '87%', label: 'of AI pilots stuck in proof-of-concept' },
                  { stat: '18mo', label: 'average time from pilot to production' },
                  { stat: '$2.4M', label: 'wasted on failed AI initiatives' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="text-4xl font-bold text-arq-coral mb-2">{item.stat}</div>
                    <p className="text-muted-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-lg text-muted-foreground mt-8 max-w-2xl mx-auto"
              >
                The gap isn't capability—it's <strong className="text-arq-slate">trust</strong>.
                Enterprises need AI that's auditable, compliant, and controllable.
                That's exactly what ArqAI delivers.
              </motion.p>
            </div>
          </Container>
        </SectionWrapper>

        {/* Three Core Capabilities */}
        <SectionWrapper id="capabilities" className="bg-arq-off-white">
          <Container>
            <SectionHeader
              subtitle="Core Capabilities"
              title="Three Patents. One Platform."
              description="Each capability is protected by pending patents and battle-tested in Fortune 500 deployments."
            />

            <div className="grid lg:grid-cols-3 gap-8">
              {patents.map((patent, index) => (
                <motion.div
                  key={patent.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-arq-deep-blue text-white">
                          <patent.icon className="w-6 h-6" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-arq-lime/20 text-arq-slate">
                          {patent.tagline}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-arq-slate mb-3">
                        {patent.title}
                      </h3>

                      <p className="text-muted-foreground mb-4">
                        {patent.description}
                      </p>

                      <div className="space-y-2">
                        {patent.outcomes.map((outcome) => (
                          <div key={outcome} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-arq-lime shrink-0" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* Architecture Overview */}
        <SectionWrapper className="bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeader
                  subtitle="Architecture"
                  title="The Governance Fabric"
                  description="ArqAI sits between your applications and AI models, providing a unified control plane for all agent operations."
                  align="left"
                  className="mb-8"
                />

                <div className="space-y-4">
                  {[
                    { icon: Lock, text: 'Policy enforcement at every layer' },
                    { icon: FileCheck, text: 'Automatic compliance evidence generation' },
                    { icon: Activity, text: 'Real-time observability and alerting' },
                    { icon: Shield, text: 'Zero-trust security model' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-arq-lime/10 text-arq-deep-blue">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-arq-slate">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Diagram Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-arq-deep-blue to-arq-slate p-8 flex items-center justify-center">
                  {/* Simplified Architecture Visualization */}
                  <div className="w-full max-w-sm space-y-4">
                    {/* Applications Layer */}
                    <div className="bg-white/10 rounded-lg p-3 text-center text-white text-sm">
                      Your Applications
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-arq-lime rotate-90" />
                    </div>

                    {/* ArqAI Layer */}
                    <div className="bg-arq-lime rounded-lg p-4 text-center">
                      <div className="font-semibold text-arq-slate mb-2">ArqAI Governance Fabric</div>
                      <div className="flex justify-center gap-2">
                        <span className="px-2 py-1 bg-white/80 rounded text-xs">Orchestration</span>
                        <span className="px-2 py-1 bg-white/80 rounded text-xs">Compilation</span>
                        <span className="px-2 py-1 bg-white/80 rounded text-xs">Observability</span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-arq-lime rotate-90" />
                    </div>

                    {/* AI Models Layer */}
                    <div className="bg-white/10 rounded-lg p-3 text-center text-white text-sm">
                      AI Models & Tools
                    </div>
                  </div>

                  {/* TODO: Replace with interactive SVG diagram */}
                  <p className="absolute bottom-4 left-4 text-xs text-white/40">
                    Interactive diagram (placeholder)
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </SectionWrapper>

        {/* Integration Story */}
        <SectionWrapper className="bg-arq-off-white">
          <Container>
            <SectionHeader
              subtitle="Integrations"
              title="Works With Your Stack"
              description="Cloud agnostic. Model agnostic. Industry agnostic. ArqAI integrates with what you already use."
            />

            <div className="grid md:grid-cols-3 gap-8">
              {/* Cloud Providers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Cloud className="w-6 h-6 text-arq-deep-blue" />
                      <h3 className="font-semibold text-arq-slate">Cloud Providers</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {integrations.cloud.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-arq-deep-blue/10 text-arq-deep-blue text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Models */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="w-6 h-6 text-arq-deep-blue" />
                      <h3 className="font-semibold text-arq-slate">AI Models</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {integrations.models.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-arq-lime/20 text-arq-slate text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enterprise Systems */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="w-6 h-6 text-arq-deep-blue" />
                      <h3 className="font-semibold text-arq-slate">Enterprise Systems</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {integrations.systems.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-arq-coral/10 text-arq-slate text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </SectionWrapper>

        {/* Why ArqAI Wins */}
        <SectionWrapper className="bg-white">
          <Container>
            <SectionHeader
              subtitle="Competitive Advantage"
              title="Why ArqAI Wins"
              description="Governance built-in, not bolted-on. That's the difference."
            />

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {competitors.map((competitor, index) => (
                  <motion.div
                    key={competitor.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-arq-off-white"
                  >
                    <div>
                      <span className="font-medium text-arq-slate">{competitor.name}</span>
                      <span className="mx-3 text-muted-foreground">→</span>
                      <span className="text-muted-foreground">{competitor.weakness}</span>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-arq-lime/20 border-2 border-arq-lime"
                >
                  <div>
                    <span className="font-semibold text-arq-slate">ArqAI</span>
                    <span className="mx-3 text-arq-slate">→</span>
                    <span className="text-arq-slate font-medium">Governance-native from day one</span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-arq-deep-blue" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 p-6 rounded-xl bg-arq-deep-blue text-center"
              >
                <p className="text-white text-lg mb-4">
                  <strong className="text-arq-lime">30 days</strong> from pilot to production.
                  Not 18 months. Not quarters. Days.
                </p>
                <CTAButton href="/demo" variant="lime" showArrow>
                  See It In Action
                </CTAButton>
              </motion.div>
            </div>
          </Container>
        </SectionWrapper>

        {/* Final CTA */}
        <section className="py-20 bg-arq-slate">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Deploy AI Agents in Production?
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Join the enterprises that trust ArqAI to run AI in production.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CTAButton href="/demo" size="xl" showArrow glow>
                  Book a Demo
                </CTAButton>
                <CTAButton href="/security" variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                  Review Security
                </CTAButton>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

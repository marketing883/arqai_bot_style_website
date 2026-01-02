'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Eye, Zap } from 'lucide-react'
import { Container, SectionHeader } from '@/components/shared/section-wrapper'
import { CTAButton } from '@/components/shared/cta-button'

const features = [
  {
    icon: Shield,
    title: 'Trust-Aware Orchestration',
    description:
      'Every agent action is scored for risk, governed by capability tokens, and recorded with cryptographic audit trails.',
    highlight: 'Patent Pending',
  },
  {
    icon: Zap,
    title: 'Compliance-Aware Compilation',
    description:
      'Natural language prompts are compiled into governed execution plans that enforce your policies automatically.',
    highlight: 'Patent Pending',
  },
  {
    icon: Eye,
    title: 'Observability-Driven Adaptation',
    description:
      'Continuous monitoring detects drift and automatically adapts agent behavior while maintaining compliance.',
    highlight: 'Patent Pending',
  },
  {
    icon: Clock,
    title: '30-Day Deployment',
    description:
      'Go from pilot to production in weeks, not quarters. Our blueprint-wire-ship methodology accelerates time to value.',
    highlight: 'Proven Process',
  },
]

export function ValueProposition() {
  return (
    <section id="platform" className="py-20 lg:py-28 bg-arq-off-white">
      <Container>
        <SectionHeader
          subtitle="Why ArqAI"
          title="Governance Built-In, Not Bolted-On"
          description="Unlike point solutions that add governance as an afterthought, ArqAI was architected from day one to make AI agents enterprise-ready."
        />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-white border shadow-sm"
            >
              {/* Highlight Badge */}
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-medium bg-arq-lime/20 text-arq-slate">
                {feature.highlight}
              </span>

              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-arq-deep-blue text-white mb-4">
                <feature.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-semibold text-arq-slate mb-2">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <CTAButton href="/platform" showArrow>
            Explore the Platform
          </CTAButton>
        </motion.div>
      </Container>
    </section>
  )
}

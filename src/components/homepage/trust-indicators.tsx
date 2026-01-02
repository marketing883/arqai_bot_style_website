'use client'

import { motion } from 'framer-motion'
import { Award, Users, DollarSign, TrendingUp } from 'lucide-react'
import { Container } from '@/components/shared/section-wrapper'
import { AnimatedCounter } from '@/components/shared/animated-counter'

const metrics = [
  {
    icon: Award,
    value: 'GEC 2025',
    label: 'Award Winner',
    description: 'AI Governance Innovation',
  },
  {
    icon: DollarSign,
    value: 500,
    suffix: 'K',
    prefix: '$',
    label: 'ARR',
    description: 'Recurring Revenue',
  },
  {
    icon: Users,
    value: 12,
    label: 'Enterprise Customers',
    description: 'Across 6 Verticals',
  },
  {
    icon: TrendingUp,
    value: 3.2,
    suffix: 'M',
    prefix: '$',
    label: 'Pipeline',
    description: 'Active Opportunities',
    decimals: 1,
  },
]

export function TrustIndicators() {
  return (
    <section className="py-16 bg-arq-slate">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-arq-lime text-sm font-semibold uppercase tracking-wider mb-2">
            Trusted by Enterprises
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Proven Results in Production
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-arq-lime/10 text-arq-lime mb-4">
                <metric.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {typeof metric.value === 'number' ? (
                  <AnimatedCounter
                    end={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                  />
                ) : (
                  metric.value
                )}
              </div>
              <div className="text-sm font-medium text-white/90 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-white/60">
                {metric.description}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

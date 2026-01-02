'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Server, TrendingUp, HeadphonesIcon, Megaphone, ArrowRight } from 'lucide-react'
import { Container, SectionHeader } from '@/components/shared/section-wrapper'
import { cn } from '@/lib/utils'

const functions = [
  {
    id: 'it-infrastructure',
    name: 'Autonomous IT Infrastructure',
    description: 'Automate IT operations with governed agents that handle incidents, deployments, and infrastructure management.',
    icon: Server,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'group-hover:from-blue-600 group-hover:to-blue-700',
  },
  {
    id: 'revenue-operations',
    name: 'Revenue Operations Automation',
    description: 'Streamline sales workflows, automate data entry, and optimize your revenue pipeline with intelligent agents.',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    hoverColor: 'group-hover:from-green-600 group-hover:to-green-700',
  },
  {
    id: 'customer-success',
    name: 'Autonomous Customer Success',
    description: 'Deliver exceptional customer experiences with AI agents that handle support, onboarding, and success workflows.',
    icon: HeadphonesIcon,
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'group-hover:from-purple-600 group-hover:to-purple-700',
  },
  {
    id: 'demand-generation',
    name: 'Autonomous Demand Generation',
    description: 'Scale your marketing with agents that automate campaigns, qualify leads, and drive pipeline growth.',
    icon: Megaphone,
    color: 'from-orange-500 to-orange-600',
    hoverColor: 'group-hover:from-orange-600 group-hover:to-orange-700',
  },
]

export function FunctionSelector() {
  const router = useRouter()

  const handleFunctionClick = (functionId: string) => {
    router.push(`/canvas/${functionId}`)
  }

  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeader
          subtitle="Use Cases"
          title="What Can ArqAI Do for You?"
          description="Select a function to explore how ArqAI can transform your operations with governed AI agents."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {functions.map((func, index) => (
            <motion.button
              key={func.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => handleFunctionClick(func.id)}
              className="group relative p-6 rounded-2xl border bg-white text-left shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div
                className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br',
                  func.color
                )}
              />

              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white transition-all duration-300',
                    func.color,
                    func.hoverColor
                  )}
                >
                  <func.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-arq-slate mb-2 group-hover:text-arq-deep-blue transition-colors">
                    {func.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {func.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="shrink-0 w-5 h-5 text-muted-foreground/40 group-hover:text-arq-deep-blue group-hover:translate-x-1 transition-all" />
              </div>

              {/* Bottom Accent */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r',
                  func.color
                )}
              />
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  )
}

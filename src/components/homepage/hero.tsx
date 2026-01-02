'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTAButton } from '@/components/shared/cta-button'
import { Container } from '@/components/shared/section-wrapper'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-arq-off-white to-white py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0A2463 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-arq-lime/20 text-arq-slate text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-arq-lime animate-pulse" />
              GEC 2025 Award Winner
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-arq-slate mb-6">
              The AI Agent Platform{' '}
              <span className="text-arq-deep-blue">Enterprises Trust</span>{' '}
              to Run in Production
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Governed agents deployed in <span className="font-semibold text-arq-slate">30 days</span>, not quarters.
              Enterprise-grade security, compliance, and observability built-in.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <CTAButton href="/demo" size="xl" showArrow glow>
                Book a Demo
              </CTAButton>
              <Button variant="outline" size="lg" asChild>
                <a href="#platform">
                  Learn More
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-arq-slate shadow-2xl">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-arq-deep-blue to-arq-slate">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full"
                  >
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-arq-lime/10 blur-3xl" />
                  </motion.div>
                  <motion.div
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full"
                  >
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-arq-coral/10 blur-3xl" />
                  </motion.div>
                </div>

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-arq-lime text-arq-slate shadow-lg"
                >
                  <Play className="w-8 h-8 ml-1" />
                </motion.button>

                {/* TODO: Replace with actual video */}
                <p className="absolute bottom-4 left-4 text-sm text-white/60">
                  Governance Demo (Video Placeholder)
                </p>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-arq-lime/20 to-arq-deep-blue/20 blur-sm -z-10" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-arq-lime/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-arq-deep-blue/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

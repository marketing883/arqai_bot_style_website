'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'
import { CTAButton } from '@/components/shared/cta-button'

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="py-20 lg:py-28 bg-arq-off-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-arq-deep-blue/10 mb-6">
                <FileText className="w-10 h-10 text-arq-deep-blue" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-arq-slate mb-4">
                Blog Coming Soon
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                We're working on insightful content about AI governance, enterprise automation, and the future of agentic AI.
              </p>
              <p className="text-muted-foreground mb-8">
                In the meantime, book a demo to learn more about ArqAI.
              </p>
              <CTAButton href="/demo" showArrow>
                Book a Demo
              </CTAButton>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

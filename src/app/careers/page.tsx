'use client'

import { motion } from 'framer-motion'
import { Briefcase, Mail } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'
import { Button } from '@/components/ui/button'

export default function CareersPage() {
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-arq-lime/20 mb-6">
                <Briefcase className="w-10 h-10 text-arq-deep-blue" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-arq-slate mb-4">
                Join Our Team
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                We're building the future of enterprise AI. Want to be part of it?
              </p>
              <p className="text-muted-foreground mb-8">
                We're always looking for talented people who share our passion for
                making AI safe and accessible for enterprises. Check back soon for
                open positions, or reach out directly.
              </p>
              <Button asChild size="lg" className="bg-arq-deep-blue hover:bg-arq-deep-blue/90">
                <a href="mailto:careers@thearq.ai">
                  <Mail className="w-4 h-4 mr-2" />
                  careers@thearq.ai
                </a>
              </Button>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

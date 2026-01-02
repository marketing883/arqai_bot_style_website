'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/homepage/hero'
import { FunctionSelector } from '@/components/homepage/function-selector'
import { TrustIndicators } from '@/components/homepage/trust-indicators'
import { ValueProposition } from '@/components/homepage/value-proposition'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Function Selector */}
        <FunctionSelector />

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Value Proposition */}
        <ValueProposition />
      </main>

      <Footer />
    </div>
  )
}

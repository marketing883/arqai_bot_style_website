'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Users,
  Globe,
  Award,
  Heart,
  Target,
  Zap,
  DollarSign,
  Linkedin,
  MapPin,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container, SectionHeader, SectionWrapper } from '@/components/shared/section-wrapper'
import { CTAButton } from '@/components/shared/cta-button'
import { Card, CardContent } from '@/components/ui/card'

const leadershipTeam = [
  {
    name: 'Jag Kanumuri',
    title: 'President & CEO',
    bio: 'Visionary leader with 25+ years transforming Fortune 500 enterprises through technology innovation.',
    linkedin: 'https://linkedin.com/in/jagkanumuri',
    featured: true,
  },
  {
    name: 'Krish Karanam',
    title: 'SVP – Global Resources',
    bio: 'Scaling global teams and operations across continents.',
    linkedin: 'https://linkedin.com/in/krishkaranam',
  },
  {
    name: 'Habib Mehmoodi',
    title: 'VP – Strategy & Innovation',
    bio: 'Driving strategic initiatives and product innovation.',
    linkedin: 'https://linkedin.com/in/habibmehmoodi',
  },
  {
    name: 'Amit Alshaikh',
    title: 'VP – Client Success',
    bio: 'Ensuring enterprise clients achieve measurable outcomes.',
    linkedin: 'https://linkedin.com/in/amitalshaikh',
  },
  {
    name: 'Narayanan N',
    title: 'VP – Project Delivery',
    bio: 'Leading successful implementations across verticals.',
    linkedin: 'https://linkedin.com/in/narayanann',
  },
  {
    name: 'Amit Khare',
    title: 'AVP – Client Success',
    bio: 'Building lasting client relationships and driving adoption.',
    linkedin: 'https://linkedin.com/in/amitkhare',
  },
  {
    name: 'Thomas George',
    title: 'Director – Client Success',
    bio: 'Championing customer outcomes and satisfaction.',
    linkedin: 'https://linkedin.com/in/thomasgeorge',
  },
  {
    name: 'Bhupender Singh',
    title: 'Sr. Platform Architect',
    bio: 'Architecting scalable, secure enterprise platforms.',
    linkedin: 'https://linkedin.com/in/bhupendersingh',
  },
  {
    name: 'Junaid Abdul',
    title: 'Sr. AI Architect',
    bio: 'Designing cutting-edge AI systems and governance frameworks.',
    linkedin: 'https://linkedin.com/in/junaidabdul',
  },
]

const advisors = [
  {
    name: 'Sunil Pal',
    expertise: 'Healthcare',
    bio: 'Healthcare technology executive with deep expertise in digital transformation.',
    linkedin: 'https://linkedin.com/in/sunilpal',
  },
  {
    name: 'Krishna Borusu',
    expertise: 'Retail/IT',
    bio: 'IT Director at RaceTrac, leading retail technology innovation.',
    linkedin: 'https://linkedin.com/in/krishnaborusu',
  },
  {
    name: 'John Hadi',
    expertise: 'Manufacturing/Global IT',
    bio: 'Global IT leader with manufacturing and supply chain expertise.',
    linkedin: 'https://linkedin.com/in/johnhadi',
  },
]

const globalOffices = [
  { region: 'USA', locations: ['New Jersey (HQ)', 'Atlanta', 'Charlotte', 'Texas'] },
  { region: 'MENA', locations: ['UAE', 'Saudi Arabia', 'Egypt'] },
  { region: 'India', locations: ['Hyderabad', 'Mumbai', 'Noida', 'Bengaluru'] },
  { region: 'Europe', locations: ['Frankfurt', 'Belgium', 'Paris', 'London'] },
  { region: 'Americas', locations: ['Canada', 'Latin America'] },
]

const principles = [
  {
    icon: Heart,
    title: 'Customer-First',
    description: 'Every decision starts with "How does this help our customers succeed?"',
  },
  {
    icon: Target,
    title: 'Production-Ready',
    description: 'We don\'t ship demos. Everything we build is designed for enterprise production.',
  },
  {
    icon: Zap,
    title: 'Governance-Native',
    description: 'Security and compliance aren\'t features—they\'re foundations.',
  },
  {
    icon: DollarSign,
    title: 'Capital-Efficient',
    description: 'We build sustainable businesses, not money-burning machines.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-b from-arq-deep-blue to-arq-slate overflow-hidden">
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
                Our Story
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Making AI Safe{' '}
                <span className="text-arq-lime">for Production</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Born from 20 years of Fortune 500 delivery experience, ArqAI was built to solve
                the problem that killed 87% of enterprise AI initiatives: the trust gap.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Origin Story */}
        <SectionWrapper className="bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                subtitle="Our Origin"
                title="From Real Problems to Real Solutions"
                align="center"
              />

              <div className="prose prose-lg max-w-none text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <p>
                    ArqAI was spun out of <strong className="text-arq-slate">ACI InfoTech</strong>, a company with
                    20 years of experience delivering technology solutions to Fortune 500 enterprises across
                    finance, healthcare, telecom, and manufacturing.
                  </p>
                  <p>
                    We watched as our clients tried—and failed—to deploy AI agents in production.
                    Not because the AI wasn't capable, but because their security teams couldn't
                    approve it. Their compliance officers couldn't sign off. Their auditors
                    couldn't verify it.
                  </p>
                  <p>
                    We built ArqAI to bridge that gap. Our three patented technologies—Trust-Aware
                    Orchestration, Compliance-Aware Compilation, and Observability-Driven Adaptive RAG—make
                    AI agents enterprise-ready from day one.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Award className="w-8 h-8 text-arq-lime" />
                    <span className="text-lg font-medium text-arq-slate">
                      GEC 2025 Award Winner – AI Governance Innovation
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </SectionWrapper>

        {/* Leadership Team */}
        <SectionWrapper className="bg-arq-off-white">
          <Container>
            <SectionHeader
              subtitle="Leadership"
              title="The Team Behind ArqAI"
              description="150+ years of combined enterprise technology experience."
            />

            {/* CEO Featured */}
            {leadershipTeam.filter(m => m.featured).map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto mb-12"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Photo Placeholder */}
                      <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-arq-deep-blue to-arq-slate flex items-center justify-center">
                        <Users className="w-16 h-16 text-white/30" />
                        {/* TODO: Replace with actual team photo */}
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="text-2xl font-bold text-arq-slate mb-1">{member.name}</h3>
                        <p className="text-arq-deep-blue font-medium mb-3">{member.title}</p>
                        <p className="text-muted-foreground mb-4">{member.bio}</p>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-arq-deep-blue hover:text-arq-lime transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadershipTeam.filter(m => !m.featured).map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      {/* Photo Placeholder */}
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-arq-deep-blue to-arq-slate flex items-center justify-center">
                        <Users className="w-8 h-8 text-white/30" />
                        {/* TODO: Replace with actual team photo */}
                      </div>
                      <h3 className="font-semibold text-arq-slate">{member.name}</h3>
                      <p className="text-sm text-arq-deep-blue mb-2">{member.title}</p>
                      <p className="text-xs text-muted-foreground mb-3">{member.bio}</p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-arq-deep-blue hover:text-arq-lime transition-colors"
                      >
                        <Linkedin className="w-4 h-4 mx-auto" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* Advisors */}
        <SectionWrapper className="bg-white">
          <Container>
            <SectionHeader
              subtitle="Advisory Board"
              title="Industry Expertise"
              description="Guiding our strategy with deep domain knowledge."
            />

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {advisors.map((advisor, index) => (
                <motion.div
                  key={advisor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-6">
                      {/* Photo Placeholder */}
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-arq-lime/30 to-arq-deep-blue/30 flex items-center justify-center">
                        <Users className="w-10 h-10 text-arq-deep-blue/50" />
                        {/* TODO: Replace with actual advisor photo */}
                      </div>
                      <h3 className="text-xl font-semibold text-arq-slate mb-1">{advisor.name}</h3>
                      <span className="inline-block px-3 py-1 rounded-full bg-arq-lime/20 text-arq-slate text-sm font-medium mb-3">
                        {advisor.expertise}
                      </span>
                      <p className="text-sm text-muted-foreground mb-3">{advisor.bio}</p>
                      <a
                        href={advisor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-arq-deep-blue hover:text-arq-lime transition-colors"
                      >
                        <Linkedin className="w-5 h-5 mx-auto" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* Global Presence */}
        <SectionWrapper className="bg-arq-slate">
          <Container>
            <div className="text-center mb-12">
              <Globe className="w-12 h-12 text-arq-lime mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Global Presence</h2>
              <p className="text-xl text-white/70">
                Serving enterprises across four continents.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {globalOffices.map((office, index) => (
                <motion.div
                  key={office.region}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-arq-lime/20 text-arq-lime mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{office.region}</h3>
                  <ul className="text-sm text-white/60 space-y-1">
                    {office.locations.map((location) => (
                      <li key={location}>{location}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* Principles */}
        <SectionWrapper className="bg-white">
          <Container>
            <SectionHeader
              subtitle="Our Principles"
              title="What We Believe"
              description="The values that guide every decision we make."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-arq-deep-blue text-white mb-4">
                        <principle.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-arq-slate mb-2">{principle.title}</h3>
                      <p className="text-sm text-muted-foreground">{principle.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* CTA */}
        <section className="py-20 bg-arq-off-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-arq-slate mb-4">
                Join Our Journey
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                We're building the future of enterprise AI. Want to be part of it?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CTAButton href="/careers" variant="default" size="xl">
                  View Open Roles
                </CTAButton>
                <CTAButton href="/contact" variant="outline" size="xl">
                  Contact Us
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

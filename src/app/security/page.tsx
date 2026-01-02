'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  FileCheck,
  Eye,
  CheckCircle2,
  Download,
  Building2,
  Scale,
  Globe,
  Server,
  Key,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageWithChat } from '@/components/layout/page-with-chat'
import { Container, SectionHeader, SectionWrapper } from '@/components/shared/section-wrapper'
import { CTAButton } from '@/components/shared/cta-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const certifications = [
  {
    name: 'SOC 2 Type II',
    status: 'In Progress',
    statusColor: 'bg-yellow-100 text-yellow-800',
    description: 'Annual audit for security, availability, and confidentiality controls.',
  },
  {
    name: 'NIST AI RMF',
    status: 'Compliant',
    statusColor: 'bg-green-100 text-green-800',
    description: 'AI Risk Management Framework alignment for responsible AI deployment.',
  },
  {
    name: 'ISO 27001',
    status: 'Roadmap',
    statusColor: 'bg-blue-100 text-blue-800',
    description: 'International standard for information security management.',
  },
  {
    name: 'FedRAMP',
    status: 'Ready',
    statusColor: 'bg-purple-100 text-purple-800',
    description: 'Federal security standards for cloud service providers.',
  },
]

const complianceFrameworks = [
  { name: 'Colorado AI Act', icon: Scale },
  { name: 'EU AI Act', icon: Globe },
  { name: 'HIPAA', icon: Building2 },
  { name: 'Fed SR 11-7', icon: FileCheck },
  { name: 'GDPR', icon: Lock },
  { name: 'SOX', icon: FileText },
]

const securityFeatures = [
  {
    icon: Key,
    title: 'Cryptographic Audit Trails',
    description: 'Every agent action is recorded with cryptographic signatures, creating tamper-proof evidence of what happened and why.',
  },
  {
    icon: Shield,
    title: 'Zero-Trust Architecture',
    description: 'No implicit trust. Every request is authenticated, authorized, and validated before execution.',
  },
  {
    icon: Server,
    title: 'Data Residency Controls',
    description: 'Choose where your data lives. Support for regional deployments and data sovereignty requirements.',
  },
  {
    icon: Lock,
    title: 'Capability Tokens',
    description: 'Fine-grained access control through capability-based security. Agents only get permissions they need.',
  },
  {
    icon: Eye,
    title: 'Real-Time Policy Enforcement',
    description: 'Policies are enforced at execution time, not after the fact. Violations are blocked, not just logged.',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    description: 'Continuous monitoring for unusual patterns. Automatic alerts when agent behavior deviates from baselines.',
  },
]

const auditorResources = [
  {
    title: 'Security Architecture Overview',
    description: 'Technical deep-dive into ArqAI security controls',
    format: 'PDF',
  },
  {
    title: 'SOC 2 Evidence Package',
    description: 'Pre-compiled audit evidence for your compliance team',
    format: 'PDF',
  },
  {
    title: 'Penetration Test Reports',
    description: 'Third-party security assessment results',
    format: 'PDF',
  },
  {
    title: 'Data Processing Agreement',
    description: 'Standard DPA template for enterprise contracts',
    format: 'DOCX',
  },
]

export default function SecurityPage() {
  return (
    <PageWithChat pageContext="security">
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-arq-lime/20 text-arq-lime text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4" />
                Enterprise Security
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Enterprise-Grade Security{' '}
                <span className="text-arq-lime">By Design</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Security isn't a feature we added—it's how we built the platform.
                From cryptographic audit trails to zero-trust architecture, ArqAI is designed for the most demanding enterprises.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CTAButton href="#resources" showArrow glow>
                  Download Security Overview
                </CTAButton>
                <CTAButton href="/demo" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Request Security Review
                </CTAButton>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Certifications */}
        <SectionWrapper className="bg-white">
          <Container>
            <SectionHeader
              subtitle="Certifications & Frameworks"
              title="Compliance You Can Count On"
              description="ArqAI is built to meet the most stringent enterprise security requirements."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-arq-slate">{cert.name}</h3>
                        <Badge className={cert.statusColor}>{cert.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* Compliance Frameworks Enabled */}
        <SectionWrapper className="bg-arq-off-white">
          <Container>
            <SectionHeader
              subtitle="Compliance Enablement"
              title="Meet Any Regulatory Requirement"
              description="ArqAI helps you comply with industry regulations and emerging AI governance laws."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {complianceFrameworks.map((framework, index) => (
                <motion.div
                  key={framework.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center p-6 rounded-xl bg-white border hover:shadow-md transition-shadow"
                >
                  <framework.icon className="w-8 h-8 text-arq-deep-blue mb-3" />
                  <span className="text-sm font-medium text-arq-slate text-center">{framework.name}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-muted-foreground mt-8"
            >
              Plus industry-specific compliance: Financial Services, Healthcare, Government, and more.
            </motion.p>
          </Container>
        </SectionWrapper>

        {/* Security Features */}
        <SectionWrapper className="bg-white">
          <Container>
            <SectionHeader
              subtitle="Security Features"
              title="Defense in Depth"
              description="Multiple layers of security controls protect your data and AI operations."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-arq-deep-blue/10 text-arq-deep-blue mb-4">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-arq-slate mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </SectionWrapper>

        {/* For Your Auditors */}
        <SectionWrapper id="resources" className="bg-arq-slate">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-arq-lime/20 text-arq-lime text-sm font-medium mb-4">
                For Your Auditors
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Security Documentation Ready to Share
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                We've prepared everything your security team needs to evaluate ArqAI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {auditorResources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-6 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-arq-lime/20">
                    <Download className="w-6 h-6 text-arq-lime" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-arq-lime transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-white/60">{resource.description}</p>
                  </div>
                  <Badge className="bg-white/20 text-white">{resource.format}</Badge>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <p className="text-white/60 text-sm mb-4">
                Need something specific? We're happy to prepare custom documentation.
              </p>
              <CTAButton href="/contact" variant="lime">
                Contact Security Team
              </CTAButton>
            </motion.div>
          </Container>
        </SectionWrapper>

        {/* Final CTA */}
        <section className="py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-arq-slate mb-4">
                Ready for a Security Deep-Dive?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our team includes security engineers who speak your language.
                Let's discuss your specific requirements.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CTAButton href="/demo" size="xl" showArrow>
                  Schedule Security Review
                </CTAButton>
                <CTAButton href="/platform" variant="outline" size="xl">
                  Explore Platform
                </CTAButton>
              </div>
            </div>
          </Container>
        </section>
      </main>

        <Footer />
      </div>
    </PageWithChat>
  )
}

'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto prose prose-slate">
              <h1>Privacy Policy</h1>
              <p className="lead">Last updated: January 2026</p>

              <h2>Introduction</h2>
              <p>
                ArqAI ("we," "our," or "us") respects your privacy and is committed to protecting
                your personal data. This privacy policy explains how we collect, use, and safeguard
                your information when you visit our website or use our services.
              </p>

              <h2>Information We Collect</h2>
              <p>We may collect information you provide directly to us, such as:</p>
              <ul>
                <li>Name and contact information</li>
                <li>Company and job title</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your requests and inquiries</li>
                <li>Send you technical notices and updates</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@thearq.ai">privacy@thearq.ai</a>.
              </p>

              <p className="text-sm text-muted-foreground mt-8">
                This is a placeholder privacy policy. The full policy will be available soon.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

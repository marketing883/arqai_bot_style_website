'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto prose prose-slate">
              <h1>Terms of Service</h1>
              <p className="lead">Last updated: January 2026</p>

              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using ArqAI's website and services, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. If you do not agree with
                any of these terms, you are prohibited from using or accessing this site.
              </p>

              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily access the materials on ArqAI's website for
                personal, non-commercial transitory viewing only. This is the grant of a license,
                not a transfer of title.
              </p>

              <h2>Disclaimer</h2>
              <p>
                The materials on ArqAI's website are provided on an 'as is' basis. ArqAI makes no
                warranties, expressed or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>

              <h2>Limitations</h2>
              <p>
                In no event shall ArqAI or its suppliers be liable for any damages arising out of
                the use or inability to use the materials on ArqAI's website.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@thearq.ai">legal@thearq.ai</a>.
              </p>

              <p className="text-sm text-muted-foreground mt-8">
                This is a placeholder terms of service. The full terms will be available soon.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

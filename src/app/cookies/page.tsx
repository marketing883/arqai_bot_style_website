'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto prose prose-slate">
              <h1>Cookie Policy</h1>
              <p className="lead">Last updated: January 2026</p>

              <h2>What Are Cookies</h2>
              <p>
                Cookies are small pieces of text sent to your web browser by a website you visit.
                A cookie file is stored in your web browser and allows the website or a third-party
                to recognize you and make your next visit easier and the website more useful to you.
              </p>

              <h2>How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Preference cookies:</strong> Remember your preferences and settings</li>
              </ul>

              <h2>Your Choices</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences.
                However, if you limit the ability of websites to set cookies, you may worsen your
                overall user experience.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about our Cookie Policy, please contact us at{' '}
                <a href="mailto:privacy@thearq.ai">privacy@thearq.ai</a>.
              </p>

              <p className="text-sm text-muted-foreground mt-8">
                This is a placeholder cookie policy. The full policy will be available soon.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

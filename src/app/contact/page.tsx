'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/section-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@thearq.ai',
    href: 'mailto:hello@thearq.ai',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'New Jersey, USA',
    href: null,
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="py-20 lg:py-28 bg-arq-off-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-arq-slate mb-4">
                  Get in Touch
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Have questions about ArqAI? We'd love to hear from you.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <Card key={item.label}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-arq-deep-blue/10">
                          <item.icon className="w-5 h-5 text-arq-deep-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="font-medium text-arq-slate hover:text-arq-deep-blue">
                              {item.value}
                            </a>
                          ) : (
                            <p className="font-medium text-arq-slate">{item.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Contact Form */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@company.com" required className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" placeholder="Your company" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help?"
                            rows={5}
                            required
                            className="mt-1"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-arq-deep-blue hover:bg-arq-deep-blue/90">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <CheckCircle2 className="w-16 h-16 text-arq-lime mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-arq-slate mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

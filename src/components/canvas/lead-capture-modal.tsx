'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Building, Briefcase, Phone, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConversationStore } from '@/stores/conversation-store'
import { useLeadStore } from '@/stores/lead-store'
import type { FunctionType, BlockType } from '@/types'

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  functionType: FunctionType
  blocksViewed?: BlockType[]
  painPoints?: string[]
  conversationLength?: number
}

type CaptureStep = 'email' | 'details' | 'success'

export function LeadCaptureModal({
  isOpen,
  onClose,
  functionType,
  blocksViewed = [],
  painPoints = [],
  conversationLength = 0,
}: LeadCaptureModalProps) {
  const [step, setStep] = useState<CaptureStep>('email')
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    title: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addLead = useLeadStore((state) => state.addLead)
  const markLeadCaptured = useConversationStore((state) => state.markLeadCaptured)
  const setLeadField = useConversationStore((state) => state.setLeadField)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email' })
      return
    }
    setErrors({})
    setStep('details')
  }

  const handleDetailsSubmit = () => {
    // Create the lead
    const lead = addLead({
      email: formData.email,
      name: formData.name || undefined,
      company: formData.company || undefined,
      title: formData.title || undefined,
      phone: formData.phone || undefined,
      functionType,
      blocksViewed: blocksViewed.length > 0 ? blocksViewed : undefined,
      painPoints: painPoints.length > 0 ? painPoints : undefined,
      conversationLength,
    })

    // Update conversation store
    setLeadField('email', formData.email)
    if (formData.name) setLeadField('name', formData.name)
    if (formData.company) setLeadField('company', formData.company)
    if (formData.title) setLeadField('title', formData.title)
    markLeadCaptured()

    setStep('success')
  }

  const handleClose = () => {
    setStep('email')
    setFormData({ email: '', name: '', company: '', title: '', phone: '' })
    setErrors({})
    onClose()
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-arq-deep-blue to-arq-slate rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/10">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-arq-lime/20">
                    <Sparkles className="w-6 h-6 text-arq-lime" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {step === 'success' ? 'You\'re All Set!' : 'Unlock Full Access'}
                    </h2>
                    <p className="text-white/60 text-sm">
                      {step === 'success'
                        ? 'Thank you for your interest'
                        : 'Get personalized insights and a demo'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'email' && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-white/70 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Work Email
                        </Label>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          autoFocus
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm">{errors.email}</p>
                        )}
                      </div>

                      <Button
                        onClick={handleEmailSubmit}
                        className="w-full bg-arq-lime text-arq-slate hover:bg-arq-lime/90"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>

                      <p className="text-white/40 text-xs text-center">
                        We respect your privacy. No spam, ever.
                      </p>
                    </motion.div>
                  )}

                  {step === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white/70 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Name
                          </Label>
                          <Input
                            type="text"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            autoFocus
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white/70 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Title
                          </Label>
                          <Input
                            type="text"
                            placeholder="CTO"
                            value={formData.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/70 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Company
                        </Label>
                        <Input
                          type="text"
                          placeholder="Acme Inc."
                          value={formData.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/70 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone (optional)
                        </Label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setStep('email')}
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleDetailsSubmit}
                          className="flex-1 bg-arq-lime text-arq-slate hover:bg-arq-lime/90"
                        >
                          Get My Demo
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-arq-lime/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <Sparkles className="w-8 h-8 text-arq-lime" />
                      </motion.div>

                      <h3 className="text-white text-lg font-medium mb-2">
                        Thanks, {formData.name || 'there'}!
                      </h3>
                      <p className="text-white/60 text-sm mb-6">
                        We'll send you a personalized demo link and ROI analysis
                        based on your conversation.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-white/5 rounded-lg p-3 text-left">
                          <p className="text-white/50 text-xs mb-1">What's next:</p>
                          <ul className="space-y-1 text-white/70 text-sm">
                            <li>• Personalized demo in your inbox</li>
                            <li>• Custom ROI analysis</li>
                            <li>• Direct line to our solutions team</li>
                          </ul>
                        </div>

                        <Button
                          onClick={handleClose}
                          className="w-full bg-arq-lime text-arq-slate hover:bg-arq-lime/90"
                        >
                          Continue Exploring
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

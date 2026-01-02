'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, CheckCircle, FileCheck, Download, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SecurityReviewProps {
  data?: Record<string, unknown>
}

const certifications = [
  {
    name: 'SOC 2 Type II',
    status: 'certified',
    validUntil: 'Dec 2025',
    icon: Shield,
    description: 'Independent audit of security controls',
  },
  {
    name: 'HIPAA',
    status: 'compliant',
    validUntil: 'Ongoing',
    icon: FileCheck,
    description: 'Healthcare data protection standards',
  },
  {
    name: 'GDPR',
    status: 'compliant',
    validUntil: 'Ongoing',
    icon: Lock,
    description: 'EU data privacy regulation',
  },
  {
    name: 'ISO 27001',
    status: 'in-progress',
    validUntil: 'Q2 2025',
    icon: CheckCircle,
    description: 'Information security management',
  },
]

const securityFeatures = [
  'End-to-end encryption (AES-256)',
  'Zero-trust architecture',
  'No customer data training',
  'Data residency options (US, EU, APAC)',
  'Role-based access control (RBAC)',
  'Audit logging & monitoring',
  'Penetration testing (quarterly)',
  'Bug bounty program',
]

export function SecurityReview({ data }: SecurityReviewProps) {
  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-foreground text-lg">Security & Compliance</CardTitle>
              <p className="text-muted-foreground text-sm">Enterprise-grade security posture</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Certifications Grid */}
        <div className="grid grid-cols-2 gap-3">
          {certifications.map((cert, index) => {
            const Icon = cert.icon
            const statusColor =
              cert.status === 'certified'
                ? 'text-green-600 bg-green-500/20'
                : cert.status === 'compliant'
                ? 'text-blue-600 bg-blue-500/20'
                : 'text-yellow-600 bg-yellow-500/20'

            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-lg p-3 border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${statusColor.split(' ')[1]}`}>
                    <Icon className={`w-4 h-4 ${statusColor.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-foreground text-sm font-medium truncate">{cert.name}</h4>
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">{cert.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs capitalize ${statusColor.split(' ')[0]}`}>
                        {cert.status.replace('-', ' ')}
                      </span>
                      <span className="text-muted-foreground/50 text-xs">|</span>
                      <span className="text-muted-foreground text-xs">{cert.validUntil}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Security Features */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h4 className="text-foreground text-sm font-medium mb-3">Security Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                <span className="text-muted-foreground text-xs">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button size="sm" className="bg-arq-deep-blue text-white hover:bg-arq-deep-blue/90 flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Security Package
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Trust Center
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

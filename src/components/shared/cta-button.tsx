'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CTAButtonProps extends ButtonProps {
  href?: string
  showArrow?: boolean
  glow?: boolean
}

export function CTAButton({
  children,
  href,
  showArrow = false,
  glow = false,
  className,
  variant = 'lime',
  size = 'lg',
  ...props
}: CTAButtonProps) {
  const buttonContent = (
    <>
      {children}
      {showArrow && (
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      )}
    </>
  )

  const buttonClasses = cn(
    'group transition-all duration-300',
    glow && 'arq-glow-hover',
    className
  )

  if (href) {
    return (
      <Button asChild variant={variant} size={size} className={buttonClasses} {...props}>
        <Link href={href}>
          {buttonContent}
        </Link>
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} className={buttonClasses} {...props}>
      {buttonContent}
    </Button>
  )
}

export function AnimatedCTAButton({
  children,
  href,
  className,
  ...props
}: CTAButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CTAButton href={href} className={className} {...props}>
        {children}
      </CTAButton>
    </motion.div>
  )
}

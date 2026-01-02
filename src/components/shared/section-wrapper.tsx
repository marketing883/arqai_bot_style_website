'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  animate?: boolean
  delay?: number
}

export function SectionWrapper({
  children,
  className,
  id,
  animate = true,
  delay = 0,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (!animate) {
    return (
      <section id={id} className={cn('py-16 md:py-24', className)}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={cn('py-16 md:py-24', className)}
    >
      {children}
    </motion.section>
  )
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  className,
}: {
  title: string
  subtitle?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      {subtitle && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-arq-lime">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-arq-slate sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

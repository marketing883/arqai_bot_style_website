'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePageHighlightStore, type PageSectionId } from '@/stores/page-highlight-store'
import { cn } from '@/lib/utils'

interface HighlightableSectionProps {
  sectionId: PageSectionId
  children: React.ReactNode
  className?: string
}

export function HighlightableSection({
  sectionId,
  children,
  className
}: HighlightableSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const highlightedSection = usePageHighlightStore((s) => s.highlightedSection)
  const scrollToSection = usePageHighlightStore((s) => s.scrollToSection)
  const clearScrollTarget = usePageHighlightStore((s) => s.clearScrollTarget)

  const isHighlighted = highlightedSection === sectionId

  // Scroll to this section when it becomes the scroll target
  useEffect(() => {
    if (scrollToSection === sectionId && ref.current) {
      const yOffset = -80
      const element = ref.current
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
      clearScrollTarget()
    }
  }, [scrollToSection, sectionId, clearScrollTarget])

  return (
    <motion.section
      ref={ref}
      id={sectionId}
      className={cn('relative', className)}
      animate={isHighlighted ? {
        scale: 1,
      } : {
        scale: 1,
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle highlight border - just a thin accent line */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-arq-lime via-emerald-400 to-arq-lime origin-top z-20"
          />
        )}
      </AnimatePresence>

      {/* Content with subtle background shift */}
      <motion.div
        animate={{
          backgroundColor: isHighlighted ? 'rgba(167, 255, 131, 0.03)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {children}
      </motion.div>
    </motion.section>
  )
}

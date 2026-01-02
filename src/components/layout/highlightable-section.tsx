'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePageHighlightStore, type PageSectionId } from '@/stores/page-highlight-store'
import { cn } from '@/lib/utils'

interface HighlightableSectionProps {
  sectionId: PageSectionId
  children: React.ReactNode
  className?: string
  as?: 'section' | 'div'
}

export function HighlightableSection({
  sectionId,
  children,
  className,
  as: Component = 'section'
}: HighlightableSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const highlightedSection = usePageHighlightStore((s) => s.highlightedSection)
  const scrollToSection = usePageHighlightStore((s) => s.scrollToSection)
  const clearScrollTarget = usePageHighlightStore((s) => s.clearScrollTarget)

  const isHighlighted = highlightedSection === sectionId

  // Scroll to this section when it becomes the scroll target
  useEffect(() => {
    if (scrollToSection === sectionId && ref.current) {
      const yOffset = -100 // Account for header
      const element = ref.current
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
      clearScrollTarget()
    }
  }, [scrollToSection, sectionId, clearScrollTarget])

  const MotionComponent = motion[Component]

  return (
    <MotionComponent
      ref={ref}
      id={sectionId}
      className={cn('relative', className)}
      animate={isHighlighted ? {
        scale: [1, 1.005, 1],
        transition: { duration: 1, repeat: 2, ease: 'easeInOut' }
      } : {}}
    >
      {/* Highlight effects */}
      <AnimatePresence>
        {isHighlighted && (
          <>
            {/* Outer glow pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.99, 1.01, 0.99]
              }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -inset-4 bg-gradient-to-r from-arq-lime/20 via-emerald-400/30 to-cyan-400/20 rounded-3xl blur-2xl pointer-events-none z-0"
            />

            {/* Border glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-1 rounded-2xl pointer-events-none z-0"
              style={{
                background: 'linear-gradient(90deg, rgba(167,255,131,0.4), rgba(52,211,153,0.4), rgba(167,255,131,0.4))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
              }}
            />

            {/* Inner content wrapper with subtle background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-arq-lime/5 rounded-xl pointer-events-none z-0"
            />

            {/* Attention indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-arq-lime to-emerald-400 rounded-full shadow-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <span className="text-xs font-semibold text-arq-deep-blue whitespace-nowrap">
                  Relevant to your question
                </span>
              </div>
            </motion.div>

            {/* Corner accents */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: 1
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="absolute w-4 h-4 pointer-events-none z-10"
                style={{
                  top: i < 2 ? '-4px' : 'auto',
                  bottom: i >= 2 ? '-4px' : 'auto',
                  left: i % 2 === 0 ? '-4px' : 'auto',
                  right: i % 2 === 1 ? '-4px' : 'auto',
                }}
              >
                <div
                  className={cn(
                    'w-full h-full',
                    i === 0 && 'border-l-2 border-t-2 rounded-tl-lg',
                    i === 1 && 'border-r-2 border-t-2 rounded-tr-lg',
                    i === 2 && 'border-l-2 border-b-2 rounded-bl-lg',
                    i === 3 && 'border-r-2 border-b-2 rounded-br-lg'
                  )}
                  style={{ borderColor: 'rgba(167, 255, 131, 0.8)' }}
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Actual content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* CSS for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </MotionComponent>
  )
}

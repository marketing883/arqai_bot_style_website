'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 40, text: 'text-xl' },
  lg: { icon: 56, text: 'text-3xl' },
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const { icon, text } = sizeMap[size]

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {/* ArqAI Logo Icon - Blue arrow with lime circle */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Blue angular A shape */}
        <path
          d="M10 90L40 10H60L90 90H70L62 70H38L30 90H10ZM42 55H58L50 30L42 55Z"
          fill="#0A2463"
        />
        {/* Lime green accent circle */}
        <circle cx="70" cy="30" r="12" fill="#A7FF83" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold tracking-tight text-arq-slate', text)}>
            Arq<span className="text-arq-deep-blue">AI</span>
          </span>
          {size === 'lg' && (
            <span className="text-xs tracking-widest text-muted-foreground uppercase">
              Intelligence, By Design
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

// Simplified icon-only version for favicons and small spaces
export function LogoIcon({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10 90L40 10H60L90 90H70L62 70H38L30 90H10ZM42 55H58L50 30L42 55Z"
        fill="#0A2463"
      />
      <circle cx="70" cy="30" r="12" fill="#A7FF83" />
    </svg>
  )
}

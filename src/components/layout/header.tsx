'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { CTAButton } from '@/components/shared/cta-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navigation = {
  product: [
    { name: 'Platform', href: '/platform', description: 'The governed AI platform' },
    { name: 'Security', href: '/security', description: 'Enterprise-grade security' },
  ],
  resources: [
    { name: 'Blog', href: '/blog', description: 'Insights and updates' },
  ],
  company: [
    { name: 'About', href: '/about', description: 'Our story and team' },
    { name: 'Investors', href: '/investors', description: 'Investment opportunity' },
    { name: 'Careers', href: '/careers', description: 'Join our team', comingSoon: true },
  ],
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            {/* Product Dropdown */}
            <NavDropdown label="Product" items={navigation.product} />

            {/* Resources Dropdown */}
            <NavDropdown label="Resources" items={navigation.resources} />

            {/* Company Dropdown */}
            <NavDropdown label="Company" items={navigation.company} />
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <Button variant="ghost" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
            <CTAButton href="/demo" size="default" showArrow>
              Book Demo
            </CTAButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  )
}

function NavDropdown({
  label,
  items,
}: {
  label: string
  items: { name: string; href: string; description: string; comingSoon?: boolean }[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
          {label}
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem key={item.name} asChild disabled={item.comingSoon}>
            <Link
              href={item.comingSoon ? '#' : item.href}
              className={cn(
                'flex flex-col items-start gap-1 py-2',
                item.comingSoon && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="font-medium">
                {item.name}
                {item.comingSoon && (
                  <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lg:hidden fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl"
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <Logo size="sm" />
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-foreground"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Product Section */}
          <MobileNavSection title="Product" items={navigation.product} onClose={onClose} />

          {/* Resources Section */}
          <MobileNavSection title="Resources" items={navigation.resources} onClose={onClose} />

          {/* Company Section */}
          <MobileNavSection title="Company" items={navigation.company} onClose={onClose} />

          {/* CTAs */}
          <div className="pt-6 border-t space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/contact" onClick={onClose}>Contact</Link>
            </Button>
            <CTAButton href="/demo" className="w-full" onClick={onClose} showArrow>
              Book Demo
            </CTAButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MobileNavSection({
  title,
  items,
  onClose,
}: {
  title: string
  items: { name: string; href: string; description: string; comingSoon?: boolean }[]
  onClose: () => void
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.comingSoon ? '#' : item.href}
            onClick={item.comingSoon ? undefined : onClose}
            className={cn(
              'block py-2 text-base font-medium text-foreground hover:text-arq-deep-blue transition-colors',
              item.comingSoon && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.name}
            {item.comingSoon && (
              <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

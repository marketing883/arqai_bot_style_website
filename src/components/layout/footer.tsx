'use client'

import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { Linkedin, Twitter } from 'lucide-react'

const footerNavigation = {
  product: [
    { name: 'Platform', href: '/platform' },
    { name: 'Security', href: '/security' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Investors', href: '/investors' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/arqai',
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/arqai',
    icon: Twitter,
  },
]

export function Footer() {
  return (
    <footer className="bg-arq-slate text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            {/* Logo & Tagline */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {/* White version of logo for dark background */}
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 90L40 10H60L90 90H70L62 70H38L30 90H10ZM42 55H58L50 30L42 55Z"
                    fill="white"
                  />
                  <circle cx="70" cy="30" r="12" fill="#A7FF83" />
                </svg>
                <span className="text-xl font-bold">
                  Arq<span className="text-arq-lime">AI</span>
                </span>
              </div>
              <p className="text-sm text-white/70 mb-6">
                Intelligence, By Design
              </p>
              <p className="text-sm text-white/60 max-w-xs">
                The AI Agent Platform Enterprises Trust to Run in Production.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-arq-lime mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-arq-lime mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-arq-lime mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-arq-lime mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} ArqAI. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-arq-lime transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

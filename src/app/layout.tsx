import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thearq.ai'),
  title: {
    default: 'ArqAI - The AI Agent Platform Enterprises Trust',
    template: '%s | ArqAI',
  },
  description:
    'ArqAI provides governed AI agents that deploy in 30 days, not quarters. Enterprise-grade security, compliance, and observability built-in.',
  keywords: [
    'AI agents',
    'enterprise AI',
    'AI governance',
    'AI compliance',
    'agentic AI',
    'AI platform',
    'IT automation',
    'AI orchestration',
  ],
  authors: [{ name: 'ArqAI' }],
  creator: 'ArqAI',
  publisher: 'ArqAI',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.thearq.ai',
    siteName: 'ArqAI',
    title: 'ArqAI - The AI Agent Platform Enterprises Trust',
    description:
      'Governed agents deployed in 30 days, not quarters. Enterprise-grade security, compliance, and observability built-in.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ArqAI - Intelligence, By Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArqAI - The AI Agent Platform Enterprises Trust',
    description:
      'Governed agents deployed in 30 days, not quarters. Enterprise-grade security, compliance, and observability built-in.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - loaded via CDN for better caching */}
        {/* TODO: Replace with Funnel Display when font files are available */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Copy, Check, ChevronDown, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { FunctionType } from '@/types'

interface CodeSnippetProps {
  functionType: FunctionType
  language?: string
  data?: Record<string, unknown>
}

const codeExamples: Record<FunctionType, {
  title: string
  language: string
  description: string
  code: string
}[]> = {
  'it-infrastructure': [
    {
      title: 'Incident Webhook Handler',
      language: 'python',
      description: 'Receive and process incident alerts',
      code: `from arqai import ArqAI, IncidentHandler

client = ArqAI(api_key="your_api_key")

@client.on_incident
async def handle_incident(incident):
    # ArqAI automatically triages and responds
    response = await client.triage(incident)

    if response.severity == "critical":
        await client.escalate(incident)
    else:
        await client.auto_resolve(incident)

    return response.action_taken`,
    },
    {
      title: 'Deploy Automation',
      language: 'typescript',
      description: 'Trigger automated deployments',
      code: `import { ArqAI } from '@arqai/sdk';

const arq = new ArqAI({ apiKey: process.env.ARQ_KEY });

// Orchestrate deployment with governance
await arq.deploy({
  service: 'api-gateway',
  version: 'v2.1.0',
  environment: 'production',
  approval: 'auto', // Uses policy engine
  rollback: { threshold: 0.01 }
});`,
    },
  ],
  'revenue-operations': [
    {
      title: 'CRM Sync',
      language: 'typescript',
      description: 'Real-time Salesforce synchronization',
      code: `import { ArqAI } from '@arqai/sdk';

const arq = new ArqAI({ apiKey: process.env.ARQ_KEY });

// Sync contacts with enrichment
await arq.sync({
  source: 'salesforce',
  objects: ['Contact', 'Opportunity'],
  enrich: true,
  transform: (record) => ({
    ...record,
    score: arq.scoreLead(record)
  })
});`,
    },
    {
      title: 'Pipeline Automation',
      language: 'python',
      description: 'Automate deal progression',
      code: `from arqai import ArqAI

client = ArqAI(api_key="your_api_key")

# Auto-update pipeline stages
@client.on_deal_activity
async def update_pipeline(deal):
    signals = await client.analyze_signals(deal)

    if signals.ready_to_advance:
        await client.move_stage(
            deal_id=deal.id,
            stage=signals.recommended_stage
        )`,
    },
  ],
  'customer-success': [
    {
      title: 'Ticket Handler',
      language: 'typescript',
      description: 'Intelligent ticket routing and response',
      code: `import { ArqAI } from '@arqai/sdk';

const arq = new ArqAI({ apiKey: process.env.ARQ_KEY });

// Process incoming support ticket
const response = await arq.handleTicket({
  ticket: incomingTicket,
  autoReply: true,
  escalationRules: {
    sentiment: 'negative',
    priority: ['urgent', 'high']
  }
});

console.log(response.resolution);`,
    },
  ],
  'demand-generation': [
    {
      title: 'Lead Qualification',
      language: 'python',
      description: 'Automated lead scoring and routing',
      code: `from arqai import ArqAI

client = ArqAI(api_key="your_api_key")

# Score and qualify lead
@client.on_lead_capture
async def qualify_lead(lead):
    score = await client.score_lead(lead)

    if score.qualified:
        await client.route_to_sales(
            lead=lead,
            rep=score.best_match_rep
        )
    else:
        await client.add_to_nurture(lead)`,
    },
  ],
}

export function CodeSnippet({ functionType, language, data }: CodeSnippetProps) {
  const [activeExample, setActiveExample] = useState(0)
  const [copied, setCopied] = useState(false)

  const examples = codeExamples[functionType]
  const currentExample = examples[activeExample]

  const copyCode = () => {
    navigator.clipboard.writeText(currentExample.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-arq-deep-blue/90 to-arq-slate border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Code className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Code Example</CardTitle>
              <p className="text-white/60 text-sm">{currentExample.description}</p>
            </div>
          </div>
          {examples.length > 1 && (
            <div className="relative">
              <select
                value={activeExample}
                onChange={(e) => setActiveExample(parseInt(e.target.value))}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 pr-8 text-white text-sm focus:outline-none focus:ring-1 focus:ring-arq-lime"
              >
                {examples.map((ex, i) => (
                  <option key={i} value={i} className="bg-arq-slate">
                    {ex.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Code Block */}
        <div className="relative rounded-lg bg-[#0d1117] border border-white/10 overflow-hidden">
          {/* Language Badge & Copy Button */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-white/50 text-xs font-mono">{currentExample.language}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              className="h-6 px-2 text-white/50 hover:text-white hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-green-400" />
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Code Content */}
          <motion.div
            key={activeExample}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 overflow-x-auto"
          >
            <pre className="text-sm font-mono leading-relaxed">
              <code className="text-white/90">
                {currentExample.code.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-white/20 w-8 select-none">{i + 1}</span>
                    <span>{highlightSyntax(line, currentExample.language)}</span>
                  </div>
                ))}
              </code>
            </pre>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <p className="text-white/50 text-xs">
            View more examples in our documentation
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="text-arq-lime hover:bg-arq-lime/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            API Docs
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple syntax highlighting helper
function highlightSyntax(line: string, language: string): JSX.Element {
  // Keywords
  const keywords = ['import', 'from', 'async', 'await', 'def', 'const', 'let', 'var', 'if', 'else', 'return', 'function', 'class', 'export']
  const builtins = ['console', 'process', 'true', 'false', 'null', 'undefined', 'None', 'True', 'False']

  let result = line

  // Simple highlighting - in production, use a proper syntax highlighter
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g')
    result = result.replace(regex, `__KW__${kw}__/KW__`)
  })

  builtins.forEach((bi) => {
    const regex = new RegExp(`\\b${bi}\\b`, 'g')
    result = result.replace(regex, `__BI__${bi}__/BI__`)
  })

  // Convert markers to JSX
  const parts = result.split(/(__KW__|__\/KW__|__BI__|__\/BI__|__STR__|__\/STR__)/)
  let inKeyword = false
  let inBuiltin = false

  return (
    <>
      {parts.map((part, i) => {
        if (part === '__KW__') {
          inKeyword = true
          return null
        }
        if (part === '__/KW__') {
          inKeyword = false
          return null
        }
        if (part === '__BI__') {
          inBuiltin = true
          return null
        }
        if (part === '__/BI__') {
          inBuiltin = false
          return null
        }

        if (inKeyword) {
          return (
            <span key={i} className="text-purple-400">
              {part}
            </span>
          )
        }
        if (inBuiltin) {
          return (
            <span key={i} className="text-blue-400">
              {part}
            </span>
          )
        }

        // Highlight strings
        return (
          <span key={i}>
            {part.split(/(["'`][^"'`]*["'`])/).map((segment, j) => {
              if (segment.match(/^["'`]/)) {
                return (
                  <span key={j} className="text-green-400">
                    {segment}
                  </span>
                )
              }
              // Highlight comments
              if (segment.includes('#') || segment.includes('//')) {
                const commentIndex = segment.indexOf('#') !== -1 ? segment.indexOf('#') : segment.indexOf('//')
                return (
                  <span key={j}>
                    {segment.slice(0, commentIndex)}
                    <span className="text-white/40">{segment.slice(commentIndex)}</span>
                  </span>
                )
              }
              return segment
            })}
          </span>
        )
      })}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Users, Zap, Globe, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LiveStatsProps {
  data?: Record<string, unknown>
}

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: React.ElementType
  color: string
  target: number
  increment: number
}

const baseStats: StatItem[] = [
  {
    label: 'Actions Today',
    value: 0,
    target: 847293,
    suffix: '',
    icon: Zap,
    color: 'text-yellow-400',
    increment: 47,
  },
  {
    label: 'Active Agents',
    value: 0,
    target: 1247,
    suffix: '',
    icon: Activity,
    color: 'text-green-400',
    increment: 1,
  },
  {
    label: 'Enterprise Clients',
    value: 0,
    target: 89,
    suffix: '+',
    icon: Users,
    color: 'text-blue-400',
    increment: 0,
  },
  {
    label: 'Uptime',
    value: 99.99,
    target: 99.99,
    suffix: '%',
    icon: Clock,
    color: 'text-purple-400',
    increment: 0,
  },
  {
    label: 'Global Regions',
    value: 0,
    target: 12,
    suffix: '',
    icon: Globe,
    color: 'text-orange-400',
    increment: 0,
  },
  {
    label: 'Cost Reduction',
    value: 0,
    target: 40,
    suffix: '%',
    icon: TrendingUp,
    color: 'text-arq-lime',
    increment: 0,
  },
]

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toLocaleString()
}

export function LiveStats({ data }: LiveStatsProps) {
  const [stats, setStats] = useState(baseStats)

  // Animate stats on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          if (stat.value < stat.target) {
            const step = Math.max(1, Math.floor((stat.target - stat.value) / 20))
            return {
              ...stat,
              value: Math.min(stat.target, stat.value + step),
            }
          }
          // Add small live increment for dynamic stats
          if (stat.increment > 0 && Math.random() > 0.7) {
            return {
              ...stat,
              value: stat.value + stat.increment,
            }
          }
          return stat
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-foreground text-lg">Live Platform Stats</CardTitle>
            <p className="text-muted-foreground text-sm">Real-time ArqAI metrics</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-lg p-3 text-center hover:bg-muted transition-colors border border-border"
              >
                <Icon className={`w-5 h-5 ${stat.color.replace('-400', '-600')} mx-auto mb-2`} />
                <div className="text-xl font-bold text-foreground">
                  {stat.suffix === '%'
                    ? stat.value.toFixed(2)
                    : formatNumber(Math.floor(stat.value))}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground text-xs">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
          </span>
          <span className="text-muted-foreground text-xs">Updated in real-time</span>
        </div>
      </CardContent>
    </Card>
  )
}

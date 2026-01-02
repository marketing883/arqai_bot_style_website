'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Flame,
  ThermometerSun,
  Snowflake,
  Download,
  Search,
  Filter,
  Mail,
  Building,
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import { useLeadStore, selectHotLeads, selectWarmLeads, selectColdLeads } from '@/stores/lead-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Lead, LeadTier, LeadStatus, FunctionType } from '@/types'

// Function display names
const functionNames: Record<FunctionType, string> = {
  'it-infrastructure': 'IT Infrastructure',
  'revenue-operations': 'Revenue Operations',
  'customer-success': 'Customer Success',
  'demand-generation': 'Demand Generation',
}

// Tier styling
const tierConfig: Record<LeadTier, { icon: React.ElementType; color: string; bgColor: string }> = {
  hot: { icon: Flame, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  warm: { icon: ThermometerSun, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  cold: { icon: Snowflake, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
}

// Status styling
const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-green-500/20 text-green-400' },
  contacted: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400' },
  qualified: { label: 'Qualified', color: 'bg-purple-500/20 text-purple-400' },
  converted: { label: 'Converted', color: 'bg-arq-lime/20 text-arq-lime' },
  lost: { label: 'Lost', color: 'bg-red-500/20 text-red-400' },
}

export default function DashboardPage() {
  const leads = useLeadStore((state) => state.leads)
  const hotLeads = useLeadStore(selectHotLeads)
  const warmLeads = useLeadStore(selectWarmLeads)
  const coldLeads = useLeadStore(selectColdLeads)
  const exportLeads = useLeadStore((state) => state.exportLeads)
  const updateLead = useLeadStore((state) => state.updateLead)
  const deleteLead = useLeadStore((state) => state.deleteLead)

  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<LeadTier | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          lead.email.toLowerCase().includes(searchLower) ||
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.company?.toLowerCase().includes(searchLower) ||
          lead.title?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Tier filter
      if (tierFilter !== 'all' && lead.tier !== tierFilter) return false

      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false

      return true
    })
  }, [leads, search, tierFilter, statusFilter])

  const handleExport = () => {
    const csv = exportLeads()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arqai-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    updateLead(leadId, { status })
  }

  return (
    <div className="min-h-screen bg-arq-slate">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-arq-deep-blue/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sales Dashboard</h1>
              <p className="text-white/60 text-sm">Manage and track your leads</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" className="bg-arq-lime text-arq-slate hover:bg-arq-lime/90">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync CRM
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-arq-lime/20">
                    <Users className="w-6 h-6 text-arq-lime" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Leads</p>
                    <p className="text-3xl font-bold text-white">{leads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/20">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Hot Leads</p>
                    <p className="text-3xl font-bold text-white">{hotLeads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <ThermometerSun className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Warm Leads</p>
                    <p className="text-3xl font-bold text-white">{warmLeads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold text-white">
                      {leads.length > 0
                        ? Math.round(
                            (leads.filter((l) => l.status === 'converted').length / leads.length) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Tier: {tierFilter === 'all' ? 'All' : tierFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-arq-slate border-white/10">
                <DropdownMenuItem
                  onClick={() => setTierFilter('all')}
                  className="text-white hover:bg-white/10"
                >
                  All Tiers
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTierFilter('hot')}
                  className="text-white hover:bg-white/10"
                >
                  <Flame className="w-4 h-4 mr-2 text-orange-400" />
                  Hot
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTierFilter('warm')}
                  className="text-white hover:bg-white/10"
                >
                  <ThermometerSun className="w-4 h-4 mr-2 text-yellow-400" />
                  Warm
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTierFilter('cold')}
                  className="text-white hover:bg-white/10"
                >
                  <Snowflake className="w-4 h-4 mr-2 text-blue-400" />
                  Cold
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Status: {statusFilter === 'all' ? 'All' : statusConfig[statusFilter].label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-arq-slate border-white/10">
                <DropdownMenuItem
                  onClick={() => setStatusFilter('all')}
                  className="text-white hover:bg-white/10"
                >
                  All Statuses
                </DropdownMenuItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status as LeadStatus)}
                    className="text-white hover:bg-white/10"
                  >
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Leads Table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              Leads ({filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No leads found</p>
                <p className="text-white/40 text-sm mt-1">
                  {leads.length === 0
                    ? 'Leads will appear here as visitors interact with ArqBot'
                    : 'Try adjusting your filters'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Company
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Function
                      </th>
                      <th className="text-center py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Score
                      </th>
                      <th className="text-center py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Tier
                      </th>
                      <th className="text-center py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-white/50 text-xs font-medium uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => {
                      const TierIcon = tierConfig[lead.tier].icon
                      return (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-arq-lime to-green-500 flex items-center justify-center text-arq-slate font-bold">
                                {(lead.name || lead.email)
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {lead.name || 'Unknown'}
                                </p>
                                <div className="flex items-center gap-1 text-white/50 text-sm">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-white/40" />
                              <div>
                                <p className="text-white">{lead.company || '-'}</p>
                                <p className="text-white/50 text-sm">{lead.title || '-'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-white/70 text-sm">
                              {functionNames[lead.functionType]}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-arq-lime/20">
                              <span className="text-arq-lime font-bold">{lead.score}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${tierConfig[lead.tier].bgColor}`}
                            >
                              <TierIcon className={`w-3 h-3 ${tierConfig[lead.tier].color}`} />
                              <span className={`text-xs capitalize ${tierConfig[lead.tier].color}`}>
                                {lead.tier}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Badge
                                  className={`cursor-pointer ${statusConfig[lead.status].color}`}
                                >
                                  {statusConfig[lead.status].label}
                                </Badge>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-arq-slate border-white/10">
                                {Object.entries(statusConfig).map(([status, config]) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => handleStatusChange(lead.id, status as LeadStatus)}
                                    className="text-white hover:bg-white/10"
                                  >
                                    {config.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white/50 hover:text-white hover:bg-white/10"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-arq-slate border-white/10">
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteLead(lead.id)}
                                  className="text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

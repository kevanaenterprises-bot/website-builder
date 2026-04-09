import React, { useState, useMemo } from 'react'
import {
  Page, PageHeader, PageTitle, PageDescription, PageBody,
  DataTable, StatGroup, Stat, Button, Badge,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Card, CardContent, VStack, HStack
} from '@blinkdotnew/ui'
import { Phone, Star, MessageSquare, ExternalLink, FileText, TrendingUp, Users, CheckCircle2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { LEADS } from '../data/leads'

export default function Dashboard() {
  const navigate = useNavigate()
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isScriptOpen, setIsScriptOpen] = useState(false)

  const leads = LEADS

  const totalLeads = leads.length
  const contactedLeads = leads.filter((l: any) => l?.status === '✅ Closed').length
  const conversionRate = totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(1) : '0'

  const columns = useMemo(() => [
    {
      accessorKey: 'business_name',
      header: 'Business',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">
              {(row.original?.business_name || 'U').charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground leading-tight">
              {row.original?.business_name || 'Unknown'}
            </p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              {row.original?.category || ''}
            </p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Phone className="h-3 w-3" />
          {row.original.phone || '—'}
        </span>
      )
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }: any) => (
        <HStack gap={1} className="items-center">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{row.original.google_rating}</span>
          <span className="text-xs text-muted-foreground">({row.original.review_count} reviews)</span>
        </HStack>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status || 'new'
        return <Badge variant="outline" className="capitalize">{status}</Badge>
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
            onPointerDown={(e) => { e.stopPropagation(); setSelectedLead(row.original); setIsScriptOpen(true) }}
          >
            <FileText className="h-3.5 w-3.5" />
            Call Script
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            onPointerDown={(e) => { e.stopPropagation(); navigate({ to: `/preview/${row.original.id}` }) }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Preview
          </button>
        </div>
      )
    }
  ], [navigate, setSelectedLead, setIsScriptOpen])

  return (
    <Page className="animate-fade-in">
      <PageHeader>
        <VStack gap={1}>
          <PageTitle>Lead Dashboard</PageTitle>
          <PageDescription>Track your outreach and preview generated sites for local businesses.</PageDescription>
        </VStack>
      </PageHeader>
      <PageBody>
        <StatGroup className="mb-8">
          <Stat label="Total Leads" value={totalLeads.toString()} icon={<Users className="text-primary" />} />
          <Stat label="Contacted" value={contactedLeads.toString()} icon={<CheckCircle2 className="text-secondary" />} />
          <Stat label="Outreach Rate" value={`${conversionRate}%`} icon={<TrendingUp className="text-accent" />} trend={12} trendLabel="vs last week" />
        </StatGroup>
        <Card>
          <CardContent className="pt-6">
            <DataTable columns={columns} data={leads} searchable searchColumn="business_name" />
          </CardContent>
        </Card>
      </PageBody>

      <Dialog open={isScriptOpen} onOpenChange={setIsScriptOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Sales Script: {selectedLead?.business_name}
            </DialogTitle>
            <DialogDescription>Use this tailored script for your initial outreach call.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <section className="bg-muted p-4 rounded-lg border border-border">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Opening (Phase 4 Hook)</h4>
              <p className="text-lg leading-relaxed italic">
                "Hey, I was looking at <span className="text-primary font-bold">{selectedLead?.business_name}</span> and noticed you have <span className="font-bold">{selectedLead?.google_rating} stars</span> with <span className="font-bold">{selectedLead?.review_count} reviews</span>. I actually built a premium version of your site to show you how much better it could look. Can I send you the link?"
              </p>
            </section>
            <section className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-3">The Pitch (Phase 5 Rejection Handler)</h4>
              <p className="text-lg leading-relaxed">
                "Most of your competitors are using modern, fast-loading sites. Your current site is missing <span className="font-bold underline text-secondary">{selectedLead?.hook || 'a clear call-to-action'}</span>. I've fixed that in the preview."
              </p>
            </section>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsScriptOpen(false)}>Close</Button>
              <Button onClick={() => { window.open(`/preview/${selectedLead?.id}`, '_blank'); setIsScriptOpen(false) }}>
                Open Preview Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Page>
  )
}

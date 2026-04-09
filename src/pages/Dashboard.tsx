import React, { useState } from 'react'
import {
  Page, PageHeader, PageTitle, PageDescription, PageBody,
  StatGroup, Stat, Button, Badge,
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
  const [search, setSearch] = useState('')

  const leads = LEADS
  const totalLeads = leads.length
  const contactedLeads = leads.filter((l: any) => l?.status === '✅ Closed').length
  const conversionRate = totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(1) : '0'

  const filtered = leads.filter(l =>
    l.business_name.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  )

  function openScript(lead: any) {
    setSelectedLead(lead)
    setIsScriptOpen(true)
  }

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
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full max-w-sm px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Business</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Phone</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Rating</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-sm">{lead.business_name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground leading-tight">{lead.business_name}</p>
                            <p className="text-xs text-muted-foreground leading-tight mt-0.5">{lead.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          {lead.phone || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{lead.google_rating}</span>
                          <span className="text-xs text-muted-foreground">({lead.review_count})</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="capitalize text-xs">{lead.status}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openScript(lead)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-muted transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Call Script
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate({ to: `/preview/${lead.id}` })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

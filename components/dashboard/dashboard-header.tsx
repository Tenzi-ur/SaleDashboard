'use client'

import { Download, IndianRupee, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Filters, StateRow } from '@/lib/analytics'

type Props = {
  filters: Filters
  states: StateRow[]
  onReset: () => void
}

function exportCsv(filters: Filters, states: StateRow[]) {
  const header = ['State', 'Region', 'Sales (INR)', 'Profit (INR)', 'Margin %', 'Orders', 'Target (INR)', 'Achievement %']
  const lines = states.map((s) =>
    [
      s.state,
      s.region,
      s.sales,
      s.profit,
      (s.margin * 100).toFixed(2),
      s.orders,
      s.target,
      (s.achievement * 100).toFixed(2),
    ].join(','),
  )
  const csv = [header.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `india-sales-${filters.fy.replace(/\s+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function DashboardHeader({ filters, states, onReset }: Props) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <IndianRupee className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-balance text-xl font-semibold tracking-tight md:text-2xl">
            India Sales Performance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Sales, profit and KPI tracking across 19 states &middot; {filters.fy}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          Reset filters
        </Button>
        <Button size="sm" onClick={() => exportCsv(filters, states)}>
          <Download data-icon="inline-start" aria-hidden="true" />
          Export CSV
        </Button>
      </div>
    </header>
  )
}

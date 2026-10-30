'use client'

import { useMemo, useState } from 'react'
import {
  categoryBreakdown,
  filterRecords,
  monthlyTrend,
  previousFiscalYear,
  quarterlyPerformance,
  regionBreakdown,
  stateLeaderboard,
  summarize,
  type Filters,
} from '@/lib/analytics'
import { SALES_DATA } from '@/lib/sales-data'
import { DashboardHeader } from './dashboard-header'
import { FiltersBar } from './filters-bar'
import { KpiCards } from './kpi-cards'
import { SalesTrendChart } from './sales-trend-chart'
import { CategoryChart } from './category-chart'
import { RegionChart } from './region-chart'
import { QuarterlyChart } from './quarterly-chart'
import { StateTable } from './state-table'
import { InsightsPanel } from './insights-panel'

const DEFAULT_FILTERS: Filters = {
  fy: 'FY 2025-26',
  region: 'All',
  category: 'All',
  segment: 'All',
}

export function SalesDashboard() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const toggleFilter = <K extends 'region' | 'category'>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? 'All' : value }))

  const data = useMemo(() => {
    const prevFy = previousFiscalYear(filters.fy)
    const current = filterRecords(SALES_DATA, filters)
    const previous = prevFy ? filterRecords(SALES_DATA, filters, prevFy) : []
    return {
      prevFy,
      totals: summarize(current),
      prevTotals: prevFy ? summarize(previous) : null,
      trend: monthlyTrend(current, previous),
      regions: regionBreakdown(filterRecords(SALES_DATA, { ...filters, region: 'All' })),
      categories: categoryBreakdown(filterRecords(SALES_DATA, { ...filters, category: 'All' })),
      quarters: quarterlyPerformance(current),
      states: stateLeaderboard(current),
    }
  }, [filters])

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-6 md:px-6 lg:px-8">
      <DashboardHeader
        filters={filters}
        states={data.states}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <FiltersBar filters={filters} onChange={updateFilter} />

      <KpiCards totals={data.totals} prevTotals={data.prevTotals} prevFy={data.prevFy} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SalesTrendChart
          className="lg:col-span-2"
          data={data.trend}
          fy={filters.fy}
          prevFy={data.prevFy}
        />
        <CategoryChart
          data={data.categories}
          selected={filters.category}
          onSelect={(c) => toggleFilter('category', c)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RegionChart
          data={data.regions}
          selected={filters.region}
          onSelect={(r) => toggleFilter('region', r)}
        />
        <QuarterlyChart data={data.quarters} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <StateTable className="lg:col-span-2" rows={data.states} />
        <InsightsPanel
          trend={data.trend}
          states={data.states}
          categories={data.categories}
          totals={data.totals}
        />
      </div>

      <footer className="pb-2 pt-1 text-center text-xs text-muted-foreground">
        Figures in Indian Rupees (₹) using Lakh (L) and Crore (Cr) notation. Fiscal year runs April
        to March. Data is illustrative.
      </footer>
    </div>
  )
}

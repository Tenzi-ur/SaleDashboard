import { Award, CalendarDays, Lightbulb, MapPin, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StateRow, Totals } from '@/lib/analytics'
import { formatINRCompact, formatPercent } from '@/lib/format'
import { ChartCard } from './chart-card'

type Props = {
  trend: { month: string; sales: number }[]
  states: StateRow[]
  categories: { category: string; sales: number; margin: number }[]
  totals: Totals
}

type Insight = { icon: LucideIcon; title: string; body: string }

export function InsightsPanel({ trend, states, categories, totals }: Props) {
  const insights: Insight[] = []

  const peak = trend.reduce((best, m) => (m.sales > best.sales ? m : best), trend[0])
  if (peak && peak.sales > 0) {
    insights.push({
      icon: CalendarDays,
      title: `Peak month: ${peak.month}`,
      body: `${formatINRCompact(peak.sales)} in sales, driven by the festive season demand.`,
    })
  }

  const top = states[0]
  if (top && totals.sales > 0) {
    insights.push({
      icon: MapPin,
      title: `Top state: ${top.state}`,
      body: `Contributes ${formatPercent(top.sales / totals.sales)} of total sales at a ${formatPercent(top.margin)} margin.`,
    })
  }

  const withSales = categories.filter((c) => c.sales > 0)
  if (withSales.length > 0) {
    const best = withSales.reduce((a, b) => (b.margin > a.margin ? b : a))
    const worst = withSales.reduce((a, b) => (b.margin < a.margin ? b : a))
    insights.push({
      icon: Award,
      title: `Most profitable: ${best.category}`,
      body: `Highest margin category at ${formatPercent(best.margin)}.`,
    })
    if (worst.category !== best.category) {
      insights.push({
        icon: TrendingDown,
        title: `Watch: ${worst.category}`,
        body: `Lowest margin at ${formatPercent(worst.margin)}. Review discounts and logistics costs.`,
      })
    }
  }

  const behind = states.filter((s) => s.achievement < 1).length
  insights.push({
    icon: Lightbulb,
    title: `${states.length - behind} of ${states.length} states on target`,
    body:
      behind > 0
        ? `${behind} state${behind > 1 ? 's are' : ' is'} below the sales target for this period.`
        : 'Every state has met or exceeded its sales target.',
  })

  return (
    <ChartCard title="Key Insights" description="Auto-generated from the current filters">
      <ul className="flex flex-col gap-3">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <li key={insight.title} className="flex gap-3 rounded-lg bg-muted p-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{insight.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </ChartCard>
  )
}

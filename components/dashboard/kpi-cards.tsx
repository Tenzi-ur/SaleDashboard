import { ArrowDownRight, ArrowUpRight, IndianRupee, Percent, ShoppingCart, Target, TrendingUp, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Totals } from '@/lib/analytics'
import { formatINRCompact, formatINR, formatNumber, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

type Props = {
  totals: Totals
  prevTotals: Totals | null
  prevFy: string | null
}

type Kpi = {
  label: string
  value: string
  title: string
  icon: LucideIcon
  change: number | null
  changeLabel: string
}

function pctChange(current: number, previous: number | undefined) {
  if (!previous) return null
  return (current - previous) / Math.abs(previous)
}

export function KpiCards({ totals, prevTotals, prevFy }: Props) {
  const kpis: Kpi[] = [
    {
      label: 'Total Sales',
      value: formatINRCompact(totals.sales),
      title: formatINR(totals.sales),
      icon: IndianRupee,
      change: pctChange(totals.sales, prevTotals?.sales),
      changeLabel: '',
    },
    {
      label: 'Total Profit',
      value: formatINRCompact(totals.profit),
      title: formatINR(totals.profit),
      icon: Wallet,
      change: pctChange(totals.profit, prevTotals?.profit),
      changeLabel: '',
    },
    {
      label: 'Profit Margin',
      value: formatPercent(totals.margin),
      title: formatPercent(totals.margin, 2),
      icon: Percent,
      change: prevTotals ? totals.margin - prevTotals.margin : null,
      changeLabel: 'pp',
    },
    {
      label: 'Total Orders',
      value: formatNumber(totals.orders),
      title: `${formatNumber(totals.units)} units sold`,
      icon: ShoppingCart,
      change: pctChange(totals.orders, prevTotals?.orders),
      changeLabel: '',
    },
    {
      label: 'Avg Order Value',
      value: formatINR(totals.aov),
      title: formatINR(totals.aov),
      icon: TrendingUp,
      change: pctChange(totals.aov, prevTotals?.aov),
      changeLabel: '',
    },
    {
      label: 'Target Achieved',
      value: formatPercent(totals.achievement),
      title: `Target ${formatINRCompact(totals.target)}`,
      icon: Target,
      change: prevTotals ? totals.achievement - prevTotals.achievement : null,
      changeLabel: 'pp',
    },
  ]

  return (
    <section aria-label="Key performance indicators" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const positive = (kpi.change ?? 0) >= 0
        const formattedChange =
          kpi.change === null
            ? null
            : kpi.changeLabel === 'pp'
              ? `${positive ? '+' : ''}${(kpi.change * 100).toFixed(1)} pp`
              : `${positive ? '+' : ''}${(kpi.change * 100).toFixed(1)}%`
        return (
          <article key={kpi.label} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium text-muted-foreground">{kpi.label}</h2>
              <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
            </div>
            <p className="font-mono text-xl font-semibold tabular-nums tracking-tight md:text-2xl" title={kpi.title}>
              {kpi.value}
            </p>
            {formattedChange ? (
              <p className="flex items-center gap-1 text-xs">
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-medium',
                    positive ? 'text-positive' : 'text-negative',
                  )}
                >
                  {positive ? (
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="size-3.5" aria-hidden="true" />
                  )}
                  {formattedChange}
                </span>
                <span className="text-muted-foreground">vs {prevFy}</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No prior year data</p>
            )}
          </article>
        )
      })}
    </section>
  )
}

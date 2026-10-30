'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatAxisINR } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ChartCard, inrTooltipFormatter } from './chart-card'

type TrendPoint = {
  month: string
  sales: number
  profit: number
  prevSales: number
  prevProfit: number
}

type Props = {
  data: TrendPoint[]
  fy: string
  prevFy: string | null
  className?: string
}

type Metric = 'sales' | 'profit'

export function SalesTrendChart({ data, fy, prevFy, className }: Props) {
  const [metric, setMetric] = useState<Metric>('sales')
  const currentKey = metric
  const prevKey = metric === 'sales' ? 'prevSales' : 'prevProfit'
  const metricLabel = metric === 'sales' ? 'Sales' : 'Profit'

  const config = {
    [currentKey]: { label: `${metricLabel} ${fy}`, color: 'var(--chart-1)' },
    [prevKey]: { label: `${metricLabel} ${prevFy ?? ''}`, color: 'var(--chart-2)' },
  } satisfies ChartConfig

  return (
    <ChartCard
      className={className}
      title="Monthly Sales Trend"
      description={`${metricLabel} by month, April to March${prevFy ? ` · compared with ${prevFy}` : ''}`}
      action={
        <div role="group" aria-label="Select metric" className="flex rounded-lg bg-muted p-0.5">
          {(['sales', 'profit'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metric === m}
              onClick={() => setMetric(m)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                metric === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      }
    >
      <ChartContainer config={config} className="aspect-auto h-[300px] w-full">
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${currentKey})`} stopOpacity={0.3} />
              <stop offset="95%" stopColor={`var(--color-${currentKey})`} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v: number) => formatAxisINR(v)}
          />
          <ChartTooltip content={<ChartTooltipContent formatter={inrTooltipFormatter(config)} />} />
          <Area
            type="monotone"
            dataKey={currentKey}
            stroke={`var(--color-${currentKey})`}
            strokeWidth={2.5}
            fill="url(#trendFill)"
          />
          {prevFy && (
            <Line
              type="monotone"
              dataKey={prevKey}
              stroke={`var(--color-${prevKey})`}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
            />
          )}
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

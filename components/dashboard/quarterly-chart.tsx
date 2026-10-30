'use client'

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatAxisINR, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ChartCard, inrTooltipFormatter } from './chart-card'

type Props = {
  data: { quarter: string; sales: number; target: number; achievement: number }[]
}

const config = {
  sales: { label: 'Actual sales', color: 'var(--chart-4)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function QuarterlyChart({ data }: Props) {
  return (
    <ChartCard title="Quarterly Sales vs Target" description="Actual sales against quarterly targets">
      <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
        <ComposedChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={60} tickFormatter={(v: number) => formatAxisINR(v)} />
          <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent formatter={inrTooltipFormatter(config)} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={[6, 6, 0, 0]} maxBarSize={56} />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-target)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-target)' }}
          />
        </ComposedChart>
      </ChartContainer>
      <dl className="grid grid-cols-4 gap-2">
        {data.map((q) => {
          const met = q.achievement >= 1
          return (
            <div key={q.quarter} className="rounded-lg bg-muted px-2 py-2 text-center">
              <dt className="text-[11px] text-muted-foreground">{q.quarter} achieved</dt>
              <dd className={cn('font-mono text-sm font-semibold tabular-nums', met ? 'text-positive' : 'text-negative')}>
                {formatPercent(q.achievement)}
              </dd>
            </div>
          )
        })}
      </dl>
    </ChartCard>
  )
}

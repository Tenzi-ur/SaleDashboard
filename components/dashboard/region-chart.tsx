'use client'

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { Filters } from '@/lib/analytics'
import { formatAxisINR } from '@/lib/format'
import type { Region } from '@/lib/sales-data'
import { ChartCard, inrTooltipFormatter } from './chart-card'

type Props = {
  data: { region: Region; sales: number; profit: number; margin: number }[]
  selected: Filters['region']
  onSelect: (region: Region) => void
}

const config = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function RegionChart({ data, selected, onSelect }: Props) {
  const opacityFor = (region: Region) => (selected === 'All' || selected === region ? 1 : 0.3)

  return (
    <ChartCard title="Sales & Profit by Region" description="Click a bar to filter the dashboard by region">
      <ChartContainer config={config} className="aspect-auto h-[280px] w-full">
        <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }} barGap={4}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={60} tickFormatter={(v: number) => formatAxisINR(v)} />
          <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent formatter={inrTooltipFormatter(config)} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="sales"
            fill="var(--color-sales)"
            radius={[6, 6, 0, 0]}
            className="cursor-pointer"
            onClick={(_, index) => onSelect(data[index].region)}
          >
            {data.map((d) => (
              <Cell key={d.region} opacity={opacityFor(d.region)} />
            ))}
          </Bar>
          <Bar
            dataKey="profit"
            fill="var(--color-profit)"
            radius={[6, 6, 0, 0]}
            className="cursor-pointer"
            onClick={(_, index) => onSelect(data[index].region)}
          >
            {data.map((d) => (
              <Cell key={d.region} opacity={opacityFor(d.region)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

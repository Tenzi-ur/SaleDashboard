'use client'

import { Cell, Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { Filters } from '@/lib/analytics'
import { formatINRCompact, formatPercent } from '@/lib/format'
import type { Category } from '@/lib/sales-data'
import { cn } from '@/lib/utils'
import { ChartCard, inrTooltipFormatter } from './chart-card'

type Props = {
  data: { category: Category; sales: number; profit: number; margin: number }[]
  selected: Filters['category']
  onSelect: (category: Category) => void
}

const config = {
  Electronics: { label: 'Electronics', color: 'var(--chart-1)' },
  Furniture: { label: 'Furniture', color: 'var(--chart-2)' },
  'Office Supplies': { label: 'Office Supplies', color: 'var(--chart-3)' },
  Apparel: { label: 'Apparel', color: 'var(--chart-4)' },
  'Home & Kitchen': { label: 'Home & Kitchen', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function CategoryChart({ data, selected, onSelect }: Props) {
  const total = data.reduce((sum, d) => sum + d.sales, 0)
  const chartData = data.map((d) => ({ ...d, fill: config[d.category].color }))

  return (
    <ChartCard title="Sales by Category" description="Click a slice or row to filter">
      <ChartContainer config={config} className="mx-auto aspect-square h-[200px]">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="category" hideLabel formatter={inrTooltipFormatter(config)} />}
          />
          <Pie
            data={chartData}
            dataKey="sales"
            nameKey="category"
            innerRadius={58}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={2}
            className="cursor-pointer"
            onClick={(_, index) => onSelect(chartData[index].category)}
          >
            {chartData.map((d) => (
              <Cell
                key={d.category}
                fill={d.fill}
                opacity={selected === 'All' || selected === d.category ? 1 : 0.3}
              />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !('cx' in viewBox)) return null
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 6} className="fill-foreground font-mono text-base font-semibold">
                      {formatINRCompact(total, 1)}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 14} className="fill-muted-foreground text-xs">
                      Total sales
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="flex flex-col gap-1">
        {chartData.map((d) => {
          const active = selected === d.category
          return (
            <li key={d.category}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(d.category)}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted',
                  active && 'bg-muted',
                  selected !== 'All' && !active && 'opacity-50',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-[2px]" style={{ backgroundColor: d.fill }} />
                  {d.category}
                </span>
                <span className="flex items-center gap-3 font-mono tabular-nums">
                  <span className="text-muted-foreground">{formatPercent(total ? d.sales / total : 0, 0)}</span>
                  <span className="w-16 text-right font-medium">{formatINRCompact(d.sales, 1)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </ChartCard>
  )
}

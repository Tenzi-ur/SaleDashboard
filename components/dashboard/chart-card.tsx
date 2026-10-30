import type { ReactNode } from 'react'
import type { ChartConfig } from '@/components/ui/chart'
import { formatINRCompact } from '@/lib/format'
import { cn } from '@/lib/utils'

type ChartCardProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function ChartCard({ title, description, action, className, children }: ChartCardProps) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function inrTooltipFormatter(config: ChartConfig) {
  return function TooltipRow(
    value: unknown,
    name: unknown,
    item: { color?: string; payload?: { fill?: string } },
  ) {
    const key = String(name)
    const color = item.color ?? item.payload?.fill
    return (
      <div className="flex w-full min-w-36 items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
          {config[key]?.label ?? key}
        </span>
        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatINRCompact(Number(value))}
        </span>
      </div>
    )
  }
}

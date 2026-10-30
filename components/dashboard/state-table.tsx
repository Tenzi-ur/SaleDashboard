'use client'

import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { StateRow } from '@/lib/analytics'
import { formatINR, formatINRCompact, formatNumber, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ChartCard } from './chart-card'

type SortKey = 'sales' | 'profit' | 'margin' | 'orders' | 'achievement'

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'sales', label: 'Sales' },
  { key: 'profit', label: 'Profit' },
  { key: 'margin', label: 'Margin' },
  { key: 'orders', label: 'Orders' },
  { key: 'achievement', label: 'Target' },
]

export function StateTable({ rows, className }: { rows: StateRow[]; className?: string }) {
  const [sortKey, setSortKey] = useState<SortKey>('sales')
  const sorted = [...rows].sort((a, b) => b[sortKey] - a[sortKey])

  return (
    <ChartCard
      className={className}
      title="State-wise Performance"
      description={`${rows.length} states ranked by ${COLUMNS.find((c) => c.key === sortKey)?.label.toLowerCase()}`}
    >
      <div className="max-h-[420px] overflow-auto rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>State</TableHead>
              {COLUMNS.map((col) => (
                <TableHead key={col.key} className="text-right" aria-sort={sortKey === col.key ? 'descending' : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortKey(col.key)}
                    className={cn(
                      'inline-flex items-center gap-1 hover:text-foreground',
                      sortKey === col.key && 'text-foreground',
                    )}
                  >
                    {col.label}
                    <ArrowUpDown className="size-3" aria-hidden="true" />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row, i) => (
              <TableRow key={row.state}>
                <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.state}</div>
                  <div className="text-xs text-muted-foreground">{row.region}</div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums" title={formatINR(row.sales)}>
                  {formatINRCompact(row.sales)}
                </TableCell>
                <TableCell
                  className={cn('text-right font-mono tabular-nums', row.profit < 0 && 'text-negative')}
                  title={formatINR(row.profit)}
                >
                  {formatINRCompact(row.profit)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">{formatPercent(row.margin)}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{formatNumber(row.orders)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block" aria-hidden="true">
                      <div
                        className={cn('h-full rounded-full', row.achievement >= 1 ? 'bg-positive' : 'bg-chart-2')}
                        style={{ width: `${Math.min(row.achievement, 1) * 100}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        'w-14 font-mono text-xs font-medium tabular-nums',
                        row.achievement >= 1 ? 'text-positive' : 'text-muted-foreground',
                      )}
                    >
                      {formatPercent(row.achievement)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ChartCard>
  )
}

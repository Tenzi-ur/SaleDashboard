'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Filters } from '@/lib/analytics'
import { CATEGORIES, FISCAL_YEARS, REGIONS, SEGMENTS } from '@/lib/sales-data'

type Props = {
  filters: Filters
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void
}

type FilterSelectProps<T extends string> = {
  id: string
  label: string
  value: T
  options: readonly T[]
  onValueChange: (value: T) => void
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  onValueChange,
}: FilterSelectProps<T>) {
  return (
    <div className="flex min-w-[150px] flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={(v) => v && onValueChange(v as T)}>
        <SelectTrigger id={id} className="w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FiltersBar({ filters, onChange }: Props) {
  const active = (['region', 'category', 'segment'] as const).filter((k) => filters[k] !== 'All')

  return (
    <section
      aria-label="Dashboard filters"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
        Filters
        <span className="text-xs font-normal text-muted-foreground">
          {'· Tip: click a region bar or category slice to cross-filter'}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <FilterSelect
          id="filter-fy"
          label="Fiscal year"
          value={filters.fy}
          options={FISCAL_YEARS}
          onValueChange={(v) => onChange('fy', v)}
        />
        <FilterSelect
          id="filter-region"
          label="Region"
          value={filters.region}
          options={['All', ...REGIONS] as const}
          onValueChange={(v) => onChange('region', v)}
        />
        <FilterSelect
          id="filter-category"
          label="Category"
          value={filters.category}
          options={['All', ...CATEGORIES] as const}
          onValueChange={(v) => onChange('category', v)}
        />
        <FilterSelect
          id="filter-segment"
          label="Customer segment"
          value={filters.segment}
          options={['All', ...SEGMENTS] as const}
          onValueChange={(v) => onChange('segment', v)}
        />
      </div>
      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          {active.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key, 'All')}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
            >
              {filters[key]}
              <X className="size-3" aria-hidden="true" />
              <span className="sr-only">Remove {key} filter</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

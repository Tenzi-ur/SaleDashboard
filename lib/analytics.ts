import {
  CATEGORIES,
  FISCAL_MONTHS,
  FISCAL_YEARS,
  REGIONS,
  type Category,
  type FiscalYear,
  type Region,
  type SaleRecord,
  type Segment,
} from './sales-data'

export type Filters = {
  fy: FiscalYear
  region: Region | 'All'
  category: Category | 'All'
  segment: Segment | 'All'
}

export type Totals = {
  sales: number
  profit: number
  orders: number
  units: number
  target: number
  margin: number
  aov: number
  achievement: number
}

export function previousFiscalYear(fy: FiscalYear): FiscalYear | null {
  const index = FISCAL_YEARS.indexOf(fy)
  return index > 0 ? FISCAL_YEARS[index - 1] : null
}

export function filterRecords(
  records: SaleRecord[],
  filters: Filters,
  fy: FiscalYear = filters.fy,
): SaleRecord[] {
  return records.filter(
    (r) =>
      r.fy === fy &&
      (filters.region === 'All' || r.region === filters.region) &&
      (filters.category === 'All' || r.category === filters.category) &&
      (filters.segment === 'All' || r.segment === filters.segment),
  )
}

export function summarize(records: SaleRecord[]): Totals {
  let sales = 0
  let profit = 0
  let orders = 0
  let units = 0
  let target = 0
  for (const r of records) {
    sales += r.sales
    profit += r.profit
    orders += r.orders
    units += r.units
    target += r.target
  }
  return {
    sales,
    profit,
    orders,
    units,
    target,
    margin: sales ? profit / sales : 0,
    aov: orders ? sales / orders : 0,
    achievement: target ? sales / target : 0,
  }
}

function groupBy<K extends string | number>(records: SaleRecord[], key: (r: SaleRecord) => K) {
  const groups = new Map<K, SaleRecord[]>()
  for (const r of records) {
    const k = key(r)
    const list = groups.get(k)
    if (list) list.push(r)
    else groups.set(k, [r])
  }
  return groups
}

export function monthlyTrend(current: SaleRecord[], previous: SaleRecord[]) {
  const cur = groupBy(current, (r) => r.monthIndex)
  const prev = groupBy(previous, (r) => r.monthIndex)
  return FISCAL_MONTHS.map((month, i) => {
    const c = summarize(cur.get(i) ?? [])
    const p = summarize(prev.get(i) ?? [])
    return {
      month,
      sales: c.sales,
      profit: c.profit,
      prevSales: p.sales,
      prevProfit: p.profit,
    }
  })
}

/** Region and category breakdowns ignore their own filter so the visual can act as a slicer */
export function regionBreakdown(records: SaleRecord[]) {
  const groups = groupBy(records, (r) => r.region)
  return REGIONS.map((region) => {
    const t = summarize(groups.get(region) ?? [])
    return { region, sales: t.sales, profit: t.profit, margin: t.margin }
  })
}

export function categoryBreakdown(records: SaleRecord[]) {
  const groups = groupBy(records, (r) => r.category)
  return CATEGORIES.map((category) => {
    const t = summarize(groups.get(category) ?? [])
    return { category, sales: t.sales, profit: t.profit, margin: t.margin }
  })
}

export function quarterlyPerformance(records: SaleRecord[]) {
  const groups = groupBy(records, (r) => Math.floor(r.monthIndex / 3))
  return [0, 1, 2, 3].map((q) => {
    const t = summarize(groups.get(q) ?? [])
    return { quarter: `Q${q + 1}`, sales: t.sales, target: t.target, achievement: t.achievement }
  })
}

export function stateLeaderboard(records: SaleRecord[]) {
  const groups = groupBy(records, (r) => r.state)
  return Array.from(groups.entries())
    .map(([state, rows]) => {
      const t = summarize(rows)
      return { state, region: rows[0].region, ...t }
    })
    .sort((a, b) => b.sales - a.sales)
}

export type StateRow = ReturnType<typeof stateLeaderboard>[number]

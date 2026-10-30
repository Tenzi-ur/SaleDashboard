export const REGIONS = ['North', 'South', 'West', 'East', 'Central'] as const
export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Office Supplies',
  'Apparel',
  'Home & Kitchen',
] as const
export const SEGMENTS = ['Consumer', 'Corporate', 'Small Business'] as const
export const FISCAL_YEARS = ['FY 2024-25', 'FY 2025-26'] as const

/** Indian fiscal year runs April → March */
export const FISCAL_MONTHS = [
  'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
] as const

export type Region = (typeof REGIONS)[number]
export type Category = (typeof CATEGORIES)[number]
export type Segment = (typeof SEGMENTS)[number]
export type FiscalYear = (typeof FISCAL_YEARS)[number]

export type SaleRecord = {
  fy: FiscalYear
  monthIndex: number
  region: Region
  state: string
  category: Category
  segment: Segment
  sales: number
  profit: number
  orders: number
  units: number
  target: number
}

const STATES: { name: string; region: Region; weight: number }[] = [
  { name: 'Delhi', region: 'North', weight: 1.3 },
  { name: 'Uttar Pradesh', region: 'North', weight: 1.0 },
  { name: 'Rajasthan', region: 'North', weight: 0.7 },
  { name: 'Haryana', region: 'North', weight: 0.7 },
  { name: 'Punjab', region: 'North', weight: 0.5 },
  { name: 'Karnataka', region: 'South', weight: 1.3 },
  { name: 'Tamil Nadu', region: 'South', weight: 1.2 },
  { name: 'Telangana', region: 'South', weight: 1.0 },
  { name: 'Kerala', region: 'South', weight: 0.6 },
  { name: 'Andhra Pradesh', region: 'South', weight: 0.6 },
  { name: 'Maharashtra', region: 'West', weight: 1.6 },
  { name: 'Gujarat', region: 'West', weight: 1.1 },
  { name: 'Goa', region: 'West', weight: 0.2 },
  { name: 'West Bengal', region: 'East', weight: 0.9 },
  { name: 'Odisha', region: 'East', weight: 0.4 },
  { name: 'Bihar', region: 'East', weight: 0.4 },
  { name: 'Assam', region: 'East', weight: 0.3 },
  { name: 'Madhya Pradesh', region: 'Central', weight: 0.6 },
  { name: 'Chhattisgarh', region: 'Central', weight: 0.3 },
]

const CATEGORY_PROFILE: Record<Category, { weight: number; margin: number; aov: number }> = {
  Electronics: { weight: 1.4, margin: 0.11, aov: 18000 },
  Furniture: { weight: 0.8, margin: 0.06, aov: 22000 },
  'Office Supplies': { weight: 0.6, margin: 0.18, aov: 2500 },
  Apparel: { weight: 0.9, margin: 0.22, aov: 2200 },
  'Home & Kitchen': { weight: 0.7, margin: 0.15, aov: 3500 },
}

const SEGMENT_WEIGHT: Record<Segment, number> = {
  Consumer: 0.5,
  Corporate: 0.32,
  'Small Business': 0.18,
}

/** Festive peak in Oct–Nov (Navratri / Diwali) and fiscal year-end push in March */
const SEASONALITY = [0.85, 0.8, 0.82, 0.88, 0.95, 1.0, 1.35, 1.3, 1.1, 0.95, 0.92, 1.15]

const FY_GROWTH: Record<FiscalYear, number> = {
  'FY 2024-25': 1,
  'FY 2025-26': 1.14,
}

const BASE_SALES = 1_500_000

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateSales(): SaleRecord[] {
  const rand = mulberry32(20250401)
  const between = (min: number, max: number) => min + rand() * (max - min)
  const records: SaleRecord[] = []

  const stateTargetFactor = new Map(STATES.map((s) => [s.name, between(0.9, 1.08)]))

  for (const fy of FISCAL_YEARS) {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      for (const state of STATES) {
        const targetFactor = stateTargetFactor.get(state.name) ?? 1
        for (const category of CATEGORIES) {
          const profile = CATEGORY_PROFILE[category]
          for (const segment of SEGMENTS) {
            const expected =
              BASE_SALES *
              state.weight *
              profile.weight *
              SEGMENT_WEIGHT[segment] *
              SEASONALITY[monthIndex] *
              FY_GROWTH[fy]
            const sales = Math.round(expected * between(0.78, 1.22))
            const profit = Math.round(sales * (profile.margin + between(-0.06, 0.04)))
            const orders = Math.max(1, Math.round((sales / profile.aov) * between(0.9, 1.1)))
            const units = Math.round(orders * between(1.1, 2.8))
            records.push({
              fy,
              monthIndex,
              region: state.region,
              state: state.name,
              category,
              segment,
              sales,
              profit,
              orders,
              units,
              target: Math.round(expected * targetFactor),
            })
          }
        }
      }
    }
  }
  return records
}

export const SALES_DATA: SaleRecord[] = generateSales()

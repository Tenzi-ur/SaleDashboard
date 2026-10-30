# India Sales Performance Dashboard

An interactive, Power BI–style sales analytics dashboard for the Indian market, built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **shadcn/ui** and **Recharts**.

- Built an interactive dashboard to track **sales, profits and KPIs** across Indian regions, states, product categories and customer segments.
- Visualized **sales trends and performance** using charts, slicers and cross-filtering.

## Features

- **KPI cards**: Total Sales, Total Profit, Profit Margin, Orders, Average Order Value and Target Achievement, each with year-over-year change
- **Indian formatting**: amounts in ₹ using the Lakh (L) and Crore (Cr) system, `en-IN` number grouping
- **Indian fiscal year**: April to March, with FY 2024-25 vs FY 2025-26 comparison
- **Slicers**: Fiscal Year, Region (North, South, East, West, Central), Category and Customer Segment
- **Cross-filtering**: click a region bar or category slice to filter the whole dashboard, like Power BI
- **Charts**: monthly trend (sales/profit toggle vs previous year), category donut, region bar chart, quarterly sales vs target
- **State-wise table**: 19 states, sortable by sales, profit, margin, orders and target achievement
- **Auto insights**: peak month, top state, most and least profitable category, states on target
- **Export to CSV** of the filtered state-wise data

## Tech stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Charts | Recharts via shadcn/ui chart components |
| Icons | lucide-react |

## Project structure

```
app/
  layout.tsx              # Fonts, metadata
  page.tsx                # Renders the dashboard
  globals.css             # Theme tokens and chart colours
components/
  dashboard/
    sales-dashboard.tsx   # Filter state and data wiring
    dashboard-header.tsx  # Title, reset and CSV export
    filters-bar.tsx       # Slicers
    kpi-cards.tsx         # KPI tiles with YoY change
    sales-trend-chart.tsx # Monthly trend
    category-chart.tsx    # Category donut (cross-filter)
    region-chart.tsx      # Region bars (cross-filter)
    quarterly-chart.tsx   # Quarterly sales vs target
    state-table.tsx       # Sortable state-wise table
    insights-panel.tsx    # Auto-generated insights
  ui/                     # shadcn/ui components
lib/
  sales-data.ts           # Seeded sample dataset (states, categories, segments)
  analytics.ts            # Filtering and aggregation (measures)
  format.ts               # INR, Lakh/Crore and percentage formatters
```

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Using your own data

The sample data in `lib/sales-data.ts` is generated deterministically so the dashboard looks the same on every load. To use real data, replace `SALES_DATA` with records of this shape (for example from a CSV, database or API):

```ts
type SaleRecord = {
  fy: 'FY 2024-25' | 'FY 2025-26'
  monthIndex: number // 0 = April ... 11 = March
  region: 'North' | 'South' | 'West' | 'East' | 'Central'
  state: string
  category: string
  segment: string
  sales: number
  profit: number
  orders: number
  units: number
  target: number
}
```

## Deploy

Deploy to Vercel with one click, or run `pnpm build && pnpm start` on any Node.js host.

## License

MIT

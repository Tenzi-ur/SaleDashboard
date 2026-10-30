const inrFull = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const indianNumber = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** Formats rupees in the Indian Lakh / Crore system, e.g. ₹1.25 Cr, ₹48.6 L */
export function formatINRCompact(value: number, digits = 2): string {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(digits)} Cr`
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(digits)} L`
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)} K`
  return `${sign}₹${abs.toFixed(0)}`
}

export function formatINR(value: number): string {
  return inrFull.format(value)
}

export function formatNumber(value: number): string {
  return indianNumber.format(value)
}

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`
}

/** Short axis label in Cr / L without the rupee decimals clutter */
export function formatAxisINR(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e7) return `₹${(value / 1e7).toFixed(abs >= 1e8 ? 0 : 1)}Cr`
  if (abs >= 1e5) return `₹${(value / 1e5).toFixed(0)}L`
  return `₹${(value / 1e3).toFixed(0)}K`
}

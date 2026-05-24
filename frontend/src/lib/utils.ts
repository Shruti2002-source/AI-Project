import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatValue(value: number | null | undefined, unit?: string): string {
  if (value === null || value === undefined) return '—'
  const u = (unit || '').toLowerCase().trim()

  if (u.includes('usd') || u === '$' || u.includes('$/fte')) {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }
  if (u === '%' || u === 'percent') {
    return `${value.toFixed(1)}%`
  }
  if (u === 'x') {
    return `${value.toFixed(1)}x`
  }
  if (u === 'days' || u === 'day') {
    return `${value.toFixed(1)} days`
  }
  if (u === 'min' || u === 'minutes') {
    return `${value.toFixed(0)} min`
  }
  if (u === 'hrs' || u === 'hours') {
    return `${value.toFixed(1)} hrs`
  }
  if (u === 'score') {
    return `${value.toFixed(0)} pts`
  }
  if (u === 'units' || u === 'count') {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return `${value.toFixed(0)}`
  }

  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(value % 1 === 0 ? 0 : 1)
}

const STATUS_COLORS: Record<string, string> = {
  top_quartile: 'text-emerald-400',
  above_benchmark: 'text-blue-400',
  near_benchmark: 'text-yellow-400',
  below_benchmark: 'text-red-400',
  no_benchmark: 'text-slate-400',
}

const STATUS_BG_COLORS: Record<string, string> = {
  top_quartile: 'bg-emerald-500/10 border-emerald-500/30',
  above_benchmark: 'bg-blue-500/10 border-blue-500/30',
  near_benchmark: 'bg-yellow-500/10 border-yellow-500/30',
  below_benchmark: 'bg-red-500/10 border-red-500/30',
  no_benchmark: 'bg-slate-700/50 border-slate-600',
}

const STATUS_LABELS: Record<string, string> = {
  top_quartile: 'Top Quartile',
  above_benchmark: 'Above Benchmark',
  near_benchmark: 'Near Benchmark',
  below_benchmark: 'Below Benchmark',
  no_benchmark: 'No Benchmark',
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || 'text-slate-400'
}

export function getStatusBgColor(status: string): string {
  return STATUS_BG_COLORS[status] || 'bg-slate-700/50 border-slate-600'
}

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10',
  high: 'text-orange-400 bg-orange-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  low: 'text-blue-400 bg-blue-500/10',
  positive: 'text-green-400 bg-green-500/10',
}

export function getSeverityColor(severity: string): string {
  return SEVERITY_COLORS[severity] || 'text-slate-400 bg-slate-700/50'
}

export const INDUSTRY_COLORS: Record<string, string> = {
  fmcg: '#3b82f6',
  healthcare: '#10b981',
  banking: '#8b5cf6',
  retail: '#f97316',
  manufacturing: '#eab308',
}

export const CHART_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#eab308', '#ec4899', '#14b8a6']

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function getImpactColor(impact: string): string {
  const map: Record<string, string> = {
    high:   'text-red-400 bg-red-500/10 border-red-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low:    'text-slate-400 bg-slate-700/50 border-slate-600/30',
  };
  return map[impact] ?? map.low;
}

export function generateTimeSeriesData(
  baseValue: number,
  points = 12,
  volatility = 0.02,
): Array<{ period: string; value: number }> {
  const now = new Date();
  return Array.from({ length: points }, (_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (points - 1 - i));
    const noise = (Math.random() - 0.5) * 2 * volatility;
    return {
      period: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: Math.max(0, baseValue * (1 + noise * i * 0.1 + volatility * i)),
    };
  });
}

'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { BenchmarkComparison } from '@/types'

interface Props {
  comparisons: BenchmarkComparison[]
}

const STATUS_COLORS: Record<string, string> = {
  top_quartile: '#22c55e',
  above_benchmark: '#3b82f6',
  near_benchmark: '#f59e0b',
  below_benchmark: '#ef4444',
  no_benchmark: '#6b7280',
}

interface ChartEntry {
  name: string
  client: number
  benchmark: number
  status: string
  unit: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const entry: ChartEntry = payload[0]?.payload
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-200 font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-slate-400">{p.name === 'client' ? 'Your Value' : 'Benchmark'}:</span>
          <span className="text-slate-200 font-medium">{p.value?.toFixed(1)} {entry?.unit}</span>
        </div>
      ))}
    </div>
  )
}

export default function BenchmarkBarChart({ comparisons }: Props) {
  const data: ChartEntry[] = comparisons
    .filter((c) => c.benchmark_value !== null)
    .slice(0, 10)
    .map((c) => ({
      name: (c.kpi_name ?? '').replace(/_/g, ' '),
      client: c.client_value,
      benchmark: c.benchmark_value as number,
      status: c.status,
      unit: c.unit,
    }))

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No benchmark data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
        <Bar dataKey="client" name="client" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
          ))}
        </Bar>
        <Bar dataKey="benchmark" name="benchmark" fill="#475569" radius={[4, 4, 0, 0]} opacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  )
}


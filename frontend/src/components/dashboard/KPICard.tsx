'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { KPIResult, BenchmarkComparison } from '@/types'
import { formatValue, getStatusColor, getStatusBgColor, getStatusLabel } from '@/lib/utils'

interface Props {
  kpi: KPIResult
  benchmark?: BenchmarkComparison
  index?: number
}

function MiniSparkline({ trend }: { trend: Array<{ value: number }> }) {
  if (!trend || trend.length < 2) return null
  const values = trend.map((t) => t.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const W = 72, H = 28, PAD = 2
  const pts = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export default function KPICard({ kpi, benchmark, index = 0 }: Props) {
  const status = benchmark?.status || 'no_benchmark'
  const borderColor = {
    top_quartile: 'border-l-emerald-500',
    above_benchmark: 'border-l-blue-500',
    near_benchmark: 'border-l-yellow-500',
    below_benchmark: 'border-l-red-500',
    no_benchmark: 'border-l-slate-600',
  }[status] || 'border-l-slate-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={['border border-slate-700 border-l-4 rounded-xl p-4 bg-slate-800/60', borderColor].join(' ')}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">
            {(kpi.kpi_name ?? '').replace(/_/g, ' ')}
          </p>
          <p className="text-2xl font-bold text-slate-100 mt-0.5">
            {formatValue(kpi.value, kpi.unit)}
          </p>
        </div>
        {kpi.trend && <MiniSparkline trend={kpi.trend} />}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          {benchmark?.benchmark_value !== null && benchmark?.benchmark_value !== undefined ? (
            <p className="text-xs text-slate-500">
              Benchmark: <span className="text-slate-400">{formatValue(benchmark.benchmark_value, kpi.unit)}</span>
              {benchmark.gap_percent !== null && (
                <span className={[' ml-1', getStatusColor(status)].join('')}>
                  ({benchmark.gap_percent > 0 ? '+' : ''}{benchmark.gap_percent.toFixed(1)}%)
                </span>
              )}
            </p>
          ) : (
            <p className="text-xs text-slate-600">No benchmark</p>
          )}
        </div>
        <span className={['text-xs px-2 py-0.5 rounded-full border font-medium', getStatusBgColor(status), getStatusColor(status)].join(' ')}>
          {getStatusLabel(status)}
        </span>
      </div>
    </motion.div>
  )
}

'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ExternalLink, Radio } from 'lucide-react'
import { BenchmarkComparison } from '@/types'
import { getStatusColor, getStatusBgColor, getStatusLabel, formatValue } from '@/lib/utils'

interface Props {
  comparisons: BenchmarkComparison[]
}

type SortKey = 'kpi_name' | 'client_value' | 'benchmark_value' | 'gap_percent' | 'status'
type SortDir = 'asc' | 'desc'

export default function BenchmarkTable({ comparisons }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('gap_percent')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...comparisons].sort((a, b) => {
    let av: any = a[sortKey]
    let bv: any = b[sortKey]
    if (av === null || av === undefined) av = sortDir === 'asc' ? Infinity : -Infinity
    if (bv === null || bv === undefined) bv = sortDir === 'asc' ? Infinity : -Infinity
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    return sortDir === 'asc' ? av - bv : bv - av
  })

  const SortIcon = ({ col }: { col: SortKey }) => (
    sortKey !== col
      ? <ChevronUp className="h-3 w-3 text-slate-600" />
      : sortDir === 'asc'
        ? <ChevronUp className="h-3 w-3 text-blue-400" />
        : <ChevronDown className="h-3 w-3 text-blue-400" />
  )

  const Th = ({ col, label }: { col: SortKey; label: string }) => (
    <th onClick={() => handleSort(col)}
      className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 select-none whitespace-nowrap">
      <span className="flex items-center gap-1">{label}<SortIcon col={col} /></span>
    </th>
  )

  const liveCount = comparisons.filter((c: any) => c.live).length

  return (
    <div>
      {liveCount > 0 && (
        <div className="px-4 py-2 border-b border-slate-700 flex items-center gap-2">
          <Radio className="h-3 w-3 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400">{liveCount} benchmark{liveCount > 1 ? 's' : ''} fetched live from public APIs</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700">
            <tr>
              <Th col="kpi_name" label="KPI" />
              <Th col="client_value" label="Your Value" />
              <Th col="benchmark_value" label="Benchmark" />
              <Th col="gap_percent" label="Gap %" />
              <Th col="status" label="Status" />
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.map((row, i) => (
              <motion.tr key={row.kpi_name ?? i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-medium">
                      {(row.kpi_name ?? '').replace(/_/g, ' ')}
                    </span>
                    {(row as any).live && (
                      <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                        <Radio className="h-2.5 w-2.5" /> LIVE
                      </span>
                    )}
                  </div>
                  {row.unit && <span className="text-slate-500 text-xs">({row.unit})</span>}
                </td>
                <td className="px-4 py-3 text-slate-200 font-mono">{formatValue(row.client_value, row.unit)}</td>
                <td className="px-4 py-3">
                  {row.benchmark_value !== null && row.benchmark_value !== undefined ? (
                    <span className="text-slate-400 font-mono">{formatValue(row.benchmark_value, row.unit)}</span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {row.gap_percent !== null && row.gap_percent !== undefined ? (
                    <span className={row.gap_percent > 0 ? 'text-green-400' : 'text-red-400'}>
                      {row.gap_percent > 0 ? '+' : ''}{row.gap_percent.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={['px-2.5 py-1 rounded-full text-xs font-medium border', getStatusBgColor(row.status), getStatusColor(row.status)].join(' ')}>
                    {getStatusLabel(row.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {row.source ? (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-xs truncate max-w-[160px]">{row.source}</span>
                        {row.source_url && (
                          <a href={row.source_url} target="_blank" rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {(row as any).fetched_at && (
                        <span className="text-slate-600 text-[10px]">Updated {(row as any).fetched_at}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

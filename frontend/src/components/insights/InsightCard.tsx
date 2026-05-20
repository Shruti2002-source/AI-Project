'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Insight } from '@/types'
import { getSeverityColor } from '@/lib/utils'

interface Props {
  insight: Insight
  index: number
}

const SEVERITY_ICONS: Record<string, React.ReactNode> = {
  critical: <AlertTriangle className="h-4 w-4 text-red-400" />,
  high: <TrendingDown className="h-4 w-4 text-orange-400" />,
  medium: <Info className="h-4 w-4 text-yellow-400" />,
  low: <TrendingUp className="h-4 w-4 text-blue-400" />,
  positive: <TrendingUp className="h-4 w-4 text-green-400" />,
}

const SEVERITY_BORDER: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-blue-500',
  positive: 'border-l-green-500',
}

export default function InsightCard({ insight, index }: Props) {
  const [expanded, setExpanded] = useState(false)

  const borderClass = SEVERITY_BORDER[insight.severity] || 'border-l-slate-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={['border border-slate-700 border-l-4 rounded-xl bg-slate-800/60 overflow-hidden', borderClass].join(' ')}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-800 transition-colors">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5 flex-shrink-0">
            {SEVERITY_ICONS[insight.severity] || <Info className="h-4 w-4 text-slate-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={['text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded', getSeverityColor(insight.severity)].join(' ')}>
                {insight.severity}
              </span>
              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                {(insight.kpi_name ?? '').replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-200 text-sm font-medium">{insight.title}</p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0 mt-1" />
          : <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0 mt-1" />}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 space-y-3 border-t border-slate-700 pt-3">
          <p className="text-slate-300 text-sm leading-relaxed">{insight.description}</p>

          {insight.recommendation && (
            <div className="bg-slate-900/60 rounded-lg p-3">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Recommendation</p>
              <p className="text-slate-300 text-sm">{insight.recommendation}</p>
            </div>
          )}

          {insight.impact && (
            <div className="bg-slate-900/60 rounded-lg p-3">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Business Impact</p>
              <p className="text-slate-300 text-sm">{insight.impact}</p>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {insight.client_value !== undefined && (
              <span>Current: <span className="text-slate-300 font-mono">{insight.client_value?.toFixed(1)}</span></span>
            )}
            {insight.benchmark_value !== undefined && insight.benchmark_value !== null && (
              <span>Benchmark: <span className="text-slate-300 font-mono">{insight.benchmark_value?.toFixed(1)}</span></span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

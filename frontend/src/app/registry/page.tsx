'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, ExternalLink, CheckCircle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { getBenchmarkRegistry } from '@/lib/api'

interface SourceEntry {
  name: string
  url: string
  description: string
  coverage: string
  confidence: string
  kpis?: string[]
}

interface RegistryData {
  [industry: string]: SourceEntry[]
}

const CONFIDENCE_COLORS: Record<string, string> = {
  High: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Low: 'text-red-400 bg-red-500/10 border-red-500/30',
}

export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getBenchmarkRegistry()
      .then((data: any) => {
        // Backend returns flat {FMCG:[...], Healthcare:[...], ...}
        // Guard against old {registry:{...}} wrapper just in case
        setRegistry(data?.registry ?? data)
      })
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Benchmark Source Registry</h1>
          <p className="text-slate-400 text-sm mt-1">
            All benchmark values are sourced from authoritative industry publications and research bodies.
          </p>
        </div>

        {loading && (
          <div className="text-center py-16 text-slate-500">Loading registry...</div>
        )}

        {error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {registry && Object.entries(registry).map(([industry, sources]) => (
          <div key={industry} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-200 capitalize border-b border-slate-700 pb-2">
              {industry.toUpperCase()}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {(sources as SourceEntry[]).map((source, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border border-slate-700 rounded-xl p-4 bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-200 font-medium text-sm">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {source.confidence && (
                        <span className={['text-xs px-2 py-0.5 rounded border', CONFIDENCE_COLORS[source.confidence] || ''].join(' ')}>
                          {source.confidence}
                        </span>
                      )}
                      {source.url && (
                        <a href={source.url} target="_blank" rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {source.description && (
                    <p className="text-slate-400 text-xs mb-2">{source.description}</p>
                  )}
                  {source.coverage && (
                    <p className="text-slate-500 text-xs">Coverage: {source.coverage}</p>
                  )}
                  {source.kpis && source.kpis.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {source.kpis.map((kpi) => (
                        <span key={kpi} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                          {kpi}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </AppShell>
  )
}

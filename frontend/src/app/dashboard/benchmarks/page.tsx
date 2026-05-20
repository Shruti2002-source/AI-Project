'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Target, ArrowUpRight, ArrowDownRight, Zap, Upload } from 'lucide-react';
import Link from 'next/link';
import { BenchmarkChart } from '@/components/dashboard/BenchmarkChart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchBenchmarks, getStoredSession, type LiveBenchmarkData } from '@/lib/analytics-api';
import type { BenchmarkComparison } from '@/types';

const POSITION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  above_top:      { label: 'Elite',         color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  top_quartile:   { label: 'Top Quartile',  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  above_average:  { label: 'Above Avg',     color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20' },
  average:        { label: 'At Average',    color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  below_average:  { label: 'Below Avg',     color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  bottom_quartile:{ label: 'Bottom Q',      color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
};

function mapLive(b: LiveBenchmarkData): BenchmarkComparison {
  return {
    kpiId: b.kpi_id,
    kpiName: b.kpi_name,
    clientValue: b.client_value,
    industryAverage: b.industry_average,
    topQuartile: b.top_quartile,
    bottomQuartile: b.bottom_quartile,
    unit: b.unit,
    variance: b.variance,
    variancePercent: b.variance_percent,
    position: b.position as BenchmarkComparison['position'],
    recommendation: b.recommendation,
  };
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800/40 animate-pulse">
      <td className="px-5 py-3.5"><div className="h-4 w-40 bg-slate-700 rounded" /></td>
      <td className="px-4 py-3.5"><div className="h-4 w-12 bg-slate-700 rounded ml-auto" /></td>
      <td className="px-4 py-3.5"><div className="h-4 w-12 bg-slate-700 rounded ml-auto" /></td>
      <td className="px-4 py-3.5"><div className="h-4 w-12 bg-slate-700 rounded ml-auto" /></td>
      <td className="px-4 py-3.5"><div className="h-4 w-14 bg-slate-700 rounded ml-auto" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-20 bg-slate-700 rounded mx-auto" /></td>
    </tr>
  );
}

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkComparison[]>([]);
  const [industry, setIndustry] = useState<string>('fmcg');
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const { sessionId, industry: ind } = getStoredSession();
    if (!sessionId) return;

    setHasSession(true);
    setIndustry(ind || 'fmcg');
    setLoading(true);

    fetchBenchmarks(ind || 'fmcg', sessionId).then((data) => {
      if (data && data.length > 0) {
        setBenchmarks(data.map(mapLive));
      }
      setLoading(false);
    });
  }, []);

  const aboveAvg  = benchmarks.filter((b) => ['top_quartile', 'above_top', 'above_average'].includes(b.position)).length;
  const belowAvg  = benchmarks.filter((b) => ['below_average', 'bottom_quartile'].includes(b.position)).length;
  const atAvg     = benchmarks.filter((b) => b.position === 'average').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-white">Benchmark Comparison</h1>
            {benchmarks.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3 h-3" /> Live Data
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            {benchmarks.length > 0
              ? `${industry.toUpperCase()} dataset compared against industry average, top quartile, and bottom quartile`
              : 'Upload a dataset to see how your metrics compare against industry benchmarks'}
          </p>
        </div>
      </div>

      {/* No session */}
      {!hasSession && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <Upload className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No dataset uploaded</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
            Upload a CSV or Excel file to compare your calculated KPIs against industry benchmarks.
          </p>
          <Link href="/dashboard/upload">
            <Button variant="gradient" className="gap-2">
              <Upload className="w-4 h-4" /> Upload Dataset
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Session but no benchmarks calculated */}
      {hasSession && !loading && benchmarks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <h3 className="text-base font-semibold text-white mb-2">No benchmarks available</h3>
          <p className="text-slate-400 text-sm">
            Benchmarks are generated when your dataset produces calculable KPIs. Check your uploaded file contains recognised columns.
          </p>
        </motion.div>
      )}

      {/* Summary row */}
      {(loading || benchmarks.length > 0) && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Above Industry Average', value: loading ? '—' : aboveAvg, icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-600/10 border-emerald-500/20' },
            { label: 'At Industry Average',    value: loading ? '—' : atAvg,    icon: Minus,        color: 'text-blue-400',    bg: 'bg-blue-600/10 border-blue-500/20' },
            { label: 'Below Industry Average', value: loading ? '—' : belowAvg, icon: TrendingDown, color: 'text-amber-400',   bg: 'bg-amber-600/10 border-amber-500/20' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn('glass-card rounded-2xl p-5 border', card.bg)}
              >
                <Icon className={cn('w-5 h-5 mb-3', card.color)} />
                <div className={cn('text-3xl font-bold text-white mb-0.5', loading && 'animate-pulse')}>{card.value}</div>
                <div className="text-xs text-slate-400">{card.label}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Main chart */}
      {benchmarks.length > 0 && (
        <BenchmarkChart data={benchmarks} title="Full Benchmark Analysis" />
      )}

      {/* KPI detail table */}
      {(loading || benchmarks.length > 0) && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/60">
            <h3 className="font-semibold text-white">Detailed KPI Comparison</h3>
            <p className="text-xs text-slate-400 mt-0.5">Individual KPI performance vs benchmark tiers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">KPI</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Q</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Variance</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : benchmarks.map((b, i) => {
                      const pos = POSITION_CONFIG[b.position] || POSITION_CONFIG.average;
                      const isPositive = b.variancePercent >= 0;
                      return (
                        <motion.tr
                          key={b.kpiId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-white text-sm">{b.kpiName}</div>
                            {b.recommendation && (
                              <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{b.recommendation.slice(0, 60)}...</div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-white">{b.clientValue}{b.unit}</td>
                          <td className="px-4 py-3.5 text-right text-slate-400">{b.industryAverage}{b.unit}</td>
                          <td className="px-4 py-3.5 text-right text-emerald-400">{b.topQuartile}{b.unit}</td>
                          <td className={cn('px-4 py-3.5 text-right font-medium', isPositive ? 'text-emerald-400' : 'text-red-400')}>
                            <div className="flex items-center justify-end gap-1">
                              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {isPositive ? '+' : ''}{b.variancePercent.toFixed(1)}%
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={cn('badge-status text-[10px]', pos.bg, pos.color)}>
                              {pos.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {benchmarks.filter((b) => b.recommendation).length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Benchmark Gap Recommendations
          </h3>
          <div className="space-y-3">
            {benchmarks.filter((b) => b.recommendation).map((b) => (
              <div key={b.kpiId} className="flex gap-3 p-4 rounded-xl bg-amber-600/5 border border-amber-500/15">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white mb-1">{b.kpiName}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

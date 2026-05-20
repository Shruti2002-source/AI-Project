'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Grid, List, Download, BarChart3,
  ArrowUpRight, X, Zap, Upload, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, getStatusBgColor } from '@/lib/utils';
import { fetchKPIs, getStoredSession, type LiveKPIData } from '@/lib/analytics-api';

interface KPI {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  trend: number;
  trendDirection: string;
  status: string;
  historicalData?: Array<{ date: string; value: number }>;
}

const INDUSTRY_COLOR: Record<string, string> = {
  healthcare: '#06b6d4',
  fmcg: '#10b981',
  banking: '#8b5cf6',
  retail: '#f59e0b',
  manufacturing: '#ef4444',
};

function liveToKPI(k: LiveKPIData): KPI {
  return {
    id: k.id,
    name: k.name,
    category: k.category,
    value: k.value,
    unit: k.unit,
    trend: k.trend,
    trendDirection: k.trend_direction,
    status: k.status,
    historicalData: k.historical_data,
  };
}

function SkeletonCard() {
  return (
    <div className="kpi-card border-l-2 border-l-slate-700 animate-pulse">
      <div className="h-3 w-20 bg-slate-700 rounded mb-3" />
      <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
      <div className="h-8 w-24 bg-slate-700 rounded mb-3" />
      <div className="h-12 bg-slate-800 rounded" />
    </div>
  );
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
        <Upload className="w-7 h-7 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">{sub}</p>
      <Link href="/dashboard/upload">
        <Button variant="gradient" className="gap-2">
          <Upload className="w-4 h-4" /> Upload Dataset
        </Button>
      </Link>
    </motion.div>
  );
}

function KPIGridCard({ kpi, live, accent, onClick, selected }: {
  kpi: KPI;
  live?: LiveKPIData;
  accent: string;
  onClick: () => void;
  selected: boolean;
}) {
  const lowerIsBetter = live?.lower_is_better ?? false;
  const dir = kpi.trendDirection;
  const positive = (dir === 'up' && !lowerIsBetter) || (dir === 'down' && lowerIsBetter);
  const TrendIcon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        'glass-card rounded-xl p-4 cursor-pointer transition-all duration-200 border-l-2',
        selected ? 'border-l-indigo-400' : 'hover:border-l-slate-500'
      )}
      style={{ borderLeftColor: selected ? undefined : accent }}
    >
      <div className="text-[11px] text-slate-500 mb-1">{kpi.category}</div>
      <div className="text-sm font-medium text-slate-300 mb-3 leading-tight">{kpi.name}</div>
      <div className="text-2xl font-bold text-white tabular-nums mb-2">
        {kpi.value > 999_999 ? `${(kpi.value / 1_000_000).toFixed(1)}M`
          : kpi.value > 9999 ? `${(kpi.value / 1000).toFixed(1)}K`
          : kpi.value}
        <span className="text-sm text-slate-400 font-normal ml-1">{kpi.unit}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn(
          'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
          getStatusBgColor(kpi.status)
        )}>
          {kpi.status}
        </span>
        <span className={cn(
          'flex items-center gap-1 text-xs font-medium',
          positive ? 'text-emerald-400' : dir === 'stable' ? 'text-slate-400' : 'text-red-400'
        )}>
          <TrendIcon className="w-3 h-3" />
          {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
        </span>
      </div>
      {live?.formula_used && (
        <div className="mt-2 text-[10px] text-slate-600 truncate" title={live.formula_used}>
          {live.formula_used}
        </div>
      )}
    </motion.div>
  );
}

export default function KPIsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [liveKPIs, setLiveKPIs] = useState<LiveKPIData[] | null>(null);
  const [industry, setIndustry] = useState<string>('fmcg');
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const { sessionId, industry: ind } = getStoredSession();
    if (!sessionId) return;

    setHasSession(true);
    setIndustry(ind || 'fmcg');
    setLoading(true);

    fetchKPIs(ind || 'fmcg', sessionId).then((data) => {
      if (data && data.length > 0 && data[0].is_live) {
        setLiveKPIs(data);
      }
      setLoading(false);
    });
  }, []);

  const kpis: KPI[] = (liveKPIs ?? []).map(liveToKPI);

  const categories = ['all', ...Array.from(new Set(kpis.map((k) => k.category)))];

  const filteredKPIs = kpis.filter((kpi) => {
    const matchCat = selectedCategory === 'all' || kpi.category === selectedCategory;
    const matchSearch = kpi.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const statusCounts = {
    good: kpis.filter((k) => k.status === 'good').length,
    warning: kpis.filter((k) => k.status === 'warning').length,
    critical: kpis.filter((k) => k.status === 'critical').length,
  };

  const accentColor = INDUSTRY_COLOR[industry] ?? '#8b5cf6';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-white">KPI Dashboard</h1>
            {liveKPIs && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3 h-3" /> Live Data
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            {liveKPIs
              ? `${kpis.length} KPIs calculated from your ${industry.toUpperCase()} dataset`
              : 'Upload a dataset to calculate and view your KPIs'}
          </p>
        </div>

        {liveKPIs && (
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <span key={status} className={cn('badge-status', getStatusBgColor(status as 'good' | 'warning' | 'critical'))}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {count} {status}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* No session — empty state */}
      {!hasSession && !loading && (
        <EmptyState
          message="No dataset uploaded"
          sub="Upload a CSV or Excel file to calculate KPIs from your data. No assumptions are made — every value is derived from your inputs."
        />
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Session exists but no live KPIs returned */}
      {hasSession && !loading && liveKPIs === null && (
        <EmptyState
          message="No KPIs could be calculated"
          sub="Your dataset was processed but column names didn't match any known KPI formulas. Try selecting your industry explicitly on the upload page, or check that column names match the expected format."
        />
      )}

      {/* Live KPI content */}
      {liveKPIs && liveKPIs.length > 0 && (
        <>
          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <Input
                placeholder="Search KPIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-1.5 rounded-md transition-colors', viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-1.5 rounded-md transition-colors', viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>

          {/* Category filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => {
              const count = cat === 'all' ? kpis.length : kpis.filter((k) => k.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200',
                    selectedCategory === cat
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  )}
                >
                  {cat === 'all' ? `All (${count})` : `${cat} (${count})`}
                </button>
              );
            })}
          </div>

          {/* KPI grid / list */}
          {filteredKPIs.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No KPIs match your search.</p>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-2'
            )}>
              {filteredKPIs.map((kpi, i) => {
                const live = liveKPIs.find(l => l.id === kpi.id);
                return viewMode === 'grid' ? (
                  <KPIGridCard
                    key={kpi.id}
                    kpi={kpi}
                    live={live}
                    accent={accentColor}
                    selected={selectedKPI?.id === kpi.id}
                    onClick={() => setSelectedKPI(selectedKPI?.id === kpi.id ? null : kpi)}
                  />
                ) : (
                  <motion.div
                    key={kpi.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.025 }}
                    onClick={() => setSelectedKPI(selectedKPI?.id === kpi.id ? null : kpi)}
                    className={cn(
                      'glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-200',
                      selectedKPI?.id === kpi.id ? 'border-indigo-500/40' : 'hover:border-slate-600/60'
                    )}
                  >
                    <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500">{kpi.category}</div>
                      <div className="font-medium text-white truncate">{kpi.name}</div>
                    </div>
                    <div className="text-xl font-bold text-white tabular-nums">
                      {kpi.value > 9999 ? `${(kpi.value / 1000).toFixed(1)}K` : kpi.value}
                      <span className="text-sm text-slate-400 font-normal ml-1">{kpi.unit}</span>
                    </div>
                    {(() => {
                      const lowerIsBetter = live?.lower_is_better ?? false;
                      const dir = kpi.trendDirection;
                      const positive = (dir === 'up' && !lowerIsBetter) || (dir === 'down' && lowerIsBetter);
                      const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
                      return (
                        <span className={cn('flex items-center gap-1 text-sm font-medium', positive ? 'text-emerald-400' : dir === 'stable' ? 'text-slate-400' : 'text-red-400')}>
                          <Icon className="w-3.5 h-3.5" />
                          {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                        </span>
                      );
                    })()}
                    <ArrowUpRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Selected KPI detail panel */}
          <AnimatePresence>
            {selectedKPI && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-slate-800/60">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{selectedKPI.name} — Detailed Analysis</h3>
                      {(() => {
                        const live = liveKPIs.find(l => l.id === selectedKPI.id);
                        return live?.formula_used ? (
                          <p className="text-xs text-slate-500 mt-0.5">Formula: <span className="text-slate-400 font-mono">{live.formula_used}</span></p>
                        ) : null;
                      })()}
                    </div>
                    <button
                      onClick={() => setSelectedKPI(null)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {(() => {
                    const live = liveKPIs.find(l => l.id === selectedKPI.id);
                    return live ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Value', value: `${live.value} ${live.unit}` },
                          { label: 'Data Points', value: live.data_points_used ?? '—' },
                          { label: 'Columns Used', value: live.columns_detected?.length ?? '—' },
                          { label: 'Status', value: live.status },
                        ].map((item) => (
                          <div key={item.label} className="bg-slate-800/40 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                            <div className="text-sm font-semibold text-white capitalize">{item.value}</div>
                          </div>
                        ))}
                        {live.columns_detected && live.columns_detected.length > 0 && (
                          <div className="col-span-2 sm:col-span-4 bg-slate-800/40 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1.5">Columns detected</div>
                            <div className="flex flex-wrap gap-1.5">
                              {live.columns_detected.map((col) => (
                                <span key={col} className="text-[11px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-mono">{col}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

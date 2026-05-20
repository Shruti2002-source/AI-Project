'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, AlertCircle, TrendingDown, Lightbulb, Shield, BarChart2, ChevronDown, Zap, Upload } from 'lucide-react';
import Link from 'next/link';
import type { AIInsight } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, getImpactColor } from '@/lib/utils';
import { fetchInsights, getStoredSession, type LiveInsight } from '@/lib/analytics-api';

const TYPE_ICONS: Record<string, React.ElementType> = {
  anomaly:       AlertCircle,
  trend:         TrendingDown,
  opportunity:   Lightbulb,
  risk:          Shield,
  benchmark_gap: BarChart2,
  critical_flag: AlertCircle,
  trend_alert:   TrendingDown,
  positive:      Zap,
};

const TYPE_LABELS: Record<string, string> = {
  anomaly:       'Anomaly',
  trend:         'Trend',
  opportunity:   'Opportunity',
  risk:          'Risk',
  benchmark_gap: 'Benchmark Gap',
  critical_flag: 'Critical',
  trend_alert:   'Trend Alert',
  positive:      'Positive',
};

const TYPE_COLORS: Record<string, { border: string; icon: string; bg: string }> = {
  anomaly:       { border: 'border-l-red-500',    icon: 'text-red-400',    bg: 'bg-red-500/5' },
  trend:         { border: 'border-l-amber-500',  icon: 'text-amber-400',  bg: 'bg-amber-500/5' },
  opportunity:   { border: 'border-l-emerald-500',icon: 'text-emerald-400',bg: 'bg-emerald-500/5' },
  risk:          { border: 'border-l-red-400',    icon: 'text-red-400',    bg: 'bg-red-500/5' },
  benchmark_gap: { border: 'border-l-indigo-500', icon: 'text-indigo-400', bg: 'bg-indigo-500/5' },
  critical_flag: { border: 'border-l-red-500',    icon: 'text-red-400',    bg: 'bg-red-500/5' },
  trend_alert:   { border: 'border-l-amber-500',  icon: 'text-amber-400',  bg: 'bg-amber-500/5' },
  positive:      { border: 'border-l-emerald-500',icon: 'text-emerald-400',bg: 'bg-emerald-500/5' },
};

const FILTER_TYPES = ['all', 'benchmark_gap', 'trend_alert', 'critical_flag', 'opportunity', 'positive', 'trend', 'anomaly', 'risk'];

function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = TYPE_ICONS[insight.type] ?? Lightbulb;
  const colors = TYPE_COLORS[insight.type] ?? TYPE_COLORS.opportunity;
  const timeAgo = Math.round((Date.now() - new Date(insight.generatedAt).getTime()) / 3600000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn('glass-card rounded-2xl border-l-2 overflow-hidden', colors.border)}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colors.bg, 'border border-current/10')}>
            <Icon className={cn('w-5 h-5', colors.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-white leading-tight">{insight.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={cn('text-[10px] px-2', getImpactColor(insight.impact))}>
                  {insight.impact.toUpperCase()} IMPACT
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-2">
                  {TYPE_LABELS[insight.type] ?? insight.type}
                </Badge>
              </div>
            </div>

            <p className={cn('text-sm text-slate-400 leading-relaxed mb-3', !expanded && 'line-clamp-2')}>
              {insight.description}
            </p>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 mb-3"
              >
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Recommendation</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{insight.recommendation}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Category: <span className="text-slate-300">{insight.category}</span></span>
                  <span>Confidence: <span className="text-emerald-400">{Math.round(insight.confidence * 100)}%</span></span>
                  {timeAgo > 0 && <span>{timeAgo}h ago</span>}
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {expanded ? 'Show less' : 'Read more & recommendation'}
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function normaliseLiveInsight(raw: LiveInsight): AIInsight {
  return {
    id: raw.id,
    type: raw.type as AIInsight['type'],
    title: raw.title,
    description: raw.description,
    impact: raw.impact as AIInsight['impact'],
    kpiIds: raw.kpi_ids,
    recommendation: raw.recommendation,
    confidence: raw.confidence,
    category: raw.category,
    generatedAt: raw.generated_at,
  };
}

function SkeletonInsight({ i }: { i: number }) {
  return (
    <div className="glass-card rounded-2xl border-l-2 border-l-slate-700 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-700 rounded" />
          <div className="h-3 w-full bg-slate-800 rounded" />
          <div className="h-3 w-5/6 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [hasSession, setHasSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>('fmcg');

  useEffect(() => {
    const { sessionId: sid, industry: ind } = getStoredSession();
    if (!sid) return;

    setHasSession(true);
    setSessionId(sid);
    setIndustry(ind || 'fmcg');
    setLoading(true);

    fetchInsights(ind || 'fmcg', sid).then((data) => {
      if (data && data.length > 0) {
        setInsights(data.map(normaliseLiveInsight));
      }
      setLoading(false);
    });
  }, []);

  const regenerate = async () => {
    if (!sessionId) return;
    setLoading(true);
    const data = await fetchInsights(industry, sessionId);
    if (data && data.length > 0) {
      setInsights(data.map(normaliseLiveInsight));
    }
    setLoading(false);
  };

  // Only show filter tabs that have at least one matching insight (plus 'all')
  const activeTypes = Array.from(new Set(insights.map((i) => i.type)));
  const visibleFilters = ['all', ...FILTER_TYPES.filter((t) => t !== 'all' && activeTypes.includes(t as AIInsight['type']))];

  const filtered = filter === 'all' ? insights : insights.filter((i) => i.type === filter);

  const stats = {
    total: insights.length,
    high: insights.filter((i) => i.impact === 'high').length,
    categories: new Set(insights.map((i) => i.category)).size,
    avgConfidence: insights.length > 0
      ? Math.round(insights.reduce((a, b) => a + b.confidence, 0) / insights.length * 100)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-400" />
              AI Insights
            </h1>
            {insights.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3 h-3" /> Live
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            {insights.length > 0
              ? 'Generated from your uploaded dataset — real computed values'
              : 'Upload a dataset to generate insights from your data'}
          </p>
        </div>
        {hasSession && (
          <Button
            variant="gradient"
            onClick={regenerate}
            loading={loading}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Regenerate Insights
          </Button>
        )}
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
            Upload a CSV or Excel file to generate AI insights derived entirely from your data. No assumptions are made.
          </p>
          <Link href="/dashboard/upload">
            <Button variant="gradient" className="gap-2">
              <Upload className="w-4 h-4" /> Upload Dataset
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Session but no insights */}
      {hasSession && !loading && insights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-2">No insights generated</h3>
          <p className="text-slate-400 text-sm">
            Insights are derived from calculated KPIs and benchmark comparisons. Ensure your dataset contains recognised columns for your industry.
          </p>
        </motion.div>
      )}

      {/* Stats — only show when there's data or loading */}
      {(loading || insights.length > 0) && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Insights', value: loading ? '—' : stats.total,          color: 'text-indigo-400' },
            { label: 'High Priority',  value: loading ? '—' : stats.high,           color: 'text-red-400' },
            { label: 'Categories',     value: loading ? '—' : stats.categories,     color: 'text-cyan-400' },
            { label: 'Avg Confidence', value: loading ? '—' : `${stats.avgConfidence}%`, color: 'text-emerald-400' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <div className={cn('text-2xl font-bold mb-0.5', s.color, loading && 'animate-pulse')}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filter tabs — only when there are insights */}
      {insights.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {visibleFilters.map((t) => {
            const count = t === 'all' ? insights.length : insights.filter((i) => i.type === t).length;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-200 flex items-center gap-1.5',
                  filter === t
                    ? 'bg-indigo-600 text-white shadow-glow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                )}
              >
                {t === 'benchmark_gap' ? 'Gap Analysis' : t === 'critical_flag' ? 'Critical' : t === 'trend_alert' ? 'Trend Alert' : t === 'all' ? 'All' : t}
                <span className={cn('text-[10px] rounded-full px-1.5 py-0.5', filter === t ? 'bg-white/20' : 'bg-slate-700')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonInsight key={i} i={i} />)}
        </div>
      )}

      {/* Insights list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

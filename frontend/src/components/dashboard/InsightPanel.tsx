'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, TrendingDown, Lightbulb, Shield, BarChart2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { AIInsight } from '@/types';
import { cn, getImpactColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface InsightPanelProps {
  insights: AIInsight[];
  loading?: boolean;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  anomaly: AlertCircle,
  trend: TrendingDown,
  opportunity: Lightbulb,
  risk: Shield,
  benchmark_gap: BarChart2,
};

const TYPE_COLORS: Record<string, string> = {
  anomaly: 'border-l-red-500',
  trend: 'border-l-amber-500',
  opportunity: 'border-l-emerald-500',
  risk: 'border-l-red-400',
  benchmark_gap: 'border-l-indigo-500',
};

const TYPE_ICON_COLORS: Record<string, string> = {
  anomaly: 'text-red-400',
  trend: 'text-amber-400',
  opportunity: 'text-emerald-400',
  risk: 'text-red-400',
  benchmark_gap: 'text-indigo-400',
};

function InsightItem({ insight }: { insight: AIInsight }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = TYPE_ICONS[insight.type] || Lightbulb;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn('insight-card border-l-2', TYPE_COLORS[insight.type])}
    >
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn('mt-0.5 flex-shrink-0', TYPE_ICON_COLORS[insight.type])}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white leading-tight">{insight.title}</h4>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge className={cn('text-[10px] px-1.5 py-0', getImpactColor(insight.impact))}>
                {insight.impact}
              </Badge>
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{insight.description}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-800/60">
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{insight.description}</p>
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Recommendation</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{insight.recommendation}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
                <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                <span>{insight.category}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function InsightPanel({ insights, loading = false }: InsightPanelProps) {
  const [filter, setFilter] = useState<string>('all');

  const types = ['all', 'anomaly', 'trend', 'opportunity', 'risk', 'benchmark_gap'];
  const filtered = filter === 'all' ? insights : insights.filter((i) => i.type === filter);
  const highCount = insights.filter((i) => i.impact === 'high').length;

  return (
    <div className="glass-card rounded-2xl flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">AI Insights</h3>
              <p className="text-[10px] text-slate-400">Powered by GPT-4o + RAG</p>
            </div>
          </div>
          {highCount > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              {highCount} High Priority
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                'text-[10px] px-2 py-1 rounded-lg font-medium capitalize transition-all duration-200',
                filter === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
              )}
            >
              {t === 'benchmark_gap' ? 'Gap' : t === 'all' ? `All (${insights.length})` : t}
            </button>
          ))}
        </div>
      </div>

      {/* Insight list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-800/60 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Brain className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No insights for this filter</p>
          </div>
        ) : (
          filtered.map((insight) => <InsightItem key={insight.id} insight={insight} />)
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60 flex-shrink-0">
        <button className="w-full flex items-center justify-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-2 rounded-xl hover:bg-indigo-600/10">
          <ExternalLink className="w-3.5 h-3.5" />
          View All Insights
        </button>
      </div>
    </div>
  );
}

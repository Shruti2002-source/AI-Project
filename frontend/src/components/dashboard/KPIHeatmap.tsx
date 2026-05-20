'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeatmapCell {
  label: string;
  value: number;
  unit?: string;
  status: 'good' | 'warning' | 'critical' | 'neutral';
}

interface HeatmapRow {
  category: string;
  cells: HeatmapCell[];
}

interface KPIHeatmapProps {
  title?: string;
  subtitle?: string;
  rows: HeatmapRow[];
  columnLabels: string[];
}

const STATUS_BG: Record<string, string> = {
  good: 'bg-emerald-500/20 border-emerald-500/20 text-emerald-300',
  warning: 'bg-amber-500/20 border-amber-500/20 text-amber-300',
  critical: 'bg-red-500/25 border-red-500/25 text-red-300',
  neutral: 'bg-slate-700/30 border-slate-700/30 text-slate-400',
};

const INTENSITY_BG: Record<string, string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  neutral: 'bg-slate-600',
};

const DEFAULT_ROWS: HeatmapRow[] = [
  {
    category: 'Supply Chain',
    cells: [
      { label: 'Fill Rate', value: 94.2, unit: '%', status: 'warning' },
      { label: 'Inventory Turnover', value: 8.6, unit: 'x', status: 'warning' },
      { label: 'Forecast Accuracy', value: 78.3, unit: '%', status: 'warning' },
      { label: 'Stockout Rate', value: 4.8, unit: '%', status: 'critical' },
    ],
  },
  {
    category: 'Sales',
    cells: [
      { label: 'Revenue Growth', value: 8.4, unit: '%', status: 'good' },
      { label: 'Market Share', value: 14.6, unit: '%', status: 'good' },
      { label: 'Sales Volume', value: 2840, unit: 'K', status: 'good' },
      { label: 'AOV', value: 84.6, unit: '$', status: 'good' },
    ],
  },
  {
    category: 'Customer',
    cells: [
      { label: 'Repeat Purchase', value: 62.8, unit: '%', status: 'good' },
      { label: 'Satisfaction', value: 78.4, unit: '%', status: 'good' },
      { label: 'Churn Rate', value: 6.2, unit: '%', status: 'good' },
      { label: 'NPS', value: 58, unit: '', status: 'good' },
    ],
  },
  {
    category: 'Operations',
    cells: [
      { label: 'Warehouse Util.', value: 81.2, unit: '%', status: 'good' },
      { label: 'Lead Time', value: 12.4, unit: 'd', status: 'good' },
      { label: 'Defect Rate', value: 2.4, unit: '%', status: 'good' },
      { label: 'OEE', value: 74.6, unit: '%', status: 'warning' },
    ],
  },
];

const COLUMN_LABELS_DEFAULT = ['Q1', 'Q2', 'Q3', 'Q4'];

export function KPIHeatmap({
  title = 'KPI Performance Heatmap',
  subtitle = 'Cross-category performance overview',
  rows = DEFAULT_ROWS,
  columnLabels = COLUMN_LABELS_DEFAULT,
}: Partial<KPIHeatmapProps>) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {(['good', 'warning', 'critical', 'neutral'] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded-sm', INTENSITY_BG[s])} />
            <span className="text-xs text-slate-400 capitalize">{s === 'neutral' ? 'N/A' : s}</span>
          </div>
        ))}
      </div>

      {/* Column headers */}
      <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: '120px repeat(4, 1fr)' }}>
        <div />
        {columnLabels.map((col) => (
          <div key={col} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1">
            {col}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {rows.map((row, rowIdx) => (
          <motion.div
            key={row.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIdx * 0.06 }}
            className="grid gap-1.5"
            style={{ gridTemplateColumns: '120px repeat(4, 1fr)' }}
          >
            {/* Category label */}
            <div className="flex items-center text-xs font-medium text-slate-400 pr-3 truncate">
              {row.category}
            </div>

            {/* Cells */}
            {row.cells.map((cell, colIdx) => (
              <div
                key={`${row.category}-${colIdx}`}
                className={cn(
                  'relative group rounded-lg border p-2 text-center cursor-default transition-all duration-200 hover:scale-[1.04]',
                  STATUS_BG[cell.status]
                )}
              >
                <div className="text-xs font-bold tabular-nums">
                  {typeof cell.value === 'number' && cell.value > 999
                    ? `${(cell.value / 1000).toFixed(1)}K`
                    : cell.value}
                  {cell.unit && <span className="text-[9px] ml-0.5 opacity-70">{cell.unit}</span>}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                  {cell.label}: {cell.value}{cell.unit}
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* KPI label row (bottom) */}
      <div className="grid gap-1.5 mt-1.5" style={{ gridTemplateColumns: '120px repeat(4, 1fr)' }}>
        <div />
        {rows[0]?.cells.map((cell, i) => (
          <div key={i} className="text-center text-[10px] text-slate-500 truncate px-1 pt-1">
            {cell.label}
          </div>
        ))}
      </div>
    </div>
  );
}

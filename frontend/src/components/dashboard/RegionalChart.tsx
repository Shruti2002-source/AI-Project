'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { cn } from '@/lib/utils';

interface RegionalDataPoint {
  region: string;
  value: number;
  benchmark: number;
  variance: number;
}

interface RegionalChartProps {
  title?: string;
  subtitle?: string;
  kpiName?: string;
  unit?: string;
  data?: RegionalDataPoint[];
  lowerIsBetter?: boolean;
}

const DEFAULT_DATA: RegionalDataPoint[] = [
  { region: 'North', value: 6.2, benchmark: 8.6, variance: -27.9 },
  { region: 'South', value: 9.8, benchmark: 8.6, variance: 14.0 },
  { region: 'East', value: 11.4, benchmark: 8.6, variance: 32.6 },
  { region: 'West', value: 7.6, benchmark: 8.6, variance: -11.6 },
  { region: 'Central', value: 8.8, benchmark: 8.6, variance: 2.3 },
  { region: 'International', value: 5.4, benchmark: 8.6, variance: -37.2 },
];

const CustomTooltip = ({
  active, payload, label, unit, lowerIsBetter,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  unit?: string;
  lowerIsBetter?: boolean;
}) => {
  if (!active || !payload?.length) return null;

  const clientVal = payload.find((p) => p.name === 'value')?.value ?? 0;
  const benchVal = payload.find((p) => p.name === 'benchmark')?.value ?? 0;
  const variance = ((clientVal - benchVal) / benchVal) * 100;
  const positive = lowerIsBetter ? variance < 0 : variance > 0;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs min-w-[160px]">
      <p className="font-semibold text-white mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Client Value</span>
          <span className="font-bold text-white">{clientVal.toFixed(1)}{unit}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Benchmark</span>
          <span className="text-slate-300">{benchVal.toFixed(1)}{unit}</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700">
          <span className="text-slate-400">Variance</span>
          <span className={cn('font-semibold', positive ? 'text-emerald-400' : 'text-red-400')}>
            {variance >= 0 ? '+' : ''}{variance.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export function RegionalChart({
  title = 'Regional Performance',
  subtitle = 'Client vs. Industry Benchmark by Region',
  kpiName = 'Inventory Turnover',
  unit = 'x',
  data = DEFAULT_DATA,
  lowerIsBetter = false,
}: RegionalChartProps) {
  const getBarColor = (value: number, benchmark: number) => {
    const ratio = lowerIsBetter ? benchmark / value : value / benchmark;
    if (ratio >= 1.1) return '#10b981';
    if (ratio >= 0.9) return '#6366f1';
    if (ratio >= 0.75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span className="text-slate-400">Client</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-sm bg-slate-500" />
            <span className="text-slate-400">Benchmark</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip unit={unit} lowerIsBetter={lowerIsBetter} />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <ReferenceLine
            y={data[0]?.benchmark}
            stroke="#64748b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'Benchmark', position: 'right', fontSize: 10, fill: '#64748b' }}
          />
          <Bar dataKey="value" name="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.value, entry.benchmark)}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Region summary chips */}
      <div className="flex flex-wrap gap-2 mt-4">
        {data.map((d) => {
          const positive = lowerIsBetter ? d.variance < 0 : d.variance > 0;
          return (
            <div
              key={d.region}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border',
                positive
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              )}
            >
              <span className="font-medium">{d.region}</span>
              <span>{d.variance >= 0 ? '+' : ''}{d.variance.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from 'recharts';
import { BenchmarkComparison } from '@/types';
import { cn, formatValue } from '@/lib/utils';

interface BenchmarkChartProps {
  data: BenchmarkComparison[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const unit = payload[0]?.payload?.unit;
    return (
      <div className="glass-card rounded-xl p-3 text-xs max-w-xs border border-slate-700/50">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-400 capitalize">{p.name}:</span>
            <span className="text-white font-medium">{formatValue(p.value, unit)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const POSITION_COLORS: Record<string, string> = {
  above_top: '#6ee7b7',
  top_quartile: '#10b981',
  average: '#6366f1',
  below_average: '#f59e0b',
  bottom_quartile: '#ef4444',
};

export function BenchmarkChart({ data, title = 'KPI Benchmark Comparison' }: BenchmarkChartProps) {
  const chartData = data.slice(0, 6).map((d) => ({
    name: d.kpiName.split(' ').slice(0, 2).join(' '),
    fullName: d.kpiName,
    client: d.clientValue,
    average: d.industryAverage,
    topQ: d.topQuartile,
    position: d.position ?? 'average',
    unit: d.unit,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Client vs Industry Average vs Top Quartile</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-90" />
            <span className="text-slate-400">Client</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-slate-600" />
            <span className="text-slate-400">Avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500 opacity-60" />
            <span className="text-slate-400">Top Q</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="client" name="Client" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={POSITION_COLORS[entry.position] || '#6366f1'} opacity={0.85} />
            ))}
          </Bar>
          <Bar dataKey="average" name="Industry Avg" fill="#475569" radius={[3, 3, 0, 0]} opacity={0.7} />
          <Bar dataKey="topQ" name="Top Quartile" fill="#10b981" radius={[3, 3, 0, 0]} opacity={0.4} />
        </BarChart>
      </ResponsiveContainer>

      {/* Position legend */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {data.slice(0, 6).map((item, idx) => {
          const color = POSITION_COLORS[item.position ?? ''] || '#6366f1';
          const vp = item.variancePercent ?? item.gapPercent ?? 0;
          const isPositive = vp >= 0;
          return (
            <div key={item.kpiId ?? idx} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-slate-500 truncate">{item.kpiName.split(' ').slice(0, 2).join(' ')}</span>
              <span className={cn('font-medium flex-shrink-0', isPositive ? 'text-emerald-400' : 'text-red-400')}>
                {isPositive ? '+' : ''}{vp.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

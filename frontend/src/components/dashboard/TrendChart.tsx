'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateTimeSeriesData } from '@/lib/utils';

interface TrendChartProps {
  kpiName: string;
  value: number;
  unit: string;
  trend: number;
  color?: string;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-2.5 text-xs border border-slate-700/50">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

export function TrendChart({ kpiName, value, unit, trend, color = '#6366f1', height = 120 }: TrendChartProps) {
  const data = generateTimeSeriesData(value, 12, trend > 0 ? 0.015 : -0.015);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white">{kpiName}</h4>
          <p className="text-xs text-slate-400">12-month trend</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">{value}{unit}</div>
          <div className={`text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}% MoM
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`area-${(kpiName ?? '').replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#area-${(kpiName ?? '').replace(/\s/g, '')})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

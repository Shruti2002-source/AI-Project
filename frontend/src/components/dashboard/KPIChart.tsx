'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { cn, generateTimeSeriesData } from '@/lib/utils';
import { KPI } from '@/types';

interface KPIChartProps {
  kpis: KPI[];
  title?: string;
  subtitle?: string;
  type?: 'line' | 'bar' | 'area';
  height?: number;
}

const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs border border-slate-700/50">
        <p className="text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
            <span className="text-slate-400">{p.dataKey}:</span>
            <span className="text-white font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

type ChartType = 'line' | 'bar' | 'area';

export function KPIChart({ kpis, title = 'KPI Trends', subtitle = 'Last 12 months', type = 'line', height = 300 }: KPIChartProps) {
  const [chartType, setChartType] = useState<ChartType>(type);

  const chartData = generateTimeSeriesData(100).map((point, i) => {
    const obj: Record<string, string | number> = { name: point.name };
    kpis.slice(0, 4).forEach((kpi, ki) => {
      const data = generateTimeSeriesData(kpi.value);
      obj[kpi.name.split(' ')[0]] = data[i]?.value ?? kpi.value;
    });
    return obj;
  });

  const ChartComponent = chartType === 'bar' ? BarChart : chartType === 'area' ? AreaChart : LineChart;

  const renderSeries = (kpis: KPI[]) =>
    kpis.slice(0, 4).map((kpi, i) => {
      const key = kpi.name.split(' ')[0];
      const color = CHART_COLORS[i % CHART_COLORS.length];
      if (chartType === 'bar') {
        return <Bar key={kpi.id} dataKey={key} fill={color} radius={[3, 3, 0, 0]} opacity={0.85} />;
      }
      if (chartType === 'area') {
        return (
          <Area
            key={kpi.id}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.05}
            dot={false}
          />
        );
      }
      return (
        <Line
          key={kpi.id}
          type="monotone"
          dataKey={key}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
          {([['line', TrendingUp], ['bar', BarChart3], ['area', Activity]] as [ChartType, React.ElementType][]).map(([t, Icon]) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={cn(
                'p-1.5 rounded-md transition-all duration-200',
                chartType === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ paddingTop: '12px' }}
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
          />
          {renderSeries(kpis)}
        </ChartComponent>
      </ResponsiveContainer>
    </motion.div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { SupplyChainKPI } from '@/types';

interface SupplyChainChartProps {
  data: SupplyChainKPI[];
  title: string;
  subtitle?: string;
  height?: number;
  showComparison?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-900 mb-2">
        {payload[0]?.payload?.kpi}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-gray-900">
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

export const SupplyChainChart: React.FC<SupplyChainChartProps> = ({
  data,
  title,
  subtitle,
  height = 400,
  showComparison = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-xs text-gray-600">Client Performance</span>
        </div>
        {showComparison && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-600">Industry Benchmark</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="kpi"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Client Performance"
            dataKey="clientValue"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
          />
          {showComparison && (
            <Radar
              name="Industry Benchmark"
              dataKey="benchmark"
              stroke="#9ca3af"
              fill="#9ca3af"
              fillOpacity={0.05}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#9ca3af', strokeWidth: 0 }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SupplyChainChart;

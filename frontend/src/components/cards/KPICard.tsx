'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPIData } from '@/types';

interface KPICardProps {
  kpi: KPIData;
  index?: number;
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  down: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  stable: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' },
};

export const KPICard: React.FC<KPICardProps> = ({ kpi, index = 0 }) => {
  const trend = trendConfig[kpi.trend] || trendConfig.stable;
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header: Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          {kpi.category}
        </span>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${trend.bg} ${trend.border} border`}>
          <TrendIcon size={12} className={trend.color} />
          <span className={`text-xs font-semibold ${trend.color}`}>
            {kpi.trendPercentage > 0 ? '+' : ''}{kpi.trendPercentage}%
          </span>
        </div>
      </div>

      {/* KPI Name */}
      <p className="text-sm text-gray-500 font-medium mb-1">{kpi.name}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <motion.span
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          className="text-2xl font-bold text-gray-900"
        >
          {kpi.value}
        </motion.span>
        {kpi.unit && (
          <span className="text-sm text-gray-400 font-medium">{kpi.unit}</span>
        )}
      </div>

      {/* Trend Description */}
      {kpi.trendDescription && (
        <p className="text-xs text-gray-400 mt-2">{kpi.trendDescription}</p>
      )}
    </motion.div>
  );
};

export default KPICard;

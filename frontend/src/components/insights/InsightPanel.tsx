'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Eye, Lightbulb } from 'lucide-react';
import { AIInsight } from '@/types';

interface InsightPanelProps {
  insights: AIInsight[];
}

const typeConfig = {
  risk: { icon: AlertTriangle, color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  opportunity: { icon: TrendingUp, color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  observation: { icon: Eye, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  recommendation: { icon: Lightbulb, color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
};

const severityBadge = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-gray-100 text-gray-700',
};

export default function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const config = typeConfig[insight.type];
        const Icon = config.icon;
        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityBadge[insight.severity]}`}>
                    {insight.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                {insight.impact && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Impact:</span> {insight.impact}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

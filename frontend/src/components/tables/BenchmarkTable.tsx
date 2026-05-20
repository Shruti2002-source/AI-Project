'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { BenchmarkRow } from '@/types';

interface BenchmarkTableProps {
  data: BenchmarkRow[];
  title?: string;
}

type SortField = keyof BenchmarkRow;
type SortDirection = 'asc' | 'desc';

const confidenceConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  high: { color: 'text-green-700', bg: 'bg-green-50', icon: Shield },
  medium: { color: 'text-orange-700', bg: 'bg-orange-50', icon: Shield },
  low: { color: 'text-red-700', bg: 'bg-red-50', icon: AlertTriangle },
};

export const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ data, title }) => {
  const [sortField, setSortField] = useState<SortField>('kpi');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === undefined || bVal === undefined) return 0;
    const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-gray-300" />;
    return sortDirection === 'asc' ? (
      <ChevronUp size={12} className="text-orange-500" />
    ) : (
      <ChevronDown size={12} className="text-orange-500" />
    );
  };

  const getGapColor = (gap: number) => {
    if (gap > 0) return 'text-green-600';
    if (gap < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              {[
                { field: 'kpi' as SortField, label: 'KPI' },
                { field: 'clientValue' as SortField, label: 'Client Value' },
                { field: 'industryAverage' as SortField, label: 'Industry Avg' },
                { field: 'topQuartile' as SortField, label: 'Top Quartile' },
                { field: 'gap' as SortField, label: 'Gap' },
                { field: 'source' as SortField, label: 'Source' },
                { field: 'methodology' as SortField, label: 'Methodology' },
                { field: 'confidence' as SortField, label: 'Confidence' },
                { field: 'sourceUrl' as SortField, label: 'URL' },
              ].map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedData.map((row, index) => {
              const conf = confidenceConfig[row.confidence] || confidenceConfig.medium;
              const ConfIcon = conf.icon;

              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`hover:bg-orange-50/30 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                    {row.kpi}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 font-semibold">
                    {row.clientValue}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{row.industryAverage}</td>
                  <td className="px-4 py-3.5 text-gray-500">{row.topQuartile}</td>
                  <td className={`px-4 py-3.5 font-semibold ${getGapColor(row.gap)}`}>
                    {row.gap > 0 ? '+' : ''}{row.gap}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 max-w-[140px] truncate">
                    {row.source}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[120px] truncate">
                    {row.methodology}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${conf.bg} ${conf.color}`}>
                      <ConfIcon size={10} />
                      {row.confidence}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {row.sourceUrl && (
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-400">
          Showing {sortedData.length} benchmark{sortedData.length !== 1 ? 's' : ''} | Sorted by{' '}
          <span className="font-medium text-gray-500">{sortField}</span> ({sortDirection})
        </p>
      </div>
    </motion.div>
  );
};

export default BenchmarkTable;

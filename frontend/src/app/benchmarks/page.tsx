'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { Database, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell } from 'recharts';

function formatUnit(value: number, unit: string): string {
  const u = (unit || '').toLowerCase();
  if (u === '%' || u === 'percent') return `${value.toFixed(1)}%`;
  if (u === 'usd' || u === '$') {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (u === 'inr') {
    if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)} Cr`;
    if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)} L`;
    return `₹${value.toFixed(0)}`;
  }
  if (u === 'x') return `${value.toFixed(1)}x`;
  if (u === 'days') return `${value.toFixed(0)} days`;
  if (u === 'minutes') return `${value.toFixed(0)} min`;
  if (u === 'hours') return `${value.toFixed(0)} hrs`;
  if (u === 'score') return `${value.toFixed(0)}/100`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(value % 1 === 0 ? 0 : 1);
}

export default function BenchmarksPage() {
  const { benchmarks, selectedIndustry } = useStore();
  const hasData = benchmarks.length > 0;

  // Normalize values as % of industry average, capped at 250% for visual clarity
  const chartData = benchmarks.slice(0, 10).map(b => {
    const avg = b.industryAverage || 1;
    const yourPct = Math.min(Math.round((b.clientValue / avg) * 100), 250);
    const topQPct = Math.min(Math.round((b.topQuartile / avg) * 100), 250);
    return {
      name: b.kpiName.replace(/_/g, ' '),
      'Your Value': yourPct,
      'Top Quartile': topQPct,
      status: b.status,
    };
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900">Benchmark Comparison</h1>
              <p className="text-sm text-gray-500 mt-1">
                {hasData
                  ? `Comparing your ${selectedIndustry ?? ''} KPIs against published industry benchmarks`
                  : 'Upload dataset and run analysis to see benchmark comparisons'}
              </p>
            </motion.div>

            {hasData ? (
              <>
                {/* Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-sm font-semibold text-gray-800 mb-1">Performance vs Industry Benchmarks</h2>
                  <p className="text-xs text-gray-400 mb-4">Horizontal bars show your value as % of industry average (100% line = at par)</p>
                  <div style={{ height: Math.max(280, chartData.length * 50) }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 120, bottom: 10 }} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" domain={[0, 'dataMax + 20']} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#374151' }} width={110} />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                          formatter={(value: number, name: string) => [`${value}% of industry avg`, name]}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <ReferenceLine x={100} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Ind. Avg (100%)', position: 'top', fontSize: 10, fill: '#64748b' }} />
                        <Bar dataKey="Your Value" radius={[0, 4, 4, 0]} barSize={18}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.status === 'above' ? '#22c55e' : entry.status === 'below' ? '#f97316' : '#94a3b8'} />
                          ))}
                        </Bar>
                        <Bar dataKey="Top Quartile" fill="#dbeafe" radius={[0, 4, 4, 0]} barSize={18} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span> Above benchmark</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-500 inline-block"></span> Below benchmark</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-100 inline-block"></span> Top Quartile</span>
                    <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4">Dashed line = Industry Average (100%)</span>
                  </div>
                </motion.div>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800">Detailed Benchmark Comparison</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">KPI</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Your Value</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Industry Avg</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Top Quartile</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gap</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {benchmarks.map((b, i) => {
                          const gap = b.gapPercent ?? 0;
                          const isPositive = gap >= 0;
                          return (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-4 py-3 font-medium text-gray-900">{b.kpiName.replace(/_/g, ' ')}</td>
                              <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatUnit(b.clientValue, b.unit)}</td>
                              <td className="px-4 py-3 text-right text-gray-500">{formatUnit(b.industryAverage, b.unit)}</td>
                              <td className="px-4 py-3 text-right text-green-600">{formatUnit(b.topQuartile, b.unit)}</td>
                              <td className={`px-4 py-3 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? '+' : ''}{gap.toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  b.status === 'above' ? 'bg-green-100 text-green-700' :
                                  b.status === 'below' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {b.status === 'above' ? <TrendingUp size={10} /> : b.status === 'below' ? <TrendingDown size={10} /> : <Minus size={10} />}
                                  {b.status === 'above' ? 'Above' : b.status === 'below' ? 'Below' : 'At Par'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px]">
                                {b.sourceUrl ? (
                                  <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1">
                                    {b.source} <ExternalLink size={10} />
                                  </a>
                                ) : (
                                  <span>{b.source}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Source Citations */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-gray-800 mb-4">Source Citations & Methodology</h2>
                  <div className="space-y-3">
                    {benchmarks.map((b, i) => (
                      <div key={i} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{b.kpiName.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{b.methodology}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              b.confidence === 'High' ? 'bg-green-100 text-green-700' :
                              b.confidence === 'Medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{b.confidence} Confidence</span>
                            {b.sourceUrl && (
                              <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-orange-600 mt-1 font-medium">{b.source}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload dataset and run analysis to see benchmark comparison.</p>
              </motion.div>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

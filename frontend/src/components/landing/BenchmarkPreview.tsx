'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const BENCHMARK_DATA = [
  { name: 'Inventory\nTurnover', client: 8.6, average: 10.2, top: 14.8 },
  { name: 'Fill\nRate', client: 94.2, average: 95.8, top: 98.4 },
  { name: 'Forecast\nAccuracy', client: 78.3, average: 82.4, top: 92.6 },
  { name: 'Stockout\nRate', client: 4.8, average: 3.2, top: 1.4 },
  { name: 'Market\nShare', client: 14.6, average: 12.8, top: 22.4 },
];

const INSIGHTS = [
  { type: 'warning', text: 'Inventory Turnover 15.7% below industry average', icon: AlertCircle, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
  { type: 'critical', text: 'Stockout Rate 50% above industry norm — urgent action needed', icon: TrendingDown, color: 'text-red-400 border-red-500/20 bg-red-500/5' },
  { type: 'good', text: 'Market Share outperforms 78% of competitors', icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-400 capitalize">{p.dataKey}:</span>
            <span className="text-white font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BenchmarkPreview() {
  return (
    <section id="benchmarks" className="py-24 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <TrendingDown className="w-4 h-4" />
              Benchmark Intelligence Engine
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Know exactly where you{' '}
              <span className="text-gradient">stand</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Instantly compare every client KPI against industry averages, top quartile, and bottom quartile benchmarks. Our AI quantifies the gap and generates prioritized, actionable recommendations.
            </p>

            {/* Insight pills */}
            <div className="space-y-3 mb-8">
              {INSIGHTS.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${insight.color}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{insight.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <Link href="/dashboard/benchmarks">
              <Button variant="gradient" className="gap-2">
                Explore Benchmarks <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Right: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white">Supply Chain Benchmark Analysis</h3>
                <p className="text-xs text-slate-400 mt-0.5">FMCG Industry · Q3 2024</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-80" /><span className="text-slate-400">Client</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-600" /><span className="text-slate-400">Avg</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500 opacity-60" /><span className="text-slate-400">Top Q</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={BENCHMARK_DATA} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="client" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.9} />
                <Bar dataKey="average" fill="#475569" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="top" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, Award } from 'lucide-react';

const STATS = [
  { label: 'Faster insight generation', value: '10x', sublabel: 'vs manual analysis', icon: TrendingUp, color: 'text-indigo-400' },
  { label: 'Hours saved per engagement', value: '80+', sublabel: 'on data preparation', icon: Clock, color: 'text-cyan-400' },
  { label: 'Consultants on platform', value: '2,400+', sublabel: 'across 48 countries', icon: Users, color: 'text-emerald-400' },
  { label: 'Client engagements powered', value: '12K+', sublabel: 'and growing', icon: Award, color: 'text-amber-400' },
];

export function StatsSection() {
  return (
    <section className="py-20 relative border-y border-slate-800/60">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-cyan-900/10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900/60 border border-slate-800/60 mb-4 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-white font-medium text-sm mb-1">{stat.label}</div>
                <div className="text-slate-500 text-xs">{stat.sublabel}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, FileUp, TrendingUp, BookOpen, Download, Zap, Shield, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: FileUp,
    title: 'Intelligent Data Ingestion',
    description: 'Upload CSV, Excel, PDF, or PowerPoint. AI automatically detects industry, classifies data, and maps to standard KPI frameworks.',
    color: 'from-blue-500 to-indigo-600',
    glow: 'group-hover:shadow-glow-sm',
  },
  {
    icon: BarChart3,
    title: 'KPI Dashboard Engine',
    description: 'Dynamic dashboards with 140+ pre-built KPIs across 5 industries. Interactive charts, trend analysis, and real-time filtering.',
    color: 'from-indigo-500 to-purple-600',
    glow: 'group-hover:shadow-glow-md',
  },
  {
    icon: TrendingUp,
    title: 'Benchmark Intelligence',
    description: 'Compare client performance against industry averages, top quartile, and bottom quartile. Automatic gap analysis and prioritization.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'group-hover:shadow-glow-cyan',
  },
  {
    icon: Brain,
    title: 'AI Insight Generation',
    description: 'RAG-powered AI detects anomalies, identifies root causes, and generates actionable insights with business impact quantification.',
    color: 'from-purple-500 to-pink-600',
    glow: 'group-hover:shadow-glow-md',
  },
  {
    icon: BookOpen,
    title: 'Consulting Storyline Generator',
    description: 'Generate McKinsey-style executive narratives with current state analysis, root causes, business impact, and strategic recommendations.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-glow-emerald',
  },
  {
    icon: Download,
    title: 'Export Center',
    description: 'One-click export to PowerPoint, PDF, or Excel. Executive-ready slides with branded charts, KPI summaries, and recommendations.',
    color: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-glow-sm',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function Features() {
  return (
    <section id="features" className="relative py-24 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Platform Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need to{' '}
            <span className="text-gradient">deliver results</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A complete consulting intelligence stack — from raw data to board-ready presentations.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative glass-card rounded-2xl p-6 card-hover cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-sm ${feature.glow} transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-slate-500 mb-6">Trusted by consultants at leading firms</p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap opacity-40">
            {['McKinsey', 'Deloitte', 'PwC', 'BCG', 'Bain', 'Accenture'].map((firm) => (
              <div key={firm} className="text-slate-300 font-semibold text-sm sm:text-base tracking-wide">
                {firm}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

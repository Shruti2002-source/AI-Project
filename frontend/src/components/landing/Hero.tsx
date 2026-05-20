'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, BarChart2, Brain, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FLOATING_CARDS = [
  {
    id: 1, title: 'Inventory Turnover', value: '8.6x', benchmark: '10.2x', status: 'warning',
    delta: '-15.7%', icon: '📦', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20',
    x: -300, y: 80,
  },
  {
    id: 2, title: 'Patient Satisfaction', value: '92.4%', benchmark: '79.2%', status: 'good',
    delta: '+3.2%', icon: '❤️', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20',
    x: 280, y: 60,
  },
  {
    id: 3, title: 'Cost-to-Income Ratio', value: '58.4%', benchmark: '62.8%', status: 'good',
    delta: '-7.0%', icon: '💹', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20',
    x: -260, y: 260,
  },
  {
    id: 4, title: 'OEE Score', value: '74.6%', benchmark: '77.2%', status: 'warning',
    delta: '-3.4%', icon: '⚙️', color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/20',
    x: 260, y: 280,
  },
];

const STATS = [
  { label: 'KPIs Tracked', value: '140+', icon: BarChart2, color: 'text-indigo-400' },
  { label: 'Industries', value: '5', icon: Shield, color: 'text-cyan-400' },
  { label: 'AI Insights/Day', value: '1000+', icon: Brain, color: 'text-purple-400' },
  { label: 'Export Formats', value: '3', icon: Zap, color: 'text-emerald-400' },
];

function FloatingKPICard({ card, delay }: { card: typeof FLOATING_CARDS[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={`absolute bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.border} rounded-2xl p-4 w-52 shadow-card-dark hidden lg:block`}
      style={{ left: `calc(50% + ${card.x}px)`, top: `calc(50% + ${card.y - 100}px)` }}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl">{card.icon}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            card.status === 'good' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {card.delta}
          </span>
        </div>
        <div className="text-2xl font-bold text-white mb-0.5">{card.value}</div>
        <div className="text-xs text-slate-400 mb-1">{card.title}</div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span>vs Benchmark:</span>
          <span className="text-slate-300">{card.benchmark}</span>
        </div>
        <div className="mt-2 h-1 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${card.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: card.status === 'good' ? '78%' : '42%' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 bg-mesh-gradient" />

      {/* Animated orbs */}
      <div className="floating-orb w-96 h-96 bg-indigo-600 top-20 left-1/4 animate-float" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-64 h-64 bg-cyan-600 top-40 right-1/4 animate-float" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-48 h-48 bg-purple-600 bottom-40 left-1/3 animate-float" style={{ animationDelay: '4s' }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating KPI cards */}
      {mounted && FLOATING_CARDS.map((card, i) => (
        <FloatingKPICard key={card.id} card={card} delay={0.8 + i * 0.15} />
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Consulting Intelligence Platform
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
        >
          Transform Client Data{' '}
          <span className="text-gradient">Into Consulting</span>{' '}
          <br className="hidden sm:block" />
          Gold
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Enterprise AI platform for management consultants. Map KPIs, benchmark against industry leaders, generate McKinsey-style insights, and export executive-ready reports — in minutes, not weeks.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/dashboard">
            <Button variant="gradient" size="xl" className="gap-2 shadow-glow-md hover:shadow-glow-lg w-full sm:w-auto">
              <Zap className="w-5 h-5" />
              Launch Platform Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="glass" size="xl" className="gap-2 w-full sm:w-auto">
              View Demo
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

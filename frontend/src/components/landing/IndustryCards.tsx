'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { INDUSTRIES } from '@/lib/data/industries';
import Link from 'next/link';

export function IndustryCards() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="industries" className="py-24 relative">
      <div className="absolute inset-0 hero-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Built for every{' '}
            <span className="text-gradient">industry</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Pre-loaded with industry-specific KPI frameworks, benchmark databases, and AI models tuned for your sector.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((industry, i) => {
            const isHovered = hoveredId === industry.id;
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onHoverStart={() => setHoveredId(industry.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative glass-card rounded-2xl p-6 cursor-pointer overflow-hidden"
              >
                {/* Background glow */}
                <motion.div
                  animate={{ opacity: isHovered ? 0.15 : 0 }}
                  className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} rounded-2xl`}
                />

                {/* Header */}
                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${industry.color}20`, border: `1px solid ${industry.color}30` }}
                    >
                      {industry.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{industry.name}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {industry.categories.reduce((acc, c) => acc + c.kpis.length, 0)} KPIs
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: isHovered ? 0 : -4, opacity: isHovered ? 1 : 0 }}
                    className="text-indigo-400"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-4 relative">{industry.description}</p>

                {/* KPI categories */}
                <div className="relative flex flex-wrap gap-2 mb-4">
                  {industry.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="text-xs px-2 py-0.5 rounded-full border text-slate-400"
                      style={{ borderColor: `${industry.color}30`, backgroundColor: `${industry.color}10`, color: industry.color }}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                {/* Sample KPIs */}
                <div className="relative space-y-1">
                  {industry.categories[0]?.kpis.slice(0, 3).map((kpi) => (
                    <div key={kpi.id} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: industry.color }} />
                      {kpi.name}
                    </div>
                  ))}
                  {industry.categories.reduce((acc, c) => acc + c.kpis.length, 0) > 3 && (
                    <div className="text-xs text-slate-600">
                      +{industry.categories.reduce((acc, c) => acc + c.kpis.length, 0) - 3} more KPIs
                    </div>
                  )}
                </div>

                {/* Bottom indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-all duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${industry.color}, transparent)`,
                    opacity: isHovered ? 1 : 0.3,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/dashboard/industry">
            <button className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Explore all industries <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

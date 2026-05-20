'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { INDUSTRIES } from '@/lib/data/industries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function IndustryPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selected) router.push('/dashboard/upload');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Select Your Industry</h1>
        <p className="text-slate-400">
          Choose the industry to load the appropriate KPI framework, benchmark database, and AI models.
        </p>
      </div>

      {/* Industry cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INDUSTRIES.map((industry, i) => {
          const isSelected = selected === industry.id;
          const totalKPIs = industry.categories.reduce((acc, c) => acc + c.kpis.length, 0);

          return (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(industry.id)}
              className={cn(
                'group relative rounded-2xl p-6 cursor-pointer border-2 transition-all duration-300',
                isSelected
                  ? 'border-indigo-500/60 bg-indigo-600/10 shadow-glow-sm'
                  : 'border-slate-700/40 bg-slate-900/40 hover:border-slate-600/60 hover:bg-slate-800/40'
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                </div>
              )}

              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${industry.color}20`, border: `1px solid ${industry.color}30` }}
                >
                  {industry.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{industry.name}</h3>
                  <p className="text-xs text-slate-500">{totalKPIs} KPIs · {industry.categories.length} categories</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4 leading-relaxed">{industry.description}</p>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {industry.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ color: industry.color, backgroundColor: `${industry.color}15`, border: `1px solid ${industry.color}25` }}
                  >
                    {cat.icon} {cat.name}
                  </span>
                ))}
              </div>

              {/* Bottom metrics */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <BarChart3 className="w-3.5 h-3.5" style={{ color: industry.color }} />
                  {totalKPIs} KPIs tracked
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: industry.color }} />
                  Benchmarks ready
                </div>
              </div>

              {/* Bottom glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${industry.color}, transparent)`,
                  opacity: isSelected ? 1 : 0,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between glass-card rounded-2xl p-5"
      >
        <div>
          {selected ? (
            <>
              <p className="text-white font-medium">
                {INDUSTRIES.find((i) => i.id === selected)?.icon}{' '}
                {INDUSTRIES.find((i) => i.id === selected)?.name} selected
              </p>
              <p className="text-sm text-slate-400">Ready to upload your client data</p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">Select an industry to continue</p>
          )}
        </div>
        <Button
          variant={selected ? 'gradient' : 'outline'}
          onClick={handleContinue}
          disabled={!selected}
          className="gap-2"
        >
          Continue to Upload <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}

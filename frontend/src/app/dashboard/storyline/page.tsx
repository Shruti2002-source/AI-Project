'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Check, ChevronRight, Copy, Download, RefreshCw, Lightbulb, BarChart3, TrendingUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INDUSTRIES } from '@/lib/data/industries';
import { MOCK_STORYLINES } from '@/lib/data/mockInsights';
import { Storyline } from '@/types';
import { cn, delay } from '@/lib/utils';
import Link from 'next/link';
import { MOCK_ENGAGEMENTS } from '@/lib/data/mockEngagements';

type Framework = 'scr' | 'issue_tree' | 'five_why' | 'executive';

const FRAMEWORKS: { id: Framework; label: string; short: string; desc: string }[] = [
  { id: 'scr', label: 'SCR', short: 'Situation · Complication · Resolution', desc: 'Standard consulting narrative structure' },
  { id: 'issue_tree', label: 'Issue Tree', short: 'Hypothesis-driven decomposition', desc: 'MECE breakdown of root causes' },
  { id: 'five_why', label: '5-Why', short: 'Root cause analysis', desc: 'Drill to the underlying cause' },
  { id: 'executive', label: 'Executive Briefing', short: '7-section full narrative', desc: 'Complete consulting storyline' },
];

const SCR_SECTIONS: Record<string, { key: string; label: string; icon: string; color: string }[]> = {
  scr: [
    { key: 'executiveSummary', label: 'Situation', icon: '📍', color: 'border-l-cyan-500' },
    { key: 'currentState', label: 'Complication — Context', icon: '⚡', color: 'border-l-amber-500' },
    { key: 'keyInsights', label: 'Complication — Evidence', icon: '📊', color: 'border-l-amber-400' },
    { key: 'rootCauses', label: 'Complication — Root Cause', icon: '🔍', color: 'border-l-amber-300' },
    { key: 'businessImpact', label: 'Stakes', icon: '💰', color: 'border-l-red-400' },
    { key: 'recommendations', label: 'Resolution', icon: '🎯', color: 'border-l-emerald-500' },
    { key: 'nextSteps', label: 'Resolution — Roadmap', icon: '📅', color: 'border-l-emerald-400' },
  ],
  issue_tree: [
    { key: 'executiveSummary', label: 'Problem Statement', icon: '❓', color: 'border-l-indigo-500' },
    { key: 'currentState', label: 'Hypothesis Tree', icon: '🌳', color: 'border-l-cyan-500' },
    { key: 'keyInsights', label: 'Evidence (Proven Branches)', icon: '✅', color: 'border-l-emerald-500' },
    { key: 'rootCauses', label: 'Disproven Hypotheses', icon: '❌', color: 'border-l-red-400' },
    { key: 'businessImpact', label: 'Sizing the Opportunity', icon: '💰', color: 'border-l-amber-500' },
    { key: 'recommendations', label: 'Recommendations', icon: '🎯', color: 'border-l-blue-500' },
    { key: 'nextSteps', label: 'Next Steps', icon: '📅', color: 'border-l-rose-500' },
  ],
  five_why: [
    { key: 'executiveSummary', label: 'Problem Definition', icon: '📋', color: 'border-l-indigo-500' },
    { key: 'currentState', label: 'Why #1 — Surface Cause', icon: '1️⃣', color: 'border-l-cyan-500' },
    { key: 'keyInsights', label: 'Why #2 — Process Cause', icon: '2️⃣', color: 'border-l-amber-500' },
    { key: 'rootCauses', label: 'Why #3 — System Cause', icon: '3️⃣', color: 'border-l-purple-500' },
    { key: 'businessImpact', label: 'Why #4–5 — Root Cause', icon: '5️⃣', color: 'border-l-red-400' },
    { key: 'recommendations', label: 'Corrective Actions', icon: '🎯', color: 'border-l-emerald-500' },
    { key: 'nextSteps', label: 'Prevention Plan', icon: '🛡️', color: 'border-l-rose-500' },
  ],
  executive: [
    { key: 'executiveSummary', label: 'Executive Summary', icon: '📋', color: 'border-l-indigo-500' },
    { key: 'currentState', label: 'Current State', icon: '📊', color: 'border-l-cyan-500' },
    { key: 'keyInsights', label: 'Key Insights', icon: '💡', color: 'border-l-amber-500' },
    { key: 'rootCauses', label: 'Root Causes', icon: '🔍', color: 'border-l-purple-500' },
    { key: 'businessImpact', label: 'Business Impact', icon: '💰', color: 'border-l-emerald-500' },
    { key: 'recommendations', label: 'Recommendations', icon: '🎯', color: 'border-l-blue-500' },
    { key: 'nextSteps', label: 'Next Steps', icon: '📅', color: 'border-l-rose-500' },
  ],
};

const KPI_OPTIONS = [
  'Inventory Turnover', 'Stockout Rate', 'Fill Rate', 'Forecast Accuracy',
  'Market Share', 'Revenue Growth', 'Customer Satisfaction', 'Repeat Purchase Rate',
];

type SectionDef = { key: string; label: string; icon: string; color: string };
function StorylineSection({ section, content, index }: { section: SectionDef; content: string | string[]; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = Array.isArray(content) ? content.join('\n') : content;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn('glass-card rounded-2xl border-l-2 p-5', section.color)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.icon}</span>
          <h3 className="font-semibold text-white text-sm">{section.label}</h3>
        </div>
        <button
          onClick={copy}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {Array.isArray(content) ? (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
              <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
      )}
    </motion.div>
  );
}

export default function StorylinePage() {
  const [selectedIndustry, setSelectedIndustry] = useState('fmcg');
  const [selectedEngagement, setSelectedEngagement] = useState('none');
  const [framework, setFramework] = useState<Framework>('scr');
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(['Inventory Turnover', 'Stockout Rate', 'Forecast Accuracy']);
  const [generating, setGenerating] = useState(false);
  const [storyline, setStoryline] = useState<Storyline | null>(MOCK_STORYLINES.fmcg);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const SECTIONS = SCR_SECTIONS[framework];

  const generate = async () => {
    setGenerating(true);
    setStoryline(null);
    setProgress(0);

    const steps = SECTIONS.map((s) => s.key);
    for (let i = 0; i < steps.length; i++) {
      setGeneratingSection(SECTIONS[i].label);
      setProgress(Math.round((i / steps.length) * 100));
      await delay(600);
    }

    setProgress(100);
    setGeneratingSection(null);
    setStoryline(MOCK_STORYLINES[selectedIndustry] || MOCK_STORYLINES.fmcg);
    setGenerating(false);
  };

  const toggleKPI = (kpi: string) => {
    setSelectedKPIs((prev) =>
      prev.includes(kpi) ? prev.filter((k) => k !== kpi) : [...prev, kpi]
    );
  };

  const linkedEng = MOCK_ENGAGEMENTS.find((e) => e.id === selectedEngagement);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Narrative Builder
          </h1>
          <p className="text-slate-400 text-sm mt-1">Generate structured consulting narratives — SCR, Issue Tree, or Executive Briefing</p>
        </div>
        <div className="flex items-center gap-2">
          {storyline && (
            <Link href="/dashboard/export">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Framework selector */}
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Framework</label>
            <div className="space-y-2">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setFramework(fw.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm',
                    framework === fw.id
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-white hover:bg-slate-800',
                  )}
                >
                  <div className="font-semibold">{fw.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{fw.short}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Link to engagement */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Link to Engagement</label>
            </div>
            <Select value={selectedEngagement} onValueChange={setSelectedEngagement}>
              <SelectTrigger>
                <SelectValue placeholder="No engagement linked" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No engagement linked</SelectItem>
                {MOCK_ENGAGEMENTS.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.client} — {e.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {linkedEng && (
              <div className="mt-2 px-2 py-1.5 rounded-lg bg-slate-800/50 text-[10px] text-slate-400">
                Narrative will be tagged <span className="font-mono text-white">{linkedEng.code}</span>
              </div>
            )}
          </div>

          {/* Industry */}
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Industry</label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind.id} value={ind.id}>{ind.icon} {ind.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* KPI selection */}
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Select KPIs ({selectedKPIs.length} selected)
            </label>
            <div className="space-y-2">
              {KPI_OPTIONS.map((kpi) => {
                const selected = selectedKPIs.includes(kpi);
                return (
                  <button
                    key={kpi}
                    onClick={() => toggleKPI(kpi)}
                    className={cn(
                      'w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                      selected
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                        : 'bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:text-slate-200'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border',
                      selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'
                    )}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    {kpi}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Storyline elements */}
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Storyline Elements</label>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <div key={s.key} className="flex items-center gap-2 text-sm text-slate-400">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {s.icon} {s.label}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="gradient"
            onClick={generate}
            loading={generating}
            className="w-full gap-2 h-12 text-base"
          >
            {!generating && <Sparkles className="w-5 h-5" />}
            {generating ? `Generating ${generatingSection || ''}...` : 'Generate Storyline'}
          </Button>

          {generating && (
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                <span>Generating with GPT-4o + RAG</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </div>
              {generatingSection && (
                <p className="text-xs text-indigo-400 mt-2">✦ Writing: {generatingSection}</p>
              )}
            </div>
          )}
        </div>

        {/* Center + Right: Storyline content */}
        <div className="xl:col-span-2 space-y-4">
          {storyline ? (
            <>
              <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white text-lg">{storyline.title}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <Badge variant="default" className="text-[10px]">
                      {INDUSTRIES.find((i) => i.id === storyline.industry)?.icon}{' '}
                      {INDUSTRIES.find((i) => i.id === storyline.industry)?.name}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {FRAMEWORKS.find((f) => f.id === framework)?.label}
                    </Badge>
                    {linkedEng && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {linkedEng.code}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      Generated {new Date(storyline.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={generate}
                  className="text-slate-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {SECTIONS.map((section, i) => {
                const content = storyline[section.key as keyof Storyline];
                if (!content) return null;
                return (
                  <StorylineSection
                    key={section.key}
                    section={section}
                    content={content as string | string[]}
                    index={i}
                  />
                );
              })}
            </>
          ) : !generating ? (
            <div className="glass-card rounded-2xl p-16 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Select your industry and KPIs, then click "Generate Storyline" to create a McKinsey-style consulting narrative.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-16 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-12 h-12 text-indigo-400 mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-white mb-2">Generating Your Storyline</h3>
              <p className="text-slate-400 text-sm max-w-md">
                AI is analyzing your KPI data, benchmark gaps, and generating a structured consulting narrative...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

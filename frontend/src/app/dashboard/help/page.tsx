'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, BookOpen, MessageCircle, Search, ChevronDown,
  ChevronRight, ExternalLink, Zap, FileText, Video, ArrowRight,
  BarChart3, Upload, Brain, Download, Target, Mail, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FAQ_CATEGORIES = [
  {
    id: 'getting_started',
    label: 'Getting Started',
    icon: Zap,
    color: 'text-indigo-400',
    questions: [
      {
        q: 'How do I get started with InsightSynth AI?',
        a: 'Start by selecting your industry from the Industry page, then upload your client data in the Upload Center. The platform will automatically detect KPIs and map them to our benchmark database. From there, navigate to the KPI Dashboard to explore your data, run benchmark comparisons, and generate AI insights.',
      },
      {
        q: 'What file formats can I upload?',
        a: 'InsightSynth AI supports CSV, Excel (.xlsx, .xls), PDF, PowerPoint (.pptx), and plain text (.txt) files. The AI automatically processes each format — extracting tabular data from spreadsheets, parsing tables from PDFs, and reading data from text files.',
      },
      {
        q: 'How does AI industry detection work?',
        a: 'When you upload a file, the platform analyzes column headers, data patterns, and key terms to automatically classify the industry and map fields to KPI templates. You can always override the detection and manually select your industry if needed.',
      },
      {
        q: 'Can I use the platform without uploading data?',
        a: 'Yes. The platform ships with realistic mock data for all 5 industries. You can explore every feature — KPI dashboards, benchmark comparisons, AI insights, storylines, and exports — without uploading any client data. This is ideal for demos and product evaluations.',
      },
    ],
  },
  {
    id: 'kpis',
    label: 'KPI Dashboard',
    icon: BarChart3,
    color: 'text-cyan-400',
    questions: [
      {
        q: 'How are KPI statuses (Good / Warning / Critical) determined?',
        a: 'Statuses are calculated by comparing your KPI values against the industry benchmark thresholds. "Good" means your value is within the top half of industry performers. "Warning" means you\'re between the industry average and the bottom quartile. "Critical" means you\'ve fallen below the bottom quartile.',
      },
      {
        q: 'How do I add a custom KPI?',
        a: 'Navigate to Settings → Data & KPIs → KPI Framework. You can add custom KPIs by defining a name, category, unit, and benchmark thresholds. Custom KPIs will appear in your dashboard alongside the standard framework KPIs.',
      },
      {
        q: 'Can I filter KPIs by date range?',
        a: 'Yes. The KPI Dashboard includes a date range selector at the top of the page. The current data model supports monthly granularity. When connected to a live backend with historical data, the time series charts will automatically update to reflect your selected range.',
      },
      {
        q: 'What does the sparkline chart in each KPI card show?',
        a: 'The sparkline shows the last 12 months of performance for that KPI. An upward-trending sparkline in green indicates positive momentum; a downward trend in red signals concern. The final data point always reflects the current period value.',
      },
    ],
  },
  {
    id: 'benchmarks',
    label: 'Benchmarks',
    icon: Target,
    color: 'text-emerald-400',
    questions: [
      {
        q: 'Where does the benchmark data come from?',
        a: 'InsightSynth AI\'s benchmark database aggregates data from industry reports (McKinsey Global Institute, Deloitte Industry Insights, PwC Benchmarking), public filings, and proprietary surveys. Data is refreshed quarterly and covers 5 industries with 140+ KPIs.',
      },
      {
        q: 'What do Top Quartile and Bottom Quartile mean?',
        a: 'Top Quartile represents the performance level achieved by the top 25% of companies in your industry for a given KPI. Bottom Quartile represents the performance of the bottom 25%. These are calculated from the full benchmark distribution, not just the average.',
      },
      {
        q: 'How is the Variance % calculated?',
        a: 'Variance % = (Client Value − Industry Average) / Industry Average × 100. A positive variance means you outperform the average; negative means underperformance. For inverse metrics (like Stockout Rate, where lower is better), a negative variance is actually positive.',
      },
      {
        q: 'Can I compare against a specific peer group?',
        a: 'The current benchmark database uses industry-wide aggregates. Peer group customization (by company size, geography, or sub-sector) is on the product roadmap for Q3 2026.',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI Insights',
    icon: Brain,
    color: 'text-purple-400',
    questions: [
      {
        q: 'How are AI insights generated?',
        a: 'In demo mode, insights are pre-built to reflect realistic consulting findings. In live mode (with an OpenAI API key configured), GPT-4o analyzes your uploaded data and benchmark gaps using a RAG pipeline that retrieves relevant context from your documents before generating insights.',
      },
      {
        q: 'What is the "Confidence" score on each insight?',
        a: 'The confidence score (0–100%) reflects the AI\'s certainty in the insight, based on the strength of the statistical signal, data quality, and the number of corroborating data points. Insights with >85% confidence are generally publication-ready; those below 70% should be validated before use.',
      },
      {
        q: 'How do I generate the Storyline?',
        a: 'Navigate to the Storyline Generator page. Select your industry and the KPIs you want to feature. Click "Generate Storyline" — the AI will produce a 7-section McKinsey-style narrative including Executive Summary, Current State, Key Insights, Root Causes, Business Impact, Recommendations, and Next Steps.',
      },
      {
        q: 'Can I edit the generated storyline?',
        a: 'Currently, the storyline is read-only in the platform UI but you can copy individual sections using the copy button on each card. Inline editing of storyline sections is planned for the next major release. In the meantime, paste the exported text into your preferred document editor for refinement.',
      },
    ],
  },
  {
    id: 'export',
    label: 'Export & Reports',
    icon: Download,
    color: 'text-amber-400',
    questions: [
      {
        q: 'What export formats are supported?',
        a: 'InsightSynth AI supports PowerPoint (.pptx), PDF, and Excel (.xlsx) exports. The PPTX export creates branded slides with KPI summaries, benchmark charts, and AI insights. The PDF export produces a landscape consulting report. The Excel export creates a multi-sheet workbook.',
      },
      {
        q: 'Can I add my company branding to exports?',
        a: 'Yes. The Export Center allows you to configure your company name, primary brand color, and logo. These are applied to the title slide, headers, footers, and chart color schemes in the exported report.',
      },
      {
        q: 'How long does export generation take?',
        a: 'PPTX and PDF exports typically complete in 10–30 seconds depending on the number of KPIs and charts included. Excel exports are usually faster (5–15 seconds). You\'ll see a progress indicator while the export is being generated.',
      },
      {
        q: 'Can I customize which sections appear in the export?',
        a: 'Yes. The Export Center allows you to toggle individual sections on or off: Executive Summary, KPI Dashboard, Benchmark Comparison, AI Insights, and Recommendations. This lets you tailor reports for different audiences (e.g., a client-facing deck vs. an internal working document).',
      },
    ],
  },
];

const QUICK_LINKS = [
  { label: 'Video Walkthrough', desc: 'Watch a 10-minute platform overview', icon: Video, href: '#' },
  { label: 'API Documentation', desc: 'Full REST API reference for developers', icon: FileText, href: '#' },
  { label: 'KPI Reference Guide', desc: 'Definitions for all 140+ KPIs', icon: BookOpen, href: '#' },
  { label: 'Release Notes', desc: 'What\'s new in each platform version', icon: Zap, href: '#' },
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-white leading-relaxed">{question}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-400 leading-relaxed pb-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting_started');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set(['q-0-0']));

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allQuestions = FAQ_CATEGORIES.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, category: cat.label }))
  );

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const activeData = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          Help & Support
        </h1>
        <p className="text-slate-400 text-sm mt-1">Documentation, FAQs, and support resources</p>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-lg font-semibold text-white">How can we help?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search the documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-sm"
            />
          </div>
          {searchQuery && (
            <p className="text-xs text-slate-400">
              {filteredQuestions?.length} result{filteredQuestions?.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Search results */}
      {searchQuery && filteredQuestions && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Search Results
          </h3>
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No results found. Try different keywords or contact support.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="text-[10px] mt-0.5 flex-shrink-0">{q.category}</Badge>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">{q.q}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{q.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      {!searchQuery && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={i}
                  href={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group glass-card rounded-xl p-4 cursor-pointer hover:border-indigo-500/30 transition-all duration-200 block"
                >
                  <Icon className="w-5 h-5 text-indigo-400 mb-2" />
                  <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{link.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{link.desc}</div>
                  <ExternalLink className="w-3 h-3 text-slate-600 mt-2 group-hover:text-indigo-400 transition-colors" />
                </motion.a>
              );
            })}
          </div>

          {/* FAQ section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category nav */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-3 space-y-1 sticky top-0">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Topics</div>
                {FAQ_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        active
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-indigo-400' : cat.color)} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FAQ content */}
            <div className="lg:col-span-3">
              {activeData && (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <activeData.icon className={cn('w-5 h-5', activeData.color)} />
                    <h3 className="text-base font-semibold text-white">{activeData.label}</h3>
                    <Badge variant="secondary" className="text-[10px]">{activeData.questions.length} questions</Badge>
                  </div>
                  {activeData.questions.map((item, i) => {
                    const id = `q-${activeCategory}-${i}`;
                    return (
                      <FAQItem
                        key={id}
                        question={item.q}
                        answer={item.a}
                        isOpen={openQuestions.has(id)}
                        onToggle={() => toggleQuestion(id)}
                      />
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>

          {/* Contact support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 gradient-border">
              <MessageCircle className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">Live Chat Support</h3>
              <p className="text-sm text-slate-400 mb-4">Available Monday–Friday, 9am–6pm EST. Typical response time: under 5 minutes.</p>
              <Button variant="gradient" size="sm" className="gap-2">
                Start Live Chat <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <Mail className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">Email Support</h3>
              <p className="text-sm text-slate-400 mb-4">For non-urgent issues or detailed technical questions. Response within 24 hours.</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="w-3.5 h-3.5" /> support@insightsynth.ai
                </Button>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-sm font-medium text-white">All Systems Operational</span>
                <span className="text-xs text-slate-500 ml-2">· Last checked 2 minutes ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>99.98% uptime this month</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

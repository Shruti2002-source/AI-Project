'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadZone } from '@/components/dashboard/UploadZone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, CheckCircle, ArrowRight, Info, Download, Database, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INDUSTRIES } from '@/lib/data/industries';
import { storeSession, type AnalyticsSummary } from '@/lib/analytics-api';
import Link from 'next/link';

const SAMPLE_DATASETS = [
  { industry: 'fmcg', label: 'FMCG Operations', desc: '12-month supply chain & revenue data · 6 KPIs', kpis: 6 },
  { industry: 'healthcare', label: 'Healthcare KPIs', desc: '12-month patient & financial data · 6 KPIs', kpis: 6 },
  { industry: 'banking', label: 'Banking Performance', desc: '12-month financial & digital data · 5 KPIs', kpis: 5 },
];

interface AnalyticsSummaryBanner {
  sessionId: string;
  industry: string;
  kpisCalculated: number;
  rowsProcessed: number;
  columnsMapped: number;
}

export default function UploadPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [analyticsBanner, setAnalyticsBanner] = useState<AnalyticsSummaryBanner | null>(null);

  const handleSessionCreated = (sessionId: string, industry: string, summary?: Record<string, unknown>) => {
    const typed = summary as unknown as AnalyticsSummary | undefined;
    storeSession(sessionId, industry, typed);
    setAnalyticsBanner({
      sessionId,
      industry,
      kpisCalculated: typed?.kpis_calculated ?? 0,
      rowsProcessed: typed?.rows_processed ?? 0,
      columnsMapped: typed?.columns_mapped ?? 0,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Upload Center</h1>
        <p className="text-slate-400 text-sm">Upload client data files for real-time KPI calculation and benchmark mapping</p>
      </div>

      <AnimatePresence>
        {analyticsBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-600/5 flex items-center gap-4"
          >
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">Analytics complete — live data is now active</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Industry: <span className="text-emerald-400 capitalize">{analyticsBanner.industry}</span>
                {' · '}Session: <span className="font-mono text-slate-400">{analyticsBanner.sessionId.slice(0, 8)}…</span>
              </div>
            </div>
            <Link href="/dashboard/kpis">
              <Button variant="success" size="sm" className="gap-1.5 text-xs whitespace-nowrap">
                View Live KPIs <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="text-sm text-slate-300">Industry context helps the engine map columns to the correct KPI formulas</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-400 whitespace-nowrap">Override Industry:</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Auto-detect (recommended)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.icon} {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              Upload Files
              <Badge variant="secondary" className="text-[10px]">CSV · Excel · PDF · PPT · TXT</Badge>
            </h3>
            <UploadZone onSessionCreated={handleSessionCreated} industryOverride={selectedIndustry} />
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-white text-sm">Analytics Pipeline</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Schema Detection', desc: '40+ column aliases matched' },
                { label: 'Formula Engine', desc: 'Per-industry KPI formulas' },
                { label: 'Trend Engine', desc: 'MoM delta & sparklines' },
                { label: 'Benchmark Compare', desc: 'vs industry quartiles' },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                  <div className="font-medium text-white mb-0.5">{s.label}</div>
                  <div className="text-slate-500">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-white text-sm">Download Samples</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Pre-built datasets with real data — upload to see live analytics</p>
            <div className="space-y-2">
              {SAMPLE_DATASETS.map((dataset) => (
                <a
                  key={dataset.industry}
                  href={`/api/v1/samples/${dataset.industry}`}
                  download
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">{dataset.label}</div>
                    <div className="text-[10px] text-slate-500">{dataset.desc}</div>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Supported Formats</h3>
            <div className="space-y-2 text-xs text-slate-400">
              {[
                ['CSV/Excel', 'Full analytics pipeline — real KPI calculations'],
                ['PDF', 'Annual reports, presentations (text extraction)'],
                ['PowerPoint', 'Existing analysis decks'],
                ['TXT', 'Unstructured notes and data'],
              ].map(([type, desc]) => (
                <div key={type} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-medium flex-shrink-0">{type}</span>
                  <span>— {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

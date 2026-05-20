'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Presentation, Check, Loader2, Eye, Settings2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const FIRM_TEMPLATES = [
  {
    id: 'pwc',
    label: 'PwC Branded',
    desc: 'White background, PwC orange accents (#D04A02), confidentiality footer',
    color: 'from-orange-600 to-amber-500',
    preview: ['#FFFFFF', '#D04A02', '#2D2D2D'],
    badge: 'Client delivery',
  },
  {
    id: 'mckinsey',
    label: 'McKinsey Style',
    desc: 'Black/white with bold headline numbers, minimal labels',
    color: 'from-slate-700 to-slate-900',
    preview: ['#FFFFFF', '#000000', '#005A9C'],
    badge: null,
  },
  {
    id: 'deloitte',
    label: 'Deloitte',
    desc: 'Green accent (#86BC25), clean white layout, formal structure',
    color: 'from-green-600 to-emerald-700',
    preview: ['#FFFFFF', '#86BC25', '#000000'],
    badge: null,
  },
  {
    id: 'bcg',
    label: 'BCG',
    desc: 'BCG green (#009A44) with structured exhibit format',
    color: 'from-emerald-600 to-teal-700',
    preview: ['#FFFFFF', '#009A44', '#2E2E2E'],
    badge: null,
  },
  {
    id: 'generic',
    label: 'Generic Branded',
    ext: '.pptx',
    desc: 'Custom colour palette — apply your own branding',
    color: 'from-indigo-500 to-purple-600',
    preview: ['#020617', '#6366f1', '#06b6d4'],
    badge: null,
  },
];

const EXPORT_FORMATS = [
  {
    id: 'pptx',
    label: 'PowerPoint',
    ext: '.pptx',
    icon: Presentation,
    desc: 'Executive presentation with branded slides, charts, and recommendations',
    color: 'from-orange-500 to-red-600',
    slides: '12-15 slides',
    recommended: true,
  },
  {
    id: 'pdf',
    label: 'PDF Report',
    ext: '.pdf',
    icon: FileText,
    desc: 'Full analytical report with detailed charts, benchmarks, and insights',
    color: 'from-red-500 to-rose-600',
    slides: 'Paginated report',
    recommended: false,
  },
  {
    id: 'excel',
    label: 'Excel Summary',
    ext: '.xlsx',
    icon: FileSpreadsheet,
    desc: 'Structured data export with KPI tables, benchmarks, and raw data',
    color: 'from-emerald-500 to-teal-600',
    slides: 'Multi-sheet workbook',
    recommended: false,
  },
];

const CONTENT_OPTIONS = [
  { id: 'executiveSummary', label: 'Executive Summary', desc: 'AI-generated high-level overview' },
  { id: 'kpiDashboard', label: 'KPI Dashboard', desc: 'All tracked metrics with status' },
  { id: 'benchmarks', label: 'Benchmark Analysis', desc: 'Client vs industry comparison' },
  { id: 'insights', label: 'AI Insights', desc: 'Anomaly and opportunity analysis' },
  { id: 'recommendations', label: 'Recommendations', desc: 'Prioritized action items' },
  { id: 'storyline', label: 'Consulting Narrative', desc: 'McKinsey-style storyline' },
];

const PREVIEW_SLIDES = [
  { title: 'Executive Summary', subtitle: 'FMCG Industry · Q3 2024', color: 'bg-indigo-600/20' },
  { title: 'KPI Performance Overview', subtitle: '28 KPIs tracked · 3 categories', color: 'bg-cyan-600/20' },
  { title: 'Benchmark Comparison', subtitle: 'Supply Chain Performance', color: 'bg-emerald-600/20' },
  { title: 'Key Insights & Risks', subtitle: '6 AI-generated insights', color: 'bg-amber-600/20' },
  { title: 'Strategic Recommendations', subtitle: '$6.8M value creation opportunity', color: 'bg-purple-600/20' },
  { title: 'Implementation Roadmap', subtitle: '90-day action plan', color: 'bg-rose-600/20' },
];

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState('pptx');
  const [selectedTemplate, setSelectedTemplate] = useState('pwc');
  const [selectedContent, setSelectedContent] = useState(CONTENT_OPTIONS.map((c) => c.id));
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exported, setExported] = useState(false);
  const [branding, setBranding] = useState({ companyName: 'Hartley Foods', primaryColor: '#D04A02' });

  const toggleContent = (id: string) => {
    setSelectedContent((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const doExport = async () => {
    setExporting(true);
    setExportProgress(0);
    setExported(false);

    for (let p = 0; p <= 100; p += 12) {
      setExportProgress(p);
      await new Promise((r) => setTimeout(r, 250));
    }
    setExportProgress(100);
    setExported(true);
    setExporting(false);
  };

  const format = EXPORT_FORMATS.find((f) => f.id === selectedFormat)!;
  const FormatIcon = format.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Export Center</h1>
        <p className="text-slate-400 text-sm mt-1">Generate executive-ready reports, presentations, and data exports</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Config */}
        <div className="space-y-5">
          {/* Firm template */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Firm Template</label>
            </div>
            <div className="space-y-2">
              {FIRM_TEMPLATES.map((tmpl) => {
                const selected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                      selected ? 'border-indigo-500/60 bg-indigo-600/10' : 'border-slate-700/40 bg-slate-900/30 hover:border-slate-600/60'
                    )}
                  >
                    <div className="flex gap-0.5 shrink-0">
                      {tmpl.preview.map((c, i) => (
                        <div key={i} className="w-3 h-5 rounded-sm first:rounded-l-md last:rounded-r-md" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-medium', selected ? 'text-white' : 'text-slate-300')}>{tmpl.label}</span>
                        {tmpl.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">{tmpl.badge}</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{tmpl.desc}</p>
                    </div>
                    {selected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format selection */}
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4">Export Format</label>
            <div className="space-y-3">
              {EXPORT_FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                const selected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200',
                      selected
                        ? 'border-indigo-500/60 bg-indigo-600/10'
                        : 'border-slate-700/40 bg-slate-900/30 hover:border-slate-600/60'
                    )}
                  >
                    <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', fmt.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{fmt.label}</span>
                        {fmt.recommended && <Badge variant="default" className="text-[10px] px-1.5">Recommended</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{fmt.desc}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{fmt.slides}</span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content selection */}
          <div className="glass-card rounded-2xl p-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4">Include Content</label>
            <div className="space-y-2">
              {CONTENT_OPTIONS.map((opt) => {
                const selected = selectedContent.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleContent(opt.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                      selected ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-slate-800/40 border border-slate-700/40'
                    )}
                  >
                    <div className={cn('w-4 h-4 rounded border flex items-center justify-center flex-shrink-0', selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600')}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={cn('font-medium', selected ? 'text-white' : 'text-slate-400')}>{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Branding */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Branding</label>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Company Name</label>
                <input
                  value={branding.companyName}
                  onChange={(e) => setBranding((b) => ({ ...b, companyName: e.target.value }))}
                  className="input-dark w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-sm text-slate-300">{branding.primaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export button */}
          {exporting ? (
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Generating {format.label}...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} indicatorClassName="bg-gradient-to-r from-indigo-600 to-cyan-500" />
              <p className="text-xs text-slate-500">Rendering {selectedContent.length} sections</p>
            </div>
          ) : exported ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-5 flex items-center gap-3 border border-emerald-500/20 bg-emerald-600/5"
            >
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-white font-medium text-sm">Export Ready!</div>
                <div className="text-xs text-slate-400">InsightSynth_Report{format.ext}</div>
              </div>
              <Button variant="success" size="sm" className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> Download
              </Button>
            </motion.div>
          ) : (
            <Button variant="gradient" onClick={doExport} className="w-full gap-2 h-12 text-base">
              <FormatIcon className="w-5 h-5" />
              Export {format.label}
            </Button>
          )}
        </div>

        {/* Right: Preview */}
        <div className="xl:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  Slide Preview
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{PREVIEW_SLIDES.length} slides · {branding.companyName}</p>
              </div>
              <Badge variant="secondary">{format.slides}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PREVIEW_SLIDES.map((slide, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn('rounded-xl aspect-video flex flex-col justify-end p-3 cursor-pointer hover:ring-2 hover:ring-indigo-500/30 transition-all', slide.color, 'border border-white/5')}
                >
                  <div className="text-white text-[10px] font-semibold leading-tight">{slide.title}</div>
                  <div className="text-white/50 text-[9px] mt-0.5">{slide.subtitle}</div>
                  <div className="text-white/30 text-[9px] mt-1">Slide {i + 1}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-slate-800/60">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="text-white font-semibold">{selectedContent.length}</div>
                  <div className="text-slate-400">Sections</div>
                </div>
                <div>
                  <div className="text-white font-semibold">{PREVIEW_SLIDES.length}</div>
                  <div className="text-slate-400">Slides</div>
                </div>
                <div>
                  <div className="text-white font-semibold">{format.ext}</div>
                  <div className="text-slate-400">Format</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

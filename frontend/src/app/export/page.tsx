'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { Download, FileSpreadsheet, FileText, Presentation, CheckCircle, Loader2 } from 'lucide-react';

export default function ExportPage() {
  const { file, kpiResults, benchmarks, insights, storyline, selectedIndustry } = useStore();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string[]>([]);
  const hasData = kpiResults.length > 0;

  const handleExport = async (format: 'pptx' | 'pdf' | 'xlsx') => {
    if (!hasData) return;
    setExporting(format);
    try {
      const { exportToPowerPoint, exportToPDF, exportToExcel, downloadBlob } = await import('@/services/exportEngine');
      const kpiValues = kpiResults
        .filter(r => r.groupedBy === 'Overall')
        .map(r => ({ name: r.kpiName, value: r.overallValue, unit: r.unit, category: 'General', trend: r.trend ?? 'stable' as const, trendValue: r.trendValue ?? 0, formula: r.aggregation }));

      const defaultStoryline = {
        executiveSummary: 'Analysis complete. See KPI results and benchmarks for details.',
        currentPerformance: 'See KPI dashboard for current metrics.',
        keyInsight: insights.length > 0 ? insights[0].description : 'No key insights generated.',
        rootCause: 'Refer to detailed analysis for root cause identification.',
        businessImpact: 'See benchmark comparison for business impact assessment.',
        recommendation: 'Review benchmark gaps and prioritize improvement areas.',
        nextSteps: ['Review KPI performance gaps', 'Prioritize improvement initiatives', 'Set quarterly targets'],
      };

      const exportData = {
        kpiValues,
        benchmarks,
        insights,
        storyline: storyline || defaultStoryline,
        industry: selectedIndustry || 'General',
        metadata: {
          fileName: file?.name || 'InsightSynth Report',
          generatedAt: new Date().toISOString(),
          totalRows: kpiResults.length,
        },
      };

      const baseName = (file?.name || 'InsightSynth_Report').replace(/\.[^/.]+$/, '');
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'pptx':
          blob = await exportToPowerPoint(exportData as any);
          filename = `${baseName}.pptx`;
          break;
        case 'pdf':
          blob = await exportToPDF(exportData as any);
          filename = `${baseName}.pdf`;
          break;
        case 'xlsx':
          blob = await exportToExcel(exportData as any);
          filename = `${baseName}.xlsx`;
          break;
      }

      downloadBlob(blob, filename);
      setExported(prev => [...prev, format]);
    } catch (err) { console.error('Export failed:', err); }
    finally { setExporting(null); }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900">Export Center</h1>
              <p className="text-sm text-gray-500 mt-1">Generate and download consulting-grade reports</p>
            </motion.div>

            {hasData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'pptx' as const, title: 'PowerPoint Report', desc: 'Executive presentation with KPIs and storyline', icon: Presentation },
                  { id: 'pdf' as const, title: 'PDF Report', desc: 'Detailed consulting report with findings', icon: FileText },
                  { id: 'xlsx' as const, title: 'Excel Workbook', desc: 'Data with KPI calculations and benchmarks', icon: FileSpreadsheet },
                ].map((opt, i) => (
                  <motion.div key={opt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                      <opt.icon className="w-7 h-7 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{opt.title}</h3>
                    <p className="text-xs text-gray-500 mb-5">{opt.desc}</p>
                    <button
                      onClick={() => handleExport(opt.id)}
                      disabled={exporting !== null}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        exported.includes(opt.id) ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {exporting === opt.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> :
                       exported.includes(opt.id) ? <><CheckCircle className="w-4 h-4" /> Downloaded</> :
                       <><Download className="w-4 h-4" /> Export</>}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload dataset and run analysis to enable exports.</p>
              </motion.div>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { Download, FileSpreadsheet, FileText, Presentation, CheckCircle, Loader2 } from 'lucide-react';

export default function ExportPage() {
  const { file, kpiValues, benchmarks, insights, storyline, detectedIndustry } = useStore();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string[]>([]);
  const hasData = kpiValues.length > 0;

  const handleExport = async (format: 'pptx' | 'pdf' | 'xlsx') => {
    if (!hasData) return;
    setExporting(format);

    try {
      const { exportToPowerPoint, exportToPDF, exportToExcel } = await import('@/services/exportEngine');
      const exportData = { kpiValues, benchmarks, insights, storyline, industry: detectedIndustry, fileName: file?.name };

      switch (format) {
        case 'pptx':
          await exportToPowerPoint(exportData);
          break;
        case 'pdf':
          await exportToPDF(exportData);
          break;
        case 'xlsx':
          await exportToExcel(exportData);
          break;
      }
      setExported(prev => [...prev, format]);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      id: 'pptx' as const,
      title: 'PowerPoint Report',
      description: 'Executive presentation with KPIs, charts, and storyline',
      icon: Presentation,
      color: 'orange',
    },
    {
      id: 'pdf' as const,
      title: 'PDF Report',
      description: 'Detailed consulting report with all analysis findings',
      icon: FileText,
      color: 'red',
    },
    {
      id: 'xlsx' as const,
      title: 'Excel Workbook',
      description: 'Raw data with KPI calculations and benchmark comparisons',
      icon: FileSpreadsheet,
      color: 'green',
    },
  ];

  return (
    <div className="flex h-screen bg-enterprise-light">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-2xl font-bold text-gray-900">Export Center</h1>
              <p className="text-sm text-gray-500 mt-1">
                Generate and download consulting-grade reports
              </p>
            </motion.div>

            {hasData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exportOptions.map((option, i) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card-enterprise p-6 flex flex-col items-center text-center"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-${option.color}-50`}>
                      <option.icon className={`w-8 h-8 text-${option.color}-500`} />
                    </div>
                    <h3 className="font-display font-semibold text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{option.description}</p>
                    <button
                      onClick={() => handleExport(option.id)}
                      disabled={exporting !== null}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        exported.includes(option.id)
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'btn-primary'
                      }`}
                    >
                      {exporting === option.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : exported.includes(option.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Downloaded
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Export
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-enterprise p-12 text-center"
              >
                <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload dataset to begin analysis and enable exports.</p>
              </motion.div>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

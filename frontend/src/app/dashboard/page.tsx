'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import UploadEngine from '@/components/upload/UploadEngine';
import KPICard from '@/components/cards/KPICard';
import TrendChart from '@/components/charts/TrendChart';
import BenchmarkChart from '@/components/charts/BenchmarkChart';
import SupplyChainChart from '@/components/charts/SupplyChainChart';
import InsightPanel from '@/components/insights/InsightPanel';
import { Upload, BarChart3, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { file, kpiValues, benchmarks, insights, currentStep, detectedIndustry } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'supply-chain' | 'financial' | 'customer'>('overview');

  const hasData = file !== null && kpiValues.length > 0;

  const financialKPIs = kpiValues.filter(k => k.category === 'Financial');
  const operationalKPIs = kpiValues.filter(k => k.category === 'Operational');
  const customerKPIs = kpiValues.filter(k => k.category === 'Customer');

  return (
    <div className="flex h-screen bg-enterprise-light">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {!hasData ? (
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  Welcome to InsightSynth AI
                </h1>
                <p className="text-gray-500">
                  Upload your business dataset to begin automated analysis
                </p>
              </motion.div>
              <UploadEngine />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-gray-900">
                    {detectedIndustry} Analytics Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Analysis of {file.name} &middot; {file.data.length} records
                  </p>
                </div>
                <div className="flex gap-2">
                  {(['overview', 'supply-chain', 'financial', 'customer'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {tab.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {kpiValues.slice(0, 8).map((kpi, i) => (
                        <KPICard key={kpi.name} kpi={kpi} index={i} />
                      ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="card-enterprise p-6">
                        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary-500" />
                          Performance Trends
                        </h3>
                        <TrendChart data={file.data} kpis={kpiValues} />
                      </div>
                      <div className="card-enterprise p-6">
                        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary-500" />
                          Benchmark Comparison
                        </h3>
                        <BenchmarkChart benchmarks={benchmarks} />
                      </div>
                    </div>
                    {insights.length > 0 && (
                      <div className="card-enterprise p-6">
                        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary-500" />
                          AI-Generated Insights
                        </h3>
                        <InsightPanel insights={insights.slice(0, 4)} />
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'supply-chain' && (
                  <motion.div
                    key="supply-chain"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {operationalKPIs.map((kpi, i) => (
                        <KPICard key={kpi.name} kpi={kpi} index={i} />
                      ))}
                    </div>
                    <div className="card-enterprise p-6">
                      <h3 className="font-display font-semibold text-gray-900 mb-4">Supply Chain Performance</h3>
                      <SupplyChainChart kpis={operationalKPIs} benchmarks={benchmarks} />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'financial' && (
                  <motion.div
                    key="financial"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {financialKPIs.map((kpi, i) => (
                        <KPICard key={kpi.name} kpi={kpi} index={i} />
                      ))}
                    </div>
                    <div className="card-enterprise p-6">
                      <h3 className="font-display font-semibold text-gray-900 mb-4">Financial Trends</h3>
                      <TrendChart data={file.data} kpis={financialKPIs} />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'customer' && (
                  <motion.div
                    key="customer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {customerKPIs.map((kpi, i) => (
                        <KPICard key={kpi.name} kpi={kpi} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

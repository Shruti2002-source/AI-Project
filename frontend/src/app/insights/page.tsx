'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import InsightPanel from '@/components/insights/InsightPanel';
import { Brain, AlertTriangle, TrendingUp, Eye, Lightbulb } from 'lucide-react';

export default function InsightsPage() {
  const { insights, kpiValues, benchmarks, detectedIndustry } = useStore();
  const hasData = insights.length > 0;

  const riskInsights = insights.filter(i => i.type === 'risk');
  const opportunityInsights = insights.filter(i => i.type === 'opportunity');
  const observationInsights = insights.filter(i => i.type === 'observation');
  const recommendationInsights = insights.filter(i => i.type === 'recommendation');

  return (
    <div className="flex h-screen bg-enterprise-light">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-2xl font-bold text-gray-900">AI Insights</h1>
              <p className="text-sm text-gray-500 mt-1">
                Intelligent analysis powered by KPI calculations and benchmark comparisons
              </p>
            </motion.div>

            {hasData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Risks', count: riskInsights.length, icon: AlertTriangle, color: 'red' },
                    { label: 'Opportunities', count: opportunityInsights.length, icon: TrendingUp, color: 'green' },
                    { label: 'Observations', count: observationInsights.length, icon: Eye, color: 'blue' },
                    { label: 'Recommendations', count: recommendationInsights.length, icon: Lightbulb, color: 'orange' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card-enterprise p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{item.count}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${item.color}-50`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {riskInsights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-enterprise p-6"
                  >
                    <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Risk Alerts
                    </h2>
                    <InsightPanel insights={riskInsights} />
                  </motion.div>
                )}

                {opportunityInsights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-enterprise p-6"
                  >
                    <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Growth Opportunities
                    </h2>
                    <InsightPanel insights={opportunityInsights} />
                  </motion.div>
                )}

                {recommendationInsights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card-enterprise p-6"
                  >
                    <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary-500" />
                      Strategic Recommendations
                    </h2>
                    <InsightPanel insights={recommendationInsights} />
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-enterprise p-12 text-center"
              >
                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload dataset to generate AI insights.</p>
              </motion.div>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

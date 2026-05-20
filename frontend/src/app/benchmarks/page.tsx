'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import BenchmarkTable from '@/components/tables/BenchmarkTable';
import BenchmarkChart from '@/components/charts/BenchmarkChart';
import { Database, ExternalLink, Globe, Shield } from 'lucide-react';
import { BenchmarkSource, Industry } from '@/types';

const benchmarkSources: BenchmarkSource[] = [
  { name: 'NielsenIQ', industry: 'FMCG', type: 'Report', url: 'https://nielseniq.com', description: 'Global FMCG market intelligence and benchmarks' },
  { name: 'Kantar', industry: 'FMCG', type: 'Report', url: 'https://kantar.com', description: 'Consumer panel data and market share benchmarks' },
  { name: 'Euromonitor', industry: 'FMCG', type: 'Database', url: 'https://euromonitor.com', description: 'Industry research and market sizing' },
  { name: 'Gartner Supply Chain', industry: 'FMCG', type: 'Report', url: 'https://gartner.com/en/supply-chain', description: 'Supply chain benchmarking and best practices' },
  { name: 'WHO Global Health Observatory', industry: 'Healthcare', type: 'Database', url: 'https://who.int/data/gho', description: 'Global health statistics and indicators' },
  { name: 'CMS Provider Data', industry: 'Healthcare', type: 'API', url: 'https://data.cms.gov', description: 'US healthcare provider performance data' },
  { name: 'OECD Health Statistics', industry: 'Healthcare', type: 'Database', url: 'https://oecd.org/health', description: 'Comparative health system statistics' },
  { name: 'FDIC Bank Data', industry: 'Banking', type: 'API', url: 'https://banks.data.fdic.gov', description: 'US bank financial and performance data' },
  { name: 'IMF Financial Statistics', industry: 'Banking', type: 'Database', url: 'https://data.imf.org', description: 'International financial and monetary statistics' },
  { name: 'World Bank Financial Indicators', industry: 'Banking', type: 'Database', url: 'https://data.worldbank.org', description: 'Global financial development indicators' },
  { name: 'Adobe Digital Economy Index', industry: 'Retail', type: 'Index', url: 'https://business.adobe.com/resources/digital-economy-index.html', description: 'Real-time digital commerce data' },
  { name: 'NRF Retail Insights', industry: 'Retail', type: 'Report', url: 'https://nrf.com', description: 'US retail industry statistics and benchmarks' },
  { name: 'OECD Manufacturing Statistics', industry: 'Manufacturing', type: 'Database', url: 'https://oecd.org/industry/ind', description: 'Industrial production and efficiency data' },
  { name: 'APQC Benchmarking', industry: 'Manufacturing', type: 'Report', url: 'https://apqc.org', description: 'Process and performance benchmarking data' },
];

export default function BenchmarksPage() {
  const { benchmarks, detectedIndustry, file } = useStore();
  const hasData = benchmarks.length > 0;

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
              <h1 className="font-display text-2xl font-bold text-gray-900">Benchmark Intelligence</h1>
              <p className="text-sm text-gray-500 mt-1">
                Industry benchmarks and performance comparison
              </p>
            </motion.div>

            {hasData ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card-enterprise p-6"
                >
                  <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary-500" />
                    Performance vs Industry Benchmark
                  </h2>
                  <BenchmarkChart benchmarks={benchmarks} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-enterprise p-6"
                >
                  <h2 className="font-display font-semibold text-gray-900 mb-4">Detailed Benchmark Comparison</h2>
                  <BenchmarkTable benchmarks={benchmarks} />
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-enterprise p-12 text-center"
              >
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload dataset to begin benchmark comparison.</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-enterprise p-6"
            >
              <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-500" />
                Benchmark Source Registry
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Industry</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarkSources
                      .filter(s => !detectedIndustry || s.industry === detectedIndustry)
                      .map((source, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-gray-900">{source.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                              {source.industry}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{source.type}</td>
                          <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{source.description}</td>
                          <td className="py-3 px-4">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
                            >
                              Visit <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

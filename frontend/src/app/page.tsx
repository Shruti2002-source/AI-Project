'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BarChart3, Brain, FileUp, LineChart, Target, Zap } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { icon: FileUp, title: 'Smart Upload', desc: 'CSV, Excel, TXT with auto-detection' },
    { icon: Brain, title: 'AI Detection', desc: 'Automatic industry & KPI identification' },
    { icon: LineChart, title: 'Dynamic KPIs', desc: 'Real-time calculations from your data' },
    { icon: Target, title: 'Benchmarking', desc: 'Compare against industry standards' },
    { icon: Zap, title: 'AI Insights', desc: 'Intelligent analysis & recommendations' },
    { icon: BarChart3, title: 'Executive Reports', desc: 'Consulting-grade storylines & exports' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">InsightSynth AI</span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary text-sm"
          >
            Launch Platform
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">AI-Powered Consulting Intelligence</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Data Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                Executive Insights
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Upload your business data and let AI automatically detect KPIs, benchmark against industry standards, and generate consulting-grade executive storylines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary text-base px-8 py-3"
              >
                Start Analysis
              </button>
              <button className="btn-secondary text-base px-8 py-3">
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="card-enterprise p-6 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-24 text-center"
          >
            <p className="text-sm text-gray-400 mb-4">Supported Industries</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['FMCG', 'Healthcare', 'Banking & Finance', 'Retail & E-commerce', 'Manufacturing'].map((ind) => (
                <span key={ind} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-600 font-medium">
                  {ind}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">InsightSynth AI - Enterprise Consulting Intelligence Platform</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Upload, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function EngagementsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl font-bold text-white">Engagements</h1>
        </div>
        <p className="text-slate-400 text-sm">Track and manage your active analytical engagements.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-10 border-dashed border-2 border-slate-700 flex flex-col items-center text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-4">
          <Briefcase className="w-7 h-7 text-indigo-400" />
        </div>
        <h2 className="text-base font-bold text-white mb-2">No engagements yet</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Upload a dataset to start an engagement. All analysis, KPIs, and insights are derived
          strictly from the data you provide.
        </p>
        <Link href="/dashboard/upload">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
            <Upload className="w-4 h-4" />
            Upload Dataset
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

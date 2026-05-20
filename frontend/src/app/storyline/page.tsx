'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import StorylineView from '@/components/storyline/StorylineView';
import { BookOpen } from 'lucide-react';

export default function StorylinePage() {
  const { storyline, detectedIndustry } = useStore();

  return (
    <div className="flex h-screen bg-enterprise-light">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-2xl font-bold text-gray-900">Executive Storyline</h1>
              <p className="text-sm text-gray-500 mt-1">
                AI-generated consulting narrative based on your data analysis
              </p>
            </motion.div>

            {storyline ? (
              <StorylineView storyline={storyline} industry={detectedIndustry} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-enterprise p-12 text-center"
              >
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload dataset to generate executive storyline.</p>
              </motion.div>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

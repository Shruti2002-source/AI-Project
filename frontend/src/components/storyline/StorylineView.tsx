'use client';

import { motion } from 'framer-motion';
import { ExecutiveStoryline, Industry } from '@/types';
import { FileText, BarChart3, Lightbulb, Search, TrendingDown, CheckSquare, ArrowRight } from 'lucide-react';

interface StorylineViewProps {
  storyline: ExecutiveStoryline;
  industry: Industry | null;
}

const sections = [
  { key: 'executiveSummary', title: 'Executive Summary', icon: FileText },
  { key: 'currentPerformance', title: 'Current Performance', icon: BarChart3 },
  { key: 'keyInsight', title: 'Key Insight', icon: Lightbulb },
  { key: 'rootCause', title: 'Root Cause Analysis', icon: Search },
  { key: 'businessImpact', title: 'Business Impact', icon: TrendingDown },
  { key: 'recommendation', title: 'Recommendation', icon: CheckSquare },
] as const;

export default function StorylineView({ storyline, industry }: StorylineViewProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-enterprise p-6 border-l-4 border-l-primary-500"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
            {industry} Consulting Report
          </span>
        </div>
        <h2 className="font-display text-xl font-bold text-gray-900">Executive Consulting Storyline</h2>
        <p className="text-sm text-gray-500 mt-1">AI-generated narrative based on quantitative analysis</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            const content = storyline[section.key as keyof ExecutiveStoryline];
            if (!content) return null;
            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1 w-11 h-11 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center z-10">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="card-enterprise p-5">
                  <h3 className="font-display font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{content as string}</p>
                </div>
              </motion.div>
            );
          })}

          {storyline.nextSteps && storyline.nextSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sections.length * 0.1 }}
              className="relative pl-12"
            >
              <div className="absolute left-0 top-1 w-11 h-11 rounded-full bg-white border-2 border-primary-300 flex items-center justify-center z-10">
                <ArrowRight className="w-5 h-5 text-primary-500" />
              </div>
              <div className="card-enterprise p-5 border-primary-100">
                <h3 className="font-display font-semibold text-gray-900 mb-3">Next Steps</h3>
                <ol className="space-y-2">
                  {storyline.nextSteps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 font-medium flex items-center justify-center text-xs">
                        {j + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

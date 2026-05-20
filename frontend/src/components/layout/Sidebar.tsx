'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  BookOpen,
  Download,
  Database,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { NavItem, AnalysisStep } from '@/types';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', route: '/dashboard' },
  { id: 'benchmarks', label: 'Benchmarks', icon: 'BarChart3', route: '/benchmarks' },
  { id: 'insights', label: 'Insights', icon: 'Lightbulb', route: '/insights' },
  { id: 'storyline', label: 'Storyline', icon: 'BookOpen', route: '/storyline' },
  { id: 'export', label: 'Export', icon: 'Download', route: '/export' },
  { id: 'sources', label: 'Benchmark Sources', icon: 'Database', route: '/sources' },
];

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  BookOpen,
  Download,
  Database,
};

const analysisSteps: AnalysisStep[] = [
  { id: 'upload', label: 'Data Upload', status: 'completed' },
  { id: 'parse', label: 'Schema Detection', status: 'completed' },
  { id: 'benchmark', label: 'Benchmark Matching', status: 'active' },
  { id: 'insights', label: 'Insight Generation', status: 'pending' },
  { id: 'storyline', label: 'Storyline Build', status: 'pending' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { analysisProgress } = useStore();

  const steps = analysisProgress?.steps || analysisSteps;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen bg-white border-r border-gray-100 shadow-sm fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">IS</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                InsightSynth AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">IS</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = activeRoute === item.route;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-orange-500' : ''} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Analysis Progress */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-4 border-t border-gray-100"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Analysis Progress
          </p>
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                {step.status === 'completed' && (
                  <CheckCircle2 size={14} className="text-green-500" />
                )}
                {step.status === 'active' && (
                  <Loader2 size={14} className="text-orange-500 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Circle size={14} className="text-gray-300" />
                )}
                <span
                  className={`text-xs ${
                    step.status === 'active'
                      ? 'text-orange-600 font-medium'
                      : step.status === 'completed'
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;

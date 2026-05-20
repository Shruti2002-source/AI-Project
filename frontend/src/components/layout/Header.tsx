'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  ChevronRight,
  Activity,
  Bell,
  Search,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  onMenuToggle: () => void;
}

type AnalysisStatus = 'idle' | 'processing' | 'completed' | 'error';

const statusConfig: Record<AnalysisStatus, { label: string; color: string; pulse: boolean }> = {
  idle: { label: 'Ready', color: 'bg-gray-400', pulse: false },
  processing: { label: 'Analyzing...', color: 'bg-orange-500', pulse: true },
  completed: { label: 'Complete', color: 'bg-green-500', pulse: false },
  error: { label: 'Error', color: 'bg-red-500', pulse: false },
};

export const Header: React.FC<HeaderProps> = ({ breadcrumbs, onMenuToggle }) => {
  const { analysisStatus } = useStore();

  const status = statusConfig[analysisStatus as AnalysisStatus] || statusConfig.idle;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left: Menu toggle + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>

          <nav className="hidden sm:flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight size={14} className="text-gray-300 mx-1" />
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right: Status + Actions */}
        <div className="flex items-center gap-3">
          {/* Analysis Status Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100"
          >
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              {status.pulse && (
                <div className={`absolute inset-0 w-2 h-2 rounded-full ${status.color} animate-ping`} />
              )}
            </div>
            <span className="text-xs font-medium text-gray-600">{status.label}</span>
            <Activity size={12} className="text-gray-400" />
          </motion.div>

          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  BookOpen,
  Download,
} from 'lucide-react';

interface MobileNavProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  route: string;
}

const mobileNavItems: MobileNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3, route: '/benchmarks' },
  { id: 'insights', label: 'Insights', icon: Lightbulb, route: '/insights' },
  { id: 'storyline', label: 'Storyline', icon: BookOpen, route: '/storyline' },
  { id: 'export', label: 'Export', icon: Download, route: '/export' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ activeRoute, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.route;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.route)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-orange-50 rounded-xl border border-orange-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 ${
                  isActive ? 'text-orange-500' : 'text-gray-400'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium ${
                  isActive ? 'text-orange-600' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;

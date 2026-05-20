'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-card-dark' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 shadow-glow-sm group-hover:shadow-glow-md transition-all">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-base">InsightSynth</span>
              <span className="text-indigo-400 font-bold text-base"> AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="nav-link">Features</Link>
            <Link href="/#industries" className="nav-link">Industries</Link>
            <Link href="/#benchmarks" className="nav-link">Benchmarks</Link>
            <Link href="/#pricing" className="nav-link">Pricing</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="gradient" size="sm" className="shadow-glow-sm">
                Launch Platform
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60 px-4 py-4 space-y-3"
        >
          <Link href="/#features" className="block nav-link py-2">Features</Link>
          <Link href="/#industries" className="block nav-link py-2">Industries</Link>
          <Link href="/#benchmarks" className="block nav-link py-2">Benchmarks</Link>
          <div className="pt-2 flex gap-3">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="gradient" className="w-full">Get Started</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Shield, BarChart3, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEMO_USERS = [
  { role: 'Consultant', email: 'consultant@insightsynth.ai', desc: 'Full platform access' },
  { role: 'Manager', email: 'manager@insightsynth.ai', desc: 'Team view + approvals' },
  { role: 'Partner', email: 'partner@insightsynth.ai', desc: 'Executive dashboard' },
  { role: 'Client', email: 'client@insightsynth.ai', desc: 'Read-only view' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('consultant@insightsynth.ai');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="floating-orb w-96 h-96 bg-indigo-600 top-20 left-20" />
        <div className="floating-orb w-64 h-64 bg-cyan-600 bottom-20 right-20 animate-float-delayed" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-lg">InsightSynth</span>
            <span className="text-indigo-400 font-bold text-lg"> AI</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
              The consulting platform<br />built for<span className="text-gradient"> AI-first</span> teams
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Transform fragmented client data into executive-ready insights in minutes, not weeks.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: BarChart3, text: '140+ KPIs across 5 industries' },
              { icon: Shield, text: 'Real-time benchmark intelligence' },
              { icon: Brain, text: 'AI-generated consulting narratives' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="relative glass rounded-2xl p-5">
          <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
            "InsightSynth has transformed how we deliver client engagements. What used to take 2 weeks now takes 2 hours."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-semibold text-indigo-400">SR</div>
            <div className="text-xs text-slate-400">Sarah R. — Principal, McKinsey & Company</div>
          </div>
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">InsightSynth AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your consulting workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@company.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full gap-2">
              {!loading && <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500">or try a demo role</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Demo roles */}
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => { setEmail(u.email); setPassword('demo1234'); }}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  email === u.email
                    ? 'border-indigo-500/50 bg-indigo-600/10 text-white'
                    : 'border-slate-700/50 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold mb-0.5">{u.role}</div>
                <div className="text-[10px] opacity-70">{u.desc}</div>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
              Start free trial
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

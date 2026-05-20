'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, TrendingUp, Lightbulb, AlertCircle, DollarSign, Target, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Storyline } from '@/types'

interface Props {
  storyline: Storyline
  industry: string
}

const SECTIONS = [
  { key: 'executive_summary', label: 'Executive Summary', icon: FileText, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5' },
  { key: 'current_performance', label: 'Current Performance', icon: TrendingUp, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/5' },
  { key: 'key_insight', label: 'Key Insight', icon: Lightbulb, color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5' },
  { key: 'root_cause', label: 'Root Cause Analysis', icon: AlertCircle, color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/5' },
  { key: 'business_impact', label: 'Business Impact', icon: DollarSign, color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/5' },
  { key: 'recommendation', label: 'Strategic Recommendations', icon: Target, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  { key: 'next_steps', label: 'Next Steps', icon: ArrowRight, color: 'text-slate-300', border: 'border-slate-600', bg: 'bg-slate-800/50' },
] as const

export default function ExecutiveStoryline({ storyline, industry }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['executive_summary', 'recommendation']))

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {SECTIONS.map((section, i) => {
        const Icon = section.icon
        const content = storyline[section.key as keyof Storyline]
        if (!content) return null
        const isOpen = expanded.has(section.key)

        return (
          <motion.div key={section.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={['border rounded-xl overflow-hidden', section.border, section.bg].join(' ')}>
            <button onClick={() => toggle(section.key)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className={['h-4 w-4', section.color].join(' ')} />
                <span className="text-slate-200 font-medium text-sm">{section.label}</span>
              </div>
              {isOpen
                ? <ChevronUp className="h-4 w-4 text-slate-500" />
                : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>

            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 border-t border-slate-700/50">
                <div className="pt-3 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

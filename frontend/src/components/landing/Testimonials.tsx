'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Richardson',
    title: 'Principal',
    firm: 'McKinsey & Company',
    avatar: 'SR',
    avatarColor: 'from-indigo-600 to-blue-600',
    industry: 'FMCG',
    quote:
      '"InsightSynth transformed a 3-week benchmarking engagement into a 2-day sprint. The AI-generated storyline was client-ready with minimal editing — our partner literally said it read like a McKinsey deck."',
    metric: '15x faster',
    metricLabel: 'report generation',
    rating: 5,
  },
  {
    id: 2,
    name: 'David Nwachukwu',
    title: 'Manager, Strategy & Operations',
    firm: 'Deloitte Consulting',
    avatar: 'DN',
    avatarColor: 'from-cyan-600 to-teal-600',
    industry: 'Banking',
    quote:
      '"The benchmark comparison module alone saves our healthcare practice 80+ hours per engagement. I can now walk into a C-suite meeting with data-backed insights in the same week we start the project."',
    metric: '80+ hrs',
    metricLabel: 'saved per engagement',
    rating: 5,
  },
  {
    id: 3,
    name: 'Priya Mehta',
    title: 'Senior Associate',
    firm: 'Boston Consulting Group',
    avatar: 'PM',
    avatarColor: 'from-purple-600 to-pink-600',
    industry: 'Healthcare',
    quote:
      '"The AI Insight generation is genuinely impressive. It surfaced a supply chain anomaly in our client\'s data that our team had missed in the initial analysis. It\'s like having a senior analyst who never sleeps."',
    metric: '3 critical',
    metricLabel: 'insights surfaced automatically',
    rating: 5,
  },
  {
    id: 4,
    name: 'James Okonkwo',
    title: 'Director, Digital Transformation',
    firm: 'PwC Advisory',
    avatar: 'JO',
    avatarColor: 'from-amber-600 to-orange-600',
    industry: 'Manufacturing',
    quote:
      '"We piloted InsightSynth across 4 manufacturing engagements simultaneously. The OEE benchmarking accuracy was remarkably close to our manually-compiled database, built over 10 years. Genuinely impressive."',
    metric: '4 engagements',
    metricLabel: 'running in parallel',
    rating: 5,
  },
  {
    id: 5,
    name: 'Aisha Bernstein',
    title: 'Partner',
    firm: 'Bain & Company',
    avatar: 'AB',
    avatarColor: 'from-emerald-600 to-green-600',
    industry: 'Retail',
    quote:
      '"The export center alone justifies the platform cost. A fully formatted 24-slide PPTX in seconds? Our design team used to spend 2 days on slide production alone. Now they focus on storytelling, not formatting."',
    metric: '2 days → 30s',
    metricLabel: 'PowerPoint generation',
    rating: 5,
  },
  {
    id: 6,
    name: 'Thomas Andersson',
    title: 'Principal, Operations Practice',
    firm: 'Accenture Strategy',
    avatar: 'TA',
    avatarColor: 'from-red-600 to-rose-600',
    industry: 'FMCG',
    quote:
      '"InsightSynth is the first tool that actually speaks the language of consulting. The storyline generator doesn\'t just output data — it frames narratives the way partners think. It\'s changed how our team delivers."',
    metric: '94%',
    metricLabel: 'client satisfaction rate',
    rating: 5,
  },
];

const FIRM_LOGOS = ['McKinsey', 'Deloitte', 'PwC', 'BCG', 'Bain', 'Accenture', 'KPMG', 'EY'];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: typeof TESTIMONIALS[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group glass-card rounded-2xl p-6 card-hover flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-5 bg-indigo-400 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Quote icon */}
      <Quote className="w-6 h-6 text-indigo-400/40 flex-shrink-0" />

      {/* Rating */}
      <StarRating count={testimonial.rating} />

      {/* Quote */}
      <p className="text-sm text-slate-300 leading-relaxed flex-1 italic">{testimonial.quote}</p>

      {/* Metric pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 w-fit">
        <span className="text-sm font-bold text-indigo-300">{testimonial.metric}</span>
        <span className="text-xs text-slate-400">{testimonial.metricLabel}</span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-800/60">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${testimonial.avatarColor} flex-shrink-0 shadow-sm`}
        >
          {testimonial.avatar}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{testimonial.name}</div>
          <div className="text-xs text-slate-500 truncate">
            {testimonial.title} · {testimonial.firm}
          </div>
        </div>
        <span
          className="ml-auto text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: 'rgba(165,180,252,0.8)',
          }}
        >
          {testimonial.industry}
        </span>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Trusted by 2,400+ Consultants
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            What top consultants{' '}
            <span className="text-gradient">say about us</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From Tier-1 strategy firms to boutique advisory practices — InsightSynth AI is how
            the best consultants deliver faster.
          </p>
        </motion.div>

        {/* Overall rating banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-center gap-6 mb-12 flex-wrap"
        >
          {[
            { label: 'Overall Rating', value: '4.9/5', stars: 5 },
            { label: 'Time Saved / Engagement', value: '80+ hrs', stars: null },
            { label: 'Net Promoter Score', value: '72', stars: null },
            { label: 'Client Satisfaction', value: '97%', stars: null },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
              {stat.stars && <StarRating count={stat.stars} />}
              <span className="text-lg font-bold text-white">{stat.value}</span>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>

        {/* Firm logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-slate-500 mb-6">Used by consultants at the world's leading firms</p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
            {FIRM_LOGOS.map((firm) => (
              <div
                key={firm}
                className="text-slate-400 font-bold text-sm sm:text-base tracking-wide hover:text-slate-200 transition-colors cursor-default"
              >
                {firm}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

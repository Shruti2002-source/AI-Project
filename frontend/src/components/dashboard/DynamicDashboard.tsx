'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  BarChart3, TrendingUp, TrendingDown, Activity, Layers, Filter, X,
  ChevronRight, ArrowLeft, Zap, Target, AlertTriangle, CheckCircle,
  Calendar, Hash,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
  Legend,
  PieChart,
  Pie,
} from 'recharts';
import { GroupedKPIResult } from '@/types';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#eab308', '#14b8a6', '#f43f5e'];

// ============================================================================
// ANIMATED NUMBER COUNTER
// ============================================================================

function AnimatedNumber({ value, unit, duration = 1200 }: { value: number; unit: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const end = value;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (end - start) * eased;
      setDisplay(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatValue(display, unit)}</span>;
}

// ============================================================================
// SPARKLINE MINI CHART
// ============================================================================

function Sparkline({ data, color = '#f97316' }: { data: { value: number }[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 80;
  const h = 24;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

// ============================================================================
// KPI SUMMARY CARD (Interactive)
// ============================================================================

function KPISummaryCard({
  result, index, isSelected, onClick, sparkData
}: {
  result: GroupedKPIResult; index: number; isSelected: boolean;
  onClick: () => void; sparkData?: { value: number }[];
}) {
  const trendColor = result.trend === 'up' ? 'text-green-600' : result.trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const borderColor = result.trend === 'up' ? 'border-green-400' : result.trend === 'down' ? 'border-red-400' : 'border-gray-200';
  const TrendIcon = result.trend === 'up' ? TrendingUp : result.trend === 'down' ? TrendingDown : Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl border-2 p-5 shadow-sm cursor-pointer transition-all ${
        isSelected ? 'border-orange-400 shadow-orange-100 shadow-md ring-2 ring-orange-100' : `${borderColor} hover:shadow-md`
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{result.aggregation}</span>
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendIcon size={12} />
          {Math.abs(result.trendValue ?? 0).toFixed(1)}%
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1 truncate">{result.kpiName}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">
          <AnimatedNumber value={result.overallValue} unit={result.unit} />
        </p>
        {sparkData && <Sparkline data={sparkData} color={result.trend === 'down' ? '#ef4444' : '#f97316'} />}
      </div>
    </motion.div>
  );
}

// ============================================================================
// INTERACTIVE BAR CHART
// ============================================================================

function InteractiveBarChart({
  result, onBarClick, activeBar
}: {
  result: GroupedKPIResult; onBarClick: (label: string) => void; activeBar?: string;
}) {
  const chartData = result.groups.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-orange-500" />
        <h3 className="text-sm font-semibold text-gray-800">{result.kpiName} by {result.groupedBy}</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
            formatter={(value: number) => [formatValue(value, result.unit), result.kpiName]}
            cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
            onClick={(data: any) => onBarClick(data.label)}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={activeBar === entry.label ? '#ea580c' : COLORS[i % COLORS.length]}
                opacity={activeBar && activeBar !== entry.label ? 0.4 : 1}
                stroke={activeBar === entry.label ? '#c2410c' : 'transparent'}
                strokeWidth={activeBar === entry.label ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {activeBar && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-orange-600 mt-2 font-medium">
          Filtered to: {activeBar} — click again to clear
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================================================
// INTERACTIVE TREND CHART
// ============================================================================

function InteractiveTrendChart({ result }: { result: GroupedKPIResult }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartData = result.groups;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-orange-500" />
        <h3 className="text-sm font-semibold text-gray-800">{result.kpiName} Trend</h3>
        <span className="text-[10px] text-gray-400 ml-auto">by {result.groupedBy}</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          onMouseMove={(state: any) => {
            if (state?.activeTooltipIndex !== undefined) setHoveredIndex(state.activeTooltipIndex);
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={`gradient-${result.kpiName}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value: number) => [formatValue(value, result.unit), result.kpiName]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            fill={`url(#gradient-${result.kpiName})`}
            strokeWidth={2.5}
            animationDuration={1000}
            animationEasing="ease-out"
            activeDot={{ r: 6, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
            dot={(props: any) => {
              const { cx, cy, index } = props;
              if (index === hoveredIndex) {
                return <circle cx={cx} cy={cy} r={5} fill="#ea580c" stroke="#fff" strokeWidth={2} />;
              }
              return <circle cx={cx} cy={cy} r={0} />;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ============================================================================
// DRILL-DOWN DETAIL PANEL
// ============================================================================

function DrillDownPanel({
  kpiName, dimensionValue, groupedBy, data, onClose
}: {
  kpiName: string; dimensionValue: string; groupedBy: string;
  data: GroupedKPIResult[]; onClose: () => void;
}) {
  const relatedData = data.filter(r => r.kpiName === kpiName && r.groupedBy !== 'Overall' && r.groupedBy !== groupedBy);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-5 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 rounded-md hover:bg-orange-100 transition-colors">
            <ArrowLeft size={16} className="text-orange-600" />
          </button>
          <nav className="flex items-center gap-1 text-sm">
            <span className="text-gray-500">All</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-gray-500">{groupedBy}</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-semibold text-orange-700">{dimensionValue}</span>
          </nav>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-orange-100 transition-colors">
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {relatedData.slice(0, 6).map((r, i) => {
          const matchingGroup = r.groups.find(g => g.label === dimensionValue);
          if (!matchingGroup) return null;
          return (
            <motion.div
              key={`${r.kpiName}-${r.groupedBy}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-lg p-3 border border-orange-100"
            >
              <p className="text-xs text-gray-500">{r.kpiName} ({r.groupedBy})</p>
              <p className="text-lg font-bold text-gray-900">{formatValue(matchingGroup.value, r.unit)}</p>
            </motion.div>
          );
        })}
      </div>

      {relatedData.length === 0 && (
        <p className="text-sm text-gray-500 italic">No additional breakdowns available for this selection.</p>
      )}
    </motion.div>
  );
}

// ============================================================================
// INSIGHTS PANEL (Interactive)
// ============================================================================

function InsightsPanelInteractive({ insights }: { insights: any[] }) {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const types = [...new Set(insights.map(i => i.type))];
  const filtered = typeFilter ? insights.filter(i => i.type === typeFilter) : insights;

  const typeIcon = (type: string) => {
    switch (type) {
      case 'risk': case 'benchmark_gap': return <AlertTriangle size={12} className="text-red-500" />;
      case 'opportunity': case 'positive': return <CheckCircle size={12} className="text-green-500" />;
      default: return <Zap size={12} className="text-blue-500" />;
    }
  };

  return (
    <motion.div layout className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={16} className="text-orange-500" />
          Key Insights ({filtered.length})
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setTypeFilter(null)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              !typeFilter ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >All</button>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-all capitalize ${
                typeFilter === t ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {filtered.slice(0, 6).map((insight) => (
            <motion.div
              key={insight.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onClick={() => setExpanded(expanded === insight.id ? null : insight.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors border-l-[3px] ${
                insight.type === 'risk' || insight.type === 'benchmark_gap' ? 'bg-red-50 border-l-red-400 hover:bg-red-100' :
                insight.type === 'opportunity' || insight.type === 'positive' ? 'bg-green-50 border-l-green-400 hover:bg-green-100' :
                'bg-blue-50 border-l-blue-400 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-start gap-2">
                {typeIcon(insight.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{insight.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{insight.description}</p>
                  <AnimatePresence>
                    {expanded === insight.id && insight.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t border-gray-200"
                      >
                        <p className="text-xs font-medium text-orange-700">Recommendation:</p>
                        <p className="text-xs text-gray-600 mt-0.5">{insight.recommendation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function DynamicDashboard() {
  const { kpiResults, selectedIndustry, file, insights, benchmarks, selectedDimensions, selectedDateColumns } = useStore();

  // Filter state
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string | null>(null);
  const [selectedDimFilter, setSelectedDimFilter] = useState<string | null>(null);
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'above' | 'below'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Drill-down state
  const [drillDown, setDrillDown] = useState<{ kpi: string; value: string; groupedBy: string } | null>(null);

  const overallResults = kpiResults.filter(r => r.groupedBy === 'Overall');
  const groupedResults = kpiResults.filter(r => r.groupedBy !== 'Overall');

  // Apply performance filter
  const filteredOverall = overallResults.filter(r => {
    if (performanceFilter === 'all') return true;
    const bench = benchmarks.find(b => b.kpiName === r.kpiName);
    if (!bench) return true;
    return performanceFilter === 'above' ? bench.status === 'above' : bench.status === 'below';
  });

  const kpiNames = [...new Set(filteredOverall.map(r => r.kpiName))];

  // Apply KPI filter to grouped results
  let filteredGrouped = selectedKPI
    ? groupedResults.filter(r => r.kpiName === selectedKPI)
    : groupedResults;

  // Apply dimension filter
  if (selectedDimFilter) {
    filteredGrouped = filteredGrouped.filter(r => r.groupedBy === selectedDimFilter);
  }

  const dateGrouped = filteredGrouped.filter(r => selectedDateColumns.includes(r.groupedBy));
  const dimGrouped = filteredGrouped.filter(r => selectedDimensions.includes(r.groupedBy));

  // Get sparkline data for KPI cards
  const getSparkData = (kpiName: string) => {
    const trendResult = groupedResults.find(r => r.kpiName === kpiName && selectedDateColumns.includes(r.groupedBy));
    return trendResult?.groups;
  };

  // Available dimensions for filter
  const availableDimensions = [...new Set(groupedResults.map(r => r.groupedBy))];
  const timeDimensions = availableDimensions.filter(d => selectedDateColumns.includes(d));
  const catDimensions = availableDimensions.filter(d => selectedDimensions.includes(d));

  // Bar click handler
  const handleBarClick = (label: string, kpiName: string, groupedBy: string) => {
    if (drillDown?.value === label && drillDown?.kpi === kpiName) {
      setDrillDown(null);
    } else {
      setDrillDown({ kpi: kpiName, value: label, groupedBy });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedIndustry} Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {file?.name} &middot; {filteredOverall.length} KPIs &middot; {groupedResults.length} breakdowns
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showFilters ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300'
          }`}
        >
          <Filter size={14} />
          Filters
          {(performanceFilter !== 'all' || selectedDimFilter || selectedTimePeriod) && (
            <span className="w-2 h-2 rounded-full bg-orange-300"></span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Performance Filter */}
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Performance</label>
                <div className="flex gap-1">
                  {(['all', 'above', 'below'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setPerformanceFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        performanceFilter === f ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >{f === 'all' ? 'All' : f === 'above' ? 'Above Benchmark' : 'Below Benchmark'}</button>
                  ))}
                </div>
              </div>

              {/* Dimension Filter */}
              {catDimensions.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Dimension</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setSelectedDimFilter(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        !selectedDimFilter ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >All</button>
                    {catDimensions.map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDimFilter(selectedDimFilter === d ? null : d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedDimFilter === d ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >{d}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Period Filter */}
              {timeDimensions.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Time Dimension</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setSelectedTimePeriod(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        !selectedTimePeriod ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >All</button>
                    {timeDimensions.map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedTimePeriod(selectedTimePeriod === d ? null : d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedTimePeriod === d ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >{d}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedKPI(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            !selectedKPI ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
          }`}
        >
          All KPIs
        </button>
        {kpiNames.map(name => (
          <button
            key={name}
            onClick={() => setSelectedKPI(selectedKPI === name ? null : name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedKPI === name ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* KPI Summary Cards */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOverall.map((result, i) => (
            <KPISummaryCard
              key={result.kpiName}
              result={result}
              index={i}
              isSelected={selectedKPI === result.kpiName}
              onClick={() => setSelectedKPI(selectedKPI === result.kpiName ? null : result.kpiName)}
              sparkData={getSparkData(result.kpiName)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Drill-Down Panel */}
      <AnimatePresence>
        {drillDown && (
          <DrillDownPanel
            kpiName={drillDown.kpi}
            dimensionValue={drillDown.value}
            groupedBy={drillDown.groupedBy}
            data={groupedResults}
            onClose={() => setDrillDown(null)}
          />
        )}
      </AnimatePresence>

      {/* Time-based Charts */}
      {dateGrouped.length > 0 && (
        <motion.div layout>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" />
            Trends Over Time
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {(selectedTimePeriod ? dateGrouped.filter(r => r.groupedBy === selectedTimePeriod) : dateGrouped)
                .slice(0, 6)
                .map((result) => (
                  <InteractiveTrendChart key={`${result.kpiName}-${result.groupedBy}`} result={result} />
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Dimension-based Charts */}
      {dimGrouped.length > 0 && (
        <motion.div layout>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Layers size={16} className="text-orange-500" />
            Breakdown by Dimension
            {drillDown && <span className="text-xs text-orange-500 font-normal ml-2">(Click bars to drill down)</span>}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {dimGrouped.slice(0, 6).map((result) => (
                <InteractiveBarChart
                  key={`${result.kpiName}-${result.groupedBy}`}
                  result={result}
                  onBarClick={(label) => handleBarClick(label, result.kpiName, result.groupedBy)}
                  activeBar={drillDown?.kpi === result.kpiName ? drillDown.value : undefined}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Interactive Insights */}
      {insights.length > 0 && (
        <InsightsPanelInteractive insights={insights} />
      )}
    </div>
  );
}

// ============================================================================
// UTILITY
// ============================================================================

function formatValue(value: number, unit: string): string {
  const prefix = unit === 'USD' || unit === '$' ? '$' : unit === 'INR' || unit === '₹' ? '₹' : '';
  const suffix = unit === '%' ? '%' : unit === 'x' ? 'x' : unit === 'days' ? ' days' : '';

  if (prefix) {
    if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(1)}K`;
    return `${prefix}${value.toFixed(0)}`;
  }

  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K${suffix}`;
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}${suffix}`;
}

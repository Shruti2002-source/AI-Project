'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Search,
  CheckSquare,
  Square,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useStore } from '@/store/useStore';
import { DatasetSchema, DatasetColumn, ClassifiedColumn, KPIConfig, PRESET_INDUSTRIES } from '@/types';
import { classifyColumns, getKPIColumns, getDimensionColumns, getDateColumns } from '@/services/columnClassifier';
import { calculateAllKPIs } from '@/services/calculationEngine';
import { compareWithBenchmarks } from '@/services/benchmarkEngine';
import { generateGenericInsights } from '@/services/genericInsightEngine';
import { generateGenericStoryline } from '@/services/genericStorylineEngine';

type WizardStep = 'upload' | 'industry' | 'classify' | 'analyzing' | 'complete';

export default function UploadEngine() {
  const [wizardStep, setWizardStep] = useState<WizardStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, unknown>[]>([]);
  const [schema, setSchema] = useState<DatasetSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [industryInput, setIndustryInput] = useState('');
  const [kpiSearch, setKpiSearch] = useState('');
  const [analysisStep, setAnalysisStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const store = useStore();

  const detectColumnType = (values: unknown[]): 'numeric' | 'categorical' | 'date' | 'text' => {
    const sample = values.filter((v) => v !== null && v !== undefined && v !== '').slice(0, 20);
    if (sample.length === 0) return 'text';
    const numericCount = sample.filter((v) => !isNaN(Number(v))).length;
    if (numericCount / sample.length > 0.7) return 'numeric';
    const datePattern = /^\d{4}[-/]\d{2}[-/]\d{2}|^\d{2}[-/]\d{2}[-/]\d{4}|^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
    const dateCount = sample.filter((v) => datePattern.test(String(v))).length;
    if (dateCount / sample.length > 0.5) return 'date';
    const uniqueRatio = new Set(sample.map(String)).size / sample.length;
    if (uniqueRatio < 0.3) return 'categorical';
    return 'categorical';
  };

  const parseFile = async (file: File): Promise<{ data: Record<string, unknown>[]; schema: DatasetSchema }> => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv' || ext === 'txt') {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as Record<string, unknown>[];
            const headers = results.meta.fields || [];
            const columns: DatasetColumn[] = headers.map((header) => {
              const values = data.map((row) => row[header]);
              const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
              return {
                name: header,
                type: detectColumnType(values),
                sampleValues: nonNull.slice(0, 5).map((v) => (typeof v === 'number' ? v : String(v))),
                nullCount: values.length - nonNull.length,
                uniqueCount: new Set(nonNull.map(String)).size,
              };
            });
            resolve({ data, schema: { columns, rowCount: data.length, fileName: file.name } });
          },
          error: (err) => reject(err),
        });
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetNames = workbook.SheetNames;

      // Read all sheets and merge data
      const allData: Record<string, unknown>[] = [];
      const sheetsInfo: { name: string; rows: number; cols: number }[] = [];

      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) continue;
        const sheetData = XLSX.utils.sheet_to_json(sheet, { defval: null }) as Record<string, unknown>[];
        if (sheetData.length === 0) continue;

        sheetsInfo.push({ name: sheetName, rows: sheetData.length, cols: Object.keys(sheetData[0] || {}).length });

        // Tag rows with source sheet for multi-sheet traceability
        for (const row of sheetData) {
          allData.push({ ...row, _sheet: sheetName });
        }
      }

      if (allData.length === 0) throw new Error('No data found in any sheet');

      // Collect all unique headers across all sheets (exclude internal _sheet tag)
      const headerSet = new Set<string>();
      for (const row of allData) {
        for (const key of Object.keys(row)) {
          if (key !== '_sheet') headerSet.add(key);
        }
      }
      const headers = Array.from(headerSet);

      const columns: DatasetColumn[] = headers.map((header) => {
        const values = allData.map((row) => row[header]);
        const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
        return {
          name: header,
          type: detectColumnType(values),
          sampleValues: nonNull.slice(0, 5).map((v) => (typeof v === 'number' ? v : String(v))),
          nullCount: values.length - nonNull.length,
          uniqueCount: new Set(nonNull.map(String)).size,
        };
      });

      const sheetSummary = sheetsInfo.length > 1
        ? ` (${sheetsInfo.length} sheets: ${sheetsInfo.map(s => `${s.name} [${s.rows} rows]`).join(', ')})`
        : '';

      return { data: allData, schema: { columns, rowCount: allData.length, fileName: file.name + sheetSummary } };
    }
    throw new Error('Unsupported file type');
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setProgress(0);

    for (let i = 0; i <= 100; i += 25) {
      await new Promise((r) => setTimeout(r, 50));
      setProgress(i);
    }

    try {
      const { data, schema: fileSchema } = await parseFile(file);
      setSchema(fileSchema);
      setParsedData(data);
      store.setFile({ name: file.name, size: file.size, type: file.type, data, columns: fileSchema.columns.map(c => c.name) });
      store.setSchema(fileSchema);

      // Auto-classify columns
      const classified = classifyColumns(fileSchema);
      store.setClassifiedColumns(classified);

      setWizardStep('industry');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleIndustrySelect = (industry: string) => {
    setIndustryInput(industry);
    store.setSelectedIndustry(industry);
    setWizardStep('classify');
  };

  const handleRunAnalysis = async () => {
    setWizardStep('analyzing');
    store.setIsAnalyzing(true);

    const prioritizedKPIs = store.classifiedColumns
      .filter(c => c.role === 'kpi' && c.isPrioritized)
      .map(c => ({
        columnName: c.name,
        displayName: c.name,
        aggregation: c.aggregation || 'sum',
        unit: c.unit || '',
      } as KPIConfig));

    const dimensions = store.classifiedColumns.filter(c => c.role === 'dimension').map(c => c.name);
    const dateColumns = store.classifiedColumns.filter(c => c.role === 'date').map(c => c.name);

    // Detect sheets in data
    const sheets = [...new Set(parsedData.map(r => r._sheet as string).filter(Boolean))];
    const isMultiSheet = sheets.length > 1;

    // Add _sheet as dimension if multi-sheet
    const finalDimensions = isMultiSheet && !dimensions.includes('_sheet')
      ? ['_sheet', ...dimensions]
      : dimensions;

    store.setSelectedKPIs(prioritizedKPIs);
    store.setSelectedDimensions(finalDimensions);
    store.setSelectedDateColumns(dateColumns);

    // Step 1: Calculate KPIs (overall across all data)
    setAnalysisStep('Calculating KPIs...');
    store.setCurrentStep('calculating');
    await new Promise(r => setTimeout(r, 200));
    const kpiResults = calculateAllKPIs(parsedData, prioritizedKPIs, finalDimensions, dateColumns);

    // Step 1b: If multi-sheet, also calculate per-sheet KPIs and add as grouped results
    if (isMultiSheet) {
      setAnalysisStep(`Analyzing ${sheets.length} sheets individually...`);
      await new Promise(r => setTimeout(r, 200));

      for (const sheet of sheets) {
        const sheetData = parsedData.filter(r => r._sheet === sheet);
        const sheetKPIs = calculateAllKPIs(sheetData, prioritizedKPIs, dimensions.filter(d => d !== '_sheet'), dateColumns);
        // Add sheet-level overall results as grouped-by-sheet entries
        for (const result of sheetKPIs.filter(r => r.groupedBy === 'Overall')) {
          kpiResults.push({
            ...result,
            groupedBy: '_sheet',
            groups: [{ label: sheet, value: result.overallValue }],
          });
        }
      }

      // Build consolidated _sheet breakdown for each KPI
      const kpiNames = [...new Set(prioritizedKPIs.map(k => k.columnName))];
      for (const kpiName of kpiNames) {
        const sheetGroups = sheets.map(sheet => {
          const sheetData = parsedData.filter(r => r._sheet === sheet);
          const config = prioritizedKPIs.find(k => k.columnName === kpiName);
          if (!config) return { label: sheet, value: 0 };
          const values = sheetData.map(r => Number(r[kpiName])).filter(v => !isNaN(v));
          if (values.length === 0) return { label: sheet, value: 0 };
          const agg = config.aggregation;
          let val = 0;
          if (agg === 'sum' || agg === 'count') val = values.reduce((a, b) => a + b, 0);
          else if (agg === 'average') val = values.reduce((a, b) => a + b, 0) / values.length;
          else if (agg === 'min') val = Math.min(...values);
          else if (agg === 'max') val = Math.max(...values);
          else val = values.reduce((a, b) => a + b, 0);
          return { label: sheet, value: val };
        });

        kpiResults.push({
          kpiName: kpiName,
          aggregation: prioritizedKPIs.find(k => k.columnName === kpiName)?.aggregation || 'sum',
          unit: prioritizedKPIs.find(k => k.columnName === kpiName)?.unit || '',
          overallValue: sheetGroups.reduce((a, g) => a + g.value, 0) / (prioritizedKPIs.find(k => k.columnName === kpiName)?.aggregation === 'average' ? sheetGroups.length : 1),
          groupedBy: '_sheet',
          groups: sheetGroups,
        });
      }
    }

    store.setKpiResults(kpiResults);

    // Step 2: Benchmark comparison
    setAnalysisStep('Comparing with benchmarks...');
    store.setCurrentStep('benchmarking');
    await new Promise(r => setTimeout(r, 200));
    const kpiValues = kpiResults
      .filter(r => r.groupedBy === 'Overall')
      .map(r => ({
        name: r.kpiName,
        value: r.overallValue,
        unit: r.unit,
        category: 'General',
        trend: r.trend ?? 'stable' as const,
        trendValue: r.trendValue ?? 0,
        formula: r.aggregation,
      }));
    const benchmarks = compareWithBenchmarks(kpiValues, store.selectedIndustry as any ?? 'FMCG');
    store.setBenchmarks(benchmarks);

    // Step 3: Generate insights (overall + per-sheet)
    setAnalysisStep('Generating insights...');
    store.setCurrentStep('generating-insights');
    await new Promise(r => setTimeout(r, 200));
    const insights = generateGenericInsights(kpiResults, benchmarks, store.selectedIndustry || 'General');

    // Step 3b: Generate per-sheet insights for multi-sheet files
    if (isMultiSheet) {
      setAnalysisStep('Generating sheet-wise insights...');
      await new Promise(r => setTimeout(r, 200));

      for (const sheet of sheets) {
        const sheetData = parsedData.filter(r => r._sheet === sheet);
        const sheetKPIs = calculateAllKPIs(sheetData, prioritizedKPIs, dimensions.filter(d => d !== '_sheet'), dateColumns);
        const sheetKPIValues = sheetKPIs
          .filter(r => r.groupedBy === 'Overall')
          .map(r => ({
            name: r.kpiName,
            value: r.overallValue,
            unit: r.unit,
            category: 'General',
            trend: r.trend ?? 'stable' as const,
            trendValue: r.trendValue ?? 0,
            formula: r.aggregation,
          }));
        const sheetBenchmarks = compareWithBenchmarks(sheetKPIValues, store.selectedIndustry as any ?? 'FMCG');
        const sheetInsights = generateGenericInsights(sheetKPIs, sheetBenchmarks, store.selectedIndustry || 'General');

        // Tag each insight with its source sheet and prefix title
        for (const insight of sheetInsights.slice(0, 5)) {
          insights.push({
            ...insight,
            id: `${insight.id}-${sheet}`,
            title: `[${sheet}] ${insight.title}`,
            description: `(Sheet: ${sheet}) ${insight.description}`,
          });
        }
      }
    }

    store.setInsights(insights);

    // Step 4: Generate storyline
    setAnalysisStep('Building executive storyline...');
    store.setCurrentStep('generating-storyline');
    await new Promise(r => setTimeout(r, 200));
    const storyline = generateGenericStoryline(kpiResults, benchmarks, insights, store.selectedIndustry || 'General');
    store.setStoryline(storyline);

    store.setCurrentStep('complete');
    store.setIsAnalyzing(false);
    setWizardStep('complete');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileUpload(droppedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);

  const toggleKPIPriority = (colName: string) => {
    store.updateColumnRole(colName, {
      isPrioritized: !store.classifiedColumns.find(c => c.name === colName)?.isPrioritized,
    });
  };

  const selectAllKPIs = () => {
    const kpiCols = store.classifiedColumns.filter(c => c.role === 'kpi');
    kpiCols.forEach(c => store.updateColumnRole(c.name, { isPrioritized: true }));
  };

  const deselectAllKPIs = () => {
    const kpiCols = store.classifiedColumns.filter(c => c.role === 'kpi');
    kpiCols.forEach(c => store.updateColumnRole(c.name, { isPrioritized: false }));
  };

  const changeColumnRole = (colName: string, role: ClassifiedColumn['role']) => {
    const updates: Partial<ClassifiedColumn> = { role };
    if (role === 'kpi') {
      updates.aggregation = 'sum';
      updates.unit = '';
      updates.isPrioritized = false;
    }
    store.updateColumnRole(colName, updates);
  };

  const kpiColumns = store.classifiedColumns.filter(c => c.role === 'kpi');
  const dimColumns = store.classifiedColumns.filter(c => c.role === 'dimension');
  const dateColumnsClassified = store.classifiedColumns.filter(c => c.role === 'date');
  const filteredKPIs = kpiSearch
    ? kpiColumns.filter(c => c.name.toLowerCase().includes(kpiSearch.toLowerCase()))
    : kpiColumns;
  const prioritizedCount = kpiColumns.filter(c => c.isPrioritized).length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {/* STEP 1: FILE UPLOAD */}
        {wizardStep === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center transition-all hover:border-orange-300 hover:bg-orange-50/30"
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.txt" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} className="hidden" />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <Upload size={28} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Drop your data file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse. Supports CSV, XLSX, XLS, TXT</p>
                </div>
                <div className="flex gap-2 mt-2">
                  {['.csv', '.xlsx', '.xls', '.txt'].map((type) => (
                    <span key={type} className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500">{type}</span>
                  ))}
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: INDUSTRY SELECTION */}
        {wizardStep === 'industry' && (
          <motion.div key="industry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Select Your Industry</h2>
              <p className="text-gray-500 mt-1">This helps us provide relevant benchmarks and context</p>
              <p className="text-sm text-gray-400 mt-1">File: {selectedFile?.name} &middot; {schema?.rowCount} rows &middot; {schema?.columns.length} columns</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PRESET_INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-left group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">{ind}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase">or type custom</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                placeholder="Enter custom industry name..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
              />
              <button
                onClick={() => industryInput && handleIndustrySelect(industryInput)}
                disabled={!industryInput}
                className="px-6 py-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: COLUMN CLASSIFICATION & KPI PRIORITIZATION */}
        {wizardStep === 'classify' && (
          <motion.div key="classify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">KPI Prioritization & Data Categorization</h2>
                <p className="text-sm text-gray-500 mt-1">Industry: <span className="font-medium text-orange-600">{store.selectedIndustry}</span></p>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={prioritizedCount === 0}
                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Run Analysis <ArrowRight size={16} />
              </button>
            </div>

            {/* KPI / Metric Columns */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-orange-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-orange-500" />
                  <span className="text-sm font-semibold text-gray-700">KPI / Metric Columns</span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{kpiColumns.length} detected</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{prioritizedCount} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={selectAllKPIs} className="text-xs text-orange-600 hover:underline">Select All</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={deselectAllKPIs} className="text-xs text-gray-500 hover:underline">Deselect All</button>
                </div>
              </div>
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={kpiSearch}
                    onChange={(e) => setKpiSearch(e.target.value)}
                    placeholder="Search KPI columns..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {filteredKPIs.map((col) => (
                  <div key={col.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                    <button onClick={() => toggleKPIPriority(col.name)} className="flex-shrink-0">
                      {col.isPrioritized
                        ? <CheckSquare size={18} className="text-orange-500" />
                        : <Square size={18} className="text-gray-300" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{col.name.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-400 truncate">Sample: {col.sampleValues.slice(0, 3).join(', ')}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">{col.aggregation}</span>
                    {col.unit && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">{col.unit}</span>}
                    <button onClick={() => changeColumnRole(col.name, 'dimension')} className="text-xs text-gray-400 hover:text-blue-600" title="Move to Dimensions">→ Dim</button>
                  </div>
                ))}
                {filteredKPIs.length === 0 && <p className="px-5 py-4 text-sm text-gray-400">No KPI columns found</p>}
              </div>
            </div>

            {/* Dimension / Category Columns */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-blue-50/50 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">Dimension / Category Columns</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{dimColumns.length}</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                {dimColumns.map((col) => (
                  <div key={col.name} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50">
                    <Layers size={14} className="text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{col.name}</p>
                      <p className="text-xs text-gray-400 truncate">{col.uniqueCount} unique values &middot; {col.sampleValues.slice(0, 3).join(', ')}</p>
                    </div>
                    <button onClick={() => changeColumnRole(col.name, 'kpi')} className="text-xs text-gray-400 hover:text-orange-600">→ KPI</button>
                    <button onClick={() => changeColumnRole(col.name, 'ignored')} className="text-xs text-gray-400 hover:text-red-500">Ignore</button>
                  </div>
                ))}
                {dimColumns.length === 0 && <p className="px-5 py-3 text-sm text-gray-400">No dimension columns detected</p>}
              </div>
            </div>

            {/* Date / Time Columns */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-green-50/50 flex items-center gap-2">
                <Calendar size={16} className="text-green-500" />
                <span className="text-sm font-semibold text-gray-700">Date / Time Columns</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{dateColumnsClassified.length}</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                {dateColumnsClassified.map((col) => (
                  <div key={col.name} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50">
                    <Calendar size={14} className="text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{col.name}</p>
                      <p className="text-xs text-gray-400 truncate">Granularity: {col.dateGranularity} &middot; {col.sampleValues.slice(0, 3).join(', ')}</p>
                    </div>
                    <button onClick={() => changeColumnRole(col.name, 'dimension')} className="text-xs text-gray-400 hover:text-blue-600">→ Dim</button>
                  </div>
                ))}
                {dateColumnsClassified.length === 0 && <p className="px-5 py-3 text-sm text-gray-400">No date columns detected</p>}
              </div>
            </div>

            {prioritizedCount === 0 && (
              <p className="text-center text-sm text-orange-600 font-medium">Select at least one KPI to run analysis</p>
            )}
          </motion.div>
        )}

        {/* STEP 4: ANALYZING */}
        {wizardStep === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={32} className="text-orange-500 animate-spin" />
              <div className="text-center">
                <p className="font-semibold text-gray-700">{analysisStep}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedFile?.name} &middot; {prioritizedCount} KPIs selected</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: COMPLETE */}
        {wizardStep === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Analysis Complete</p>
                <p className="text-xs text-gray-500">
                  {schema?.rowCount} rows &middot; {prioritizedCount} KPIs &middot; {dimColumns.length} dimensions &middot; {dateColumnsClassified.length} date fields
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Navigate to the Dashboard to explore your results.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

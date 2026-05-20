export type Industry = 'FMCG' | 'Healthcare' | 'Banking' | 'Retail' | 'Manufacturing';

export interface DatasetColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'text';
  sampleValues: (string | number)[];
  nullCount: number;
  uniqueCount: number;
}

export interface DatasetSchema {
  columns: DatasetColumn[];
  rowCount: number;
  fileName: string;
}

export interface KPIMapping {
  columnName: string;
  kpiName: string;
  category: string;
  formula: string;
  unit: string;
  confidence: number;
}

export interface KPIValue {
  name: string;
  value: number;
  unit: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  formula: string;
}

export interface BenchmarkEntry {
  kpiName: string;
  value: number;
  unit: string;
  topQuartile: number;
  source: string;
  sourceUrl: string;
  methodology: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface BenchmarkComparison {
  kpiName: string;
  clientValue: number;
  industryAverage: number;
  topQuartile: number;
  gap: number;
  gapPercent: number;
  status: 'above' | 'below' | 'at';
  unit: string;
  source: string;
  methodology: string;
  confidence: string;
  sourceUrl: string;
}

export interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'observation' | 'recommendation';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  kpiName: string;
  impact: string;
}

export interface StorylineSection {
  title: string;
  content: string;
}

export interface ExecutiveStoryline {
  executiveSummary: string;
  currentPerformance: string;
  keyInsight: string;
  rootCause: string;
  businessImpact: string;
  recommendation: string;
  nextSteps: string[];
}

export interface BenchmarkSource {
  name: string;
  industry: Industry;
  type: 'API' | 'Database' | 'Report' | 'Index';
  url: string;
  description: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: Record<string, unknown>[];
  columns: string[];
}

export interface AnalysisState {
  file: UploadedFile | null;
  schema: DatasetSchema | null;
  detectedIndustry: Industry | null;
  kpiMappings: KPIMapping[];
  kpiValues: KPIValue[];
  benchmarks: BenchmarkComparison[];
  insights: AIInsight[];
  storyline: ExecutiveStoryline | null;
  isAnalyzing: boolean;
  currentStep: AnalysisStep;
}

export type AnalysisStep =
  | 'idle'
  | 'uploading'
  | 'detecting-industry'
  | 'mapping-kpis'
  | 'calculating'
  | 'benchmarking'
  | 'generating-insights'
  | 'generating-storyline'
  | 'complete';

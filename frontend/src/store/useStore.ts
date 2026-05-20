import { create } from 'zustand';
import {
  AnalysisState,
  AnalysisStep,
  UploadedFile,
  DatasetSchema,
  Industry,
  KPIMapping,
  KPIValue,
  BenchmarkComparison,
  AIInsight,
  ExecutiveStoryline,
} from '@/types';

interface AppStore extends AnalysisState {
  setFile: (file: UploadedFile | null) => void;
  setSchema: (schema: DatasetSchema | null) => void;
  setDetectedIndustry: (industry: Industry | null) => void;
  setKpiMappings: (mappings: KPIMapping[]) => void;
  setKpiValues: (values: KPIValue[]) => void;
  setBenchmarks: (benchmarks: BenchmarkComparison[]) => void;
  setInsights: (insights: AIInsight[]) => void;
  setStoryline: (storyline: ExecutiveStoryline | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setCurrentStep: (step: AnalysisStep) => void;
  reset: () => void;
}

const initialState: AnalysisState = {
  file: null,
  schema: null,
  detectedIndustry: null,
  kpiMappings: [],
  kpiValues: [],
  benchmarks: [],
  insights: [],
  storyline: null,
  isAnalyzing: false,
  currentStep: 'idle',
};

export const useStore = create<AppStore>((set) => ({
  ...initialState,
  setFile: (file) => set({ file }),
  setSchema: (schema) => set({ schema }),
  setDetectedIndustry: (industry) => set({ detectedIndustry: industry }),
  setKpiMappings: (mappings) => set({ kpiMappings: mappings }),
  setKpiValues: (values) => set({ kpiValues: values }),
  setBenchmarks: (benchmarks) => set({ benchmarks }),
  setInsights: (insights) => set({ insights }),
  setStoryline: (storyline) => set({ storyline }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));

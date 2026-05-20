import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UploadResult, AnalysisResult, KPIMapping } from '@/types'

interface AppState {
  uploadResult: UploadResult | null
  analysisResult: AnalysisResult | null
  isUploading: boolean
  isAnalyzing: boolean
  uploadError: string | null
  analysisError: string | null
  openaiApiKey: string
  kpiMappings: KPIMapping[]
  selectedIndustry: string | null

  setUploadResult: (result: UploadResult | null) => void
  setAnalysisResult: (result: AnalysisResult | null) => void
  setIsUploading: (v: boolean) => void
  setIsAnalyzing: (v: boolean) => void
  setUploadError: (e: string | null) => void
  setAnalysisError: (e: string | null) => void
  setOpenaiApiKey: (key: string) => void
  setKpiMappings: (mappings: KPIMapping[]) => void
  setSelectedIndustry: (industry: string | null) => void
  reset: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      uploadResult: null,
      analysisResult: null,
      isUploading: false,
      isAnalyzing: false,
      uploadError: null,
      analysisError: null,
      openaiApiKey: '',
      kpiMappings: [],
      selectedIndustry: null,

      setUploadResult: (result) => set({ uploadResult: result, uploadError: null }),
      setAnalysisResult: (result) => set({ analysisResult: result, analysisError: null }),
      setIsUploading: (v) => set({ isUploading: v }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setUploadError: (e) => set({ uploadError: e }),
      setAnalysisError: (e) => set({ analysisError: e }),
      setOpenaiApiKey: (key) => set({ openaiApiKey: key }),
      setKpiMappings: (mappings) => set({ kpiMappings: mappings }),
      setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
      reset: () =>
        set({
          uploadResult: null,
          analysisResult: null,
          isUploading: false,
          isAnalyzing: false,
          uploadError: null,
          analysisError: null,
          kpiMappings: [],
          selectedIndustry: null,
        }),
    }),
    {
      name: 'insightsynth-storage',
      partialize: (state) => ({ openaiApiKey: state.openaiApiKey }),
    }
  )
)

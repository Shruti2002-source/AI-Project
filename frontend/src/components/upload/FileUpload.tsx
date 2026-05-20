'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, XCircle, FileText, Key, Play, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { uploadFile, runAnalysis } from '@/lib/api'

const INDUSTRY_COLORS: Record<string, string> = {
  fmcg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  healthcare: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  banking: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  retail: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  manufacturing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
}

export default function FileUpload() {
  const router = useRouter()
  const {
    uploadResult, setUploadResult,
    isUploading, setIsUploading,
    isAnalyzing, setIsAnalyzing,
    uploadError, setUploadError,
    analysisError, setAnalysisResult, setAnalysisError,
    openaiApiKey, setOpenaiApiKey,
    kpiMappings, setKpiMappings,
    selectedIndustry, setSelectedIndustry,
  } = useStore()

  const [showApiKey, setShowApiKey] = useState(false)

  const onDrop = useCallback(async (accepted: File[]) => {
    if (!accepted.length) return
    const file = accepted[0]
    setIsUploading(true)
    setUploadError(null)
    try {
      const result = await uploadFile(file)
      setUploadResult(result)
      setKpiMappings(result.kpi_mappings)
      setSelectedIndustry(result.industry)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [setIsUploading, setUploadError, setUploadResult, setKpiMappings, setSelectedIndustry])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  })

  const handleRunAnalysis = async () => {
    if (!uploadResult) return
    setIsAnalyzing(true)
    setAnalysisError(null)
    try {
      const result = await runAnalysis({
        data: uploadResult.data,
        kpi_mappings: kpiMappings,
        industry: selectedIndustry || uploadResult.industry,
        openai_api_key: openaiApiKey || undefined,
      })
      setAnalysisResult(result)
      router.push('/dashboard')
    } catch (err: any) {
      setAnalysisError(err.message || 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const dropZoneClass = [
    'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200',
    isDragActive
      ? 'border-blue-400 bg-blue-500/10'
      : 'border-slate-600 bg-slate-800/50 hover:border-slate-400 hover:bg-slate-800',
  ].join(' ')

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!uploadResult && !isUploading && (
          <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div {...getRootProps()} className={dropZoneClass}>
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-200 font-medium text-lg">
                {isDragActive ? 'Drop your file here' : 'Drag and drop your dataset'}
              </p>
              <p className="text-slate-400 text-sm mt-1">CSV, XLSX, XLS, or TXT up to 50 MB</p>
            </div>
          </motion.div>
        )}

        {isUploading && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="border-2 border-blue-500/40 rounded-xl p-12 text-center bg-slate-800/50">
            <Loader2 className="mx-auto h-12 w-12 text-blue-400 animate-spin mb-4" />
            <p className="text-slate-200 font-medium">Processing your file...</p>
          </motion.div>
        )}

        {uploadError && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="border-2 border-red-500/40 rounded-xl p-6 bg-red-500/10">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{uploadError}</p>
            </div>
            <button onClick={() => setUploadError(null)}
              className="mt-3 text-xs text-slate-400 hover:text-slate-200 underline">
              Try again
            </button>
          </motion.div>
        )}

        {uploadResult && !isUploading && (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="border border-green-500/30 rounded-xl p-5 bg-green-500/5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    {uploadResult.filename}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {uploadResult.rows} rows · {uploadResult.columns.length} columns ·{' '}
                    <span className={['px-2 py-0.5 rounded text-xs border', INDUSTRY_COLORS[uploadResult.industry.toLowerCase()] || 'bg-slate-700 text-slate-300 border-slate-600'].join(' ')}>
                      {uploadResult.industry.toUpperCase()}
                    </span>{' '}
                    detected ({Math.round(uploadResult.confidence * 100)}% confidence)
                  </p>
                </div>
              </div>

              {kpiMappings.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Mapped KPIs ({kpiMappings.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {kpiMappings.map((m) => (
                      <span key={m.kpi_name}
                        className="px-2.5 py-1 rounded-full text-xs bg-slate-700 text-slate-200 border border-slate-600">
                        {m.kpi_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/50">
              <button onClick={() => setShowApiKey(!showApiKey)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                <Key className="h-4 w-4" />
                {showApiKey ? 'Hide' : 'Add'} OpenAI API Key (optional — enables GPT-4 insights)
              </button>
              <AnimatePresence>
                {showApiKey && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <input type="password" value={openaiApiKey} onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="mt-3 w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                    <p className="text-xs text-slate-500 mt-1">Stored locally only. Not sent to our servers.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {analysisError && (
              <div className="border border-red-500/40 rounded-xl p-4 bg-red-500/10">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-medium">Analysis failed</p>
                    <p className="text-red-400/80 text-xs mt-1">{analysisError}</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleRunAnalysis} disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-white">
              {isAnalyzing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Running Analysis...</>
              ) : (
                <><Play className="h-4 w-4" /> Run Analysis</>
              )}
            </button>

            <button onClick={() => { setUploadResult(null); setKpiMappings([]); setSelectedIndustry(null) }}
              className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors py-1">
              Upload a different file
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

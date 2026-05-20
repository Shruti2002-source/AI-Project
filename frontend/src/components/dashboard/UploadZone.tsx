'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, FileSpreadsheet, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import { UploadedFile } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const FILE_ICONS: Record<string, React.ElementType> = {
  'text/csv': FileSpreadsheet,
  'application/vnd.ms-excel': FileSpreadsheet,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/pdf': FileText,
  'application/vnd.ms-powerpoint': File,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': File,
  'text/plain': FileText,
};

const ACCEPTED_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
};

interface UploadZoneProps {
  onFilesProcessed?: (files: UploadedFile[]) => void;
  onSessionCreated?: (sessionId: string, industry: string, summary?: Record<string, unknown>) => void;
  industryOverride?: string;
}

export function UploadZone({ onFilesProcessed, onSessionCreated, industryOverride }: UploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (file: File) => {
    const id = generateId();
    setFiles((prev) => [...prev, {
      id, name: file.name, size: file.size, type: file.type,
      status: 'uploading', progress: 0, uploadedAt: new Date().toISOString(),
    }]);

    // Animate progress while uploading
    let prog = 0;
    const ticker = setInterval(() => {
      prog = Math.min(prog + 15, 85);
      setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: prog } : f));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (industryOverride && industryOverride !== 'auto') {
        formData.append('industry', industryOverride);
      }
      const res = await fetch('/api/v1/upload', { method: 'POST', body: formData });
      clearInterval(ticker);

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      const data = await res.json();

      setFiles((prev) => prev.map((f) => f.id === id ? {
        ...f, status: 'completed', progress: 100,
        detectedIndustry: data.detected_industry,
        extractedKPIs: data.extracted_kpis?.slice(0, 4),
      } : f));

      if (data.session_id && data.detected_industry && onSessionCreated) {
        onSessionCreated(data.session_id, data.detected_industry, data.analytics_summary);
      }
    } catch {
      clearInterval(ticker);
      setFiles((prev) => prev.map((f) => f.id === id ? { ...f, status: 'error', progress: 0 } : f));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(uploadFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
  });

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300',
          isDragActive
            ? 'border-indigo-500 bg-indigo-600/10 shadow-glow-sm'
            : 'border-slate-700/60 hover:border-indigo-500/50 hover:bg-white/[0.02] bg-slate-900/30'
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300',
            isDragActive ? 'bg-indigo-600/30 shadow-glow-sm' : 'bg-slate-800/60'
          )}>
            <Upload className={cn('w-7 h-7 transition-colors duration-300', isDragActive ? 'text-indigo-400' : 'text-slate-400')} />
          </div>
          <p className="text-white font-semibold mb-1">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-slate-400 mb-4">or click to browse your files</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['CSV', 'Excel', 'PDF', 'PowerPoint', 'TXT'].map((type) => (
              <span key={type} className="px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400">
                .{type.toLowerCase().replace('excel', 'xlsx').replace('powerpoint', 'pptx')}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {files.map((file) => {
              const Icon = FILE_ICONS[file.type] || File;
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white truncate">{file.name}</span>
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{formatSize(file.size)}</span>
                    </div>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1.5" indicatorClassName="bg-indigo-500" />
                    )}
                    {file.status === 'completed' && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {file.detectedIndustry && (
                          <Badge variant="default" className="text-[10px]">
                            🏭 {file.detectedIndustry}
                          </Badge>
                        )}
                        {file.extractedKPIs?.map((kpi) => (
                          <Badge key={kpi} variant="secondary" className="text-[10px]">{kpi}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.status === 'uploading' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                    {file.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Table,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useStore } from '@/store/useStore';
import { UploadedFile, SchemaInfo, ColumnInfo } from '@/types';

interface UploadEngineProps {
  onUploadComplete?: (file: UploadedFile) => void;
  maxFileSize?: number; // in MB
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'parsing' | 'success' | 'error';

const ACCEPTED_TYPES = ['.csv', '.xlsx', '.xls', '.txt'];
const ACCEPTED_MIME_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
];

export const UploadEngine: React.FC<UploadEngineProps> = ({
  onUploadComplete,
  maxFileSize = 50,
}) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [schema, setSchema] = useState<SchemaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUploadedData } = useStore();

  const detectColumnType = (values: unknown[]): string => {
    const sample = values.filter((v) => v !== null && v !== undefined && v !== '').slice(0, 20);
    if (sample.length === 0) return 'unknown';

    const numericCount = sample.filter((v) => !isNaN(Number(v))).length;
    if (numericCount / sample.length > 0.8) return 'numeric';

    const datePattern = /^\d{4}[-/]\d{2}[-/]\d{2}|^\d{2}[-/]\d{2}[-/]\d{4}/;
    const dateCount = sample.filter((v) => datePattern.test(String(v))).length;
    if (dateCount / sample.length > 0.8) return 'date';

    return 'string';
  };

  const parseCSV = (file: File): Promise<SchemaInfo> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        preview: 100,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const columns: ColumnInfo[] = headers.map((header) => {
            const values = results.data.map((row: any) => row[header]);
            const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
            return {
              name: header,
              type: detectColumnType(values),
              nonNullCount: nonNull.length,
              sampleValues: nonNull.slice(0, 5).map(String),
            };
          });

          resolve({
            fileName: file.name,
            fileSize: file.size,
            rowCount: results.data.length,
            columnCount: headers.length,
            columns,
          });
        },
        error: (err) => reject(err),
      });
    });
  };

  const parseExcel = async (file: File): Promise<SchemaInfo> => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

    if (data.length < 1) throw new Error('Empty spreadsheet');

    const headers = data[0].map(String);
    const rows = data.slice(1);

    const columns: ColumnInfo[] = headers.map((header, index) => {
      const values = rows.map((row) => row[index]);
      const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
      return {
        name: header,
        type: detectColumnType(values),
        nonNullCount: nonNull.length,
        sampleValues: nonNull.slice(0, 5).map(String),
      };
    });

    return {
      fileName: file.name,
      fileSize: file.size,
      rowCount: rows.length,
      columnCount: headers.length,
      columns,
    };
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setUploadState('uploading');

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 50));
      setProgress(i);
    }

    setUploadState('parsing');

    try {
      let schemaInfo: SchemaInfo;
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();

      if (ext === 'csv' || ext === 'txt') {
        schemaInfo = await parseCSV(selectedFile);
      } else if (ext === 'xlsx' || ext === 'xls') {
        schemaInfo = await parseExcel(selectedFile);
      } else {
        throw new Error('Unsupported file type');
      }

      setSchema(schemaInfo);
      setUploadState('success');
      setUploadedData({ file: selectedFile, schema: schemaInfo });
      onUploadComplete?.({ file: selectedFile, schema: schemaInfo });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setUploadState('error');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState('idle');

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (droppedFile.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      setUploadState('error');
      return;
    }

    processFile(droppedFile);
  }, [maxFileSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState('dragging');
  }, []);

  const handleDragLeave = useCallback(() => {
    setUploadState('idle');
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      setUploadState('error');
      return;
    }

    processFile(selectedFile);
  };

  const reset = () => {
    setFile(null);
    setSchema(null);
    setError(null);
    setUploadState('idle');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {(uploadState === 'idle' || uploadState === 'dragging') && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              uploadState === 'dragging'
                ? 'border-orange-400 bg-orange-50 scale-[1.02]'
                : 'border-gray-200 bg-gray-50/50 hover:border-orange-300 hover:bg-orange-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            <motion.div
              animate={uploadState === 'dragging' ? { scale: 1.1 } : { scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Upload size={28} className="text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Drop your data file here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse. Supports CSV, XLSX, XLS, TXT (max {maxFileSize}MB)
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                {ACCEPTED_TYPES.map((type) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {(uploadState === 'uploading' || uploadState === 'parsing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={32} className="text-orange-500" />
              </motion.div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">
                  {uploadState === 'uploading' ? 'Uploading...' : 'Parsing schema...'}
                </p>
                <p className="text-sm text-gray-500 mt-1">{file?.name}</p>
              </div>
              {uploadState === 'uploading' && (
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {uploadState === 'success' && schema && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{schema.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {schema.rowCount} rows x {schema.columnCount} columns |{' '}
                    {(schema.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Schema Preview */}
            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                <Table size={14} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Detected Schema
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {schema.columns.map((col, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{col.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                        {col.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {col.nonNullCount} values
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {uploadState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center"
          >
            <div className="flex flex-col items-center gap-3">
              <AlertCircle size={32} className="text-red-500" />
              <p className="font-semibold text-red-700">Upload Failed</p>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={reset}
                className="mt-2 px-4 py-2 rounded-lg bg-white border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadEngine;

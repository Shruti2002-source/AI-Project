import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  Industry,
  DatasetSchema,
  KPIMapping,
  KPIValue,
  BenchmarkComparison,
  AIInsight,
  ExecutiveStoryline
} from '@/types';
import { ExportFormat } from './exportEngine';

/**
 * API configuration.
 * Reads base URL from environment variable or defaults to localhost.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = 30000; // 30 seconds

/**
 * API response wrapper type.
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * API error response type.
 */
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Upload response from the backend.
 */
interface UploadResponse {
  fileId: string;
  fileName: string;
  schema: DatasetSchema;
  rowCount: number;
  sizeBytes: number;
}

/**
 * Analysis request payload.
 */
interface AnalyzeRequest {
  fileId: string;
  industry?: Industry;
  options?: {
    includeInsights?: boolean;
    includeStoryline?: boolean;
    includeBenchmarks?: boolean;
    customBenchmarkUrls?: string[];
  };
}

/**
 * Full analysis response from the backend.
 */
interface AnalyzeResponse {
  fileId: string;
  industry: Industry;
  industryConfidence: number;
  kpiMappings: KPIMapping[];
  kpiValues: KPIValue[];
  benchmarks: BenchmarkComparison[];
  insights: AIInsight[];
  storyline: ExecutiveStoryline;
  processingTimeMs: number;
}

/**
 * Benchmark request payload.
 */
interface BenchmarkRequest {
  industry: Industry;
  kpiNames: string[];
  includeMethodology?: boolean;
}

/**
 * Export request payload.
 */
interface ExportRequest {
  fileId: string;
  format: ExportFormat;
  includeCharts?: boolean;
  includeMethodology?: boolean;
}

/**
 * Creates and configures the Axios instance.
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Request interceptor: add auth token if available
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle common errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        const apiError: ApiError = error.response.data;

        switch (status) {
          case 401:
            console.warn('[API] Unauthorized - token may be expired');
            clearAuthToken();
            break;
          case 403:
            console.warn('[API] Forbidden - insufficient permissions');
            break;
          case 413:
            console.warn('[API] File too large');
            break;
          case 429:
            console.warn('[API] Rate limited - retrying after delay');
            break;
          case 500:
            console.error('[API] Server error:', apiError?.error?.message);
            break;
        }
      } else if (error.code === 'ECONNABORTED') {
        console.error('[API] Request timeout');
      } else if (!error.response) {
        console.error('[API] Network error - backend may be unavailable');
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Auth token management (simple localStorage-based).
 */
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('insightsynth_token');
  }
  return null;
}

function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('insightsynth_token');
  }
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('insightsynth_token', token);
  }
}

// Create the API client singleton
const apiClient = createApiClient();

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Upload a file for analysis.
 * Supports CSV, Excel, and JSON files.
 */
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  };

  const response: AxiosResponse<ApiResponse<UploadResponse>> = await apiClient.post(
    '/upload',
    formData,
    config
  );

  return response.data.data;
}

/**
 * Run full analysis on an uploaded file.
 * Combines industry detection, KPI calculation, benchmarking, insights, and storyline.
 */
export async function analyzeFile(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response: AxiosResponse<ApiResponse<AnalyzeResponse>> = await apiClient.post(
    '/analyze',
    request
  );

  return response.data.data;
}

/**
 * Fetch benchmarks for specific KPIs and industry.
 * Can be used to refresh benchmark data independently.
 */
export async function fetchBenchmarks(
  request: BenchmarkRequest
): Promise<BenchmarkComparison[]> {
  const response: AxiosResponse<ApiResponse<BenchmarkComparison[]>> = await apiClient.post(
    '/benchmarks',
    request
  );

  return response.data.data;
}

/**
 * Export analysis results in the specified format.
 * Returns a download URL or blob depending on backend implementation.
 */
export async function exportAnalysis(
  request: ExportRequest
): Promise<Blob> {
  const response = await apiClient.post('/export', request, {
    responseType: 'blob'
  });

  return response.data;
}

/**
 * Health check endpoint to verify backend availability.
 */
export async function healthCheck(): Promise<{
  status: string;
  version: string;
  uptime: number;
}> {
  const response = await apiClient.get('/health');
  return response.data;
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Check if the backend API is available.
 * Useful for determining whether to use client-side or server-side processing.
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload and analyze in a single operation.
 * Convenience function that chains upload and analysis.
 */
export async function uploadAndAnalyze(
  file: File,
  options?: AnalyzeRequest['options'],
  onProgress?: (percent: number) => void
): Promise<AnalyzeResponse> {
  // Step 1: Upload
  const uploadResult = await uploadFile(file, onProgress);

  // Step 2: Analyze
  const analysisResult = await analyzeFile({
    fileId: uploadResult.fileId,
    options: {
      includeInsights: true,
      includeStoryline: true,
      includeBenchmarks: true,
      ...options
    }
  });

  return analysisResult;
}

/**
 * Export and trigger download in a single operation.
 */
export async function exportAndDownloadFromBackend(
  fileId: string,
  format: ExportFormat,
  filename?: string
): Promise<void> {
  const blob = await exportAnalysis({
    fileId,
    format,
    includeCharts: true,
    includeMethodology: true
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `InsightSynth_Report.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// API CLIENT EXPORT
// ============================================================================

/**
 * Expose the raw API client for advanced usage or custom endpoints.
 */
export { apiClient };

/**
 * API service configuration type for runtime updates.
 */
export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  token?: string;
}

/**
 * Update API configuration at runtime.
 */
export function configureApi(config: ApiConfig): void {
  if (config.baseUrl) {
    apiClient.defaults.baseURL = config.baseUrl;
  }
  if (config.timeout) {
    apiClient.defaults.timeout = config.timeout;
  }
  if (config.token) {
    setAuthToken(config.token);
  }
}

import { KPIMapping, UploadResult, AnalysisResult } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed: ${res.status}`)
  }
  return res.json()
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/api/upload/`, { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `Upload failed: ${res.status}`)
  }
  return res.json()
}

export interface RunAnalysisPayload {
  data: string
  kpi_mappings: KPIMapping[]
  industry: string
  openai_api_key?: string
}

export async function runAnalysis(payload: RunAnalysisPayload): Promise<AnalysisResult> {
  return request<AnalysisResult>('/api/analysis/run', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getIndustryBenchmarks(industry: string) {
  return request(`/api/benchmarks/${industry}`)
}

export async function getBenchmarkRegistry(industry?: string) {
  const path = industry ? `/api/benchmarks/registry?industry=${industry}` : '/api/benchmarks/registry'
  return request(path)
}

export async function exportExcel(payload: object, industry: string): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/export/excel?industry=${industry}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Export failed: ${res.status}`)
  return res.blob()
}

export async function exportJson(payload: object, industry: string): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/export/json?industry=${industry}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Export failed: ${res.status}`)
  return res.blob()
}

export async function healthCheck() {
  return request('/health')
}

const API_BASE = '/api/v1';

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(path, window.location.origin);
    url.pathname = `${API_BASE}${path}`;
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface LiveKPIData {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: number;
  trend_direction: 'up' | 'down' | 'stable';
  formula_used?: string;
  columns_detected?: string[];
  data_points_used?: number;
  historical_data?: Array<{ date: string; value: number }>;
  lower_is_better?: boolean;
  is_live?: boolean;
}

export interface LiveBenchmarkData {
  kpi_id: string;
  kpi_name: string;
  client_value: number;
  industry_average: number;
  top_quartile: number;
  bottom_quartile: number;
  unit: string;
  variance: number;
  variance_percent: number;
  position: string;
  percentile?: number;
  recommendation?: string;
  is_live?: boolean;
}

export interface LiveInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  kpi_ids: string[];
  recommendation: string;
  confidence: number;
  category: string;
  generated_at: string;
}

export interface AnalyticsSummary {
  session_id: string;
  industry: string;
  kpis_calculated: number;
  rows_processed: number;
  columns_mapped: number;
  processed_at: string;
}

export async function fetchKPIs(
  industry: string,
  sessionId?: string,
): Promise<LiveKPIData[] | null> {
  const params: Record<string, string> = {};
  if (sessionId) params.session_id = sessionId;
  return apiFetch<LiveKPIData[]>(`/kpis/${industry}`, params);
}

export async function fetchBenchmarks(
  industry: string,
  sessionId?: string,
): Promise<LiveBenchmarkData[] | null> {
  const params: Record<string, string> = {};
  if (sessionId) params.session_id = sessionId;
  return apiFetch<LiveBenchmarkData[]>(`/benchmarks/${industry}`, params);
}

export async function fetchInsights(
  industry: string,
  sessionId?: string,
): Promise<LiveInsight[] | null> {
  const params: Record<string, string> = {};
  if (sessionId) params.session_id = sessionId;
  return apiFetch<LiveInsight[]>(`/insights/${industry}`, params);
}

export const SESSION_KEY = 'insightsynth:session_id';
export const INDUSTRY_KEY = 'insightsynth:industry';
export const SUMMARY_KEY = 'insightsynth:summary';

export function getStoredSession(): { sessionId: string | null; industry: string | null } {
  if (typeof window === 'undefined') return { sessionId: null, industry: null };
  return {
    sessionId: localStorage.getItem(SESSION_KEY),
    industry: localStorage.getItem(INDUSTRY_KEY),
  };
}

export function storeSession(sessionId: string, industry: string, summary?: AnalyticsSummary): void {
  localStorage.setItem(SESSION_KEY, sessionId);
  localStorage.setItem(INDUSTRY_KEY, industry);
  if (summary) localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(INDUSTRY_KEY);
  localStorage.removeItem(SUMMARY_KEY);
}

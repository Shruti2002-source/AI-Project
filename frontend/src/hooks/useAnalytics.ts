'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchKPIs, fetchBenchmarks, fetchInsights,
  getStoredSession, storeSession, clearSession,
  LiveKPIData, LiveBenchmarkData, LiveInsight,
} from '@/lib/analytics-api';

interface AnalyticsState {
  kpis: LiveKPIData[] | null;
  benchmarks: LiveBenchmarkData[] | null;
  insights: LiveInsight[] | null;
  loading: boolean;
  error: string | null;
  isLive: boolean;
  sessionId: string | null;
  industry: string | null;
}

export function useAnalytics(industry?: string) {
  const { sessionId: storedId, industry: storedIndustry } = getStoredSession();
  const resolvedIndustry = industry || storedIndustry || 'fmcg';

  const [state, setState] = useState<AnalyticsState>({
    kpis: null,
    benchmarks: null,
    insights: null,
    loading: false,
    error: null,
    isLive: false,
    sessionId: storedId,
    industry: storedIndustry,
  });

  const load = useCallback(async (sid: string | null, ind: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [kpis, benchmarks, insights] = await Promise.all([
        fetchKPIs(ind, sid ?? undefined),
        fetchBenchmarks(ind, sid ?? undefined),
        fetchInsights(ind, sid ?? undefined),
      ]);
      const isLive = !!(kpis?.some((k) => k.is_live));
      setState((s) => ({ ...s, kpis, benchmarks, insights, isLive, loading: false }));
    } catch (e: unknown) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load analytics data',
      }));
    }
  }, []);

  useEffect(() => {
    load(storedId, resolvedIndustry);
  }, [storedId, resolvedIndustry, load]);

  const setSession = useCallback((sessionId: string, ind: string) => {
    storeSession(sessionId, ind);
    setState((s) => ({ ...s, sessionId, industry: ind }));
    load(sessionId, ind);
  }, [load]);

  const resetSession = useCallback(() => {
    clearSession();
    setState((s) => ({
      ...s, sessionId: null, industry: null, kpis: null,
      benchmarks: null, insights: null, isLive: false,
    }));
  }, []);

  const refresh = useCallback(() => {
    load(state.sessionId, resolvedIndustry);
  }, [state.sessionId, resolvedIndustry, load]);

  return {
    ...state,
    hasSession: !!state.sessionId,
    setSession,
    clearSession: resetSession,
    refresh,
  };
}

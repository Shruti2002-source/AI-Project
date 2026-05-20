import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { INDUSTRIES, getIndustry } from '@/lib/data/industries';
import type { Industry, IndustryConfig } from '@/types';

const DEFAULT_INDUSTRY: Industry = 'fmcg';

export function useIndustry() {
  const [selectedId, setSelectedId] = useLocalStorage<Industry>(
    'insightsynth:selected_industry',
    DEFAULT_INDUSTRY
  );

  const industry: IndustryConfig =
    getIndustry(selectedId) ?? INDUSTRIES[1]; // fallback to FMCG

  const allKPIs = industry.categories.flatMap((c) => c.kpis);

  const selectIndustry = useCallback(
    (id: Industry) => {
      setSelectedId(id);
    },
    [setSelectedId]
  );

  return {
    selectedId,
    industry,
    allKPIs,
    industries: INDUSTRIES,
    selectIndustry,
  };
}

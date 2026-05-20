import { useState, useMemo } from 'react';
import type { KPI } from '@/types';

export type SortField = 'name' | 'value' | 'trend' | 'status';
export type SortDirection = 'asc' | 'desc';

export function useKPIFilters(kpis: KPI[]) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(kpis.map((k) => k.category)))],
    [kpis]
  );

  const filtered = useMemo(() => {
    let result = [...kpis];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((k) => k.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((k) => k.category === categoryFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'value') cmp = a.value - b.value;
      else if (sortField === 'trend') cmp = a.trend - b.trend;
      else if (sortField === 'status') {
        const order = { good: 0, warning: 1, critical: 2 };
        cmp = order[a.status] - order[b.status];
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [kpis, search, statusFilter, categoryFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const statusCounts = useMemo(
    () => ({
      good: kpis.filter((k) => k.status === 'good').length,
      warning: kpis.filter((k) => k.status === 'warning').length,
      critical: kpis.filter((k) => k.status === 'critical').length,
    }),
    [kpis]
  );

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    sortField, sortDirection, toggleSort,
    categories,
    filtered,
    statusCounts,
    total: kpis.length,
    filteredCount: filtered.length,
  };
}

import { DatasetSchema, DatasetColumn, ClassifiedColumn, ColumnRole, AggregationMethod, KPIUnit } from '@/types';

const DIMENSION_KEYWORDS = [
  'region', 'country', 'state', 'city', 'area', 'zone', 'territory',
  'product', 'category', 'sku', 'brand', 'item', 'segment',
  'department', 'division', 'business_unit', 'unit', 'team',
  'customer', 'client', 'vendor', 'supplier',
  'channel', 'store', 'location', 'branch', 'outlet',
  'gender', 'age_group', 'tier', 'type', 'class', 'group', 'name',
  'id', 'code', 'description', 'label', 'status',
  'sheet', 'tab', 'source',
];

const DATE_KEYWORDS = [
  'date', 'month', 'year', 'quarter', 'week', 'period',
  'fiscal_year', 'fy', 'time', 'day', 'timestamp',
];

const DATE_PATTERNS = [
  /^\d{4}[-/]\d{2}[-/]\d{2}/,
  /^\d{2}[-/]\d{2}[-/]\d{4}/,
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  /^Q[1-4]\s*\d{4}/i,
  /^(19|20)\d{2}$/,
];

// Patterns for detecting aggregation type from column name
const SUM_PATTERNS = [
  'revenue', 'sales', 'income', 'profit', 'cost', 'expense', 'spend',
  'volume', 'units', 'quantity', 'orders', 'transactions', 'count',
  'amount', 'total', 'budget', 'investment', 'capex', 'opex',
  'visitors', 'footfall', 'headcount', 'fte', 'production',
  'output', 'throughput', 'shipments', 'deliveries', 'returns',
  'complaints', 'tickets', 'claims', 'leads', 'signups',
];

const AVERAGE_PATTERNS = [
  'rate', 'ratio', 'margin', 'percentage', 'percent', 'pct',
  'score', 'index', 'satisfaction', 'nps', 'csat',
  'efficiency', 'utilization', 'occupancy', 'yield', 'accuracy',
  'conversion', 'retention', 'churn', 'attrition', 'turnover',
  'average', 'avg', 'mean', 'median',
  'share', 'penetration', 'coverage', 'adoption',
  'fill_rate', 'stockout', 'availability',
  'oee', 'roi', 'roa', 'roe', 'roas', 'nim',
  'defect', 'mortality', 'readmission', 'shrinkage',
  'growth', 'decline', 'change',
  'aov', 'arpu', 'ltv', 'cac', 'cpa', 'cpc', 'ctr', 'bounce',
];

const COUNT_PATTERNS = [
  'number_of', 'num_', 'no_of', 'total_count',
  'employees', 'customers', 'patients', 'users', 'subscribers',
  'stores', 'outlets', 'branches', 'locations',
];

// Patterns for detecting unit from column name
const PERCENT_PATTERNS = [
  'rate', 'ratio', 'margin', 'percentage', 'percent', 'pct',
  'share', 'penetration', 'coverage', 'adoption', 'conversion',
  'retention', 'churn', 'attrition', 'efficiency', 'utilization',
  'occupancy', 'yield', 'accuracy', 'fill', 'availability',
  'oee', 'roi', 'roa', 'roe', 'nim', 'growth', 'decline',
  'defect', 'mortality', 'readmission', 'shrinkage', 'stockout',
  'bounce', 'ctr',
];

const CURRENCY_PATTERNS = [
  'revenue', 'sales', 'income', 'profit', 'cost', 'expense',
  'spend', 'budget', 'investment', 'capex', 'opex', 'price',
  'amount', 'value', 'worth', 'aov', 'arpu', 'ltv', 'cac', 'cpa',
  'mrr', 'arr', 'gmv', 'earning', 'wage', 'salary', 'fee',
];

const DAYS_PATTERNS = [
  'days', 'lead_time', 'cycle_time', 'duration', 'tat',
  'turnaround', 'length_of_stay', 'los', 'aging',
];

const SCORE_PATTERNS = [
  'score', 'index', 'satisfaction', 'nps', 'csat', 'rating',
];

const MULTIPLIER_PATTERNS = [
  'turnover', 'turns', 'multiple', 'leverage', 'ratio_x',
];

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function matchesAny(normalized: string, patterns: string[]): boolean {
  return patterns.some(p => normalized.includes(p));
}

function detectAggregation(col: DatasetColumn): AggregationMethod {
  const normalized = normalize(col.name);

  if (matchesAny(normalized, COUNT_PATTERNS)) return 'count';
  if (matchesAny(normalized, AVERAGE_PATTERNS)) return 'average';
  if (matchesAny(normalized, SUM_PATTERNS)) return 'sum';

  // Fallback: if values are all between 0-100, likely a rate/percentage → average
  const numericSample = col.sampleValues
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  if (numericSample.length > 0) {
    const max = Math.max(...numericSample);
    const min = Math.min(...numericSample);
    if (min >= 0 && max <= 100) return 'average';
    if (max > 10000) return 'sum';
  }

  return 'sum';
}

function detectUnit(col: DatasetColumn): KPIUnit | string {
  const normalized = normalize(col.name);

  if (matchesAny(normalized, PERCENT_PATTERNS)) return '%';
  if (matchesAny(normalized, DAYS_PATTERNS)) return 'days';
  if (matchesAny(normalized, SCORE_PATTERNS)) return 'score';
  if (matchesAny(normalized, MULTIPLIER_PATTERNS)) return 'x';

  // Check if column name explicitly contains currency hints
  if (normalized.includes('usd') || normalized.includes('dollar')) return 'USD';
  if (normalized.includes('inr') || normalized.includes('rupee')) return 'INR';

  // Check if it's likely a monetary value from data range
  if (matchesAny(normalized, CURRENCY_PATTERNS)) {
    return 'USD';
  }

  // Fallback: check data range for unit detection
  const numericSample = col.sampleValues
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  if (numericSample.length > 0) {
    const max = Math.max(...numericSample);
    const min = Math.min(...numericSample);
    if (min >= 0 && max <= 100) return '%';
  }

  return '';
}

function isDateValue(values: (string | number)[]): boolean {
  const sample = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 10);
  if (sample.length === 0) return false;
  const dateMatches = sample.filter(v => {
    const str = String(v);
    return DATE_PATTERNS.some(p => p.test(str));
  });
  return dateMatches.length / sample.length > 0.6;
}

function isYearColumn(values: (string | number)[]): boolean {
  const sample = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 20);
  if (sample.length === 0) return false;
  const yearCount = sample.filter(v => {
    const num = Number(v);
    return Number.isInteger(num) && num >= 1900 && num <= 2100;
  });
  return yearCount.length / sample.length > 0.7;
}

function detectDateGranularity(col: DatasetColumn): ClassifiedColumn['dateGranularity'] {
  const normalized = normalize(col.name);
  if (normalized.includes('year') || normalized === 'fy') return 'year';
  if (normalized.includes('quarter') || normalized.startsWith('q')) return 'quarter';
  if (normalized.includes('month')) return 'month';
  if (normalized.includes('week')) return 'week';

  if (isYearColumn(col.sampleValues)) return 'year';

  const sample = col.sampleValues.filter(v => v != null && v !== '').slice(0, 5);
  if (sample.some(v => /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(String(v)))) return 'month';
  if (sample.some(v => /^Q[1-4]/i.test(String(v)))) return 'quarter';

  return 'date';
}

export function classifyColumns(schema: DatasetSchema): ClassifiedColumn[] {
  return schema.columns.map(col => {
    const normalized = normalize(col.name);

    // Check date first
    const isDateKeyword = DATE_KEYWORDS.some(k => normalized.includes(k));
    const hasDateValues = isDateValue(col.sampleValues) || isYearColumn(col.sampleValues);

    if (isDateKeyword || (col.type === 'date') || hasDateValues) {
      return {
        name: col.name,
        originalType: col.type,
        role: 'date' as ColumnRole,
        sampleValues: col.sampleValues,
        nullCount: col.nullCount,
        uniqueCount: col.uniqueCount,
        dateGranularity: detectDateGranularity(col),
      };
    }

    // Check dimension
    const isDimensionKeyword = DIMENSION_KEYWORDS.some(k => normalized.includes(k));
    const isCategorical = col.type === 'categorical' || col.type === 'text';
    const lowCardinality = col.uniqueCount <= 50 && col.uniqueCount > 0;

    if (isDimensionKeyword || (isCategorical && lowCardinality)) {
      return {
        name: col.name,
        originalType: col.type,
        role: 'dimension' as ColumnRole,
        sampleValues: col.sampleValues,
        nullCount: col.nullCount,
        uniqueCount: col.uniqueCount,
      };
    }

    // Non-numeric, non-date → dimension
    if (col.type !== 'numeric') {
      return {
        name: col.name,
        originalType: col.type,
        role: 'dimension' as ColumnRole,
        sampleValues: col.sampleValues,
        nullCount: col.nullCount,
        uniqueCount: col.uniqueCount,
      };
    }

    // Numeric → KPI with auto-detected aggregation and unit
    return {
      name: col.name,
      originalType: col.type,
      role: 'kpi' as ColumnRole,
      sampleValues: col.sampleValues,
      nullCount: col.nullCount,
      uniqueCount: col.uniqueCount,
      aggregation: detectAggregation(col),
      unit: detectUnit(col),
      isPrioritized: false,
    };
  });
}

export function getKPIColumns(columns: ClassifiedColumn[]): ClassifiedColumn[] {
  return columns.filter(c => c.role === 'kpi');
}

export function getDimensionColumns(columns: ClassifiedColumn[]): ClassifiedColumn[] {
  return columns.filter(c => c.role === 'dimension');
}

export function getDateColumns(columns: ClassifiedColumn[]): ClassifiedColumn[] {
  return columns.filter(c => c.role === 'date');
}

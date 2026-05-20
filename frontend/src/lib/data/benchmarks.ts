import { BenchmarkComparison } from '@/types';

export const HEALTHCARE_BENCHMARKS: BenchmarkComparison[] = [
  { kpiId: 'patient_satisfaction', kpiName: 'Patient Satisfaction Score', clientValue: 82.4, industryAverage: 79.2, topQuartile: 91.5, bottomQuartile: 68.4, unit: '%', variance: 3.2, variancePercent: 4.0, position: 'average' },
  { kpiId: 'wait_time', kpiName: 'Patient Wait Time', clientValue: 28, industryAverage: 32, topQuartile: 18, bottomQuartile: 52, unit: 'min', variance: -4, variancePercent: -12.5, position: 'top_quartile' },
  { kpiId: 'readmission_rate', kpiName: 'Readmission Rate', clientValue: 14.2, industryAverage: 13.1, topQuartile: 9.8, bottomQuartile: 18.6, unit: '%', variance: 1.1, variancePercent: 8.4, position: 'average' },
  { kpiId: 'bed_occupancy', kpiName: 'Bed Occupancy Rate', clientValue: 76.8, industryAverage: 72.4, topQuartile: 85.2, bottomQuartile: 58.6, unit: '%', variance: 4.4, variancePercent: 6.1, position: 'top_quartile' },
  { kpiId: 'operating_margin', kpiName: 'Operating Margin', clientValue: 12.3, industryAverage: 10.8, topQuartile: 16.4, bottomQuartile: 6.2, unit: '%', variance: 1.5, variancePercent: 13.9, position: 'top_quartile' },
  { kpiId: 'claim_rejection', kpiName: 'Claim Rejection Rate', clientValue: 8.7, industryAverage: 9.4, topQuartile: 5.2, bottomQuartile: 15.8, unit: '%', variance: -0.7, variancePercent: -7.4, position: 'average' },
];

export const FMCG_BENCHMARKS: BenchmarkComparison[] = [
  { kpiId: 'revenue_growth', kpiName: 'Revenue Growth', clientValue: 8.4, industryAverage: 7.2, topQuartile: 14.6, bottomQuartile: 2.8, unit: '%', variance: 1.2, variancePercent: 16.7, position: 'top_quartile' },
  { kpiId: 'inventory_turnover', kpiName: 'Inventory Turnover', clientValue: 8.6, industryAverage: 10.2, topQuartile: 14.8, bottomQuartile: 6.4, unit: 'x', variance: -1.6, variancePercent: -15.7, position: 'below_average', recommendation: 'Inventory turnover is 15.7% below industry average. Implement demand forecasting improvements and reduce safety stock levels for slow-moving SKUs.' },
  { kpiId: 'fill_rate', kpiName: 'Fill Rate', clientValue: 94.2, industryAverage: 95.8, topQuartile: 98.4, bottomQuartile: 90.2, unit: '%', variance: -1.6, variancePercent: -1.7, position: 'below_average' },
  { kpiId: 'forecast_accuracy', kpiName: 'Forecast Accuracy', clientValue: 78.3, industryAverage: 82.4, topQuartile: 92.6, bottomQuartile: 68.4, unit: '%', variance: -4.1, variancePercent: -5.0, position: 'below_average' },
  { kpiId: 'stockout_rate', kpiName: 'Stockout Rate', clientValue: 4.8, industryAverage: 3.2, topQuartile: 1.4, bottomQuartile: 6.8, unit: '%', variance: 1.6, variancePercent: 50.0, position: 'below_average', recommendation: 'Critical: Stockout rate is 50% above industry average. Immediate action required on inventory replenishment strategy.' },
  { kpiId: 'market_share', kpiName: 'Market Share', clientValue: 14.6, industryAverage: 12.8, topQuartile: 22.4, bottomQuartile: 6.2, unit: '%', variance: 1.8, variancePercent: 14.1, position: 'top_quartile' },
];

export const BANKING_BENCHMARKS: BenchmarkComparison[] = [
  { kpiId: 'cost_income_ratio', kpiName: 'Cost-to-Income Ratio', clientValue: 58.4, industryAverage: 62.8, topQuartile: 48.2, bottomQuartile: 74.6, unit: '%', variance: -4.4, variancePercent: -7.0, position: 'top_quartile' },
  { kpiId: 'net_interest_margin', kpiName: 'Net Interest Margin', clientValue: 3.42, industryAverage: 3.18, topQuartile: 4.62, bottomQuartile: 2.14, unit: '%', variance: 0.24, variancePercent: 7.5, position: 'top_quartile' },
  { kpiId: 'npa_ratio', kpiName: 'NPA Ratio', clientValue: 2.8, industryAverage: 2.4, topQuartile: 1.2, bottomQuartile: 4.8, unit: '%', variance: 0.4, variancePercent: 16.7, position: 'average', recommendation: 'NPA ratio is trending upward. Strengthen credit underwriting standards and enhance early warning systems.' },
  { kpiId: 'digital_adoption', kpiName: 'Digital Adoption Rate', clientValue: 68.4, industryAverage: 72.6, topQuartile: 88.4, bottomQuartile: 52.2, unit: '%', variance: -4.2, variancePercent: -5.8, position: 'below_average' },
  { kpiId: 'churn_rate', kpiName: 'Churn Rate', clientValue: 6.2, industryAverage: 7.8, topQuartile: 3.4, bottomQuartile: 12.6, unit: '%', variance: -1.6, variancePercent: -20.5, position: 'top_quartile' },
];

export const RETAIL_BENCHMARKS: BenchmarkComparison[] = [
  { kpiId: 'cart_abandonment', kpiName: 'Cart Abandonment Rate', clientValue: 68.4, industryAverage: 69.8, topQuartile: 58.2, bottomQuartile: 82.4, unit: '%', variance: -1.4, variancePercent: -2.0, position: 'average' },
  { kpiId: 'conversion_rate', kpiName: 'Conversion Rate', clientValue: 3.8, industryAverage: 3.2, topQuartile: 5.8, bottomQuartile: 1.4, unit: '%', variance: 0.6, variancePercent: 18.8, position: 'top_quartile' },
  { kpiId: 'roas', kpiName: 'ROAS', clientValue: 4.2, industryAverage: 3.8, topQuartile: 6.4, bottomQuartile: 2.2, unit: 'x', variance: 0.4, variancePercent: 10.5, position: 'top_quartile' },
  { kpiId: 'return_rate', kpiName: 'Return Rate', clientValue: 18.2, industryAverage: 16.4, topQuartile: 10.8, bottomQuartile: 24.6, unit: '%', variance: 1.8, variancePercent: 11.0, position: 'below_average', recommendation: 'Return rate is above average. Improve product descriptions, sizing guides, and customer reviews to reduce returns.' },
  { kpiId: 'aov', kpiName: 'Average Order Value', clientValue: 84.6, industryAverage: 78.2, topQuartile: 112.4, bottomQuartile: 48.6, unit: '$', variance: 6.4, variancePercent: 8.2, position: 'top_quartile' },
  { kpiId: 'nps', kpiName: 'NPS', clientValue: 58, industryAverage: 48, topQuartile: 72, bottomQuartile: 22, unit: 'score', variance: 10, variancePercent: 20.8, position: 'top_quartile' },
];

export const MANUFACTURING_BENCHMARKS: BenchmarkComparison[] = [
  { kpiId: 'oee', kpiName: 'OEE', clientValue: 74.6, industryAverage: 77.2, topQuartile: 88.4, bottomQuartile: 62.8, unit: '%', variance: -2.6, variancePercent: -3.4, position: 'below_average', recommendation: 'OEE is below industry average. Focus on reducing planned downtime and improving changeover efficiency through SMED methodology.' },
  { kpiId: 'defect_rate', kpiName: 'Defect Rate', clientValue: 2.4, industryAverage: 2.8, topQuartile: 0.8, bottomQuartile: 5.4, unit: '%', variance: -0.4, variancePercent: -14.3, position: 'top_quartile' },
  { kpiId: 'downtime', kpiName: 'Downtime', clientValue: 6.8, industryAverage: 7.4, topQuartile: 3.2, bottomQuartile: 12.8, unit: '%', variance: -0.6, variancePercent: -8.1, position: 'top_quartile' },
  { kpiId: 'inventory_days', kpiName: 'Inventory Days', clientValue: 24.6, industryAverage: 22.4, topQuartile: 14.8, bottomQuartile: 34.6, unit: 'days', variance: 2.2, variancePercent: 9.8, position: 'below_average' },
  { kpiId: 'labor_productivity', kpiName: 'Labor Productivity', clientValue: 124600, industryAverage: 118400, topQuartile: 156800, bottomQuartile: 84200, unit: '$/FTE', variance: 6200, variancePercent: 5.2, position: 'top_quartile' },
];

export const getBenchmarksByIndustry = (industry: string): BenchmarkComparison[] => {
  const map: Record<string, BenchmarkComparison[]> = {
    healthcare: HEALTHCARE_BENCHMARKS,
    fmcg: FMCG_BENCHMARKS,
    banking: BANKING_BENCHMARKS,
    retail: RETAIL_BENCHMARKS,
    manufacturing: MANUFACTURING_BENCHMARKS,
  };
  return map[industry] || [];
};

export const getBenchmarkPosition = (
  value: number,
  industryAverage: number,
  topQuartile: number,
  bottomQuartile: number,
  lowerIsBetter = false
): { color: string; label: string } => {
  if (lowerIsBetter) {
    if (value <= topQuartile) return { color: 'text-emerald-400', label: 'Top Quartile' };
    if (value <= industryAverage) return { color: 'text-blue-400', label: 'Above Average' };
    if (value <= bottomQuartile) return { color: 'text-amber-400', label: 'Below Average' };
    return { color: 'text-red-400', label: 'Bottom Quartile' };
  }
  if (value >= topQuartile) return { color: 'text-emerald-400', label: 'Top Quartile' };
  if (value >= industryAverage) return { color: 'text-blue-400', label: 'Above Average' };
  if (value >= bottomQuartile) return { color: 'text-amber-400', label: 'Below Average' };
  return { color: 'text-red-400', label: 'Bottom Quartile' };
};

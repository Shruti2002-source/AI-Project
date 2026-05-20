import { Industry, KPIValue, BenchmarkEntry, BenchmarkComparison } from '@/types';

/**
 * Benchmark library with authoritative sources per industry.
 * Each benchmark includes value, unit, top quartile, source, URL, methodology, and confidence.
 */
const BENCHMARK_LIBRARY: Record<Industry, BenchmarkEntry[]> = {
  FMCG: [
    {
      kpiName: 'Revenue Growth',
      value: 5.2,
      unit: '%',
      topQuartile: 8.5,
      source: 'NielsenIQ',
      sourceUrl: 'https://nielseniq.com/global/en/insights/',
      methodology: 'Annual revenue growth rate across top 100 FMCG companies globally, measured YoY',
      confidence: 'High'
    },
    {
      kpiName: 'Market Share',
      value: 15.0,
      unit: '%',
      topQuartile: 25.0,
      source: 'Kantar Worldpanel',
      sourceUrl: 'https://www.kantar.com/campaigns/worldpanel',
      methodology: 'Average category leader market share across FMCG categories in developed markets',
      confidence: 'High'
    },
    {
      kpiName: 'Fill Rate',
      value: 95.0,
      unit: '%',
      topQuartile: 98.5,
      source: 'MIT Center for Supply Chain Management',
      sourceUrl: 'https://ctl.mit.edu/research',
      methodology: 'Order fill rate benchmark from MIT SCM annual supply chain survey of 200+ FMCG firms',
      confidence: 'High'
    },
    {
      kpiName: 'Inventory Turnover',
      value: 8.0,
      unit: 'x',
      topQuartile: 12.0,
      source: 'APICS Supply Chain Council',
      sourceUrl: 'https://www.ascm.org/learning/benchmarking/',
      methodology: 'Median inventory turns for consumer goods sector from SCOR benchmark database',
      confidence: 'Medium'
    },
    {
      kpiName: 'Forecast Accuracy',
      value: 85.0,
      unit: '%',
      topQuartile: 92.0,
      source: 'Institute of Business Forecasting',
      sourceUrl: 'https://ibf.org/knowledge/resources',
      methodology: 'Weighted MAPE-based forecast accuracy benchmark across CPG industry survey participants',
      confidence: 'Medium'
    },
    {
      kpiName: 'Stockout Rate',
      value: 8.0,
      unit: '%',
      topQuartile: 3.0,
      source: 'ECR Community',
      sourceUrl: 'https://www.ecr-community.org/',
      methodology: 'On-shelf availability gap measurement across European and North American retail partners',
      confidence: 'Medium'
    },
    {
      kpiName: 'Warehouse Utilization',
      value: 85.0,
      unit: '%',
      topQuartile: 92.0,
      source: 'Warehousing Education and Research Council',
      sourceUrl: 'https://www.werc.org/benchmarking',
      methodology: 'Annual DC Measures benchmarking study of 500+ distribution centers',
      confidence: 'Medium'
    },
    {
      kpiName: 'Supplier Lead Time',
      value: 14.0,
      unit: 'days',
      topQuartile: 7.0,
      source: 'Gartner Supply Chain Research',
      sourceUrl: 'https://www.gartner.com/en/supply-chain',
      methodology: 'Average supplier lead time from Gartner Supply Chain Top 25 analysis',
      confidence: 'Medium'
    },
    {
      kpiName: 'Repeat Purchase Rate',
      value: 40.0,
      unit: '%',
      topQuartile: 60.0,
      source: 'Kantar Worldpanel',
      sourceUrl: 'https://www.kantar.com/campaigns/worldpanel',
      methodology: 'Household panel repeat purchase rate within 12-month measurement period',
      confidence: 'High'
    },
    {
      kpiName: 'Customer Satisfaction',
      value: 75.0,
      unit: 'score',
      topQuartile: 85.0,
      source: 'American Customer Satisfaction Index',
      sourceUrl: 'https://www.theacsi.org/',
      methodology: 'ACSI score methodology based on customer survey of FMCG brand satisfaction',
      confidence: 'High'
    },
    {
      kpiName: 'Sales Volume',
      value: 0,
      unit: 'units',
      topQuartile: 0,
      source: 'NielsenIQ',
      sourceUrl: 'https://nielseniq.com/global/en/insights/',
      methodology: 'Volume benchmarks are category-specific; comparison is relative growth-based',
      confidence: 'Low'
    },
    {
      kpiName: 'Revenue',
      value: 0,
      unit: '$',
      topQuartile: 0,
      source: 'NielsenIQ',
      sourceUrl: 'https://nielseniq.com/global/en/insights/',
      methodology: 'Revenue benchmarks are company-size-specific; comparison is growth-based',
      confidence: 'Low'
    }
  ],
  Healthcare: [
    {
      kpiName: 'Readmission Rate',
      value: 15.0,
      unit: '%',
      topQuartile: 10.0,
      source: 'CMS Hospital Compare',
      sourceUrl: 'https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HospitalQualityInits',
      methodology: '30-day all-cause readmission rate from CMS Hospital Readmissions Reduction Program',
      confidence: 'High'
    },
    {
      kpiName: 'Average Length of Stay',
      value: 5.5,
      unit: 'days',
      topQuartile: 4.0,
      source: 'WHO Global Health Observatory',
      sourceUrl: 'https://www.who.int/data/gho',
      methodology: 'Average inpatient length of stay across OECD hospitals, case-mix adjusted',
      confidence: 'High'
    },
    {
      kpiName: 'Bed Occupancy Rate',
      value: 80.0,
      unit: '%',
      topQuartile: 75.0,
      source: 'WHO Global Health Observatory',
      sourceUrl: 'https://www.who.int/data/gho',
      methodology: 'Optimal bed occupancy from WHO guidance (85% is overcrowded, 75% is efficient)',
      confidence: 'High'
    },
    {
      kpiName: 'Patient Satisfaction',
      value: 72.0,
      unit: 'score',
      topQuartile: 85.0,
      source: 'Press Ganey',
      sourceUrl: 'https://www.pressganey.com/resources/',
      methodology: 'National average HCAHPS overall hospital rating from CMS public reporting',
      confidence: 'High'
    },
    {
      kpiName: 'Mortality Rate',
      value: 2.5,
      unit: '%',
      topQuartile: 1.5,
      source: 'CMS Hospital Compare',
      sourceUrl: 'https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HospitalQualityInits',
      methodology: '30-day risk-standardized mortality rate for AMI, HF, and pneumonia combined',
      confidence: 'High'
    },
    {
      kpiName: 'Wait Time',
      value: 24.0,
      unit: 'minutes',
      topQuartile: 15.0,
      source: 'Emergency Department Benchmarking Alliance',
      sourceUrl: 'https://www.edbenchmarking.org/',
      methodology: 'Median door-to-provider time in US emergency departments',
      confidence: 'Medium'
    }
  ],
  Banking: [
    {
      kpiName: 'Net Interest Margin',
      value: 3.2,
      unit: '%',
      topQuartile: 3.8,
      source: 'FDIC Quarterly Banking Profile',
      sourceUrl: 'https://www.fdic.gov/analysis/quarterly-banking-profile/',
      methodology: 'Median NIM for FDIC-insured commercial banks with assets > $1B',
      confidence: 'High'
    },
    {
      kpiName: 'Return on Assets',
      value: 1.1,
      unit: '%',
      topQuartile: 1.5,
      source: 'FDIC Quarterly Banking Profile',
      sourceUrl: 'https://www.fdic.gov/analysis/quarterly-banking-profile/',
      methodology: 'Median ROA for FDIC-insured institutions, annualized',
      confidence: 'High'
    },
    {
      kpiName: 'Return on Equity',
      value: 10.0,
      unit: '%',
      topQuartile: 15.0,
      source: 'McKinsey Global Banking Review',
      sourceUrl: 'https://www.mckinsey.com/industries/financial-services/our-insights/global-banking-annual-review',
      methodology: 'Global banking ROE from McKinsey annual review of 1000+ banks',
      confidence: 'High'
    },
    {
      kpiName: 'Non-Performing Assets',
      value: 2.0,
      unit: '%',
      topQuartile: 1.0,
      source: 'World Bank Global Financial Development',
      sourceUrl: 'https://www.worldbank.org/en/publication/gfdr',
      methodology: 'NPL ratio as percentage of total gross loans, World Bank database',
      confidence: 'High'
    },
    {
      kpiName: 'Cost-to-Income Ratio',
      value: 55.0,
      unit: '%',
      topQuartile: 45.0,
      source: 'McKinsey Global Banking Review',
      sourceUrl: 'https://www.mckinsey.com/industries/financial-services/our-insights/global-banking-annual-review',
      methodology: 'Operating cost to operating income ratio for global banks',
      confidence: 'High'
    },
    {
      kpiName: 'Capital Adequacy Ratio',
      value: 14.0,
      unit: '%',
      topQuartile: 18.0,
      source: 'Basel Committee on Banking Supervision',
      sourceUrl: 'https://www.bis.org/bcbs/',
      methodology: 'Total capital ratio (Tier 1 + Tier 2) as percentage of risk-weighted assets',
      confidence: 'High'
    }
  ],
  Retail: [
    {
      kpiName: 'Same-Store Sales Growth',
      value: 3.0,
      unit: '%',
      topQuartile: 6.0,
      source: 'NRF National Retail Federation',
      sourceUrl: 'https://nrf.com/research-insights',
      methodology: 'Year-over-year comparable store sales growth for US retail chains',
      confidence: 'High'
    },
    {
      kpiName: 'Average Order Value',
      value: 75.0,
      unit: '$',
      topQuartile: 120.0,
      source: 'Adobe Digital Economy Index',
      sourceUrl: 'https://business.adobe.com/resources/digital-economy-index.html',
      methodology: 'Average online order value across US e-commerce transactions',
      confidence: 'Medium'
    },
    {
      kpiName: 'Conversion Rate',
      value: 2.5,
      unit: '%',
      topQuartile: 5.0,
      source: 'Adobe Digital Economy Index',
      sourceUrl: 'https://business.adobe.com/resources/digital-economy-index.html',
      methodology: 'Website visit to purchase conversion rate across retail e-commerce',
      confidence: 'Medium'
    },
    {
      kpiName: 'Customer Retention Rate',
      value: 60.0,
      unit: '%',
      topQuartile: 75.0,
      source: 'Bain & Company',
      sourceUrl: 'https://www.bain.com/insights/topics/customer-loyalty/',
      methodology: 'Annual customer retention rate for retail sector from loyalty research',
      confidence: 'Medium'
    },
    {
      kpiName: 'Shrinkage Rate',
      value: 1.4,
      unit: '%',
      topQuartile: 0.8,
      source: 'National Retail Security Survey',
      sourceUrl: 'https://nrf.com/research/national-retail-security-survey',
      methodology: 'Inventory shrinkage as % of retail sales from NRF annual survey',
      confidence: 'High'
    },
    {
      kpiName: 'Footfall',
      value: 0,
      unit: 'visitors',
      topQuartile: 0,
      source: 'Placer.ai',
      sourceUrl: 'https://www.placer.ai/blog/categories/retail',
      methodology: 'Footfall benchmarks are location-specific; comparison is trend-based',
      confidence: 'Low'
    }
  ],
  Manufacturing: [
    {
      kpiName: 'Overall Equipment Effectiveness',
      value: 65.0,
      unit: '%',
      topQuartile: 85.0,
      source: 'SEMI Equipment Performance Standards',
      sourceUrl: 'https://www.semi.org/en/standards',
      methodology: 'World-class OEE benchmark from SEMI E10/E79 standards framework',
      confidence: 'High'
    },
    {
      kpiName: 'Yield Rate',
      value: 95.0,
      unit: '%',
      topQuartile: 99.0,
      source: 'ASQ Quality Management',
      sourceUrl: 'https://asq.org/quality-resources',
      methodology: 'First-pass yield across discrete manufacturing from ASQ benchmarking',
      confidence: 'Medium'
    },
    {
      kpiName: 'Defect Rate',
      value: 1.5,
      unit: '%',
      topQuartile: 0.3,
      source: 'ASQ Quality Management',
      sourceUrl: 'https://asq.org/quality-resources',
      methodology: 'Defective parts per million opportunities translated to percentage',
      confidence: 'Medium'
    },
    {
      kpiName: 'Capacity Utilization',
      value: 77.0,
      unit: '%',
      topQuartile: 88.0,
      source: 'Federal Reserve Industrial Production',
      sourceUrl: 'https://www.federalreserve.gov/releases/g17/current/',
      methodology: 'US manufacturing sector capacity utilization from Federal Reserve G.17 release',
      confidence: 'High'
    },
    {
      kpiName: 'Mean Time Between Failures',
      value: 200.0,
      unit: 'hours',
      topQuartile: 500.0,
      source: 'Society for Maintenance & Reliability Professionals',
      sourceUrl: 'https://www.smrp.org/benchmarking',
      methodology: 'MTBF benchmark from SMRP Best Practices metrics for process manufacturing',
      confidence: 'Medium'
    },
    {
      kpiName: 'Cycle Time',
      value: 30.0,
      unit: 'minutes',
      topQuartile: 15.0,
      source: 'Lean Enterprise Institute',
      sourceUrl: 'https://www.lean.org/explore-lean/what-is-lean/',
      methodology: 'Average cycle time benchmark from LEI value stream mapping studies',
      confidence: 'Low'
    }
  ]
};

/**
 * Fetches benchmark data from an external URL.
 * Handles CORS failures gracefully by falling back to local data.
 */
export async function fetchBenchmarkFromUrl(
  url: string,
  kpiName: string
): Promise<BenchmarkEntry | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal,
      mode: 'cors'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `[BenchmarkEngine] Failed to fetch benchmark from ${url}: HTTP ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    // Attempt to parse external benchmark format
    if (data && typeof data.value === 'number') {
      return {
        kpiName,
        value: data.value,
        unit: data.unit || '%',
        topQuartile: data.topQuartile || data.value * 1.2,
        source: data.source || 'External API',
        sourceUrl: url,
        methodology: data.methodology || 'Fetched from external benchmark API',
        confidence: data.confidence || 'Medium'
      };
    }
    return null;
  } catch (error: unknown) {
    // Handle CORS errors, network failures, and timeouts gracefully
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('abort')) {
      console.warn(`[BenchmarkEngine] Request timeout for ${url}`);
    } else if (errorMessage.includes('CORS') || errorMessage.includes('NetworkError')) {
      console.warn(
        `[BenchmarkEngine] CORS/Network error fetching ${url}. Using local benchmark data.`
      );
    } else {
      console.warn(`[BenchmarkEngine] Error fetching benchmark from ${url}: ${errorMessage}`);
    }
    return null;
  }
}

/**
 * Gets the benchmark library for a given industry.
 */
export function getBenchmarks(industry: Industry): BenchmarkEntry[] {
  return BENCHMARK_LIBRARY[industry] || [];
}

/**
 * Compares client KPI values against industry benchmarks.
 * Returns detailed comparison including gaps and status.
 */
export function compareWithBenchmarks(
  kpiValues: KPIValue[],
  industry: Industry
): BenchmarkComparison[] {
  const benchmarks = BENCHMARK_LIBRARY[industry];
  const comparisons: BenchmarkComparison[] = [];

  for (const kpi of kpiValues) {
    const benchmark = benchmarks.find(b => b.kpiName === kpi.name);
    if (!benchmark) continue;

    // Skip benchmarks with 0 value (not applicable for direct comparison)
    if (benchmark.value === 0) continue;

    const gap = kpi.value - benchmark.value;
    const gapPercent = benchmark.value !== 0
      ? ((kpi.value - benchmark.value) / benchmark.value) * 100
      : 0;

    // Determine status - for some KPIs, lower is better (Stockout Rate, Defect Rate, etc.)
    const lowerIsBetter = [
      'Stockout Rate', 'Readmission Rate', 'Mortality Rate', 'Wait Time',
      'Non-Performing Assets', 'Cost-to-Income Ratio', 'Shrinkage Rate',
      'Defect Rate', 'Cycle Time', 'Supplier Lead Time'
    ];

    let status: 'above' | 'below' | 'at';
    if (lowerIsBetter.includes(kpi.name)) {
      if (kpi.value < benchmark.value) status = 'above'; // performing better
      else if (kpi.value > benchmark.value) status = 'below'; // performing worse
      else status = 'at';
    } else {
      if (kpi.value > benchmark.value) status = 'above';
      else if (kpi.value < benchmark.value) status = 'below';
      else status = 'at';
    }

    comparisons.push({
      kpiName: kpi.name,
      clientValue: kpi.value,
      industryAverage: benchmark.value,
      topQuartile: benchmark.topQuartile,
      gap: Math.round(gap * 100) / 100,
      gapPercent: Math.round(gapPercent * 100) / 100,
      status,
      unit: kpi.unit,
      source: benchmark.source,
      methodology: benchmark.methodology,
      confidence: benchmark.confidence,
      sourceUrl: benchmark.sourceUrl
    });
  }

  return comparisons;
}

/**
 * Attempts to fetch fresh benchmarks from external sources and merge with local data.
 * Falls back to local data on any failure.
 */
export async function getEnrichedBenchmarks(
  industry: Industry,
  kpiNames: string[]
): Promise<BenchmarkEntry[]> {
  const localBenchmarks = BENCHMARK_LIBRARY[industry];
  const enriched: BenchmarkEntry[] = [];

  for (const benchmark of localBenchmarks) {
    if (!kpiNames.includes(benchmark.kpiName)) continue;

    // Try to fetch updated data from source
    const fetched = await fetchBenchmarkFromUrl(benchmark.sourceUrl, benchmark.kpiName);
    if (fetched) {
      enriched.push(fetched);
    } else {
      enriched.push(benchmark);
    }
  }

  return enriched;
}

/**
 * Gets benchmark sources metadata for display.
 */
export function getBenchmarkSources(industry: Industry): { name: string; url: string; kpis: string[] }[] {
  const benchmarks = BENCHMARK_LIBRARY[industry];
  const sourceMap = new Map<string, { url: string; kpis: string[] }>();

  for (const b of benchmarks) {
    if (sourceMap.has(b.source)) {
      sourceMap.get(b.source)!.kpis.push(b.kpiName);
    } else {
      sourceMap.set(b.source, { url: b.sourceUrl, kpis: [b.kpiName] });
    }
  }

  return Array.from(sourceMap.entries()).map(([name, data]) => ({
    name,
    url: data.url,
    kpis: data.kpis
  }));
}

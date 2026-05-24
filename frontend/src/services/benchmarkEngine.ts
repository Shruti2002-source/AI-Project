import { KPIValue, BenchmarkEntry, BenchmarkComparison } from '@/types';

/**
 * Comprehensive benchmark library sourced from authoritative published research.
 * Organized by industry with source attribution.
 */
const BENCHMARK_LIBRARY: Record<string, BenchmarkEntry[]> = {
  FMCG: [
    { kpiName: 'Revenue Growth', value: 5.2, unit: '%', topQuartile: 8.5, source: 'NielsenIQ State of CPG & Retail Report 2024', sourceUrl: 'https://nielseniq.com/global/en/insights/', methodology: 'Annual revenue growth across top 100 FMCG companies globally', confidence: 'High' },
    { kpiName: 'Gross Margin', value: 38, unit: '%', topQuartile: 48, source: 'McKinsey Consumer Packaged Goods Practice', sourceUrl: 'https://www.mckinsey.com/industries/consumer-packaged-goods/', methodology: 'Gross profit margin median for global CPG firms (McKinsey 2023)', confidence: 'High' },
    { kpiName: 'Operating Margin', value: 14, unit: '%', topQuartile: 22, source: 'Deloitte Global Powers of Consumer Products 2024', sourceUrl: 'https://www.deloitte.com/global/en/Industries/consumer.html', methodology: 'Operating income as % of revenue for top 250 CPG companies', confidence: 'High' },
    { kpiName: 'Market Share', value: 15, unit: '%', topQuartile: 25, source: 'Kantar Worldpanel BrandFootprint 2024', sourceUrl: 'https://www.kantar.com/campaigns/worldpanel', methodology: 'Average category leader share across FMCG categories in developed markets', confidence: 'High' },
    { kpiName: 'Fill Rate', value: 95, unit: '%', topQuartile: 98.5, source: 'MIT Center for Transportation & Logistics', sourceUrl: 'https://ctl.mit.edu/research', methodology: 'Order fill rate from MIT SCM annual supply chain survey (n=200+ firms)', confidence: 'High' },
    { kpiName: 'Inventory Turnover', value: 8, unit: 'x', topQuartile: 12, source: 'ASCM (APICS) SCOR Benchmark Database', sourceUrl: 'https://www.ascm.org/learning/benchmarking/', methodology: 'Median inventory turns for consumer goods sector from SCOR model', confidence: 'High' },
    { kpiName: 'Forecast Accuracy', value: 85, unit: '%', topQuartile: 92, source: 'Institute of Business Forecasting & Planning', sourceUrl: 'https://ibf.org/knowledge/resources', methodology: 'Weighted MAPE-based forecast accuracy benchmark (IBF 2023 survey)', confidence: 'Medium' },
    { kpiName: 'Stockout Rate', value: 8, unit: '%', topQuartile: 3, source: 'ECR Community & IHL Group', sourceUrl: 'https://www.ecr-community.org/', methodology: 'On-shelf availability gap across European/NA retail (ECR 2023 report)', confidence: 'High' },
    { kpiName: 'Customer Satisfaction', value: 75, unit: 'score', topQuartile: 85, source: 'American Customer Satisfaction Index (ACSI)', sourceUrl: 'https://www.theacsi.org/', methodology: 'ACSI national benchmark for FMCG/CPG sector (100-point scale)', confidence: 'High' },
    { kpiName: 'Return on Assets', value: 8, unit: '%', topQuartile: 14, source: 'Stern NYU Damodaran Industry Averages', sourceUrl: 'https://pages.stern.nyu.edu/~adamodar/', methodology: 'ROA for Food Processing & Household Products sectors (Jan 2024 data)', confidence: 'High' },
    { kpiName: 'Revenue Per Employee', value: 350000, unit: 'USD', topQuartile: 550000, source: 'Deloitte Global Powers of Consumer Products', sourceUrl: 'https://www.deloitte.com/global/en/Industries/consumer.html', methodology: 'Revenue per FTE for top-250 global CPG firms', confidence: 'Medium' },
    { kpiName: 'Distribution Coverage', value: 70, unit: '%', topQuartile: 90, source: 'NielsenIQ Retail Measurement Services', sourceUrl: 'https://nielseniq.com/global/en/solutions/retail-measurement/', methodology: 'Numeric distribution (% of stores stocking) for category leaders', confidence: 'Medium' },
  ],
  Healthcare: [
    { kpiName: 'Readmission Rate', value: 15, unit: '%', topQuartile: 10, source: 'CMS Hospital Readmissions Reduction Program', sourceUrl: 'https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HospitalQualityInits', methodology: '30-day all-cause readmission rate (CMS HRRP national avg)', confidence: 'High' },
    { kpiName: 'Average Length of Stay', value: 5.5, unit: 'days', topQuartile: 4.2, source: 'OECD Health Statistics 2024', sourceUrl: 'https://www.oecd.org/health/health-data.htm', methodology: 'Average inpatient length of stay across OECD nations (case-mix adjusted)', confidence: 'High' },
    { kpiName: 'Bed Occupancy Rate', value: 78, unit: '%', topQuartile: 72, source: 'WHO Global Health Observatory', sourceUrl: 'https://www.who.int/data/gho', methodology: 'WHO optimal range 75-85%; below 75% is efficient (WHO 2023 guidance)', confidence: 'High' },
    { kpiName: 'Patient Satisfaction', value: 72, unit: 'score', topQuartile: 85, source: 'Press Ganey / HCAHPS National Database', sourceUrl: 'https://www.pressganey.com/', methodology: 'National average HCAHPS top-box score for overall hospital rating', confidence: 'High' },
    { kpiName: 'Mortality Rate', value: 2.5, unit: '%', topQuartile: 1.5, source: 'CMS Hospital Compare', sourceUrl: 'https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HospitalQualityInits', methodology: '30-day risk-standardized mortality for AMI, HF, pneumonia (combined)', confidence: 'High' },
    { kpiName: 'Operating Margin', value: 3.5, unit: '%', topQuartile: 8, source: 'Kaufman Hall National Hospital Flash Report', sourceUrl: 'https://www.kaufmanhall.com/resources/research', methodology: 'Median operating margin for US hospitals (Kaufman Hall 2024 data)', confidence: 'High' },
    { kpiName: 'Revenue Per Bed', value: 2500000, unit: 'USD', topQuartile: 3800000, source: 'AHA Hospital Statistics (American Hospital Association)', sourceUrl: 'https://www.aha.org/statistics', methodology: 'Net patient revenue per staffed bed for community hospitals', confidence: 'Medium' },
    { kpiName: 'Staff Turnover', value: 22, unit: '%', topQuartile: 14, source: 'NSI National Health Care Retention & RN Staffing Report 2024', sourceUrl: 'https://www.nsinursingsolutions.com/', methodology: 'Annualized hospital employee turnover rate (all staff)', confidence: 'High' },
    { kpiName: 'Cost Per Discharge', value: 15000, unit: 'USD', topQuartile: 11000, source: 'HCUP National Inpatient Sample (AHRQ)', sourceUrl: 'https://hcup-us.ahrq.gov/', methodology: 'Mean cost per inpatient discharge across US hospitals (2023)', confidence: 'High' },
  ],
  'Banking & Financial Services': [
    { kpiName: 'Net Interest Margin', value: 3.2, unit: '%', topQuartile: 3.8, source: 'FDIC Quarterly Banking Profile Q4 2024', sourceUrl: 'https://www.fdic.gov/analysis/quarterly-banking-profile/', methodology: 'Median NIM for FDIC-insured commercial banks with assets >$1B', confidence: 'High' },
    { kpiName: 'Return on Assets', value: 1.1, unit: '%', topQuartile: 1.5, source: 'FDIC Quarterly Banking Profile Q4 2024', sourceUrl: 'https://www.fdic.gov/analysis/quarterly-banking-profile/', methodology: 'Median ROA for FDIC-insured institutions, annualized', confidence: 'High' },
    { kpiName: 'Return on Equity', value: 10, unit: '%', topQuartile: 15, source: 'McKinsey Global Banking Annual Review 2024', sourceUrl: 'https://www.mckinsey.com/industries/financial-services/our-insights/global-banking-annual-review', methodology: 'Global banking ROE from McKinsey annual review (n=1000+ banks)', confidence: 'High' },
    { kpiName: 'Non-Performing Assets', value: 2, unit: '%', topQuartile: 1, source: 'World Bank Global Financial Development Database', sourceUrl: 'https://www.worldbank.org/en/publication/gfdr', methodology: 'NPL ratio as % of total gross loans (World Bank 2024)', confidence: 'High' },
    { kpiName: 'Cost-to-Income Ratio', value: 55, unit: '%', topQuartile: 45, source: 'McKinsey Global Banking Annual Review 2024', sourceUrl: 'https://www.mckinsey.com/industries/financial-services/our-insights/global-banking-annual-review', methodology: 'Operating cost to operating income ratio for global banks', confidence: 'High' },
    { kpiName: 'Capital Adequacy Ratio', value: 14, unit: '%', topQuartile: 18, source: 'BIS Basel Committee on Banking Supervision', sourceUrl: 'https://www.bis.org/bcbs/', methodology: 'Total capital ratio (Tier 1 + Tier 2) as % of risk-weighted assets', confidence: 'High' },
    { kpiName: 'Customer Satisfaction', value: 76, unit: 'score', topQuartile: 84, source: 'J.D. Power U.S. Retail Banking Satisfaction Study 2024', sourceUrl: 'https://www.jdpower.com/business/financial-services', methodology: '1000-point scale normalized to 100; national bank average', confidence: 'High' },
    { kpiName: 'Digital Adoption Rate', value: 72, unit: '%', topQuartile: 88, source: 'McKinsey Digital Banking Survey', sourceUrl: 'https://www.mckinsey.com/industries/financial-services/', methodology: '% of customers using digital channels as primary banking method', confidence: 'Medium' },
    { kpiName: 'Loan Growth', value: 5, unit: '%', topQuartile: 9, source: 'FDIC Quarterly Banking Profile', sourceUrl: 'https://www.fdic.gov/analysis/quarterly-banking-profile/', methodology: 'Year-over-year growth in total loans and leases', confidence: 'High' },
  ],
  'Retail & E-commerce': [
    { kpiName: 'Same-Store Sales Growth', value: 3, unit: '%', topQuartile: 6, source: 'NRF National Retail Federation State of Retail 2024', sourceUrl: 'https://nrf.com/research-insights', methodology: 'YoY comparable store sales growth for US retail chains', confidence: 'High' },
    { kpiName: 'Gross Margin', value: 34, unit: '%', topQuartile: 45, source: 'Deloitte Retail Industry Outlook 2024', sourceUrl: 'https://www.deloitte.com/us/en/Industries/retail-distribution.html', methodology: 'Gross profit margin for omnichannel retailers (Deloitte analysis)', confidence: 'High' },
    { kpiName: 'Conversion Rate', value: 2.5, unit: '%', topQuartile: 5, source: 'Adobe Digital Economy Index 2024', sourceUrl: 'https://business.adobe.com/resources/digital-economy-index.html', methodology: 'Website visit to purchase conversion (US e-commerce, Adobe Analytics)', confidence: 'High' },
    { kpiName: 'Average Order Value', value: 75, unit: 'USD', topQuartile: 120, source: 'Adobe Digital Economy Index 2024', sourceUrl: 'https://business.adobe.com/resources/digital-economy-index.html', methodology: 'Average online order value across US e-commerce transactions', confidence: 'Medium' },
    { kpiName: 'Customer Retention Rate', value: 60, unit: '%', topQuartile: 75, source: 'Bain & Company Loyalty Insights', sourceUrl: 'https://www.bain.com/insights/topics/customer-loyalty/', methodology: 'Annual customer retention rate for retail sector', confidence: 'High' },
    { kpiName: 'Inventory Turnover', value: 8, unit: 'x', topQuartile: 14, source: 'Stern NYU Damodaran Industry Averages', sourceUrl: 'https://pages.stern.nyu.edu/~adamodar/', methodology: 'Inventory turnover for General Retail sector (Jan 2024)', confidence: 'High' },
    { kpiName: 'Revenue Per Square Foot', value: 400, unit: 'USD', topQuartile: 700, source: 'CoStar Group & ICSC Research', sourceUrl: 'https://www.icsc.com/industry-research', methodology: 'Annual sales per sq ft for US shopping centers (CoStar 2024)', confidence: 'Medium' },
    { kpiName: 'Customer Satisfaction', value: 76, unit: 'score', topQuartile: 84, source: 'ACSI Retail Report 2024', sourceUrl: 'https://www.theacsi.org/industries/retail/', methodology: 'ACSI score for internet & specialty retail (100-point scale)', confidence: 'High' },
    { kpiName: 'Return Rate', value: 16, unit: '%', topQuartile: 8, source: 'NRF Consumer Returns in the Retail Industry 2024', sourceUrl: 'https://nrf.com/research/consumer-returns', methodology: 'Total return rate as % of sales (NRF/Appriss 2024 report)', confidence: 'High' },
    { kpiName: 'Shrinkage Rate', value: 1.6, unit: '%', topQuartile: 0.8, source: 'NRF National Retail Security Survey 2024', sourceUrl: 'https://nrf.com/research/national-retail-security-survey', methodology: 'Inventory shrinkage as % of retail sales', confidence: 'High' },
  ],
  Manufacturing: [
    { kpiName: 'Overall Equipment Effectiveness', value: 65, unit: '%', topQuartile: 85, source: 'SEMI E10/E79 Standards & Seiichi Nakajima OEE Framework', sourceUrl: 'https://www.semi.org/en/standards', methodology: 'World-class OEE benchmark (Availability × Performance × Quality)', confidence: 'High' },
    { kpiName: 'Yield Rate', value: 95, unit: '%', topQuartile: 99, source: 'ASQ World Conference on Quality (American Society for Quality)', sourceUrl: 'https://asq.org/quality-resources', methodology: 'First-pass yield across discrete manufacturing (ASQ survey)', confidence: 'High' },
    { kpiName: 'Defect Rate', value: 1.5, unit: '%', topQuartile: 0.3, source: 'ASQ Quality Management Division', sourceUrl: 'https://asq.org/quality-resources', methodology: 'Defective PPM translated to percentage (Six Sigma target: 3.4 DPMO)', confidence: 'High' },
    { kpiName: 'Capacity Utilization', value: 77, unit: '%', topQuartile: 88, source: 'Federal Reserve G.17 Industrial Production & Capacity Utilization', sourceUrl: 'https://www.federalreserve.gov/releases/g17/current/', methodology: 'US manufacturing sector capacity utilization (Fed monthly release)', confidence: 'High' },
    { kpiName: 'On-Time Delivery', value: 85, unit: '%', topQuartile: 95, source: 'ASCM (APICS) Supply Chain Operations Reference (SCOR)', sourceUrl: 'https://www.ascm.org/learning/benchmarking/', methodology: 'Perfect order fulfillment rate (SCOR Level 1 metric)', confidence: 'High' },
    { kpiName: 'Scrap Rate', value: 5, unit: '%', topQuartile: 2, source: 'Lean Enterprise Institute', sourceUrl: 'https://www.lean.org/', methodology: 'Material scrap as % of total material input (LEI research)', confidence: 'Medium' },
    { kpiName: 'Inventory Turnover', value: 6, unit: 'x', topQuartile: 10, source: 'Stern NYU Damodaran Industry Averages', sourceUrl: 'https://pages.stern.nyu.edu/~adamodar/', methodology: 'Inventory turnover for Machinery & Industrial Goods (Jan 2024)', confidence: 'High' },
    { kpiName: 'Operating Margin', value: 10, unit: '%', topQuartile: 18, source: 'Deloitte Manufacturing Industry Outlook 2024', sourceUrl: 'https://www.deloitte.com/us/en/Industries/manufacturing.html', methodology: 'Operating income margin for US discrete manufacturers', confidence: 'High' },
    { kpiName: 'Labor Productivity', value: 85, unit: 'score', topQuartile: 95, source: 'Bureau of Labor Statistics Manufacturing Productivity', sourceUrl: 'https://www.bls.gov/lpc/', methodology: 'Output per hour index (2017=100) for US manufacturing', confidence: 'High' },
    { kpiName: 'Energy Cost Per Unit', value: 12, unit: '%', topQuartile: 7, source: 'U.S. EIA Manufacturing Energy Consumption Survey', sourceUrl: 'https://www.eia.gov/consumption/manufacturing/', methodology: 'Energy cost as % of total production cost (EIA MECS)', confidence: 'Medium' },
  ],
};

// Common aliases for fuzzy matching
const KPI_ALIASES: Record<string, string[]> = {
  'Revenue Growth': ['revenue_growth', 'sales_growth', 'growth_rate', 'top_line_growth', 'yoy_growth'],
  'Gross Margin': ['gross_margin', 'gross_profit_margin', 'gp_margin', 'gpm'],
  'Operating Margin': ['operating_margin', 'op_margin', 'ebit_margin', 'operating_profit_margin'],
  'Net Interest Margin': ['nim', 'net_interest_margin', 'interest_margin'],
  'Return on Assets': ['roa', 'return_on_assets', 'asset_return'],
  'Return on Equity': ['roe', 'return_on_equity', 'equity_return'],
  'Customer Satisfaction': ['customer_satisfaction', 'csat', 'satisfaction', 'nps', 'satisfaction_score', 'customer_score'],
  'Inventory Turnover': ['inventory_turnover', 'stock_turnover', 'inv_turnover', 'inventory_turns'],
  'Conversion Rate': ['conversion_rate', 'conversion', 'cvr', 'conv_rate'],
  'Fill Rate': ['fill_rate', 'order_fill_rate', 'service_level'],
  'Capacity Utilization': ['capacity_utilization', 'utilization', 'capacity_usage', 'plant_utilization'],
  'Average Order Value': ['aov', 'average_order_value', 'avg_order_value', 'basket_size'],
  'Customer Retention Rate': ['retention', 'customer_retention', 'retention_rate', 'repeat_rate'],
  'Cost-to-Income Ratio': ['cost_to_income', 'efficiency_ratio', 'cir', 'cost_income_ratio'],
  'Overall Equipment Effectiveness': ['oee', 'equipment_effectiveness', 'overall_equipment'],
  'Yield Rate': ['yield', 'yield_rate', 'first_pass_yield', 'fpy'],
  'Defect Rate': ['defect_rate', 'defects', 'reject_rate', 'scrap_rate_defect'],
  'On-Time Delivery': ['otd', 'on_time_delivery', 'delivery_rate', 'on_time', 'otif'],
  'Stockout Rate': ['stockout', 'stock_out', 'oos', 'out_of_stock'],
  'Same-Store Sales Growth': ['comp_sales', 'like_for_like', 'same_store', 'comp_store_sales'],
  'Readmission Rate': ['readmission', 'readmit_rate', '30_day_readmission'],
  'Patient Satisfaction': ['patient_satisfaction', 'hcahps', 'patient_experience'],
  'Bed Occupancy Rate': ['bed_occupancy', 'occupancy_rate', 'bed_utilization'],
  'Staff Turnover': ['turnover_rate', 'attrition', 'employee_turnover', 'staff_attrition'],
  'Shrinkage Rate': ['shrinkage', 'shrink', 'inventory_loss'],
  'Digital Adoption Rate': ['digital_adoption', 'digital_penetration', 'online_adoption'],
  'Revenue Per Square Foot': ['sales_per_sqft', 'rev_per_sqft', 'revenue_sqft'],
  'Distribution Coverage': ['distribution', 'numeric_distribution', 'store_coverage', 'availability'],
  'Loan Growth': ['loan_growth', 'credit_growth', 'lending_growth'],
  'Non-Performing Assets': ['npa', 'npl', 'non_performing', 'bad_loans'],
  'Capital Adequacy Ratio': ['car', 'capital_adequacy', 'crar', 'tier1_ratio'],
  'Scrap Rate': ['scrap', 'scrap_rate', 'material_waste', 'waste_rate'],
  'Labor Productivity': ['labor_productivity', 'workforce_productivity', 'output_per_worker'],
  'Return Rate': ['return_rate', 'returns', 'refund_rate'],
  'Forecast Accuracy': ['forecast_accuracy', 'demand_accuracy', 'planning_accuracy'],
};

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function findBenchmarkMatch(kpiName: string, benchmarks: BenchmarkEntry[]): BenchmarkEntry | null {
  const normalizedInput = normalize(kpiName);

  // 1. Exact name match
  const exact = benchmarks.find(b => normalize(b.kpiName) === normalizedInput);
  if (exact) return exact;

  // 2. Alias match
  for (const [benchName, aliases] of Object.entries(KPI_ALIASES)) {
    if (aliases.includes(normalizedInput) || aliases.some(a => normalizedInput.includes(a) || a.includes(normalizedInput))) {
      const match = benchmarks.find(b => b.kpiName === benchName);
      if (match) return match;
    }
  }

  // 3. Substring match (benchmark name contains input or vice versa)
  const substringMatch = benchmarks.find(b => {
    const normalizedBench = normalize(b.kpiName);
    return normalizedBench.includes(normalizedInput) || normalizedInput.includes(normalizedBench);
  });
  if (substringMatch) return substringMatch;

  // 4. Word overlap match (at least one significant word matches)
  const inputWords = normalizedInput.split('_').filter(w => w.length > 2);
  for (const bench of benchmarks) {
    const benchWords = normalize(bench.kpiName).split('_').filter(w => w.length > 2);
    const overlap = inputWords.filter(w => benchWords.some(bw => bw.includes(w) || w.includes(bw)));
    if (overlap.length > 0 && overlap.length >= inputWords.length * 0.5) {
      return bench;
    }
  }

  return null;
}

function resolveIndustryKey(industry: string): string {
  const normalized = normalize(industry);

  if (normalized.includes('fmcg') || normalized.includes('cpg') || normalized.includes('consumer_goods') || normalized.includes('food')) return 'FMCG';
  if (normalized.includes('health') || normalized.includes('hospital') || normalized.includes('pharma') || normalized.includes('medical')) return 'Healthcare';
  if (normalized.includes('bank') || normalized.includes('financ') || normalized.includes('insurance') || normalized.includes('fintech')) return 'Banking & Financial Services';
  if (normalized.includes('retail') || normalized.includes('ecommerce') || normalized.includes('e_commerce') || normalized.includes('commerce') || normalized.includes('shop')) return 'Retail & E-commerce';
  if (normalized.includes('manufactur') || normalized.includes('industrial') || normalized.includes('auto') || normalized.includes('machinery')) return 'Manufacturing';

  // Default: return all benchmarks combined
  return '';
}

export function getBenchmarks(industry: string): BenchmarkEntry[] {
  const key = resolveIndustryKey(industry);
  if (key && BENCHMARK_LIBRARY[key]) return BENCHMARK_LIBRARY[key];

  // If unknown industry, return combined set of most common benchmarks
  const combined: BenchmarkEntry[] = [];
  for (const entries of Object.values(BENCHMARK_LIBRARY)) {
    for (const entry of entries) {
      if (!combined.find(c => c.kpiName === entry.kpiName)) {
        combined.push(entry);
      }
    }
  }
  return combined;
}

export function compareWithBenchmarks(
  kpiValues: KPIValue[],
  industry: string
): BenchmarkComparison[] {
  const key = resolveIndustryKey(industry);
  const benchmarks = key && BENCHMARK_LIBRARY[key]
    ? BENCHMARK_LIBRARY[key]
    : Object.values(BENCHMARK_LIBRARY).flat();

  const comparisons: BenchmarkComparison[] = [];

  const lowerIsBetter = [
    'stockout_rate', 'readmission_rate', 'mortality_rate', 'wait_time',
    'non_performing_assets', 'cost_to_income_ratio', 'shrinkage_rate',
    'defect_rate', 'cycle_time', 'supplier_lead_time', 'scrap_rate',
    'return_rate', 'staff_turnover', 'bed_occupancy_rate', 'energy_cost_per_unit',
  ];

  for (const kpi of kpiValues) {
    const benchmark = findBenchmarkMatch(kpi.name, benchmarks);
    if (!benchmark) continue;
    if (benchmark.value === 0) continue;

    const gap = kpi.value - benchmark.value;
    const gapPercent = ((kpi.value - benchmark.value) / benchmark.value) * 100;

    const isLowerBetter = lowerIsBetter.some(l => normalize(kpi.name).includes(l) || normalize(benchmark.kpiName).includes(l));

    let status: 'above' | 'below' | 'at';
    if (isLowerBetter) {
      status = kpi.value < benchmark.value ? 'above' : kpi.value > benchmark.value ? 'below' : 'at';
    } else {
      status = kpi.value > benchmark.value ? 'above' : kpi.value < benchmark.value ? 'below' : 'at';
    }

    comparisons.push({
      kpiName: kpi.name,
      clientValue: Math.round(kpi.value * 100) / 100,
      industryAverage: benchmark.value,
      topQuartile: benchmark.topQuartile,
      gap: Math.round(gap * 100) / 100,
      gapPercent: Math.round(gapPercent * 100) / 100,
      status,
      unit: benchmark.unit,
      source: benchmark.source,
      methodology: benchmark.methodology,
      confidence: benchmark.confidence,
      sourceUrl: benchmark.sourceUrl,
    });
  }

  return comparisons;
}

export async function fetchBenchmarkFromUrl(url: string, kpiName: string): Promise<BenchmarkEntry | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' }, signal: controller.signal, mode: 'cors' });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const data = await response.json();
    if (data && typeof data.value === 'number') {
      return { kpiName, value: data.value, unit: data.unit || '%', topQuartile: data.topQuartile || data.value * 1.2, source: data.source || 'External API', sourceUrl: url, methodology: data.methodology || 'External benchmark', confidence: data.confidence || 'Medium' };
    }
    return null;
  } catch { return null; }
}

export function getBenchmarkSources(industry: string): { name: string; url: string; kpis: string[] }[] {
  const benchmarks = getBenchmarks(industry);
  const sourceMap = new Map<string, { url: string; kpis: string[] }>();
  for (const b of benchmarks) {
    if (sourceMap.has(b.source)) { sourceMap.get(b.source)!.kpis.push(b.kpiName); }
    else { sourceMap.set(b.source, { url: b.sourceUrl, kpis: [b.kpiName] }); }
  }
  return Array.from(sourceMap.entries()).map(([name, data]) => ({ name, url: data.url, kpis: data.kpis }));
}

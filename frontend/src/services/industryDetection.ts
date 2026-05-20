import { Industry, DatasetSchema, DatasetColumn } from '@/types';

/**
 * Industry keyword dictionaries for semantic matching.
 * Each industry has keywords that may appear in filenames or column headers.
 */
const INDUSTRY_KEYWORDS: Record<Industry, string[]> = {
  FMCG: [
    'sku', 'product', 'brand', 'category', 'revenue', 'sales', 'volume',
    'market_share', 'fill_rate', 'inventory', 'turnover', 'forecast',
    'stockout', 'warehouse', 'supplier', 'lead_time', 'repeat_purchase',
    'customer_satisfaction', 'distribution', 'shelf', 'consumer', 'pack',
    'retail_price', 'promotion', 'trade_spend', 'offtake', 'fmcg',
    'cpg', 'grocery', 'beverage', 'food', 'household', 'personal_care',
    'unit_price', 'cases', 'pallets', 'store', 'channel', 'modern_trade',
    'general_trade', 'ecommerce', 'nielsen', 'kantar', 'iri'
  ],
  Healthcare: [
    'patient', 'diagnosis', 'treatment', 'hospital', 'clinic', 'doctor',
    'prescription', 'drug', 'pharmaceutical', 'medical', 'health',
    'readmission', 'mortality', 'length_of_stay', 'bed_occupancy',
    'wait_time', 'satisfaction', 'outcome', 'procedure', 'surgery',
    'nursing', 'icu', 'emergency', 'outpatient', 'inpatient',
    'icd', 'cpt', 'drg', 'cms', 'hcahps', 'nps', 'clinical',
    'lab', 'radiology', 'pharmacy', 'insurance', 'claim', 'copay',
    'deductible', 'prior_auth', 'denial', 'appeal'
  ],
  Banking: [
    'account', 'balance', 'transaction', 'loan', 'credit', 'debit',
    'interest', 'deposit', 'withdrawal', 'branch', 'atm', 'customer',
    'npa', 'npl', 'nim', 'casa', 'tier', 'capital_adequacy', 'roa',
    'roe', 'cost_to_income', 'provision', 'write_off', 'recovery',
    'mortgage', 'personal_loan', 'business_loan', 'card', 'payment',
    'fintech', 'digital', 'mobile_banking', 'kyc', 'aml', 'fraud',
    'risk', 'portfolio', 'asset', 'liability', 'fdic', 'basel'
  ],
  Retail: [
    'store', 'pos', 'transaction', 'basket', 'footfall', 'conversion',
    'aov', 'average_order', 'same_store', 'comp_sales', 'shrinkage',
    'markdown', 'clearance', 'loyalty', 'membership', 'online',
    'omnichannel', 'fulfillment', 'return', 'refund', 'exchange',
    'assortment', 'planogram', 'visual_merchandising', 'traffic',
    'dwell_time', 'customer_lifetime_value', 'clv', 'retention',
    'churn', 'acquisition', 'repeat', 'frequency', 'recency'
  ],
  Manufacturing: [
    'oee', 'overall_equipment_effectiveness', 'downtime', 'yield',
    'defect', 'scrap', 'rework', 'cycle_time', 'throughput', 'capacity',
    'utilization', 'maintenance', 'mtbf', 'mttr', 'changeover',
    'setup', 'batch', 'lot', 'quality', 'inspection', 'six_sigma',
    'lean', 'kaizen', 'kanban', 'jit', 'bom', 'bill_of_materials',
    'work_order', 'production', 'assembly', 'machine', 'operator',
    'shift', 'plant', 'factory', 'line', 'cell', 'station'
  ]
};

/**
 * Filename patterns that strongly indicate an industry.
 */
const FILENAME_PATTERNS: Record<Industry, RegExp[]> = {
  FMCG: [
    /fmcg/i, /cpg/i, /consumer.*goods/i, /sales.*data/i,
    /supply.*chain/i, /distribution/i, /retail.*sales/i,
    /brand.*performance/i, /market.*share/i, /nielsen/i, /kantar/i
  ],
  Healthcare: [
    /health/i, /hospital/i, /patient/i, /clinical/i,
    /medical/i, /pharma/i, /diagnosis/i, /treatment/i,
    /readmission/i, /cms/i, /hcahps/i
  ],
  Banking: [
    /bank/i, /financ/i, /loan/i, /credit/i, /deposit/i,
    /transaction/i, /portfolio/i, /npa/i, /mortgage/i,
    /payment/i, /fdic/i, /basel/i
  ],
  Retail: [
    /retail/i, /store/i, /ecommerce/i, /e-commerce/i,
    /pos.*data/i, /basket/i, /loyalty/i, /omnichannel/i,
    /footfall/i, /conversion/i
  ],
  Manufacturing: [
    /manufactur/i, /production/i, /factory/i, /plant/i,
    /oee/i, /quality/i, /defect/i, /assembly/i,
    /maintenance/i, /lean/i, /six.*sigma/i
  ]
};

/**
 * Normalizes a string for comparison by converting to lowercase,
 * replacing common separators with underscores.
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Calculates a match score for a given industry based on column headers.
 */
function scoreColumns(columns: DatasetColumn[], industry: Industry): number {
  const keywords = INDUSTRY_KEYWORDS[industry];
  let score = 0;

  for (const column of columns) {
    const normalizedName = normalizeString(column.name);
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword) || keyword.includes(normalizedName)) {
        score += 1;
      }
      // Partial match bonus
      const parts = normalizedName.split('_');
      for (const part of parts) {
        if (part.length > 3 && keyword.includes(part)) {
          score += 0.5;
        }
      }
    }
  }

  return score;
}

/**
 * Calculates a match score for a given industry based on the filename.
 */
function scoreFilename(filename: string, industry: Industry): number {
  const patterns = FILENAME_PATTERNS[industry];
  let score = 0;

  for (const pattern of patterns) {
    if (pattern.test(filename)) {
      score += 3; // Filename matches carry higher weight
    }
  }

  // Also check keyword presence in filename
  const normalizedFilename = normalizeString(filename);
  const keywords = INDUSTRY_KEYWORDS[industry];
  for (const keyword of keywords) {
    if (normalizedFilename.includes(keyword)) {
      score += 2;
    }
  }

  return score;
}

/**
 * Calculates a match score based on sample values in the columns.
 */
function scoreSampleValues(columns: DatasetColumn[], industry: Industry): number {
  const keywords = INDUSTRY_KEYWORDS[industry];
  let score = 0;

  for (const column of columns) {
    if (column.type === 'categorical' || column.type === 'text') {
      for (const sample of column.sampleValues) {
        const normalizedSample = normalizeString(String(sample));
        for (const keyword of keywords) {
          if (normalizedSample.includes(keyword)) {
            score += 0.25;
          }
        }
      }
    }
  }

  return score;
}

export interface IndustryDetectionResult {
  industry: Industry;
  confidence: number;
  scores: Record<Industry, number>;
  matchedKeywords: string[];
}

/**
 * Detects the industry from a dataset schema using semantic matching
 * against filenames, column headers, and sample values.
 */
export function detectIndustry(schema: DatasetSchema): IndustryDetectionResult {
  const industries: Industry[] = ['FMCG', 'Healthcare', 'Banking', 'Retail', 'Manufacturing'];
  const scores: Record<Industry, number> = {} as Record<Industry, number>;
  const allMatchedKeywords: string[] = [];

  for (const industry of industries) {
    const filenameScore = scoreFilename(schema.fileName, industry);
    const columnScore = scoreColumns(schema.columns, industry);
    const sampleScore = scoreSampleValues(schema.columns, industry);

    // Weighted combination
    scores[industry] = filenameScore * 1.5 + columnScore * 2.0 + sampleScore * 0.5;
  }

  // Determine the best match
  let bestIndustry: Industry = 'FMCG';
  let bestScore = 0;

  for (const industry of industries) {
    if (scores[industry] > bestScore) {
      bestScore = scores[industry];
      bestIndustry = industry;
    }
  }

  // Collect matched keywords for the detected industry
  const keywords = INDUSTRY_KEYWORDS[bestIndustry];
  for (const column of schema.columns) {
    const normalizedName = normalizeString(column.name);
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword) && !allMatchedKeywords.includes(keyword)) {
        allMatchedKeywords.push(keyword);
      }
    }
  }

  // Calculate confidence (0-1 scale)
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const confidence = totalScore > 0 ? Math.min(bestScore / totalScore * 2, 1) : 0;

  return {
    industry: bestIndustry,
    confidence,
    scores,
    matchedKeywords: allMatchedKeywords
  };
}

/**
 * Validates if a detected industry is reasonable based on minimum thresholds.
 */
export function validateDetection(result: IndustryDetectionResult): boolean {
  return result.confidence >= 0.3 && result.matchedKeywords.length >= 2;
}

/**
 * Gets industry display metadata for UI purposes.
 */
export function getIndustryMeta(industry: Industry): { label: string; icon: string; color: string } {
  const meta: Record<Industry, { label: string; icon: string; color: string }> = {
    FMCG: { label: 'Fast-Moving Consumer Goods', icon: 'shopping-cart', color: '#2563eb' },
    Healthcare: { label: 'Healthcare & Life Sciences', icon: 'heart-pulse', color: '#dc2626' },
    Banking: { label: 'Banking & Financial Services', icon: 'landmark', color: '#059669' },
    Retail: { label: 'Retail & E-Commerce', icon: 'store', color: '#7c3aed' },
    Manufacturing: { label: 'Manufacturing & Industrial', icon: 'factory', color: '#d97706' }
  };
  return meta[industry];
}

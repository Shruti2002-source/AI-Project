import { Industry, KPIValue, BenchmarkComparison, AIInsight } from '@/types';

/**
 * Insight generation rules per KPI.
 * Each rule defines conditions and generates contextual insights.
 */
interface InsightRule {
  kpiName: string;
  industry: Industry[];
  conditions: InsightCondition[];
}

interface InsightCondition {
  type: 'risk' | 'opportunity' | 'observation' | 'recommendation';
  severity: 'high' | 'medium' | 'low';
  check: (kpiValue: number, benchmark?: BenchmarkComparison) => boolean;
  generateTitle: (kpiValue: number, benchmark?: BenchmarkComparison) => string;
  generateDescription: (kpiValue: number, benchmark?: BenchmarkComparison) => string;
  generateImpact: (kpiValue: number, benchmark?: BenchmarkComparison) => string;
}

/**
 * Generates a unique ID for insights.
 */
function generateInsightId(): string {
  return `insight_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format number with appropriate precision.
 */
function formatValue(value: number, unit: string): string {
  if (unit === '$') return `$${value.toLocaleString()}`;
  if (unit === '%') return `${value.toFixed(1)}%`;
  return `${value.toFixed(1)} ${unit}`;
}

/**
 * Core insight rules for FMCG industry.
 */
const FMCG_RULES: InsightRule[] = [
  {
    kpiName: 'Fill Rate',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'high',
        check: (value) => value < 90,
        generateTitle: (value) => `Critical Fill Rate Deficit at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Fill rate is critically below the industry benchmark of 95%. At ${value.toFixed(1)}%, the organization is experiencing significant order fulfillment gaps that directly impact customer satisfaction and revenue. Immediate intervention in supply chain operations is required.`,
        generateImpact: (value) =>
          `Estimated revenue at risk: ${((95 - value) * 0.5).toFixed(1)}% of annual sales due to lost orders and customer churn from unfulfilled demand.`
      },
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value >= 90 && value < 95,
        generateTitle: (value) => `Fill Rate Below Industry Benchmark at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Fill rate is below the industry benchmark of 95%. At ${value.toFixed(1)}%, there is room for improvement in order fulfillment processes. This gap suggests potential issues in demand planning, inventory positioning, or supplier reliability.`,
        generateImpact: (value) =>
          `Gap of ${(95 - value).toFixed(1)} percentage points from benchmark translates to approximately ${((95 - value) * 0.3).toFixed(1)}% potential revenue improvement opportunity.`
      },
      {
        type: 'opportunity',
        severity: 'low',
        check: (value) => value >= 95 && value < 98.5,
        generateTitle: () => 'Fill Rate Meets Benchmark - Top Quartile Achievable',
        generateDescription: (value) =>
          `Fill rate at ${value.toFixed(1)}% meets the industry average but is below the top quartile of 98.5%. Incremental improvements through advanced demand sensing and safety stock optimization could push performance to best-in-class levels.`,
        generateImpact: () =>
          'Achieving top quartile fill rate can improve customer loyalty scores by 5-8% and reduce emergency shipment costs by 15-20%.'
      }
    ]
  },
  {
    kpiName: 'Forecast Accuracy',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'high',
        check: (value) => value < 75,
        generateTitle: (value) => `Forecast Accuracy Crisis at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Forecast accuracy at ${value.toFixed(1)}% is significantly below the industry benchmark of 85%. This level of inaccuracy cascades into excess inventory, stockouts, and inefficient production scheduling across the supply chain.`,
        generateImpact: () =>
          'Poor forecast accuracy typically results in 20-30% excess inventory carrying costs and 5-10% lost sales from stockouts.'
      },
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value >= 75 && value < 85,
        generateTitle: (value) => `Forecast Accuracy Below Benchmark at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Forecast accuracy at ${value.toFixed(1)}% is below the industry benchmark of 85%. This gap indicates opportunities to improve demand planning through better statistical methods, market intelligence integration, or collaborative forecasting with retail partners.`,
        generateImpact: (value) =>
          `Each 1% improvement in forecast accuracy can reduce inventory carrying costs by 1-2%. Current gap of ${(85 - value).toFixed(1)}% represents significant cost savings potential.`
      },
      {
        type: 'observation',
        severity: 'low',
        check: (value) => value >= 85 && value < 92,
        generateTitle: () => 'Forecast Accuracy at Industry Standard',
        generateDescription: (value) =>
          `Forecast accuracy at ${value.toFixed(1)}% meets the industry benchmark. Top quartile performers achieve 92%+ through ML-driven demand sensing and real-time POS data integration.`,
        generateImpact: () =>
          'Moving to top quartile could reduce safety stock requirements by 15-25% while maintaining service levels.'
      }
    ]
  },
  {
    kpiName: 'Stockout Rate',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'high',
        check: (value) => value > 12,
        generateTitle: (value) => `Severe Stockout Problem at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Stockout rate at ${value.toFixed(1)}% is critically above the industry average of 8%. This means more than 1 in 10 potential purchases is lost due to product unavailability, causing permanent customer switching and shelf space loss to competitors.`,
        generateImpact: (value) =>
          `At ${value.toFixed(1)}% stockout rate, estimated lost sales are ${(value * 1.5).toFixed(0)}% higher than necessary. Industry research shows 70% of consumers switch brands after a stockout.`
      },
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value > 8 && value <= 12,
        generateTitle: (value) => `Stockout Rate Above Industry Norm at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Stockout rate at ${value.toFixed(1)}% exceeds the industry benchmark of 8%. Root causes likely include inaccurate demand forecasting, suboptimal replenishment triggers, or supplier unreliability.`,
        generateImpact: () =>
          'Reducing stockouts to benchmark level could recover 2-4% of lost sales and improve retailer relationship scores.'
      }
    ]
  },
  {
    kpiName: 'Revenue Growth',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'high',
        check: (value) => value < 0,
        generateTitle: (value) => `Revenue Declining at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Revenue is declining at ${value.toFixed(1)}%, significantly below the industry growth benchmark of 5.2%. This negative trajectory requires immediate strategic intervention to identify whether the issue is market-driven, competitive, or operational.`,
        generateImpact: () =>
          'Sustained revenue decline typically leads to reduced trade investment from retailers, shelf space loss, and compounding market share erosion.'
      },
      {
        type: 'observation',
        severity: 'medium',
        check: (value) => value >= 0 && value < 5.2,
        generateTitle: (value) => `Revenue Growth Below Industry Average at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Revenue growth of ${value.toFixed(1)}% is below the industry average of 5.2%. While positive, this underperformance relative to peers suggests market share is being ceded to faster-growing competitors.`,
        generateImpact: (value) =>
          `Growth gap of ${(5.2 - value).toFixed(1)} percentage points versus industry average. If sustained, this compounds to significant relative market position loss over 3-5 years.`
      },
      {
        type: 'opportunity',
        severity: 'low',
        check: (value) => value >= 5.2 && value < 8.5,
        generateTitle: () => 'Revenue Growth Above Average - Top Quartile Potential',
        generateDescription: (value) =>
          `Revenue growth of ${value.toFixed(1)}% outpaces the industry average of 5.2%. To reach top quartile performance of 8.5%, focus on category expansion, premiumization, or geographic growth.`,
        generateImpact: () =>
          'Companies in the top quartile of revenue growth typically command 20-30% premium valuations versus industry average peers.'
      }
    ]
  },
  {
    kpiName: 'Inventory Turnover',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value < 6,
        generateTitle: (value) => `Low Inventory Turnover at ${value.toFixed(1)}x`,
        generateDescription: (value) =>
          `Inventory turnover of ${value.toFixed(1)}x is well below the industry benchmark of 8x. This indicates excess inventory levels that tie up working capital and increase obsolescence risk, particularly critical for perishable FMCG products.`,
        generateImpact: (value) =>
          `Each additional turn releases approximately ${((8 - value) * 5).toFixed(0)}% of inventory investment as free cash flow. Current gap of ${(8 - value).toFixed(1)} turns represents significant working capital opportunity.`
      },
      {
        type: 'opportunity',
        severity: 'low',
        check: (value) => value >= 8 && value < 12,
        generateTitle: () => 'Inventory Turnover at Benchmark - Optimization Opportunity',
        generateDescription: (value) =>
          `Inventory turnover of ${value.toFixed(1)}x meets industry average. Top quartile achieves 12x through vendor managed inventory, cross-docking, and demand-driven replenishment.`,
        generateImpact: () =>
          'Moving from average to top quartile turnover can free 25-40% of working capital currently locked in inventory.'
      }
    ]
  },
  {
    kpiName: 'Market Share',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'observation',
        severity: 'medium',
        check: (value, benchmark) => benchmark !== undefined && value < benchmark.industryAverage,
        generateTitle: (value) => `Market Share at ${value.toFixed(1)}% - Below Category Average`,
        generateDescription: (value) =>
          `Market share of ${value.toFixed(1)}% is below the category leader benchmark of 15%. This position requires strategic decisions about whether to invest for growth, find a defensible niche, or consider portfolio rationalization.`,
        generateImpact: () =>
          'Market share below critical mass often results in reduced trade negotiating power and lower media efficiency versus larger competitors.'
      },
      {
        type: 'opportunity',
        severity: 'low',
        check: (value) => value >= 15 && value < 25,
        generateTitle: () => 'Strong Market Position - Leadership Consolidation Opportunity',
        generateDescription: (value) =>
          `Market share of ${value.toFixed(1)}% indicates strong category presence. Focus on defending core position while exploring adjacent category expansion or premiumization strategies.`,
        generateImpact: () =>
          'Category leaders with 20%+ share typically achieve 2-3x profitability versus smaller players due to scale advantages.'
      }
    ]
  },
  {
    kpiName: 'Warehouse Utilization',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value > 95,
        generateTitle: () => 'Warehouse Overcapacity Risk',
        generateDescription: (value) =>
          `Warehouse utilization at ${value.toFixed(1)}% exceeds optimal levels. Operating above 92% leaves insufficient buffer for demand spikes, seasonal inventory builds, and new product introductions.`,
        generateImpact: () =>
          'Over-utilized warehouses increase handling costs by 10-15% due to congestion and reduce picking accuracy by 3-5%.'
      },
      {
        type: 'observation',
        severity: 'low',
        check: (value) => value < 70,
        generateTitle: (value) => `Low Warehouse Utilization at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Warehouse utilization at ${value.toFixed(1)}% is below the industry benchmark of 85%. This underutilization represents excess fixed cost that could be rationalized through network optimization or shared warehousing.`,
        generateImpact: (value) =>
          `Operating at ${value.toFixed(1)}% vs benchmark 85% means approximately ${(85 - value).toFixed(0)}% of warehouse capacity costs are being absorbed without proportional throughput.`
      }
    ]
  },
  {
    kpiName: 'Supplier Lead Time',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value > 21,
        generateTitle: (value) => `Extended Supplier Lead Times at ${value.toFixed(0)} Days`,
        generateDescription: (value) =>
          `Supplier lead time of ${value.toFixed(0)} days is well above the industry benchmark of 14 days. Long lead times reduce supply chain responsiveness and require higher safety stock levels to maintain service.`,
        generateImpact: () =>
          'Every additional week of lead time typically requires 10-15% more safety stock investment to maintain equivalent service levels.'
      }
    ]
  },
  {
    kpiName: 'Customer Satisfaction',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value < 70,
        generateTitle: (value) => `Customer Satisfaction Below Threshold at ${value.toFixed(0)}`,
        generateDescription: (value) =>
          `Customer satisfaction score of ${value.toFixed(0)} is below the industry benchmark of 75. This indicates systemic issues with product quality, availability, or value perception that threaten long-term brand health.`,
        generateImpact: () =>
          'Satisfaction scores below 70 are correlated with 20-30% higher customer churn and reduced willingness to pay for brand premiums.'
      }
    ]
  },
  {
    kpiName: 'Repeat Purchase Rate',
    industry: ['FMCG'],
    conditions: [
      {
        type: 'risk',
        severity: 'medium',
        check: (value) => value < 30,
        generateTitle: (value) => `Low Repeat Purchase Rate at ${value.toFixed(1)}%`,
        generateDescription: (value) =>
          `Repeat purchase rate of ${value.toFixed(1)}% is significantly below the industry benchmark of 40%. Low repeat rates indicate product-market fit issues, competitive switching, or insufficient brand loyalty drivers.`,
        generateImpact: () =>
          'Acquiring a new customer costs 5-7x more than retaining existing ones. Low repeat purchase compounds customer acquisition costs unsustainably.'
      },
      {
        type: 'opportunity',
        severity: 'low',
        check: (value) => value >= 40 && value < 60,
        generateTitle: () => 'Repeat Purchase at Benchmark - Loyalty Opportunity',
        generateDescription: (value) =>
          `Repeat purchase rate of ${value.toFixed(1)}% meets industry average. Top quartile brands achieve 60%+ through loyalty programs, subscription models, and personalized engagement.`,
        generateImpact: () =>
          'A 10 percentage point increase in repeat purchase rate typically improves customer lifetime value by 30-50%.'
      }
    ]
  }
];

/**
 * Generic rules that apply across industries based on benchmark comparisons.
 */
function generateGenericInsights(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[]
): AIInsight[] {
  const insights: AIInsight[] = [];

  for (const comparison of benchmarks) {
    const kpi = kpiValues.find(k => k.name === comparison.kpiName);
    if (!kpi) continue;

    // Generate insights for significant gaps not covered by specific rules
    if (comparison.status === 'below' && Math.abs(comparison.gapPercent) > 20) {
      insights.push({
        id: generateInsightId(),
        type: 'risk',
        severity: Math.abs(comparison.gapPercent) > 40 ? 'high' : 'medium',
        title: `${comparison.kpiName} Significantly Below Benchmark`,
        description: `${comparison.kpiName} at ${formatValue(comparison.clientValue, comparison.unit)} is ${Math.abs(comparison.gapPercent).toFixed(1)}% below the industry average of ${formatValue(comparison.industryAverage, comparison.unit)} (Source: ${comparison.source}). This performance gap indicates a structural competitive disadvantage that requires strategic attention.`,
        kpiName: comparison.kpiName,
        impact: `Performance gap of ${Math.abs(comparison.gapPercent).toFixed(1)}% versus industry benchmark. Top quartile performance is ${formatValue(comparison.topQuartile, comparison.unit)}, representing a ${((comparison.topQuartile - comparison.clientValue) / comparison.clientValue * 100).toFixed(1)}% improvement potential.`
      });
    }

    if (comparison.status === 'above' && comparison.gapPercent > 15) {
      insights.push({
        id: generateInsightId(),
        type: 'opportunity',
        severity: 'low',
        title: `${comparison.kpiName} Outperforming Industry`,
        description: `${comparison.kpiName} at ${formatValue(comparison.clientValue, comparison.unit)} is ${comparison.gapPercent.toFixed(1)}% above the industry average of ${formatValue(comparison.industryAverage, comparison.unit)}. This competitive advantage should be leveraged and protected.`,
        kpiName: comparison.kpiName,
        impact: `Strong performance provides competitive moat. Consider documenting best practices and exploring if this capability can be monetized or extended to adjacent areas.`
      });
    }

    // Trend-based insights
    if (kpi.trend === 'down' && kpi.trendValue < -10) {
      insights.push({
        id: generateInsightId(),
        type: 'risk',
        severity: kpi.trendValue < -20 ? 'high' : 'medium',
        title: `${kpi.name} Declining Rapidly (${kpi.trendValue.toFixed(1)}%)`,
        description: `${kpi.name} shows a declining trend of ${kpi.trendValue.toFixed(1)}% between measurement periods. If this trajectory continues, performance will fall further below industry standards within 1-2 quarters.`,
        kpiName: kpi.name,
        impact: `Continued decline at current rate would result in ${kpi.name} reaching critical levels within ${Math.abs(Math.round(10 / kpi.trendValue))} periods.`
      });
    }
  }

  return insights;
}

/**
 * Main insight generation function.
 * Generates AI insights dynamically from KPI calculations and benchmark gaps.
 */
export function generateInsights(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  industry: Industry
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Apply industry-specific rules
  const rules = getIndustryRules(industry);

  for (const rule of rules) {
    const kpi = kpiValues.find(k => k.name === rule.kpiName);
    if (!kpi) continue;

    const benchmark = benchmarks.find(b => b.kpiName === rule.kpiName);

    for (const condition of rule.conditions) {
      if (condition.check(kpi.value, benchmark)) {
        insights.push({
          id: generateInsightId(),
          type: condition.type,
          severity: condition.severity,
          title: condition.generateTitle(kpi.value, benchmark),
          description: condition.generateDescription(kpi.value, benchmark),
          kpiName: rule.kpiName,
          impact: condition.generateImpact(kpi.value, benchmark)
        });
        break; // Only apply the first matching condition per KPI
      }
    }
  }

  // Add generic benchmark-based insights for KPIs without specific rules
  const coveredKPIs = new Set(insights.map(i => i.kpiName));
  const genericInsights = generateGenericInsights(kpiValues, benchmarks)
    .filter(i => !coveredKPIs.has(i.kpiName));

  insights.push(...genericInsights);

  // Sort by severity (high first) then by type priority
  const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const typeOrder: Record<string, number> = { risk: 0, recommendation: 1, opportunity: 2, observation: 3 };

  insights.sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return typeOrder[a.type] - typeOrder[b.type];
  });

  return insights;
}

/**
 * Gets the appropriate insight rules for an industry.
 */
function getIndustryRules(industry: Industry): InsightRule[] {
  switch (industry) {
    case 'FMCG':
      return FMCG_RULES;
    case 'Healthcare':
      return generateHealthcareRules();
    case 'Banking':
      return generateBankingRules();
    case 'Retail':
      return generateRetailRules();
    case 'Manufacturing':
      return generateManufacturingRules();
    default:
      return [];
  }
}

function generateHealthcareRules(): InsightRule[] {
  return [
    {
      kpiName: 'Readmission Rate',
      industry: ['Healthcare'],
      conditions: [
        {
          type: 'risk',
          severity: 'high',
          check: (value) => value > 18,
          generateTitle: (value) => `High Readmission Rate at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Readmission rate of ${value.toFixed(1)}% significantly exceeds the CMS benchmark of 15%. This triggers penalty risk under the Hospital Readmissions Reduction Program and indicates gaps in discharge planning or post-acute care coordination.`,
          generateImpact: () =>
            'Excess readmissions result in CMS payment penalties of up to 3% and average $15,000-$25,000 per avoidable readmission in direct costs.'
        },
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value > 15 && value <= 18,
          generateTitle: (value) => `Readmission Rate Above National Average at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Readmission rate of ${value.toFixed(1)}% exceeds the national average of 15%. Opportunities exist in transitional care management, patient education, and follow-up coordination to reduce avoidable readmissions.`,
          generateImpact: (value) =>
            `Reducing to benchmark level would prevent approximately ${((value - 15) * 10).toFixed(0)} readmissions per 1,000 discharges, saving significant costs and improving patient outcomes.`
        }
      ]
    },
    {
      kpiName: 'Patient Satisfaction',
      industry: ['Healthcare'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value < 72,
          generateTitle: (value) => `Patient Satisfaction Below National Average at ${value.toFixed(0)}`,
          generateDescription: (value) =>
            `Patient satisfaction score of ${value.toFixed(0)} is below the national HCAHPS average of 72. Low satisfaction impacts CMS star ratings, value-based purchasing payments, and patient volume through reputation effects.`,
          generateImpact: () =>
            'Each 1-point improvement in HCAHPS can increase VBP incentive payments by 0.5-1% and improve online reputation scores that drive patient acquisition.'
        }
      ]
    },
    {
      kpiName: 'Average Length of Stay',
      industry: ['Healthcare'],
      conditions: [
        {
          type: 'observation',
          severity: 'medium',
          check: (value) => value > 6,
          generateTitle: (value) => `Extended Length of Stay at ${value.toFixed(1)} Days`,
          generateDescription: (value) =>
            `Average length of stay of ${value.toFixed(1)} days exceeds the benchmark of 5.5 days. Extended stays increase per-case costs and reduce bed availability for new admissions. Root causes may include delayed diagnostics, care coordination gaps, or discharge barriers.`,
          generateImpact: (value) =>
            `Each day reduction in average LOS frees approximately ${((value - 5.5) * 365 / 7).toFixed(0)} bed-days annually per bed, enabling increased throughput without capital expansion.`
        }
      ]
    }
  ];
}

function generateBankingRules(): InsightRule[] {
  return [
    {
      kpiName: 'Non-Performing Assets',
      industry: ['Banking'],
      conditions: [
        {
          type: 'risk',
          severity: 'high',
          check: (value) => value > 4,
          generateTitle: (value) => `Critical NPA Level at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Non-performing assets at ${value.toFixed(1)}% are critically above the industry benchmark of 2%. This level of asset quality deterioration threatens capital adequacy and may attract regulatory scrutiny.`,
          generateImpact: () =>
            'NPA levels above 4% typically require enhanced provisioning that can reduce net income by 30-50% and constrain lending capacity.'
        },
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value > 2 && value <= 4,
          generateTitle: (value) => `NPA Ratio Above Industry Norm at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `NPA ratio of ${value.toFixed(1)}% exceeds the World Bank benchmark of 2%. Proactive credit risk management, early warning systems, and restructuring programs can help contain further deterioration.`,
          generateImpact: (value) =>
            `Reducing NPAs by ${(value - 2).toFixed(1)} percentage points to benchmark level would release approximately ${((value - 2) * 50).toFixed(0)} basis points of provisioning buffer back to profitability.`
        }
      ]
    },
    {
      kpiName: 'Cost-to-Income Ratio',
      industry: ['Banking'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value > 65,
          generateTitle: (value) => `Inefficient Operations: CIR at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Cost-to-income ratio of ${value.toFixed(1)}% is well above the industry benchmark of 55%. This indicates operational inefficiency that could be addressed through digital transformation, process automation, and branch network optimization.`,
          generateImpact: (value) =>
            `Reducing CIR to benchmark level would improve pre-provision operating profit by approximately ${(value - 55).toFixed(0)} cents per dollar of revenue.`
        }
      ]
    },
    {
      kpiName: 'Net Interest Margin',
      industry: ['Banking'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value < 2.5,
          generateTitle: (value) => `Compressed NIM at ${value.toFixed(2)}%`,
          generateDescription: (value) =>
            `Net interest margin of ${value.toFixed(2)}% is below the FDIC benchmark of 3.2%. Compressed margins limit profitability and may indicate unfavorable funding mix, competitive pricing pressure, or excessive low-yield asset concentration.`,
          generateImpact: () =>
            'Each 10bp improvement in NIM typically translates to 3-5% improvement in ROA for commercial banks.'
        }
      ]
    }
  ];
}

function generateRetailRules(): InsightRule[] {
  return [
    {
      kpiName: 'Conversion Rate',
      industry: ['Retail'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value < 2.0,
          generateTitle: (value) => `Low Conversion Rate at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Conversion rate of ${value.toFixed(1)}% is below the industry benchmark of 2.5%. This suggests issues with user experience, pricing, product discovery, or checkout friction that are preventing browsers from becoming buyers.`,
          generateImpact: (value) =>
            `Improving conversion from ${value.toFixed(1)}% to benchmark 2.5% would increase revenue by approximately ${((2.5 - value) / value * 100).toFixed(0)}% with the same traffic investment.`
        }
      ]
    },
    {
      kpiName: 'Customer Retention Rate',
      industry: ['Retail'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value < 50,
          generateTitle: (value) => `Low Customer Retention at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Customer retention rate of ${value.toFixed(1)}% is below the industry benchmark of 60%. Low retention indicates high churn that increases customer acquisition cost burden and reduces lifetime value.`,
          generateImpact: () =>
            'A 5% increase in customer retention typically increases profits by 25-95% due to reduced acquisition costs and increased purchase frequency.'
        }
      ]
    },
    {
      kpiName: 'Shrinkage Rate',
      industry: ['Retail'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value > 2.0,
          generateTitle: (value) => `High Shrinkage Rate at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Shrinkage rate of ${value.toFixed(1)}% exceeds the NRF benchmark of 1.4%. Elevated shrinkage directly erodes profit margins and may indicate theft, operational errors, or vendor fraud.`,
          generateImpact: (value) =>
            `Reducing shrinkage to benchmark level would recover ${(value - 1.4).toFixed(1)} percentage points of revenue, translating directly to bottom-line profit improvement.`
        }
      ]
    }
  ];
}

function generateManufacturingRules(): InsightRule[] {
  return [
    {
      kpiName: 'Overall Equipment Effectiveness',
      industry: ['Manufacturing'],
      conditions: [
        {
          type: 'risk',
          severity: 'high',
          check: (value) => value < 55,
          generateTitle: (value) => `Low OEE at ${value.toFixed(1)}% - Significant Capacity Loss`,
          generateDescription: (value) =>
            `OEE of ${value.toFixed(1)}% indicates that nearly half of manufacturing capacity is lost to availability, performance, and quality issues. World-class OEE is 85%+, and the gap represents significant untapped production potential.`,
          generateImpact: (value) =>
            `Improving OEE from ${value.toFixed(1)}% to benchmark 65% would increase effective capacity by ${((65 - value) / value * 100).toFixed(0)}% without capital investment in new equipment.`
        },
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value >= 55 && value < 65,
          generateTitle: (value) => `OEE Below Industry Average at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `OEE of ${value.toFixed(1)}% is below the industry benchmark of 65%. Decomposing OEE into availability, performance, and quality losses will identify the primary improvement levers.`,
          generateImpact: () =>
            'Each 5% improvement in OEE typically reduces per-unit manufacturing cost by 3-5% through better asset utilization.'
        }
      ]
    },
    {
      kpiName: 'Defect Rate',
      industry: ['Manufacturing'],
      conditions: [
        {
          type: 'risk',
          severity: 'high',
          check: (value) => value > 3,
          generateTitle: (value) => `High Defect Rate at ${value.toFixed(1)}%`,
          generateDescription: (value) =>
            `Defect rate of ${value.toFixed(1)}% is double the industry benchmark of 1.5%. This level of quality failure indicates systemic process control issues and results in significant scrap, rework, and warranty costs.`,
          generateImpact: (value) =>
            `Reducing defects from ${value.toFixed(1)}% to benchmark would save approximately ${((value - 1.5) * 2).toFixed(1)}% of production costs in scrap and rework elimination.`
        }
      ]
    },
    {
      kpiName: 'Mean Time Between Failures',
      industry: ['Manufacturing'],
      conditions: [
        {
          type: 'risk',
          severity: 'medium',
          check: (value) => value < 150,
          generateTitle: (value) => `Frequent Equipment Failures: MTBF ${value.toFixed(0)} Hours`,
          generateDescription: (value) =>
            `MTBF of ${value.toFixed(0)} hours is below the industry benchmark of 200 hours. Frequent breakdowns indicate aging equipment, inadequate preventive maintenance, or operator skill gaps.`,
          generateImpact: () =>
            'Improving MTBF to benchmark reduces unplanned downtime by 25-30% and extends equipment useful life by 15-20%.'
        }
      ]
    }
  ];
}

/**
 * Summarizes insights by category for dashboard display.
 */
export function summarizeInsights(insights: AIInsight[]): {
  total: number;
  risks: number;
  opportunities: number;
  observations: number;
  recommendations: number;
  highSeverity: number;
} {
  return {
    total: insights.length,
    risks: insights.filter(i => i.type === 'risk').length,
    opportunities: insights.filter(i => i.type === 'opportunity').length,
    observations: insights.filter(i => i.type === 'observation').length,
    recommendations: insights.filter(i => i.type === 'recommendation').length,
    highSeverity: insights.filter(i => i.severity === 'high').length
  };
}

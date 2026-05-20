import {
  Industry,
  KPIValue,
  BenchmarkComparison,
  AIInsight,
  ExecutiveStoryline
} from '@/types';

/**
 * Generates an executive consulting storyline dynamically from KPI values,
 * benchmark gaps, and insights. The storyline follows McKinsey/BCG consulting
 * structure: Situation, Complication, Resolution.
 */

/**
 * Helper to get the top N insights by severity.
 */
function getTopInsights(insights: AIInsight[], n: number): AIInsight[] {
  const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return [...insights]
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, n);
}

/**
 * Helper to get KPIs that are performing well (above benchmark).
 */
function getStrengths(benchmarks: BenchmarkComparison[]): BenchmarkComparison[] {
  return benchmarks.filter(b => b.status === 'above');
}

/**
 * Helper to get KPIs that are underperforming (below benchmark).
 */
function getWeaknesses(benchmarks: BenchmarkComparison[]): BenchmarkComparison[] {
  return benchmarks
    .filter(b => b.status === 'below')
    .sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent));
}

/**
 * Format a KPI value for display in narrative.
 */
function formatKPI(value: number, unit: string): string {
  if (unit === '$') return `$${value.toLocaleString()}`;
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === 'x') return `${value.toFixed(1)}x`;
  if (unit === 'days') return `${value.toFixed(0)} days`;
  if (unit === 'hours') return `${value.toFixed(0)} hours`;
  if (unit === 'minutes') return `${value.toFixed(0)} minutes`;
  return `${value.toFixed(1)} ${unit}`;
}

/**
 * Gets a human-readable industry context.
 */
function getIndustryContext(industry: Industry): string {
  const contexts: Record<Industry, string> = {
    FMCG: 'fast-moving consumer goods',
    Healthcare: 'healthcare and life sciences',
    Banking: 'banking and financial services',
    Retail: 'retail and e-commerce',
    Manufacturing: 'manufacturing and industrial'
  };
  return contexts[industry];
}

/**
 * Generates the Executive Summary section.
 * Provides a high-level overview of the analysis findings.
 */
function generateExecutiveSummary(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[],
  industry: Industry
): string {
  const strengths = getStrengths(benchmarks);
  const weaknesses = getWeaknesses(benchmarks);
  const highRisks = insights.filter(i => i.severity === 'high' && i.type === 'risk');
  const opportunities = insights.filter(i => i.type === 'opportunity');

  let summary = `This analysis evaluates ${kpiValues.length} key performance indicators across the ${getIndustryContext(industry)} sector. `;

  if (weaknesses.length > 0 && strengths.length > 0) {
    summary += `The organization demonstrates mixed performance: ${strengths.length} KPIs exceed industry benchmarks while ${weaknesses.length} fall below standard. `;
  } else if (weaknesses.length > 0) {
    summary += `The organization shows significant performance gaps across ${weaknesses.length} key metrics versus industry benchmarks. `;
  } else if (strengths.length > 0) {
    summary += `The organization demonstrates strong performance, with ${strengths.length} KPIs exceeding industry benchmarks. `;
  }

  if (highRisks.length > 0) {
    summary += `${highRisks.length} high-severity risk${highRisks.length > 1 ? 's' : ''} ${highRisks.length > 1 ? 'require' : 'requires'} immediate attention. `;
  }

  if (opportunities.length > 0) {
    summary += `${opportunities.length} strategic opportunit${opportunities.length > 1 ? 'ies have' : 'y has'} been identified for value creation.`;
  }

  return summary.trim();
}

/**
 * Generates the Current Performance section.
 * Summarizes current KPI performance with data-driven narrative.
 */
function generateCurrentPerformance(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  industry: Industry
): string {
  const strengths = getStrengths(benchmarks);
  const weaknesses = getWeaknesses(benchmarks);

  let performance = `Current performance analysis across the ${getIndustryContext(industry)} portfolio reveals the following position:\n\n`;

  // Performance categories
  const categories = [...new Set(kpiValues.map(k => k.category))];

  for (const category of categories) {
    const categoryKPIs = kpiValues.filter(k => k.category === category);
    const categoryBenchmarks = benchmarks.filter(b =>
      categoryKPIs.some(k => k.name === b.kpiName)
    );

    if (categoryBenchmarks.length === 0) continue;

    const aboveBenchmark = categoryBenchmarks.filter(b => b.status === 'above').length;
    const belowBenchmark = categoryBenchmarks.filter(b => b.status === 'below').length;

    performance += `${category}: `;

    if (belowBenchmark > aboveBenchmark) {
      performance += `Underperforming in ${belowBenchmark} of ${categoryBenchmarks.length} metrics. `;
    } else if (aboveBenchmark > belowBenchmark) {
      performance += `Strong position with ${aboveBenchmark} of ${categoryBenchmarks.length} metrics above benchmark. `;
    } else {
      performance += `Mixed results across ${categoryBenchmarks.length} metrics. `;
    }

    // Add specific data points
    const topGap = categoryBenchmarks
      .filter(b => b.status === 'below')
      .sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent))[0];

    if (topGap) {
      performance += `Largest gap: ${topGap.kpiName} at ${formatKPI(topGap.clientValue, topGap.unit)} vs. benchmark ${formatKPI(topGap.industryAverage, topGap.unit)} (${Math.abs(topGap.gapPercent).toFixed(1)}% below). `;
    }

    performance += '\n';
  }

  // Trend analysis
  const decliningKPIs = kpiValues.filter(k => k.trend === 'down');
  const improvingKPIs = kpiValues.filter(k => k.trend === 'up');

  if (decliningKPIs.length > 0) {
    performance += `\nTrend Alert: ${decliningKPIs.length} metric${decliningKPIs.length > 1 ? 's are' : ' is'} showing declining trends, including ${decliningKPIs.slice(0, 3).map(k => k.name).join(', ')}.`;
  }

  if (improvingKPIs.length > 0) {
    performance += `\nPositive Momentum: ${improvingKPIs.length} metric${improvingKPIs.length > 1 ? 's show' : ' shows'} upward trends, notably ${improvingKPIs.slice(0, 3).map(k => k.name).join(', ')}.`;
  }

  return performance.trim();
}

/**
 * Generates the Key Insight section.
 * Identifies the single most important finding from the analysis.
 */
function generateKeyInsight(
  insights: AIInsight[],
  benchmarks: BenchmarkComparison[],
  industry: Industry
): string {
  const topInsights = getTopInsights(insights, 1);

  if (topInsights.length === 0) {
    return `The ${getIndustryContext(industry)} performance analysis reveals metrics broadly aligned with industry benchmarks, with no critical gaps identified requiring immediate intervention.`;
  }

  const primary = topInsights[0];
  const relatedBenchmark = benchmarks.find(b => b.kpiName === primary.kpiName);

  let keyInsight = primary.description;

  if (relatedBenchmark) {
    keyInsight += ` Industry benchmark data from ${relatedBenchmark.source} confirms a ${Math.abs(relatedBenchmark.gapPercent).toFixed(1)}% performance gap that positions the organization in the ${relatedBenchmark.status === 'below' ? 'bottom' : 'top'} quartile for this metric.`;
  }

  return keyInsight;
}

/**
 * Generates the Root Cause section.
 * Identifies potential root causes based on correlated KPI performance.
 */
function generateRootCause(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[],
  industry: Industry
): string {
  const weaknesses = getWeaknesses(benchmarks);
  const highRisks = insights.filter(i => i.severity === 'high');

  if (weaknesses.length === 0) {
    return 'No significant performance gaps have been identified that require root cause investigation. The organization is performing at or above industry benchmarks across measured KPIs.';
  }

  let rootCause = 'Root cause analysis based on KPI correlation patterns suggests the following drivers:\n\n';

  // Industry-specific root cause patterns
  if (industry === 'FMCG') {
    const hasSupplyChainIssues = weaknesses.some(w =>
      ['Fill Rate', 'Stockout Rate', 'Inventory Turnover', 'Forecast Accuracy', 'Supplier Lead Time'].includes(w.kpiName)
    );
    const hasCommercialIssues = weaknesses.some(w =>
      ['Revenue Growth', 'Market Share', 'Sales Volume'].includes(w.kpiName)
    );
    const hasCustomerIssues = weaknesses.some(w =>
      ['Customer Satisfaction', 'Repeat Purchase Rate'].includes(w.kpiName)
    );

    if (hasSupplyChainIssues) {
      rootCause += '1. Supply Chain Fragility: Multiple supply chain KPIs are underperforming, suggesting systemic issues in demand-supply synchronization. This pattern typically stems from inadequate demand sensing capabilities, fragmented supplier relationships, or suboptimal inventory positioning across the network.\n\n';
    }
    if (hasCommercialIssues) {
      rootCause += '2. Commercial Effectiveness Gap: Revenue and market share metrics indicate competitive pressure that may originate from pricing misalignment, insufficient trade investment, or portfolio gaps in high-growth segments.\n\n';
    }
    if (hasCustomerIssues) {
      rootCause += '3. Customer Experience Deficit: Customer-facing metrics suggest deterioration in brand perception or product-market fit, potentially driven by quality inconsistency, availability failures, or misaligned value proposition versus evolving consumer expectations.\n\n';
    }
  } else if (industry === 'Healthcare') {
    const hasQualityIssues = weaknesses.some(w =>
      ['Readmission Rate', 'Mortality Rate', 'Patient Satisfaction'].includes(w.kpiName)
    );
    const hasOperationalIssues = weaknesses.some(w =>
      ['Average Length of Stay', 'Bed Occupancy Rate', 'Wait Time'].includes(w.kpiName)
    );

    if (hasQualityIssues) {
      rootCause += '1. Care Quality Gaps: Multiple quality indicators are underperforming, suggesting systemic issues in clinical pathways, care coordination, or patient engagement protocols that require clinical leadership intervention.\n\n';
    }
    if (hasOperationalIssues) {
      rootCause += '2. Operational Throughput Constraints: Operational metrics indicate capacity management challenges that likely stem from care coordination inefficiencies, discharge process bottlenecks, or resource allocation mismatches.\n\n';
    }
  } else if (industry === 'Banking') {
    const hasRiskIssues = weaknesses.some(w =>
      ['Non-Performing Assets', 'Capital Adequacy Ratio'].includes(w.kpiName)
    );
    const hasEfficiencyIssues = weaknesses.some(w =>
      ['Cost-to-Income Ratio', 'Net Interest Margin', 'Return on Assets'].includes(w.kpiName)
    );

    if (hasRiskIssues) {
      rootCause += '1. Asset Quality Deterioration: Credit risk metrics indicate weakening portfolio quality, potentially driven by over-concentration in vulnerable segments, inadequate underwriting standards, or macroeconomic headwinds affecting borrower capacity.\n\n';
    }
    if (hasEfficiencyIssues) {
      rootCause += '2. Structural Inefficiency: Profitability and efficiency metrics suggest a cost base that has not kept pace with revenue evolution, potentially due to legacy technology infrastructure, over-branched network, or manual process dependencies.\n\n';
    }
  } else if (industry === 'Retail') {
    const hasConversionIssues = weaknesses.some(w =>
      ['Conversion Rate', 'Average Order Value', 'Footfall'].includes(w.kpiName)
    );
    const hasRetentionIssues = weaknesses.some(w =>
      ['Customer Retention Rate', 'Shrinkage Rate', 'Same-Store Sales Growth'].includes(w.kpiName)
    );

    if (hasConversionIssues) {
      rootCause += '1. Conversion Funnel Leakage: Traffic-to-revenue metrics indicate friction points in the customer journey, potentially from UX issues, pricing perception gaps, or assortment misalignment with customer intent.\n\n';
    }
    if (hasRetentionIssues) {
      rootCause += '2. Customer Lifecycle Management Gap: Retention and loyalty metrics suggest insufficient post-purchase engagement, potentially from weak loyalty programs, inconsistent experience across touchpoints, or competitive alternatives capturing share-of-wallet.\n\n';
    }
  } else if (industry === 'Manufacturing') {
    const hasEquipmentIssues = weaknesses.some(w =>
      ['Overall Equipment Effectiveness', 'Mean Time Between Failures', 'Capacity Utilization'].includes(w.kpiName)
    );
    const hasQualityIssues = weaknesses.some(w =>
      ['Defect Rate', 'Yield Rate', 'Cycle Time'].includes(w.kpiName)
    );

    if (hasEquipmentIssues) {
      rootCause += '1. Asset Performance Degradation: Equipment effectiveness metrics indicate reliability and availability issues likely stemming from aging asset base, reactive maintenance culture, or insufficient operator capability development.\n\n';
    }
    if (hasQualityIssues) {
      rootCause += '2. Process Control Weakness: Quality and throughput metrics suggest variability in manufacturing processes, potentially from inadequate statistical process control, inconsistent raw material quality, or insufficient standardization across shifts/lines.\n\n';
    }
  }

  // If no industry-specific patterns matched, provide generic analysis
  if (rootCause === 'Root cause analysis based on KPI correlation patterns suggests the following drivers:\n\n') {
    const topWeakness = weaknesses[0];
    rootCause += `Primary performance gap in ${topWeakness.kpiName} (${Math.abs(topWeakness.gapPercent).toFixed(1)}% below benchmark) suggests structural issues that may be cascading to other operational metrics. Further diagnostic analysis recommended to isolate specific causal factors.`;
  }

  return rootCause.trim();
}

/**
 * Generates the Business Impact section.
 * Quantifies the financial and strategic impact of identified issues.
 */
function generateBusinessImpact(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[]
): string {
  const weaknesses = getWeaknesses(benchmarks);
  const highRisks = insights.filter(i => i.severity === 'high');

  if (weaknesses.length === 0 && highRisks.length === 0) {
    return 'Current performance at or above industry benchmarks positions the organization favorably for sustained competitive advantage. Focus should be on maintaining momentum and identifying next-frontier opportunities.';
  }

  let impact = 'The identified performance gaps carry the following business implications:\n\n';

  // Aggregate impact from insights
  for (const insight of highRisks.slice(0, 3)) {
    impact += `- ${insight.kpiName}: ${insight.impact}\n`;
  }

  // Overall impact statement
  const totalGapMagnitude = weaknesses.reduce((sum, w) => sum + Math.abs(w.gapPercent), 0);
  const avgGap = weaknesses.length > 0 ? totalGapMagnitude / weaknesses.length : 0;

  if (avgGap > 30) {
    impact += `\nCumulative Impact: With an average benchmark gap of ${avgGap.toFixed(1)}% across ${weaknesses.length} underperforming metrics, the organization faces compounding competitive disadvantage. Without intervention, market position erosion is likely to accelerate over the next 12-18 months.`;
  } else if (avgGap > 15) {
    impact += `\nCumulative Impact: Average benchmark gap of ${avgGap.toFixed(1)}% across ${weaknesses.length} metrics represents a meaningful but addressable competitive gap. Targeted interventions can close the gap within 2-3 quarters with appropriate investment.`;
  } else {
    impact += `\nCumulative Impact: Modest average gap of ${avgGap.toFixed(1)}% suggests performance is close to industry norms. Focused optimization can achieve benchmark parity in 1-2 quarters.`;
  }

  return impact.trim();
}

/**
 * Generates the Recommendation section.
 * Provides strategic recommendations based on findings.
 */
function generateRecommendation(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[],
  industry: Industry
): string {
  const weaknesses = getWeaknesses(benchmarks);
  const highRisks = insights.filter(i => i.severity === 'high');
  const opportunities = insights.filter(i => i.type === 'opportunity');

  let recommendation = 'Based on the analysis, we recommend a phased approach:\n\n';

  // Immediate actions (high severity risks)
  if (highRisks.length > 0) {
    recommendation += 'Immediate (0-30 days):\n';
    for (const risk of highRisks.slice(0, 3)) {
      recommendation += `- Address ${risk.kpiName}: Establish cross-functional task force to diagnose root causes and implement quick wins\n`;
    }
    recommendation += '\n';
  }

  // Short-term improvements (top weaknesses)
  if (weaknesses.length > 0) {
    recommendation += 'Short-term (1-3 months):\n';
    const shortTermTargets = weaknesses.slice(0, 3);
    for (const weakness of shortTermTargets) {
      const targetValue = (weakness.clientValue + weakness.industryAverage) / 2;
      recommendation += `- Improve ${weakness.kpiName} from ${formatKPI(weakness.clientValue, weakness.unit)} toward ${formatKPI(targetValue, weakness.unit)} (midpoint to benchmark)\n`;
    }
    recommendation += '\n';
  }

  // Medium-term strategic moves
  recommendation += 'Medium-term (3-6 months):\n';
  if (opportunities.length > 0) {
    for (const opp of opportunities.slice(0, 2)) {
      recommendation += `- Leverage ${opp.kpiName} advantage through capability scaling and best practice documentation\n`;
    }
  }
  recommendation += `- Implement systematic ${getIndustryContext(industry)} performance monitoring with real-time dashboards\n`;
  recommendation += '- Develop predictive analytics capability to shift from reactive to proactive management\n';

  return recommendation.trim();
}

/**
 * Generates the Next Steps section.
 * Provides actionable next steps for the client.
 */
function generateNextSteps(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[],
  industry: Industry
): string[] {
  const weaknesses = getWeaknesses(benchmarks);
  const highRisks = insights.filter(i => i.severity === 'high');
  const steps: string[] = [];

  // Always start with leadership alignment
  steps.push('Schedule executive steering committee meeting to review findings and align on priority interventions');

  // Diagnostic deep-dives
  if (highRisks.length > 0) {
    steps.push(`Commission detailed diagnostic on top ${Math.min(highRisks.length, 3)} high-severity risk areas: ${highRisks.slice(0, 3).map(r => r.kpiName).join(', ')}`);
  }

  // Data and measurement
  if (weaknesses.length > 0) {
    steps.push(`Establish weekly performance tracking cadence for ${weaknesses.slice(0, 5).map(w => w.kpiName).join(', ')}`);
  }

  // Industry-specific next steps
  switch (industry) {
    case 'FMCG':
      steps.push('Engage supply chain partners for collaborative demand planning and fill rate improvement');
      steps.push('Commission consumer research to validate brand health and repeat purchase drivers');
      break;
    case 'Healthcare':
      steps.push('Conduct clinical pathway review with department chiefs for top readmission diagnoses');
      steps.push('Implement patient experience rounding and real-time feedback mechanisms');
      break;
    case 'Banking':
      steps.push('Review credit risk scoring models and early warning triggers for at-risk accounts');
      steps.push('Assess digital transformation roadmap for cost-to-income ratio improvement');
      break;
    case 'Retail':
      steps.push('Conduct customer journey mapping to identify and eliminate conversion barriers');
      steps.push('Review loyalty program effectiveness and design personalization enhancements');
      break;
    case 'Manufacturing':
      steps.push('Deploy total productive maintenance (TPM) program for critical equipment');
      steps.push('Implement statistical process control on high-defect production lines');
      break;
  }

  // Always end with follow-up
  steps.push('Schedule 30-day progress review to assess intervention effectiveness and adjust course');
  steps.push('Define success metrics and targets for next quarter based on benchmark trajectory');

  return steps;
}

/**
 * Main function: Generates the complete executive consulting storyline.
 * All content is generated dynamically from KPI values, benchmark gaps, and insights.
 */
export function generateStoryline(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[],
  industry: Industry
): ExecutiveStoryline {
  return {
    executiveSummary: generateExecutiveSummary(kpiValues, benchmarks, insights, industry),
    currentPerformance: generateCurrentPerformance(kpiValues, benchmarks, industry),
    keyInsight: generateKeyInsight(insights, benchmarks, industry),
    rootCause: generateRootCause(kpiValues, benchmarks, insights, industry),
    businessImpact: generateBusinessImpact(kpiValues, benchmarks, insights),
    recommendation: generateRecommendation(kpiValues, benchmarks, insights, industry),
    nextSteps: generateNextSteps(kpiValues, benchmarks, insights, industry)
  };
}

/**
 * Generates a one-page executive brief (condensed version).
 */
export function generateExecutiveBrief(
  kpiValues: KPIValue[],
  benchmarks: BenchmarkComparison[],
  insights: AIInsight[],
  industry: Industry
): string {
  const storyline = generateStoryline(kpiValues, benchmarks, insights, industry);

  return [
    '# Executive Brief',
    '',
    '## Summary',
    storyline.executiveSummary,
    '',
    '## Key Finding',
    storyline.keyInsight,
    '',
    '## Recommended Action',
    storyline.recommendation.split('\n').slice(0, 5).join('\n'),
    '',
    '## Immediate Next Steps',
    storyline.nextSteps.slice(0, 3).map(s => `- ${s}`).join('\n')
  ].join('\n');
}

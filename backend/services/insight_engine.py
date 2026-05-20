from typing import List, Optional
import os

from models.schemas import AIInsight, KPIValue, BenchmarkComparison, Industry


def _generate_rule_based_insights(
    kpi_values: List[KPIValue],
    benchmark_comparisons: List[BenchmarkComparison],
    industry: Industry,
) -> List[AIInsight]:
    insights = []
    kpi_map = {kpi.kpi_name: kpi for kpi in kpi_values}
    comparison_map = {bc.kpi_name: bc for bc in benchmark_comparisons}

    # FMCG-specific insights
    if industry == Industry.FMCG:
        fill_rate = kpi_map.get("Fill Rate")
        if fill_rate and fill_rate.value < 95:
            severity = "critical" if fill_rate.value < 90 else "high"
            insights.append(AIInsight(
                category="Operational Risk",
                title="Fill Rate Below Industry Threshold",
                description=(
                    f"Current fill rate of {fill_rate.value}% falls below the industry standard of 95%. "
                    f"Each percentage point below target typically represents 2-3% in lost retail revenue "
                    f"due to stockouts and retailer penalties. This gap suggests systemic issues in "
                    f"demand forecasting, production scheduling, or distribution network reliability."
                ),
                severity=severity,
                confidence=0.92,
                recommended_action=(
                    "Implement a three-pronged improvement program: (1) Deploy ML-based demand sensing "
                    "to reduce forecast error by 20-30%, (2) Establish safety stock buffers at key "
                    "distribution nodes, (3) Negotiate flexible production capacity with contract manufacturers."
                ),
                impact_area="Supply Chain & Revenue",
            ))

        revenue = kpi_map.get("Revenue Growth")
        if revenue and revenue.value < 5:
            insights.append(AIInsight(
                category="Growth Strategy",
                title="Revenue Growth Below Peer Median",
                description=(
                    f"Revenue growth of {revenue.value}% trails the FMCG industry median of 8.5%. "
                    f"In a sector where organic growth correlates strongly with market share trajectory, "
                    f"sustained below-peer growth typically signals brand salience erosion or "
                    f"inadequate innovation pipeline throughput."
                ),
                severity="high",
                confidence=0.85,
                recommended_action=(
                    "Conduct a growth decomposition analysis to isolate volume vs. price vs. mix contributions. "
                    "Prioritize portfolio renovation in high-growth micro-segments and evaluate "
                    "direct-to-consumer channels for margin-accretive growth."
                ),
                impact_area="Revenue & Market Position",
            ))

    # Healthcare-specific insights
    if industry == Industry.HEALTHCARE:
        readmission = kpi_map.get("Readmission Rate")
        if readmission and readmission.value > 15:
            severity = "critical" if readmission.value > 20 else "high"
            insights.append(AIInsight(
                category="Clinical Quality",
                title="Elevated 30-Day Readmission Rate",
                description=(
                    f"Readmission rate of {readmission.value}% exceeds the WHO benchmark of 15%. "
                    f"Excess readmissions indicate potential gaps in discharge planning, "
                    f"post-acute care coordination, or patient education. "
                    f"Each avoidable readmission costs an estimated $15,000-$25,000 and "
                    f"exposes the institution to CMS penalty risk."
                ),
                severity=severity,
                confidence=0.90,
                recommended_action=(
                    "Deploy a risk-stratified transitional care model: (1) Implement validated "
                    "readmission risk scoring at admission, (2) Establish nurse navigator follow-up "
                    "within 48 hours post-discharge for high-risk patients, (3) Partner with "
                    "community health organizations for social determinant interventions."
                ),
                impact_area="Patient Outcomes & Financial Performance",
            ))

        los = kpi_map.get("Average Length of Stay")
        if los and los.value > 5.5:
            insights.append(AIInsight(
                category="Operational Efficiency",
                title="Length of Stay Exceeds Benchmark",
                description=(
                    f"Average length of stay at {los.value} days surpasses the benchmark of 5.5 days. "
                    f"Extended stays reduce bed availability, increase per-case costs, and may indicate "
                    f"inefficiencies in clinical pathways or discharge bottlenecks."
                ),
                severity="medium",
                confidence=0.87,
                recommended_action=(
                    "Implement standardized clinical pathways for high-volume DRGs, "
                    "establish daily multidisciplinary rounds with discharge milestones, "
                    "and deploy predictive analytics to identify discharge-ready patients earlier."
                ),
                impact_area="Capacity & Cost Management",
            ))

    # Banking-specific insights
    if industry == Industry.BANKING:
        npa = kpi_map.get("NPA Ratio")
        if npa and npa.value > 3.5:
            severity = "critical" if npa.value > 6 else "high"
            insights.append(AIInsight(
                category="Credit Risk",
                title="NPA Ratio Exceeds Regulatory Comfort Zone",
                description=(
                    f"Gross NPA ratio of {npa.value}% exceeds the FDIC industry benchmark of 3.5%. "
                    f"Elevated NPAs erode net interest margin through provisioning requirements, "
                    f"constrain lending capacity, and may trigger enhanced regulatory scrutiny. "
                    f"The gap to top-quartile performance (1.5%) suggests structural credit underwriting issues."
                ),
                severity=severity,
                confidence=0.93,
                recommended_action=(
                    "Execute a three-horizon NPA resolution strategy: (1) Immediate: Establish a dedicated "
                    "resolution team for top 20 stressed accounts, (2) Medium-term: Deploy AI-based early "
                    "warning system for pre-delinquency identification, (3) Strategic: Review sector "
                    "concentration limits and enhance credit scoring models."
                ),
                impact_area="Asset Quality & Capital",
            ))

        cir = kpi_map.get("Cost to Income Ratio")
        if cir and cir.value > 55:
            insights.append(AIInsight(
                category="Operational Efficiency",
                title="Cost-to-Income Ratio Above Efficiency Frontier",
                description=(
                    f"Cost-to-income ratio of {cir.value}% significantly exceeds the industry median of 55% "
                    f"and is far from the top-quartile benchmark of 42%. This indicates potential "
                    f"over-investment in legacy infrastructure, sub-optimal branch network economics, "
                    f"or insufficient digital channel migration."
                ),
                severity="medium",
                confidence=0.88,
                recommended_action=(
                    "Commission a zero-based cost transformation program targeting 500-800 bps improvement: "
                    "rationalize branch footprint, accelerate digital self-service adoption to 70%+, "
                    "and deploy intelligent process automation across back-office operations."
                ),
                impact_area="Profitability & Competitiveness",
            ))

    # Retail-specific insights
    if industry == Industry.RETAIL:
        retention = kpi_map.get("Customer Retention")
        if retention and retention.value < 60:
            insights.append(AIInsight(
                category="Customer Strategy",
                title="Customer Retention Below Sustainable Level",
                description=(
                    f"Customer retention of {retention.value}% falls below the industry benchmark of 60%. "
                    f"Given that acquiring new customers costs 5-7x more than retaining existing ones, "
                    f"this retention deficit represents a significant lifetime value leakage. "
                    f"The gap to top-quartile (80%) suggests fundamental proposition or experience gaps."
                ),
                severity="high",
                confidence=0.86,
                recommended_action=(
                    "Launch a retention-focused transformation: (1) Deploy churn prediction models to "
                    "identify at-risk customers 30-60 days before lapse, (2) Redesign the loyalty program "
                    "around personalized rewards and experiential benefits, (3) Implement closed-loop "
                    "NPS feedback to address systematic friction points."
                ),
                impact_area="Customer Lifetime Value & Growth",
            ))

        margin = kpi_map.get("Gross Margin")
        if margin and margin.value < 35:
            insights.append(AIInsight(
                category="Financial Performance",
                title="Gross Margin Under Pressure",
                description=(
                    f"Gross margin of {margin.value}% is below the industry benchmark of 35%, "
                    f"indicating potential over-reliance on promotional volume, unfavorable product mix, "
                    f"or insufficient supplier negotiation leverage."
                ),
                severity="medium",
                confidence=0.84,
                recommended_action=(
                    "Implement margin enhancement through: (1) Markdown optimization using price elasticity "
                    "modeling, (2) Private label expansion in high-margin categories, "
                    "(3) Renegotiation of key supplier contracts with consolidated volume leverage."
                ),
                impact_area="Profitability",
            ))

    # Manufacturing-specific insights
    if industry == Industry.MANUFACTURING:
        oee = kpi_map.get("OEE")
        if oee and oee.value < 65:
            severity = "critical" if oee.value < 50 else "high"
            insights.append(AIInsight(
                category="Production Efficiency",
                title="OEE Indicates Significant Hidden Factory",
                description=(
                    f"OEE of {oee.value}% reveals substantial hidden capacity loss. "
                    f"World-class manufacturing targets 85%+ OEE. The current gap represents "
                    f"approximately {round((85 - oee.value) / 100 * 8760, 0)} hours of lost productive "
                    f"capacity annually per line. Root causes typically distribute across availability "
                    f"losses (changeovers, breakdowns), performance losses (minor stops, speed reduction), "
                    f"and quality losses (defects, startup rejects)."
                ),
                severity=severity,
                confidence=0.91,
                recommended_action=(
                    "Deploy a Total Productive Maintenance (TPM) program: (1) Conduct detailed "
                    "Six Big Losses analysis to identify dominant loss categories, (2) Implement "
                    "SMED methodology to reduce changeover times by 50%, (3) Establish autonomous "
                    "maintenance routines with operator-level inspections, (4) Install real-time "
                    "OEE monitoring dashboards at each production line."
                ),
                impact_area="Capacity & Unit Economics",
            ))

        scrap = kpi_map.get("Scrap Rate")
        if scrap and scrap.value > 5:
            insights.append(AIInsight(
                category="Quality & Waste",
                title="Scrap Rate Exceeding Material Efficiency Targets",
                description=(
                    f"Scrap rate of {scrap.value}% exceeds the industry benchmark of 5%, "
                    f"representing direct material cost leakage and environmental liability. "
                    f"Top-quartile performers achieve 2% or below through rigorous statistical "
                    f"process control and first-time-right manufacturing principles."
                ),
                severity="medium",
                confidence=0.86,
                recommended_action=(
                    "Implement a structured waste reduction program: (1) Deploy SPC charts on critical "
                    "process parameters, (2) Conduct 8D root cause analysis on top scrap-generating "
                    "products, (3) Evaluate material substitution and design-for-manufacturing changes, "
                    "(4) Establish scrap cost visibility by production cell and shift."
                ),
                impact_area="Cost of Goods Sold & Sustainability",
            ))

    # Generic insights from benchmark comparisons
    critical_gaps = [bc for bc in benchmark_comparisons if bc.performance_level == "Critical"]
    if critical_gaps and len(insights) < 5:
        for gap in critical_gaps[:2]:
            if not any(i.title.lower().find(gap.kpi_name.lower()) != -1 for i in insights):
                insights.append(AIInsight(
                    category="Performance Gap",
                    title=f"{gap.kpi_name} Requires Immediate Attention",
                    description=(
                        f"{gap.kpi_name} at {gap.actual_value}{gap.unit} represents a "
                        f"{abs(gap.gap_percentage):.1f}% deviation from the industry benchmark of "
                        f"{gap.benchmark_value}{gap.unit}. This critical gap positions the organization "
                        f"in the bottom quartile relative to peers, warranting priority intervention."
                    ),
                    severity="critical",
                    confidence=0.80,
                    recommended_action=(
                        f"Commission a diagnostic deep-dive on {gap.kpi_name} drivers, "
                        f"establish a 90-day rapid improvement target to reach {gap.benchmark_value}{gap.unit}, "
                        f"and assign executive sponsorship with weekly progress reviews."
                    ),
                    impact_area="Competitive Position",
                ))

    return insights


def generate_insights(
    kpi_values: List[KPIValue],
    benchmark_comparisons: List[BenchmarkComparison],
    industry: Industry,
) -> List[AIInsight]:
    insights = _generate_rule_based_insights(kpi_values, benchmark_comparisons, industry)

    # Optional: Enhance with OpenAI if API key is available
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key and len(insights) < 3:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)

            kpi_summary = ", ".join([f"{k.kpi_name}: {k.value}{k.unit}" for k in kpi_values])
            gap_summary = ", ".join(
                [f"{bc.kpi_name}: {bc.gap_percentage:+.1f}% vs benchmark" for bc in benchmark_comparisons]
            )

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a senior management consultant. Generate one strategic insight "
                            "based on the KPI data provided. Be specific, data-driven, and actionable. "
                            "Respond with a JSON object containing: category, title, description, "
                            "severity (low/medium/high/critical), recommended_action, impact_area."
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Industry: {industry.value}\n"
                            f"KPIs: {kpi_summary}\n"
                            f"Benchmark Gaps: {gap_summary}"
                        ),
                    },
                ],
                temperature=0.7,
                max_tokens=500,
            )
            # Parse would go here in production
        except Exception:
            pass  # Gracefully fall back to rule-based only

    return insights

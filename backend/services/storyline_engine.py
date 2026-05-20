from typing import List
from models.schemas import ExecutiveStoryline, KPIValue, BenchmarkComparison, AIInsight, Industry


def generate_storyline(
    kpi_values: List[KPIValue],
    benchmark_comparisons: List[BenchmarkComparison],
    insights: List[AIInsight],
    industry: Industry,
) -> ExecutiveStoryline:
    # Categorize performance
    above_benchmark = [bc for bc in benchmark_comparisons if bc.performance_level in ("Top Quartile", "Above Average")]
    below_benchmark = [bc for bc in benchmark_comparisons if bc.performance_level in ("Below Average", "Critical")]
    critical_items = [bc for bc in benchmark_comparisons if bc.performance_level == "Critical"]

    total_kpis = len(benchmark_comparisons)
    above_count = len(above_benchmark)
    below_count = len(below_benchmark)

    # Build executive summary
    if total_kpis == 0:
        exec_summary = (
            f"Analysis of the {industry.value} dataset reveals operational metrics that require "
            f"further benchmarking context. Initial data profiling has been completed."
        )
    elif above_count > below_count:
        exec_summary = (
            f"The organization demonstrates broadly strong performance across {industry.value} KPIs, "
            f"with {above_count} of {total_kpis} metrics meeting or exceeding industry benchmarks. "
            f"However, targeted improvements in {below_count} underperforming areas could unlock "
            f"significant additional value and strengthen competitive positioning."
        )
    elif below_count > above_count:
        exec_summary = (
            f"Performance analysis reveals a material gap to industry benchmarks, "
            f"with {below_count} of {total_kpis} KPIs falling below peer median. "
            f"A structured performance improvement program is recommended to close the "
            f"competitive gap and protect market position in the {industry.value} sector."
        )
    else:
        exec_summary = (
            f"The {industry.value} performance profile shows a mixed picture: "
            f"{above_count} metrics at or above benchmark while {below_count} require attention. "
            f"A focused transformation on underperforming areas, while protecting current strengths, "
            f"will be critical to sustaining competitive advantage."
        )

    # Current performance narrative
    kpi_narratives = []
    for kpi in kpi_values[:5]:
        trend_text = f" (trending {kpi.trend})" if kpi.trend and kpi.trend != "stable" else ""
        kpi_narratives.append(f"{kpi.kpi_name}: {kpi.value}{kpi.unit}{trend_text}")

    current_performance = (
        f"Current operational metrics: {'; '.join(kpi_narratives)}. "
        f"{'Several metrics show declining trends requiring immediate intervention.' if any(k.trend == 'declining' for k in kpi_values) else 'Overall trajectory is stable with select improvement opportunities.'}"
    )

    # Key insight - pick the highest severity insight
    if insights:
        critical_insights = [i for i in insights if i.severity == "critical"]
        high_insights = [i for i in insights if i.severity == "high"]
        primary_insight = (critical_insights or high_insights or insights)[0]
        key_insight = (
            f"{primary_insight.title}: {primary_insight.description}"
        )
    else:
        key_insight = (
            "Data analysis complete. Further contextual benchmarking needed to identify "
            "the primary strategic lever for performance improvement."
        )

    # Root cause analysis
    if critical_items:
        worst = critical_items[0]
        root_cause = (
            f"Root cause analysis indicates that {worst.kpi_name} underperformance "
            f"(gap of {abs(worst.gap_percentage):.1f}% vs benchmark) is likely driven by "
            f"a combination of process inefficiency, resource allocation misalignment, and "
            f"potential capability gaps in the underlying operating model. "
            f"The severity of the gap ({worst.actual_value} vs benchmark {worst.benchmark_value}{worst.unit}) "
            f"suggests systemic rather than episodic factors."
        )
    elif below_benchmark:
        worst = below_benchmark[0]
        root_cause = (
            f"Analysis points to {worst.kpi_name} as the primary drag on overall performance, "
            f"with a {abs(worst.gap_percentage):.1f}% shortfall against the industry benchmark of "
            f"{worst.benchmark_value}{worst.unit}. Contributing factors likely include operational "
            f"process maturity and strategic prioritization gaps relative to best-in-class peers."
        )
    else:
        root_cause = (
            "No critical performance gaps identified. Current performance levels reflect "
            "effective execution against industry benchmarks. Focus should shift to sustaining "
            "advantages and identifying next-horizon growth opportunities."
        )

    # Business impact quantification
    if below_benchmark:
        impact_items = []
        for bc in below_benchmark[:3]:
            impact_items.append(
                f"{bc.kpi_name} gap of {abs(bc.gap):.1f}{bc.unit} vs benchmark"
            )
        business_impact = (
            f"The identified performance gaps carry material financial implications: "
            f"{'; '.join(impact_items)}. Closing these gaps to industry median would represent "
            f"significant value creation through improved operational efficiency, reduced risk "
            f"exposure, and enhanced competitive positioning in the {industry.value} sector."
        )
    else:
        business_impact = (
            f"Current above-benchmark performance positions the organization favorably "
            f"for market share gains and premium valuation in the {industry.value} sector. "
            f"Maintaining this trajectory requires continued investment in capabilities "
            f"that drive differentiation."
        )

    # Recommendation
    if insights:
        primary = insights[0]
        recommendation = (
            f"Priority recommendation: {primary.recommended_action} "
            f"This intervention targets the highest-impact opportunity identified in the analysis "
            f"and aligns with the overall strategic imperative of strengthening {primary.impact_area}."
        )
    else:
        recommendation = (
            "Continue monitoring current performance trajectory and invest in data infrastructure "
            "to enable more granular performance analytics and predictive insights."
        )

    # Next steps
    next_steps = [
        "Validate findings with operational leadership and align on priority metrics",
        "Establish baseline measurement cadence (weekly/monthly) for critical KPIs",
    ]

    if critical_items:
        next_steps.insert(0, f"Immediate action: Deploy task force to address {critical_items[0].kpi_name} gap")
        next_steps.append("Develop 90-day rapid improvement plan with clear milestones and accountability")
    elif below_benchmark:
        next_steps.append("Design targeted improvement initiatives for below-benchmark metrics")
        next_steps.append("Benchmark against top-quartile peers to define aspiration targets")

    next_steps.append("Schedule quarterly strategic review to track progress against benchmarks")
    next_steps.append("Evaluate technology investments to enable real-time performance monitoring")

    return ExecutiveStoryline(
        executive_summary=exec_summary,
        current_performance=current_performance,
        key_insight=key_insight,
        root_cause=root_cause,
        business_impact=business_impact,
        recommendation=recommendation,
        next_steps=next_steps,
    )

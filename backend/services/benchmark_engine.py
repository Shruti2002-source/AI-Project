from typing import List, Dict
from models.schemas import BenchmarkEntry, BenchmarkComparison, KPIValue, Industry


BENCHMARK_LIBRARY: Dict[Industry, List[BenchmarkEntry]] = {
    Industry.FMCG: [
        BenchmarkEntry(
            kpi_name="Fill Rate",
            industry=Industry.FMCG,
            value=95.0,
            unit="%",
            top_quartile=98.5,
            source="NielsenIQ Retail Measurement Services",
            source_url="https://nielseniq.com/global/en/solutions/retail-measurement/",
            methodology="Weighted average fill rate across top 50 FMCG companies globally, measured as orders fulfilled completely and on-time vs total orders placed by retailers",
            confidence=0.92,
        ),
        BenchmarkEntry(
            kpi_name="Revenue Growth",
            industry=Industry.FMCG,
            value=8.5,
            unit="%",
            top_quartile=14.0,
            source="McKinsey Consumer Packaged Goods Practice",
            source_url="https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights",
            methodology="Year-over-year organic revenue growth for top-quartile FMCG companies, excluding M&A effects, based on analysis of 200+ global CPG firms",
            confidence=0.88,
        ),
        BenchmarkEntry(
            kpi_name="Market Share",
            industry=Industry.FMCG,
            value=15.0,
            unit="%",
            top_quartile=25.0,
            source="Euromonitor International Passport Database",
            source_url="https://www.euromonitor.com/our-expertise/passport",
            methodology="Category-weighted average market share for leading brand in each FMCG category across 80 countries",
            confidence=0.85,
        ),
        BenchmarkEntry(
            kpi_name="Distribution Coverage",
            industry=Industry.FMCG,
            value=75.0,
            unit="%",
            top_quartile=90.0,
            source="NielsenIQ Retail Index",
            source_url="https://nielseniq.com/global/en/solutions/retail-index/",
            methodology="Numeric distribution measured as percentage of stores carrying the product out of total relevant retail universe",
            confidence=0.90,
        ),
        BenchmarkEntry(
            kpi_name="Inventory Days",
            industry=Industry.FMCG,
            value=45.0,
            unit="days",
            top_quartile=30.0,
            source="Gartner Supply Chain Top 25",
            source_url="https://www.gartner.com/en/supply-chain/research/supply-chain-top-25",
            methodology="Days of inventory outstanding calculated as average inventory divided by COGS per day, benchmarked across Gartner Supply Chain Top 25 companies",
            confidence=0.87,
        ),
    ],
    Industry.HEALTHCARE: [
        BenchmarkEntry(
            kpi_name="Readmission Rate",
            industry=Industry.HEALTHCARE,
            value=15.0,
            unit="%",
            top_quartile=10.0,
            source="WHO Global Health Observatory",
            source_url="https://www.who.int/data/gho",
            methodology="30-day all-cause readmission rate for acute care hospitals, risk-adjusted for patient severity mix using APR-DRG methodology",
            confidence=0.91,
        ),
        BenchmarkEntry(
            kpi_name="Bed Occupancy Rate",
            industry=Industry.HEALTHCARE,
            value=80.0,
            unit="%",
            top_quartile=85.0,
            source="OECD Health Statistics",
            source_url="https://www.oecd.org/health/health-data.htm",
            methodology="Average annual bed occupancy rate calculated as total inpatient bed-days divided by available bed-days across OECD member hospitals",
            confidence=0.93,
        ),
        BenchmarkEntry(
            kpi_name="Average Length of Stay",
            industry=Industry.HEALTHCARE,
            value=5.5,
            unit="days",
            top_quartile=4.0,
            source="CMS Hospital Compare",
            source_url="https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HospitalQualityInits",
            methodology="Risk-adjusted average length of stay for all DRGs, normalized for case-mix index using 3M APR-DRG grouper",
            confidence=0.90,
        ),
        BenchmarkEntry(
            kpi_name="Patient Satisfaction",
            industry=Industry.HEALTHCARE,
            value=72.0,
            unit="score",
            top_quartile=85.0,
            source="Press Ganey HCAHPS Database",
            source_url="https://www.pressganey.com/products/patient-experience",
            methodology="HCAHPS Overall Hospital Rating (9 or 10 on 0-10 scale) percentile ranking across 4000+ US acute care hospitals",
            confidence=0.94,
        ),
        BenchmarkEntry(
            kpi_name="Mortality Rate",
            industry=Industry.HEALTHCARE,
            value=2.5,
            unit="%",
            top_quartile=1.5,
            source="WHO Global Health Estimates",
            source_url="https://www.who.int/data/global-health-estimates",
            methodology="In-hospital mortality rate risk-adjusted for patient acuity, age, and comorbidity burden using Charlson Comorbidity Index",
            confidence=0.89,
        ),
    ],
    Industry.BANKING: [
        BenchmarkEntry(
            kpi_name="NPA Ratio",
            industry=Industry.BANKING,
            value=3.5,
            unit="%",
            top_quartile=1.5,
            source="FDIC Quarterly Banking Profile",
            source_url="https://www.fdic.gov/analysis/quarterly-banking-profile/",
            methodology="Gross non-performing assets (90+ days past due + non-accrual) as percentage of gross advances, measured across FDIC-insured commercial banks",
            confidence=0.95,
        ),
        BenchmarkEntry(
            kpi_name="Net Interest Margin",
            industry=Industry.BANKING,
            value=3.2,
            unit="%",
            top_quartile=4.0,
            source="Federal Reserve Bank Statistical Release",
            source_url="https://www.federalreserve.gov/releases/h8/",
            methodology="Net interest income as percentage of average earning assets, calculated quarterly and annualized for all commercial banks reporting to the Fed",
            confidence=0.94,
        ),
        BenchmarkEntry(
            kpi_name="Cost to Income Ratio",
            industry=Industry.BANKING,
            value=55.0,
            unit="%",
            top_quartile=42.0,
            source="McKinsey Global Banking Annual Review",
            source_url="https://www.mckinsey.com/industries/financial-services/our-insights/global-banking-annual-review",
            methodology="Operating expenses divided by operating income (net interest income + non-interest income), benchmarked across top 1000 global banks by assets",
            confidence=0.91,
        ),
        BenchmarkEntry(
            kpi_name="Return on Assets",
            industry=Industry.BANKING,
            value=1.1,
            unit="%",
            top_quartile=1.8,
            source="BIS Banking Statistics",
            source_url="https://www.bis.org/statistics/bankstats.htm",
            methodology="Net income after tax divided by average total assets, annualized, measured across internationally active banks reporting to BIS",
            confidence=0.92,
        ),
        BenchmarkEntry(
            kpi_name="Capital Adequacy Ratio",
            industry=Industry.BANKING,
            value=14.0,
            unit="%",
            top_quartile=18.0,
            source="Basel Committee on Banking Supervision",
            source_url="https://www.bis.org/bcbs/",
            methodology="Total qualifying capital (Tier 1 + Tier 2) divided by risk-weighted assets under Basel III standardized approach",
            confidence=0.96,
        ),
    ],
    Industry.RETAIL: [
        BenchmarkEntry(
            kpi_name="Same Store Sales Growth",
            industry=Industry.RETAIL,
            value=4.0,
            unit="%",
            top_quartile=8.0,
            source="NRF National Retail Federation",
            source_url="https://nrf.com/research-insights/economy/monthly-economic-review",
            methodology="Year-over-year revenue growth for stores open at least 12 months, excluding new openings and closures, weighted by store format",
            confidence=0.89,
        ),
        BenchmarkEntry(
            kpi_name="Revenue per Sq Ft",
            industry=Industry.RETAIL,
            value=450.0,
            unit="$/sqft",
            top_quartile=700.0,
            source="CoStar Group Retail Analytics",
            source_url="https://www.costar.com/products/analytics",
            methodology="Annual revenue divided by total selling area in square feet, benchmarked across specialty retail and department store categories",
            confidence=0.86,
        ),
        BenchmarkEntry(
            kpi_name="Inventory Turnover",
            industry=Industry.RETAIL,
            value=8.0,
            unit="x",
            top_quartile=12.0,
            source="Deloitte Global Retail Outlook",
            source_url="https://www2.deloitte.com/global/en/pages/consumer-business/articles/global-powers-of-retailing.html",
            methodology="Cost of goods sold divided by average inventory value, annualized, benchmarked across top 250 global retailers",
            confidence=0.88,
        ),
        BenchmarkEntry(
            kpi_name="Gross Margin",
            industry=Industry.RETAIL,
            value=35.0,
            unit="%",
            top_quartile=45.0,
            source="S&P Capital IQ Retail Industry Benchmarks",
            source_url="https://www.spglobal.com/marketintelligence/en/solutions/capital-iq-pro",
            methodology="Gross profit (revenue minus COGS) divided by revenue, median across publicly listed retailers by sub-segment",
            confidence=0.91,
        ),
        BenchmarkEntry(
            kpi_name="Customer Retention",
            industry=Industry.RETAIL,
            value=60.0,
            unit="%",
            top_quartile=80.0,
            source="Bain & Company Loyalty Insights",
            source_url="https://www.bain.com/insights/topics/customer-loyalty/",
            methodology="Percentage of customers making repeat purchases within 12 months, measured via loyalty program data and cohort analysis",
            confidence=0.84,
        ),
    ],
    Industry.MANUFACTURING: [
        BenchmarkEntry(
            kpi_name="OEE",
            industry=Industry.MANUFACTURING,
            value=65.0,
            unit="%",
            top_quartile=85.0,
            source="SEMI (Semiconductor Equipment and Materials International)",
            source_url="https://www.semi.org/en/industry-groups/eps/oee",
            methodology="Overall Equipment Effectiveness = Availability x Performance x Quality, measured across discrete and process manufacturing plants globally",
            confidence=0.90,
        ),
        BenchmarkEntry(
            kpi_name="First Pass Yield",
            industry=Industry.MANUFACTURING,
            value=90.0,
            unit="%",
            top_quartile=97.0,
            source="ASQ (American Society for Quality) Benchmarking Study",
            source_url="https://asq.org/quality-resources/benchmarking",
            methodology="Percentage of units passing all quality checks on first attempt without rework, measured at final assembly stage",
            confidence=0.88,
        ),
        BenchmarkEntry(
            kpi_name="Scrap Rate",
            industry=Industry.MANUFACTURING,
            value=5.0,
            unit="%",
            top_quartile=2.0,
            source="IndustryWeek Manufacturing Performance Survey",
            source_url="https://www.industryweek.com/operations/article/best-plants",
            methodology="Total scrap material cost as percentage of total material input cost, measured across IndustryWeek Best Plants nominees",
            confidence=0.85,
        ),
        BenchmarkEntry(
            kpi_name="Capacity Utilization",
            industry=Industry.MANUFACTURING,
            value=75.0,
            unit="%",
            top_quartile=88.0,
            source="Federal Reserve Industrial Production and Capacity Utilization",
            source_url="https://www.federalreserve.gov/releases/g17/",
            methodology="Actual output as percentage of maximum sustainable output, seasonally adjusted, across US manufacturing sectors",
            confidence=0.93,
        ),
        BenchmarkEntry(
            kpi_name="MTBF",
            industry=Industry.MANUFACTURING,
            value=500.0,
            unit="hours",
            top_quartile=1200.0,
            source="Plant Engineering Maintenance Survey",
            source_url="https://www.plantengineering.com/articles/maintenance-study/",
            methodology="Average operating hours between unplanned equipment failures, measured across critical production assets in continuous manufacturing",
            confidence=0.82,
        ),
    ],
}


def get_benchmark_comparisons(
    kpi_values: List[KPIValue], industry: Industry
) -> List[BenchmarkComparison]:
    comparisons = []
    benchmarks = BENCHMARK_LIBRARY.get(industry, [])

    benchmark_map = {b.kpi_name: b for b in benchmarks}

    for kpi in kpi_values:
        benchmark = benchmark_map.get(kpi.kpi_name)
        if benchmark is None:
            continue

        gap = kpi.value - benchmark.value
        gap_percentage = (gap / benchmark.value * 100) if benchmark.value != 0 else 0.0

        # Determine performance level
        # For KPIs where lower is better (NPA, Scrap, Readmission, Mortality, etc.)
        lower_is_better = kpi.kpi_name in [
            "NPA Ratio", "Scrap Rate", "Readmission Rate", "Mortality Rate",
            "Cost to Income Ratio", "Average Length of Stay", "Inventory Days",
        ]

        if lower_is_better:
            if kpi.value <= benchmark.top_quartile:
                performance_level = "Top Quartile"
            elif kpi.value <= benchmark.value:
                performance_level = "Above Average"
            elif kpi.value <= benchmark.value * 1.2:
                performance_level = "Below Average"
            else:
                performance_level = "Critical"
        else:
            if kpi.value >= benchmark.top_quartile:
                performance_level = "Top Quartile"
            elif kpi.value >= benchmark.value:
                performance_level = "Above Average"
            elif kpi.value >= benchmark.value * 0.8:
                performance_level = "Below Average"
            else:
                performance_level = "Critical"

        comparisons.append(
            BenchmarkComparison(
                kpi_name=kpi.kpi_name,
                actual_value=kpi.value,
                benchmark_value=benchmark.value,
                top_quartile=benchmark.top_quartile,
                gap=round(gap, 2),
                gap_percentage=round(gap_percentage, 2),
                unit=kpi.unit,
                performance_level=performance_level,
                source=benchmark.source,
            )
        )

    return comparisons

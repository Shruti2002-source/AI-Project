from typing import List, Dict, Optional
import pandas as pd
import numpy as np

from models.schemas import KPIValue, Industry


KPI_COLUMN_MAPPINGS = {
    Industry.FMCG: {
        "Fill Rate": {
            "columns": ["fill_rate", "fill rate", "order_fill_rate", "case_fill_rate"],
            "calculation": "mean",
            "unit": "%",
        },
        "Revenue Growth": {
            "columns": ["revenue", "sales", "net_sales", "total_revenue"],
            "calculation": "growth",
            "unit": "%",
        },
        "Market Share": {
            "columns": ["market_share", "share", "mkt_share"],
            "calculation": "latest",
            "unit": "%",
        },
        "Distribution Coverage": {
            "columns": ["distribution", "distribution_coverage", "numeric_distribution"],
            "calculation": "mean",
            "unit": "%",
        },
        "Inventory Days": {
            "columns": ["inventory_days", "days_of_inventory", "doi"],
            "calculation": "mean",
            "unit": "days",
        },
    },
    Industry.HEALTHCARE: {
        "Readmission Rate": {
            "columns": ["readmission", "readmission_rate", "30day_readmission"],
            "calculation": "mean",
            "unit": "%",
        },
        "Bed Occupancy Rate": {
            "columns": ["bed_occupancy", "occupancy_rate", "bed_utilization"],
            "calculation": "mean",
            "unit": "%",
        },
        "Average Length of Stay": {
            "columns": ["los", "length_of_stay", "avg_los", "average_los"],
            "calculation": "mean",
            "unit": "days",
        },
        "Patient Satisfaction": {
            "columns": ["satisfaction", "satisfaction_score", "patient_satisfaction", "hcahps"],
            "calculation": "mean",
            "unit": "score",
        },
        "Mortality Rate": {
            "columns": ["mortality", "mortality_rate", "death_rate"],
            "calculation": "mean",
            "unit": "%",
        },
    },
    Industry.BANKING: {
        "NPA Ratio": {
            "columns": ["npa", "npa_ratio", "non_performing", "gross_npa"],
            "calculation": "latest",
            "unit": "%",
        },
        "Net Interest Margin": {
            "columns": ["nim", "net_interest_margin", "interest_margin"],
            "calculation": "mean",
            "unit": "%",
        },
        "Cost to Income Ratio": {
            "columns": ["cost_to_income", "cir", "efficiency_ratio"],
            "calculation": "mean",
            "unit": "%",
        },
        "Return on Assets": {
            "columns": ["roa", "return_on_assets"],
            "calculation": "mean",
            "unit": "%",
        },
        "Capital Adequacy Ratio": {
            "columns": ["car", "capital_adequacy", "tier1", "crar"],
            "calculation": "latest",
            "unit": "%",
        },
    },
    Industry.RETAIL: {
        "Same Store Sales Growth": {
            "columns": ["same_store", "comp_sales", "sss_growth", "like_for_like"],
            "calculation": "mean",
            "unit": "%",
        },
        "Revenue per Sq Ft": {
            "columns": ["revenue_per_sqft", "sales_per_sqft", "revenue_sqft"],
            "calculation": "mean",
            "unit": "$/sqft",
        },
        "Inventory Turnover": {
            "columns": ["inventory_turnover", "stock_turn", "turns"],
            "calculation": "mean",
            "unit": "x",
        },
        "Gross Margin": {
            "columns": ["gross_margin", "gm", "margin"],
            "calculation": "mean",
            "unit": "%",
        },
        "Customer Retention": {
            "columns": ["retention", "customer_retention", "repeat_rate"],
            "calculation": "mean",
            "unit": "%",
        },
    },
    Industry.MANUFACTURING: {
        "OEE": {
            "columns": ["oee", "overall_equipment_effectiveness"],
            "calculation": "mean",
            "unit": "%",
        },
        "First Pass Yield": {
            "columns": ["yield", "fpy", "first_pass_yield", "quality_rate"],
            "calculation": "mean",
            "unit": "%",
        },
        "Scrap Rate": {
            "columns": ["scrap", "scrap_rate", "waste_rate"],
            "calculation": "mean",
            "unit": "%",
        },
        "Capacity Utilization": {
            "columns": ["utilization", "capacity_utilization", "capacity_util"],
            "calculation": "mean",
            "unit": "%",
        },
        "MTBF": {
            "columns": ["mtbf", "mean_time_between_failures"],
            "calculation": "mean",
            "unit": "hours",
        },
    },
}


def _find_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    df_cols_lower = {col.lower().replace(" ", "_"): col for col in df.columns}
    for candidate in candidates:
        candidate_normalized = candidate.lower().replace(" ", "_")
        if candidate_normalized in df_cols_lower:
            return df_cols_lower[candidate_normalized]
    for candidate in candidates:
        for col_lower, col_orig in df_cols_lower.items():
            if candidate in col_lower or col_lower in candidate:
                return col_orig
    return None


def _calculate_growth(series: pd.Series) -> float:
    numeric_series = pd.to_numeric(series, errors="coerce").dropna()
    if len(numeric_series) < 2:
        return 0.0
    earliest = numeric_series.iloc[0]
    latest = numeric_series.iloc[-1]
    if earliest == 0:
        return 0.0
    return round(((latest - earliest) / abs(earliest)) * 100, 2)


def _calculate_mean(series: pd.Series) -> float:
    numeric_series = pd.to_numeric(series, errors="coerce").dropna()
    if len(numeric_series) == 0:
        return 0.0
    return round(float(numeric_series.mean()), 2)


def _calculate_latest(series: pd.Series) -> float:
    numeric_series = pd.to_numeric(series, errors="coerce").dropna()
    if len(numeric_series) == 0:
        return 0.0
    return round(float(numeric_series.iloc[-1]), 2)


def _calculate_median(series: pd.Series) -> float:
    numeric_series = pd.to_numeric(series, errors="coerce").dropna()
    if len(numeric_series) == 0:
        return 0.0
    return round(float(numeric_series.median()), 2)


def _determine_trend(series: pd.Series) -> str:
    numeric_series = pd.to_numeric(series, errors="coerce").dropna()
    if len(numeric_series) < 3:
        return "stable"
    recent_half = numeric_series.iloc[len(numeric_series) // 2:]
    earlier_half = numeric_series.iloc[:len(numeric_series) // 2]
    recent_mean = recent_half.mean()
    earlier_mean = earlier_half.mean()
    pct_change = ((recent_mean - earlier_mean) / abs(earlier_mean)) * 100 if earlier_mean != 0 else 0
    if pct_change > 5:
        return "improving"
    elif pct_change < -5:
        return "declining"
    return "stable"


def map_and_calculate_kpis(df: pd.DataFrame, industry: Industry) -> List[KPIValue]:
    kpi_values = []

    mappings = KPI_COLUMN_MAPPINGS.get(industry, {})
    if not mappings:
        mappings = KPI_COLUMN_MAPPINGS.get(Industry.FMCG, {})

    for kpi_name, config in mappings.items():
        matched_col = _find_column(df, config["columns"])
        if matched_col is None:
            continue

        series = df[matched_col]
        calculation = config["calculation"]

        if calculation == "growth":
            value = _calculate_growth(series)
        elif calculation == "mean":
            value = _calculate_mean(series)
        elif calculation == "latest":
            value = _calculate_latest(series)
        elif calculation == "median":
            value = _calculate_median(series)
        else:
            value = _calculate_mean(series)

        trend = _determine_trend(series)

        kpi_values.append(
            KPIValue(
                kpi_name=kpi_name,
                value=value,
                unit=config["unit"],
                trend=trend,
                period="Latest available",
            )
        )

    return kpi_values

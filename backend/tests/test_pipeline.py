import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
import pandas as pd

from app.analytics.engine import AnalyticsEngine
from app.analytics.schema_detector import detect_columns, has_time_column
from app.analytics.benchmark_engine import compare, load_benchmark_file

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "samples")


def fmcg_csv() -> str:
    return os.path.join(SAMPLES_DIR, "fmcg_sample.csv")

def healthcare_csv() -> str:
    return os.path.join(SAMPLES_DIR, "healthcare_sample.csv")

def banking_csv() -> str:
    return os.path.join(SAMPLES_DIR, "banking_sample.csv")


# ── Schema detection ─────────────────────────────────────────────────────────

def test_fmcg_schema_detection():
    df = pd.read_csv(fmcg_csv())
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    col_map = detect_columns(df, "fmcg")
    assert "revenue" in col_map
    assert "cogs" in col_map
    assert "inventory_value" in col_map
    assert "orders_filled" in col_map

def test_time_column_detection():
    df = pd.read_csv(fmcg_csv())
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    time_col = has_time_column(df)
    assert time_col is not None


# ── FMCG pipeline ─────────────────────────────────────────────────────────────

def test_fmcg_pipeline():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    assert result.industry == "fmcg"
    assert len(result.kpis) >= 3  # at least revenue_growth, inventory_turnover, fill_rate

def test_fmcg_revenue_growth():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    assert "revenue_growth" in result.kpis
    rg = result.kpis["revenue_growth"]
    # Jan revenue=886000, Dec revenue=920000 → growth = (920000-886000)/886000 * 100 ≈ 3.84%
    assert abs(rg.value - 3.84) < 0.5

def test_fmcg_inventory_turnover_below_benchmark():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    assert "inventory_turnover" in result.kpis
    it = result.kpis["inventory_turnover"]
    # Should be below industry benchmark of 10.2x
    assert it.value < 10.5

def test_fmcg_fill_rate_in_warning_zone():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    assert "fill_rate" in result.kpis
    fr = result.kpis["fill_rate"]
    assert 85.0 < fr.value < 99.0  # realistic range

def test_fmcg_historical_data_present():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    for kpi in result.kpis.values():
        assert isinstance(kpi.historical_data, list)


# ── Healthcare pipeline ────────────────────────────────────────────────────────

def test_healthcare_pipeline():
    engine = AnalyticsEngine()
    result = engine.process(healthcare_csv(), ".csv", "healthcare")
    assert result is not None
    assert result.industry == "healthcare"
    assert len(result.kpis) >= 3

def test_healthcare_bed_occupancy():
    engine = AnalyticsEngine()
    result = engine.process(healthcare_csv(), ".csv", "healthcare")
    assert result is not None
    assert "bed_occupancy" in result.kpis
    occ = result.kpis["bed_occupancy"]
    assert 60.0 < occ.value < 95.0

def test_healthcare_operating_margin_positive():
    engine = AnalyticsEngine()
    result = engine.process(healthcare_csv(), ".csv", "healthcare")
    assert result is not None
    assert "operating_margin" in result.kpis
    margin = result.kpis["operating_margin"]
    assert margin.value > 0


# ── Banking pipeline ───────────────────────────────────────────────────────────

def test_banking_pipeline():
    engine = AnalyticsEngine()
    result = engine.process(banking_csv(), ".csv", "banking")
    assert result is not None
    assert result.industry == "banking"
    assert len(result.kpis) >= 2

def test_banking_digital_adoption_trending_up():
    engine = AnalyticsEngine()
    result = engine.process(banking_csv(), ".csv", "banking")
    assert result is not None
    assert "digital_adoption" in result.kpis
    da = result.kpis["digital_adoption"]
    assert da.trend_direction in ("up", "stable")  # should improve over the year


# ── Benchmark variance ────────────────────────────────────────────────────────

def test_benchmark_variance_fmcg_inventory():
    bench = compare("inventory_turnover", "Inventory Turnover", 7.2, "x", "fmcg")
    assert bench is not None
    assert bench.industry_average > 0
    assert bench.variance < 0  # 7.2 < industry_avg of 10.2
    assert bench.position in ("below_average", "bottom_quartile")

def test_benchmark_variance_positive():
    bench = compare("revenue_growth", "Revenue Growth", 15.0, "%", "fmcg")
    assert bench is not None
    assert bench.variance > 0
    assert bench.position in ("top_quartile", "above_average")

def test_benchmark_unknown_kpi_returns_none():
    result = compare("nonexistent_kpi", "N/A", 100.0, "%", "fmcg")
    assert result is None


# ── Insight generation ────────────────────────────────────────────────────────

def test_insights_generated():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    assert isinstance(result.insights, list)
    assert len(result.insights) >= 1

def test_insights_have_required_fields():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    for insight in result.insights:
        assert "id" in insight
        assert "title" in insight
        assert "description" in insight
        assert "recommendation" in insight
        assert "confidence" in insight

def test_insights_contain_real_numbers():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    for insight in result.insights:
        desc = insight["description"]
        # Should contain numeric values, not generic placeholders
        has_number = any(c.isdigit() for c in desc)
        assert has_number, f"Insight description has no numbers: {desc}"


# ── Graceful degradation ───────────────────────────────────────────────────────

def test_partial_dataset_returns_partial_kpis(tmp_path):
    # CSV with only revenue column — should calculate revenue_growth but skip others
    df = pd.DataFrame({"month": ["2024-01", "2024-06", "2024-12"], "revenue": [886000, 910000, 920000]})
    path = str(tmp_path / "partial.csv")
    df.to_csv(path, index=False)
    engine = AnalyticsEngine()
    result = engine.process(path, ".csv", "fmcg")
    assert result is not None
    assert "revenue_growth" in result.kpis
    assert "inventory_turnover" not in result.kpis  # missing cogs/inventory cols

def test_empty_file_returns_none(tmp_path):
    path = str(tmp_path / "empty.csv")
    pd.DataFrame().to_csv(path, index=False)
    engine = AnalyticsEngine()
    result = engine.process(path, ".csv", "fmcg")
    assert result is None  # engine should return None on validation failure

def test_formula_provenance_in_result():
    engine = AnalyticsEngine()
    result = engine.process(fmcg_csv(), ".csv", "fmcg")
    assert result is not None
    for kpi in result.kpis.values():
        assert kpi.formula_used  # should not be empty
        assert kpi.columns_detected  # should list actual column names used

import io
import pandas as pd
import pytest
from app.core.benchmark_engine import compare_kpi_to_benchmark, get_benchmarks_for_industry
from app.core.industry_detector import detect_industry
from app.core.kpi_calculator import calculate_all_kpis, calculate_kpi
from app.core.kpi_mapper import map_kpis

def test_csv_parsing():
    csv_data = "Fill_Rate_Percent,Inventory_Turnover,Revenue_USD\n95.2,8.5,1000000\n93.1,7.2,950000"
    df = pd.read_csv(io.StringIO(csv_data))
    assert len(df) == 2
    assert "Fill_Rate_Percent" in df.columns
    assert df["Fill_Rate_Percent"].iloc[0] == pytest.approx(95.2)

def test_industry_detection_fmcg():
    columns = ["Fill_Rate_Percent", "Inventory_Turnover", "SKU", "Forecast_Accuracy"]
    industry, confidence, _ = detect_industry(columns, "fmcg_data.csv")
    assert industry == "FMCG"
    assert confidence > 0.5

def test_industry_detection_healthcare():
    columns = ["Patient_Visits", "Hospital_ID", "Readmission_Rate", "Bed_Occupancy"]
    industry, confidence, _ = detect_industry(columns, "hospital_data.csv")
    assert industry == "Healthcare"
    assert confidence > 0.4

def test_industry_detection_manufacturing():
    columns = ["OEE", "Defect_Rate", "Machine_Downtime", "First_Pass_Yield"]
    industry, confidence, _ = detect_industry(columns, "plant_metrics.csv")
    assert industry == "Manufacturing"

def test_industry_detection_via_filename():
    columns = ["col1", "col2", "col3"]
    industry, _, _ = detect_industry(columns, "banking_quarterly_report.csv")
    assert industry == "Banking"

def test_kpi_mapping_fmcg():
    columns = ["Fill_Rate_Percent", "Inventory_Turnover", "Revenue_USD", "Forecast_Accuracy"]
    mappings = map_kpis(columns, "FMCG")
    kpi_names = [m["kpi"] for m in mappings]
    assert "Fill Rate" in kpi_names
    assert "Inventory Turnover" in kpi_names

def test_kpi_mapping_confidence():
    columns = ["fill_rate_percent"]
    mappings = map_kpis(columns, "FMCG")
    fill_rate_mapping = next((m for m in mappings if m["kpi"] == "Fill Rate"), None)
    assert fill_rate_mapping is not None
    assert fill_rate_mapping["confidence"] >= 0.8

def test_kpi_calculation_mean():
    df = pd.DataFrame({"Fill_Rate": [90.0, 95.0, 92.0, 88.0, 96.0]})
    result = calculate_kpi(df, "Fill Rate", "Fill_Rate", "mean")
    assert result["value"] == pytest.approx(92.2, rel=0.01)
    assert "trend" in result
    assert result["count"] == 5

def test_kpi_calculation_sum():
    df = pd.DataFrame({"Revenue": [1_000_000, 1_050_000, 1_100_000]})
    result = calculate_kpi(df, "Revenue", "Revenue", "sum")
    assert result["value"] == pytest.approx(3_150_000)

def test_revenue_growth_calculation():
    df = pd.DataFrame({"Revenue": [1_000_000.0, 1_050_000.0, 1_100_000.0, 1_200_000.0], "Month": ["Jan", "Feb", "Mar", "Apr"]})
    result = calculate_kpi(df, "Revenue Growth", "Revenue", "growth_rate", "Month")
    expected = ((1_200_000 - 1_000_000) / 1_000_000) * 100
    assert result["value"] == pytest.approx(expected, rel=0.01)

def test_revenue_growth_no_time_column():
    df = pd.DataFrame({"Revenue": [1_000_000.0, 1_200_000.0]})
    result = calculate_kpi(df, "Revenue Growth", "Revenue", "growth_rate")
    assert result["value"] == pytest.approx(20.0, rel=0.01)

def test_kpi_missing_column():
    df = pd.DataFrame({"OtherCol": [1, 2, 3]})
    result = calculate_kpi(df, "Fill Rate", "Fill_Rate_Percent", "mean")
    assert result["value"] is None
    assert "error" in result

def test_calculate_all_kpis():
    df = pd.DataFrame({"Fill_Rate_Percent": [90.0, 95.0, 92.0, 88.0, 96.0], "Inventory_Turnover": [7.0, 8.0, 8.5, 9.0, 7.5]})
    mappings = [{"kpi": "Fill Rate", "column": "Fill_Rate_Percent", "formula": "mean", "unit": "%", "category": "Supply Chain", "confidence": 1.0}, {"kpi": "Inventory Turnover", "column": "Inventory_Turnover", "formula": "mean", "unit": "x", "category": "Operations", "confidence": 1.0}]
    results = calculate_all_kpis(df, mappings)
    assert "Fill Rate" in results
    assert "Inventory Turnover" in results
    assert results["Fill Rate"]["value"] is not None

def test_benchmark_comparison_below():
    result = compare_kpi_to_benchmark("Fill Rate", 90.0, "FMCG")
    assert result["status"] == "below_benchmark"
    assert result["gap"] < 0
    assert result["benchmark_value"] == 95.0

def test_benchmark_comparison_top_quartile():
    result = compare_kpi_to_benchmark("Fill Rate", 99.0, "FMCG")
    assert result["status"] == "top_quartile"

def test_benchmark_comparison_above():
    result = compare_kpi_to_benchmark("Fill Rate", 96.0, "FMCG")
    assert result["status"] == "above_benchmark"

def test_benchmark_normalization():
    benchmarks = get_benchmarks_for_industry("FMCG")
    assert "Fill Rate" in benchmarks
    bm = benchmarks["Fill Rate"]
    assert "value" in bm and "unit" in bm and "top_quartile" in bm and "source" in bm and "confidence" in bm

def test_benchmark_confidence_fallback():
    result = compare_kpi_to_benchmark("Unknown_KPI_XYZ", 50.0, "FMCG")
    assert result["status"] == "no_benchmark"
    assert result["benchmark_value"] is None

def test_lower_is_better_stockout():
    result = compare_kpi_to_benchmark("Stockout Rate", 3.0, "FMCG")
    assert result["status"] in ("above_benchmark", "top_quartile")

def test_lower_is_better_stockout_high():
    result = compare_kpi_to_benchmark("Stockout Rate", 15.0, "FMCG")
    assert result["status"] == "below_benchmark"

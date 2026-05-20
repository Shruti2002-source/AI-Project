import pytest


FMCG_BENCHMARKS = {
    "Fill Rate": {"value": 95.0, "unit": "%", "top_quartile": 98.5, "source": "NielsenIQ", "confidence": "High"},
    "Revenue Growth": {"value": 8.5, "unit": "%", "top_quartile": 14.0, "source": "McKinsey CPG", "confidence": "High"},
    "Inventory Turnover": {"value": 8.0, "unit": "x", "top_quartile": 12.0, "source": "Gartner Supply Chain", "confidence": "Medium"},
    "Forecast Accuracy": {"value": 85.0, "unit": "%", "top_quartile": 92.0, "source": "APQC", "confidence": "Medium"},
    "Stockout Rate": {"value": 5.0, "unit": "%", "top_quartile": 2.0, "source": "MIT SCM", "confidence": "Medium"},
    "Customer Satisfaction": {"value": 4.2, "unit": "score", "top_quartile": 4.6, "source": "NPS Benchmarks", "confidence": "Medium"},
    "Warehouse Utilization": {"value": 80.0, "unit": "%", "top_quartile": 85.0, "source": "CSCMP", "confidence": "Medium"},
}


def compare_to_benchmark(kpi_name: str, client_value: float, benchmarks: dict) -> dict:
    if kpi_name not in benchmarks:
        return {"status": "no_benchmark", "gap": None, "gap_percent": None}

    benchmark = benchmarks[kpi_name]
    industry_avg = benchmark["value"]
    top_q = benchmark["top_quartile"]
    gap = client_value - industry_avg
    gap_percent = ((client_value - industry_avg) / industry_avg) * 100 if industry_avg != 0 else 0

    lower_is_better = kpi_name in ["Stockout Rate", "Supplier Lead Time", "Inventory Days"]
    if lower_is_better:
        gap = -gap
        gap_percent = -gap_percent

    if lower_is_better:
        status = "above" if client_value <= industry_avg else "below"
    else:
        status = "above" if client_value >= industry_avg else "below"

    return {
        "status": status,
        "gap": gap,
        "gap_percent": gap_percent,
        "industry_average": industry_avg,
        "top_quartile": top_q,
        "source": benchmark["source"],
    }


def test_benchmark_below():
    result = compare_to_benchmark("Fill Rate", 90.0, FMCG_BENCHMARKS)
    assert result["status"] == "below"
    assert result["gap"] == pytest.approx(-5.0)
    assert result["industry_average"] == 95.0


def test_benchmark_above():
    result = compare_to_benchmark("Fill Rate", 97.0, FMCG_BENCHMARKS)
    assert result["status"] == "above"
    assert result["gap"] == pytest.approx(2.0)


def test_benchmark_at_exact():
    result = compare_to_benchmark("Fill Rate", 95.0, FMCG_BENCHMARKS)
    assert result["status"] == "above"
    assert result["gap"] == pytest.approx(0.0)


def test_benchmark_gap_percent():
    result = compare_to_benchmark("Revenue Growth", 6.0, FMCG_BENCHMARKS)
    expected_gap_pct = ((6.0 - 8.5) / 8.5) * 100
    assert result["gap_percent"] == pytest.approx(expected_gap_pct, rel=0.01)


def test_benchmark_lower_is_better():
    result = compare_to_benchmark("Stockout Rate", 3.0, FMCG_BENCHMARKS)
    assert result["status"] == "above"


def test_benchmark_lower_is_better_bad():
    result = compare_to_benchmark("Stockout Rate", 8.0, FMCG_BENCHMARKS)
    assert result["status"] == "below"


def test_benchmark_no_match():
    result = compare_to_benchmark("Unknown KPI", 50.0, FMCG_BENCHMARKS)
    assert result["status"] == "no_benchmark"
    assert result["gap"] is None


def test_benchmark_normalization():
    for kpi_name, benchmark in FMCG_BENCHMARKS.items():
        assert "value" in benchmark
        assert "unit" in benchmark
        assert "top_quartile" in benchmark
        assert "source" in benchmark
        assert "confidence" in benchmark
        assert isinstance(benchmark["value"], (int, float))
        assert isinstance(benchmark["top_quartile"], (int, float))


def test_benchmark_source_attribution():
    result = compare_to_benchmark("Fill Rate", 90.0, FMCG_BENCHMARKS)
    assert result["source"] == "NielsenIQ"


def test_benchmark_fallback_no_data():
    result = compare_to_benchmark("Nonexistent Metric", 100.0, FMCG_BENCHMARKS)
    assert result["status"] == "no_benchmark"

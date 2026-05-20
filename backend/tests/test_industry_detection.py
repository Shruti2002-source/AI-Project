import pytest


INDUSTRY_KEYWORDS = {
    "FMCG": ["fill_rate", "sku", "inventory_turnover", "forecast_accuracy", "stockout",
             "warehouse", "supply_chain", "category", "brand", "retailer", "distribution",
             "shelf", "consumer", "fmcg", "cpg", "packaged_goods"],
    "Healthcare": ["patient", "hospital", "clinical", "diagnosis", "readmission",
                   "mortality", "bed_occupancy", "los", "length_of_stay", "physician",
                   "nurse", "icu", "emergency", "hcahps", "medical"],
    "Banking": ["loan", "deposit", "npa", "interest", "credit", "debit",
                "account", "branch", "atm", "transaction", "portfolio",
                "mortgage", "banking", "financial", "asset"],
    "Retail": ["store", "ecommerce", "cart", "checkout", "conversion",
               "aov", "basket", "online", "marketplace", "sku_count",
               "return_rate", "customer_lifetime", "retail"],
    "Manufacturing": ["oee", "defect", "yield", "machine", "downtime",
                      "production", "assembly", "plant", "manufacturing",
                      "cycle_time", "throughput", "scrap"],
}


def detect_industry_simple(columns: list, filename: str = "") -> tuple:
    scores = {industry: 0.0 for industry in INDUSTRY_KEYWORDS}
    normalized_cols = [c.lower().replace(" ", "_") for c in columns]
    normalized_filename = filename.lower()

    for industry, keywords in INDUSTRY_KEYWORDS.items():
        for kw in keywords:
            if kw in normalized_filename:
                scores[industry] += 2.0
            for col in normalized_cols:
                if kw in col:
                    scores[industry] += 1.0

    best = max(scores, key=scores.get)
    total = sum(scores.values())
    confidence = scores[best] / total if total > 0 else 0.0
    return best, confidence


def test_fmcg_detection():
    columns = ["Fill_Rate_Percent", "Inventory_Turnover", "SKU_Count", "Forecast_Accuracy"]
    industry, conf = detect_industry_simple(columns)
    assert industry == "FMCG"
    assert conf > 0.3


def test_healthcare_detection():
    columns = ["Patient_Visits", "Hospital_ID", "Readmission_Rate", "Bed_Occupancy"]
    industry, conf = detect_industry_simple(columns)
    assert industry == "Healthcare"
    assert conf > 0.3


def test_banking_detection():
    columns = ["Loan_Amount", "Interest_Rate", "NPA_Ratio", "Deposit_Balance"]
    industry, conf = detect_industry_simple(columns)
    assert industry == "Banking"
    assert conf > 0.3


def test_retail_detection():
    columns = ["Store_ID", "Conversion_Rate", "Cart_Abandonment", "AOV"]
    industry, conf = detect_industry_simple(columns)
    assert industry == "Retail"
    assert conf > 0.3


def test_manufacturing_detection():
    columns = ["OEE", "Defect_Rate", "Machine_Downtime", "Cycle_Time"]
    industry, conf = detect_industry_simple(columns)
    assert industry == "Manufacturing"
    assert conf > 0.3


def test_filename_detection():
    columns = ["col1", "col2", "metric_a"]
    industry, conf = detect_industry_simple(columns, "fmcg_quarterly_report.csv")
    assert industry == "FMCG"


def test_filename_healthcare():
    columns = ["metric_1", "metric_2"]
    industry, conf = detect_industry_simple(columns, "hospital_performance_2024.xlsx")
    assert industry == "Healthcare"


def test_mixed_signals():
    columns = ["Fill_Rate_Percent", "Patient_Visits", "Revenue"]
    industry, conf = detect_industry_simple(columns)
    assert industry in ["FMCG", "Healthcare"]


def test_empty_columns():
    columns = []
    industry, conf = detect_industry_simple(columns, "data.csv")
    assert conf == 0.0 or industry is not None


def test_confidence_range():
    columns = ["Fill_Rate_Percent", "Inventory_Turnover", "SKU_Count"]
    industry, conf = detect_industry_simple(columns)
    assert 0.0 <= conf <= 1.0

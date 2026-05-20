from typing import List
from models.schemas import Industry


INDUSTRY_KEYWORDS = {
    Industry.FMCG: {
        "filename": ["fmcg", "consumer", "cpg", "goods", "brand", "sku", "product_mix"],
        "columns": [
            "fill_rate", "sku", "brand", "distributor", "shelf", "category",
            "market_share", "volume", "units_sold", "distribution", "retailer",
            "trade_spend", "promotion", "stock", "inventory_days", "sales_velocity",
            "fill rate", "order fill", "case fill", "on_time_delivery",
        ],
    },
    Industry.HEALTHCARE: {
        "filename": ["health", "hospital", "pharma", "clinical", "patient", "medical"],
        "columns": [
            "patient", "readmission", "los", "length_of_stay", "mortality",
            "bed_occupancy", "diagnosis", "treatment", "outcome", "clinical",
            "hospital", "physician", "procedure", "icd", "drg", "claim",
            "infection_rate", "wait_time", "satisfaction_score",
        ],
    },
    Industry.BANKING: {
        "filename": ["bank", "finance", "loan", "credit", "deposit", "fintech"],
        "columns": [
            "npa", "non_performing", "loan", "deposit", "interest", "credit",
            "debit", "account", "transaction", "balance", "nim", "casa",
            "net_interest_margin", "capital_adequacy", "tier1", "roa", "roe",
            "cost_to_income", "provision", "write_off",
        ],
    },
    Industry.RETAIL: {
        "filename": ["retail", "store", "ecommerce", "shop", "pos", "mall"],
        "columns": [
            "store", "footfall", "basket", "conversion", "same_store",
            "revenue_per_sqft", "shrinkage", "aov", "average_order",
            "customer_lifetime", "retention", "churn", "loyalty",
            "inventory_turnover", "gross_margin", "comp_sales",
        ],
    },
    Industry.MANUFACTURING: {
        "filename": ["manufacturing", "factory", "plant", "production", "oee", "assembly"],
        "columns": [
            "oee", "yield", "defect", "downtime", "throughput", "cycle_time",
            "scrap", "rework", "capacity", "utilization", "maintenance",
            "mtbf", "mttr", "quality_rate", "availability", "performance_rate",
            "work_order", "production_volume", "line_efficiency",
        ],
    },
}


def detect_industry(filename: str, column_names: List[str]) -> Industry:
    filename_lower = filename.lower()
    columns_lower = [col.lower().replace(" ", "_") for col in column_names]

    scores = {}

    for industry, keywords in INDUSTRY_KEYWORDS.items():
        score = 0

        for kw in keywords["filename"]:
            if kw in filename_lower:
                score += 3

        for col in columns_lower:
            for kw in keywords["columns"]:
                if kw in col or col in kw:
                    score += 1

        scores[industry] = score

    if not scores:
        return Industry.UNKNOWN

    best_industry = max(scores, key=scores.get)
    if scores[best_industry] == 0:
        return Industry.UNKNOWN

    return best_industry

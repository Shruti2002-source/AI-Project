import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pandas as pd
import numpy as np
import pytest

from app.analytics.formulas import (
    FMCG_FORMULAS, HEALTHCARE_FORMULAS, BANKING_FORMULAS,
    RETAIL_FORMULAS, MANUFACTURING_FORMULAS, INDUSTRY_FORMULAS,
    get_formulas, compute_status,
)
from app.analytics.validators import safe_divide, clean_numeric


# ── Validators ────────────────────────────────────────────────────────────────

def test_safe_divide_normal():
    assert abs(safe_divide(10.0, 4.0) - 2.5) < 1e-9

def test_safe_divide_zero():
    assert safe_divide(10.0, 0.0) == 0.0
    assert safe_divide(10.0, 0.0, default=-1.0) == -1.0

def test_safe_divide_nan():
    assert safe_divide(float('nan'), 1.0) == 0.0

def test_clean_numeric_drops_nan():
    s = pd.Series([1.0, float('nan'), 3.0, float('nan'), 5.0])
    result = clean_numeric(s)
    assert len(result) == 3

def test_clean_numeric_clips_outliers():
    s = pd.Series([10.0, 11.0, 12.0, 10.5, 1000.0])
    result = clean_numeric(s)
    assert 1000.0 not in result.values


# ── FMCG ──────────────────────────────────────────────────────────────────────

def test_revenue_growth():
    df = pd.DataFrame({'revenue': [886000, 900000, 920000]})
    col_map = {'revenue': 'revenue'}
    result = FMCG_FORMULAS['revenue_growth'].calculate(df, col_map)
    expected = (920000 - 886000) / 886000 * 100
    assert abs(result - expected) < 0.01

def test_revenue_growth_single_row_returns_zero():
    df = pd.DataFrame({'revenue': [886000]})
    result = FMCG_FORMULAS['revenue_growth'].calculate(df, {'revenue': 'revenue'})
    assert result == 0.0

def test_inventory_turnover():
    df = pd.DataFrame({'cogs': [100, 100, 100], 'inventory_value': [50, 40, 60]})
    col_map = {'cogs': 'cogs', 'inventory_value': 'inventory_value'}
    result = FMCG_FORMULAS['inventory_turnover'].calculate(df, col_map)
    expected = 300 / 50.0
    assert abs(result - expected) < 0.01

def test_fill_rate():
    df = pd.DataFrame({'orders_filled': [95, 93, 96], 'total_orders': [100, 100, 100]})
    col_map = {'orders_filled': 'orders_filled', 'total_orders': 'total_orders'}
    result = FMCG_FORMULAS['fill_rate'].calculate(df, col_map)
    assert abs(result - 94.67) < 0.1

def test_stockout_rate():
    df = pd.DataFrame({'stockouts': [5, 4, 6], 'total_orders': [100, 100, 100]})
    col_map = {'stockouts': 'stockouts', 'total_orders': 'total_orders'}
    result = FMCG_FORMULAS['stockout_rate'].calculate(df, col_map)
    assert abs(result - 5.0) < 0.1

def test_forecast_accuracy():
    df = pd.DataFrame({
        'demand_forecast': [100, 105, 98],
        'actual_demand':   [100, 100, 100],
    })
    col_map = {'demand_forecast': 'demand_forecast', 'actual_demand': 'actual_demand'}
    result = FMCG_FORMULAS['forecast_accuracy'].calculate(df, col_map)
    # MAPE = mean(|0, 5, 2| / 100) = 0.0233...  → accuracy = 97.67%
    assert abs(result - 97.67) < 0.5

def test_market_share():
    df = pd.DataFrame({'client_sales': [14, 14, 15], 'market_sales': [100, 100, 100]})
    col_map = {'client_sales': 'client_sales', 'market_sales': 'market_sales'}
    result = FMCG_FORMULAS['market_share'].calculate(df, col_map)
    assert abs(result - 14.33) < 0.1


# ── Healthcare ────────────────────────────────────────────────────────────────

def test_readmission_rate():
    df = pd.DataFrame({'readmissions': [15, 14, 16], 'discharges': [100, 100, 100]})
    col_map = {'readmissions': 'readmissions', 'discharges': 'discharges'}
    result = HEALTHCARE_FORMULAS['readmission_rate'].calculate(df, col_map)
    assert abs(result - 15.0) < 0.1

def test_bed_occupancy():
    df = pd.DataFrame({'occupied_beds': [75, 80, 70], 'total_beds': [100, 100, 100]})
    col_map = {'occupied_beds': 'occupied_beds', 'total_beds': 'total_beds'}
    result = HEALTHCARE_FORMULAS['bed_occupancy'].calculate(df, col_map)
    assert abs(result - 75.0) < 0.1

def test_operating_margin():
    df = pd.DataFrame({'revenue': [1000, 1000], 'operating_cost': [870, 880]})
    col_map = {'revenue': 'revenue', 'operating_cost': 'operating_cost'}
    result = HEALTHCARE_FORMULAS['operating_margin'].calculate(df, col_map)
    assert abs(result - 12.5) < 0.1


# ── Banking ───────────────────────────────────────────────────────────────────

def test_cost_income_ratio():
    df = pd.DataFrame({'operating_cost': [580, 590], 'operating_income': [1000, 1000]})
    col_map = {'operating_cost': 'operating_cost', 'operating_income': 'operating_income'}
    result = BANKING_FORMULAS['cost_income_ratio'].calculate(df, col_map)
    assert abs(result - 58.5) < 0.1

def test_npa_ratio():
    df = pd.DataFrame({'npa_value': [28, 30], 'total_loans': [1000, 1000]})
    col_map = {'npa_value': 'npa_value', 'total_loans': 'total_loans'}
    result = BANKING_FORMULAS['npa_ratio'].calculate(df, col_map)
    assert abs(result - 2.9) < 0.1


# ── Retail ────────────────────────────────────────────────────────────────────

def test_cart_abandonment():
    df = pd.DataFrame({'carts': [100, 100], 'purchases': [32, 30]})
    col_map = {'carts': 'carts', 'purchases': 'purchases'}
    result = RETAIL_FORMULAS['cart_abandonment'].calculate(df, col_map)
    assert abs(result - 69.0) < 0.1

def test_roas():
    df = pd.DataFrame({'revenue': [1000, 1200], 'ad_spend': [250, 250]})
    col_map = {'revenue': 'revenue', 'ad_spend': 'ad_spend'}
    result = RETAIL_FORMULAS['roas'].calculate(df, col_map)
    assert abs(result - 4.4) < 0.01


# ── Manufacturing ─────────────────────────────────────────────────────────────

def test_defect_rate():
    df = pd.DataFrame({'defects': [24, 22, 26], 'total_output': [1000, 1000, 1000]})
    col_map = {'defects': 'defects', 'total_output': 'total_output'}
    result = MANUFACTURING_FORMULAS['defect_rate'].calculate(df, col_map)
    assert abs(result - 2.4) < 0.1

def test_downtime():
    df = pd.DataFrame({'downtime_minutes': [30, 40], 'planned_minutes': [480, 480]})
    col_map = {'downtime_minutes': 'downtime_minutes', 'planned_minutes': 'planned_minutes'}
    result = MANUFACTURING_FORMULAS['downtime'].calculate(df, col_map)
    assert abs(result - 7.29) < 0.1


# ── Status computation ────────────────────────────────────────────────────────

def test_status_good_higher_is_better():
    formula = FMCG_FORMULAS['fill_rate']  # good >= 95
    assert compute_status(formula, 96.0) == 'good'
    assert compute_status(formula, 92.0) == 'warning'
    assert compute_status(formula, 88.0) == 'critical'

def test_status_good_lower_is_better():
    formula = FMCG_FORMULAS['stockout_rate']  # good <= 2
    assert compute_status(formula, 1.5) == 'good'
    assert compute_status(formula, 4.0) == 'warning'
    assert compute_status(formula, 7.0) == 'critical'


# ── Smoke: all formulas run without crashing on minimal valid data ─────────────

@pytest.mark.parametrize("industry,formula_id", [
    (ind, fid)
    for ind, formulas in INDUSTRY_FORMULAS.items()
    for fid in formulas
])
def test_formula_smoke(industry, formula_id):
    formula = INDUSTRY_FORMULAS[industry][formula_id]
    cols = {c: c for c in formula.required_columns}
    data = {c: [1.0, 2.0, 3.0] for c in formula.required_columns}
    df = pd.DataFrame(data)
    result = formula.calculate(df, cols)
    assert isinstance(result, float)
    assert not np.isnan(result)
    assert not np.isinf(result)

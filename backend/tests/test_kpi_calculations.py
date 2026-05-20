import io
import pandas as pd
import numpy as np
import pytest


def calculate_revenue_growth(df: pd.DataFrame, col: str) -> float:
    values = df[col].dropna().tolist()
    if len(values) < 2:
        return 0.0
    return ((values[-1] - values[0]) / values[0]) * 100


def calculate_mean(df: pd.DataFrame, col: str) -> float:
    return df[col].dropna().mean()


def calculate_latest(df: pd.DataFrame, col: str):
    return df[col].dropna().iloc[-1]


def test_revenue_growth_positive():
    df = pd.DataFrame({"Revenue_USD": [1000000, 1050000, 1100000, 1200000]})
    growth = calculate_revenue_growth(df, "Revenue_USD")
    expected = ((1200000 - 1000000) / 1000000) * 100
    assert growth == pytest.approx(expected, rel=0.01)
    assert growth == pytest.approx(20.0, rel=0.01)


def test_revenue_growth_negative():
    df = pd.DataFrame({"Revenue_USD": [1200000, 1100000, 1000000, 900000]})
    growth = calculate_revenue_growth(df, "Revenue_USD")
    expected = ((900000 - 1200000) / 1200000) * 100
    assert growth == pytest.approx(-25.0, rel=0.01)


def test_revenue_growth_zero():
    df = pd.DataFrame({"Revenue_USD": [1000000, 1000000, 1000000]})
    growth = calculate_revenue_growth(df, "Revenue_USD")
    assert growth == pytest.approx(0.0)


def test_fill_rate_mean():
    df = pd.DataFrame({"Fill_Rate_Percent": [94.2, 95.1, 91.5, 96.0, 93.8]})
    result = calculate_mean(df, "Fill_Rate_Percent")
    expected = (94.2 + 95.1 + 91.5 + 96.0 + 93.8) / 5
    assert result == pytest.approx(expected, rel=0.01)


def test_inventory_turnover_mean():
    df = pd.DataFrame({"Inventory_Turnover": [8.1, 8.4, 7.2, 9.0, 8.5]})
    result = calculate_mean(df, "Inventory_Turnover")
    expected = (8.1 + 8.4 + 7.2 + 9.0 + 8.5) / 5
    assert result == pytest.approx(expected, rel=0.01)


def test_customer_satisfaction_mean():
    df = pd.DataFrame({"Customer_Satisfaction_Score": [4.1, 4.2, 3.9, 4.3, 4.0]})
    result = calculate_mean(df, "Customer_Satisfaction_Score")
    expected = (4.1 + 4.2 + 3.9 + 4.3 + 4.0) / 5
    assert result == pytest.approx(expected, rel=0.01)


def test_latest_value():
    df = pd.DataFrame({"Market_Share": [12.5, 13.0, 13.2, 14.1]})
    result = calculate_latest(df, "Market_Share")
    assert result == pytest.approx(14.1)


def test_kpi_with_missing_values():
    df = pd.DataFrame({"Fill_Rate_Percent": [94.2, None, 91.5, None, 93.8]})
    result = calculate_mean(df, "Fill_Rate_Percent")
    expected = (94.2 + 91.5 + 93.8) / 3
    assert result == pytest.approx(expected, rel=0.01)


def test_single_value_growth():
    df = pd.DataFrame({"Revenue_USD": [1000000]})
    growth = calculate_revenue_growth(df, "Revenue_USD")
    assert growth == 0.0


def test_stockout_rate_calculation():
    df = pd.DataFrame({"Stockout_Rate": [3.2, 2.8, 4.1, 3.5, 2.9]})
    result = calculate_mean(df, "Stockout_Rate")
    expected = (3.2 + 2.8 + 4.1 + 3.5 + 2.9) / 5
    assert result == pytest.approx(expected, rel=0.01)

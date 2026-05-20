import io
import pandas as pd
import pytest


def test_csv_basic_parsing():
    csv_data = """Month,Region,Revenue_USD,Fill_Rate_Percent,Inventory_Turnover
2024-01,North,1250000,94.2,8.1
2024-02,North,1320000,95.1,8.4
2024-03,South,980000,91.5,7.2"""
    df = pd.read_csv(io.StringIO(csv_data))
    assert len(df) == 3
    assert len(df.columns) == 5
    assert df["Revenue_USD"].iloc[0] == 1250000
    assert df["Fill_Rate_Percent"].dtype in ["float64", "int64"]


def test_csv_with_missing_values():
    csv_data = """KPI,Value,Region
Revenue,1000000,North
Fill Rate,,South
Turnover,8.5,"""
    df = pd.read_csv(io.StringIO(csv_data))
    assert len(df) == 3
    assert df["Value"].isnull().sum() == 1
    assert df["Region"].isnull().sum() == 1


def test_csv_column_detection():
    csv_data = """Fill_Rate_Percent,Inventory_Turnover,SKU_Count,Forecast_Accuracy
94.2,8.1,450,82.5
95.1,8.4,455,84.0"""
    df = pd.read_csv(io.StringIO(csv_data))
    columns = df.columns.tolist()
    assert "Fill_Rate_Percent" in columns
    assert "Inventory_Turnover" in columns
    assert "SKU_Count" in columns


def test_csv_numeric_types():
    csv_data = """Revenue,Percentage,Count
1250000.50,94.2,450
1320000.75,95.1,455"""
    df = pd.read_csv(io.StringIO(csv_data))
    assert df["Revenue"].dtype == "float64"
    assert df["Percentage"].dtype == "float64"
    assert df["Count"].dtype == "int64"


def test_excel_parsing():
    df = pd.DataFrame({
        "Revenue_USD": [1250000, 1320000, 980000],
        "Fill_Rate_Percent": [94.2, 95.1, 91.5],
        "Region": ["North", "South", "East"],
    })
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False, engine="openpyxl")
    buffer.seek(0)
    result = pd.read_excel(buffer, engine="openpyxl")
    assert len(result) == 3
    assert result["Revenue_USD"].iloc[0] == 1250000


def test_txt_tab_separated():
    txt_data = "Revenue\tFill_Rate\tRegion\n1250000\t94.2\tNorth\n1320000\t95.1\tSouth"
    df = pd.read_csv(io.StringIO(txt_data), sep="\t")
    assert len(df) == 2
    assert "Revenue" in df.columns

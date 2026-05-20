import io
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd

from models.schemas import (
    AnalysisResponse,
    DatasetSchema,
    DatasetColumn,
    Industry,
)
from services.industry_detection import detect_industry
from services.kpi_engine import map_and_calculate_kpis
from services.benchmark_engine import get_benchmark_comparisons
from services.insight_engine import generate_insights
from services.storyline_engine import generate_storyline

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_data(file: UploadFile = File(...)):
    allowed_extensions = {".csv", ".xlsx", ".xls", ".txt"}
    file_ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Allowed: {allowed_extensions}",
        )

    contents = await file.read()
    file_size = len(contents)

    try:
        if file_ext == ".csv" or file_ext == ".txt":
            df = pd.read_csv(io.BytesIO(contents))
        elif file_ext in (".xlsx", ".xls"):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Cannot parse file")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")

    columns = []
    for col in df.columns:
        sample = df[col].dropna().head(5).tolist()
        columns.append(
            DatasetColumn(
                name=str(col),
                dtype=str(df[col].dtype),
                sample_values=sample,
                null_count=int(df[col].isnull().sum()),
                unique_count=int(df[col].nunique()),
            )
        )

    schema_info = DatasetSchema(
        columns=columns,
        row_count=len(df),
        file_name=file.filename,
        file_size=file_size,
    )

    industry = detect_industry(file.filename, [c.name for c in columns])

    kpi_values = map_and_calculate_kpis(df, industry)

    benchmark_comparisons = get_benchmark_comparisons(kpi_values, industry)

    insights = generate_insights(kpi_values, benchmark_comparisons, industry)

    storyline = generate_storyline(kpi_values, benchmark_comparisons, insights, industry)

    return AnalysisResponse(
        industry=industry,
        dataset_schema=schema_info,
        kpi_values=kpi_values,
        benchmark_comparisons=benchmark_comparisons,
        insights=insights,
        storyline=storyline,
    )

import io
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd

from models.schemas import UploadResponse, DatasetSchema, DatasetColumn, Industry
from services.industry_detection import detect_industry

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
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

    detected_industry = detect_industry(file.filename, [c.name for c in columns])

    return UploadResponse(
        success=True,
        message=f"Successfully parsed {file.filename} with {len(df)} rows and {len(df.columns)} columns",
        schema_info=schema_info,
        detected_industry=detected_industry,
    )

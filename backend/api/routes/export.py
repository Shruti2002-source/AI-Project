import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional

from models.schemas import KPIValue, BenchmarkComparison, AIInsight, ExecutiveStoryline, Industry
from services.export_engine import export_to_pptx, export_to_pdf, export_to_xlsx

router = APIRouter()


class ExportRequest(BaseModel):
    industry: Industry
    kpi_values: List[KPIValue]
    benchmark_comparisons: List[BenchmarkComparison]
    insights: List[AIInsight]
    storyline: ExecutiveStoryline
    title: Optional[str] = "InsightSynth AI Analysis Report"


@router.post("/export/{format}")
async def export_report(format: str, request: ExportRequest):
    supported_formats = {"pptx", "pdf", "xlsx"}

    if format not in supported_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format: {format}. Supported: {supported_formats}",
        )

    try:
        if format == "pptx":
            buffer = export_to_pptx(request)
            media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            filename = "insightsynth_report.pptx"
        elif format == "pdf":
            buffer = export_to_pdf(request)
            media_type = "application/pdf"
            filename = "insightsynth_report.pdf"
        elif format == "xlsx":
            buffer = export_to_xlsx(request)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = "insightsynth_report.xlsx"
        else:
            raise HTTPException(status_code=400, detail="Invalid format")

        return StreamingResponse(
            io.BytesIO(buffer),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

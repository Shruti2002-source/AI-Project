from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

from models.schemas import BenchmarkEntry, Industry
from services.benchmark_engine import BENCHMARK_LIBRARY

router = APIRouter()


class FetchBenchmarkRequest(BaseModel):
    url: str
    industry: Optional[Industry] = None


@router.get("/benchmarks/{industry}", response_model=List[BenchmarkEntry])
async def get_benchmarks(industry: str):
    industry_upper = industry.upper()
    industry_map = {
        "FMCG": Industry.FMCG,
        "HEALTHCARE": Industry.HEALTHCARE,
        "BANKING": Industry.BANKING,
        "RETAIL": Industry.RETAIL,
        "MANUFACTURING": Industry.MANUFACTURING,
    }

    matched_industry = industry_map.get(industry_upper)
    if not matched_industry:
        raise HTTPException(
            status_code=404,
            detail=f"Industry '{industry}' not found. Available: {list(industry_map.keys())}",
        )

    benchmarks = BENCHMARK_LIBRARY.get(matched_industry, [])
    return benchmarks


@router.post("/benchmarks/fetch", response_model=List[BenchmarkEntry])
async def fetch_benchmarks(request: FetchBenchmarkRequest):
    # In production, this would fetch from external URLs
    # For now, return benchmarks for the specified industry
    if request.industry:
        benchmarks = BENCHMARK_LIBRARY.get(request.industry, [])
        return benchmarks

    raise HTTPException(
        status_code=400,
        detail="Industry must be specified when fetching benchmarks",
    )

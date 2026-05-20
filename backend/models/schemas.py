from enum import Enum
from typing import List, Optional, Any
from pydantic import BaseModel


class Industry(str, Enum):
    FMCG = "FMCG"
    HEALTHCARE = "Healthcare"
    BANKING = "Banking"
    RETAIL = "Retail"
    MANUFACTURING = "Manufacturing"
    UNKNOWN = "Unknown"


class DatasetColumn(BaseModel):
    name: str
    dtype: str
    sample_values: List[Any]
    null_count: int
    unique_count: int


class DatasetSchema(BaseModel):
    columns: List[DatasetColumn]
    row_count: int
    file_name: str
    file_size: int


class KPIMapping(BaseModel):
    kpi_name: str
    source_columns: List[str]
    calculation_method: str
    industry: Industry


class KPIValue(BaseModel):
    kpi_name: str
    value: float
    unit: str
    trend: Optional[str] = None
    period: Optional[str] = None


class BenchmarkEntry(BaseModel):
    kpi_name: str
    industry: Industry
    value: float
    unit: str
    top_quartile: float
    source: str
    source_url: str
    methodology: str
    confidence: float


class BenchmarkComparison(BaseModel):
    kpi_name: str
    actual_value: float
    benchmark_value: float
    top_quartile: float
    gap: float
    gap_percentage: float
    unit: str
    performance_level: str
    source: str


class AIInsight(BaseModel):
    category: str
    title: str
    description: str
    severity: str
    confidence: float
    recommended_action: str
    impact_area: str


class ExecutiveStoryline(BaseModel):
    executive_summary: str
    current_performance: str
    key_insight: str
    root_cause: str
    business_impact: str
    recommendation: str
    next_steps: List[str]


class AnalysisResponse(BaseModel):
    industry: Industry
    dataset_schema: DatasetSchema
    kpi_values: List[KPIValue]
    benchmark_comparisons: List[BenchmarkComparison]
    insights: List[AIInsight]
    storyline: ExecutiveStoryline


class UploadResponse(BaseModel):
    success: bool
    message: str
    schema_info: DatasetSchema
    detected_industry: Industry

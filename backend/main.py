from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import upload, analysis, benchmarks, export

app = FastAPI(
    title="InsightSynth AI",
    description="Enterprise Consulting Intelligence Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(benchmarks.router, prefix="/api", tags=["benchmarks"])
app.include_router(export.router, prefix="/api", tags=["export"])


@app.on_event("startup")
async def startup_event():
    print("InsightSynth AI backend starting up...")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "insightsynth-ai"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

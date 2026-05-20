# InsightSynth AI

Enterprise-grade AI-powered consulting intelligence platform. Upload business datasets and automatically detect industry, identify KPIs, calculate metrics, benchmark against industry standards, and generate executive consulting storylines.

## Architecture

```
insightsynth-ai/
+-- frontend/          # Next.js 14 + TypeScript + Tailwind + Recharts
+-- backend/           # FastAPI + Python + Pandas + OpenAI
```

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)
- Zustand (state management)
- PapaParse (CSV parsing)
- XLSX (Excel parsing)
- PptxGenJS, jsPDF (exports)

### Backend
- FastAPI + Uvicorn
- Pandas + NumPy (data processing)
- OpenAI + LangChain (AI insights)
- Pydantic (validation)
- PostgreSQL (optional persistence)
- python-pptx, ReportLab, XlsxWriter (exports)

## Supported Industries
- FMCG
- Healthcare
- Banking & Financial Services
- Retail & E-commerce
- Manufacturing

## Features
- Drag & drop file upload (CSV, XLSX, XLS, TXT)
- Automatic industry detection
- Dynamic KPI identification and calculation
- Industry benchmark comparison with source attribution
- AI-generated insights (risk, opportunity, recommendation)
- Executive consulting storyline generation
- Export to PowerPoint, PDF, Excel
- Responsive enterprise UI (desktop + mobile)

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (optional)
- OpenAI API key (for AI-enhanced insights)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your OpenAI API key

uvicorn main:app --reload --port 8000
```

Backend runs on http://localhost:8000

### Environment Variables

Create `backend/.env`:
```
OPENAI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/insightsynth
```

## Usage Flow

1. Open http://localhost:3000
2. Click "Start Analysis" or navigate to Dashboard
3. Upload a CSV/Excel file with business data
4. Platform automatically:
   - Detects your industry
   - Maps columns to KPIs
   - Calculates KPI values from data
   - Compares against industry benchmarks
   - Generates AI insights
   - Creates executive storyline
5. Explore Dashboard, Benchmarks, Insights, Storyline tabs
6. Export reports in PPTX, PDF, or XLSX format

## Sample Data Format (FMCG)

```csv
Month,Region,Revenue_USD,Fill_Rate_Percent,Inventory_Turnover,Forecast_Accuracy,Customer_Satisfaction_Score,Stockout_Rate,SKU_Count
2024-01,North,1250000,94.2,8.1,82.5,4.1,3.2,450
2024-02,North,1320000,95.1,8.4,84.0,4.2,2.8,455
...
```

## KPI Calculation Examples

- Revenue Growth: `((latest_month - earliest_month) / earliest_month) * 100`
- Fill Rate: `mean(Fill_Rate_Percent)`
- Inventory Turnover: `mean(Inventory_Turnover)`
- Customer Satisfaction: `mean(Customer_Satisfaction_Score)`

All KPIs are calculated dynamically from uploaded data. No hardcoded values.

## Benchmark Sources

| Industry | Sources |
|----------|---------|
| FMCG | NielsenIQ, Kantar, Euromonitor, Gartner |
| Healthcare | WHO, CMS, OECD Health, CDC |
| Banking | FDIC, IMF, World Bank, Basel |
| Retail | Adobe DEI, NRF, Shopify, US Census |
| Manufacturing | OECD, APQC, Deloitte |

## Tests

```bash
cd backend
pytest tests/ -v
```

## License

Proprietary - Enterprise Use Only

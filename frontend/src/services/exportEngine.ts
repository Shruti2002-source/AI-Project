import {
  Industry,
  KPIValue,
  BenchmarkComparison,
  AIInsight,
  ExecutiveStoryline
} from '@/types';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Export configuration and styling constants.
 */
const COLORS = {
  primary: '1a365d',
  secondary: '2b6cb0',
  accent: '3182ce',
  success: '38a169',
  warning: 'd69e2e',
  danger: 'e53e3e',
  dark: '1a202c',
  light: 'f7fafc',
  white: 'ffffff',
  gray: '718096',
  lightGray: 'e2e8f0'
};

const FONTS = {
  title: 'Arial',
  body: 'Arial',
  mono: 'Courier New'
};

/**
 * Export data structure for all engines.
 */
export interface ExportData {
  industry: Industry;
  kpiValues: KPIValue[];
  benchmarks: BenchmarkComparison[];
  insights: AIInsight[];
  storyline: ExecutiveStoryline;
  metadata: {
    fileName: string;
    generatedAt: string;
    totalRows: number;
  };
}

// ============================================================================
// POWERPOINT EXPORT (pptxgenjs)
// ============================================================================

/**
 * Creates a consulting-style PowerPoint presentation with KPI data, benchmarks,
 * insights, and executive storyline.
 */
export async function exportToPowerPoint(data: ExportData): Promise<Blob> {
  const pptx = new PptxGenJS();

  // Presentation settings
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'InsightSynth AI';
  pptx.subject = `${data.industry} Performance Analysis`;

  // Slide 1: Title
  createTitleSlide(pptx, data);

  // Slide 2: Executive Summary
  createExecutiveSummarySlide(pptx, data);

  // Slide 3: KPI Overview
  createKPIOverviewSlide(pptx, data);

  // Slide 4: Benchmark Comparison
  createBenchmarkSlide(pptx, data);

  // Slide 5: Key Insights
  createInsightsSlide(pptx, data);

  // Slide 6: Root Cause Analysis
  createRootCauseSlide(pptx, data);

  // Slide 7: Recommendations
  createRecommendationSlide(pptx, data);

  // Slide 8: Next Steps
  createNextStepsSlide(pptx, data);

  // Generate the file
  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  return blob;
}

function createTitleSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.primary };

  slide.addText('InsightSynth AI', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.5,
    fontSize: 14,
    color: COLORS.accent,
    fontFace: FONTS.title
  });

  slide.addText(`${data.industry} Performance Analysis`, {
    x: 0.5,
    y: 2.0,
    w: 9,
    h: 1.2,
    fontSize: 36,
    color: COLORS.white,
    fontFace: FONTS.title,
    bold: true
  });

  slide.addText(`Generated: ${data.metadata.generatedAt}\nSource: ${data.metadata.fileName} (${data.metadata.totalRows.toLocaleString()} records)`, {
    x: 0.5,
    y: 4.0,
    w: 9,
    h: 0.8,
    fontSize: 12,
    color: COLORS.lightGray,
    fontFace: FONTS.body
  });
}

function createExecutiveSummarySlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Executive Summary', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  slide.addText(data.storyline.executiveSummary, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 2.0,
    fontSize: 13,
    color: COLORS.dark,
    fontFace: FONTS.body,
    valign: 'top'
  });

  // KPI summary cards
  const aboveBenchmark = data.benchmarks.filter(b => b.status === 'above').length;
  const belowBenchmark = data.benchmarks.filter(b => b.status === 'below').length;
  const highRisks = data.insights.filter(i => i.severity === 'high').length;

  const summaryBoxes = [
    { label: 'KPIs Analyzed', value: String(data.kpiValues.length), color: COLORS.primary },
    { label: 'Above Benchmark', value: String(aboveBenchmark), color: COLORS.success },
    { label: 'Below Benchmark', value: String(belowBenchmark), color: COLORS.warning },
    { label: 'High-Risk Items', value: String(highRisks), color: COLORS.danger }
  ];

  summaryBoxes.forEach((box, i) => {
    const x = 0.5 + i * 2.4;
    slide.addShape('rect' as unknown as PptxGenJS.ShapeType, {
      x,
      y: 3.8,
      w: 2.1,
      h: 1.4,
      fill: { color: COLORS.light },
      line: { color: box.color, width: 2 }
    });
    slide.addText(box.value, {
      x,
      y: 3.9,
      w: 2.1,
      h: 0.8,
      fontSize: 28,
      color: box.color,
      fontFace: FONTS.title,
      bold: true,
      align: 'center'
    });
    slide.addText(box.label, {
      x,
      y: 4.7,
      w: 2.1,
      h: 0.4,
      fontSize: 10,
      color: COLORS.gray,
      fontFace: FONTS.body,
      align: 'center'
    });
  });
}

function createKPIOverviewSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Key Performance Indicators', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  // Create KPI table
  const tableData: PptxGenJS.TableRow[] = [
    [
      { text: 'KPI', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Value', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Unit', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Category', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Trend', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } }
    ]
  ];

  for (const kpi of data.kpiValues.slice(0, 10)) {
    const trendSymbol = kpi.trend === 'up' ? '^ Up' : kpi.trend === 'down' ? 'v Down' : '- Stable';
    const trendColor = kpi.trend === 'up' ? COLORS.success : kpi.trend === 'down' ? COLORS.danger : COLORS.gray;

    tableData.push([
      { text: kpi.name },
      { text: kpi.value.toFixed(1) },
      { text: kpi.unit },
      { text: kpi.category },
      { text: trendSymbol, options: { color: trendColor } }
    ]);
  }

  slide.addTable(tableData, {
    x: 0.5,
    y: 1.0,
    w: 9.0,
    fontSize: 10,
    border: { type: 'solid', pt: 0.5, color: COLORS.lightGray },
    colW: [2.5, 1.5, 1.0, 2.0, 2.0]
  });
}

function createBenchmarkSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Benchmark Comparison', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  const tableData: PptxGenJS.TableRow[] = [
    [
      { text: 'KPI', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Client', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Benchmark', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Gap', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } },
      { text: 'Source', options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary } } }
    ]
  ];

  for (const benchmark of data.benchmarks.slice(0, 10)) {
    const gapColor = benchmark.status === 'above' ? COLORS.success : benchmark.status === 'below' ? COLORS.danger : COLORS.gray;
    const gapText = `${benchmark.gapPercent > 0 ? '+' : ''}${benchmark.gapPercent.toFixed(1)}%`;

    tableData.push([
      { text: benchmark.kpiName },
      { text: `${benchmark.clientValue.toFixed(1)} ${benchmark.unit}` },
      { text: `${benchmark.industryAverage.toFixed(1)} ${benchmark.unit}` },
      { text: gapText, options: { color: gapColor, bold: true } },
      { text: benchmark.source }
    ]);
  }

  slide.addTable(tableData, {
    x: 0.5,
    y: 1.0,
    w: 9.0,
    fontSize: 9,
    border: { type: 'solid', pt: 0.5, color: COLORS.lightGray },
    colW: [2.2, 1.5, 1.5, 1.3, 2.5]
  });
}

function createInsightsSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Key Insights', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  const topInsights = data.insights.slice(0, 5);
  let yPos = 1.1;

  for (const insight of topInsights) {
    const severityColor = insight.severity === 'high' ? COLORS.danger : insight.severity === 'medium' ? COLORS.warning : COLORS.success;
    const typeLabel = insight.type.charAt(0).toUpperCase() + insight.type.slice(1);

    slide.addText(`[${typeLabel.toUpperCase()}] ${insight.title}`, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.35,
      fontSize: 11,
      color: severityColor,
      fontFace: FONTS.title,
      bold: true
    });

    slide.addText(insight.description.substring(0, 200) + (insight.description.length > 200 ? '...' : ''), {
      x: 0.5,
      y: yPos + 0.35,
      w: 9,
      h: 0.55,
      fontSize: 9,
      color: COLORS.dark,
      fontFace: FONTS.body,
      valign: 'top'
    });

    yPos += 1.0;
  }
}

function createRootCauseSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Root Cause Analysis', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  slide.addText(data.storyline.rootCause.substring(0, 800), {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.0,
    fontSize: 11,
    color: COLORS.dark,
    fontFace: FONTS.body,
    valign: 'top'
  });
}

function createRecommendationSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Strategic Recommendations', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  slide.addText(data.storyline.recommendation.substring(0, 900), {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.2,
    fontSize: 11,
    color: COLORS.dark,
    fontFace: FONTS.body,
    valign: 'top'
  });
}

function createNextStepsSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide();

  slide.addText('Next Steps', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: FONTS.title,
    bold: true
  });

  const stepsText = data.storyline.nextSteps
    .map((step, i) => `${i + 1}. ${step}`)
    .join('\n\n');

  slide.addText(stepsText, {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.2,
    fontSize: 12,
    color: COLORS.dark,
    fontFace: FONTS.body,
    valign: 'top'
  });

  // Footer
  slide.addText('Generated by InsightSynth AI | Confidential', {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 0.3,
    fontSize: 8,
    color: COLORS.gray,
    fontFace: FONTS.body,
    align: 'center'
  });
}

// ============================================================================
// PDF EXPORT (jsPDF)
// ============================================================================

/**
 * Creates a consulting-style PDF report with KPI data, insights, and storyline.
 */
export async function exportToPDF(data: ExportData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Helper functions
  const addTitle = (text: string, size: number = 18) => {
    doc.setFontSize(size);
    doc.setFont(FONTS.title, 'bold');
    doc.setTextColor(26, 54, 93); // primary
    doc.text(text, margin, yPos);
    yPos += size * 0.5 + 4;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont(FONTS.title, 'bold');
    doc.setTextColor(43, 108, 176); // secondary
    doc.text(text, margin, yPos);
    yPos += 8;
  };

  const addBody = (text: string) => {
    doc.setFontSize(10);
    doc.setFont(FONTS.body, 'normal');
    doc.setTextColor(26, 32, 44); // dark
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 5 + 4;
  };

  const addPageBreak = () => {
    doc.addPage();
    yPos = margin;
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > 280) {
      addPageBreak();
    }
  };

  // Title Page
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setFontSize(10);
  doc.setFont(FONTS.title, 'normal');
  doc.setTextColor(49, 130, 206);
  doc.text('InsightSynth AI', margin, 20);

  doc.setFontSize(24);
  doc.setFont(FONTS.title, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.industry} Performance Analysis`, margin, 38);

  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(`Generated: ${data.metadata.generatedAt}`, margin, 50);
  doc.text(`Source: ${data.metadata.fileName} (${data.metadata.totalRows.toLocaleString()} records)`, margin, 56);

  yPos = 75;

  // Executive Summary
  addTitle('Executive Summary');
  addBody(data.storyline.executiveSummary);

  yPos += 5;

  // KPI Summary
  addTitle('Key Performance Indicators', 14);

  for (const kpi of data.kpiValues) {
    checkPageBreak(12);
    doc.setFontSize(10);
    doc.setFont(FONTS.body, 'bold');
    doc.setTextColor(26, 32, 44);
    doc.text(`${kpi.name}:`, margin, yPos);

    doc.setFont(FONTS.body, 'normal');
    const trendArrow = kpi.trend === 'up' ? '(+)' : kpi.trend === 'down' ? '(-)' : '(=)';
    doc.text(`${kpi.value.toFixed(1)} ${kpi.unit} ${trendArrow} ${kpi.trendValue.toFixed(1)}%`, margin + 55, yPos);
    yPos += 6;
  }

  yPos += 5;
  checkPageBreak(40);

  // Benchmark Comparison
  addTitle('Benchmark Comparison', 14);

  for (const benchmark of data.benchmarks) {
    checkPageBreak(12);
    const statusSymbol = benchmark.status === 'above' ? '[+]' : benchmark.status === 'below' ? '[-]' : '[=]';

    doc.setFontSize(9);
    doc.setFont(FONTS.body, 'normal');

    if (benchmark.status === 'above') {
      doc.setTextColor(56, 161, 105);
    } else if (benchmark.status === 'below') {
      doc.setTextColor(229, 62, 62);
    } else {
      doc.setTextColor(113, 128, 150);
    }

    doc.text(statusSymbol, margin, yPos);
    doc.setTextColor(26, 32, 44);
    doc.text(
      `${benchmark.kpiName}: ${benchmark.clientValue.toFixed(1)} vs ${benchmark.industryAverage.toFixed(1)} ${benchmark.unit} (Gap: ${benchmark.gapPercent > 0 ? '+' : ''}${benchmark.gapPercent.toFixed(1)}%) - ${benchmark.source}`,
      margin + 8,
      yPos
    );
    yPos += 6;
  }

  // Insights
  addPageBreak();
  addTitle('Key Insights', 14);

  for (const insight of data.insights.slice(0, 8)) {
    checkPageBreak(20);
    const severityTag = `[${insight.severity.toUpperCase()}]`;

    doc.setFontSize(10);
    doc.setFont(FONTS.body, 'bold');

    if (insight.severity === 'high') {
      doc.setTextColor(229, 62, 62);
    } else if (insight.severity === 'medium') {
      doc.setTextColor(214, 158, 46);
    } else {
      doc.setTextColor(56, 161, 105);
    }

    doc.text(`${severityTag} ${insight.title}`, margin, yPos);
    yPos += 5;

    doc.setFont(FONTS.body, 'normal');
    doc.setTextColor(26, 32, 44);
    const descLines = doc.splitTextToSize(insight.description, contentWidth);
    doc.text(descLines.slice(0, 3), margin, yPos);
    yPos += Math.min(descLines.length, 3) * 4 + 6;
  }

  // Root Cause & Recommendations
  addPageBreak();
  addTitle('Root Cause Analysis', 14);
  addBody(data.storyline.rootCause);

  checkPageBreak(60);
  yPos += 5;
  addTitle('Recommendations', 14);
  addBody(data.storyline.recommendation);

  // Next Steps
  checkPageBreak(60);
  yPos += 5;
  addTitle('Next Steps', 14);

  for (const step of data.storyline.nextSteps) {
    checkPageBreak(12);
    doc.setFontSize(10);
    doc.setFont(FONTS.body, 'normal');
    doc.setTextColor(26, 32, 44);
    const stepLines = doc.splitTextToSize(`- ${step}`, contentWidth - 5);
    doc.text(stepLines, margin + 3, yPos);
    yPos += stepLines.length * 5 + 2;
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(FONTS.body, 'normal');
    doc.setTextColor(113, 128, 150);
    doc.text('Generated by InsightSynth AI | Confidential', pageWidth / 2, 290, { align: 'center' });
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 290, { align: 'right' });
  }

  return doc.output('blob');
}

// ============================================================================
// EXCEL EXPORT (xlsx)
// ============================================================================

/**
 * Creates a detailed Excel workbook with multiple sheets for KPI data,
 * benchmarks, insights, and methodology.
 */
export async function exportToExcel(data: ExportData): Promise<Blob> {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Executive Summary
  const summaryData = [
    ['InsightSynth AI - Performance Analysis Report'],
    [''],
    ['Industry', data.industry],
    ['Source File', data.metadata.fileName],
    ['Records Analyzed', data.metadata.totalRows],
    ['Generated At', data.metadata.generatedAt],
    [''],
    ['Executive Summary'],
    [data.storyline.executiveSummary],
    [''],
    ['Key Insight'],
    [data.storyline.keyInsight]
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Sheet 2: KPI Values
  const kpiHeaders = ['KPI Name', 'Value', 'Unit', 'Category', 'Trend', 'Trend Value (%)', 'Formula'];
  const kpiRows = data.kpiValues.map(kpi => [
    kpi.name,
    kpi.value,
    kpi.unit,
    kpi.category,
    kpi.trend,
    kpi.trendValue,
    kpi.formula
  ]);
  const kpiSheet = XLSX.utils.aoa_to_sheet([kpiHeaders, ...kpiRows]);
  kpiSheet['!cols'] = [
    { wch: 25 }, { wch: 12 }, { wch: 8 }, { wch: 15 },
    { wch: 8 }, { wch: 14 }, { wch: 40 }
  ];
  XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');

  // Sheet 3: Benchmark Comparison
  const benchHeaders = [
    'KPI Name', 'Client Value', 'Industry Average', 'Top Quartile',
    'Gap', 'Gap %', 'Status', 'Unit', 'Source', 'Methodology', 'Source URL', 'Confidence'
  ];
  const benchRows = data.benchmarks.map(b => [
    b.kpiName,
    b.clientValue,
    b.industryAverage,
    b.topQuartile,
    b.gap,
    b.gapPercent,
    b.status,
    b.unit,
    b.source,
    b.methodology,
    b.sourceUrl,
    b.confidence
  ]);
  const benchSheet = XLSX.utils.aoa_to_sheet([benchHeaders, ...benchRows]);
  benchSheet['!cols'] = [
    { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
    { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
    { wch: 30 }, { wch: 50 }, { wch: 40 }, { wch: 10 }
  ];
  XLSX.utils.book_append_sheet(workbook, benchSheet, 'Benchmarks');

  // Sheet 4: Insights
  const insightHeaders = ['ID', 'Type', 'Severity', 'Title', 'Description', 'KPI', 'Impact'];
  const insightRows = data.insights.map(i => [
    i.id,
    i.type,
    i.severity,
    i.title,
    i.description,
    i.kpiName,
    i.impact
  ]);
  const insightSheet = XLSX.utils.aoa_to_sheet([insightHeaders, ...insightRows]);
  insightSheet['!cols'] = [
    { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 40 },
    { wch: 80 }, { wch: 20 }, { wch: 60 }
  ];
  XLSX.utils.book_append_sheet(workbook, insightSheet, 'Insights');

  // Sheet 5: Storyline
  const storylineData = [
    ['Section', 'Content'],
    ['Executive Summary', data.storyline.executiveSummary],
    ['Current Performance', data.storyline.currentPerformance],
    ['Key Insight', data.storyline.keyInsight],
    ['Root Cause', data.storyline.rootCause],
    ['Business Impact', data.storyline.businessImpact],
    ['Recommendation', data.storyline.recommendation],
    ['Next Steps', data.storyline.nextSteps.join('\n')]
  ];
  const storylineSheet = XLSX.utils.aoa_to_sheet(storylineData);
  storylineSheet['!cols'] = [{ wch: 20 }, { wch: 100 }];
  XLSX.utils.book_append_sheet(workbook, storylineSheet, 'Storyline');

  // Generate file
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ============================================================================
// UNIFIED EXPORT FUNCTION
// ============================================================================

export type ExportFormat = 'pptx' | 'pdf' | 'xlsx';

/**
 * Unified export function that handles all formats.
 * Returns a Blob ready for download.
 */
export async function exportReport(
  data: ExportData,
  format: ExportFormat
): Promise<{ blob: Blob; filename: string; mimeType: string }> {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseName = `InsightSynth_${data.industry}_Report_${timestamp}`;

  switch (format) {
    case 'pptx': {
      const blob = await exportToPowerPoint(data);
      return {
        blob,
        filename: `${baseName}.pptx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      };
    }
    case 'pdf': {
      const blob = await exportToPDF(data);
      return {
        blob,
        filename: `${baseName}.pdf`,
        mimeType: 'application/pdf'
      };
    }
    case 'xlsx': {
      const blob = await exportToExcel(data);
      return {
        blob,
        filename: `${baseName}.xlsx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    }
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Triggers a browser download of the exported file.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Combined export and download in one call.
 */
export async function exportAndDownload(
  data: ExportData,
  format: ExportFormat
): Promise<void> {
  const { blob, filename } = await exportReport(data, format);
  downloadBlob(blob, filename);
}

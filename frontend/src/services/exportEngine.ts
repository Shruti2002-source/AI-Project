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
 * PwC Brand Colors & Export Configuration
 */
const COLORS = {
  pwcOrange: 'D04A02',
  pwcTangerine: 'EB8C00',
  pwcYellow: 'FFB600',
  pwcRed: 'E0301E',
  pwcRose: 'D93954',
  dark: '2D2D2D',
  charcoal: '1A1A1A',
  white: 'FFFFFF',
  light: 'F5F5F5',
  gray: '7D7D7D',
  lightGray: 'E8E8E8',
  mediumGray: 'B0B0B0',
  success: '2E7D32',
  warning: 'E65100',
  danger: 'C62828',
  // Legacy aliases for PDF/Excel
  primary: '2D2D2D',
  secondary: 'D04A02',
  accent: 'EB8C00',
};

const FONTS = {
  title: 'Georgia',
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
 * Creates a PwC-branded consulting PowerPoint presentation.
 * Follows PwC visual identity: orange accent, Georgia headings, structured frameworks.
 */
export async function exportToPowerPoint(data: ExportData): Promise<Blob> {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'PwC | InsightSynth AI';
  pptx.company = 'PwC';
  pptx.subject = `${data.industry} Performance Analysis`;

  // Define PwC master slide layouts
  pptx.defineSlideMaster({
    title: 'PWC_TITLE',
    background: { color: COLORS.charcoal },
    objects: [
      { rect: { x: 0, y: 0, w: 0.08, h: '100%', fill: { color: COLORS.pwcOrange } } },
      { text: { text: 'pwc', options: { x: 8.5, y: 4.8, w: 1.5, h: 0.5, fontSize: 24, fontFace: FONTS.title, color: COLORS.pwcOrange, bold: true } } },
    ],
  });

  pptx.defineSlideMaster({
    title: 'PWC_CONTENT',
    background: { color: COLORS.white },
    objects: [
      { rect: { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: COLORS.pwcOrange } } },
      { rect: { x: 0, y: 5.2, w: '100%', h: 0.4, fill: { color: COLORS.light } } },
      { text: { text: 'PwC | Confidential', options: { x: 0.4, y: 5.25, w: 4, h: 0.3, fontSize: 7, color: COLORS.gray, fontFace: FONTS.body } } },
      { text: { text: 'pwc', options: { x: 9.0, y: 5.25, w: 0.8, h: 0.3, fontSize: 9, fontFace: FONTS.title, color: COLORS.pwcOrange, bold: true } } },
    ],
  });

  pptx.defineSlideMaster({
    title: 'PWC_DIVIDER',
    background: { color: COLORS.dark },
    objects: [
      { rect: { x: 0, y: 2.4, w: '100%', h: 0.04, fill: { color: COLORS.pwcOrange } } },
      { text: { text: 'pwc', options: { x: 8.5, y: 4.8, w: 1.5, h: 0.5, fontSize: 24, fontFace: FONTS.title, color: COLORS.pwcOrange, bold: true } } },
    ],
  });

  createPwcTitleSlide(pptx, data);
  createPwcAgendaSlide(pptx, data);
  createPwcExecutiveSummarySlide(pptx, data);
  createPwcKPIDashboardSlide(pptx, data);
  createPwcBenchmarkSlide(pptx, data);
  createPwcInsightsSlide(pptx, data);
  createPwcRootCauseSlide(pptx, data);
  createPwcRecommendationsSlide(pptx, data);
  createPwcNextStepsSlide(pptx, data);
  createPwcClosingSlide(pptx, data);

  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  return blob;
}

// ============================================================================
// PwC-BRANDED SLIDE CREATION FUNCTIONS
// ============================================================================

function createPwcTitleSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_TITLE' });

  slide.addText(String(data.industry).toUpperCase(), {
    x: 0.6, y: 1.2, w: 8, h: 0.4,
    fontSize: 13, color: COLORS.pwcOrange, fontFace: FONTS.body, bold: true, letterSpacing: 3,
  });

  slide.addText('Performance Analysis\n& Benchmark Assessment', {
    x: 0.6, y: 1.7, w: 8, h: 1.6,
    fontSize: 32, color: COLORS.white, fontFace: FONTS.title, bold: true, lineSpacingMultiple: 1.2,
  });

  slide.addShape('rect' as any, { x: 0.6, y: 3.5, w: 2.0, h: 0.04, fill: { color: COLORS.pwcOrange } });

  const dateStr = new Date(data.metadata.generatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  slide.addText(`${dateStr}\n${data.metadata.fileName}\n${data.metadata.totalRows.toLocaleString()} records analyzed`, {
    x: 0.6, y: 3.8, w: 6, h: 0.9,
    fontSize: 11, color: COLORS.mediumGray, fontFace: FONTS.body, lineSpacingMultiple: 1.5,
  });
}

function createPwcAgendaSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Agenda', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });

  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  const items = [
    'Executive Summary & Key Findings',
    'KPI Performance Dashboard',
    'Industry Benchmark Comparison',
    'Critical Insights & Risk Areas',
    'Root Cause Analysis',
    'Strategic Recommendations',
    'Roadmap & Next Steps',
  ];

  items.forEach((item, i) => {
    const y = 1.3 + i * 0.52;
    slide.addText(String(i + 1).padStart(2, '0'), {
      x: 0.5, y, w: 0.6, h: 0.4,
      fontSize: 16, color: COLORS.pwcOrange, fontFace: FONTS.title, bold: true,
    });
    slide.addText(item, {
      x: 1.2, y, w: 7, h: 0.4,
      fontSize: 13, color: COLORS.dark, fontFace: FONTS.body,
    });
  });
}

function createPwcExecutiveSummarySlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Executive Summary', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  slide.addText(data.storyline.executiveSummary, {
    x: 0.5, y: 1.1, w: 9, h: 1.5,
    fontSize: 11, color: COLORS.dark, fontFace: FONTS.body, valign: 'top', lineSpacingMultiple: 1.4,
  });

  const aboveBenchmark = data.benchmarks.filter(b => b.status === 'above').length;
  const belowBenchmark = data.benchmarks.filter(b => b.status === 'below').length;
  const highRisks = data.insights.filter(i => i.severity === 'high').length;

  const metrics = [
    { label: 'KPIs Analyzed', value: String(data.kpiValues.length), accent: COLORS.dark },
    { label: 'Above Benchmark', value: String(aboveBenchmark), accent: COLORS.success },
    { label: 'Below Benchmark', value: String(belowBenchmark), accent: COLORS.pwcOrange },
    { label: 'High-Risk Areas', value: String(highRisks), accent: COLORS.pwcRed },
  ];

  metrics.forEach((m, i) => {
    const x = 0.5 + i * 2.35;
    slide.addShape('rect' as any, { x, y: 2.9, w: 2.1, h: 1.5, fill: { color: COLORS.light } });
    slide.addShape('rect' as any, { x, y: 2.9, w: 2.1, h: 0.05, fill: { color: m.accent } });
    slide.addText(m.value, {
      x, y: 3.1, w: 2.1, h: 0.75,
      fontSize: 30, color: m.accent, fontFace: FONTS.title, bold: true, align: 'center',
    });
    slide.addText(m.label, {
      x, y: 3.85, w: 2.1, h: 0.4,
      fontSize: 9, color: COLORS.gray, fontFace: FONTS.body, align: 'center',
    });
  });

  // Key takeaway box
  slide.addShape('rect' as any, { x: 0.5, y: 4.6, w: 9, h: 0.5, fill: { color: 'FFF3E0' } });
  slide.addShape('rect' as any, { x: 0.5, y: 4.6, w: 0.06, h: 0.5, fill: { color: COLORS.pwcOrange } });
  slide.addText(`Key Takeaway: ${data.storyline.keyInsight}`, {
    x: 0.7, y: 4.6, w: 8.7, h: 0.5,
    fontSize: 9, color: COLORS.dark, fontFace: FONTS.body, italic: true, valign: 'middle',
  });
}

function createPwcKPIDashboardSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('KPI Performance Dashboard', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  const tableData: PptxGenJS.TableRow[] = [
    [
      { text: 'KPI', options: { bold: true, fontSize: 9, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Value', options: { bold: true, fontSize: 9, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Unit', options: { bold: true, fontSize: 9, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Category', options: { bold: true, fontSize: 9, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Trend', options: { bold: true, fontSize: 9, color: COLORS.white, fill: { color: COLORS.dark } } },
    ]
  ];

  for (const kpi of data.kpiValues.slice(0, 12)) {
    const trendIcon = kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '●';
    const trendColor = kpi.trend === 'up' ? COLORS.success : kpi.trend === 'down' ? COLORS.pwcRed : COLORS.gray;
    const rowFill = tableData.length % 2 === 0 ? COLORS.light : COLORS.white;

    tableData.push([
      { text: kpi.name, options: { fontSize: 9, fill: { color: rowFill } } },
      { text: kpi.value.toLocaleString(undefined, { maximumFractionDigits: 1 }), options: { fontSize: 9, bold: true, fill: { color: rowFill } } },
      { text: kpi.unit, options: { fontSize: 9, color: COLORS.gray, fill: { color: rowFill } } },
      { text: kpi.category, options: { fontSize: 9, fill: { color: rowFill } } },
      { text: `${trendIcon} ${kpi.trend}`, options: { fontSize: 9, color: trendColor, bold: true, fill: { color: rowFill } } },
    ]);
  }

  slide.addTable(tableData, {
    x: 0.5, y: 1.1, w: 9.0,
    fontSize: 9, fontFace: FONTS.body,
    border: { type: 'solid', pt: 0.5, color: COLORS.lightGray },
    colW: [2.8, 1.5, 1.0, 2.0, 1.7],
  });
}

function createPwcBenchmarkSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Industry Benchmark Comparison', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  const tableData: PptxGenJS.TableRow[] = [
    [
      { text: 'KPI', options: { bold: true, fontSize: 8, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Your Value', options: { bold: true, fontSize: 8, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Ind. Avg', options: { bold: true, fontSize: 8, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Top Quartile', options: { bold: true, fontSize: 8, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Gap', options: { bold: true, fontSize: 8, color: COLORS.white, fill: { color: COLORS.dark } } },
      { text: 'Position', options: { bold: true, fontSize: 8, color: COLORS.white, fill: { color: COLORS.dark } } },
    ]
  ];

  for (const b of data.benchmarks.slice(0, 10)) {
    const gap = b.gapPercent ?? 0;
    const gapColor = gap > 0 ? COLORS.success : gap < 0 ? COLORS.pwcRed : COLORS.gray;
    const gapText = `${gap > 0 ? '+' : ''}${gap.toFixed(1)}%`;
    const posLabel = b.status === 'above' ? 'Above' : b.status === 'below' ? 'Below' : 'At Par';
    const posColor = b.status === 'above' ? COLORS.success : b.status === 'below' ? COLORS.pwcOrange : COLORS.gray;
    const rowFill = tableData.length % 2 === 0 ? COLORS.light : COLORS.white;

    tableData.push([
      { text: b.kpiName, options: { fontSize: 8, fill: { color: rowFill } } },
      { text: `${b.clientValue.toFixed(1)} ${b.unit}`, options: { fontSize: 8, bold: true, fill: { color: rowFill } } },
      { text: `${b.industryAverage.toFixed(1)} ${b.unit}`, options: { fontSize: 8, color: COLORS.gray, fill: { color: rowFill } } },
      { text: `${b.topQuartile.toFixed(1)} ${b.unit}`, options: { fontSize: 8, color: COLORS.success, fill: { color: rowFill } } },
      { text: gapText, options: { fontSize: 8, bold: true, color: gapColor, fill: { color: rowFill } } },
      { text: posLabel, options: { fontSize: 8, bold: true, color: posColor, fill: { color: rowFill } } },
    ]);
  }

  slide.addTable(tableData, {
    x: 0.5, y: 1.1, w: 9.0,
    fontSize: 8, fontFace: FONTS.body,
    border: { type: 'solid', pt: 0.5, color: COLORS.lightGray },
    colW: [2.2, 1.5, 1.4, 1.4, 1.2, 1.3],
  });
}

function createPwcInsightsSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Critical Insights', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  const topInsights = data.insights.slice(0, 4);
  topInsights.forEach((insight, i) => {
    const y = 1.15 + i * 1.0;
    const severityColor = insight.severity === 'high' ? COLORS.pwcRed : insight.severity === 'medium' ? COLORS.pwcTangerine : COLORS.success;
    const severityLabel = (insight.severity || 'low').toUpperCase();

    // Left accent bar
    slide.addShape('rect' as any, { x: 0.5, y, w: 0.06, h: 0.85, fill: { color: severityColor } });

    // Severity badge
    slide.addText(severityLabel, {
      x: 0.7, y, w: 0.7, h: 0.3,
      fontSize: 7, color: severityColor, fontFace: FONTS.body, bold: true,
    });

    // Title
    slide.addText(insight.title, {
      x: 1.5, y, w: 7.8, h: 0.3,
      fontSize: 11, color: COLORS.dark, fontFace: FONTS.body, bold: true,
    });

    // Description
    slide.addText(insight.description.substring(0, 180) + (insight.description.length > 180 ? '...' : ''), {
      x: 1.5, y: y + 0.32, w: 7.8, h: 0.5,
      fontSize: 9, color: COLORS.gray, fontFace: FONTS.body, valign: 'top', lineSpacingMultiple: 1.3,
    });
  });
}

function createPwcRootCauseSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Root Cause Analysis', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  // Situation
  slide.addText('Situation', {
    x: 0.5, y: 1.15, w: 2, h: 0.35,
    fontSize: 10, color: COLORS.pwcOrange, fontFace: FONTS.body, bold: true,
  });
  slide.addText(data.storyline.currentPerformance.substring(0, 300), {
    x: 0.5, y: 1.5, w: 9, h: 0.8,
    fontSize: 10, color: COLORS.dark, fontFace: FONTS.body, valign: 'top', lineSpacingMultiple: 1.3,
  });

  // Complication
  slide.addText('Complication', {
    x: 0.5, y: 2.5, w: 2, h: 0.35,
    fontSize: 10, color: COLORS.pwcOrange, fontFace: FONTS.body, bold: true,
  });
  slide.addText(data.storyline.rootCause.substring(0, 400), {
    x: 0.5, y: 2.85, w: 9, h: 1.2,
    fontSize: 10, color: COLORS.dark, fontFace: FONTS.body, valign: 'top', lineSpacingMultiple: 1.3,
  });

  // Impact
  slide.addText('Business Impact', {
    x: 0.5, y: 4.2, w: 2, h: 0.35,
    fontSize: 10, color: COLORS.pwcOrange, fontFace: FONTS.body, bold: true,
  });
  slide.addText(data.storyline.businessImpact.substring(0, 300), {
    x: 0.5, y: 4.55, w: 9, h: 0.6,
    fontSize: 10, color: COLORS.dark, fontFace: FONTS.body, valign: 'top', lineSpacingMultiple: 1.3,
  });
}

function createPwcRecommendationsSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Strategic Recommendations', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  slide.addText(data.storyline.recommendation, {
    x: 0.5, y: 1.15, w: 9, h: 2.5,
    fontSize: 11, color: COLORS.dark, fontFace: FONTS.body, valign: 'top', lineSpacingMultiple: 1.4,
  });

  // Priority framework box
  slide.addShape('rect' as any, { x: 0.5, y: 3.9, w: 9, h: 1.2, fill: { color: COLORS.light } });
  slide.addShape('rect' as any, { x: 0.5, y: 3.9, w: 9, h: 0.04, fill: { color: COLORS.pwcOrange } });

  slide.addText('Implementation Priority', {
    x: 0.7, y: 4.0, w: 4, h: 0.35,
    fontSize: 10, color: COLORS.pwcOrange, fontFace: FONTS.body, bold: true,
  });

  const priorities = ['Quick Wins (0-3 months)', 'Medium-term (3-6 months)', 'Strategic (6-12 months)'];
  priorities.forEach((p, i) => {
    const x = 0.7 + i * 3.0;
    slide.addText(`${i + 1}`, {
      x, y: 4.35, w: 0.35, h: 0.35,
      fontSize: 14, color: COLORS.pwcOrange, fontFace: FONTS.title, bold: true,
    });
    slide.addText(p, {
      x: x + 0.4, y: 4.35, w: 2.5, h: 0.35,
      fontSize: 9, color: COLORS.dark, fontFace: FONTS.body, valign: 'middle',
    });
  });
}

function createPwcNextStepsSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_CONTENT' });

  slide.addText('Roadmap & Next Steps', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22, color: COLORS.dark, fontFace: FONTS.title, bold: true,
  });
  slide.addShape('rect' as any, { x: 0.5, y: 0.85, w: 1.2, h: 0.035, fill: { color: COLORS.pwcOrange } });

  const steps = data.storyline.nextSteps.slice(0, 6);
  steps.forEach((step, i) => {
    const y = 1.2 + i * 0.65;

    // Step number circle
    slide.addShape('ellipse' as any, {
      x: 0.5, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: COLORS.pwcOrange },
    });
    slide.addText(String(i + 1), {
      x: 0.5, y: y + 0.05, w: 0.4, h: 0.4,
      fontSize: 12, color: COLORS.white, fontFace: FONTS.title, bold: true, align: 'center', valign: 'middle',
    });

    // Connector line
    if (i < steps.length - 1) {
      slide.addShape('rect' as any, { x: 0.68, y: y + 0.45, w: 0.03, h: 0.25, fill: { color: COLORS.lightGray } });
    }

    // Step text
    slide.addText(step, {
      x: 1.1, y, w: 8.2, h: 0.5,
      fontSize: 11, color: COLORS.dark, fontFace: FONTS.body, valign: 'middle',
    });
  });
}

function createPwcClosingSlide(pptx: PptxGenJS, data: ExportData): void {
  const slide = pptx.addSlide({ masterName: 'PWC_DIVIDER' });

  slide.addText('Thank you', {
    x: 0.6, y: 1.2, w: 8, h: 0.8,
    fontSize: 36, color: COLORS.white, fontFace: FONTS.title, bold: true,
  });

  slide.addText('This document has been prepared for general guidance on matters of interest only, and does not constitute professional advice.', {
    x: 0.6, y: 2.8, w: 7, h: 0.8,
    fontSize: 9, color: COLORS.mediumGray, fontFace: FONTS.body, lineSpacingMultiple: 1.4,
  });

  slide.addText(`Report generated: ${new Date(data.metadata.generatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`, {
    x: 0.6, y: 3.8, w: 6, h: 0.4,
    fontSize: 10, color: COLORS.gray, fontFace: FONTS.body,
  });

  slide.addText('© 2024 PricewaterhouseCoopers. All rights reserved.', {
    x: 0.6, y: 4.3, w: 6, h: 0.4,
    fontSize: 8, color: COLORS.gray, fontFace: FONTS.body,
  });
}

// ============================================================================
// PDF EXPORT (jsPDF)
// ============================================================================

/**
 * Creates a PwC-branded PDF report with KPI data, insights, and storyline.
 * Uses jsPDF-compatible fonts (times for headings, helvetica for body).
 */
export async function exportToPDF(data: ExportData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const PDF_FONTS = { title: 'times', body: 'helvetica' };
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const addTitle = (text: string, size: number = 18) => {
    doc.setFontSize(size);
    doc.setFont(PDF_FONTS.title, 'bold');
    doc.setTextColor(45, 45, 45);
    doc.text(text, margin, yPos);
    yPos += size * 0.5 + 4;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont(PDF_FONTS.title, 'bold');
    doc.setTextColor(208, 74, 2);
    doc.text(text, margin, yPos);
    yPos += 8;
  };

  const addBody = (text: string) => {
    doc.setFontSize(10);
    doc.setFont(PDF_FONTS.body, 'normal');
    doc.setTextColor(45, 45, 45);
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

  // Title Page — PwC dark with orange accent
  doc.setFillColor(45, 45, 45);
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setFillColor(208, 74, 2);
  doc.rect(0, 60, pageWidth, 2, 'F');

  doc.setFontSize(10);
  doc.setFont(PDF_FONTS.title, 'normal');
  doc.setTextColor(208, 74, 2);
  doc.text('pwc', margin, 20);

  doc.setFontSize(22);
  doc.setFont(PDF_FONTS.title, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.industry} Performance Analysis`, margin, 38);

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  const dateStr = new Date(data.metadata.generatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  doc.text(dateStr, margin, 50);
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
    doc.setFont(PDF_FONTS.body, 'bold');
    doc.setTextColor(45, 45, 45);
    doc.text(`${kpi.name}:`, margin, yPos);

    doc.setFont(PDF_FONTS.body, 'normal');
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
    doc.setFont(PDF_FONTS.body, 'normal');

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
    doc.setFont(PDF_FONTS.body, 'bold');

    if (insight.severity === 'high') {
      doc.setTextColor(208, 74, 2);
    } else if (insight.severity === 'medium') {
      doc.setTextColor(235, 140, 0);
    } else {
      doc.setTextColor(46, 125, 50);
    }

    doc.text(`${severityTag} ${insight.title}`, margin, yPos);
    yPos += 5;

    doc.setFont(PDF_FONTS.body, 'normal');
    doc.setTextColor(45, 45, 45);
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
    doc.setFont(PDF_FONTS.body, 'normal');
    doc.setTextColor(45, 45, 45);
    const stepLines = doc.splitTextToSize(`- ${step}`, contentWidth - 5);
    doc.text(stepLines, margin + 3, yPos);
    yPos += stepLines.length * 5 + 2;
  }

  // Footer on all pages — PwC style
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(PDF_FONTS.body, 'normal');
    doc.setTextColor(125, 125, 125);
    doc.text('PwC | Confidential', margin, 290);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 290, { align: 'right' });
    // Orange bottom line
    doc.setFillColor(208, 74, 2);
    doc.rect(0, 293, pageWidth, 0.5, 'F');
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

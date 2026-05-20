import { Industry, DatasetColumn, DatasetSchema, KPIMapping, KPIValue } from '@/types';

/**
 * KPI formula definitions per industry.
 * Each formula specifies how to calculate the KPI from raw data columns.
 */
export interface KPIFormula {
  name: string;
  category: string;
  unit: string;
  requiredColumns: string[];
  alternateColumns?: string[][];
  formula: string;
  calculate: (data: Record<string, unknown>[], columnMap: Record<string, string>) => number;
  trendCalculate?: (data: Record<string, unknown>[], columnMap: Record<string, string>) => { trend: 'up' | 'down' | 'stable'; value: number };
}

/**
 * Helper: extract numeric values from a column in the dataset.
 */
function getNumericColumn(data: Record<string, unknown>[], columnName: string): number[] {
  return data
    .map(row => {
      const val = row[columnName];
      if (val === null || val === undefined || val === '') return NaN;
      const num = typeof val === 'number' ? val : parseFloat(String(val));
      return num;
    })
    .filter(v => !isNaN(v));
}

/**
 * Helper: compute mean of numeric array.
 */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Helper: compute sum of numeric array.
 */
function sum(values: number[]): number {
  return values.reduce((s, v) => s + v, 0);
}

/**
 * Helper: get latest and earliest values from a time-series column.
 */
function getTimeSeriesEndpoints(data: Record<string, unknown>[], columnName: string): { earliest: number; latest: number } {
  const values = getNumericColumn(data, columnName);
  if (values.length === 0) return { earliest: 0, latest: 0 };
  return { earliest: values[0], latest: values[values.length - 1] };
}

/**
 * FMCG KPI Formulas
 */
const FMCG_KPIS: KPIFormula[] = [
  {
    name: 'Revenue',
    category: 'Financial',
    unit: '$',
    requiredColumns: ['revenue', 'sales', 'total_revenue', 'net_revenue'],
    formula: 'SUM(Revenue)',
    calculate: (data, columnMap) => {
      const col = columnMap['revenue'] || columnMap['sales'] || columnMap['total_revenue'] || columnMap['net_revenue'];
      if (!col) return 0;
      return sum(getNumericColumn(data, col));
    }
  },
  {
    name: 'Revenue Growth',
    category: 'Financial',
    unit: '%',
    requiredColumns: ['revenue', 'sales', 'total_revenue', 'net_revenue'],
    formula: '((Latest Revenue - Earliest Revenue) / Earliest Revenue) * 100',
    calculate: (data, columnMap) => {
      const col = columnMap['revenue'] || columnMap['sales'] || columnMap['total_revenue'] || columnMap['net_revenue'];
      if (!col) return 0;
      const { earliest, latest } = getTimeSeriesEndpoints(data, col);
      if (earliest === 0) return 0;
      return ((latest - earliest) / earliest) * 100;
    }
  },
  {
    name: 'Sales Volume',
    category: 'Commercial',
    unit: 'units',
    requiredColumns: ['volume', 'units_sold', 'quantity', 'sales_volume'],
    formula: 'SUM(Volume)',
    calculate: (data, columnMap) => {
      const col = columnMap['volume'] || columnMap['units_sold'] || columnMap['quantity'] || columnMap['sales_volume'];
      if (!col) return 0;
      return sum(getNumericColumn(data, col));
    }
  },
  {
    name: 'Market Share',
    category: 'Commercial',
    unit: '%',
    requiredColumns: ['market_share', 'share', 'mkt_share'],
    formula: 'MEAN(Market Share %)',
    calculate: (data, columnMap) => {
      const col = columnMap['market_share'] || columnMap['share'] || columnMap['mkt_share'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Fill Rate',
    category: 'Supply Chain',
    unit: '%',
    requiredColumns: ['fill_rate', 'fill_rate_percent', 'order_fill_rate'],
    formula: 'MEAN(Fill_Rate_Percent)',
    calculate: (data, columnMap) => {
      const col = columnMap['fill_rate'] || columnMap['fill_rate_percent'] || columnMap['order_fill_rate'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Inventory Turnover',
    category: 'Supply Chain',
    unit: 'x',
    requiredColumns: ['inventory_turnover', 'inv_turnover', 'turns'],
    alternateColumns: [['cogs', 'cost_of_goods_sold'], ['average_inventory', 'avg_inventory']],
    formula: 'COGS / Average Inventory OR MEAN(Inventory Turnover)',
    calculate: (data, columnMap) => {
      // Direct column
      const directCol = columnMap['inventory_turnover'] || columnMap['inv_turnover'] || columnMap['turns'];
      if (directCol) return mean(getNumericColumn(data, directCol));
      // Calculated
      const cogsCol = columnMap['cogs'] || columnMap['cost_of_goods_sold'];
      const invCol = columnMap['average_inventory'] || columnMap['avg_inventory'];
      if (cogsCol && invCol) {
        const totalCogs = sum(getNumericColumn(data, cogsCol));
        const avgInv = mean(getNumericColumn(data, invCol));
        return avgInv > 0 ? totalCogs / avgInv : 0;
      }
      return 0;
    }
  },
  {
    name: 'Forecast Accuracy',
    category: 'Supply Chain',
    unit: '%',
    requiredColumns: ['forecast_accuracy', 'fcst_accuracy', 'forecast_acc'],
    alternateColumns: [['forecast', 'actual']],
    formula: '(1 - ABS(Forecast - Actual) / Actual) * 100 OR MEAN(Forecast Accuracy %)',
    calculate: (data, columnMap) => {
      const directCol = columnMap['forecast_accuracy'] || columnMap['fcst_accuracy'] || columnMap['forecast_acc'];
      if (directCol) return mean(getNumericColumn(data, directCol));
      // Calculated from forecast vs actual
      const fcstCol = columnMap['forecast'];
      const actCol = columnMap['actual'];
      if (fcstCol && actCol) {
        const forecasts = getNumericColumn(data, fcstCol);
        const actuals = getNumericColumn(data, actCol);
        const len = Math.min(forecasts.length, actuals.length);
        if (len === 0) return 0;
        let totalAccuracy = 0;
        for (let i = 0; i < len; i++) {
          if (actuals[i] !== 0) {
            totalAccuracy += (1 - Math.abs(forecasts[i] - actuals[i]) / actuals[i]) * 100;
          }
        }
        return totalAccuracy / len;
      }
      return 0;
    }
  },
  {
    name: 'Stockout Rate',
    category: 'Supply Chain',
    unit: '%',
    requiredColumns: ['stockout_rate', 'oos_rate', 'out_of_stock'],
    formula: 'MEAN(Stockout Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['stockout_rate'] || columnMap['oos_rate'] || columnMap['out_of_stock'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Warehouse Utilization',
    category: 'Supply Chain',
    unit: '%',
    requiredColumns: ['warehouse_utilization', 'wh_utilization', 'storage_utilization'],
    formula: 'MEAN(Warehouse Utilization %)',
    calculate: (data, columnMap) => {
      const col = columnMap['warehouse_utilization'] || columnMap['wh_utilization'] || columnMap['storage_utilization'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Supplier Lead Time',
    category: 'Supply Chain',
    unit: 'days',
    requiredColumns: ['supplier_lead_time', 'lead_time', 'lead_time_days'],
    formula: 'MEAN(Supplier Lead Time)',
    calculate: (data, columnMap) => {
      const col = columnMap['supplier_lead_time'] || columnMap['lead_time'] || columnMap['lead_time_days'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Repeat Purchase Rate',
    category: 'Customer',
    unit: '%',
    requiredColumns: ['repeat_purchase_rate', 'repeat_rate', 'repurchase_rate'],
    formula: 'MEAN(Repeat Purchase Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['repeat_purchase_rate'] || columnMap['repeat_rate'] || columnMap['repurchase_rate'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Customer Satisfaction',
    category: 'Customer',
    unit: 'score',
    requiredColumns: ['customer_satisfaction', 'csat', 'satisfaction_score', 'nps'],
    formula: 'MEAN(Customer Satisfaction Score)',
    calculate: (data, columnMap) => {
      const col = columnMap['customer_satisfaction'] || columnMap['csat'] || columnMap['satisfaction_score'] || columnMap['nps'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  }
];

/**
 * Healthcare KPI Formulas
 */
const HEALTHCARE_KPIS: KPIFormula[] = [
  {
    name: 'Readmission Rate',
    category: 'Quality',
    unit: '%',
    requiredColumns: ['readmission_rate', 'readmit_rate', '30day_readmission'],
    formula: 'MEAN(Readmission Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['readmission_rate'] || columnMap['readmit_rate'] || columnMap['30day_readmission'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Average Length of Stay',
    category: 'Operational',
    unit: 'days',
    requiredColumns: ['length_of_stay', 'los', 'avg_los'],
    formula: 'MEAN(Length of Stay)',
    calculate: (data, columnMap) => {
      const col = columnMap['length_of_stay'] || columnMap['los'] || columnMap['avg_los'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Bed Occupancy Rate',
    category: 'Operational',
    unit: '%',
    requiredColumns: ['bed_occupancy', 'occupancy_rate', 'bed_utilization'],
    formula: 'MEAN(Bed Occupancy %)',
    calculate: (data, columnMap) => {
      const col = columnMap['bed_occupancy'] || columnMap['occupancy_rate'] || columnMap['bed_utilization'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Patient Satisfaction',
    category: 'Quality',
    unit: 'score',
    requiredColumns: ['patient_satisfaction', 'hcahps', 'satisfaction_score'],
    formula: 'MEAN(Patient Satisfaction Score)',
    calculate: (data, columnMap) => {
      const col = columnMap['patient_satisfaction'] || columnMap['hcahps'] || columnMap['satisfaction_score'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Mortality Rate',
    category: 'Quality',
    unit: '%',
    requiredColumns: ['mortality_rate', 'death_rate', 'inpatient_mortality'],
    formula: 'MEAN(Mortality Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['mortality_rate'] || columnMap['death_rate'] || columnMap['inpatient_mortality'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Wait Time',
    category: 'Operational',
    unit: 'minutes',
    requiredColumns: ['wait_time', 'avg_wait', 'waiting_time'],
    formula: 'MEAN(Wait Time)',
    calculate: (data, columnMap) => {
      const col = columnMap['wait_time'] || columnMap['avg_wait'] || columnMap['waiting_time'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  }
];

/**
 * Banking KPI Formulas
 */
const BANKING_KPIS: KPIFormula[] = [
  {
    name: 'Net Interest Margin',
    category: 'Financial',
    unit: '%',
    requiredColumns: ['nim', 'net_interest_margin', 'interest_margin'],
    formula: 'MEAN(NIM %)',
    calculate: (data, columnMap) => {
      const col = columnMap['nim'] || columnMap['net_interest_margin'] || columnMap['interest_margin'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Return on Assets',
    category: 'Financial',
    unit: '%',
    requiredColumns: ['roa', 'return_on_assets'],
    formula: 'MEAN(ROA %)',
    calculate: (data, columnMap) => {
      const col = columnMap['roa'] || columnMap['return_on_assets'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Return on Equity',
    category: 'Financial',
    unit: '%',
    requiredColumns: ['roe', 'return_on_equity'],
    formula: 'MEAN(ROE %)',
    calculate: (data, columnMap) => {
      const col = columnMap['roe'] || columnMap['return_on_equity'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Non-Performing Assets',
    category: 'Risk',
    unit: '%',
    requiredColumns: ['npa', 'npl', 'non_performing', 'npa_ratio'],
    formula: 'MEAN(NPA Ratio %)',
    calculate: (data, columnMap) => {
      const col = columnMap['npa'] || columnMap['npl'] || columnMap['non_performing'] || columnMap['npa_ratio'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Cost-to-Income Ratio',
    category: 'Efficiency',
    unit: '%',
    requiredColumns: ['cost_to_income', 'cir', 'efficiency_ratio'],
    formula: 'MEAN(Cost-to-Income %)',
    calculate: (data, columnMap) => {
      const col = columnMap['cost_to_income'] || columnMap['cir'] || columnMap['efficiency_ratio'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Capital Adequacy Ratio',
    category: 'Risk',
    unit: '%',
    requiredColumns: ['car', 'capital_adequacy', 'tier1_ratio'],
    formula: 'MEAN(CAR %)',
    calculate: (data, columnMap) => {
      const col = columnMap['car'] || columnMap['capital_adequacy'] || columnMap['tier1_ratio'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  }
];

/**
 * Retail KPI Formulas
 */
const RETAIL_KPIS: KPIFormula[] = [
  {
    name: 'Same-Store Sales Growth',
    category: 'Financial',
    unit: '%',
    requiredColumns: ['same_store_sales', 'comp_sales', 'sss_growth'],
    formula: 'MEAN(Same-Store Sales Growth %)',
    calculate: (data, columnMap) => {
      const col = columnMap['same_store_sales'] || columnMap['comp_sales'] || columnMap['sss_growth'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Average Order Value',
    category: 'Commercial',
    unit: '$',
    requiredColumns: ['aov', 'average_order_value', 'avg_basket'],
    formula: 'MEAN(AOV)',
    calculate: (data, columnMap) => {
      const col = columnMap['aov'] || columnMap['average_order_value'] || columnMap['avg_basket'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Conversion Rate',
    category: 'Commercial',
    unit: '%',
    requiredColumns: ['conversion_rate', 'conversion', 'cvr'],
    formula: 'MEAN(Conversion Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['conversion_rate'] || columnMap['conversion'] || columnMap['cvr'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Customer Retention Rate',
    category: 'Customer',
    unit: '%',
    requiredColumns: ['retention_rate', 'retention', 'customer_retention'],
    formula: 'MEAN(Retention Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['retention_rate'] || columnMap['retention'] || columnMap['customer_retention'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Shrinkage Rate',
    category: 'Operational',
    unit: '%',
    requiredColumns: ['shrinkage', 'shrinkage_rate', 'loss_rate'],
    formula: 'MEAN(Shrinkage %)',
    calculate: (data, columnMap) => {
      const col = columnMap['shrinkage'] || columnMap['shrinkage_rate'] || columnMap['loss_rate'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Footfall',
    category: 'Operational',
    unit: 'visitors',
    requiredColumns: ['footfall', 'traffic', 'store_visits'],
    formula: 'SUM(Footfall)',
    calculate: (data, columnMap) => {
      const col = columnMap['footfall'] || columnMap['traffic'] || columnMap['store_visits'];
      if (!col) return 0;
      return sum(getNumericColumn(data, col));
    }
  }
];

/**
 * Manufacturing KPI Formulas
 */
const MANUFACTURING_KPIS: KPIFormula[] = [
  {
    name: 'Overall Equipment Effectiveness',
    category: 'Operational',
    unit: '%',
    requiredColumns: ['oee', 'overall_equipment_effectiveness'],
    formula: 'MEAN(OEE %)',
    calculate: (data, columnMap) => {
      const col = columnMap['oee'] || columnMap['overall_equipment_effectiveness'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Yield Rate',
    category: 'Quality',
    unit: '%',
    requiredColumns: ['yield', 'yield_rate', 'first_pass_yield'],
    formula: 'MEAN(Yield Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['yield'] || columnMap['yield_rate'] || columnMap['first_pass_yield'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Defect Rate',
    category: 'Quality',
    unit: '%',
    requiredColumns: ['defect_rate', 'defects', 'rejection_rate'],
    formula: 'MEAN(Defect Rate %)',
    calculate: (data, columnMap) => {
      const col = columnMap['defect_rate'] || columnMap['defects'] || columnMap['rejection_rate'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Capacity Utilization',
    category: 'Operational',
    unit: '%',
    requiredColumns: ['capacity_utilization', 'utilization', 'capacity_usage'],
    formula: 'MEAN(Capacity Utilization %)',
    calculate: (data, columnMap) => {
      const col = columnMap['capacity_utilization'] || columnMap['utilization'] || columnMap['capacity_usage'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Mean Time Between Failures',
    category: 'Maintenance',
    unit: 'hours',
    requiredColumns: ['mtbf', 'mean_time_between_failures'],
    formula: 'MEAN(MTBF hours)',
    calculate: (data, columnMap) => {
      const col = columnMap['mtbf'] || columnMap['mean_time_between_failures'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  },
  {
    name: 'Cycle Time',
    category: 'Operational',
    unit: 'minutes',
    requiredColumns: ['cycle_time', 'avg_cycle_time', 'processing_time'],
    formula: 'MEAN(Cycle Time)',
    calculate: (data, columnMap) => {
      const col = columnMap['cycle_time'] || columnMap['avg_cycle_time'] || columnMap['processing_time'];
      if (!col) return 0;
      return mean(getNumericColumn(data, col));
    }
  }
];

/**
 * Industry KPI registry
 */
const KPI_REGISTRY: Record<Industry, KPIFormula[]> = {
  FMCG: FMCG_KPIS,
  Healthcare: HEALTHCARE_KPIS,
  Banking: BANKING_KPIS,
  Retail: RETAIL_KPIS,
  Manufacturing: MANUFACTURING_KPIS
};

/**
 * Normalizes a column name for matching against KPI formula required columns.
 */
function normalizeColumnName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * Maps dataset columns to KPI formulas for a given industry.
 */
export function mapColumnsToKPIs(schema: DatasetSchema, industry: Industry): KPIMapping[] {
  const formulas = KPI_REGISTRY[industry];
  const mappings: KPIMapping[] = [];

  for (const formula of formulas) {
    let matchedColumn: string | null = null;
    let confidence = 0;

    // Check required columns
    for (const column of schema.columns) {
      const normalizedCol = normalizeColumnName(column.name);
      for (const requiredCol of formula.requiredColumns) {
        if (normalizedCol === requiredCol || normalizedCol.includes(requiredCol) || requiredCol.includes(normalizedCol)) {
          matchedColumn = column.name;
          confidence = normalizedCol === requiredCol ? 1.0 : 0.8;
          break;
        }
      }
      if (matchedColumn) break;
    }

    // Check alternate columns if no direct match
    if (!matchedColumn && formula.alternateColumns) {
      for (const altGroup of formula.alternateColumns) {
        const matchedAlts: string[] = [];
        for (const altCol of altGroup) {
          for (const column of schema.columns) {
            const normalizedCol = normalizeColumnName(column.name);
            if (normalizedCol === altCol || normalizedCol.includes(altCol)) {
              matchedAlts.push(column.name);
              break;
            }
          }
        }
        if (matchedAlts.length > 0) {
          matchedColumn = matchedAlts[0];
          confidence = 0.6;
          break;
        }
      }
    }

    if (matchedColumn) {
      mappings.push({
        columnName: matchedColumn,
        kpiName: formula.name,
        category: formula.category,
        formula: formula.formula,
        unit: formula.unit,
        confidence
      });
    }
  }

  return mappings;
}

/**
 * Calculates KPI values from raw data using the mapped formulas.
 */
export function calculateKPIs(
  data: Record<string, unknown>[],
  schema: DatasetSchema,
  industry: Industry,
  mappings: KPIMapping[]
): KPIValue[] {
  const formulas = KPI_REGISTRY[industry];
  const kpiValues: KPIValue[] = [];

  // Build a column name map from all columns
  const columnMap: Record<string, string> = {};
  for (const column of schema.columns) {
    const normalized = normalizeColumnName(column.name);
    columnMap[normalized] = column.name;
  }

  for (const mapping of mappings) {
    const formula = formulas.find(f => f.name === mapping.kpiName);
    if (!formula) continue;

    try {
      const value = formula.calculate(data, columnMap);
      
      // Calculate trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      let trendValue = 0;

      if (data.length > 1) {
        const midPoint = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, midPoint);
        const secondHalf = data.slice(midPoint);

        const firstValue = formula.calculate(firstHalf, columnMap);
        const secondValue = formula.calculate(secondHalf, columnMap);

        if (firstValue !== 0) {
          trendValue = ((secondValue - firstValue) / Math.abs(firstValue)) * 100;
          if (trendValue > 2) trend = 'up';
          else if (trendValue < -2) trend = 'down';
        }
      }

      kpiValues.push({
        name: mapping.kpiName,
        value: Math.round(value * 100) / 100,
        unit: mapping.unit,
        category: mapping.category,
        trend,
        trendValue: Math.round(trendValue * 100) / 100,
        formula: mapping.formula
      });
    } catch {
      // Skip KPIs that fail to calculate
      continue;
    }
  }

  return kpiValues;
}

/**
 * Gets available KPI names for a given industry.
 */
export function getAvailableKPIs(industry: Industry): string[] {
  return KPI_REGISTRY[industry].map(f => f.name);
}

/**
 * Gets formula details for a specific KPI.
 */
export function getKPIFormula(industry: Industry, kpiName: string): KPIFormula | undefined {
  return KPI_REGISTRY[industry].find(f => f.name === kpiName);
}

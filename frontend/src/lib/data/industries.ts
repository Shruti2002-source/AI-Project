import { IndustryConfig } from '@/types';

export const INDUSTRIES: IndustryConfig[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Hospitals, clinics, pharma, and health systems optimizing patient outcomes and operational efficiency.',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    categories: [
      {
        id: 'patient_care',
        name: 'Patient Care',
        icon: '❤️',
        kpis: [
          { id: 'patient_satisfaction', name: 'Patient Satisfaction Score', category: 'Patient Care', value: 82.4, unit: '%', trend: 3.2, trendDirection: 'up', status: 'good' },
          { id: 'wait_time', name: 'Patient Wait Time', category: 'Patient Care', value: 28, unit: 'min', trend: -5.1, trendDirection: 'down', status: 'good' },
          { id: 'readmission_rate', name: 'Readmission Rate', category: 'Patient Care', value: 14.2, unit: '%', trend: 1.3, trendDirection: 'up', status: 'warning' },
          { id: 'mortality_rate', name: 'Mortality Rate', category: 'Patient Care', value: 2.1, unit: '%', trend: -0.2, trendDirection: 'down', status: 'good' },
        ],
      },
      {
        id: 'operations',
        name: 'Operations',
        icon: '⚙️',
        kpis: [
          { id: 'bed_occupancy', name: 'Bed Occupancy Rate', category: 'Operations', value: 76.8, unit: '%', trend: 2.1, trendDirection: 'up', status: 'good' },
          { id: 'avg_length_stay', name: 'Average Length of Stay', category: 'Operations', value: 4.2, unit: 'days', trend: -0.3, trendDirection: 'down', status: 'good' },
          { id: 'staff_utilization', name: 'Staff Utilization Rate', category: 'Operations', value: 88.5, unit: '%', trend: 1.8, trendDirection: 'up', status: 'warning' },
        ],
      },
      {
        id: 'financial',
        name: 'Financial',
        icon: '💰',
        kpis: [
          { id: 'revenue_per_patient', name: 'Revenue per Patient', category: 'Financial', value: 4850, unit: '$', trend: 5.4, trendDirection: 'up', status: 'good' },
          { id: 'claim_rejection', name: 'Claim Rejection Rate', category: 'Financial', value: 8.7, unit: '%', trend: -2.1, trendDirection: 'down', status: 'warning' },
          { id: 'operating_margin', name: 'Operating Margin', category: 'Financial', value: 12.3, unit: '%', trend: 1.2, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'compliance',
        name: 'Compliance',
        icon: '📋',
        kpis: [
          { id: 'infection_rate', name: 'Infection Rate', category: 'Compliance', value: 1.8, unit: '%', trend: -0.4, trendDirection: 'down', status: 'good' },
          { id: 'medical_error_rate', name: 'Medical Error Rate', category: 'Compliance', value: 0.42, unit: '%', trend: -0.08, trendDirection: 'down', status: 'good' },
          { id: 'audit_findings', name: 'Audit Findings', category: 'Compliance', value: 3, unit: 'count', trend: -1, trendDirection: 'down', status: 'good' },
        ],
      },
    ],
  },
  {
    id: 'fmcg',
    name: 'FMCG',
    icon: '🛒',
    description: 'Fast-moving consumer goods companies driving brand growth, supply chain excellence, and distribution efficiency.',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    categories: [
      {
        id: 'sales',
        name: 'Sales',
        icon: '📈',
        kpis: [
          { id: 'revenue_growth', name: 'Revenue Growth', category: 'Sales', value: 8.4, unit: '%', trend: 1.2, trendDirection: 'up', status: 'good' },
          { id: 'market_share', name: 'Market Share', category: 'Sales', value: 14.6, unit: '%', trend: 0.8, trendDirection: 'up', status: 'good' },
          { id: 'sales_volume', name: 'Sales Volume', category: 'Sales', value: 2840, unit: 'K units', trend: 6.2, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'supply_chain',
        name: 'Supply Chain',
        icon: '🔗',
        kpis: [
          { id: 'fill_rate', name: 'Fill Rate', category: 'Supply Chain', value: 94.2, unit: '%', trend: -1.1, trendDirection: 'down', status: 'warning' },
          { id: 'inventory_turnover', name: 'Inventory Turnover', category: 'Supply Chain', value: 8.6, unit: 'x', trend: -1.4, trendDirection: 'down', status: 'warning' },
          { id: 'forecast_accuracy', name: 'Forecast Accuracy', category: 'Supply Chain', value: 78.3, unit: '%', trend: 2.1, trendDirection: 'up', status: 'warning' },
          { id: 'stockout_rate', name: 'Stockout Rate', category: 'Supply Chain', value: 4.8, unit: '%', trend: 0.6, trendDirection: 'up', status: 'critical' },
        ],
      },
      {
        id: 'distribution',
        name: 'Distribution',
        icon: '🚚',
        kpis: [
          { id: 'warehouse_utilization', name: 'Warehouse Utilization', category: 'Distribution', value: 81.2, unit: '%', trend: 3.4, trendDirection: 'up', status: 'good' },
          { id: 'supplier_lead_time', name: 'Supplier Lead Time', category: 'Distribution', value: 12.4, unit: 'days', trend: -1.2, trendDirection: 'down', status: 'good' },
        ],
      },
      {
        id: 'customer',
        name: 'Customer',
        icon: '👥',
        kpis: [
          { id: 'repeat_purchase', name: 'Repeat Purchase Rate', category: 'Customer', value: 62.8, unit: '%', trend: 4.1, trendDirection: 'up', status: 'good' },
          { id: 'customer_satisfaction_fmcg', name: 'Customer Satisfaction', category: 'Customer', value: 78.4, unit: '%', trend: 2.3, trendDirection: 'up', status: 'good' },
        ],
      },
    ],
  },
  {
    id: 'banking',
    name: 'Banking & Financial Services',
    icon: '🏦',
    description: 'Banks, insurance firms, and fintech companies maximizing profitability while managing risk and compliance.',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    categories: [
      {
        id: 'financial_banking',
        name: 'Financial',
        icon: '💹',
        kpis: [
          { id: 'cost_income_ratio', name: 'Cost-to-Income Ratio', category: 'Financial', value: 58.4, unit: '%', trend: -2.1, trendDirection: 'down', status: 'good' },
          { id: 'net_interest_margin', name: 'Net Interest Margin', category: 'Financial', value: 3.42, unit: '%', trend: 0.18, trendDirection: 'up', status: 'good' },
          { id: 'profit_margin', name: 'Profit Margin', category: 'Financial', value: 22.6, unit: '%', trend: 1.8, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'customer_banking',
        name: 'Customer',
        icon: '🤝',
        kpis: [
          { id: 'customer_acquisition', name: 'Customer Acquisition', category: 'Customer', value: 4820, unit: 'monthly', trend: 12.4, trendDirection: 'up', status: 'good' },
          { id: 'churn_rate', name: 'Churn Rate', category: 'Customer', value: 6.2, unit: '%', trend: -0.8, trendDirection: 'down', status: 'good' },
          { id: 'digital_adoption', name: 'Digital Adoption Rate', category: 'Customer', value: 68.4, unit: '%', trend: 8.2, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'risk',
        name: 'Risk',
        icon: '⚠️',
        kpis: [
          { id: 'npa_ratio', name: 'NPA Ratio', category: 'Risk', value: 2.8, unit: '%', trend: 0.3, trendDirection: 'up', status: 'warning' },
          { id: 'fraud_detection', name: 'Fraud Detection Rate', category: 'Risk', value: 94.6, unit: '%', trend: 2.1, trendDirection: 'up', status: 'good' },
          { id: 'credit_default', name: 'Credit Default Rate', category: 'Risk', value: 3.4, unit: '%', trend: 0.2, trendDirection: 'up', status: 'warning' },
        ],
      },
      {
        id: 'operations_banking',
        name: 'Operations',
        icon: '⚙️',
        kpis: [
          { id: 'loan_processing', name: 'Loan Processing Time', category: 'Operations', value: 3.2, unit: 'days', trend: -0.8, trendDirection: 'down', status: 'good' },
          { id: 'resolution_time', name: 'Resolution Time', category: 'Operations', value: 2.4, unit: 'days', trend: -0.3, trendDirection: 'down', status: 'good' },
        ],
      },
    ],
  },
  {
    id: 'retail',
    name: 'Retail & E-Commerce',
    icon: '🛍️',
    description: 'Omnichannel retailers and digital commerce platforms optimizing customer experience and profitability.',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    categories: [
      {
        id: 'sales_retail',
        name: 'Sales',
        icon: '💳',
        kpis: [
          { id: 'gmv', name: 'GMV', category: 'Sales', value: 42.6, unit: '$M', trend: 18.4, trendDirection: 'up', status: 'good' },
          { id: 'revenue_growth_retail', name: 'Revenue Growth', category: 'Sales', value: 22.4, unit: '%', trend: 4.2, trendDirection: 'up', status: 'good' },
          { id: 'aov', name: 'Average Order Value', category: 'Sales', value: 84.6, unit: '$', trend: 6.8, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'customer_retail',
        name: 'Customer',
        icon: '👤',
        kpis: [
          { id: 'cart_abandonment', name: 'Cart Abandonment Rate', category: 'Customer', value: 68.4, unit: '%', trend: -3.2, trendDirection: 'down', status: 'warning' },
          { id: 'repeat_purchase_retail', name: 'Repeat Purchase Rate', category: 'Customer', value: 44.8, unit: '%', trend: 5.6, trendDirection: 'up', status: 'good' },
          { id: 'nps', name: 'NPS', category: 'Customer', value: 58, unit: 'score', trend: 6, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'inventory',
        name: 'Inventory',
        icon: '📦',
        kpis: [
          { id: 'inventory_turnover_retail', name: 'Inventory Turnover', category: 'Inventory', value: 6.4, unit: 'x', trend: -0.8, trendDirection: 'down', status: 'warning' },
          { id: 'return_rate', name: 'Return Rate', category: 'Inventory', value: 18.2, unit: '%', trend: 1.4, trendDirection: 'up', status: 'warning' },
          { id: 'stock_availability', name: 'Stock Availability', category: 'Inventory', value: 96.4, unit: '%', trend: 1.2, trendDirection: 'up', status: 'good' },
        ],
      },
      {
        id: 'marketing',
        name: 'Marketing',
        icon: '📣',
        kpis: [
          { id: 'roas', name: 'ROAS', category: 'Marketing', value: 4.2, unit: 'x', trend: 0.4, trendDirection: 'up', status: 'good' },
          { id: 'conversion_rate', name: 'Conversion Rate', category: 'Marketing', value: 3.8, unit: '%', trend: 0.6, trendDirection: 'up', status: 'good' },
        ],
      },
    ],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Industrial manufacturers and process industries driving operational excellence, quality, and lean efficiency.',
    color: '#ef4444',
    gradient: 'from-red-500 to-rose-600',
    categories: [
      {
        id: 'production',
        name: 'Production',
        icon: '⚙️',
        kpis: [
          { id: 'oee', name: 'OEE', category: 'Production', value: 74.6, unit: '%', trend: 2.4, trendDirection: 'up', status: 'warning' },
          { id: 'production_volume', name: 'Production Volume', category: 'Production', value: 18400, unit: 'units', trend: 4.8, trendDirection: 'up', status: 'good' },
          { id: 'cycle_time', name: 'Cycle Time', category: 'Production', value: 12.4, unit: 'min', trend: -1.2, trendDirection: 'down', status: 'good' },
          { id: 'downtime', name: 'Downtime', category: 'Production', value: 6.8, unit: '%', trend: -0.4, trendDirection: 'down', status: 'warning' },
        ],
      },
      {
        id: 'quality',
        name: 'Quality',
        icon: '✅',
        kpis: [
          { id: 'defect_rate', name: 'Defect Rate', category: 'Quality', value: 2.4, unit: '%', trend: -0.6, trendDirection: 'down', status: 'good' },
          { id: 'rework_rate', name: 'Rework Rate', category: 'Quality', value: 3.8, unit: '%', trend: -0.4, trendDirection: 'down', status: 'good' },
          { id: 'scrap_rate', name: 'Scrap Rate', category: 'Quality', value: 1.6, unit: '%', trend: -0.2, trendDirection: 'down', status: 'good' },
        ],
      },
      {
        id: 'supply_chain_mfg',
        name: 'Supply Chain',
        icon: '🔗',
        kpis: [
          { id: 'material_availability', name: 'Material Availability', category: 'Supply Chain', value: 96.8, unit: '%', trend: 0.8, trendDirection: 'up', status: 'good' },
          { id: 'inventory_days', name: 'Inventory Days', category: 'Supply Chain', value: 24.6, unit: 'days', trend: -2.4, trendDirection: 'down', status: 'good' },
          { id: 'logistics_cost', name: 'Logistics Cost', category: 'Supply Chain', value: 8.4, unit: '% of revenue', trend: -0.6, trendDirection: 'down', status: 'good' },
        ],
      },
      {
        id: 'safety',
        name: 'Safety & HR',
        icon: '🦺',
        kpis: [
          { id: 'incident_rate', name: 'Incident Rate', category: 'Safety', value: 1.8, unit: 'per 100 workers', trend: -0.4, trendDirection: 'down', status: 'good' },
          { id: 'labor_productivity', name: 'Labor Productivity', category: 'Safety', value: 124600, unit: '$/FTE', trend: 6.2, trendDirection: 'up', status: 'good' },
        ],
      },
    ],
  },
];

export const getIndustry = (id: string): IndustryConfig | undefined =>
  INDUSTRIES.find((i) => i.id === id);

export const getIndustryColor = (id: string): string => {
  const colors: Record<string, string> = {
    healthcare: '#06b6d4',
    fmcg: '#10b981',
    banking: '#8b5cf6',
    retail: '#f59e0b',
    manufacturing: '#ef4444',
  };
  return colors[id] || '#6366f1';
};

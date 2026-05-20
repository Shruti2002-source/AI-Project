export type EngagementPhase = 'kickoff' | 'discovery' | 'analysis' | 'recommendations' | 'delivery';
export type FindingPriority = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'draft' | 'in_review' | 'approved' | 'presented';
export type DeliverableStatus = 'not_started' | 'in_progress' | 'in_review' | 'delivered';

export interface PhaseStep {
  id: EngagementPhase;
  label: string;
  status: 'done' | 'active' | 'pending';
  week?: string;
}

export interface TeamMember {
  name: string;
  initials: string;
  role: string;
}

export interface Workstream {
  id: string;
  name: string;
  lead: string;
  status: 'on_track' | 'at_risk' | 'delayed';
}

export interface Deliverable {
  id: string;
  title: string;
  type: 'presentation' | 'report' | 'analysis' | 'workshop' | 'model';
  dueDate: string;
  status: DeliverableStatus;
  owner: string;
}

export interface Finding {
  id: string;
  engagementId: string;
  workstream: string;
  headline: string;
  situation: string;
  complication: string;
  implication: string;
  recommendation: string;
  evidence: string[];
  priority: FindingPriority;
  status: FindingStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Engagement {
  id: string;
  code: string;
  client: string;
  industry: 'fmcg' | 'healthcare' | 'banking' | 'retail' | 'manufacturing';
  industryLabel: string;
  description: string;
  phase: EngagementPhase;
  phases: PhaseStep[];
  startDate: string;
  endDate: string;
  weekCurrent: number;
  weekTotal: number;
  team: TeamMember[];
  workstreams: Workstream[];
  deliverables: Deliverable[];
  findings: Finding[];
}

// ─── Findings ─────────────────────────────────────────────────────────────────

const hartleyFindings: Finding[] = [
  {
    id: 'f-001',
    engagementId: 'eng-001',
    workstream: 'Supply Chain',
    headline: 'Inventory turnover 32% below industry benchmark — €4.2M trapped working capital',
    situation: 'Hartley Foods\' current inventory turnover stands at 5.8x vs. the FMCG industry benchmark of 8.6x. The gap has widened from 18% in FY22 to 32% in FY24, driven primarily by finished goods build-up in the ambient grocery category.',
    complication: 'Excess stock is concentrated in 3 SKUs that account for 61% of overstock value. Replenishment triggers are set to static reorder points last reviewed in 2021, which no longer reflect seasonal demand patterns post-COVID.',
    implication: 'At current carrying costs (2.8% of inventory value per month), the €4.2M overstock is costing the business approximately €118K/month in financing and storage. Additionally, excess stock crowds out faster-moving lines, degrading overall distribution centre efficiency.',
    recommendation: 'Implement demand-sensing replenishment for top 50 SKUs (covers 78% of overstock value) using a rolling 13-week sell-through signal. Target: reduce overstock to <€1.5M within 6 months.',
    evidence: ['Inventory turnover: 5.8x (benchmark: 8.6x)', 'Overstock value: €4.2M', 'Top 3 SKUs: 61% of overstock', 'Carrying cost: 2.8%/month'],
    priority: 'critical',
    status: 'approved',
    owner: 'James Chen',
    createdAt: '2025-10-14',
    updatedAt: '2025-10-21',
  },
  {
    id: 'f-002',
    engagementId: 'eng-001',
    workstream: 'Supply Chain',
    headline: 'Forecast accuracy at 61% — 22pp below top-quartile peers, driving €8.5M lost revenue',
    situation: 'Hartley\'s demand forecast accuracy (measured at SKU-week level) has deteriorated from 74% in FY22 to 61% in FY24. The decline correlates with the removal of the dedicated demand planner role in the 2023 restructuring.',
    complication: 'The current forecasting process relies on a 3-month rolling average in SAP with no promotional lift adjustment. Promotional events (which account for 38% of volume) are not modelled, causing systematic under-stocking during promotional windows and over-stocking post-promotion.',
    implication: 'Lost revenue from promotional stockouts is estimated at €8.5M annually (6.2% of total revenue). Each stockout event also carries a secondary cost: 74% of stockout occasions result in permanent brand switching per consumer research.',
    recommendation: 'Integrate promotional calendar into SAP APO demand plan. Deploy ML-based promotional lift model (vendor shortlist: o9, Anaplan, Blue Yonder). Quick win: manually flag next 8 weeks of promotions in current system while tech procurement proceeds.',
    evidence: ['Forecast accuracy: 61% (top quartile: 83%)', 'Promotional volume share: 38%', 'Lost revenue estimate: €8.5M', 'Brand switching rate post-stockout: 74%'],
    priority: 'critical',
    status: 'in_review',
    owner: 'Sarah Mitchell',
    createdAt: '2025-10-17',
    updatedAt: '2025-10-22',
  },
  {
    id: 'f-003',
    engagementId: 'eng-001',
    workstream: 'Commercial',
    headline: 'Market share declining 1.4pp YoY in ambient grocery — below-benchmark pricing intelligence',
    situation: 'Hartley\'s ambient grocery market share has declined from 16.1% to 14.7% over the past 12 months. The decline is concentrated in the 400g-800g pack format which accounts for 52% of category volume.',
    complication: 'Competitor price elasticity analysis shows Hartley is priced 8-12% above private label alternatives in the mid-range tier, without a meaningful quality perception premium. The pricing strategy has not been reviewed since 2022.',
    implication: 'Each 1pp of market share lost represents approximately €3.1M in annualised revenue. Continued decline at current rate suggests a further 0.8-1.2pp loss in the next 12 months without intervention.',
    recommendation: 'Conduct a full pricing architecture review for the 400g-800g format range. Evaluate a value-bridge campaign to justify premium positioning or a targeted promotional price investment in key retail accounts.',
    evidence: ['Market share: 14.7% (was 16.1%)', 'Price premium vs. private label: 8-12%', '1pp share = €3.1M revenue', 'Decline concentrated in 400g-800g pack'],
    priority: 'high',
    status: 'draft',
    owner: 'James Chen',
    createdAt: '2025-10-20',
    updatedAt: '2025-10-20',
  },
  {
    id: 'f-004',
    engagementId: 'eng-001',
    workstream: 'Operations',
    headline: 'Distribution centre utilisation at 94% — headroom exhausted, £1.8M capex decision required',
    situation: 'The Northampton DC is operating at 94% utilisation. Industry norms suggest optimal utilisation sits at 80-85% to preserve pick-path efficiency and handle inbound surge capacity.',
    complication: 'At projected volume growth (4.2% p.a.), the DC will breach 100% practical capacity within 7-9 months. Overflow to 3PL providers is already occurring on an ad hoc basis at a 34% cost premium to own-facility cost.',
    implication: 'A decision on capacity expansion (est. £1.8M capex for a new pick module) or 3PL overflow strategy must be made within 60 days to avoid service disruption. Delayed decision risk: 3PL spot rates in Q1 2026 are forecast to increase 12-18%.',
    recommendation: 'Commission a 3-scenario capacity model (expand own DC / hybrid 3PL / full outsource). Recommend decision gate at next steering committee (Nov 8).',
    evidence: ['DC utilisation: 94% (optimal: 80-85%)', '3PL overflow cost premium: 34%', 'Volume CAGR: 4.2%', 'Capacity breach forecast: 7-9 months'],
    priority: 'high',
    status: 'approved',
    owner: 'David Park',
    createdAt: '2025-10-15',
    updatedAt: '2025-10-23',
  },
];

const meridianFindings: Finding[] = [
  {
    id: 'f-005',
    engagementId: 'eng-002',
    workstream: 'Clinical Operations',
    headline: '30-day readmission rate at 14.2% — 2.1pp above NHSI benchmark, £3.8M annual excess cost',
    situation: 'St. Meridian\'s 30-day unplanned readmission rate stands at 14.2%, compared to the NHS England benchmark of 12.1%. The gap has remained consistent over 3 years, suggesting a structural rather than episodic cause.',
    complication: 'Root cause analysis across 847 readmission cases shows 63% were clinically avoidable. The primary driver is inadequate discharge planning: 71% of readmitted patients had no documented follow-up appointment at time of discharge, and 58% reported they did not understand their medication regime.',
    implication: 'Each avoidable readmission costs the Trust approximately £2,800 in direct care costs. The 2.1pp gap translates to ~1,350 excess readmissions per year and £3.8M in avoidable spend that could be reinvested in elective backlog reduction.',
    recommendation: 'Implement a structured discharge bundle (SAFER framework) across all acute wards. Pilot in Cardiology and Respiratory (highest readmission rate wards) targeting a 30% reduction in avoidable readmissions within 6 months.',
    evidence: ['Readmission rate: 14.2% (benchmark: 12.1%)', '63% clinically avoidable', '71% no discharge follow-up', 'Cost per readmission: £2,800'],
    priority: 'critical',
    status: 'presented',
    owner: 'Priya Sharma',
    createdAt: '2025-09-08',
    updatedAt: '2025-10-18',
  },
  {
    id: 'f-006',
    engagementId: 'eng-002',
    workstream: 'Theatre & Elective',
    headline: 'Operating theatre utilisation at 68% — £5.2M unrealised capacity vs. top-quartile trusts',
    situation: 'Meridian\'s 12 operating theatres achieve an average utilisation of 68% against a top-quartile NHS benchmark of 82%. Productive list time (patient on table) averages 312 minutes per session against a possible 420 minutes.',
    complication: 'The primary utilisation loss drivers are: late first case starts (average 23-minute delay vs. 5-minute target) accounting for 38% of lost time; over-running cases not escalated for list adjustment (29%); and cancellations on the day due to bed availability (33%).',
    implication: 'Recovering 10 percentage points of utilisation would generate approximately 1,840 additional procedure slots per year — directly addressing the Trust\'s 18-week RTT backlog of 2,200 patients, while generating an estimated £5.2M in additional income.',
    recommendation: 'Establish a Theatre Efficiency Programme: (1) mandatory first-case checklist with 7:45am patient-in-anaesthetic-room target; (2) dedicated bed manager liaison with theatre coordinator; (3) session booking reform to match case complexity to list length.',
    evidence: ['Theatre utilisation: 68% (top quartile: 82%)', 'Late first case: avg 23-min delay', 'RTT backlog: 2,200 patients', 'Value of 10pp recovery: £5.2M'],
    priority: 'critical',
    status: 'approved',
    owner: 'James Chen',
    createdAt: '2025-09-12',
    updatedAt: '2025-10-20',
  },
  {
    id: 'f-007',
    engagementId: 'eng-002',
    workstream: 'Finance',
    headline: 'Agency staff spend 28% above peer group average — £4.1M overspend driven by poor rota planning',
    situation: 'The Trust\'s agency and bank staff expenditure totalled £18.7M in FY24, representing 28% above the NHS peer group average of £14.6M for trusts of comparable size and complexity.',
    complication: 'Analysis of agency bookings shows 67% are made with less than 48 hours\' notice, attracting premium rates. The premium for sub-48-hour bookings averages 42% above the NHS agency cap framework price. Rota vacancy is highest in Band 5-6 nursing (ICU and Medical wards).',
    implication: 'The £4.1M overspend directly reduces capital allocation for digital and infrastructure investment. If agency dependency is not addressed, the Trust will breach its agency cap target for the third consecutive year, triggering NHS England performance monitoring.',
    recommendation: 'Launch a Workforce Efficiency Programme: (1) rolling 6-week rota publication for all acute wards; (2) tiered bank staff incentive to fill vacancies >7 days in advance; (3) targeted Band 5 permanent recruitment campaign (20 WTE target for H1 2026).',
    evidence: ['Agency spend: £18.7M (peer avg: £14.6M)', '67% bookings <48hrs notice', '42% premium for sub-48hr bookings', 'Overspend vs peers: £4.1M'],
    priority: 'high',
    status: 'in_review',
    owner: 'Priya Sharma',
    createdAt: '2025-09-20',
    updatedAt: '2025-10-22',
  },
];

const vantageFindings: Finding[] = [
  {
    id: 'f-008',
    engagementId: 'eng-003',
    workstream: 'Risk & Credit',
    headline: 'NPA ratio at 4.8% — 1.4pp above RBI benchmark, ₹620 Cr provisioning gap identified',
    situation: 'Vantage Capital\'s gross NPA ratio has increased from 3.4% in FY22 to 4.8% in H1 FY25, driven primarily by deterioration in the MSME lending portfolio. The ratio now exceeds the RBI prudential norm of 3.4% for Category B banks.',
    complication: 'Deep-dive into 240 NPA cases (covering 74% of gross NPA value) reveals that 58% showed at least 2 early-warning signals (90+ DPD, cheque bounce, declining turnover) 6-9 months before NPA classification. These signals were available in the core banking system but not systematically monitored.',
    implication: 'The provisioning gap of ₹620 Cr represents a direct P&L charge that, if recognised in FY25, would reduce reported PAT by 31%. More critically, continued NPA growth risks triggering RBI corrective action under PCA framework if the ratio breaches 6%.',
    recommendation: 'Implement an automated early-warning system (EWS) drawing on 8 leading indicators already available in Finacle. Target: identify 80% of future NPAs 6+ months before classification, enabling proactive restructuring.',
    evidence: ['Gross NPA: 4.8% (RBI norm: 3.4%)', 'EWS signals present in 58% of cases', 'Provisioning gap: ₹620 Cr', 'PAT impact if recognised: -31%'],
    priority: 'critical',
    status: 'in_review',
    owner: 'Arjun Mehta',
    createdAt: '2025-10-28',
    updatedAt: '2025-11-02',
  },
  {
    id: 'f-009',
    engagementId: 'eng-003',
    workstream: 'Digital & Retail',
    headline: 'Digital adoption at 34% — 28pp below top-quartile peers, limiting cost-income improvement',
    situation: 'Only 34% of Vantage\'s retail customer base uses the mobile or internet banking platform for their primary transactions. The industry top quartile for comparable banks stands at 62%.',
    complication: 'Customer research (n=420) identifies three primary barriers: app crash rate of 8.4% per session (industry benchmark: <1%); limited functionality (NEFT/RTGS not available on mobile); and low digital literacy among the 45-60 age segment (42% of the customer base).',
    implication: 'Each digital transaction costs ₹2 vs ₹48 for a branch transaction. Closing half the adoption gap (17pp uplift) would shift approximately 2.8M annual transactions to digital, reducing cost-to-serve by an estimated ₹128 Cr per year.',
    recommendation: 'Prioritise mobile app stability (reduce crash rate to <2% within 90 days) and add NEFT/RTGS functionality (Q1 FY26). Launch assisted digital adoption programme at 12 high-footfall branches targeting 45+ age segment.',
    evidence: ['Digital adoption: 34% (top quartile: 62%)', 'App crash rate: 8.4% (benchmark: <1%)', 'Digital cost per txn: ₹2 vs ₹48 branch', 'Potential saving from 17pp uplift: ₹128 Cr/yr'],
    priority: 'high',
    status: 'draft',
    owner: 'James Chen',
    createdAt: '2025-10-30',
    updatedAt: '2025-10-30',
  },
  {
    id: 'f-010',
    engagementId: 'eng-003',
    workstream: 'Risk & Credit',
    headline: 'Cost-to-income ratio at 58.4% — 6pp above peer median, driven by branch network over-capacity',
    situation: 'Vantage\'s cost-to-income ratio of 58.4% compares unfavourably to the peer median of 52.3%. The gap has widened by 2pp over the past 2 years as revenue growth has lagged cost inflation.',
    complication: 'Branch network analysis shows 23 of 84 branches (27%) are operating below the minimum viable transaction threshold of 180 transactions/day. These branches account for 31% of total branch opex (£4.2M) while generating only 9% of branch-originated revenue.',
    implication: 'Consolidating or converting the 23 underperforming branches to digital-assist format could reduce branch opex by £2.8-3.4M annually, improving the cost-to-income ratio by approximately 2.1-2.6pp — recovering roughly a third of the peer gap.',
    recommendation: 'Commission a full branch rationalisation study with customer migration impact modelling. Recommend a phased consolidation of 8-10 lowest-performing branches in FY26, with reinvestment of £0.8M savings into digital adoption programme.',
    evidence: ['C/I ratio: 58.4% (peer median: 52.3%)', '23/84 branches below viability threshold', 'Underperforming branches: 31% of opex, 9% of revenue', 'Potential opex saving: £2.8-3.4M'],
    priority: 'medium',
    status: 'draft',
    owner: 'Arjun Mehta',
    createdAt: '2025-11-01',
    updatedAt: '2025-11-01',
  },
];

// ─── Engagements ──────────────────────────────────────────────────────────────

export const MOCK_ENGAGEMENTS: Engagement[] = [
  {
    id: 'eng-001',
    code: '25-FMCG-0142',
    client: 'Hartley Foods',
    industry: 'fmcg',
    industryLabel: 'FMCG',
    description: 'End-to-end supply chain optimisation and commercial strategy review',
    phase: 'analysis',
    phases: [
      { id: 'kickoff', label: 'Kick-off', status: 'done', week: 'Wk 1' },
      { id: 'discovery', label: 'Discovery', status: 'done', week: 'Wk 2-4' },
      { id: 'analysis', label: 'Analysis', status: 'active', week: 'Wk 5-8' },
      { id: 'recommendations', label: 'Recommendations', status: 'pending', week: 'Wk 9-10' },
      { id: 'delivery', label: 'Delivery', status: 'pending', week: 'Wk 11-12' },
    ],
    startDate: '2025-09-29',
    endDate: '2025-12-19',
    weekCurrent: 6,
    weekTotal: 12,
    team: [
      { name: 'James Chen', initials: 'JC', role: 'Engagement Manager' },
      { name: 'Sarah Mitchell', initials: 'SM', role: 'Senior Associate' },
      { name: 'David Park', initials: 'DP', role: 'Associate' },
      { name: 'Lena Fischer', initials: 'LF', role: 'Associate' },
      { name: 'Tom Walsh', initials: 'TW', role: 'Partner' },
    ],
    workstreams: [
      { id: 'ws-sc', name: 'Supply Chain', lead: 'Sarah Mitchell', status: 'on_track' },
      { id: 'ws-comm', name: 'Commercial', lead: 'James Chen', status: 'on_track' },
      { id: 'ws-ops', name: 'Operations', lead: 'David Park', status: 'at_risk' },
    ],
    deliverables: [
      { id: 'd-001', title: 'Diagnostic Report', type: 'report', dueDate: '2025-11-07', status: 'in_review', owner: 'James Chen' },
      { id: 'd-002', title: 'SC Optimisation Model', type: 'model', dueDate: '2025-11-14', status: 'in_progress', owner: 'Sarah Mitchell' },
      { id: 'd-003', title: 'Steering Committee Deck (Wk 8)', type: 'presentation', dueDate: '2025-11-21', status: 'not_started', owner: 'James Chen' },
      { id: 'd-004', title: 'Recommendations Report', type: 'report', dueDate: '2025-12-05', status: 'not_started', owner: 'James Chen' },
      { id: 'd-005', title: 'Final Delivery Presentation', type: 'presentation', dueDate: '2025-12-17', status: 'not_started', owner: 'Tom Walsh' },
    ],
    findings: hartleyFindings,
  },
  {
    id: 'eng-002',
    code: '25-HLTH-0089',
    client: 'St. Meridian NHS Trust',
    industry: 'healthcare',
    industryLabel: 'Healthcare',
    description: 'Operational excellence programme — patient flow, theatre efficiency & workforce',
    phase: 'recommendations',
    phases: [
      { id: 'kickoff', label: 'Kick-off', status: 'done', week: 'Wk 1' },
      { id: 'discovery', label: 'Discovery', status: 'done', week: 'Wk 2-3' },
      { id: 'analysis', label: 'Analysis', status: 'done', week: 'Wk 4-7' },
      { id: 'recommendations', label: 'Recommendations', status: 'active', week: 'Wk 8-10' },
      { id: 'delivery', label: 'Delivery', status: 'pending', week: 'Wk 11-12' },
    ],
    startDate: '2025-09-01',
    endDate: '2025-11-28',
    weekCurrent: 9,
    weekTotal: 12,
    team: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Engagement Manager' },
      { name: 'James Chen', initials: 'JC', role: 'Senior Associate' },
      { name: 'Olivia Grant', initials: 'OG', role: 'Associate' },
      { name: 'Marcus Reed', initials: 'MR', role: 'Partner' },
    ],
    workstreams: [
      { id: 'ws-clin', name: 'Clinical Operations', lead: 'Priya Sharma', status: 'on_track' },
      { id: 'ws-theatre', name: 'Theatre & Elective', lead: 'James Chen', status: 'on_track' },
      { id: 'ws-fin', name: 'Finance', lead: 'Olivia Grant', status: 'at_risk' },
    ],
    deliverables: [
      { id: 'd-006', title: 'Baseline Assessment', type: 'report', dueDate: '2025-10-03', status: 'delivered', owner: 'Priya Sharma' },
      { id: 'd-007', title: 'Theatre Efficiency Analysis', type: 'analysis', dueDate: '2025-10-24', status: 'delivered', owner: 'James Chen' },
      { id: 'd-008', title: 'Recommendations Deck', type: 'presentation', dueDate: '2025-11-08', status: 'in_review', owner: 'Priya Sharma' },
      { id: 'd-009', title: 'Implementation Roadmap', type: 'report', dueDate: '2025-11-21', status: 'in_progress', owner: 'Priya Sharma' },
      { id: 'd-010', title: 'Executive Summary Report', type: 'report', dueDate: '2025-11-28', status: 'not_started', owner: 'Marcus Reed' },
    ],
    findings: meridianFindings,
  },
  {
    id: 'eng-003',
    code: '25-BANK-0231',
    client: 'Vantage Capital Group',
    industry: 'banking',
    industryLabel: 'Banking',
    description: 'NPA reduction strategy, digital adoption acceleration & cost optimisation',
    phase: 'discovery',
    phases: [
      { id: 'kickoff', label: 'Kick-off', status: 'done', week: 'Wk 1' },
      { id: 'discovery', label: 'Discovery', status: 'active', week: 'Wk 2-4' },
      { id: 'analysis', label: 'Analysis', status: 'pending', week: 'Wk 5-6' },
      { id: 'recommendations', label: 'Recommendations', status: 'pending', week: 'Wk 7' },
      { id: 'delivery', label: 'Delivery', status: 'pending', week: 'Wk 8' },
    ],
    startDate: '2025-10-20',
    endDate: '2025-12-12',
    weekCurrent: 3,
    weekTotal: 8,
    team: [
      { name: 'Arjun Mehta', initials: 'AM', role: 'Engagement Manager' },
      { name: 'James Chen', initials: 'JC', role: 'Senior Associate' },
      { name: 'Nina Kovacs', initials: 'NK', role: 'Associate' },
      { name: 'Rachel Torres', initials: 'RT', role: 'Partner' },
    ],
    workstreams: [
      { id: 'ws-risk', name: 'Risk & Credit', lead: 'Arjun Mehta', status: 'on_track' },
      { id: 'ws-digital', name: 'Digital & Retail', lead: 'James Chen', status: 'on_track' },
    ],
    deliverables: [
      { id: 'd-011', title: 'Kick-off Deck & Project Charter', type: 'presentation', dueDate: '2025-10-24', status: 'delivered', owner: 'Arjun Mehta' },
      { id: 'd-012', title: 'NPA Deep-Dive Analysis', type: 'analysis', dueDate: '2025-11-07', status: 'in_progress', owner: 'Arjun Mehta' },
      { id: 'd-013', title: 'Digital Adoption Diagnostic', type: 'analysis', dueDate: '2025-11-14', status: 'in_progress', owner: 'James Chen' },
      { id: 'd-014', title: 'Interim Progress Review', type: 'presentation', dueDate: '2025-11-21', status: 'not_started', owner: 'Arjun Mehta' },
      { id: 'd-015', title: 'Final Recommendations & Roadmap', type: 'report', dueDate: '2025-12-10', status: 'not_started', owner: 'Rachel Torres' },
    ],
    findings: vantageFindings,
  },
];

export const ALL_FINDINGS: Finding[] = MOCK_ENGAGEMENTS.flatMap((e) => e.findings);

export function getEngagement(id: string): Engagement | undefined {
  return MOCK_ENGAGEMENTS.find((e) => e.id === id);
}

export function getFindingsByEngagement(engagementId: string): Finding[] {
  return ALL_FINDINGS.filter((f) => f.engagementId === engagementId);
}

export const PHASE_ORDER: EngagementPhase[] = [
  'kickoff', 'discovery', 'analysis', 'recommendations', 'delivery',
];

export const PRIORITY_CONFIG: Record<FindingPriority, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  high:     { label: 'High',     color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  medium:   { label: 'Medium',   color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  low:      { label: 'Low',      color: 'text-slate-400', bg: 'bg-slate-700/20', border: 'border-slate-600/30' },
};

export const STATUS_CONFIG: Record<FindingStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: 'text-slate-400', bg: 'bg-slate-700/40' },
  in_review: { label: 'In Review', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  approved:  { label: 'Approved',  color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  presented: { label: 'Presented', color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
};

export const DELIVERABLE_STATUS_CONFIG: Record<DeliverableStatus, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: 'text-slate-500', bg: 'bg-slate-700/30' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  in_review:   { label: 'In Review',   color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
  delivered:   { label: 'Delivered',   color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
};

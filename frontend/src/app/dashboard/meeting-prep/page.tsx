'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, ChevronRight, Zap, MessageSquare,
  BarChart2, CheckSquare, HelpCircle, Download, Loader2,
  Users, AlertTriangle, TrendingUp, FileText, RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MOCK_ENGAGEMENTS,
  PRIORITY_CONFIG,
  type Engagement,
  type Finding,
} from '@/lib/data/mockEngagements';

type MeetingType = 'steering' | 'progress' | 'workshop' | 'kickoff' | 'adhoc';

const MEETING_TYPES: { id: MeetingType; label: string; description: string }[] = [
  { id: 'steering',  label: 'Steering Committee',  description: 'Executive sponsor + workstream leads' },
  { id: 'progress',  label: 'Progress Review',      description: 'Weekly team + client check-in' },
  { id: 'workshop',  label: 'Client Workshop',       description: 'Working session / hypothesis validation' },
  { id: 'kickoff',   label: 'Kick-off',              description: 'Engagement launch meeting' },
  { id: 'adhoc',     label: 'Ad hoc',                description: 'Impromptu / escalation call' },
];

const KPI_SNAPSHOTS: Record<string, { label: string; value: string; vs: string; trend: 'up' | 'down'; positive: boolean }[]> = {
  'eng-001': [
    { label: 'Inventory Turnover', value: '5.8x', vs: 'vs 8.6x benchmark', trend: 'down', positive: false },
    { label: 'Forecast Accuracy', value: '61%', vs: 'vs 83% top quartile', trend: 'down', positive: false },
    { label: 'Market Share', value: '14.7%', vs: '-1.4pp YoY', trend: 'down', positive: false },
  ],
  'eng-002': [
    { label: '30-Day Readmission', value: '14.2%', vs: 'vs 12.1% NHSI benchmark', trend: 'up', positive: false },
    { label: 'Theatre Utilisation', value: '68%', vs: 'vs 82% top quartile', trend: 'down', positive: false },
    { label: 'Agency Staff Spend', value: '£18.7M', vs: '+28% vs peer group', trend: 'up', positive: false },
  ],
  'eng-003': [
    { label: 'Gross NPA Ratio', value: '4.8%', vs: 'vs 3.4% RBI norm', trend: 'up', positive: false },
    { label: 'Digital Adoption', value: '34%', vs: 'vs 62% top quartile', trend: 'up', positive: true },
    { label: 'Cost-to-Income', value: '58.4%', vs: 'vs 52.3% peer median', trend: 'up', positive: false },
  ],
};

const MEETING_CONTENT: Record<string, Record<MeetingType, {
  situation: string;
  keyMessages: string[];
  openItems: string[];
  probeQuestions: string[];
}>> = {
  'eng-001': {
    steering: {
      situation: 'Hartley Foods engagement (25-FMCG-0142) is in Week 6 of 12. Analysis phase is on track. Two workstreams (Supply Chain, Commercial) are progressing to plan; Operations is flagged at-risk due to delayed DC capacity data from the client.',
      keyMessages: [
        'Inventory turnover gap (32% below benchmark) and forecast accuracy deterioration together represent a quantified working capital and revenue impact of €12.7M — this should be the primary focus for the steering committee.',
        'The DC capacity decision (£1.8M capex or 3PL overflow) is time-sensitive: a 60-day decision window exists before Q1 2026 3PL spot rates increase 12-18%.',
        'Recommendations are on track for delivery in Week 9. A pre-read draft will be shared with the client CFO by Friday for alignment before the formal presentation.',
      ],
      openItems: [
        'DC utilisation data for Northampton site (requested 3 weeks ago — follow up with Ops Director)',
        'Approval to access SAP transactional data for 36-month demand history',
        'Client sign-off on commercial interview schedule for weeks 7-8',
        'Confirm attendees for Recommendations steering committee (target: Nov 21)',
      ],
      probeQuestions: [
        'What is the Board\'s appetite for the DC capex decision — is there a capital freeze for H2?',
        'Has the promotional planning calendar for Q1 2026 been finalised? We need it to model forecast lift adjustments.',
        'Are there any upcoming supplier renegotiations that would affect replenishment lead times?',
        'What is the CEO\'s view on the market share decline — is there a defensive response already planned?',
      ],
    },
    progress: {
      situation: 'Week 6 check-in for Hartley Foods. Supply Chain and Commercial workstreams on track. Operations workstream at risk — DC utilisation data still outstanding.',
      keyMessages: [
        'Supply Chain analysis complete: 4 findings drafted, 2 approved. Headline finding on inventory turnover now has full supporting evidence.',
        'Commercial team completed 8 of 12 stakeholder interviews. Pricing architecture analysis in progress.',
        'Need client action on DC data access — without it, the Operations workstream will not meet its Week 8 deadline.',
      ],
      openItems: [
        'DC utilisation data from Ops Director (critical path)',
        'Interview schedule for last 4 commercial stakeholders',
        'Clarification on SKU rationalisation history (2022-2024)',
      ],
      probeQuestions: [
        'Can we get a direct introduction to the DC General Manager to unblock the data request?',
        'Is there any internal analysis already done on the pricing architecture we can build from?',
        'Are there any board-level sensitivities we should be aware of before we finalise the market share finding?',
      ],
    },
    workshop: {
      situation: 'This working session is to validate hypothesis H3 (forecast accuracy root cause) and H5 (SKU rationalisation opportunity) with the Hartley demand planning and commercial teams.',
      keyMessages: [
        'Hypothesis H3 (promotional lift not modelled in SAP APO) is supported by data — 38% of volume is promotional with zero lift adjustment in current demand plan.',
        'Hypothesis H5 (long tail SKUs driving inventory complexity) is partially supported — bottom 20% of SKUs by revenue account for 41% of DC pick lines.',
        'We need client input on promotional calendar access and SKU exit decision authority before we can size the opportunity.',
      ],
      openItems: [
        'Validate: who owns the demand plan in the new org structure?',
        'Confirm: what is the process for SKU exit decisions — is it category-led or central?',
        'Share: promotional calendar for next 6 months',
      ],
      probeQuestions: [
        'How are promotional events currently communicated to the demand planning team, and how far in advance?',
        'What happened to the 2023 SKU rationalisation programme — why was it paused?',
        'Which 3 SKUs would the sales team most resist exiting, and why?',
      ],
    },
    kickoff: {
      situation: 'This is the engagement kick-off meeting for 25-FMCG-0142. The project scope covers supply chain optimisation and commercial strategy for Hartley Foods over 12 weeks.',
      keyMessages: [
        'We will focus on four workstreams: Supply Chain efficiency, Commercial strategy, Operations, and a cross-cutting digital enablement thread.',
        'Our target outcome: a prioritised, costed transformation roadmap with at least 3 quick wins implementable in 90 days.',
        'We need full data access within the first 2 weeks — the project manager will share the data request list by end of day today.',
      ],
      openItems: [
        'Confirm workstream leads from client side',
        'Share data access request list',
        'Agree weekly progress review cadence and attendees',
        'Confirm steering committee date for Week 4 interim review',
      ],
      probeQuestions: [
        'What are the top 2-3 outcomes you personally want from this engagement?',
        'Are there any topics that are politically sensitive or off-limits at this stage?',
        'Who on the client team will be our primary day-to-day contact?',
        'Are there any parallel workstreams or board initiatives we should be aware of?',
      ],
    },
    adhoc: {
      situation: 'Ad hoc call for Hartley Foods engagement. Current status: Week 6 of 12, analysis phase. Operations workstream is at risk.',
      keyMessages: [
        'Key concern: DC utilisation data is 3 weeks overdue — this is now on the critical path.',
        'Two critical findings approved and ready for steering committee; two more in review.',
        'No material scope changes or budget issues at this stage.',
      ],
      openItems: [
        'Escalate DC data request to engagement sponsor',
        'Confirm revised timeline if data delayed beyond this week',
      ],
      probeQuestions: [
        'What is blocking the DC data release — is this a system access issue or an internal approval issue?',
        'Do you need us to adjust scope or timeline given the delay?',
      ],
    },
  },
  'eng-002': {
    steering: {
      situation: 'St. Meridian NHS Trust engagement (25-HLTH-0089) is in Week 9 of 12, Recommendations phase. The Baseline Assessment and Theatre Efficiency Analysis have been delivered. The Recommendations Deck is currently in client review.',
      keyMessages: [
        'The three headline recommendations (readmission reduction, theatre efficiency programme, agency staff rationalisation) together represent a combined annual value opportunity of £13.1M — equivalent to 4.2% of the Trust\'s operating budget.',
        'The SAFER discharge bundle pilot (Cardiology and Respiratory) is ready to launch: sponsor sign-off is the only outstanding gate.',
        'Agency staff overspend will breach NHS England\'s PCA threshold if not addressed in FY25 — this requires a Board-level decision within the next 30 days.',
      ],
      openItems: [
        'Board sign-off on SAFER discharge bundle pilot (Cardiology + Respiratory)',
        'HR Director input on Band 5 permanent recruitment campaign',
        'Finance Director sign-off on theatre efficiency programme budget (est. £180K implementation cost)',
        'Confirm Implementation Roadmap review date with CEO',
      ],
      probeQuestions: [
        'Is the Board aligned on the agency staff target — is there appetite for the 20-WTE permanent recruitment plan?',
        'What is the Trust\'s appetite for the theatre session booking reform — which clinical leads need to be engaged?',
        'Are there any CQC or NHSI visits planned in the next 3 months that would affect implementation timing?',
        'Has the CFO reviewed the £13.1M opportunity sizing — are there any challenges to the methodology?',
      ],
    },
    progress: {
      situation: 'Week 9 progress review for St. Meridian. Recommendations phase. Deck in client review, roadmap in progress.',
      keyMessages: [
        'Recommendations Deck submitted for review — awaiting Medical Director and CFO feedback.',
        'Implementation Roadmap on track for delivery by Nov 21.',
        'Finance workstream (agency staff) flagged at risk — HR data for Band 5 vacancy analysis still outstanding.',
      ],
      openItems: [
        'Medical Director feedback on SAFER bundle recommendation',
        'HR vacancy data for Band 5 nursing (ICU + Medical)',
        'Confirm steering committee attendee list for Nov 8',
      ],
      probeQuestions: [
        'Has the Medical Director had a chance to review the discharge bundle recommendation?',
        'Can we access the e-rostering system data for the agency analysis?',
        'Is the CEO planning to be at the steering committee on Nov 8?',
      ],
    },
    workshop: {
      situation: 'Working session to co-design the Theatre Efficiency Programme implementation plan with Theatre Manager, Anaesthetics Lead, and Bed Management team.',
      keyMessages: [
        'Data shows first-case delays are the single biggest driver of utilisation loss — 38% of total time lost. A 7:45am patient-in-theatre target is achievable with process change only, no capital required.',
        'Day-of-surgery cancellations (33% of utilisation loss) are primarily a bed management coordination issue, not a clinical issue.',
        'We will leave today with an agreed 90-day implementation plan and named owner for each action.',
      ],
      openItems: [
        'Agree first-case start time target and measurement approach',
        'Confirm bed management liaison arrangement for theatre coordination',
        'Identify champion clinician for the efficiency programme',
      ],
      probeQuestions: [
        'What has been tried before to address first-case delays — why didn\'t it stick?',
        'Who has the authority to enforce the 7:45am target — is this a clinical director decision or a theatre manager decision?',
        'Which surgeons are most supportive of the efficiency programme — and which are most resistant?',
      ],
    },
    kickoff: {
      situation: 'Kick-off for St. Meridian NHS Trust Operational Excellence Programme (25-HLTH-0089). The engagement covers patient flow, theatre efficiency, and workforce optimisation over 12 weeks.',
      keyMessages: [
        'Three workstreams will run in parallel: Clinical Operations, Theatre & Elective, and Finance.',
        'We will produce a Baseline Assessment in Week 3, followed by a detailed analysis phase culminating in a full Recommendations Deck in Week 9.',
        'Immediate priority: access to PAS, e-rostering, theatre scheduling, and finance systems within the first week.',
      ],
      openItems: [
        'Confirm workstream clinical leads from Trust side',
        'Data access request sign-off by CIO',
        'Agree project governance (steering committee cadence, escalation route)',
      ],
      probeQuestions: [
        'What are your top 2 priorities for this engagement — what would make it a success in your view?',
        'Are there any areas of the organisation where we should tread carefully?',
        'Has the Trust done similar work before — what worked and what didn\'t?',
      ],
    },
    adhoc: {
      situation: 'Ad hoc call — Recommendations Deck review in progress. Finance workstream at risk due to HR data gap.',
      keyMessages: [
        'Recommendations Deck is with Medical Director and CFO for review.',
        'Finance workstream will miss its deadline if Band 5 HR data not received by Friday.',
        'No other critical path issues at this stage.',
      ],
      openItems: [
        'Escalate HR data request to HR Director',
        'Confirm CFO review timeline for Recommendations Deck',
      ],
      probeQuestions: [
        'Is there a way to access the Band 5 vacancy data directly from e-rostering rather than via HR?',
        'Has the CFO flagged any concerns about the agency spend sizing methodology?',
      ],
    },
  },
  'eng-003': {
    steering: {
      situation: 'Vantage Capital Group engagement (25-BANK-0231) is in Week 3 of 8, Discovery phase. NPA Deep-Dive and Digital Adoption Diagnostic are both in progress. Initial findings are emerging.',
      keyMessages: [
        'Preliminary NPA analysis identifies a ₹620 Cr provisioning gap — this is a board-level disclosure risk that should be flagged to the Audit Committee before we complete the full analysis.',
        'Digital adoption gap (28pp below top quartile) has a clear and actionable root cause: app stability and missing NEFT/RTGS functionality. These are fixable within 90 days.',
        'Early EWS findings are highly actionable — 58% of existing NPAs showed detectable signals 6-9 months before classification. A quick-win alert model is feasible with existing Finacle data.',
      ],
      openItems: [
        'Audit Committee notification process for provisioning gap finding — agree with CFO and General Counsel',
        'CTO access to Finacle data warehouse for NPA signal extraction',
        'Approval for customer research phase (420 interviews for digital adoption diagnostic)',
        'Confirm Interim Progress Review attendees for Nov 21',
      ],
      probeQuestions: [
        'Is the Board aware of the trajectory on NPA — has the provisioning gap been discussed at Audit Committee level?',
        'What is the technology investment appetite for the EWS system — is there budget in FY26?',
        'Has the CTO reviewed the app stability issues — are they aware of the 8.4% crash rate?',
        'Is there regulatory pressure from RBI that is adding urgency to the NPA reduction?',
      ],
    },
    progress: {
      situation: 'Week 3 progress review for Vantage Capital. Discovery phase. NPA and digital diagnostics in progress.',
      keyMessages: [
        'NPA deep-dive 60% complete. Provisional finding on provisioning gap emerging — need to confirm methodology with client CFO before finalising.',
        'Digital adoption diagnostic: customer research interviews underway (180 of 420 complete).',
        'Both workstreams on track for Interim Review on Nov 21.',
      ],
      openItems: [
        'CFO review of provisional NPA provisioning methodology',
        'CTO input on app crash rate root cause',
        'Remaining 240 customer interviews to be completed by Nov 14',
      ],
      probeQuestions: [
        'Has the CFO reviewed the NPA sizing methodology — any pushback on the approach?',
        'Can we get a technical deep-dive with the digital team on the app crash root cause?',
        'Are there any regulatory deadlines that should influence our timeline?',
      ],
    },
    workshop: {
      situation: 'Working session with Vantage Risk & Credit team to validate the Early Warning System (EWS) design and agree the 8 leading indicators for the model.',
      keyMessages: [
        'Analysis of 240 NPA cases confirms 8 candidate EWS indicators are available in Finacle with 6-9 month lead time.',
        'The proposed trigger logic (2+ indicators flagging simultaneously) achieves 78% sensitivity with 12% false positive rate — acceptable for the credit team\'s workflow.',
        'We need the credit team to validate the indicator thresholds and sign off on the alert escalation process.',
      ],
      openItems: [
        'Validate EWS indicator thresholds with Chief Credit Officer',
        'Agree alert escalation process and ownership',
        'Confirm Finacle data extraction capability with CTO team',
      ],
      probeQuestions: [
        'Are any of the 8 proposed indicators not currently captured systematically in Finacle?',
        'What is the credit team\'s capacity to action EWS alerts — do we need to design a triage process?',
        'Has the Risk Committee seen the EWS proposal — is there Board-level support?',
      ],
    },
    kickoff: {
      situation: 'Kick-off for Vantage Capital Group engagement (25-BANK-0231). The engagement covers NPA reduction strategy, digital adoption acceleration, and cost optimisation over 8 weeks.',
      keyMessages: [
        'Two workstreams: Risk & Credit (NPA, provisioning, EWS) and Digital & Retail (adoption, cost-to-income, branch rationalisation).',
        'Given the regulatory sensitivity of the NPA findings, all emerging findings will be reviewed with the CFO before external communication.',
        'Target output: a board-ready NPA reduction roadmap and a prioritised digital acceleration plan.',
      ],
      openItems: [
        'Data access: Finacle warehouse, e-banking analytics platform, branch P&L data',
        'Agree workstream leads from client side (Risk Director, CTO)',
        'Confirm confidentiality protocol for NPA findings',
      ],
      probeQuestions: [
        'What is the RBI\'s current engagement on the NPA position — is there a formal submission deadline?',
        'Are there any recent internal reviews of digital adoption we should build on?',
        'What does success look like for you personally at the end of this 8-week engagement?',
      ],
    },
    adhoc: {
      situation: 'Ad hoc call for Vantage Capital Group. Week 3. Provisional NPA finding on provisioning gap requires urgent CFO discussion.',
      keyMessages: [
        'Provisional analysis suggests a ₹620 Cr provisioning gap — this needs CFO and General Counsel review before we advance.',
        'Digital and cost workstreams are on track — no issues there.',
        'Recommend a dedicated 45-minute session with CFO and GC this week.',
      ],
      openItems: [
        'Schedule CFO + GC session on NPA provisioning gap',
        'Confirm disclosure protocol',
      ],
      probeQuestions: [
        'Has the CFO been briefed informally — what is their initial reaction?',
        'Is there a process for escalating sensitive findings to the Audit Committee during an engagement?',
      ],
    },
  },
};

function KPISnapshotCard({ kpi }: { kpi: { label: string; value: string; vs: string; trend: 'up' | 'down'; positive: boolean } }) {
  const isGood = (kpi.trend === 'up') === kpi.positive;
  return (
    <div className="glass-card rounded-xl p-3">
      <p className="text-xs text-slate-400 mb-1">{kpi.label}</p>
      <p className={cn('text-xl font-bold', isGood ? 'text-emerald-400' : 'text-red-400')}>{kpi.value}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">{kpi.vs}</p>
      <div className={cn('mt-2 h-0.5 rounded-full', isGood ? 'bg-emerald-500/40' : 'bg-red-500/40')} />
    </div>
  );
}

function BriefSection({ icon: Icon, title, color, children }: {
  icon: React.ElementType; title: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('p-1.5 rounded-lg bg-slate-800', color)}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function MeetingPrepPage() {
  const [engagementId, setEngagementId] = useState(MOCK_ENGAGEMENTS[0].id);
  const [meetingType, setMeetingType] = useState<MeetingType>('steering');
  const [generating, setGenerating] = useState(false);
  const [briefGenerated, setBriefGenerated] = useState(false);

  const eng = MOCK_ENGAGEMENTS.find((e) => e.id === engagementId)!;
  const kpis = KPI_SNAPSHOTS[engagementId] || [];
  const content = MEETING_CONTENT[engagementId]?.[meetingType];

  const handleGenerate = () => {
    setBriefGenerated(false);
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setBriefGenerated(true);
    }, 1800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Meeting Prep</h1>
          </div>
          <p className="text-sm text-slate-400">Generate a concise brief before any client meeting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Meeting Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Engagement</label>
                <select
                  className="input-dark w-full text-sm"
                  value={engagementId}
                  onChange={(e) => { setEngagementId(e.target.value); setBriefGenerated(false); }}
                >
                  {MOCK_ENGAGEMENTS.map((e) => (
                    <option key={e.id} value={e.id}>{e.client} — {e.code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Meeting Type</label>
                <div className="space-y-2">
                  {MEETING_TYPES.map((mt) => (
                    <button
                      key={mt.id}
                      onClick={() => { setMeetingType(mt.id); setBriefGenerated(false); }}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border text-xs transition-all',
                        meetingType === mt.id
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-white hover:bg-slate-800',
                      )}
                    >
                      <div className="font-medium">{mt.label}</div>
                      <div className="text-slate-500 mt-0.5">{mt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating brief...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {briefGenerated ? 'Regenerate Brief' : 'Generate Brief'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Engagement context card */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Engagement Status</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Client</span>
                <span className="text-white font-medium">{eng.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Code</span>
                <span className="text-white font-mono">{eng.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phase</span>
                <span className="text-white capitalize">{eng.phase.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Week</span>
                <span className="text-white">{eng.weekCurrent} of {eng.weekTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Critical findings</span>
                <span className="text-red-400 font-medium">
                  {eng.findings.filter((f) => f.priority === 'critical').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deliverables due</span>
                <span className="text-amber-400 font-medium">
                  {eng.deliverables.filter((d) => d.status === 'in_review' || d.status === 'in_progress').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brief panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!briefGenerated && !generating && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center glass-card rounded-xl"
                style={{ minHeight: 420 }}
              >
                <div className="text-center">
                  <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Configure the meeting details and click</p>
                  <p className="text-slate-400 font-medium text-sm">"Generate Brief" to get your prep pack</p>
                </div>
              </motion.div>
            )}

            {generating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center glass-card rounded-xl"
                style={{ minHeight: 420 }}
              >
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Synthesising findings and context...</p>
                </div>
              </motion.div>
            )}

            {briefGenerated && content && (
              <motion.div
                key="brief"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Brief header */}
                <div className="glass-card rounded-xl p-4 border border-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Meeting Brief</p>
                      <h2 className="text-base font-bold text-white">
                        {MEETING_TYPES.find((m) => m.id === meetingType)?.label} — {eng.client}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">{eng.code} · Week {eng.weekCurrent} of {eng.weekTotal}</p>
                    </div>
                    <button className="btn-secondary text-xs flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* Situation */}
                <BriefSection icon={MessageSquare} title="Situation" color="text-cyan-400">
                  <p className="text-sm text-slate-300 leading-relaxed">{content.situation}</p>
                </BriefSection>

                {/* Key messages */}
                <BriefSection icon={Zap} title="Key Messages" color="text-indigo-400">
                  <div className="space-y-2">
                    {content.keyMessages.map((msg, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed">{msg}</p>
                      </div>
                    ))}
                  </div>
                </BriefSection>

                {/* KPI snapshots */}
                <BriefSection icon={BarChart2} title="Data Reference" color="text-emerald-400">
                  <div className="grid grid-cols-3 gap-3">
                    {kpis.map((kpi, i) => <KPISnapshotCard key={i} kpi={kpi} />)}
                  </div>
                </BriefSection>

                {/* Open items */}
                <BriefSection icon={CheckSquare} title="Open Items" color="text-amber-400">
                  <div className="space-y-2">
                    {content.openItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded border-2 border-amber-500/50 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </BriefSection>

                {/* Probe questions */}
                <BriefSection icon={HelpCircle} title="Questions to Probe" color="text-purple-400">
                  <div className="space-y-2">
                    {content.probeQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300">{q}</p>
                      </div>
                    ))}
                  </div>
                </BriefSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

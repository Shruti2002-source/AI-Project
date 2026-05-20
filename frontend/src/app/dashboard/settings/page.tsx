'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Palette, Lock, Database, Zap, ChevronRight,
  Moon, Sun, Monitor, Check, Save, Building2, Mail, Shield,
  Eye, EyeOff, Globe, Download, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'data', label: 'Data & KPIs', icon: Database },
  { id: 'integrations', label: 'Integrations', icon: Zap },
];

const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Best for low-light environments' },
  { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and minimal' },
  { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS preference' },
];

const CHART_PALETTE = [
  { id: 'indigo', label: 'Indigo', primary: '#6366f1', secondary: '#06b6d4' },
  { id: 'emerald', label: 'Emerald', primary: '#10b981', secondary: '#3b82f6' },
  { id: 'violet', label: 'Violet', primary: '#8b5cf6', secondary: '#ec4899' },
  { id: 'amber', label: 'Amber', primary: '#f59e0b', secondary: '#ef4444' },
];

const NOTIFICATION_SETTINGS = [
  { id: 'kpi_alerts', label: 'KPI Threshold Alerts', desc: 'Notify when KPIs breach defined thresholds', defaultOn: true },
  { id: 'benchmark_updates', label: 'Benchmark Updates', desc: 'Alert when industry benchmarks are refreshed', defaultOn: true },
  { id: 'ai_insights', label: 'New AI Insights', desc: 'Notify when AI generates new insights for your data', defaultOn: true },
  { id: 'export_ready', label: 'Export Ready', desc: 'Alert when report exports are complete', defaultOn: true },
  { id: 'weekly_summary', label: 'Weekly Summary', desc: 'Receive a weekly digest of platform activity', defaultOn: false },
  { id: 'product_updates', label: 'Product Updates', desc: 'News about new features and improvements', defaultOn: false },
];

const INTEGRATION_LIST = [
  { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Powers AI insight generation and storyline creation', icon: '🤖', status: 'connected' },
  { id: 'tableau', name: 'Tableau', desc: 'Export dashboards directly to Tableau workbooks', icon: '📊', status: 'not_connected' },
  { id: 'powerbi', name: 'Power BI', desc: 'Sync KPI data to Power BI datasets', icon: '📈', status: 'not_connected' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Pull CRM data for customer KPI mapping', icon: '☁️', status: 'not_connected' },
  { id: 'jira', name: 'Jira', desc: 'Create action items from AI recommendations', icon: '🎯', status: 'not_connected' },
];

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('glass-card rounded-2xl p-6', className)}>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedPalette, setSelectedPalette] = useState('indigo');
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.id, n.defaultOn]))
  );
  const [profile, setProfile] = useState({
    name: 'James Chen',
    email: 'james.chen@mckinsey.com',
    title: 'Senior Consultant',
    organization: 'McKinsey & Company',
    timezone: 'America/New_York',
  });

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle title="Personal Information" subtitle="Your identity on the InsightSynth platform" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Full Name', icon: User },
            { key: 'title', label: 'Job Title', icon: Building2 },
            { key: 'email', label: 'Work Email', icon: Mail },
            { key: 'organization', label: 'Organization', icon: Globe },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs text-slate-400 uppercase tracking-wider">{label}</Label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={profile[key as keyof typeof profile]}
                  onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                  className="pl-9 h-10"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Preferences" subtitle="Regional and display preferences" />
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400 uppercase tracking-wider">Default Industry</Label>
            <div className="flex gap-2 flex-wrap">
              {['FMCG', 'Healthcare', 'Banking', 'Retail', 'Manufacturing'].map((ind) => (
                <button
                  key={ind}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    ind === 'FMCG'
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  )}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400 uppercase tracking-wider">Number Format</Label>
            <div className="flex gap-2">
              {['1,234.56', '1.234,56', '1 234.56'].map((fmt) => (
                <button
                  key={fmt}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-mono border transition-all',
                    fmt === '1,234.56'
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                  )}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Avatar" subtitle="Your profile picture" />
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white shadow-glow-sm">
            JC
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-3.5 h-3.5" /> Upload photo
            </Button>
            <p className="text-xs text-slate-500">JPG, PNG or GIF · max 2MB</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle title="Theme" subtitle="Choose your interface color scheme" />
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((theme) => {
            const Icon = theme.icon;
            const active = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={cn(
                  'group relative rounded-xl p-4 border text-left transition-all duration-200',
                  active
                    ? 'border-indigo-500/50 bg-indigo-600/10'
                    : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600/60'
                )}
              >
                {active && <Check className="absolute top-3 right-3 w-4 h-4 text-indigo-400" />}
                <Icon className={cn('w-6 h-6 mb-2', active ? 'text-indigo-400' : 'text-slate-400')} />
                <div className="font-medium text-sm text-white">{theme.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{theme.desc}</div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Chart Color Palette" subtitle="Default colors used across all visualizations" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CHART_PALETTE.map((palette) => {
            const active = selectedPalette === palette.id;
            return (
              <button
                key={palette.id}
                onClick={() => setSelectedPalette(palette.id)}
                className={cn(
                  'relative rounded-xl p-4 border text-center transition-all duration-200',
                  active ? 'border-white/20 bg-white/5' : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600'
                )}
              >
                {active && <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-white" />}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: palette.secondary }} />
                </div>
                <div className="text-xs font-medium text-white">{palette.label}</div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Display Density" subtitle="Adjust how compact the interface appears" />
        <div className="flex gap-3">
          {['Compact', 'Default', 'Comfortable'].map((density) => (
            <button
              key={density}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all',
                density === 'Default'
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                  : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              )}
            >
              {density}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Animations" subtitle="Control motion and transition effects" />
        <div className="space-y-4">
          {[
            { label: 'Page transitions', desc: 'Animate between dashboard pages' },
            { label: 'Chart animations', desc: 'Animate chart renders and data updates' },
            { label: 'Card hover effects', desc: 'Enable 3D hover on KPI cards' },
            { label: 'Reduced motion', desc: 'Minimize all animations for accessibility' },
          ].map((anim, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white">{anim.label}</div>
                <div className="text-xs text-slate-500">{anim.desc}</div>
              </div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle title="Alert Preferences" subtitle="Choose which events trigger notifications" />
        <div className="space-y-4">
          {NOTIFICATION_SETTINGS.map((setting) => (
            <div key={setting.id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{setting.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{setting.desc}</div>
              </div>
              <Switch
                checked={notifications[setting.id]}
                onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [setting.id]: v }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="KPI Threshold Configuration" subtitle="Set custom thresholds that trigger alerts" />
        <div className="space-y-3">
          {[
            { kpi: 'Inventory Turnover', condition: 'drops below', value: '9.0x', color: 'text-amber-400' },
            { kpi: 'Stockout Rate', condition: 'exceeds', value: '5.0%', color: 'text-red-400' },
            { kpi: 'NPA Ratio', condition: 'exceeds', value: '3.0%', color: 'text-red-400' },
          ].map((threshold, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <div className={cn('text-xs font-semibold px-2 py-1 rounded-md bg-current/10', threshold.color)}>
                {threshold.kpi}
              </div>
              <span className="text-xs text-slate-400">{threshold.condition}</span>
              <span className={cn('text-xs font-bold', threshold.color)}>{threshold.value}</span>
              <Button variant="ghost" size="icon-sm" className="ml-auto text-slate-500 hover:text-slate-300">
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2 gap-2 text-xs">
            + Add threshold rule
          </Button>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Delivery Channels" subtitle="How to receive notifications" />
        <div className="space-y-4">
          {['Email (james.chen@mckinsey.com)', 'In-app notifications', 'Slack (workspace connected)', 'Microsoft Teams'].map((channel, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{channel}</span>
              <Switch defaultChecked={i < 2} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle title="Password" subtitle="Update your account password" />
        <div className="space-y-4 max-w-sm">
          {['Current Password', 'New Password', 'Confirm Password'].map((label, i) => (
            <div key={i} className="space-y-1.5">
              <Label className="text-xs text-slate-400 uppercase tracking-wider">{label}</Label>
              <div className="relative">
                <Input type={showApiKey ? 'text' : 'password'} placeholder="••••••••" className="h-10 pr-10" />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm">Update Password</Button>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Authenticator App</span>
              <Badge variant="default" className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
            </div>
            <p className="text-xs text-slate-500">Google Authenticator · Last used 2 hours ago</p>
          </div>
          <Button variant="outline" size="sm">Manage</Button>
        </div>
        <Separator className="my-4 bg-slate-800" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Session Timeout</div>
            <div className="text-xs text-slate-500">Auto-logout after inactivity</div>
          </div>
          <div className="flex gap-2">
            {['30m', '1h', '4h', '8h'].map((t) => (
              <button
                key={t}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs border transition-all',
                  t === '4h' ? 'bg-indigo-600/20 border-indigo-500/40 text-white' : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Active Sessions" subtitle="Devices currently logged in to your account" />
        <div className="space-y-3">
          {[
            { device: 'MacBook Pro 16"', location: 'New York, US', time: 'Current session', current: true },
            { device: 'iPhone 15 Pro', location: 'New York, US', time: '2 days ago', current: false },
            { device: 'Windows PC', location: 'London, UK', time: '5 days ago', current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{session.device}</span>
                  {session.current && (
                    <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Current</Badge>
                  )}
                </div>
                <div className="text-xs text-slate-500">{session.location} · {session.time}</div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderData = () => (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle title="KPI Framework" subtitle="Configure which KPI categories are active" />
        <div className="space-y-3">
          {[
            { industry: '🛒 FMCG', kpis: 12, active: true },
            { industry: '🏥 Healthcare', kpis: 11, active: true },
            { industry: '🏦 Banking', kpis: 12, active: true },
            { industry: '🛍️ Retail', kpis: 13, active: false },
            { industry: '🏭 Manufacturing', kpis: 13, active: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <div className="flex items-center gap-3">
                <span className="text-sm">{item.industry}</span>
                <Badge variant="secondary" className="text-[10px]">{item.kpis} KPIs</Badge>
              </div>
              <Switch defaultChecked={item.active} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Data Retention" subtitle="Control how long your uploaded data is stored" />
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {['30 days', '90 days', '6 months', '1 year', 'Forever'].map((period) => (
              <button
                key={period}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  period === '90 days'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Uploaded files and extracted KPI data will be automatically purged after the selected period.
          </p>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="Benchmark Database" subtitle="Benchmark data source configuration" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div>
              <div className="text-sm font-medium text-white">InsightSynth Benchmark Database</div>
              <div className="text-xs text-slate-400">Last updated: May 2026 · 5 industries · 140+ KPIs</div>
            </div>
            <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Benchmarks
          </Button>
        </div>
      </SectionCard>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle title="Connected Services" subtitle="Manage your third-party integrations" />
        <div className="space-y-3">
          {INTEGRATION_LIST.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/60 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{integration.name}</span>
                    {integration.status === 'connected' && (
                      <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Connected</Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{integration.desc}</div>
                </div>
              </div>
              <Button
                variant={integration.status === 'connected' ? 'outline' : 'default'}
                size="sm"
                className="text-xs"
              >
                {integration.status === 'connected' ? 'Manage' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="API Access" subtitle="Programmatic access to InsightSynth AI data" />
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400 uppercase tracking-wider">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value="sk-insightsynth-a1b2c3d4e5f6g7h8i9j0k1l2m3n4"
                  readOnly
                  className="pr-10 font-mono text-xs"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button variant="outline" size="default" className="gap-1.5 text-xs">
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-slate-500">Last used: 1 hour ago · 248 API calls this month</p>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-400/80">Keep your API key secret. Never share it in client-facing materials.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const SECTION_RENDERERS: Record<string, () => React.ReactNode> = {
    profile: renderProfile,
    appearance: renderAppearance,
    notifications: renderNotifications,
    security: renderSecurity,
    data: renderData,
    integrations: renderIntegrations,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account, preferences, and platform configuration</p>
        </div>
        <Button
          variant="gradient"
          onClick={handleSave}
          className="gap-2 min-w-[120px]"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-3 space-y-1 sticky top-0">
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-indigo-400' : '')} />
                  {section.label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {SECTION_RENDERERS[activeSection]?.()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

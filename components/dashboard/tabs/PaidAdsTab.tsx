import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";

import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DateRange } from "@/components/dashboard/FilterBar";
import * as dataService from "@/lib/dataService";
import {
  PaidKPIs, SpendConversionPoint, WeeklySpendData, CampaignData, CreativeData,
  formatCurrency, formatPercent, formatNumber,
} from "@/lib/mockData";

interface TabProps {
  clientId: string;
  dateRange: DateRange;
}

export function PaidAdsTab({ clientId, dateRange }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<PaidKPIs | null>(null);
  const [spendData, setSpendData] = useState<SpendConversionPoint[]>([]);
  const [weeklySpend, setWeeklySpend] = useState<WeeklySpendData[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [creatives, setCreatives] = useState<CreativeData[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dataService.getPaidKPIs(clientId, dateRange),
      dataService.getSpendConversions(clientId, dateRange),
      dataService.getWeeklySpend(clientId, dateRange),
      dataService.getCampaigns(clientId, dateRange),
      dataService.getCreatives(clientId, dateRange),
    ]).then(([k, s, w, c, cr]) => {
      setKpis(k); setSpendData(s); setWeeklySpend(w); setCampaigns(c); setCreatives(cr);
      setLoading(false);
    });
  }, [clientId, dateRange]);

  if (loading) return <LoadingState />;
  if (!kpis) return <EmptyState />;

  const budgetPacing = ((kpis.spend / kpis.budget) * 100).toFixed(1);

  // Sort creatives by ROAS for ranking
  const sortedCreatives = [...creatives].sort((a, b) => b.roas - a.roas);
  const topCreatives = sortedCreatives.slice(0, 3);
  const bottomCreatives = sortedCreatives.slice(-3).reverse();

  const campaignColumns: Column<CampaignData>[] = [
    { key: "campaignName", header: "Campaign", sortable: true },
    { key: "spend", header: "Spend", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
    { key: "ctr", header: "CTR", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "conversions", header: "Conversions", sortable: true, align: "right", render: (v) => (v as number).toLocaleString() },
    { key: "cpa", header: "CPA", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
    { key: "roas", header: "ROAS", sortable: true, align: "right", render: (v) => `${(v as number).toFixed(1)}x` },
    { key: "revenue", header: "Revenue", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
  ];

  const creativeColumns: Column<CreativeData>[] = [
    { key: "creativeName", header: "Creative", sortable: true },
    { key: "format", header: "Format", sortable: true },
    { key: "impressions", header: "Impressions", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "ctr", header: "CTR", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "cpc", header: "CPC", sortable: true, align: "right", render: (v) => `$${(v as number).toFixed(2)}` },
    { key: "cpa", header: "CPA", sortable: true, align: "right", render: (v) => `$${(v as number).toFixed(2)}` },
    { key: "roas", header: "ROAS", sortable: true, align: "right", render: (v) => `${(v as number).toFixed(1)}x` },
    { key: "revenue", header: "Revenue", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
  ];

  const weeklyColumns: Column<WeeklySpendData>[] = [
    { key: "week", header: "Week", sortable: true },
    { key: "spend", header: "Spend", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
    { key: "budget", header: "Budget", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
    { key: "pacing", header: "Pacing", sortable: true, align: "right", render: (v) => `${(v as number).toFixed(1)}%` },
  ];

  return (
    <div className="space-y-6">
      <ExecutiveSummary tabKey="paid" dateRange={dateRange} clientId={clientId} />

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Conversions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Total Conversions" value={formatNumber(kpis.totalConversions)} />
          <KPICard label="Cost Per Conversion" value={`$${kpis.cpa.toFixed(2)}`} subtitle="CPA" />
          <KPICard label="ROAS" value={`${kpis.roas.toFixed(1)}x`} subtitle="Return on ad spend" />
          <KPICard label="Total Revenue" value={formatCurrency(kpis.totalRevenue)} subtitle="Attributed to paid" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Efficiency</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="CTR" value={formatPercent(kpis.ctr)} subtitle="Click-through rate" />
          <KPICard label="CPC" value={`$${kpis.cpc.toFixed(2)}`} subtitle="Cost per click" />
          <KPICard label="CPM" value={`$${kpis.cpm.toFixed(2)}`} subtitle="Cost per 1K impressions" />
          <KPICard label="Impressions" value={formatNumber(kpis.impressions)} subtitle="Total ad impressions" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Spend & Budget</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Total Spend" value={formatCurrency(kpis.spend)} subtitle={`of ${formatCurrency(kpis.budget)} budget`} />
          <KPICard label="Budget Pacing" value={`${budgetPacing}%`} subtitle="Spend vs allocated budget" />
          <KPICard label="Daily Avg Spend" value={formatCurrency(Math.round(kpis.spend / 30))} subtitle="Over 30 days" />
          <KPICard label="Budget Remaining" value={formatCurrency(kpis.budget - kpis.spend)} subtitle={`${(100 - parseFloat(budgetPacing)).toFixed(1)}% remaining`} />
        </div>
      </div>

      {/* Creative Intelligence */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Creative Intelligence</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
              Top Performing Creatives
            </h4>
            <div className="space-y-3">
              {topCreatives.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-foreground">{c.creativeName}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.format}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>CTR {formatPercent(c.ctr)}</span>
                    <span>CPA ${c.cpa.toFixed(2)}</span>
                    <span className="font-semibold text-[hsl(var(--success))]">{c.roas.toFixed(1)}x ROAS</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">Video formats consistently outperform static images on CTR and ROAS. Customer testimonials drive highest conversion rate.</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Underperforming Creatives
            </h4>
            <div className="space-y-3">
              {bottomCreatives.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-foreground">{c.creativeName}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.format}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>CTR {formatPercent(c.ctr)}</span>
                    <span>CPA ${c.cpa.toFixed(2)}</span>
                    <span className="font-semibold text-destructive">{c.roas.toFixed(1)}x ROAS</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">Static discount promos show highest CPA. Consider A/B testing with video format or refreshing creative messaging.</p>
          </div>
        </div>
        <DataTable columns={creativeColumns} data={sortedCreatives} />
      </div>

      <ChartCard title="Daily Spend vs Budget Pacing" subtitle="Actual spend against daily budget allocation">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <ReferenceLine y={Math.round(kpis.budget / 30)} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "Daily Budget", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Line type="monotone" dataKey="spend" name="Spend" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Conversions Over Time" subtitle="Daily conversion volume trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="conversions" name="Conversions" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Weekly Budget Pacing" subtitle="Spend vs budget allocation per week">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => formatCurrency(value)} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="spend" name="Spend" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Revenue by Campaign</h3>
        <DataTable columns={campaignColumns} data={campaigns} />
      </div>


    </div>
  );
}

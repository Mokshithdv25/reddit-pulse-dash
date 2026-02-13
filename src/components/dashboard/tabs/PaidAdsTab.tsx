import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import {
  mockPaidKPIs,
  mockSpendConversions,
  mockWeeklySpend,
  mockCampaigns,
  CampaignData,
  WeeklySpendData,
  formatCurrency,
  formatPercent,
  formatNumber,
} from "@/lib/mockData";

const budgetPacing = ((mockPaidKPIs.spend / mockPaidKPIs.budget) * 100).toFixed(1);

export function PaidAdsTab() {
  const campaignColumns: Column<CampaignData>[] = [
    { key: "campaignName", header: "Campaign", sortable: true },
    { key: "spend", header: "Spend", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
    { key: "ctr", header: "CTR", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "conversions", header: "Conversions", sortable: true, align: "right", render: (v) => (v as number).toLocaleString() },
    { key: "cpa", header: "CPA", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
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
      {/* Spend & Budget KPIs */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Spend & Budget</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Total Spend" value={formatCurrency(mockPaidKPIs.spend)} subtitle={`of ${formatCurrency(mockPaidKPIs.budget)} budget`} />
          <KPICard label="Budget Pacing" value={`${budgetPacing}%`} subtitle="Spend vs allocated budget" />
          <KPICard label="Daily Avg Spend" value={formatCurrency(Math.round(mockPaidKPIs.spend / 30))} subtitle="Over 30 days" />
          <KPICard label="Budget Remaining" value={formatCurrency(mockPaidKPIs.budget - mockPaidKPIs.spend)} subtitle={`${(100 - parseFloat(budgetPacing)).toFixed(1)}% remaining`} />
        </div>
      </div>

      {/* Efficiency KPIs */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Efficiency</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="CTR" value={formatPercent(mockPaidKPIs.ctr)} subtitle="Click-through rate" />
          <KPICard label="CPC" value={`$${mockPaidKPIs.cpc.toFixed(2)}`} subtitle="Cost per click" />
          <KPICard label="CPM" value={`$${mockPaidKPIs.cpm.toFixed(2)}`} subtitle="Cost per 1K impressions" />
          <KPICard label="Impressions" value={formatNumber(mockPaidKPIs.impressions)} subtitle="Total ad impressions" />
        </div>
      </div>

      {/* Conversion KPIs */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Conversions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Total Conversions" value={formatNumber(mockPaidKPIs.totalConversions)} />
          <KPICard label="Cost Per Conversion" value={`$${mockPaidKPIs.cpa.toFixed(2)}`} subtitle="CPA" />
          <KPICard label="ROAS" value={`${mockPaidKPIs.roas.toFixed(1)}x`} subtitle="Return on ad spend" />
          <KPICard label="Total Revenue" value={formatCurrency(mockPaidKPIs.totalRevenue)} subtitle="Attributed to paid" />
        </div>
      </div>

      {/* Daily Spend vs Budget Chart */}
      <ChartCard title="Daily Spend vs Budget Pacing" subtitle="Actual spend against daily budget allocation">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSpendConversions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number, name: string) => name === "Budget" ? formatCurrency(value) : formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <ReferenceLine y={2833} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "Daily Budget", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Line type="monotone" dataKey="spend" name="Spend" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversions Over Time */}
        <ChartCard title="Conversions Over Time" subtitle="Daily conversion volume trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSpendConversions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="conversions" name="Conversions" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Weekly Budget Pacing */}
        <ChartCard title="Weekly Budget Pacing" subtitle="Spend vs budget allocation per week">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklySpend}>
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

      {/* Campaign Performance Table with Revenue */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Revenue by Campaign</h3>
        <DataTable columns={campaignColumns} data={mockCampaigns} />
      </div>
    </div>
  );
}

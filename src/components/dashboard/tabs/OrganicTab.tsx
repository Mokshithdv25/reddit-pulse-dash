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
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  mockOrganicMetrics,
  mockKarmaData,
  mockPostsPerWeek,
  mockTrafficData,
  mockOrganicKarmaKPIs,
  mockPostScores,
  mockTrafficAttribution,
  mockGoalCompletions,
  OrganicAccountMetrics,
  PostScoreData,
  TrafficAttributionData,
  OrganicKarmaKPI,
  formatNumber,
  formatPercent,
  formatCurrency,
} from "@/lib/mockData";

const accountColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const accountKeys = ["u/OfficialBrand", "u/ProductUpdates", "u/CommunityManager", "u/TechSupport"];

// Totals for KPI cards
const totalKarma = mockOrganicKarmaKPIs.reduce((s, a) => s + a.totalKarma, 0);
const totalUpvotes = mockPostScores.reduce((s, a) => s + a.totalUpvotes, 0);
const totalReferrals = mockTrafficAttribution.reduce((s, a) => s + a.ga4Referrals, 0);
const totalRevenue = mockTrafficAttribution.reduce((s, a) => s + a.attributedRevenue, 0);

export function OrganicTab() {
  const karmaColumns: Column<OrganicKarmaKPI>[] = [
    { key: "account", header: "Account", sortable: true },
    { key: "totalKarma", header: "Total Karma", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "postKarma", header: "Post Karma", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "commentKarma", header: "Comment Karma", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "karmaVelocity", header: "Velocity/wk", sortable: true, align: "right", render: (v) => `+${formatNumber(v as number)}` },
  ];

  const postScoreColumns: Column<PostScoreData>[] = [
    { key: "account", header: "Account", sortable: true },
    { key: "totalUpvotes", header: "Total Upvotes", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "avgPostScore", header: "Avg Score", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "topPostScore", header: "Top Post", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "upvoteRatio", header: "Upvote Ratio", sortable: true, align: "right", render: (v) => `${((v as number) * 100).toFixed(0)}%` },
  ];

  const engagementColumns: Column<OrganicAccountMetrics>[] = [
    { key: "account", header: "Account", sortable: true },
    { key: "posts", header: "Posts", sortable: true, align: "right" },
    { key: "repliesPerPost", header: "Replies/Post", sortable: true, align: "right", render: (v) => (v as number).toFixed(1) },
    { key: "engagementRate", header: "Engagement Rate", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
  ];

  const trafficColumns: Column<TrafficAttributionData>[] = [
    { key: "account", header: "Account", sortable: true },
    { key: "ga4Referrals", header: "GA4 Referrals", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "directTrafficLift", header: "Direct Lift", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "goalCompletions", header: "Goal Completions", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "attributedRevenue", header: "Revenue", sortable: true, align: "right", render: (v) => formatCurrency(v as number) },
  ];

  return (
    <div className="space-y-6">
      {/* Top-level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Karma" value={formatNumber(totalKarma)} subtitle="All accounts combined" />
        <KPICard label="Total Upvotes" value={formatNumber(totalUpvotes)} subtitle="Across all posts" />
        <KPICard label="GA4 Referrals" value={formatNumber(totalReferrals)} subtitle="reddit.com source" />
        <KPICard label="Attributed Revenue" value={formatCurrency(totalRevenue)} subtitle="From organic activity" />
      </div>

      {/* Karma Growth Chart */}
      <ChartCard title="Karma Growth Over Time" subtitle="Account karma progression over the selected period">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockKarmaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => formatNumber(value)} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {accountKeys.map((account, index) => (
                <Line key={account} type="monotone" dataKey={account} name={account} stroke={accountColors[index]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Karma Per Account Table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Karma Per Account</h3>
        <DataTable columns={karmaColumns} data={mockOrganicKarmaKPIs} />
      </div>

      {/* Post Scores & Upvotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Post Scores & Upvotes</h3>
          <DataTable columns={postScoreColumns} data={mockPostScores} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Reply Counts & Engagement</h3>
          <DataTable columns={engagementColumns} data={mockOrganicMetrics} />
        </div>
      </div>

      {/* Posts Per Week */}
      <ChartCard title="Posts Per Account Per Week" subtitle="Weekly posting frequency by account">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockPostsPerWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {accountKeys.map((account, index) => (
                <Bar key={account} dataKey={account} name={account} fill={accountColors[index]} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Traffic Attribution Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Traffic Attribution</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GA4 Referrals & Direct Traffic */}
          <ChartCard title="GA4 Referrals & Direct Traffic Lift" subtitle="reddit.com referrals vs direct traffic correlation">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="redditReferrals" name="GA4 Referrals" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="directTrafficLift" name="Direct Traffic Lift" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Goal Completions & Revenue */}
          <ChartCard title="Goal Completions & Revenue Attribution" subtitle="Conversions and revenue from organic Reddit activity">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockGoalCompletions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number, name: string) => name === "Revenue" ? formatCurrency(value) : value} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line yAxisId="left" type="monotone" dataKey="goalCompletions" name="Goal Completions" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="revenueAttributed" name="Revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Traffic Attribution Table */}
        <DataTable columns={trafficColumns} data={mockTrafficAttribution} />
      </div>
    </div>
  );
}

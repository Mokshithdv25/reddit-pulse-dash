import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { InsightEditor } from "@/components/dashboard/InsightEditor";
import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DateRange } from "@/components/dashboard/FilterBar";
import * as dataService from "@/lib/dataService";
import {
  SubredditKPIs, SubredditGrowthPoint, SubredditPostData,
  calculateChange, formatNumber, formatCurrency, formatPercent,
} from "@/lib/mockData";

interface TabProps {
  clientId: string;
  dateRange: DateRange;
  insights: Record<string, string>;
  onInsightsChange: (insights: Record<string, string>) => void;
}

export function SubredditTab({ clientId, dateRange, insights, onInsightsChange }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<SubredditKPIs | null>(null);
  const [growth, setGrowth] = useState<SubredditGrowthPoint[]>([]);
  const [topPosts, setTopPosts] = useState<SubredditPostData[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dataService.getSubredditKPIs(clientId, dateRange),
      dataService.getSubredditGrowth(clientId, dateRange),
      dataService.getSubredditTopPosts(clientId, dateRange),
    ]).then(([k, g, p]) => {
      setKpis(k); setGrowth(g); setTopPosts(p);
      setLoading(false);
    });
  }, [clientId, dateRange]);

  if (loading) return <LoadingState />;
  if (!kpis) return <EmptyState />;

  const postColumns: Column<SubredditPostData>[] = [
    { key: "title", header: "Post Title", sortable: true },
    { key: "date", header: "Date", sortable: true },
    { key: "impressions", header: "Impressions", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "upvotes", header: "Upvotes", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "comments", header: "Comments", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "ctr", header: "CTR", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "traffic", header: "Traffic", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
  ];

  return (
    <div className="space-y-6">
      <ExecutiveSummary tabKey="subreddit" dateRange={dateRange} clientId={clientId} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Followers" value={formatNumber(kpis.followers)} change={calculateChange(kpis.followers, kpis.previousPeriod.followers)} subtitle={`+${formatNumber(kpis.followerGrowth)} this period`} />
        <KPICard label="Total Impressions" value={formatNumber(kpis.totalImpressions)} change={calculateChange(kpis.totalImpressions, kpis.previousPeriod.totalImpressions)} />
        <KPICard label="Total Engagement" value={formatNumber(kpis.totalEngagement)} change={calculateChange(kpis.totalEngagement, kpis.previousPeriod.totalEngagement)} />
        <KPICard label="Posts/Week" value={kpis.postingFrequency.toFixed(1)} subtitle="Posting frequency" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Subreddit Traffic" value={formatNumber(kpis.trafficFromSubreddit)} change={calculateChange(kpis.trafficFromSubreddit, kpis.previousPeriod.trafficFromSubreddit)} subtitle="GA4 referral" />
        <KPICard label="Conversions" value={formatNumber(kpis.conversions)} change={calculateChange(kpis.conversions, kpis.previousPeriod.conversions)} />
        <KPICard label="Revenue" value={formatCurrency(kpis.revenue)} change={calculateChange(kpis.revenue, kpis.previousPeriod.revenue)} />
        <KPICard label="Conv. Rate" value={formatPercent((kpis.conversions / kpis.trafficFromSubreddit) * 100)} subtitle="From subreddit traffic" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Follower Growth" subtitle="Daily subscriber count over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="followers" name="Followers" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Post Impressions" subtitle="Daily impression volume from subreddit posts">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => formatNumber(value)} />
                <Bar dataKey="impressions" name="Impressions" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Post Engagement" subtitle="Daily upvotes and comments on subreddit posts">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="upvotes" name="Upvotes" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="comments" name="Comments" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Top Performing Subreddit Posts</h3>
        <DataTable columns={postColumns} data={topPosts} />
      </div>

      <InsightEditor tabKey="subreddit" insights={insights} onInsightsChange={onInsightsChange} defaultText="Subreddit follower growth accelerating at +8.1% this period. Technical deep-dive posts drive the most traffic. AMA format shows highest comment engagement." />
    </div>
  );
}

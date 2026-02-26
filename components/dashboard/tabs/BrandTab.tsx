import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertPanel } from "@/components/dashboard/AlertPanel";

import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DateRange } from "@/components/dashboard/FilterBar";
import * as dataService from "@/lib/dataService";
import {
  BrandMentionPoint, SentimentPoint, SubredditMentions, ShareOfVoiceData, ShareOfVoiceTrend,
  TopBrandMention,
  formatPercent, formatNumber,
} from "@/lib/mockData";

const sovColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

interface TabProps {
  clientId: string;
  dateRange: DateRange;
}

export function BrandTab({ clientId, dateRange }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [mentions, setMentions] = useState<BrandMentionPoint[]>([]);
  const [sentiment, setSentiment] = useState<SentimentPoint[]>([]);
  const [subredditMentions, setSubredditMentions] = useState<SubredditMentions[]>([]);
  const [sov, setSov] = useState<ShareOfVoiceData[]>([]);
  const [sovTrend, setSovTrend] = useState<ShareOfVoiceTrend[]>([]);
  const [positiveMentions, setPositiveMentions] = useState<TopBrandMention[]>([]);
  const [negativeMentions, setNegativeMentions] = useState<TopBrandMention[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dataService.getBrandMentions(clientId, dateRange),
      dataService.getSentimentData(clientId, dateRange),
      dataService.getSubredditMentions(clientId, dateRange),
      dataService.getShareOfVoice(clientId, dateRange),
      dataService.getSOVTrend(clientId, dateRange),
      dataService.getTopPositiveMentions(clientId, dateRange),
      dataService.getTopNegativeMentions(clientId, dateRange),
    ]).then(([m, s, sm, sv, svt, pm, nm]) => {
      setMentions(m); setSentiment(s); setSubredditMentions(sm); setSov(sv); setSovTrend(svt);
      setPositiveMentions(pm); setNegativeMentions(nm);
      setLoading(false);
    });
  }, [clientId, dateRange]);

  if (loading) return <LoadingState />;
  if (mentions.length === 0) return <EmptyState />;

  const totalSentimentPoints = sentiment.reduce(
    (acc, d) => ({ positive: acc.positive + d.positive, neutral: acc.neutral + d.neutral, negative: acc.negative + d.negative }),
    { positive: 0, neutral: 0, negative: 0 }
  );
  const sentimentTotal = totalSentimentPoints.positive + totalSentimentPoints.neutral + totalSentimentPoints.negative;
  const sentimentPcts = {
    positive: ((totalSentimentPoints.positive / sentimentTotal) * 100).toFixed(1),
    neutral: ((totalSentimentPoints.neutral / sentimentTotal) * 100).toFixed(1),
    negative: ((totalSentimentPoints.negative / sentimentTotal) * 100).toFixed(1),
  };
  const totalMentions = mentions.reduce((s, d) => s + d.mentions, 0);

  const pieData = [
    { name: "Positive", value: totalSentimentPoints.positive, color: "hsl(var(--chart-3))" },
    { name: "Neutral", value: totalSentimentPoints.neutral, color: "hsl(var(--muted-foreground))" },
    { name: "Negative", value: totalSentimentPoints.negative, color: "hsl(var(--destructive))" },
  ];

  const subredditColumns: Column<SubredditMentions>[] = [
    { key: "subreddit", header: "Subreddit", sortable: true },
    { key: "mentions", header: "Mentions", sortable: true, align: "right" },
    { key: "positivePercent", header: "Positive %", sortable: true, align: "right", render: (v) => <span className="text-[hsl(var(--success))]">{formatPercent(v as number)}</span> },
    { key: "neutralPercent", header: "Neutral %", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "negativePercent", header: "Negative %", sortable: true, align: "right", render: (v) => <span className="text-destructive">{formatPercent(v as number)}</span> },
  ];

  const sovColumns: Column<ShareOfVoiceData>[] = [
    { key: "brand", header: "Brand", sortable: true },
    { key: "mentions", header: "Mentions", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "sharePercent", header: "Share %", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "sentimentScore", header: "Sentiment Score", sortable: true, align: "right", render: (v) => `${v}/100` },
  ];

  return (
    <div className="space-y-6">
      <ExecutiveSummary tabKey="brand" dateRange={dateRange} clientId={clientId} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertPanel type="warning" title="Mentions Spike Detected" description="Brand mentions increased 180% on Feb 2-3 compared to weekly average." />
        <AlertPanel type="danger" title="Negative Sentiment Increase" description="Negative sentiment rose to 22% in r/marketing discussions." />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Mentions" value={formatNumber(totalMentions)} subtitle="Over selected period" />
        <KPICard label="Positive" value={`${sentimentPcts.positive}%`} subtitle="Of all mentions" />
        <KPICard label="Neutral" value={`${sentimentPcts.neutral}%`} subtitle="Of all mentions" />
        <KPICard label="Negative" value={`${sentimentPcts.negative}%`} subtitle="Of all mentions" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Mention Volume Over Time" subtitle="Daily mention count across all subreddits">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mentions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="mentions" name="Mentions" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Sentiment Distribution" subtitle="Aggregate sentiment breakdown">
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Sentiment Trends" subtitle="Daily breakdown of positive, neutral, and negative sentiment">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sentiment}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="positive" name="Positive" stackId="a" fill="hsl(var(--chart-3))" />
              <Bar dataKey="neutral" name="Neutral" stackId="a" fill="hsl(var(--muted-foreground))" />
              <Bar dataKey="negative" name="Negative" stackId="a" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Top Mentions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
            Top 5 Positive Mentions
          </h4>
          <div className="space-y-3">
            {positiveMentions.map((m, i) => (
              <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm text-foreground italic">"{m.excerpt}"</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{m.subreddit}</span>
                  <span>↑{m.upvotes}</span>
                  <span>💬{m.comments}</span>
                  <span>{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            Top 5 Negative Mentions
          </h4>
          <div className="space-y-3">
            {negativeMentions.map((m, i) => (
              <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm text-foreground italic">"{m.excerpt}"</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{m.subreddit}</span>
                  <span>↑{m.upvotes}</span>
                  <span>💬{m.comments}</span>
                  <span>{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Mentions by Subreddit</h3>
        <DataTable columns={subredditColumns} data={subredditMentions} />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Competitive: Share of Voice</h3>
        <ChartCard title="Share of Voice Over Time" subtitle="Daily mention volume vs competitors">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sovTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {["Your Brand", "Competitor A", "Competitor B", "Competitor C"].map((brand, i) => (
                  <Line key={brand} type="monotone" dataKey={brand} name={brand} stroke={sovColors[i]} strokeWidth={brand === "Your Brand" ? 2.5 : 1.5} dot={false} strokeDasharray={brand === "Your Brand" ? undefined : "4 4"} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <DataTable columns={sovColumns} data={sov} />
      </div>


    </div>
  );
}

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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import {
  mockBrandMentions,
  mockSentimentData,
  mockSubredditMentions,
  mockShareOfVoice,
  mockSOVTrend,
  SubredditMentions,
  ShareOfVoiceData,
  formatPercent,
  formatNumber,
} from "@/lib/mockData";

// Calculate aggregate sentiment %
const totalSentimentPoints = mockSentimentData.reduce(
  (acc, d) => ({
    positive: acc.positive + d.positive,
    neutral: acc.neutral + d.neutral,
    negative: acc.negative + d.negative,
  }),
  { positive: 0, neutral: 0, negative: 0 }
);
const sentimentTotal = totalSentimentPoints.positive + totalSentimentPoints.neutral + totalSentimentPoints.negative;
const sentimentPcts = {
  positive: ((totalSentimentPoints.positive / sentimentTotal) * 100).toFixed(1),
  neutral: ((totalSentimentPoints.neutral / sentimentTotal) * 100).toFixed(1),
  negative: ((totalSentimentPoints.negative / sentimentTotal) * 100).toFixed(1),
};

const totalMentions = mockBrandMentions.reduce((s, d) => s + d.mentions, 0);

const sovColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function BrandTab() {
  const subredditColumns: Column<SubredditMentions>[] = [
    { key: "subreddit", header: "Subreddit", sortable: true },
    { key: "mentions", header: "Mentions", sortable: true, align: "right" },
    { key: "positivePercent", header: "Positive %", sortable: true, align: "right", render: (v) => <span className="text-success">{formatPercent(v as number)}</span> },
    { key: "neutralPercent", header: "Neutral %", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "negativePercent", header: "Negative %", sortable: true, align: "right", render: (v) => <span className="text-destructive">{formatPercent(v as number)}</span> },
  ];

  const sovColumns: Column<ShareOfVoiceData>[] = [
    { key: "brand", header: "Brand", sortable: true },
    { key: "mentions", header: "Mentions", sortable: true, align: "right", render: (v) => formatNumber(v as number) },
    { key: "sharePercent", header: "Share %", sortable: true, align: "right", render: (v) => formatPercent(v as number) },
    { key: "sentimentScore", header: "Sentiment Score", sortable: true, align: "right", render: (v) => `${v}/100` },
  ];

  const pieData = [
    { name: "Positive", value: totalSentimentPoints.positive, color: "hsl(var(--chart-3))" },
    { name: "Neutral", value: totalSentimentPoints.neutral, color: "hsl(var(--muted-foreground))" },
    { name: "Negative", value: totalSentimentPoints.negative, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="space-y-6">
      {/* Alert Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertPanel type="warning" title="Mentions Spike Detected" description="Brand mentions increased 180% on Feb 2-3 compared to weekly average. Investigate the source subreddits." />
        <AlertPanel type="danger" title="Negative Sentiment Increase" description="Negative sentiment rose to 22% (from 12% baseline) in r/marketing discussions. Review recent posts." />
      </div>

      {/* Top-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Mentions" value={formatNumber(totalMentions)} subtitle="Over selected period" />
        <KPICard label="Positive" value={`${sentimentPcts.positive}%`} subtitle="Of all mentions" />
        <KPICard label="Neutral" value={`${sentimentPcts.neutral}%`} subtitle="Of all mentions" />
        <KPICard label="Negative" value={`${sentimentPcts.negative}%`} subtitle="Of all mentions" />
      </div>

      {/* Mentions Volume & Sentiment Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Mention Volume Over Time" subtitle="Daily mention count across all subreddits">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockBrandMentions}>
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
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Sentiment Trends */}
      <ChartCard title="Sentiment Trends" subtitle="Daily breakdown of positive, neutral, and negative sentiment">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSentimentData}>
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

      {/* Subreddit Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Mentions by Subreddit</h3>
        <DataTable columns={subredditColumns} data={mockSubredditMentions} />
      </div>

      {/* Competitive: Share of Voice */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Competitive: Share of Voice</h3>

        <ChartCard title="Share of Voice Over Time" subtitle="Daily mention volume vs competitors">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSOVTrend}>
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

        <DataTable columns={sovColumns} data={mockShareOfVoice} />
      </div>
    </div>
  );
}

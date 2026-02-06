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
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import {
  mockBrandMentions,
  mockSentimentData,
  mockSubredditMentions,
  SubredditMentions,
  formatPercent,
} from "@/lib/mockData";

export function BrandTab() {
  const columns: Column<SubredditMentions>[] = [
    { key: "subreddit", header: "Subreddit", sortable: true },
    { key: "mentions", header: "Mentions", sortable: true, align: "right" },
    {
      key: "positivePercent",
      header: "Positive %",
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="text-success">{formatPercent(value as number)}</span>
      ),
    },
    {
      key: "neutralPercent",
      header: "Neutral %",
      sortable: true,
      align: "right",
      render: (value) => formatPercent(value as number),
    },
    {
      key: "negativePercent",
      header: "Negative %",
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="text-destructive">{formatPercent(value as number)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alert Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertPanel
          type="warning"
          title="Mentions Spike Detected"
          description="Brand mentions increased 180% on Feb 2-3 compared to weekly average. Investigate the source subreddits."
        />
        <AlertPanel
          type="danger"
          title="Negative Sentiment Increase"
          description="Negative sentiment rose to 22% (from 12% baseline) in r/marketing discussions. Review recent posts."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Mentions Over Time */}
        <ChartCard
          title="Brand Mentions Over Time"
          subtitle="Daily mention volume across all monitored subreddits"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockBrandMentions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  stroke="hsl(var(--border))"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mentions"
                  name="Mentions"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Sentiment Split */}
        <ChartCard
          title="Sentiment Split"
          subtitle="Daily breakdown of positive, neutral, and negative sentiment"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  stroke="hsl(var(--border))"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="positive"
                  name="Positive"
                  stackId="a"
                  fill="hsl(var(--chart-3))"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="neutral"
                  name="Neutral"
                  stackId="a"
                  fill="hsl(var(--muted-foreground))"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="negative"
                  name="Negative"
                  stackId="a"
                  fill="hsl(var(--destructive))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Subreddit Mentions Table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Mentions by Subreddit</h3>
        <DataTable columns={columns} data={mockSubredditMentions} />
      </div>
    </div>
  );
}

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
import {
  mockOrganicMetrics,
  mockKarmaData,
  mockPostsPerWeek,
  mockTrafficData,
  OrganicAccountMetrics,
  formatNumber,
  formatPercent,
} from "@/lib/mockData";

const accountColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const accountKeys = ["u/OfficialBrand", "u/ProductUpdates", "u/CommunityManager", "u/TechSupport"];

export function OrganicTab() {
  const columns: Column<OrganicAccountMetrics>[] = [
    { key: "account", header: "Account", sortable: true },
    { key: "posts", header: "Posts", sortable: true, align: "right" },
    {
      key: "avgPostScore",
      header: "Avg Score",
      sortable: true,
      align: "right",
      render: (value) => formatNumber(value as number),
    },
    {
      key: "repliesPerPost",
      header: "Replies/Post",
      sortable: true,
      align: "right",
      render: (value) => (value as number).toFixed(1),
    },
    {
      key: "engagementRate",
      header: "Engagement Rate",
      sortable: true,
      align: "right",
      render: (value) => formatPercent(value as number),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Karma Growth Chart */}
      <ChartCard
        title="Karma Growth Over Time"
        subtitle="Account karma progression over the selected period"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockKarmaData}>
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
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {accountKeys.map((account, index) => (
                <Line
                  key={account}
                  type="monotone"
                  dataKey={account}
                  name={account}
                  stroke={accountColors[index]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts Per Week */}
        <ChartCard
          title="Posts Per Account Per Week"
          subtitle="Weekly posting frequency by account"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPostsPerWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
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
                {accountKeys.map((account, index) => (
                  <Bar
                    key={account}
                    dataKey={account}
                    name={account}
                    fill={accountColors[index]}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Reddit Referrals & Direct Traffic */}
        <ChartCard
          title="Reddit Referrals & Direct Traffic Lift"
          subtitle="GA4 traffic attribution from Reddit activity"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrafficData}>
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
                <Line
                  type="monotone"
                  dataKey="redditReferrals"
                  name="Reddit Referrals"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="directTrafficLift"
                  name="Direct Traffic Lift"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Account Metrics Table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Account Performance</h3>
        <DataTable columns={columns} data={mockOrganicMetrics} />
      </div>
    </div>
  );
}

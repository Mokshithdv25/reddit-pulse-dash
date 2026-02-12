import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCallout } from "@/components/dashboard/InsightCallout";
import {
  mockKPIs,
  mockTimeSeriesData,
  calculateChange,
  formatNumber,
  formatCurrency,
} from "@/lib/mockData";

export function OverviewTab() {
  const kpis = mockKPIs;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          label="Reddit-Driven Traffic"
          value={formatNumber(kpis.totalTraffic)}
          change={calculateChange(kpis.totalTraffic, kpis.previousPeriod.totalTraffic)}
        />
        <KPICard
          label="Total Conversions"
          value={formatNumber(kpis.totalConversions)}
          change={calculateChange(kpis.totalConversions, kpis.previousPeriod.totalConversions)}
        />
        <KPICard
          label="Attributed Revenue"
          value={formatCurrency(kpis.revenue)}
          change={calculateChange(kpis.revenue, kpis.previousPeriod.revenue)}
        />
        <KPICard
          label="Blended ROAS"
          value={`${kpis.blendedROAS.toFixed(1)}x`}
          change={calculateChange(kpis.blendedROAS, kpis.previousPeriod.blendedROAS)}
        />
        <KPICard
          label="Karma Growth"
          value={`+${formatNumber(kpis.karmaGrowth)}`}
          change={calculateChange(kpis.karmaGrowth, kpis.previousPeriod.karmaGrowth)}
        />
      </div>

      {/* Time Series Chart */}
      <ChartCard
        title="Reddit Activity vs Traffic vs Conversions"
        subtitle="30-day trend showing correlation between Reddit engagement and business outcomes"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTimeSeriesData}>
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
                yAxisId="left"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="activity"
                name="Activity Score"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="traffic"
                name="Traffic"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="conversions"
                name="Conversions"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Insight Callout */}
      <InsightCallout title="Period Highlights">
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Reddit-driven traffic up 13.4%, led by 2 high-performing posts in r/technology</li>
          <li>Conversion rate improved from 2.8% → 3.0% (+7.1%)</li>
          <li>Community growth accelerating — karma velocity +20% WoW</li>
          <li>Brand mention spike on Feb 2–3 flagged for review</li>
        </ul>
      </InsightCallout>
    </div>
  );
}

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
import { DataTable, Column } from "@/components/dashboard/DataTable";
import {
  mockPaidKPIs,
  mockSpendConversions,
  mockCampaigns,
  CampaignData,
  formatCurrency,
  formatPercent,
} from "@/lib/mockData";

export function PaidAdsTab() {
  const columns: Column<CampaignData>[] = [
    { key: "campaignName", header: "Campaign", sortable: true },
    {
      key: "spend",
      header: "Spend",
      sortable: true,
      align: "right",
      render: (value) => formatCurrency(value as number),
    },
    {
      key: "ctr",
      header: "CTR",
      sortable: true,
      align: "right",
      render: (value) => formatPercent(value as number),
    },
    {
      key: "conversions",
      header: "Conversions",
      sortable: true,
      align: "right",
      render: (value) => (value as number).toLocaleString(),
    },
    {
      key: "cpa",
      header: "CPA",
      sortable: true,
      align: "right",
      render: (value) => formatCurrency(value as number),
    },
    {
      key: "roas",
      header: "ROAS",
      sortable: true,
      align: "right",
      render: (value) => `${(value as number).toFixed(1)}x`,
    },
    {
      key: "revenue",
      header: "Revenue",
      sortable: true,
      align: "right",
      render: (value) => formatCurrency(value as number),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          label="Total Spend"
          value={formatCurrency(mockPaidKPIs.spend)}
        />
        <KPICard
          label="CTR"
          value={formatPercent(mockPaidKPIs.ctr)}
          subtitle="Click-through rate"
        />
        <KPICard
          label="CPC"
          value={`$${mockPaidKPIs.cpc.toFixed(2)}`}
          subtitle="Cost per click"
        />
        <KPICard
          label="CPA"
          value={`$${mockPaidKPIs.cpa.toFixed(2)}`}
          subtitle="Cost per acquisition"
        />
        <KPICard
          label="ROAS"
          value={`${mockPaidKPIs.roas.toFixed(1)}x`}
          subtitle="Return on ad spend"
        />
      </div>

      {/* Spend vs Conversions Chart */}
      <ChartCard
        title="Daily Spend vs Conversions"
        subtitle="Tracking ad spend efficiency over time"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSpendConversions}>
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
                tickFormatter={(value) => `$${value}`}
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
                formatter={(value: number, name: string) =>
                  name === "Spend" ? formatCurrency(value) : value
                }
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                name="Spend"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
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

      {/* Campaign Table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Campaign Performance</h3>
        <DataTable columns={columns} data={mockCampaigns} />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightEditor } from "@/components/dashboard/InsightEditor";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DateRange } from "@/components/dashboard/FilterBar";
import { calculateInferredLift, AttributionResult } from "@/lib/attributionService";
import * as dataService from "@/lib/dataService";
import {
  KPIData, TimeSeriesPoint,
  calculateChange, formatNumber, formatCurrency,
} from "@/lib/mockData";

interface TabProps {
  clientId: string;
  dateRange: DateRange;
  insights: Record<string, string>;
  onInsightsChange: (insights: Record<string, string>) => void;
}

export function OverviewTab({ clientId, dateRange, insights, onInsightsChange }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [attribution, setAttribution] = useState<AttributionResult | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dataService.getOverview(clientId, dateRange),
      dataService.getTimeSeries(clientId, dateRange),
    ]).then(([kpiData, tsData]) => {
      setKpis(kpiData);
      setTimeSeries(tsData);
      // Calculate attribution from traffic data
      const baseline = tsData.slice(0, 14).map((d) => d.traffic);
      const spike = tsData.slice(14).map((d) => d.traffic);
      setAttribution(calculateInferredLift(baseline, spike));
      setLoading(false);
    });
  }, [clientId, dateRange]);

  if (loading) return <LoadingState />;
  if (!kpis || timeSeries.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard label="Reddit-Driven Traffic" value={formatNumber(kpis.totalTraffic)} change={calculateChange(kpis.totalTraffic, kpis.previousPeriod.totalTraffic)} />
        <KPICard label="Total Conversions" value={formatNumber(kpis.totalConversions)} change={calculateChange(kpis.totalConversions, kpis.previousPeriod.totalConversions)} />
        <KPICard label="Attributed Revenue" value={formatCurrency(kpis.revenue)} change={calculateChange(kpis.revenue, kpis.previousPeriod.revenue)} />
        <KPICard label="Blended ROAS" value={`${kpis.blendedROAS.toFixed(1)}x`} change={calculateChange(kpis.blendedROAS, kpis.previousPeriod.blendedROAS)} />
        <KPICard label="Karma Growth" value={`+${formatNumber(kpis.karmaGrowth)}`} change={calculateChange(kpis.karmaGrowth, kpis.previousPeriod.karmaGrowth)} />
      </div>

      <ChartCard title="Reddit Activity vs Traffic vs Conversions" subtitle="30-day trend showing correlation between Reddit engagement and business outcomes">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line yAxisId="left" type="monotone" dataKey="activity" name="Activity Score" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="traffic" name="Traffic" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="conversions" name="Conversions" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Attribution Module */}
      {attribution && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Baseline Traffic" value={formatNumber(attribution.baseline)} subtitle="Previous 14-day avg" />
          <KPICard label="Spike Traffic" value={formatNumber(attribution.spike)} subtitle="Recent 14-day avg" />
          <KPICard label="Traffic Lift" value={`${attribution.liftPercent}%`} subtitle="Increase over baseline" />
          <KPICard label="Inferred Reddit Lift" value={`${attribution.inferredInfluencePercent}%`} subtitle="25% of total lift attributed" />
        </div>
      )}

      <InsightEditor tabKey="overview" insights={insights} onInsightsChange={onInsightsChange} defaultText="Reddit-driven traffic up 13.4%, led by 2 high-performing posts in r/technology. Conversion rate improved from 2.8% → 3.0% (+7.1%). Community growth accelerating — karma velocity +20% WoW." />
    </div>
  );
}

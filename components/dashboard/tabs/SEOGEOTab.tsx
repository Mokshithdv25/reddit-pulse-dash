import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";

import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DateRange } from "@/components/dashboard/FilterBar";
import * as dataService from "@/lib/dataService";
import {
  SEOGEOKPIs, LLMReferralPoint, SearchVisibilityPoint,
  calculateChange, formatNumber,
} from "@/lib/mockData";

interface TabProps {
  clientId: string;
  dateRange: DateRange;
}

export function SEOGEOTab({ clientId, dateRange }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<SEOGEOKPIs | null>(null);
  const [llmReferrals, setLLMReferrals] = useState<LLMReferralPoint[]>([]);
  const [searchVisibility, setSearchVisibility] = useState<SearchVisibilityPoint[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dataService.getSEOGEOKPIs(clientId, dateRange),
      dataService.getLLMReferrals(clientId, dateRange),
      dataService.getSearchVisibility(clientId, dateRange),
    ]).then(([k, lr, sv]) => {
      setKpis(k); setLLMReferrals(lr); setSearchVisibility(sv);
      setLoading(false);
    });
  }, [clientId, dateRange]);

  if (loading) return <LoadingState />;
  if (!kpis) return <EmptyState />;

  return (
    <div className="space-y-6">
      <ExecutiveSummary tabKey="seogeo" dateRange={dateRange} clientId={clientId} />

      <div className="bg-secondary/30 border border-border rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          <strong>Placeholder:</strong> This tab will connect to LLM referral APIs and search visibility tools. Currently displaying structured mock data for layout validation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="LLM Referral Traffic" value={formatNumber(kpis.llmReferralTraffic)} change={calculateChange(kpis.llmReferralTraffic, kpis.previousPeriod.llmReferralTraffic)} subtitle="ChatGPT, Perplexity, Gemini" />
        <KPICard label="Reddit Visibility Index" value={`${kpis.redditVisibilityIndex}/100`} change={calculateChange(kpis.redditVisibilityIndex, kpis.previousPeriod.redditVisibilityIndex)} />
        <KPICard label="Search Visibility Score" value={`${kpis.searchVisibilityScore}/100`} change={calculateChange(kpis.searchVisibilityScore, kpis.previousPeriod.searchVisibilityScore)} />
        <KPICard label="Total LLM Sessions" value={formatNumber(kpis.totalLLMSessions)} change={calculateChange(kpis.totalLLMSessions, kpis.previousPeriod.totalLLMSessions)} />
      </div>

      <ChartCard title="LLM Referral Traffic by Source" subtitle="Daily sessions from AI-powered search platforms">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={llmReferrals}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="chatgpt" name="ChatGPT" stackId="a" fill="hsl(var(--chart-1))" />
              <Bar dataKey="perplexity" name="Perplexity" stackId="a" fill="hsl(var(--chart-2))" />
              <Bar dataKey="gemini" name="Gemini" stackId="a" fill="hsl(var(--chart-3))" />
              <Bar dataKey="other" name="Other" stackId="a" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Visibility Scores Over Time" subtitle="Reddit content visibility in search and AI platforms">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={searchVisibility}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="redditVisibility" name="Reddit Visibility" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="searchVisibility" name="Search Visibility" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="bg-secondary/30 border border-dashed border-border rounded-lg p-6 text-center">
        <h4 className="text-sm font-semibold text-foreground mb-2">Attribution Correlation (Coming Soon)</h4>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto">
          This section will correlate Reddit posting activity with LLM citation frequency and search visibility changes. Connect your GA4 and search console data to enable.
        </p>
      </div>


    </div>
  );
}

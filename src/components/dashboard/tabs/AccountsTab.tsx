import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { InsightEditor } from "@/components/dashboard/InsightEditor";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DateRange } from "@/components/dashboard/FilterBar";
import * as dataService from "@/lib/dataService";
import {
  AccountTableRow,
  formatNumber, formatCurrency, formatPercent,
} from "@/lib/mockData";

interface TabProps {
  clientId: string;
  dateRange: DateRange;
  insights: Record<string, string>;
  onInsightsChange: (insights: Record<string, string>) => void;
}

export function AccountsTab({ clientId, dateRange, insights, onInsightsChange }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountTableRow[]>([]);

  useEffect(() => {
    setLoading(true);
    dataService.getAccountTable(clientId, dateRange).then((data) => {
      setAccounts(data);
      setLoading(false);
    });
  }, [clientId, dateRange]);

  if (loading) return <LoadingState />;
  if (accounts.length === 0) return <EmptyState />;

  const columns: Column<AccountTableRow>[] = [
    { key: "accountName", header: "Account", sortable: true },
    { key: "postsPerWeek", header: "Posts/Week", sortable: true, align: "right", render: (value) => (value as number).toFixed(1) },
    { key: "karmaVelocity", header: "Karma Velocity", sortable: true, align: "right", render: (value) => `+${formatNumber(value as number)}/wk` },
    { key: "engagementRate", header: "Engagement", sortable: true, align: "right", render: (value) => formatPercent(value as number) },
    { key: "attributedConversions", header: "Conversions", sortable: true, align: "right", render: (value) => (value as number).toLocaleString() },
    { key: "attributedRevenue", header: "Revenue", sortable: true, align: "right", render: (value) => formatCurrency(value as number) },
    { key: "karmaTrend", header: "Karma Trend", align: "center", render: (_, row) => <Sparkline data={row.karmaTrend} className="h-6 w-20 inline-block" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Account Performance Overview</h3>
        <p className="text-xs text-muted-foreground mb-4">Sortable metrics for all Reddit accounts. Click column headers to sort.</p>
        <DataTable columns={columns} data={accounts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((account) => (
          <div key={account.accountName} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">{account.accountName}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Posts/Week</span>
                <span className="font-medium">{account.postsPerWeek.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Karma Velocity</span>
                <span className="font-medium text-[hsl(var(--success))]">+{formatNumber(account.karmaVelocity)}/wk</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Engagement</span>
                <span className="font-medium">{formatPercent(account.engagementRate)}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-semibold">{formatCurrency(account.attributedRevenue)}</span>
                </div>
              </div>
              <div className="pt-2">
                <Sparkline data={account.karmaTrend} className="h-8 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <InsightEditor tabKey="accounts" insights={insights} onInsightsChange={onInsightsChange} defaultText="u/CommunityManager showing strongest karma velocity growth. u/TechSupport has highest engagement rate but lowest revenue attribution — consider content strategy shift." />
    </div>
  );
}

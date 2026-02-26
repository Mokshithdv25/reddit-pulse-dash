"use client";

import { useState, useEffect, useCallback } from "react";
import { DateRange as DayPickerRange } from "react-day-picker";
import { DashboardHeader, TabType } from "@/components/dashboard/DashboardHeader";
import { FilterBar, DateRange } from "@/components/dashboard/FilterBar";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { OrganicTab } from "@/components/dashboard/tabs/OrganicTab";
import { PaidAdsTab } from "@/components/dashboard/tabs/PaidAdsTab";
import { BrandTab } from "@/components/dashboard/tabs/BrandTab";
import { SubredditTab } from "@/components/dashboard/tabs/SubredditTab";
import { AccountsTab } from "@/components/dashboard/tabs/AccountsTab";
import { SEOGEOTab } from "@/components/dashboard/tabs/SEOGEOTab";
import { clients } from "@/lib/clients";
import { getAccounts } from "@/lib/dataService";
import { exportDashboardToPdf } from "@/lib/exportPdf";
import { Account } from "@/lib/mockData";

const dateRangeLabels: Record<DateRange, string> = {
    "3d": "Last 3 days",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    current_month: "Current Month",
    last_month: "Last Month",
    custom: "Custom",
};

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [dateRange, setDateRange] = useState<DateRange>("30d");
    const [selectedClientId, setSelectedClientId] = useState(clients[0].id);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [customDateRange, setCustomDateRange] = useState<DayPickerRange | undefined>();

    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        getAccounts(selectedClientId).then((accs) => {
            setAccounts(accs);
            setSelectedAccounts(accs.map((a) => a.id));
        });
    }, [selectedClientId]);

    const handleExport = useCallback(async () => {
        setExporting(true);
        const clientName = clients.find((c) => c.id === selectedClientId)?.name ?? "Report";
        try {
            await exportDashboardToPdf("dashboard-content", clientName, dateRangeLabels[dateRange]);
        } finally {
            setExporting(false);
        }
    }, [selectedClientId, dateRange]);

    const tabProps = { clientId: selectedClientId, dateRange };

    const renderTab = () => {
        switch (activeTab) {
            case "overview": return <OverviewTab {...tabProps} />;
            case "organic": return <OrganicTab {...tabProps} />;
            case "paid": return <PaidAdsTab {...tabProps} />;
            case "brand": return <BrandTab {...tabProps} />;
            case "subreddit": return <SubredditTab {...tabProps} />;
            case "accounts": return <AccountsTab {...tabProps} />;
            case "seogeo": return <SEOGEOTab {...tabProps} />;
            default: return <OverviewTab {...tabProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} selectedClientId={selectedClientId} onClientChange={setSelectedClientId} onExport={handleExport} exporting={exporting} />
            <FilterBar dateRange={dateRange} onDateRangeChange={setDateRange} customDateRange={customDateRange} onCustomDateRangeChange={setCustomDateRange} selectedAccounts={selectedAccounts} onAccountsChange={setSelectedAccounts} accounts={accounts} />
            <main id="dashboard-content" className="p-6">{renderTab()}</main>
        </div>
    );
}

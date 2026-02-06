import { useState } from "react";
import { DashboardHeader, TabType } from "@/components/dashboard/DashboardHeader";
import { FilterBar, DateRange } from "@/components/dashboard/FilterBar";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { OrganicTab } from "@/components/dashboard/tabs/OrganicTab";
import { PaidAdsTab } from "@/components/dashboard/tabs/PaidAdsTab";
import { BrandTab } from "@/components/dashboard/tabs/BrandTab";
import { AccountsTab } from "@/components/dashboard/tabs/AccountsTab";
import { mockAccounts } from "@/lib/mockData";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    mockAccounts.map((a) => a.id)
  );

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "organic":
        return <OrganicTab />;
      case "paid":
        return <PaidAdsTab />;
      case "brand":
        return <BrandTab />;
      case "accounts":
        return <AccountsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedAccounts={selectedAccounts}
        onAccountsChange={setSelectedAccounts}
      />
      <main className="p-6">
        {renderTab()}
      </main>
    </div>
  );
};

export default Index;

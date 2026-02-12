import { cn } from "@/lib/utils";

type TabType = "overview" | "organic" | "paid" | "brand" | "accounts";

interface DashboardHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "organic", label: "Organic" },
  { id: "paid", label: "Paid Ads" },
  { id: "brand", label: "Brand" },
  { id: "accounts", label: "Accounts" },
];

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl text-foreground flex items-center gap-3">
              <span className="font-black tracking-tight">RECHO</span>
              <span className="font-bold">Reddit Performance Dashboard</span>
            </h1>
          </div>
        </div>
      </div>
      
      <nav className="px-6">
        <div className="tab-nav inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "tab-nav-item",
                activeTab === tab.id && "tab-nav-item-active"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export type { TabType };

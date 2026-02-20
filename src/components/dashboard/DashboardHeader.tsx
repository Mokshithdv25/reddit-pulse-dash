import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { clients, Client } from "@/lib/clients";

type TabType = "overview" | "organic" | "paid" | "brand" | "subreddit" | "accounts" | "seogeo";

interface DashboardHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedClientId: string;
  onClientChange: (clientId: string) => void;
  onExport: () => void;
  exporting?: boolean;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "organic", label: "Organic" },
  { id: "paid", label: "Paid Ads" },
  { id: "brand", label: "Brand" },
  { id: "subreddit", label: "Subreddit" },
  { id: "accounts", label: "Accounts" },
  { id: "seogeo", label: "SEO / GEO" },
];

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );
}

const selectedClient = (id: string): Client => clients.find((c) => c.id === id) || clients[0];

export function DashboardHeader({ activeTab, onTabChange, selectedClientId, onClientChange, onExport, exporting }: DashboardHeaderProps) {
  const client = selectedClient(selectedClientId);
  return (
    <header className="border-b border-border">
      <div className="px-6 py-4 bg-[hsl(var(--reddit))]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl text-white flex items-center gap-3">
              <RedditIcon className="w-7 h-7" />
              <span className="font-black tracking-tight">RECHO</span>
              <span className="font-light opacity-90">Reddit Growth Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {client.name}<ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {clients.map((c) => (
                  <DropdownMenuItem key={c.id} onClick={() => onClientChange(c.id)}>
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.industry}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="secondary" size="sm" className="h-8 gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={onExport} disabled={exporting}>
              <Download className="h-3.5 w-3.5" />{exporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>
      </div>
      <nav className="px-6 overflow-x-auto">
        <div className="tab-nav inline-flex">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={cn("tab-nav-item whitespace-nowrap", activeTab === tab.id && "tab-nav-item-active")}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export type { TabType };

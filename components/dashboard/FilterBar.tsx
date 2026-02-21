import { useState, useEffect, useCallback } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Account } from "@/lib/mockData";

export type DateRange = "3d" | "7d" | "30d" | "90d" | "current_month" | "last_month" | "custom";

interface FilterBarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedAccounts: string[];
  onAccountsChange: (accounts: string[]) => void;
  accounts: Account[];
}

const dateRangeLabels: Record<DateRange, string> = {
  "3d": "Last 3 days",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  current_month: "Current Month",
  last_month: "Last Month",
  custom: "Custom",
};

export function FilterBar({ dateRange, onDateRangeChange, selectedAccounts, onAccountsChange, accounts }: FilterBarProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh indicator every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onAccountsChange(selectedAccounts.filter((id) => id !== accountId));
    } else {
      onAccountsChange([...selectedAccounts, accountId]);
    }
  };

  const selectAllAccounts = () => onAccountsChange(accounts.map((a) => a.id));

  const selectedCount = selectedAccounts.length;
  const accountLabel = selectedCount === 0 ? "No accounts" : selectedCount === accounts.length ? "All accounts" : `${selectedCount} account${selectedCount > 1 ? "s" : ""}`;

  return (
    <div className="filter-bar">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filters:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateRangeLabels[dateRange]}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(dateRangeLabels) as DateRange[]).map((range) => (
              <DropdownMenuItem key={range} onClick={() => onDateRangeChange(range)} className="flex items-center gap-2">
                {dateRange === range && <Check className="h-3 w-3" />}
                <span className={dateRange !== range ? "ml-5" : ""}>{dateRangeLabels[range]}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              {accountLabel}<ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={selectAllAccounts}>Select all</DropdownMenuItem>
            <DropdownMenuSeparator />
            {accounts.map((account) => (
              <DropdownMenuCheckboxItem key={account.id} checked={selectedAccounts.includes(account.id)} onCheckedChange={() => toggleAccount(account.id)}>
                {account.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="ml-auto">
        <span className="text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

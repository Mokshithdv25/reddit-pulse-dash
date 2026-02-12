import { useState } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockAccounts } from "@/lib/mockData";

export type DateRange = "7d" | "30d" | "90d" | "custom";

interface FilterBarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedAccounts: string[];
  onAccountsChange: (accounts: string[]) => void;
}

const dateRangeLabels: Record<DateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  custom: "Custom",
};

export function FilterBar({
  dateRange,
  onDateRangeChange,
  selectedAccounts,
  onAccountsChange,
}: FilterBarProps) {
  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onAccountsChange(selectedAccounts.filter((id) => id !== accountId));
    } else {
      onAccountsChange([...selectedAccounts, accountId]);
    }
  };

  const selectAllAccounts = () => {
    onAccountsChange(mockAccounts.map((a) => a.id));
  };

  const selectedCount = selectedAccounts.length;
  const accountLabel =
    selectedCount === 0
      ? "No accounts"
      : selectedCount === mockAccounts.length
      ? "All accounts"
      : `${selectedCount} account${selectedCount > 1 ? "s" : ""}`;

  return (
    <div className="filter-bar">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filters:</span>
        
        {/* Date Range Selector */}
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
              <DropdownMenuItem
                key={range}
                onClick={() => onDateRangeChange(range)}
                className="flex items-center gap-2"
              >
                {dateRange === range && <Check className="h-3 w-3" />}
                <span className={dateRange !== range ? "ml-5" : ""}>
                  {dateRangeLabels[range]}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              {accountLabel}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={selectAllAccounts}>
              Select all
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {mockAccounts.map((account) => (
              <DropdownMenuCheckboxItem
                key={account.id}
                checked={selectedAccounts.includes(account.id)}
                onCheckedChange={() => toggleAccount(account.id)}
              >
                {account.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="ml-auto">
        <span className="text-xs text-muted-foreground">
          Last updated: Feb 12, 2026 · 9:00 AM
        </span>
      </div>
    </div>
  );
}

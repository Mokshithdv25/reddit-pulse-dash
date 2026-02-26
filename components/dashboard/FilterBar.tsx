import { useState, useEffect } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DateRange as DayPickerRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
  DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Account } from "@/lib/mockData";

export type DateRange = "3d" | "7d" | "30d" | "90d" | "current_month" | "last_month" | "custom";

interface FilterBarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  customDateRange?: DayPickerRange;
  onCustomDateRangeChange?: (range: DayPickerRange | undefined) => void;
  selectedAccounts: string[];
  onAccountsChange: (accounts: string[]) => void;
  accounts: Account[];
}

const presetRanges: { value: DateRange; label: string }[] = [
  { value: "3d", label: "Last 3 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "current_month", label: "Current Month" },
  { value: "last_month", label: "Last Month" },
];

export function FilterBar({ dateRange, onDateRangeChange, customDateRange, onCustomDateRangeChange, selectedAccounts, onAccountsChange, accounts }: FilterBarProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePresetClick = (range: DateRange) => {
    onDateRangeChange(range);
    onCustomDateRangeChange?.(undefined);
    setDatePickerOpen(false);
  };

  const handleCustomRangeSelect = (range: DayPickerRange | undefined) => {
    onCustomDateRangeChange?.(range);
    onDateRangeChange("custom");
  };

  const toggleAllAccounts = () => {
    if (selectedAccounts.length === accounts.length) {
      onAccountsChange([]);
    } else {
      onAccountsChange(accounts.map((a) => a.id));
    }
  };

  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onAccountsChange(selectedAccounts.filter((id) => id !== accountId));
    } else {
      onAccountsChange([...selectedAccounts, accountId]);
    }
  };

  const allSelected = selectedAccounts.length === accounts.length && accounts.length > 0;
  const selectedCount = selectedAccounts.length;
  const accountLabel = selectedCount === 0 ? "No accounts" : allSelected ? "All accounts" : `${selectedCount} account${selectedCount > 1 ? "s" : ""}`;

  let dateLabel: string;
  if (dateRange === "custom" && customDateRange?.from) {
    const from = format(customDateRange.from, "MMM d, yyyy");
    const to = customDateRange.to ? format(customDateRange.to, "MMM d, yyyy") : "…";
    dateLabel = `${from} – ${to}`;
  } else if (dateRange === "custom") {
    dateLabel = "Pick a date range";
  } else {
    const labels: Record<string, string> = { "3d": "Last 3 days", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", current_month: "Current Month", last_month: "Last Month" };
    dateLabel = labels[dateRange] ?? dateRange;
  }

  return (
    <div className="filter-bar">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filters:</span>

        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateLabel}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex">
              <div className="border-r py-2 space-y-0.5 min-w-[150px]">
                {presetRanges.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handlePresetClick(value)}
                    className={cn(
                      "flex w-full items-center rounded-none px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                      dateRange === value ? "bg-accent font-medium" : ""
                    )}
                  >
                    {label}
                  </button>
                ))}
                <div className="border-t my-1" />
                <button
                  className={cn(
                    "flex w-full items-center rounded-none px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                    dateRange === "custom" ? "bg-accent font-medium" : ""
                  )}
                  onClick={() => onDateRangeChange("custom")}
                >
                  Custom Range
                </button>
              </div>
              <div className="p-2">
                <Calendar
                  mode="range"
                  selected={customDateRange}
                  onSelect={handleCustomRangeSelect}
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                  defaultMonth={customDateRange?.from ?? new Date(new Date().getFullYear(), new Date().getMonth() - 1)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              {accountLabel}<ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuCheckboxItem checked={allSelected} onCheckedChange={toggleAllAccounts}>
              Select All
            </DropdownMenuCheckboxItem>
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

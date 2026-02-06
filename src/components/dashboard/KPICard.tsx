import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function KPICard({ label, value, change, subtitle, className }: KPICardProps) {
  return (
    <div className={cn("kpi-card", className)}>
      <p className="kpi-card-label">{label}</p>
      <p className="kpi-card-value mt-1">{value}</p>
      {change && (
        <div className="flex items-center gap-1 mt-2">
          {change.isPositive ? (
            <TrendingUp className="h-3 w-3 text-success" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span
            className={cn(
              "kpi-card-change",
              change.isPositive ? "kpi-card-change-positive" : "kpi-card-change-negative"
            )}
          >
            {change.isPositive ? "+" : "-"}{change.value.toFixed(1)}% vs prev period
          </span>
        </div>
      )}
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

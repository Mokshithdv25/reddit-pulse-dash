import { AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertPanelProps {
  type: "warning" | "danger";
  title: string;
  description: string;
  className?: string;
}

export function AlertPanel({ type, title, description, className }: AlertPanelProps) {
  return (
    <div
      className={cn(
        "alert-panel",
        type === "warning" ? "alert-panel-warning" : "alert-panel-danger",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {type === "warning" ? (
          <TrendingUp className="h-4 w-4 text-warning mt-0.5" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );
}

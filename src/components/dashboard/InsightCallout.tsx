import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCalloutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InsightCallout({ title, children, className }: InsightCalloutProps) {
  return (
    <div className={cn("insight-callout", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-accent" />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

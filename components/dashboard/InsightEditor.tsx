import { useState } from "react";
import { Lightbulb } from "lucide-react";

interface InsightEditorProps {
  tabKey: string;
  defaultText?: string;
  maxLength?: number;
  insights: Record<string, string>;
  onInsightsChange: (insights: Record<string, string>) => void;
}

export function InsightEditor({
  tabKey,
  defaultText = "",
  maxLength = 500,
  insights,
  onInsightsChange,
}: InsightEditorProps) {
  const value = insights[tabKey] ?? defaultText;
  const charCount = value.length;

  return (
    <div className="insight-callout">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-accent" />
        <h4 className="text-sm font-semibold text-foreground">Key Insights</h4>
        <span className="ml-auto text-xs text-muted-foreground">
          {charCount}/{maxLength}
        </span>
      </div>
      <textarea
        className="w-full bg-transparent border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-y min-h-[80px] focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="Add key insights for this section..."
        maxLength={maxLength}
        value={value}
        onChange={(e) =>
          onInsightsChange({ ...insights, [tabKey]: e.target.value })
        }
      />
    </div>
  );
}

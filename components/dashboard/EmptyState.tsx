import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No data for selected range" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Inbox className="h-10 w-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

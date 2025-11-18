import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  index: number;
  total: number;
}

export function StatCard({ name, value, change, changeType, index, total }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-background border border-border/50 cursor-pointer transition-all hover:border-border hover:bg-muted/30",
        "relative overflow-hidden group"
      )}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {name}
          </div>
          <div
            className={cn(
              "text-xs font-mono px-2 py-1 border",
              changeType === "positive"
                ? "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/20"
                : "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/20"
            )}
          >
            {change}
          </div>
        </div>
        <div className="text-2xl font-mono font-bold tracking-tight text-foreground">
          {value}
        </div>
      </div>
      <div className={cn(
        "absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300",
        changeType === "positive" ? "bg-green-500" : "bg-red-500",
        "group-hover:h-1"
      )} />
    </div>
  );
}
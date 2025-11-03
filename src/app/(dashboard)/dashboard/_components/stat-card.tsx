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
    <Card
      className={cn(
        "rounded-none border-0 shadow-none py-0",
        index === 0 && "rounded-l-xl",
        index === total - 1 && "rounded-r-xl"
      )}
    >
      <CardContent className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 p-4 sm:p-6">
        <div className="text-sm font-medium text-muted-foreground">
          {name}
        </div>
        <div
          className={cn(
            "text-xs font-medium",
            changeType === "positive"
              ? "text-green-800 dark:text-green-400"
              : "text-red-800 dark:text-red-400"
          )}
        >
          {change}
        </div>
        <div className="w-full flex-none text-3xl font-medium tracking-tight text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
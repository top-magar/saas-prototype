import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  changeType: 'increase' | 'decrease';
}

export function StatCard({ title, value, icon, change, changeType }: StatCardProps) {
  const isIncrease = changeType === 'increase';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className={cn('flex items-center gap-1', isIncrease ? 'text-green-500' : 'text-red-500')}>
            {isIncrease ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {Math.abs(change)}%
          </span>
          vs Last Week
        </p>
      </CardContent>
    </Card>
  );
}
'use client';
import { useDateFormat } from '@/hooks/use-date-format';

interface DateDisplayProps {
  date: Date | string;
  showTime?: boolean;
}

export function DateDisplay({ date, showTime = false }: DateDisplayProps) {
  const { formatDate, formatDateTime } = useDateFormat();
  
  return <span>{showTime ? formatDateTime(date) : formatDate(date)}</span>;
}
import { useCountdown } from '@/hooks/useCountdown';
import { Clock } from 'lucide-react';
import type { CountdownUrgency } from '@/utils/date';

const URGENCY_STYLES: Record<CountdownUrgency, string> = {
  safe: 'bg-matcha-50 text-matcha-700 dark:bg-matcha-900/40 dark:text-matcha-300',
  soon: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  urgent: 'bg-red-50 text-red-700 animate-pulse dark:bg-red-500/10 dark:text-red-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

interface CountdownBadgeProps {
  dueDate: string;
  completed?: boolean;
}

export default function CountdownBadge({ dueDate, completed }: CountdownBadgeProps) {
  const countdown = useCountdown(dueDate);

  if (completed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-matcha-50 px-2.5 py-1 text-xs font-medium text-matcha-700 dark:bg-matcha-900/40 dark:text-matcha-300">
        <Clock className="h-3 w-3" /> Done
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums transition-colors ${URGENCY_STYLES[countdown.urgency]}`}
    >
      <Clock className="h-3 w-3" />
      {countdown.urgency === 'overdue' ? 'Overdue' : countdown.label}
    </span>
  );
}

import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'default' | 'danger' | 'success';
}

const TONE_STYLES = {
  default: 'bg-matcha-50 text-matcha-600 dark:bg-matcha-900/40 dark:text-matcha-300',
  danger: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  success: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
};

export default function StatsCard({ label, value, icon: Icon, tone = 'default' }: StatsCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONE_STYLES[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

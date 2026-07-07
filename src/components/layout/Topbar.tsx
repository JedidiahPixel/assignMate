import { Sun, Moon, Leaf } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { theme, toggleTheme } = useUIStore();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[rgb(var(--border))] px-5 py-4 lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-matcha-500 text-white">
          <Leaf className="h-4 w-4" />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] transition hover:bg-matcha-50 dark:hover:bg-white/5"
      >
        {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
      </button>
    </header>
  );
}

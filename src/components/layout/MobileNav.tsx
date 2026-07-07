import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Timer, Settings, Plus } from 'lucide-react';
import { useTaskUIStore } from '@/store/taskUIStore';

const leftLinks = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks, end: false },
];

const rightLinks = [
  { to: '/focus', label: 'Focus', icon: Timer, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

function NavItem({ to, label, icon: Icon, end }: { to: string; label: string; icon: typeof LayoutDashboard; end: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
          isActive ? 'text-matcha-600 dark:text-matcha-400' : 'text-muted'
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
}

/** Bottom navigation with a center floating "+" action, mirroring the
 * elevated-FAB pattern from the reference task-tracker apps. */
export default function MobileNav() {
  const openCreate = useTaskUIStore((s) => s.openCreate);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]/95 shadow-nav backdrop-blur lg:hidden">
      {leftLinks.map((l) => (
        <NavItem key={l.to} {...l} />
      ))}

      <div className="flex flex-1 items-center justify-center">
        <button
          onClick={openCreate}
          aria-label="Add assignment"
          className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-matcha-500 text-white shadow-fab transition active:scale-95"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>

      {rightLinks.map((l) => (
        <NavItem key={l.to} {...l} />
      ))}
    </nav>
  );
}

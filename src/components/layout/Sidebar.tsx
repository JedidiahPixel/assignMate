import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Timer, Settings, LogOut, Leaf, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTaskUIStore } from '@/store/taskUIStore';
import { toast } from 'sonner';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Assignments', icon: ListChecks, end: false },
  { to: '/focus', label: 'Focus Timer', icon: Timer, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export default function Sidebar() {
  const { user, signOut } = useAuthStore();
  const openCreate = useTaskUIStore((s) => s.openCreate);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out. See you next time!');
  };

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-[rgb(var(--border))] lg:bg-[rgb(var(--bg))] lg:fixed lg:inset-y-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-matcha-500 text-white">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">AssignMate</span>
      </div>

      <div className="px-3">
        <button onClick={openCreate} className="btn-primary w-full">
          <Plus className="h-4 w-4" /> New assignment
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-matcha-500 text-white shadow-sm'
                  : 'text-muted hover:bg-matcha-50 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[rgb(var(--border))] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-matcha-100 text-sm font-semibold text-matcha-700 dark:bg-matcha-900 dark:text-matcha-300">
            {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.displayName || 'Student'}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="btn-ghost mt-1 w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

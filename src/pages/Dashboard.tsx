import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ListChecks, CheckCircle2, Clock, AlertTriangle, TrendingUp, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { useUIStore } from '@/store/uiStore';
import StatsCard from '@/components/dashboard/StatsCard';
import { StatSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import TaskCard from '@/components/tasks/TaskCard';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useTaskUIStore } from '@/store/taskUIStore';
import { isOverdue, isDueToday, isDueThisWeek } from '@/utils/date';
import { isPast, isThisWeek } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { tasks, loading, fetchTasks, toggleComplete } = useTaskStore();
  const { openCreate, openEdit, requestDelete } = useTaskUIStore();
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    if (user) fetchTasks(user.id);
  }, [user, fetchTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(isOverdue).length;
    const dueToday = tasks.filter((t) => !t.completed && isDueToday(t)).length;
    const dueThisWeek = tasks.filter((t) => !t.completed && isDueThisWeek(t)).length;

    const completedThisWeek = tasks.filter(
      (t) => t.completed && t.completedAt && isThisWeek(new Date(t.completedAt), { weekStartsOn: 1 })
    ).length;
    const dueOrCompletedThisWeek = tasks.filter(
      (t) => isThisWeek(new Date(t.dueDate), { weekStartsOn: 1 }) || (t.completedAt && isThisWeek(new Date(t.completedAt), { weekStartsOn: 1 }))
    ).length;
    const completionRateThisWeek = dueOrCompletedThisWeek > 0 ? Math.round((completedThisWeek / dueOrCompletedThisWeek) * 100) : 0;

    return { total, completed, pending, overdue, dueToday, dueThisWeek, completionRateThisWeek };
  }, [tasks]);

  const urgentTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && (isPast(new Date(t.dueDate)) || isDueToday(t) || isDueThisWeek(t)))
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 6),
    [tasks]
  );

  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0].split('@')[0];
  const ringPct = Math.min(100, stats.total ? Math.round((stats.completed / stats.total) * 100) : 0);
  const ringCircumference = 2 * Math.PI * 26;

  return (
    <div className="px-5 py-6 lg:px-8">
      {/* Greeting header card, echoing the "Hey, Alex!" hero from the reference apps */}
      <div className="card flex items-center justify-between gap-4 bg-matcha-500 p-5 text-white sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-semibold">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-medium text-matcha-100">{format(new Date(), 'EEEE, MMM d')}</p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Hey, {firstName}!</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 sm:flex"
          >
            {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-matcha-700 transition hover:bg-matcha-50 active:scale-[0.98]">
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>

      {/* Completion ring + quick highlight, similar to the "today's plan" card in the references */}
      {!loading && stats.total > 0 && (
        <div className="card mt-4 flex items-center gap-4 p-5">
          <svg viewBox="0 0 60 60" className="h-16 w-16 -rotate-90 shrink-0">
            <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-matcha-50 dark:text-white/10" />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="#74a346"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - ringPct / 100)}
            />
          </svg>
          <div>
            <p className="text-sm font-semibold">{ringPct}% of assignments completed</p>
            <p className="text-xs text-muted">
              {stats.pending} pending &middot; {stats.overdue} overdue
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted">Overview</h2>
      </div>

      {loading ? (
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatsCard label="Total assignments" value={stats.total} icon={ListChecks} />
          <StatsCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
          <StatsCard label="Pending" value={stats.pending} icon={Clock} />
          <StatsCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="danger" />
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-medium text-muted">Due today</p>
          <p className="mt-1 text-2xl font-semibold">{stats.dueToday}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium text-muted">Due this week</p>
          <p className="mt-1 text-2xl font-semibold">{stats.dueThisWeek}</p>
        </div>
        <div className="card flex items-center justify-between p-5">
          <div>
            <p className="text-xs font-medium text-muted">Completion rate (week)</p>
            <p className="mt-1 text-2xl font-semibold">{stats.completionRateThisWeek}%</p>
          </div>
          <TrendingUp className="h-6 w-6 text-matcha-500" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted">Needs your attention</h2>
          <Link to="/tasks" className="text-sm font-medium text-matcha-600 hover:underline dark:text-matcha-400">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : urgentTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="You're all caught up!"
            description="No overdue or upcoming assignments this week. Add a new one to keep planning ahead."
            action={{ label: 'Add assignment', onClick: openCreate }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {urgentTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggleComplete={toggleComplete} onEdit={openEdit} onDelete={requestDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

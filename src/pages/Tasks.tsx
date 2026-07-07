import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useTaskUIStore } from '@/store/taskUIStore';
import { isOverdue } from '@/utils/date';
import { PRIORITY_ORDER } from '@/utils/priority';
import type { TaskStatus, Priority, SortKey, ViewMode } from '@/types';

export default function Tasks() {
  const { user } = useAuthStore();
  const { tasks, loading, fetchTasks, toggleComplete } = useTaskStore();
  const { openCreate, openEdit, requestDelete } = useTaskUIStore();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus>('all');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [category, setCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  useEffect(() => {
    if (user) fetchTasks(user.id);
  }, [user, fetchTasks]);

  const categories = useMemo(() => Array.from(new Set(tasks.map((t) => t.category))).sort(), [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }

    if (status === 'active') result = result.filter((t) => !t.completed);
    else if (status === 'completed') result = result.filter((t) => t.completed);
    else if (status === 'overdue') result = result.filter(isOverdue);

    if (priority !== 'all') result = result.filter((t) => t.priority === priority);
    if (category !== 'all') result = result.filter((t) => t.category === category);

    result.sort((a, b) => {
      switch (sortKey) {
        case 'priority':
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'dueDate':
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    return result;
  }, [tasks, search, status, priority, category, sortKey]);

  return (
    <div>
      <Topbar title="Assignments" subtitle={`${filteredTasks.length} of ${tasks.length} shown`} />

      <div className="space-y-5 px-5 py-6 lg:px-8">
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          sortKey={sortKey}
          onSortKeyChange={setSortKey}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <button onClick={openCreate} className="btn-primary hidden sm:inline-flex">
          <Plus className="h-4 w-4" /> Add assignment
        </button>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            viewMode={viewMode}
            onToggleComplete={toggleComplete}
            onEdit={openEdit}
            onDelete={requestDelete}
            onCreateNew={openCreate}
          />
        )}
      </div>
    </div>
  );
}

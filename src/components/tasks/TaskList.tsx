import type { Task, ViewMode } from '@/types';
import TaskCard from './TaskCard';
import CountdownBadge from './CountdownBadge';
import { PRIORITY_CHIP, PRIORITY_LABEL } from '@/utils/priority';
import { formatDueDate } from '@/utils/date';
import { Check, Pencil, Trash2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  viewMode: ViewMode;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateNew: () => void;
}

export default function TaskList({ tasks, viewMode, onToggleComplete, onEdit, onDelete, onCreateNew }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No assignments found"
        description="Try adjusting your search or filters, or add a new assignment to get started."
        action={{ label: 'Add assignment', onClick: onCreateNew }}
      />
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[rgb(var(--border))] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Countdown</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-matcha-50/50 dark:hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          task.completed
                            ? 'border-matcha-500 bg-matcha-500 text-white'
                            : 'border-matcha-300 hover:border-matcha-500 dark:border-matcha-700'
                        }`}
                      >
                        {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                      </button>
                      <span className={`font-medium ${task.completed ? 'line-through text-muted' : ''}`}>{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${PRIORITY_CHIP[task.priority]}`}>
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{task.category}</td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{formatDueDate(task.dueDate)}</td>
                  <td className="px-4 py-3">
                    <CountdownBadge dueDate={task.dueDate} completed={task.completed} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        aria-label="Edit assignment"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-matcha-50 hover:text-matcha-700 dark:hover:bg-white/10"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        aria-label="Delete assignment"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

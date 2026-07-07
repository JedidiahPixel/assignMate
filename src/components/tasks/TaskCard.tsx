import { Check, Pencil, Trash2, Tag, Hourglass } from 'lucide-react';
import type { Task } from '@/types';
import { PRIORITY_CHIP, PRIORITY_LABEL, PRIORITY_DOT } from '@/utils/priority';
import { formatDueDate, isOverdue } from '@/utils/date';
import CountdownBadge from './CountdownBadge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task);

  return (
    <div
      className={`card group relative flex flex-col gap-3 overflow-hidden p-4 pl-5 transition hover:shadow-soft ${
        task.completed ? 'opacity-70' : ''
      } ${overdue ? 'border-red-200 dark:border-red-500/30' : ''}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${PRIORITY_DOT[task.priority]}`} aria-hidden="true" />
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
            task.completed
              ? 'border-matcha-500 bg-matcha-500 text-white'
              : 'border-matcha-300 hover:border-matcha-500 dark:border-matcha-700'
          }`}
        >
          {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-semibold leading-snug ${task.completed ? 'line-through text-muted' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted">{task.description}</p>
          )}
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
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
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${PRIORITY_CHIP[task.priority]}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-matcha-50 px-2.5 py-1 text-xs font-medium text-matcha-700 dark:bg-white/5 dark:text-matcha-300">
          <Tag className="h-3 w-3" /> {task.category}
        </span>
        {task.estimatedDuration && (
          <span className="inline-flex items-center gap-1 rounded-full bg-matcha-50 px-2.5 py-1 text-xs font-medium text-matcha-700 dark:bg-white/5 dark:text-matcha-300">
            <Hourglass className="h-3 w-3" /> {task.estimatedDuration}m
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[rgb(var(--border))] pt-3">
        <span className="text-xs text-muted">{formatDueDate(task.dueDate)}</span>
        <CountdownBadge dueDate={task.dueDate} completed={task.completed} />
      </div>
    </div>
  );
}

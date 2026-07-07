import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, TaskFormValues, Priority } from '@/types';

interface TaskFormModalProps {
  open: boolean;
  initialTask?: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

const EMPTY_FORM: TaskFormValues = {
  title: '',
  description: '',
  dueDate: format(new Date(), 'yyyy-MM-dd'),
  dueTime: '23:59',
  priority: 'medium',
  category: '',
  estimatedDuration: '',
};

function taskToForm(task: Task): TaskFormValues {
  const due = new Date(task.dueDate);
  return {
    title: task.title,
    description: task.description ?? '',
    dueDate: format(due, 'yyyy-MM-dd'),
    dueTime: format(due, 'HH:mm'),
    priority: task.priority,
    category: task.category,
    estimatedDuration: task.estimatedDuration ? String(task.estimatedDuration) : '',
  };
}

export default function TaskFormModal({ open, initialTask, onClose, onSubmit }: TaskFormModalProps) {
  const [form, setForm] = useState<TaskFormValues>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(initialTask ? taskToForm(initialTask) : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initialTask]);

  if (!open) return null;

  const update = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof TaskFormValues, string>> = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.dueDate) next.dueDate = 'Due date is required';
    if (!form.dueTime) next.dueTime = 'Due time is required';
    if (!form.category.trim()) next.category = 'Category is required';
    if (form.estimatedDuration && Number(form.estimatedDuration) <= 0) {
      next.estimatedDuration = 'Must be a positive number';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="task-form-title" className="text-lg font-semibold">
            {initialTask ? 'Edit assignment' : 'New assignment'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-current">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              Title *
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Calculus Problem Set 4"
              className="input-field"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Add any notes or instructions (optional)"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium">
                Due date *
              </label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
                className="input-field"
                aria-invalid={!!errors.dueDate}
              />
              {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
            </div>
            <div>
              <label htmlFor="dueTime" className="mb-1.5 block text-sm font-medium">
                Due time *
              </label>
              <input
                id="dueTime"
                type="time"
                value={form.dueTime}
                onChange={(e) => update('dueTime', e.target.value)}
                className="input-field"
                aria-invalid={!!errors.dueTime}
              />
              {errors.dueTime && <p className="mt-1 text-xs text-red-500">{errors.dueTime}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="priority" className="mb-1.5 block text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => update('priority', e.target.value as Priority)}
                className="input-field"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedDuration" className="mb-1.5 block text-sm font-medium">
                Est. duration (min)
              </label>
              <input
                id="estimatedDuration"
                type="number"
                min={1}
                value={form.estimatedDuration}
                onChange={(e) => update('estimatedDuration', e.target.value)}
                placeholder="60"
                className="input-field"
                aria-invalid={!!errors.estimatedDuration}
              />
              {errors.estimatedDuration && <p className="mt-1 text-xs text-red-500">{errors.estimatedDuration}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
              Category / tag *
            </label>
            <input
              id="category"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              placeholder="e.g. Biology, Personal, Club Project"
              className="input-field"
              aria-invalid={!!errors.category}
            />
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving...' : initialTask ? 'Save changes' : 'Add assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

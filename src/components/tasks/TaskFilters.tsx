import { Search, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import type { TaskStatus, Priority, SortKey, ViewMode } from '@/types';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: TaskStatus;
  onStatusChange: (v: TaskStatus) => void;
  priority: Priority | 'all';
  onPriorityChange: (v: Priority | 'all') => void;
  category: string;
  onCategoryChange: (v: string) => void;
  categories: string[];
  sortKey: SortKey;
  onSortKeyChange: (v: SortKey) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export default function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
  categories,
  sortKey,
  onSortKeyChange,
  viewMode,
  onViewModeChange,
}: TaskFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assignments by title or description..."
            className="input-field pl-10"
            aria-label="Search assignments"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <select
              value={sortKey}
              onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
              className="input-field appearance-none py-2.5 pl-8 pr-8 text-sm"
              aria-label="Sort assignments"
            >
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Date created</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div className="flex rounded-xl border border-[rgb(var(--border))] p-1">
            <button
              onClick={() => onViewModeChange('cards')}
              aria-label="Card view"
              aria-pressed={viewMode === 'cards'}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                viewMode === 'cards' ? 'bg-matcha-500 text-white' : 'text-muted hover:bg-matcha-50 dark:hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                viewMode === 'table' ? 'bg-matcha-500 text-white' : 'text-muted hover:bg-matcha-50 dark:hover:bg-white/5'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                status === opt.value
                  ? 'bg-matcha-500 text-white'
                  : 'bg-matcha-50 text-matcha-700 hover:bg-matcha-100 dark:bg-white/5 dark:text-matcha-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
          className="input-field w-auto py-1.5 text-xs"
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input-field w-auto py-1.5 text-xs"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

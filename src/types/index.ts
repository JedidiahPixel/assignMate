// Core domain types for AssignMate

export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'all' | 'active' | 'completed' | 'overdue';

export type SortKey = 'dueDate' | 'priority' | 'createdAt' | 'alphabetical';

export type SortDirection = 'asc' | 'desc';

export type ViewMode = 'cards' | 'table';

/**
 * The Assignment / Task data model.
 * Mirrors the `tasks` table in Supabase (see README for SQL schema).
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  /** ISO 8601 string including date + time */
  dueDate: string;
  priority: Priority;
  /** Free-form category / subject tag, e.g. "Math", "CS101" */
  category: string;
  /** Optional estimated duration in minutes */
  estimatedDuration?: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

/** Shape used by the create/edit task form, before an id is assigned */
export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string; // yyyy-MM-dd
  dueTime: string; // HH:mm
  priority: Priority;
  category: string;
  estimatedDuration: string; // kept as string for form control simplicity
}

export interface AppUser {
  id: string;
  email: string;
  displayName?: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completionRateThisWeek: number;
}

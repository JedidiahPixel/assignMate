import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Task } from '@/types';

// Maps a Supabase row (snake_case) to our Task type (camelCase)
function fromRow(row: any): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    dueDate: row.due_date,
    priority: row.priority,
    category: row.category ?? 'General',
    estimatedDuration: row.estimated_duration ?? undefined,
    completed: row.completed,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

function toRow(task: Partial<Task>) {
  return {
    title: task.title,
    description: task.description || null,
    due_date: task.dueDate,
    priority: task.priority,
    category: task.category,
    estimated_duration: task.estimatedDuration ?? null,
    completed: task.completed,
    completed_at: task.completedAt ?? null,
  };
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleComplete: (id: string) => Promise<void>;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (userId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set({ tasks: (data ?? []).map(fromRow), loading: false });
  },

  addTask: async (task) => {
    set({ error: null });
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: task.userId,
        ...toRow(task),
        completed: false,
      })
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return false;
    }
    set({ tasks: [...get().tasks, fromRow(data)] });
    return true;
  },

  updateTask: async (id, updates) => {
    set({ error: null });
    const { data, error } = await supabase
      .from('tasks')
      .update(toRow(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return false;
    }
    set({ tasks: get().tasks.map((t) => (t.id === id ? fromRow(data) : t)) });
    return true;
  },

  deleteTask: async (id) => {
    set({ error: null });
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      set({ error: error.message });
      return false;
    }
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    return true;
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const completed = !task.completed;
    await get().updateTask(id, {
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  },

  reset: () => set({ tasks: [], loading: false, error: null }),
}));

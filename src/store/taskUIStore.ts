import { create } from 'zustand';
import type { Task } from '@/types';

interface TaskUIState {
  formOpen: boolean;
  editingTask: Task | null;
  deleteTarget: Task | null;
  openCreate: () => void;
  openEdit: (task: Task) => void;
  closeForm: () => void;
  requestDelete: (task: Task) => void;
  cancelDelete: () => void;
}

/** Shared across pages so the floating "+" nav button can open the same
 * create/edit modal that the Dashboard and Assignments pages use. */
export const useTaskUIStore = create<TaskUIState>((set) => ({
  formOpen: false,
  editingTask: null,
  deleteTarget: null,
  openCreate: () => set({ formOpen: true, editingTask: null }),
  openEdit: (task) => set({ formOpen: true, editingTask: task }),
  closeForm: () => set({ formOpen: false, editingTask: null }),
  requestDelete: (task) => set({ deleteTarget: task }),
  cancelDelete: () => set({ deleteTarget: null }),
}));

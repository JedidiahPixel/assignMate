import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import TaskFormModal from '@/components/tasks/TaskFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useTaskUIStore } from '@/store/taskUIStore';
import type { TaskFormValues } from '@/types';

export default function AppLayout() {
  const { user } = useAuthStore();
  const { addTask, updateTask, deleteTask } = useTaskStore();
  const { formOpen, editingTask, deleteTarget, closeForm, cancelDelete } = useTaskUIStore();

  const handleSubmit = async (values: TaskFormValues) => {
    if (!user) return;
    const dueDateIso = new Date(`${values.dueDate}T${values.dueTime}`).toISOString();
    const payload = {
      userId: user.id,
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      dueDate: dueDateIso,
      priority: values.priority,
      category: values.category.trim(),
      estimatedDuration: values.estimatedDuration ? Number(values.estimatedDuration) : undefined,
    };

    const ok = editingTask ? await updateTask(editingTask.id, payload) : await addTask(payload);
    if (ok) {
      toast.success(editingTask ? 'Assignment updated' : 'Assignment added');
      closeForm();
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteTask(deleteTarget.id);
    if (ok) toast.success('Assignment deleted');
    else toast.error('Could not delete assignment');
    cancelDelete();
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="pb-28 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />

      <TaskFormModal open={formOpen} initialTask={editingTask} onClose={closeForm} onSubmit={handleSubmit} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this assignment?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

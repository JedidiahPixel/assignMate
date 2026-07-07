import { useEffect } from 'react';
import Topbar from '@/components/layout/Topbar';
import PomodoroTimer from '@/components/timer/PomodoroTimer';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';

export default function Focus() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    if (user) fetchTasks(user.id);
  }, [user, fetchTasks]);

  return (
    <div>
      <Topbar title="Focus Timer" subtitle="Stay on task with the Pomodoro technique" />
      <div className="px-5 py-6 lg:px-8">
        <PomodoroTimer tasks={tasks} />

        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-matcha-50 p-4 text-sm text-matcha-800 dark:bg-matcha-900/30 dark:text-matcha-300">
          <p className="font-medium">How it works</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-matcha-700 dark:text-matcha-400">
            <li>Work in focused 25-minute sessions, then take a 5-minute break.</li>
            <li>After every 4 sessions, enjoy a longer 15–30 minute break.</li>
            <li>Pick an assignment above to keep your focus aligned with your tasks.</li>
            <li>A gentle chime plays automatically when a session ends.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

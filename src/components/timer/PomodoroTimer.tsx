import { useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings2 } from 'lucide-react';
import { usePomodoro, DEFAULT_POMODORO_SETTINGS, type PomodoroSettings } from '@/hooks/usePomodoro';
import type { Task } from '@/types';

interface PomodoroTimerProps {
  tasks: Task[];
}

const PHASE_LABEL: Record<string, string> = {
  focus: 'Focus session',
  'short-break': 'Short break',
  'long-break': 'Long break',
};

const PHASE_COLOR: Record<string, string> = {
  focus: '#74a346',
  'short-break': '#3f7fd1',
  'long-break': '#5b8336',
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroTimer({ tasks }: PomodoroTimerProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const { phase, secondsLeft, progress, isRunning, completedSessions, start, pause, reset, skip } = usePomodoro(settings);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="card mx-auto max-w-md p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-center gap-1.5 rounded-full bg-matcha-50 p-1 dark:bg-white/5">
        {(['focus', 'short-break', 'long-break'] as const).map((p) => (
          <span
            key={p}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              phase === p ? 'bg-matcha-500 text-white shadow-sm' : 'text-muted'
            }`}
          >
            {PHASE_LABEL[p]}
          </span>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{PHASE_LABEL[phase]}</p>
          {activeTasks.length > 0 && (
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="mt-1 max-w-[220px] truncate border-none bg-transparent p-0 text-sm font-semibold outline-none"
              aria-label="Focused assignment"
            >
              <option value="">No assignment selected</option>
              {activeTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Timer settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-matcha-50 dark:hover:bg-white/5"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl bg-matcha-50 p-3 text-xs dark:bg-white/5">
          <label className="flex flex-col gap-1">
            Focus (min)
            <input
              type="number"
              min={1}
              value={settings.focusMinutes}
              onChange={(e) => setSettings((s) => ({ ...s, focusMinutes: Number(e.target.value) || 1 }))}
              className="input-field py-1.5 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1">
            Short break
            <input
              type="number"
              min={1}
              value={settings.shortBreakMinutes}
              onChange={(e) => setSettings((s) => ({ ...s, shortBreakMinutes: Number(e.target.value) || 1 }))}
              className="input-field py-1.5 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1">
            Long break
            <input
              type="number"
              min={1}
              value={settings.longBreakMinutes}
              onChange={(e) => setSettings((s) => ({ ...s, longBreakMinutes: Number(e.target.value) || 1 }))}
              className="input-field py-1.5 text-xs"
            />
          </label>
        </div>
      )}

      <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
        <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
          <circle cx="120" cy="120" r={radius} fill="none" stroke="currentColor" className="text-matcha-50 dark:text-white/10" strokeWidth="14" />
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke={PHASE_COLOR[phase]}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-semibold tabular-nums tracking-tight">{formatTime(secondsLeft)}</span>
          <span className="mt-1 text-xs text-muted">Session {completedSessions + 1}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          aria-label="Reset timer"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(var(--border))] text-muted transition hover:bg-matcha-50 dark:hover:bg-white/5"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={isRunning ? pause : start}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-matcha-500 text-white shadow-soft transition hover:bg-matcha-600 active:scale-95"
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
        </button>
        <button
          onClick={skip}
          aria-label="Skip to next phase"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(var(--border))] text-muted transition hover:bg-matcha-50 dark:hover:bg-white/5"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-muted">
        {settings.sessionsUntilLongBreak - (completedSessions % settings.sessionsUntilLongBreak)} session(s) until your next long break
      </p>
    </div>
  );
}

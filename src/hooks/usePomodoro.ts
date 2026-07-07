import { useCallback, useEffect, useRef, useState } from 'react';

export type PomodoroPhase = 'focus' | 'short-break' | 'long-break';

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
}

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 20,
  sessionsUntilLongBreak: 4,
};

/** Plays a short, gentle beep using the Web Audio API — no audio file needed */
function playChime() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const notes = [880, 1108];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.55);
    });
  } catch {
    // Audio not available (e.g. autoplay restrictions) — fail silently
  }
}

function phaseDuration(phase: PomodoroPhase, settings: PomodoroSettings) {
  if (phase === 'focus') return settings.focusMinutes * 60;
  if (phase === 'short-break') return settings.shortBreakMinutes * 60;
  return settings.longBreakMinutes * 60;
}

export function usePomodoro(settings: PomodoroSettings = DEFAULT_POMODORO_SETTINGS) {
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [secondsLeft, setSecondsLeft] = useState(() => phaseDuration('focus', settings));
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const advancePhase = useCallback(() => {
    playChime();
    if (phase === 'focus') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      const isLongBreak = nextCount % settings.sessionsUntilLongBreak === 0;
      const nextPhase: PomodoroPhase = isLongBreak ? 'long-break' : 'short-break';
      setPhase(nextPhase);
      setSecondsLeft(phaseDuration(nextPhase, settings));
    } else {
      setPhase('focus');
      setSecondsLeft(phaseDuration('focus', settings));
    }
    setIsRunning(false);
  }, [phase, completedSessions, settings]);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // When the timer hits zero, advance to the next phase
  useEffect(() => {
    if (isRunning && secondsLeft === 0) {
      advancePhase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(phaseDuration(phase, settings));
  };
  const skip = () => advancePhase();

  const totalDuration = phaseDuration(phase, settings);
  const progress = 1 - secondsLeft / totalDuration;

  return {
    phase,
    secondsLeft,
    totalDuration,
    progress,
    isRunning,
    completedSessions,
    start,
    pause,
    reset,
    skip,
  };
}

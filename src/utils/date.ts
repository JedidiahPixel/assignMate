import {
  isToday,
  isThisWeek,
  isPast,
  differenceInSeconds,
  format,
  formatDistanceToNowStrict,
} from 'date-fns';
import type { Task } from '@/types';

export function isOverdue(task: Task): boolean {
  return !task.completed && isPast(new Date(task.dueDate));
}

export function isDueToday(task: Task): boolean {
  return isToday(new Date(task.dueDate));
}

export function isDueThisWeek(task: Task): boolean {
  return isThisWeek(new Date(task.dueDate), { weekStartsOn: 1 });
}

export function formatDueDate(iso: string): string {
  return format(new Date(iso), "EEE, MMM d 'at' h:mm a");
}

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export type CountdownUrgency = 'safe' | 'soon' | 'urgent' | 'overdue';

export interface CountdownParts {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  urgency: CountdownUrgency;
  label: string;
}

/**
 * Computes a live countdown breakdown from now until `dueIso`.
 * Urgency thresholds drive the green -> yellow -> red color coding:
 *  - safe:    more than 24 hours away
 *  - soon:    1 - 24 hours away
 *  - urgent:  under 1 hour, not yet due
 *  - overdue: due date has passed
 */
export function getCountdown(dueIso: string, now: Date = new Date()): CountdownParts {
  const due = new Date(dueIso);
  const totalSeconds = differenceInSeconds(due, now);

  if (totalSeconds <= 0) {
    return {
      totalSeconds,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      urgency: 'overdue',
      label: 'Overdue',
    };
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let urgency: CountdownUrgency = 'safe';
  if (totalSeconds < 3600) urgency = 'urgent';
  else if (totalSeconds < 86400) urgency = 'soon';

  let label = '';
  if (days > 0) label = `${days}d ${hours}h ${minutes}m`;
  else if (hours > 0) label = `${hours}h ${minutes}m ${seconds}s`;
  else label = `${minutes}m ${seconds}s`;

  return { totalSeconds, days, hours, minutes, seconds, urgency, label };
}

import { useEffect, useState } from 'react';
import { getCountdown, type CountdownParts } from '@/utils/date';

/** Returns a countdown breakdown that updates every second */
export function useCountdown(dueIso: string): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => getCountdown(dueIso));

  useEffect(() => {
    setParts(getCountdown(dueIso));
    const interval = setInterval(() => {
      setParts(getCountdown(dueIso));
    }, 1000);
    return () => clearInterval(interval);
  }, [dueIso]);

  return parts;
}

import { AREAS, AREA_CONFIG, DEEP_DIFFICULTY, type Area } from '@/lib/areas';
import type { Problem, Schedule } from '@/lib/content/schema';
import { isoWeekKey } from '@/lib/date/localDate';

export interface Shortage {
  date?: string;
  week?: string;
  area?: Area;
  message: string;
}

export interface ScheduleResult {
  schedule: Schedule;
  used: string[];
  shortages: Shortage[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Adds `n` calendar days (may be negative) to a 'YYYY-MM-DD' date, in UTC. */
export const addDays = (date: string, n: number): string => {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day) + n * DAY_MS);
  return shifted.toISOString().slice(0, 10);
};

const byId = (a: Problem, b: Problem): number =>
  a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

const scheduledIds = (schedule: Schedule): Set<string> =>
  new Set([
    ...Object.values(schedule.days).flatMap((day) => Object.values(day)),
    ...Object.values(schedule.weeks)
  ]);

/**
 * Assigns approved problems to the `days` dates starting at `from`, plus one
 * deep problem per ISO week touched. Pure: `existing` is never mutated.
 * A date or week that cannot be filled completely is left out and reported.
 */
export const buildSchedule = (
  problems: Problem[],
  existing: Schedule,
  from: string,
  days: number
): ScheduleResult => {
  const taken = scheduledIds(existing);
  // Lowest id first, so taking the first match is deterministic.
  const pool = problems
    .filter((p) => p.status === 'approved' && !taken.has(p.id))
    .sort(byId);

  const newDays: Schedule['days'] = {};
  const newWeeks: Schedule['weeks'] = {};
  const used: string[] = [];
  const shortages: Shortage[] = [];

  const available = (picked: Set<string>) => (p: Problem) =>
    !taken.has(p.id) && !picked.has(p.id);
  const dates = Array.from({ length: days }, (_, i) => addDays(from, i));

  for (const date of dates) {
    if (date in existing.days) continue;
    const picked = new Set<string>();
    const row: Partial<Record<Area, string>> = {};
    const missing: Area[] = [];
    for (const area of AREAS) {
      const band = AREA_CONFIG[area].difficulty;
      const match = pool.find(
        (p) =>
          available(picked)(p) && p.area === area && band.includes(p.difficulty)
      );
      if (match) {
        picked.add(match.id);
        row[area] = match.id;
      } else {
        missing.push(area);
      }
    }
    if (missing.length > 0) {
      for (const area of missing) {
        shortages.push({
          date,
          area,
          message: `no approved ${area} problem in difficulty ${AREA_CONFIG[area].difficulty.join('/')}`
        });
      }
      continue;
    }
    newDays[date] = row as Record<Area, string>;
    for (const area of AREAS) {
      const id = row[area] as string;
      taken.add(id);
      used.push(id);
    }
  }

  const weeks = [...new Set(dates.map(isoWeekKey))];
  for (const week of weeks) {
    if (week in existing.weeks) continue;
    const match = pool.find(
      (p) => !taken.has(p.id) && p.difficulty === DEEP_DIFFICULTY
    );
    if (!match) {
      shortages.push({
        week,
        message: `no approved difficulty-${DEEP_DIFFICULTY} problem`
      });
      continue;
    }
    newWeeks[week] = match.id;
    taken.add(match.id);
    used.push(match.id);
  }

  return {
    schedule: {
      days: { ...existing.days, ...newDays },
      weeks: { ...existing.weeks, ...newWeeks }
    },
    used,
    shortages
  };
};

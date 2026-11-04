import type { Area } from '@/lib/areas';
import { daysBetween } from '@/lib/date/localDate';
import { en } from '@/lib/i18n/en';
import type { Messages } from '@/lib/i18n/types';

import type { Session, WayState } from './schema';

export type AreaTone = 'fresh' | 'recent' | 'fading' | 'quiet';

export const isSetDone = (session: Session | null, size: number): boolean =>
  session !== null && session.index >= size;

export const setSummary = (
  records: WayState['records'],
  ids: string[]
): { solved: number; total: number; hints: number; seconds: number } => {
  const found = ids.flatMap((id) => {
    const record = records[id];
    return record === undefined ? [] : [record];
  });
  return {
    solved: found.filter((r) => r.status === 'solved').length,
    total: ids.length,
    hints: found.reduce((sum, r) => sum + r.hints, 0),
    seconds: found.reduce((sum, r) => sum + r.seconds, 0)
  };
};

export const daysSinceExercised = (
  records: WayState['records'],
  area: Area,
  today: string
): number | null => {
  const gaps = Object.values(records)
    .filter((r) => r.area === area)
    .map((r) => daysBetween(r.date, today));
  return gaps.length === 0 ? null : Math.min(...gaps);
};

export const areaTone = (days: number | null): AreaTone => {
  if (days === null || days >= 7) return 'quiet';
  if (days >= 3) return 'fading';
  if (days >= 1) return 'recent';
  return 'fresh';
};

export const areaCaption = (
  days: number | null,
  { areaMap: t }: Messages = en
): string => {
  if (days === null) return t.never;
  if (days === 0) return t.today;
  return t.daysAgo(days);
};

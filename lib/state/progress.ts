import { toLocalDate } from '@/lib/date/localDate';
import type { Problem } from '@/lib/content/schema';

import type { Current, RecordStatus, Session, Slot, WayState } from './schema';

export const freshCurrent = (now: number): Current => ({
  attempts: 0,
  hints: 0,
  draft: '',
  startedAt: now,
  result: null
});

/** Applies `fn` to the slot's session; returns the state unchanged if the slot is empty. */
const withSession = (
  s: WayState,
  slot: Slot,
  fn: (session: Session) => WayState
): WayState => {
  const session = s[slot];
  return session === null ? s : fn(session);
};

const withCurrent = (
  s: WayState,
  slot: Slot,
  fn: (current: Current) => Current
): WayState =>
  withSession(s, slot, (session) => ({
    ...s,
    [slot]: { ...session, current: fn(session.current) }
  }));

export const ensureSession = (
  s: WayState,
  slot: Slot,
  key: string,
  now: number
): WayState =>
  s[slot]?.key === key
    ? s
    : { ...s, [slot]: { key, index: 0, current: freshCurrent(now) } };

export const setDraft = (s: WayState, slot: Slot, draft: string): WayState =>
  withCurrent(s, slot, (current) => ({ ...current, draft }));

export const revealHint = (s: WayState, slot: Slot, max: number): WayState =>
  withCurrent(s, slot, (current) => ({
    ...current,
    hints: Math.min(current.hints + 1, max)
  }));

export const recordWrongAttempt = (s: WayState, slot: Slot): WayState =>
  withCurrent(s, slot, (current) => ({
    ...current,
    attempts: current.attempts + 1
  }));

export const completeProblem = (
  s: WayState,
  slot: Slot,
  problem: Pick<Problem, 'id' | 'area'>,
  status: RecordStatus,
  now: number
): WayState =>
  withSession(s, slot, (session) => ({
    ...s,
    [slot]: { ...session, current: { ...session.current, result: status } },
    records: {
      ...s.records,
      [problem.id]: {
        area: problem.area,
        status,
        attempts: session.current.attempts,
        hints: session.current.hints,
        date: toLocalDate(new Date(now)),
        seconds: Math.round((now - session.current.startedAt) / 1000)
      }
    }
  }));

export const advance = (s: WayState, slot: Slot, now: number): WayState =>
  withSession(s, slot, (session) => ({
    ...s,
    [slot]: {
      ...session,
      index: session.index + 1,
      current: freshCurrent(now)
    }
  }));

export const nextProblem = (
  s: WayState,
  slot: Slot,
  key: string,
  now: number
): WayState =>
  s[slot]?.key !== key
    ? ensureSession(s, slot, key, now)
    : advance(s, slot, now);

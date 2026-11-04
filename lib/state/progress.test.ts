import { describe, expect, it } from 'vitest';

import {
  advance,
  completeProblem,
  ensureSession,
  freshCurrent,
  nextProblem,
  recordWrongAttempt,
  revealHint,
  setDraft
} from './progress';
import { EMPTY_STATE, type WayState } from './schema';

// Local time (not UTC) so the expected local date is timezone-independent.
const now = new Date(2030, 0, 1, 20).getTime();
const problem = { id: 'w-001', area: 'words' } as const;

describe('progress reducers', () => {
  it('ensureSession creates a fresh session when none', () => {
    const s = ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now);
    expect(s.daily).toEqual({
      key: '2030-01-01',
      index: 0,
      current: freshCurrent(now)
    });
    expect(s.deep).toBeNull();
  });

  it('freshCurrent has zeroed counters', () => {
    expect(freshCurrent(now)).toEqual({
      attempts: 0,
      hints: 0,
      draft: '',
      startedAt: now,
      result: null
    });
  });

  it('ensureSession keeps a session with the same key', () => {
    const s = ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now);
    expect(ensureSession(s, 'daily', '2030-01-01', now + 5)).toBe(s);
  });

  it('ensureSession replaces a session with a different key but keeps records', () => {
    const done = completeProblem(
      ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now),
      'daily',
      problem,
      'solved',
      now + 1000
    );
    const advanced = advance(done, 'daily', now + 2000);
    const s = ensureSession(advanced, 'daily', '2030-01-02', now + 3000);
    expect(s.daily).toEqual({
      key: '2030-01-02',
      index: 0,
      current: freshCurrent(now + 3000)
    });
    expect(s.records).toEqual(done.records);
  });

  it('setDraft stores the draft in the slot', () => {
    const s = setDraft(
      ensureSession(EMPTY_STATE, 'deep', '2030-W01', now),
      'deep',
      'hello'
    );
    expect(s.deep?.current.draft).toBe('hello');
  });

  it('reducers leave state unchanged when the slot has no session', () => {
    expect(setDraft(EMPTY_STATE, 'daily', 'x')).toEqual(EMPTY_STATE);
    expect(revealHint(EMPTY_STATE, 'daily', 3)).toEqual(EMPTY_STATE);
    expect(recordWrongAttempt(EMPTY_STATE, 'daily')).toEqual(EMPTY_STATE);
    expect(
      completeProblem(EMPTY_STATE, 'daily', problem, 'solved', now)
    ).toEqual(EMPTY_STATE);
    expect(advance(EMPTY_STATE, 'daily', now)).toEqual(EMPTY_STATE);
  });

  it('revealHint caps at max', () => {
    let s = ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now);
    for (let i = 0; i < 4; i += 1) s = revealHint(s, 'daily', 3);
    expect(s.daily?.current.hints).toBe(3);
  });

  it('recordWrongAttempt increments attempts', () => {
    let s = ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now);
    s = recordWrongAttempt(recordWrongAttempt(s, 'daily'), 'daily');
    expect(s.daily?.current.attempts).toBe(2);
  });

  it('completeProblem writes a record, sets result and leaves index alone', () => {
    const s = completeProblem(
      ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now),
      'daily',
      problem,
      'solved',
      now + 90_000
    );
    expect(s.records['w-001']).toEqual({
      area: 'words',
      status: 'solved',
      attempts: 0,
      hints: 0,
      date: '2030-01-01',
      seconds: 90
    });
    expect(s.daily?.current.result).toBe('solved');
    expect(s.daily?.index).toBe(0);
  });

  it('advance moves to the next problem with a fresh current', () => {
    let s = ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now);
    s = revealHint(setDraft(s, 'daily', 'abc'), 'daily', 3);
    s = advance(s, 'daily', now + 500);
    expect(s.daily?.index).toBe(1);
    expect(s.daily?.current).toEqual(freshCurrent(now + 500));
    expect(s.daily?.key).toBe('2030-01-01');
  });

  it('nextProblem advances when the key matches', () => {
    const s = nextProblem(
      ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now),
      'daily',
      '2030-01-01',
      now + 10
    );
    expect(s.daily?.index).toBe(1);
  });

  it('nextProblem starts fresh when the key changed', () => {
    let s = ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now);
    s = completeProblem(s, 'daily', problem, 'gave_up', now + 1000);
    s = advance(s, 'daily', now + 2000);
    const next = nextProblem(s, 'daily', '2030-01-02', now + 3000);
    expect(next.daily?.index).toBe(0);
    expect(next.daily?.key).toBe('2030-01-02');
    expect(next.records['w-001']?.status).toBe('gave_up');
  });

  it('reducers never mutate their input', () => {
    const base = completeProblem(
      ensureSession(EMPTY_STATE, 'daily', '2030-01-01', now),
      'daily',
      problem,
      'solved',
      now + 1000
    );
    const input: WayState = ensureSession(base, 'deep', '2030-W01', now);
    const snapshot = structuredClone(input);
    const reducers: Array<(s: WayState) => WayState> = [
      (s) => ensureSession(s, 'daily', 'other', now),
      (s) => setDraft(s, 'daily', 'x'),
      (s) => revealHint(s, 'deep', 3),
      (s) => recordWrongAttempt(s, 'daily'),
      (s) =>
        completeProblem(
          s,
          'deep',
          { id: 'l-1', area: 'logic' },
          'failed',
          now + 5
        ),
      (s) => advance(s, 'daily', now + 1),
      (s) => nextProblem(s, 'daily', 'other', now + 1),
      (s) => nextProblem(s, 'deep', '2030-W01', now + 1)
    ];
    for (const reducer of reducers) {
      reducer(input);
      expect(input).toEqual(snapshot);
    }
  });
});

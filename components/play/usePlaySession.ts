'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Outcome } from '@/components/problem/types';
import { DAILY_HINTS, DEEP_HINTS } from '@/lib/areas';
import { checkAnswer } from '@/lib/check/checkAnswer';
import { maxAttempts } from '@/lib/check/attempts';
import type { Problem } from '@/lib/content/schema';
import { runCode } from '@/lib/runner/runCode';
import type { RunResult } from '@/lib/runner/types';
import {
  completeProblem,
  ensureSession,
  nextProblem,
  recordWrongAttempt,
  revealHint,
  setDraft
} from '@/lib/state/progress';
import type { Current, Slot, WayState } from '@/lib/state/schema';
import { isSetDone } from '@/lib/state/selectors';
import { useWayState } from '@/lib/state/useWayState';

export interface PlaySessionOptions {
  slot: Slot;
  key: string;
  problems: Problem[] | null;
  deep: boolean;
  /** True once the fetch for `key` has finished, whether or not it found a set. */
  settled: boolean;
  resolveKey: () => string;
  onKeyChange?: (key: string) => void;
}

export interface PlaySession {
  phase: 'loading' | 'no-set' | 'playing' | 'done';
  problem: Problem | null;
  index: number;
  current: Current | null;
  outcome: Outcome | null;
  codeResult: RunResult | null;
  busy: boolean;
  state: WayState | null;
  draft: (d: string) => void;
  hint: () => void;
  submit: () => Promise<void>;
  run: () => Promise<void>;
  giveUp: () => void;
  next: () => void;
}

const deriveOutcome = (
  current: Current | null,
  problem: Problem | null,
  deep: boolean
): Outcome | null => {
  if (current === null || problem === null) return null;
  if (current.result !== null) return { kind: current.result };
  if (current.attempts === 0) return null;
  return {
    kind: 'wrong',
    attemptsLeft: maxAttempts(problem.answer.type, deep) - current.attempts
  };
};

export const usePlaySession = (opts: PlaySessionOptions): PlaySession => {
  const { slot, key, problems, deep, settled, resolveKey, onKeyChange } = opts;
  const { state, update } = useWayState();
  const [codeResult, setCodeResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const ensuredKey = useRef<string | null>(null);

  const ready = state !== null && problems !== null;
  useEffect(() => {
    if (!ready || ensuredKey.current === key) return;
    ensuredKey.current = key;
    update((s) => ensureSession(s, slot, key, Date.now()));
  }, [ready, key, slot, update]);

  const session = state?.[slot] ?? null;
  const synced = session !== null && session.key === key;
  const problem = synced && problems ? (problems[session.index] ?? null) : null;
  const current = synced ? session.current : null;
  const outcome = deriveOutcome(current, problem, deep);

  let phase: PlaySession['phase'] = 'loading';
  if (state !== null && settled) {
    if (problems === null) phase = 'no-set';
    else if (synced) {
      phase = isSetDone(session, problems.length) ? 'done' : 'playing';
    }
  }

  const open = problem !== null && current !== null && current.result === null;
  const guarded = open && !busy;
  const now = (): number => Date.now();

  const draft = useCallback(
    (d: string) => update((s) => setDraft(s, slot, d)),
    [update, slot]
  );

  const hint = useCallback(() => {
    if (!guarded) return;
    update((s) => revealHint(s, slot, deep ? DEEP_HINTS : DAILY_HINTS));
  }, [guarded, update, slot, deep]);

  const giveUp = useCallback(() => {
    if (!guarded) return;
    update((s) => completeProblem(s, slot, problem, 'gave_up', now()));
  }, [guarded, update, slot, problem]);

  const exec = useCallback(
    async (cases: 'tests' | 'examples'): Promise<RunResult | null> => {
      if (!problem || !current || problem.answer.type !== 'code') return null;
      const { answer } = problem;
      setBusy(true);
      try {
        const result = await runCode(
          { code: current.draft, entry: answer.entry, cases: answer[cases] },
          answer.timeLimitMs
        );
        setCodeResult(result);
        return result;
      } finally {
        setBusy(false);
      }
    },
    [problem, current]
  );

  const submit = useCallback(async () => {
    if (!guarded || !current) return;
    const { answer } = problem;
    if (answer.type === 'code') {
      const result = await exec('tests');
      if (result === null) return;
      const passed = result.passed === result.total && !result.timedOut;
      update((s) =>
        passed
          ? completeProblem(s, slot, problem, 'solved', now())
          : recordWrongAttempt(s, slot)
      );
      return;
    }
    const verdict = checkAnswer(answer, current.draft);
    if (verdict.correct) {
      update((s) => completeProblem(s, slot, problem, 'solved', now()));
    } else if (verdict.reason === 'wrong') {
      const limit = maxAttempts(answer.type, deep);
      update((s) => {
        const wrong = recordWrongAttempt(s, slot);
        const attempts = wrong[slot]?.current.attempts ?? 0;
        return attempts >= limit
          ? completeProblem(wrong, slot, problem, 'failed', now())
          : wrong;
      });
    }
  }, [guarded, current, problem, exec, update, slot, deep]);

  const run = useCallback(async () => {
    if (!guarded) return;
    await exec('examples');
  }, [guarded, exec]);

  const next = useCallback(() => {
    const keyNow = resolveKey();
    update((s) => nextProblem(s, slot, keyNow, now()));
    setCodeResult(null);
    if (keyNow !== key) onKeyChange?.(keyNow);
  }, [resolveKey, update, slot, key, onKeyChange]);

  return {
    phase,
    problem,
    index: session?.index ?? 0,
    current,
    outcome,
    codeResult,
    busy,
    state,
    draft,
    hint,
    submit,
    run,
    giveUp,
    next
  };
};

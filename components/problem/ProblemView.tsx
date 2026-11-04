'use client';

import { useEffect, useState } from 'react';

import Markdown from '@/components/Markdown';
import { Button } from '@/components/ui/button';
import { AREA_CONFIG } from '@/lib/areas';
import { reportIssueUrl } from '@/lib/config';
import type { Problem } from '@/lib/content/schema';
import type { RunResult } from '@/lib/runner/types';
import type { Current } from '@/lib/state/schema';

import AnswerInput from './AnswerInput';
import CodeResult from './CodeResult';
import GiveUpDialog from './GiveUpDialog';
import HintLadder from './HintLadder';
import OutcomePanel from './OutcomePanel';

export type Outcome =
  | { kind: 'solved' }
  | { kind: 'wrong'; attemptsLeft: number }
  | { kind: 'gave_up' }
  | { kind: 'failed' };

export interface ProblemViewProps {
  problem: Problem;
  position: { index: number; total: number };
  current: Current;
  maxHints: number;
  outcome: Outcome | null;
  codeResult: RunResult | null;
  busy: boolean;
  onDraftChange: (draft: string) => void;
  onHint: () => void;
  onSubmit: () => void;
  onRun: () => void;
  onGiveUp: () => void;
  onNext: () => void;
}

const isEditableTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.matches('input, textarea, select') || target.isContentEditable);

export default function ProblemView({
  problem,
  position,
  current,
  maxHints,
  outcome,
  codeResult,
  busy,
  onDraftChange,
  onHint,
  onSubmit,
  onRun,
  onGiveUp,
  onNext
}: ProblemViewProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const terminal = outcome !== null && outcome.kind !== 'wrong';
  const { answer } = problem;
  const isCode = answer.type === 'code';

  useEffect(() => {
    if (terminal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !isEditableTarget(e.target)) onHint();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onHint, terminal]);

  return (
    <main className="mx-auto w-full max-w-160 space-y-6 px-4 py-6">
      <header className="flex items-baseline gap-3 text-sm text-muted-foreground">
        {position.total > 1 && (
          <span>{`${position.index + 1} of ${position.total}`}</span>
        )}
        <span>{AREA_CONFIG[problem.area].label}</span>
      </header>

      <h1 className="text-2xl font-semibold">{problem.title}</h1>
      <Markdown>{problem.prompt}</Markdown>

      {outcome && (
        <OutcomePanel
          outcome={outcome}
          answer={answer}
          solution={problem.solution}
        />
      )}

      {(!terminal || isCode) && (
        <AnswerInput
          answer={answer}
          title={problem.title}
          draft={current.draft}
          readOnly={terminal}
          onDraftChange={onDraftChange}
          onSubmit={onSubmit}
        />
      )}

      {codeResult && <CodeResult result={codeResult} />}

      {terminal ? (
        <Button type="button" size="lg" onClick={onNext}>
          Next
        </Button>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {isCode && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={busy}
                onClick={onRun}
              >
                Run
              </Button>
            )}
            <Button type="button" size="lg" disabled={busy} onClick={onSubmit}>
              Submit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setConfirmOpen(true)}
            >
              Give up
            </Button>
          </div>
          <HintLadder
            hints={problem.hints}
            revealed={current.hints}
            maxHints={maxHints}
            disabled={false}
            onHint={onHint}
          />
        </div>
      )}

      {terminal && current.hints > 0 && (
        <HintLadder
          hints={problem.hints}
          revealed={current.hints}
          maxHints={maxHints}
          disabled
          onHint={onHint}
        />
      )}

      <footer className="text-sm text-muted-foreground">
        <a
          className="underline"
          href={reportIssueUrl(problem.id)}
          target="_blank"
          rel="noreferrer"
        >
          Report a problem
        </a>
      </footer>

      <GiveUpDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={onGiveUp}
      />
    </main>
  );
}

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
import type { Outcome } from './types';

export type { Outcome };

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
    if (terminal || current.hints >= maxHints) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !isEditableTarget(e.target)) onHint();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onHint, terminal, current.hints, maxHints]);

  return (
    <main className="mx-auto w-full max-w-160 space-y-8 px-4 pt-8 pb-16 sm:pt-14">
      {/* Meta, title and prompt read as one block, so they sit close together. */}
      <div>
        <header className="flex items-baseline gap-3 text-sm text-muted-foreground tabular-nums">
          {position.total > 1 && (
            <span>{`${position.index + 1} of ${position.total}`}</span>
          )}
          <span>{AREA_CONFIG[problem.area].label}</span>
        </header>

        <h1 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-balance">
          {problem.title}
        </h1>
        <Markdown className="mt-4">{problem.prompt}</Markdown>
      </div>

      {outcome && (
        <OutcomePanel
          outcome={outcome}
          answer={answer}
          solution={problem.solution}
        />
      )}

      <div className="space-y-4">
        {(!terminal || isCode) && (
          <AnswerInput
            answer={answer}
            title={problem.title}
            draft={current.draft}
            readOnly={terminal}
            busy={busy}
            onDraftChange={onDraftChange}
            onSubmit={onSubmit}
          />
        )}

        {codeResult && <CodeResult result={codeResult} />}

        {terminal ? (
          <Button
            type="button"
            size="lg"
            className="h-11 px-5 text-base"
            onClick={onNext}
          >
            Next
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {isCode && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 px-5 text-base"
                disabled={busy}
                onClick={onRun}
              >
                Run
              </Button>
            )}
            <Button
              type="button"
              size="lg"
              className="h-11 px-5 text-base"
              disabled={busy}
              onClick={onSubmit}
            >
              Submit
            </Button>
            {/* The way out stays available but quieter than the way forward. */}
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-11 px-4 text-base text-muted-foreground"
              onClick={() => setConfirmOpen(true)}
            >
              Give up
            </Button>
          </div>
        )}
      </div>

      {(!terminal || current.hints > 0) && (
        <HintLadder
          hints={problem.hints}
          revealed={current.hints}
          maxHints={maxHints}
          disabled={terminal}
          onHint={onHint}
        />
      )}

      <footer className="text-sm text-muted-foreground">
        <a
          className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground"
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

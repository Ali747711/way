'use client';

import { useEffect, useState } from 'react';

import { COLUMN } from '@/components/classes';
import { reportIssueUrl } from '@/lib/config';
import type { Problem } from '@/lib/content/schema';
import type { RunResult } from '@/lib/runner/types';
import type { Current } from '@/lib/state/schema';

import AnswerInput from './AnswerInput';
import CodeResult from './CodeResult';
import GiveUpDialog from './GiveUpDialog';
import HintLadder from './HintLadder';
import OutcomePanel from './OutcomePanel';
import ProblemActions from './ProblemActions';
import ProblemHeader from './ProblemHeader';
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
  /** Why the last submission was refused, if it was. */
  notice?: string | null;
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
  notice = null,
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

  // Keyed by problem, so each new problem enters with the page's one motion.
  return (
    <main
      key={problem.id}
      className={`${COLUMN} way-enter space-y-7 pt-4 pb-16 sm:space-y-8 sm:pt-8`}
    >
      <ProblemHeader problem={problem} position={position} />

      {outcome && (
        <OutcomePanel
          outcome={outcome}
          answer={answer}
          solution={problem.solution}
        />
      )}

      <div className="space-y-5">
        {(!terminal || isCode) && (
          <AnswerInput
            answer={answer}
            title={problem.title}
            draft={current.draft}
            readOnly={terminal}
            busy={busy}
            notice={notice}
            onDraftChange={onDraftChange}
            onSubmit={onSubmit}
          />
        )}

        {codeResult && <CodeResult result={codeResult} />}

        <ProblemActions
          terminal={terminal}
          isCode={isCode}
          busy={busy}
          onRun={onRun}
          onSubmit={onSubmit}
          onAskGiveUp={() => setConfirmOpen(true)}
          onNext={onNext}
        />
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

      <footer className="pt-2 text-sm font-semibold text-ink-muted">
        <a
          className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:text-ink"
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

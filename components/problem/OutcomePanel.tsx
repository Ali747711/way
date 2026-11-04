import Markdown from '@/components/Markdown';
import { Underline } from '@/components/way/Doodle';
import type { Answer } from '@/lib/content/schema';
import { cn } from '@/lib/utils';

import type { Outcome } from './types';

interface OutcomePanelProps {
  outcome: Outcome;
  answer: Answer;
  solution: string;
}

const HEADINGS = {
  solved: 'Solved',
  wrong: 'Not quite',
  failed: 'Out of attempts',
  gave_up: 'The solution'
} as const;

export function attemptsLine(attemptsLeft: number): string | null {
  if (attemptsLeft === Infinity) return null;
  return attemptsLeft === 1
    ? '1 attempt left'
    : `${attemptsLeft} attempts left`;
}

export default function OutcomePanel({
  outcome,
  answer,
  solution
}: OutcomePanelProps) {
  const line =
    outcome.kind === 'wrong' ? attemptsLine(outcome.attemptsLeft) : null;

  // The response is a white card under the prompt. Solved gets a drawn
  // underline; Not quite takes the red; the rest stay neutral.
  return (
    <section className="space-y-4 rounded-3xl bg-surface p-5 shadow-[0_10px_24px_rgb(0_0_0/0.06)] ring-1 ring-hairline sm:p-6">
      <div className="space-y-1">
        <h2
          className={cn(
            'relative inline-block text-[1.75rem] leading-tight font-black tracking-[-0.02em]',
            outcome.kind === 'wrong' && 'text-red'
          )}
        >
          {HEADINGS[outcome.kind]}
          {outcome.kind === 'solved' && (
            <Underline className="absolute -bottom-1.5 left-0 text-blue-line" />
          )}
        </h2>
        {line && (
          <p className="text-base font-semibold text-ink-muted tabular-nums">
            {line}
          </p>
        )}
      </div>
      {outcome.kind !== 'wrong' && (
        <>
          {answer.type === 'open' && (
            <div className="space-y-2 rounded-[18px] bg-track px-4 py-3.5">
              <h3 className="text-sm font-extrabold text-ink-muted">
                What a strong answer does
              </h3>
              <Markdown className="sm:text-[1.0625rem]">
                {answer.authorNote}
              </Markdown>
            </div>
          )}
          <Markdown>{solution}</Markdown>
        </>
      )}
    </section>
  );
}

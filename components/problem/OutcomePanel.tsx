import Markdown from '@/components/Markdown';
import type { Answer } from '@/lib/content/schema';

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

  // A hairline separates the response from the prompt above it.
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="space-y-1">
        <h2 className="text-xl leading-snug font-semibold">
          {HEADINGS[outcome.kind]}
        </h2>
        {line && (
          <p className="text-base text-muted-foreground tabular-nums">{line}</p>
        )}
      </div>
      {outcome.kind !== 'wrong' && (
        <>
          {answer.type === 'open' && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                What a strong answer does
              </h3>
              <Markdown>{answer.authorNote}</Markdown>
            </div>
          )}
          <Markdown>{solution}</Markdown>
        </>
      )}
    </section>
  );
}

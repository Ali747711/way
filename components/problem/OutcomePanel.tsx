import Markdown from '@/components/Markdown';
import type { Answer } from '@/lib/content/schema';

import type { Outcome } from './ProblemView';

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

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{HEADINGS[outcome.kind]}</h2>
      {line && <p className="text-base text-muted-foreground">{line}</p>}
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

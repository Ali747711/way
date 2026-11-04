import { useContentLang, useMessages } from '@/components/i18n/LocaleProvider';
import Markdown from '@/components/Markdown';
import { Underline } from '@/components/way/Doodle';
import type { Answer } from '@/lib/content/schema';
import { en } from '@/lib/i18n/en';
import type { Messages } from '@/lib/i18n/types';
import { cn } from '@/lib/utils';

import type { Outcome } from './types';

interface OutcomePanelProps {
  outcome: Outcome;
  answer: Answer;
  solution: string;
}

export function attemptsLine(
  attemptsLeft: number,
  messages: Messages = en
): string | null {
  if (attemptsLeft === Infinity) return null;
  return messages.outcome.attemptsLeft(attemptsLeft);
}

export default function OutcomePanel({
  outcome,
  answer,
  solution
}: OutcomePanelProps) {
  const messages = useMessages();
  const t = messages.outcome;
  const lang = useContentLang();
  const line =
    outcome.kind === 'wrong'
      ? attemptsLine(outcome.attemptsLeft, messages)
      : null;

  // The response is a white card under the prompt. Solved gets a drawn
  // underline; Not quite takes the red; the rest stay neutral.
  return (
    <section className="space-y-4 rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-hairline sm:p-6">
      <div className="space-y-1">
        <h2
          className={cn(
            'relative inline-block text-[1.75rem] leading-tight font-black tracking-[-0.02em]',
            outcome.kind === 'wrong' && 'text-red'
          )}
        >
          {t[outcome.kind]}
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
                {t.strongAnswer}
              </h3>
              <Markdown lang={lang} className="sm:text-[1.0625rem]">
                {answer.authorNote}
              </Markdown>
            </div>
          )}
          <Markdown lang={lang}>{solution}</Markdown>
        </>
      )}
    </section>
  );
}

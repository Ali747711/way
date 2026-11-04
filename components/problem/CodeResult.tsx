import { useMessages } from '@/components/i18n/LocaleProvider';
import type { RunResult } from '@/lib/runner/types';

interface CodeResultProps {
  result: RunResult;
}

const show = (value: unknown): string => JSON.stringify(value) ?? 'undefined';

export default function CodeResult({ result }: CodeResultProps) {
  const { firstFailure } = result;
  const t = useMessages().code;

  return (
    <div className="space-y-2" role="status">
      <p className="text-[1.0625rem] font-extrabold tabular-nums">
        {result.timedOut ? t.timedOut : t.passed(result.passed, result.total)}
      </p>
      {firstFailure && (
        // Labels stay in the line's own text (tests read "Expected: 6"), so
        // only the values are lifted to full contrast. Long values wrap
        // rather than widening the page on a phone. 14px is the floor.
        <div className="space-y-1 rounded-[18px] bg-track px-4 py-3 font-mono text-sm leading-relaxed text-ink-muted wrap-anywhere">
          <p>
            {t.input}{' '}
            <code className="text-ink">{show(firstFailure.input)}</code>
          </p>
          <p>
            {t.expected}{' '}
            <code className="text-ink">{show(firstFailure.expected)}</code>
          </p>
          {firstFailure.error !== undefined ? (
            <p>
              {t.error} <code className="text-ink">{firstFailure.error}</code>
            </p>
          ) : (
            <p>
              {t.actual}{' '}
              <code className="text-ink">{show(firstFailure.actual)}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import type { RunResult } from '@/lib/runner/types';

interface CodeResultProps {
  result: RunResult;
}

const show = (value: unknown): string => JSON.stringify(value) ?? 'undefined';

export default function CodeResult({ result }: CodeResultProps) {
  const { firstFailure } = result;

  return (
    <div className="space-y-2" role="status">
      <p className="text-base font-medium tabular-nums">
        {result.timedOut
          ? 'Timed out'
          : `passed ${result.passed} of ${result.total}`}
      </p>
      {firstFailure && (
        // Labels stay in the line's own text (tests read "Expected: 6"), so
        // only the values are lifted to full contrast. Long values wrap
        // rather than widening the page on a phone.
        <div className="space-y-1 rounded-lg bg-muted px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-muted-foreground wrap-anywhere">
          <p>
            Input:{' '}
            <code className="text-foreground">{show(firstFailure.input)}</code>
          </p>
          <p>
            Expected:{' '}
            <code className="text-foreground">
              {show(firstFailure.expected)}
            </code>
          </p>
          {firstFailure.error !== undefined ? (
            <p>
              Error:{' '}
              <code className="text-foreground">{firstFailure.error}</code>
            </p>
          ) : (
            <p>
              Actual:{' '}
              <code className="text-foreground">
                {show(firstFailure.actual)}
              </code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

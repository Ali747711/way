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
        // Long values wrap rather than widening the page on a phone.
        <div className="space-y-1 rounded-lg bg-muted px-3 py-2.5 font-mono text-sm leading-relaxed wrap-anywhere">
          <p>
            Input: <code>{show(firstFailure.input)}</code>
          </p>
          <p>
            Expected: <code>{show(firstFailure.expected)}</code>
          </p>
          {firstFailure.error !== undefined ? (
            <p>
              Error: <code>{firstFailure.error}</code>
            </p>
          ) : (
            <p>
              Actual: <code>{show(firstFailure.actual)}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

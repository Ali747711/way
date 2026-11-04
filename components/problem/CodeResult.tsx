import type { RunResult } from '@/lib/runner/types';

interface CodeResultProps {
  result: RunResult;
}

const show = (value: unknown): string => JSON.stringify(value) ?? 'undefined';

export default function CodeResult({ result }: CodeResultProps) {
  const { firstFailure } = result;

  return (
    <div className="space-y-2" role="status">
      <p className="text-base font-medium">
        {result.timedOut
          ? 'Timed out'
          : `passed ${result.passed} of ${result.total}`}
      </p>
      {firstFailure && (
        <div className="space-y-1 rounded-lg bg-muted p-3 font-mono text-sm">
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

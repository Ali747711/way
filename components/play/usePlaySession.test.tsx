import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import ProblemView from '@/components/problem/ProblemView';
import type { Problem } from '@/lib/content/schema';
import { STORAGE_KEY } from '@/lib/state/store';

import { usePlaySession } from './usePlaySession';

const problems: Problem[] = [
  {
    id: 'cr-t1',
    area: 'create',
    difficulty: 3,
    title: 'Six words',
    prompt: 'Write.',
    answer: {
      type: 'open',
      minWords: 6,
      maxWords: 6,
      authorNote: 'note'
    },
    hints: ['a', 'b', 'c'],
    solution: 'Because.',
    source: { kind: 'original' },
    status: 'published',
    tags: [],
    createdAt: '2026-01-01'
  }
];

function Harness() {
  const session = usePlaySession({
    slot: 'daily',
    key: '2030-01-01',
    problems,
    deep: false,
    settled: true,
    resolveKey: () => '2030-01-01'
  });
  if (session.phase !== 'playing' || !session.problem || !session.current) {
    return <div aria-busy="true" />;
  }
  return (
    <ProblemView
      problem={session.problem}
      position={{ index: 0, total: 1 }}
      current={session.current}
      maxHints={3}
      outcome={session.outcome}
      codeResult={null}
      busy={session.busy}
      notice={session.notice}
      onDraftChange={session.draft}
      onHint={session.hint}
      onSubmit={session.submit}
      onRun={session.run}
      onGiveUp={session.giveUp}
      onNext={session.next}
    />
  );
}

describe('invalid submissions', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('shows a notice, consumes no attempt, and clears on edit', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = await screen.findByLabelText('Six words');

    await user.type(box, 'one two');
    expect(screen.getByText('2 words')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Use exactly 6 words.')).toBeInTheDocument();
    expect(screen.queryByText('Not quite')).toBeNull();
    expect(screen.queryByText('Solved')).toBeNull();
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? '';
    expect(stored).toContain('"attempts":0');
    expect(stored).not.toContain('"result":"');

    await user.type(box, ' x');
    expect(screen.queryByText('Use exactly 6 words.')).toBeNull();
  });
});

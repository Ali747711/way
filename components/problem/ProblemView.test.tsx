import { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ProblemView, {
  type Outcome,
  type ProblemViewProps
} from '@/components/problem/ProblemView';
import type { Problem } from '@/lib/content/schema';
import type { Current } from '@/lib/state/schema';

function makeProblem(overrides: Partial<Problem> = {}): Problem {
  return {
    id: 'l-001',
    area: 'logic',
    difficulty: 2,
    title: 'Missing number',
    prompt: 'What comes next?',
    answer: { type: 'exact', accepted: ['5'], normalize: 'trim-lower' },
    hints: ['First hint', 'Second hint', 'Third hint'],
    solution: 'Because of **reasons**.',
    source: { kind: 'original' },
    status: 'published',
    tags: [],
    createdAt: '2026-01-01',
    ...overrides
  };
}

function makeCurrent(overrides: Partial<Current> = {}): Current {
  return {
    attempts: 0,
    hints: 0,
    draft: '',
    startedAt: 0,
    result: null,
    ...overrides
  };
}

function setup(overrides: Partial<ProblemViewProps> = {}) {
  const handlers = {
    onDraftChange: vi.fn(),
    onHint: vi.fn(),
    onSubmit: vi.fn(),
    onRun: vi.fn(),
    onGiveUp: vi.fn(),
    onNext: vi.fn()
  };
  const props: ProblemViewProps = {
    problem: makeProblem(),
    position: { index: 2, total: 5 },
    current: makeCurrent(),
    maxHints: 3,
    outcome: null,
    codeResult: null,
    busy: false,
    ...handlers,
    ...overrides
  };
  const user = userEvent.setup();
  render(<ProblemView {...props} />);
  return { user, ...handlers };
}

describe('ProblemView', () => {
  it('shows position and area', () => {
    setup();
    expect(screen.getByText('3 of 5')).toBeInTheDocument();
    expect(screen.getByText('Logic')).toBeInTheDocument();
  });

  it('reveals hints in order and caps the button', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [hints, setHints] = useState(0);
      return (
        <ProblemView
          problem={makeProblem()}
          position={{ index: 0, total: 1 }}
          current={makeCurrent({ hints })}
          maxHints={3}
          outcome={null}
          codeResult={null}
          busy={false}
          onDraftChange={vi.fn()}
          onHint={() => setHints((h) => h + 1)}
          onSubmit={vi.fn()}
          onRun={vi.fn()}
          onGiveUp={vi.fn()}
          onNext={vi.fn()}
        />
      );
    }
    render(<Harness />);
    expect(screen.queryByText('First hint')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hint 1 of 3' }));
    expect(screen.getByText('First hint')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hint 2 of 3' }));
    await user.click(screen.getByRole('button', { name: 'Hint 3 of 3' }));
    expect(screen.getByText('Third hint')).toBeInTheDocument();
    const capped = screen.getByRole('button', { name: 'Hint 3 of 3' });
    expect(capped).toBeDisabled();
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual(['First hint', 'Second hint', 'Third hint']);
  });

  it('shows Not quite with attempts left', () => {
    const outcome: Outcome = { kind: 'wrong', attemptsLeft: 2 };
    setup({ outcome });
    expect(
      screen.getByRole('heading', { name: 'Not quite' })
    ).toBeInTheDocument();
    expect(screen.getByText('2 attempts left')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('uses the singular at one attempt left', () => {
    setup({ outcome: { kind: 'wrong', attemptsLeft: 1 } });
    expect(screen.getByText('1 attempt left')).toBeInTheDocument();
  });

  it('confirms before giving up', async () => {
    const { user, onGiveUp } = setup();
    await user.click(screen.getByRole('button', { name: 'Give up' }));
    expect(
      await screen.findByText("Show the solution? You can't retry today.")
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Keep trying' }));
    expect(onGiveUp).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Give up' }));
    await user.click(
      await screen.findByRole('button', { name: 'Show solution' })
    );
    expect(onGiveUp).toHaveBeenCalledTimes(1);
  });

  it('shows the solution and Next when solved', async () => {
    const { user, onNext } = setup({
      outcome: { kind: 'solved' },
      current: makeCurrent({ result: 'solved' })
    });
    expect(screen.getByRole('heading', { name: 'Solved' })).toBeInTheDocument();
    expect(screen.getByText('reasons')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Submit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Give up' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders choice options as buttons and selects one', async () => {
    const { user, onDraftChange } = setup({
      problem: makeProblem({
        answer: { type: 'choice', options: ['a', 'b', 'c'], correctIndex: 0 }
      })
    });
    await user.click(screen.getByRole('button', { name: 'b' }));
    expect(onDraftChange).toHaveBeenCalledWith('1');
  });

  it('shows Run and code results only for code problems', async () => {
    const codeProblem = makeProblem({
      area: 'code',
      answer: {
        type: 'code',
        signature: 'function f(x) {}',
        entry: 'f',
        examples: [{ input: [1], expected: 2 }],
        tests: [{ input: [1], expected: 2 }],
        timeLimitMs: 2000,
        reference: ''
      }
    });
    const codeResult = {
      passed: 1,
      total: 2,
      timedOut: false,
      firstFailure: { index: 1, input: [3], expected: 6, actual: 5 }
    };
    const { user, onRun } = setup({ problem: codeProblem, codeResult });
    expect(screen.getByText('passed 1 of 2')).toBeInTheDocument();
    expect(screen.getByText(/Expected/)).toHaveTextContent('6');
    expect(screen.getByText(/Actual/)).toHaveTextContent('5');
    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('hides Run for non-code problems', () => {
    setup();
    expect(
      screen.queryByRole('button', { name: 'Run' })
    ).not.toBeInTheDocument();
  });

  it('submits on Enter for a text field', async () => {
    const { user, onSubmit } = setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Missing number' }),
      '{Enter}'
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('asks for a hint on ? outside fields only', async () => {
    const { user, onHint } = setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Missing number' }),
      '?'
    );
    expect(onHint).not.toHaveBeenCalled();
    await user.click(document.body);
    await user.keyboard('?');
    expect(onHint).toHaveBeenCalledTimes(1);
  });
});

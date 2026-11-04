import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LocaleProvider from '@/components/i18n/LocaleProvider';
import ProblemView, {
  type ProblemViewProps
} from '@/components/problem/ProblemView';
import type { Problem } from '@/lib/content/schema';

const problem: Problem = {
  id: 'l-001',
  area: 'logic',
  difficulty: 2,
  title: 'Missing number',
  prompt: 'What comes next?',
  answer: { type: 'choice', options: ['a', 'b'], correctIndex: 0 },
  hints: ['First hint', 'Second hint', 'Third hint'],
  solution: 'Because of **reasons**.',
  source: { kind: 'original' },
  status: 'published',
  tags: [],
  createdAt: '2026-01-01'
};

const props = (over: Partial<ProblemViewProps> = {}): ProblemViewProps => ({
  problem,
  position: { index: 1, total: 5 },
  current: {
    attempts: 0,
    hints: 1,
    draft: '',
    startedAt: 0,
    result: null
  },
  maxHints: 3,
  outcome: null,
  codeResult: null,
  busy: false,
  onDraftChange: vi.fn(),
  onHint: vi.fn(),
  onSubmit: vi.fn(),
  onRun: vi.fn(),
  onGiveUp: vi.fn(),
  onNext: vi.fn(),
  ...over
});

describe('ProblemView in Uzbek', () => {
  it('shows Uzbek controls around the English problem', () => {
    render(
      <LocaleProvider locale="uz">
        <ProblemView {...props()} />
      </LocaleProvider>
    );
    expect(screen.getByText('Mantiq')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Yuborish' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Taslim boʻlish' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Maslahat 2 / 3' })
    ).toBeInTheDocument();
    expect(screen.getByText('Xato haqida xabar berish')).toBeInTheDocument();
  });

  it('marks the problem content as English for screen readers', () => {
    render(
      <LocaleProvider locale="uz">
        <ProblemView
          {...props({ outcome: { kind: 'wrong', attemptsLeft: 1 } })}
        />
      </LocaleProvider>
    );
    expect(
      screen.getByRole('heading', { name: 'Missing number' })
    ).toHaveAttribute('lang', 'en');
    expect(
      screen.getByText('What comes next?').closest('[lang]')
    ).toHaveAttribute('lang', 'en');
    expect(screen.getByText('First hint').closest('ol')).toHaveAttribute(
      'lang',
      'en'
    );
    expect(
      screen.getByRole('group', { name: 'Missing number' })
    ).toHaveAttribute('lang', 'en');
    expect(screen.getByText('Hali emas')).toBeInTheDocument();
    expect(screen.getByText('1 ta urinish qoldi')).toBeInTheDocument();
  });

  it('adds no lang attributes on the English page', () => {
    render(<ProblemView {...props()} />);
    expect(
      screen.getByRole('heading', { name: 'Missing number' })
    ).not.toHaveAttribute('lang');
  });
});

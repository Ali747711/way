import { describe, expect, it } from 'vitest';

import type { Problem } from '@/lib/content/schema';

import { approveProblems, rejectProblems, renderReviewSheet } from './review';

const base = (id: string, overrides: Partial<Problem> = {}): Problem => ({
  id,
  area: 'math',
  difficulty: 3,
  title: `Title ${id}`,
  prompt: 'How many?',
  answer: { type: 'number', value: 7, tolerance: 0 },
  hints: ['A?', 'B?', 'C?'],
  solution: '**7.**',
  source: { kind: 'generated', attribution: 'template:math/x:k' },
  status: 'verified',
  tags: [],
  createdAt: '2026-11-05',
  ...overrides
});

describe('renderReviewSheet', () => {
  it('lists every problem with its answer, hints and an approve command', () => {
    const sheet = renderReviewSheet([
      base('m-007'),
      base('w-002', {
        area: 'words',
        difficulty: 1,
        answer: { type: 'exact', accepted: ['tide'], normalize: 'trim-lower' }
      })
    ]);
    expect(sheet).toContain('# Problems to review (2)');
    expect(sheet).toContain('npm run content:approve -- --ids w-002,m-007');
    expect(sheet).toContain('**7**');
    expect(sheet).toContain('Accepted: **tide**');
    expect(sheet).toContain('1. A?');
    expect(sheet).toContain('template:math/x:k');
    expect(sheet).toContain('content:reject');
  });

  it('shows the Math solver when there is one', () => {
    const sheet = renderReviewSheet([base('m-007', { solver: 'return 7;' })]);
    expect(sheet).toContain('### Solver (recomputes the answer)');
    expect(sheet).toContain('return 7;');
  });

  it('describes choice, code and open answers', () => {
    const sheet = renderReviewSheet([
      base('l-001', {
        area: 'logic',
        difficulty: 2,
        answer: { type: 'choice', options: ['yes', 'no'], correctIndex: 1 }
      }),
      base('c-009', {
        area: 'code',
        answer: {
          type: 'code',
          signature: 'function f(n) {\n  \n}',
          entry: 'f',
          examples: [{ input: [1], expected: 1 }],
          tests: [{ input: [2], expected: 2 }],
          timeLimitMs: 2000,
          reference: 'function f(n) { return n; }'
        }
      }),
      base('cr-009', {
        area: 'create',
        answer: {
          type: 'open',
          minWords: 10,
          maxWords: 20,
          authorNote: 'n',
          constraints: [{ type: 'no-letter', letter: 'e' }],
          example: 'x'
        }
      }),
      base('cr-010', {
        area: 'create',
        answer: { type: 'open', authorNote: 'n' }
      })
    ]);
    expect(sheet).toContain('✅ no');
    expect(sheet).toContain('Hidden tests (1):');
    expect(sheet).toContain('- `f(2)` → `2`');
    expect(sheet).toContain('10 to 20 words; checked rules: no-letter');
    expect(sheet).toContain('Author note (shown after submitting): n');
    expect(sheet).toContain('no word limit');
  });

  it('puts deep problems last', () => {
    const sheet = renderReviewSheet([
      base('d-002', { difficulty: 5 }),
      base('m-009')
    ]);
    expect(sheet.indexOf('d-002 ·')).toBeGreaterThan(sheet.indexOf('m-009 ·'));
  });
});

describe('approveProblems', () => {
  const noFailures = () => [];

  it('approves verified problems and skips everything else', () => {
    const result = approveProblems(
      [
        base('m-007'),
        base('m-008', { status: 'draft' }),
        base('m-009', { status: 'published' })
      ],
      ['m-007', 'm-008', 'm-009', 'm-404', 'm-007'],
      noFailures
    );
    expect(result.changed.map((p) => [p.id, p.status])).toEqual([
      ['m-007', 'approved']
    ]);
    expect(result.skipped).toEqual([
      { id: 'm-008', reason: 'status is draft' },
      { id: 'm-009', reason: 'status is published' },
      { id: 'm-404', reason: 'unknown id' }
    ]);
  });

  it('refuses a verified problem that no longer passes its checks', () => {
    const result = approveProblems([base('m-007')], ['m-007'], () => [
      'solver: wrong'
    ]);
    expect(result.changed).toEqual([]);
    expect(result.skipped).toEqual([
      { id: 'm-007', reason: 'fails checks: solver: wrong' }
    ]);
  });
});

describe('rejectProblems', () => {
  it('rejects drafts, verified and approved problems only', () => {
    const result = rejectProblems(
      [
        base('m-007', { status: 'draft' }),
        base('m-008'),
        base('m-009', { status: 'approved' }),
        base('m-010', { status: 'published' }),
        base('m-011', { status: 'rejected' })
      ],
      ['m-007', 'm-008', 'm-009', 'm-010', 'm-011']
    );
    expect(result.changed.map((p) => p.status)).toEqual([
      'rejected',
      'rejected',
      'rejected'
    ]);
    expect(result.skipped.map((s) => s.id)).toEqual(['m-010', 'm-011']);
  });
});

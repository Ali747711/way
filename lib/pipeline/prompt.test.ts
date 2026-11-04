import { describe, expect, it } from 'vitest';

import type { Problem } from '@/lib/content/schema';

import {
  buildGenerationPrompt,
  draftSchema,
  idPrefixFor,
  nextId
} from './prompt';

const example: Problem = {
  id: 'w-001',
  area: 'words',
  difficulty: 1,
  title: 'Example anagram title',
  prompt: 'Unscramble LISTEN.',
  answer: { type: 'exact', accepted: ['silent'], normalize: 'trim-lower' },
  hints: ['What word uses the same letters?', 'Is it a quiet one?', 'Is it?'],
  solution: 'Rearrange the letters.',
  source: { kind: 'generated' },
  status: 'approved',
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z'
};

const req = {
  area: 'words' as const,
  difficulty: 1,
  count: 2,
  examples: [example],
  existingTitles: ['Already used title'],
  template: 'TEMPLATE-MARKER about words'
};

describe('buildGenerationPrompt', () => {
  const prompt = buildGenerationPrompt(req);

  it('includes the template, difficulty, examples and existing titles', () => {
    expect(prompt).toContain('TEMPLATE-MARKER about words');
    expect(prompt).toContain('difficulty 1');
    expect(prompt).toContain(JSON.stringify(example.title));
    expect(prompt).toContain('Already used title');
  });

  it('states the hint rule', () => {
    expect(prompt).toContain('ends with a question mark');
  });

  it('states hint count 3, or 5 for deep problems', () => {
    expect(prompt).toContain('exactly 3 hints');
    expect(buildGenerationPrompt({ ...req, difficulty: 5 })).toContain(
      'exactly 5 hints'
    );
  });

  it('says so when there are no examples', () => {
    expect(buildGenerationPrompt({ ...req, examples: [] })).toContain(
      'No examples yet; follow the schema exactly.'
    );
  });

  it('asks for exactly count problems as a JSON array', () => {
    expect(prompt).toContain('exactly 2 problems');
    expect(prompt).toContain('JSON array');
  });
});

describe('draftSchema', () => {
  it('omits server-assigned fields', () => {
    expect(Object.keys(draftSchema.shape)).not.toContain('id');
    expect(Object.keys(draftSchema.shape)).not.toContain('status');
    expect(Object.keys(draftSchema.shape)).toContain('title');
  });
});

describe('nextId', () => {
  it('uses the max numeric suffix for the prefix plus one', () => {
    expect(nextId('w', ['w-001', 'w-007', 'l-009'])).toBe('w-008');
  });
  it('starts at 001', () => {
    expect(nextId('d', [])).toBe('d-001');
  });
  it('does not confuse prefixes sharing a letter', () => {
    expect(nextId('c', ['cr-005', 'c-002'])).toBe('c-003');
  });
});

describe('idPrefixFor', () => {
  it('uses the deep prefix at difficulty 5', () => {
    expect(idPrefixFor('math', 5)).toBe('d');
  });
  it('uses the area prefix otherwise', () => {
    expect(idPrefixFor('math', 3)).toBe('m');
    expect(idPrefixFor('create', 4)).toBe('cr');
  });
});

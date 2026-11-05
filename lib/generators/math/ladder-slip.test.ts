import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerFor, ladderSlip } from './ladder-slip';
import { answerOf, promptsOf } from './test-utils';

describe('math/ladder-slip', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(ladderSlip)).toEqual([]);
  });

  it('matches the 7-24-25 and 15-20-25 triangles', () => {
    // Foot 7 gives height 24; foot 15 gives height 20: slip 4, slide 8.
    expect(answerFor({ length: 25, start: 7, end: 15, mode: 'foot' })).toBe(8);
    expect(answerFor({ length: 25, start: 7, end: 15, mode: 'top' })).toBe(4);
    // Foot 15 to foot 20: height 20 to 15, slip 5.
    expect(answerFor({ length: 25, start: 15, end: 20, mode: 'top' })).toBe(5);
  });

  it('keeps every generated ladder to whole-number triangles', () => {
    for (const { key } of ladderSlip.candidates()) {
      const [length, start, end] = key.split('-').map(Number);
      for (const foot of [start, end]) {
        const height = Math.sqrt(length * length - foot * foot);
        expect(Number.isInteger(height)).toBe(true);
      }
    }
    expect(ladderSlip.candidates().length).toBeGreaterThanOrEqual(10);
  });

  it('never repeats the ladder already in the bank', () => {
    const keys = ladderSlip.candidates().map((c) => c.key);
    expect(keys).not.toContain('25-7-15-foot');
  });

  it('never ends in a scaled 7-24-25 triangle (published m-004)', () => {
    for (const { key } of ladderSlip.candidates()) {
      const [length, start, end] = key.split('-').map(Number);
      if (length % 25 !== 0) continue;
      const k = length / 25;
      for (const foot of [start, end]) {
        expect([7 * k, 24 * k]).not.toContain(foot);
      }
    }
  });

  it('varies the story', () => {
    const key = ladderSlip.candidates()[0].key;
    expect(promptsOf(ladderSlip, key).size).toBeGreaterThan(1);
    expect(answerOf(ladderSlip, key)).toBeGreaterThan(0);
  });
});

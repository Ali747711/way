import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { handshakes } from './handshakes';
import { answerOf, promptsOf } from './test-utils';

describe('math/handshakes', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(handshakes)).toEqual([]);
  });

  it('matches small cases counted by hand', () => {
    // 6 couples, 12 people: 66 pairs, minus 6 partner pairs.
    expect(answerOf(handshakes, 'couples-6')).toBe(60);
    // 66 games means 12 teams (12 x 11 / 2).
    expect(answerOf(handshakes, 'once-reverse-11')).toBe(11);
  });

  it('keeps reverse problems consistent with their forward counts', () => {
    const reverse = handshakes
      .candidates()
      .filter((c) => c.key.includes('reverse'));
    expect(reverse.length).toBeGreaterThanOrEqual(6);
    for (const { key } of reverse) {
      const n = Number(key.split('-').pop());
      expect(answerOf(handshakes, key)).toBe(n);
    }
  });

  it('has enough candidates and varied stories', () => {
    expect(handshakes.candidates().length).toBeGreaterThanOrEqual(12);
    expect(promptsOf(handshakes, 'once-reverse-11').size).toBeGreaterThan(1);
  });
});

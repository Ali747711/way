import { describe, expect, it } from 'vitest';

import { EMPTY_STATE, type WayState } from './schema';
import { loadState, saveState, STORAGE_KEY } from './store';

const storageWith = (value: string | null) => ({ getItem: () => value });

describe('loadState', () => {
  it('returns EMPTY_STATE when nothing is stored', () => {
    expect(loadState(storageWith(null))).toEqual(EMPTY_STATE);
  });
  it('returns EMPTY_STATE for invalid JSON', () => {
    expect(loadState(storageWith('{not json'))).toEqual(EMPTY_STATE);
  });
  it('returns EMPTY_STATE for a schema failure', () => {
    expect(loadState(storageWith('{"version":0}'))).toEqual(EMPTY_STATE);
  });
  it('returns a copy callers can mutate without corrupting EMPTY_STATE', () => {
    const loaded = loadState(storageWith(null));
    expect(loaded).not.toBe(EMPTY_STATE);
    expect(loaded.records).not.toBe(EMPTY_STATE.records);
  });
});

describe('saveState', () => {
  it('round-trips through loadState under STORAGE_KEY', () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v)
    };
    const state: WayState = {
      version: 1,
      daily: {
        key: '2030-01-01',
        index: 2,
        current: {
          attempts: 1,
          hints: 1,
          draft: 'x',
          startedAt: 5,
          result: null
        }
      },
      deep: null,
      records: {
        'w-001': {
          area: 'words',
          status: 'solved',
          attempts: 1,
          hints: 0,
          date: '2030-01-01',
          seconds: 12
        }
      }
    };
    saveState(storage, state);
    expect(data.has(STORAGE_KEY)).toBe(true);
    expect(loadState(storage)).toEqual(state);
  });
});

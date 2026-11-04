import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { EMPTY_STATE } from './schema';
import { STORAGE_KEY } from './store';
import { useWayState } from './useWayState';

describe('useWayState', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('is null on the first render and loaded after the effect', () => {
    const seen: Array<unknown> = [];
    const { result } = renderHook(() => {
      const value = useWayState();
      seen.push(value.state);
      return value;
    });
    expect(seen[0]).toBeNull();
    expect(result.current.state).toEqual(EMPTY_STATE);
  });

  it('update applies the reducer and persists under STORAGE_KEY', () => {
    const { result } = renderHook(() => useWayState());
    act(() => {
      result.current.update((s) => ({
        ...s,
        records: {
          'w-001': {
            area: 'words',
            status: 'solved',
            attempts: 0,
            hints: 0,
            date: '2030-01-01',
            seconds: 3
          }
        }
      }));
    });
    expect(result.current.state?.records['w-001']?.status).toBe('solved');
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(stored.records['w-001'].seconds).toBe(3);
  });

  it('loads previously stored state', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...EMPTY_STATE, deep: null })
    );
    const { result } = renderHook(() => useWayState());
    expect(result.current.state).toEqual(EMPTY_STATE);
  });
});

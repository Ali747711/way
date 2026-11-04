'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { EMPTY_STATE, type WayState } from './schema';
import { loadState, saveState } from './store';

type Update = (fn: (s: WayState) => WayState) => void;

/** localStorage can throw (blocked, private mode); the app then runs in memory. */
const getStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const useWayState = (): { state: WayState | null; update: Update } => {
  const [state, setState] = useState<WayState | null>(null);
  const latest = useRef<WayState | null>(null);

  useEffect(() => {
    const storage = getStorage();
    const loaded = storage
      ? loadState(storage)
      : { ...EMPTY_STATE, records: {} };
    latest.current = loaded;
    // Reading localStorage is only possible after mount (static export), so
    // state must be set from the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loaded);
  }, []);

  const update = useCallback<Update>((fn) => {
    if (latest.current === null) return;
    const next = fn(latest.current);
    latest.current = next;
    const storage = getStorage();
    if (storage) {
      try {
        saveState(storage, next);
      } catch {
        // Quota or blocked storage: keep the in-memory state.
      }
    }
    setState(next);
  }, []);

  return { state, update };
};

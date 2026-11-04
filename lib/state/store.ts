import { EMPTY_STATE, stateSchema, type WayState } from './schema';

export const STORAGE_KEY = 'way:state:v1';

/** Fresh copy so callers can never alias the shared EMPTY_STATE. */
const emptyCopy = (): WayState => ({ ...EMPTY_STATE, records: {} });

export const loadState = (storage: Pick<Storage, 'getItem'>): WayState => {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return emptyCopy();
    const parsed = stateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : emptyCopy();
  } catch {
    // Corrupt JSON or blocked storage: start over rather than crash the app.
    return emptyCopy();
  }
};

export const saveState = (
  storage: Pick<Storage, 'setItem'>,
  s: WayState
): void => {
  storage.setItem(STORAGE_KEY, JSON.stringify(s));
};

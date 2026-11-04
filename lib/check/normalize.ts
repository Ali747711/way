/**
 * Normalizes a submitted or accepted string before comparison.
 * `trim-lower` makes answers forgiving about case and spacing; `none` keeps
 * the text exactly as written.
 */
export const normalizeText = (
  s: string,
  mode: 'trim-lower' | 'none'
): string => {
  if (mode === 'none') {
    return s;
  }
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
};

/** Counts whitespace-separated tokens; blank text has zero words. */
export const countWords = (s: string): number => {
  const trimmed = s.trim();
  if (trimmed === '') {
    return 0;
  }
  return trimmed.split(/\s+/).length;
};

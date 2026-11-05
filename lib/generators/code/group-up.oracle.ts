// Oracle: work out how many groups there are first, then give the last one the rest.
export const oracle = ([items, size]: unknown[]): number[][] => {
  const list = items as number[];
  const step = size as number;
  if (list.length === 0) return [];
  const count = Math.max(1, Math.floor(list.length / step));
  return Array.from({ length: count }, (_, g) =>
    list.slice(g * step, g === count - 1 ? list.length : (g + 1) * step)
  );
};

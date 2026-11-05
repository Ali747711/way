// Oracle: keep an item only when its first position in the list is its own position.
export const oracle = ([names]: unknown[]): string[] =>
  (names as string[]).filter((name, i, all) => all.indexOf(name) === i);

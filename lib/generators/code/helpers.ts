import type { Rng } from '../rng';

/** A random string of `min` to `max` characters taken from `alphabet`. */
export const randomText = (
  rng: Rng,
  alphabet: string,
  min: number,
  max: number
): string =>
  Array.from({ length: rng.int(min, max) }, () =>
    alphabet.charAt(rng.int(0, alphabet.length - 1))
  ).join('');

/** `min` to `max` (length) whole numbers between `low` and `high`. */
export const randomInts = (
  rng: Rng,
  low: number,
  high: number,
  min: number,
  max: number
): number[] =>
  Array.from({ length: rng.int(min, max) }, () => rng.int(low, high));

/** `count` independent values from `make`. */
export const many = <T>(count: number, make: () => T): T[] =>
  Array.from({ length: count }, make);

/** True for a whole number from `low` to `high`. */
export const isIntIn = (x: unknown, low: number, high: number): x is number =>
  typeof x === 'number' && Number.isInteger(x) && x >= low && x <= high;

/** True for an array of 0..`maxLen` items that each pass `ok`. */
export const isListOf = (
  x: unknown,
  maxLen: number,
  ok: (item: unknown) => boolean,
  minLen = 0
): x is unknown[] =>
  Array.isArray(x) && x.length >= minLen && x.length <= maxLen && x.every(ok);

export const isText = (x: unknown, pattern: RegExp): x is string =>
  typeof x === 'string' && pattern.test(x);

/** True for a rectangular grid of up to `maxRows` rows, each `1..maxCols` long, cells passing `ok`. */
export const isGrid = (
  x: unknown,
  maxRows: number,
  maxCols: number,
  ok: (cell: unknown) => boolean
): boolean =>
  isListOf(
    x,
    maxRows,
    (row) =>
      isListOf(row, maxCols, ok, 1) &&
      row.length === (x as unknown[][])[0].length
  );

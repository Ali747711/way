const VALUE: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
};

// Oracle: spell out each subtractive pair as plain additions, then add every letter.
export const oracle = ([numeral]: unknown[]): number =>
  (numeral as string)
    .replaceAll('CM', 'DCCCC')
    .replaceAll('CD', 'CCCC')
    .replaceAll('XC', 'LXXXX')
    .replaceAll('XL', 'XXXX')
    .replaceAll('IX', 'VIIII')
    .replaceAll('IV', 'IIII')
    .split('')
    .reduce((sum, ch) => sum + VALUE[ch], 0);

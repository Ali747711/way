const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();

// Oracle: walk the alphabet one place at a time, |k| times, instead of using %.
const stepOnce = (ch: string, forward: boolean): string => {
  for (const alphabet of [LOWER, UPPER]) {
    const at = alphabet.indexOf(ch);
    if (at >= 0) {
      return alphabet[(at + (forward ? 1 : alphabet.length - 1)) % 26];
    }
  }
  return ch;
};

export const oracle = ([text, k]: unknown[]): string =>
  [...(text as string)]
    .map((ch) => {
      let out = ch;
      for (let i = 0; i < Math.abs(k as number); i++) {
        out = stepOnce(out, (k as number) > 0);
      }
      return out;
    })
    .join('');

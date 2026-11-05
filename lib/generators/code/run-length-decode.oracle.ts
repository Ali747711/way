// Oracle: one regular expression over whole runs.
export const oracle = ([s]: unknown[]): string =>
  (s as string).replace(/(\d+)([a-z])/g, (_, n: string, ch: string) =>
    ch.repeat(Number(n))
  );

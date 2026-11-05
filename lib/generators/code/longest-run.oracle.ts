// Oracle: a regular expression cuts the text into runs, then keep the first longest.
export const oracle = ([text]: unknown[]): string => {
  const runs = (text as string).match(/(.)\1*/g) ?? [];
  return runs.reduce(
    (best, run) => (run.length > best.length ? run : best),
    ''
  );
};

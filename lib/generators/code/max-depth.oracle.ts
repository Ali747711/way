// Oracle: peel off innermost "()" pairs round by round. Rounds used = depth;
// if a round removes nothing and brackets remain, the text is unmatched.
export const oracle = ([text]: unknown[]): number => {
  let rest = (text as string).replace(/[^()]/g, '');
  let rounds = 0;
  while (rest.length > 0) {
    const next = rest.replaceAll('()', '');
    if (next === rest) return -1;
    rest = next;
    rounds += 1;
  }
  return rounds;
};

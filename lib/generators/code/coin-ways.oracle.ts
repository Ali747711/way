// Oracle: recursion on "use the first coin once more" or "never use it again", with a memo.
export const oracle = ([amount, coins]: unknown[]): number => {
  const list = coins as number[];
  const memo = new Map<string, number>();
  const ways = (left: number, from: number): number => {
    if (left === 0) return 1;
    if (left < 0 || from === list.length) return 0;
    const key = `${left}/${from}`;
    const known = memo.get(key);
    if (known !== undefined) return known;
    const total = ways(left - list[from], from) + ways(left, from + 1);
    memo.set(key, total);
    return total;
  };
  return ways(amount as number, 0);
};

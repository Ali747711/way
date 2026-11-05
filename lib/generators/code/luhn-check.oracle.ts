const digitSum = (n: number): number =>
  String(n)
    .split('')
    .reduce((a, d) => a + Number(d), 0);

// Oracle: reverse the digits, double the odd positions and add the digits of each product.
export const oracle = ([digits]: unknown[]): boolean => {
  const total = (digits as string)
    .split('')
    .reverse()
    .map((ch, i) => (i % 2 === 1 ? digitSum(Number(ch) * 2) : Number(ch)))
    .reduce((a, b) => a + b, 0);
  return total % 10 === 0;
};

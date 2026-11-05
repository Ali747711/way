// Oracle: walk every minute of the day from 23:59 backwards and take the first
// time whose four digits are the same multiset as the input.
export const oracle = ([digits]: unknown[]): string => {
  const wanted = [...(digits as number[])].sort((a, b) => a - b).join('');
  for (let minute = 24 * 60 - 1; minute >= 0; minute--) {
    const hh = String(Math.floor(minute / 60)).padStart(2, '0');
    const mm = String(minute % 60).padStart(2, '0');
    const have = (hh + mm).split('').sort().join('');
    if (have === wanted) return `${hh}:${mm}`;
  }
  return '';
};

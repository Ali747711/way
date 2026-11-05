// Oracle: for each day, scan forward until a strictly warmer day is found.
export const oracle = ([temps]: unknown[]): number[] => {
  const list = temps as number[];
  return list.map((t, day) => {
    for (let later = day + 1; later < list.length; later++) {
      if (list[later] > t) return later - day;
    }
    return 0;
  });
};

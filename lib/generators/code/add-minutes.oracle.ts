const two = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

// Oracle: tick the clock one minute at a time, forwards or backwards.
export const oracle = ([time, minutes]: unknown[]): string => {
  let [h, m] = (time as string).split(':').map(Number);
  const steps = Math.abs(minutes as number);
  for (let i = 0; i < steps; i++) {
    if ((minutes as number) > 0) {
      m += 1;
      if (m === 60) {
        m = 0;
        h = (h + 1) % 24;
      }
    } else {
      m -= 1;
      if (m < 0) {
        m = 59;
        h = (h + 23) % 24;
      }
    }
  }
  return `${two(h)}:${two(m)}`;
};

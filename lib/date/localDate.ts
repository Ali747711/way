const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Parses 'YYYY-MM-DD' as a UTC midnight timestamp. All calendar math runs in
 * UTC so daylight-saving transitions cannot shift a day.
 */
const parseUtc = (date: string): number => {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

/**
 * Formats a Date as 'YYYY-MM-DD' using the local calendar, so a late-evening
 * local time is not pushed to the next day by a UTC conversion.
 */
export const toLocalDate = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Returns the ISO 8601 week key ('YYYY-Www') for a 'YYYY-MM-DD' date.
 * The week belongs to the year that contains its Thursday, which is why
 * early January dates can fall in the previous ISO year.
 */
export const isoWeekKey = (date: string): string => {
  const base = parseUtc(date);
  const weekday = new Date(base).getUTCDay() || 7; // Sunday is 7
  const thursday = base + (4 - weekday) * DAY_MS;
  const isoYear = new Date(thursday).getUTCFullYear();
  const jan1 = Date.UTC(isoYear, 0, 1);
  const week = 1 + Math.floor((thursday - jan1) / WEEK_MS);
  return `${isoYear}-W${pad(week)}`;
};

/** Returns the signed number of calendar days from `from` to `to`. */
export const daysBetween = (from: string, to: string): number =>
  Math.round((parseUtc(to) - parseUtc(from)) / DAY_MS);

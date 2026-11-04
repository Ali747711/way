import { dayFileSchema, deepFileSchema } from '@/lib/content/schema';
import type { DayFile, DeepFile } from '@/lib/content/schema';

export type FetchLike = (
  url: string
) => Promise<Pick<Response, 'ok' | 'status' | 'json'>>;

// Wrapped so the module does not capture the global fetch at import time.
const defaultFetch: FetchLike = (url) => fetch(url);

async function fetchContent<T>(
  url: string,
  parse: (body: unknown) => T,
  fetchFn: FetchLike
): Promise<T | null> {
  const res = await fetchFn(url);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`content ${res.status}`);
  }
  return parse(await res.json());
}

export const fetchDay = (
  date: string,
  fetchFn: FetchLike = defaultFetch
): Promise<DayFile | null> =>
  fetchContent(
    `/content/days/${date}.json`,
    (body) => dayFileSchema.parse(body),
    fetchFn
  );

export const fetchDeep = (
  week: string,
  fetchFn: FetchLike = defaultFetch
): Promise<DeepFile | null> =>
  fetchContent(
    `/content/deep/${week}.json`,
    (body) => deepFileSchema.parse(body),
    fetchFn
  );

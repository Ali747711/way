import type { Locale } from './types';

/** Way's pages, as their English paths. */
export type PagePath = '/' | '/deep' | '/about';

const PAGES: readonly PagePath[] = ['/', '/deep', '/about'];

const UZ_PREFIX = '/uz';

/** The URL of a page in a locale: `/deep` in Uzbek is `/uz/deep`. */
export const localeHref = (page: PagePath, locale: Locale): string => {
  if (locale === 'en') return page;
  return page === '/' ? UZ_PREFIX : `${UZ_PREFIX}${page}`;
};

/**
 * Which page a pathname shows, and in which language. Null for anything
 * that is not one of Way's pages (a 404, a file), so nothing redirects it.
 */
export const parsePagePath = (
  pathname: string
): { page: PagePath; locale: Locale } | null => {
  // A static host may serve a page with a trailing slash.
  const path = pathname.replace(/\/+$/, '') || '/';
  const isUz = path === UZ_PREFIX || path.startsWith(`${UZ_PREFIX}/`);
  const rest = isUz ? path.slice(UZ_PREFIX.length) || '/' : path;
  const page = PAGES.find((p) => p === rest);
  return page === undefined ? null : { page, locale: isUz ? 'uz' : 'en' };
};

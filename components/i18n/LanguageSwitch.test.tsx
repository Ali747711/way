import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LanguageSwitch from '@/components/i18n/LanguageSwitch';
import LocaleProvider from '@/components/i18n/LocaleProvider';
import { LOCALE_KEY } from '@/lib/i18n/choose';
import type { Locale } from '@/lib/i18n/types';

const pathname = vi.hoisted(() => ({ value: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => pathname.value
}));

const renderAt = (path: string, locale: Locale) => {
  pathname.value = path;
  render(
    <LocaleProvider locale={locale}>
      <LanguageSwitch />
    </LocaleProvider>
  );
};

afterEach(() => {
  window.localStorage.clear();
});

describe('LanguageSwitch', () => {
  it('names both languages in themselves and marks the current one', () => {
    renderAt('/about', 'en');
    const nav = screen.getByRole('navigation', { name: 'Language' });
    expect(nav).toBeInTheDocument();
    // The names contain the visible codes (label in name).
    const english = screen.getByRole('link', { name: 'English (EN)' });
    const uzbek = screen.getByRole('link', { name: 'Oʻzbekcha (UZ)' });
    expect(english).toHaveAttribute('aria-current', 'page');
    expect(uzbek).not.toHaveAttribute('aria-current');
    expect(english).toHaveTextContent('EN');
    expect(uzbek).toHaveTextContent('UZ');
    expect(uzbek).toHaveAttribute('lang', 'uz');
  });

  it('links to the same page in the other language', () => {
    renderAt('/about', 'en');
    expect(
      screen.getByRole('link', { name: 'Oʻzbekcha (UZ)' })
    ).toHaveAttribute('href', '/uz/about');
    expect(screen.getByRole('link', { name: 'English (EN)' })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('maps the Uzbek pages back to English', () => {
    renderAt('/uz/deep', 'uz');
    expect(screen.getByRole('navigation', { name: 'Til' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'English (EN)' })).toHaveAttribute(
      'href',
      '/deep'
    );
    expect(
      screen.getByRole('link', { name: 'Oʻzbekcha (UZ)' })
    ).toHaveAttribute('aria-current', 'page');
  });

  it('remembers the pick when a language is chosen', () => {
    renderAt('/', 'en');
    // jsdom does not navigate; the click handler is what is under test.
    fireEvent.click(screen.getByRole('link', { name: 'Oʻzbekcha (UZ)' }));
    expect(window.localStorage.getItem(LOCALE_KEY)).toBe('uz');
  });

  it('stays on the page when the current language is chosen', () => {
    renderAt('/uz', 'uz');
    const notPrevented = fireEvent.click(
      screen.getByRole('link', { name: 'Oʻzbekcha (UZ)' })
    );
    expect(notPrevented).toBe(false);
    expect(window.localStorage.getItem(LOCALE_KEY)).toBe('uz');
  });

  it('is reachable by keyboard', () => {
    renderAt('/', 'en');
    for (const name of ['English (EN)', 'Oʻzbekcha (UZ)']) {
      const link = screen.getByRole('link', { name });
      link.focus();
      expect(link).toHaveFocus();
    }
  });
});

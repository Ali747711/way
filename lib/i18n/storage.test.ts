import { afterEach, describe, expect, it, vi } from 'vitest';

import { LOCALE_KEY } from './choose';
import { readStoredLocale, storeLocale } from './storage';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('locale storage', () => {
  it('stores and reads the pick under way:locale', () => {
    expect(readStoredLocale()).toBeNull();
    expect(storeLocale('uz')).toBe(true);
    expect(window.localStorage.getItem(LOCALE_KEY)).toBe('uz');
    expect(readStoredLocale()).toBe('uz');
  });

  it('treats an unknown stored value as no pick', () => {
    window.localStorage.setItem(LOCALE_KEY, 'fr');
    expect(readStoredLocale()).toBeNull();
  });

  it('survives storage that throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readStoredLocale()).toBeNull();
    expect(storeLocale('en')).toBe(false);
  });
});

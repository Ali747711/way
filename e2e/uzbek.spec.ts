import { expect, test, type Page } from '@playwright/test';

const DAY_1 = new Date('2030-01-01T20:00:00');

const CORRECT_CODE =
  'function sumDigits(n) { return String(n).split("").reduce((a, c) => a + Number(c), 0); }';

const open = async (page: Page, path = '/uz'): Promise<void> => {
  await page.clock.setFixedTime(DAY_1);
  await page.goto(path);
};

const submit = (page: Page) =>
  page.getByRole('button', { name: 'Yuborish' }).click();

const next = (page: Page) =>
  page.getByRole('button', { name: 'Keyingisi', exact: true }).click();

const solveAll = async (page: Page): Promise<void> => {
  await page.getByLabel('Words puzzle 1').fill('cat');
  await submit(page);
  await expect(page.getByText('Yechildi', { exact: true })).toBeVisible();
  await next(page);

  await page.getByRole('button', { name: 'Beta' }).click();
  await submit(page);
  await next(page);

  await page.getByLabel('Math puzzle 1').fill('42');
  await submit(page);
  await next(page);

  await page.getByLabel('Code puzzle 1').fill(CORRECT_CODE);
  await submit(page);
  await expect(page.getByText('Yechildi', { exact: true })).toBeVisible();
  await next(page);

  await page.getByLabel('Create puzzle 1').fill('one two three');
  await submit(page);
  await next(page);
};

// The page's own URL path, whatever the base URL.
const pathOf = (page: Page): string => new URL(page.url()).pathname;

test.describe('Uzbek interface', () => {
  test('/uz opens on the problem with Uzbek controls', async ({ page }) => {
    await open(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'uz');
    await expect(page.getByText('1 / 5')).toBeVisible();
    await expect(page.getByText('Soʻzlar', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yuborish' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Maslahat 1 / 3' })
    ).toBeVisible();
    // The problem itself stays English, marked so for screen readers.
    await expect(
      page.getByRole('heading', { name: 'Words puzzle 1' })
    ).toHaveAttribute('lang', 'en');
    // The problem leads: no language switch on this screen.
    await expect(page.getByRole('navigation')).toHaveCount(0);
  });

  test('an invalid answer is explained in Uzbek', async ({ page }) => {
    await open(page);
    await submit(page);
    await expect(page.getByText('Avval javob yozing.')).toBeVisible();
    await page.getByLabel('Words puzzle 1').fill('dog');
    await submit(page);
    await expect(page.getByText('Hali emas')).toBeVisible();
    await expect(page.getByText('2 ta urinish qoldi')).toBeVisible();
  });

  test('solving the set reaches Done in Uzbek', async ({ page }) => {
    await open(page);
    await solveAll(page);
    await expect(
      page.getByRole('heading', { name: 'Bugungisi shu.' })
    ).toBeVisible();
    await expect(page.getByText(/5\s+tadan 5\s+tasi yechildi/)).toBeVisible();
    await expect(page.getByText('Ertaga qaytib keling.')).toBeVisible();
    await expect(page.getByText('oxirgi: bugun')).toHaveCount(5);
    await expect(
      page.getByRole('link', { name: 'Shu haftaning chuqur masalasi' })
    ).toHaveAttribute('href', '/uz/deep');
    const switcher = page.getByRole('navigation', { name: 'Til' });
    await expect(
      switcher.getByRole('link', { name: 'Oʻzbekcha (UZ)' })
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      switcher.getByRole('link', { name: 'English (EN)' })
    ).toHaveAttribute('href', '/');
  });

  test('the deep problem plays in Uzbek', async ({ page }) => {
    await open(page, '/uz/deep');
    await expect(page.locator('html')).toHaveAttribute('lang', 'uz');
    await expect(page.getByText('Chuqur', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Maslahat 1 / 5' })
    ).toBeVisible();
  });

  test('the About switch goes to English and the pick sticks', async ({
    page
  }) => {
    await open(page, '/uz/about');
    await expect(page.locator('html')).toHaveAttribute('lang', 'uz');
    await expect(
      page.getByText('Masalalar hozircha ingliz tilida.')
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Oʻzbekcha (UZ)' })
    ).toHaveAttribute('aria-current', 'page');

    await page.getByRole('link', { name: 'English (EN)' }).click();
    await expect(page).toHaveURL((url) => url.pathname === '/about');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Ten seconds to thinking.')).toBeVisible();

    // The stored pick wins: /uz now sends the reader to English.
    await page.goto('/uz');
    await expect(page).toHaveURL((url) => url.pathname === '/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('1 of 5')).toBeVisible();
  });

  test('a /uz 404 speaks Uzbek as well as English', async ({ page }) => {
    await page.clock.setFixedTime(DAY_1);
    const response = await page.goto('/uz/nope');
    expect(response?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('This page could not be found.')).toBeVisible();
    const uzbek = page.locator('[lang="uz"]');
    await expect(uzbek.getByText('Sahifa topilmadi.')).toBeVisible();
    await expect(
      uzbek.getByRole('link', { name: 'Bugunga qaytish' })
    ).toHaveAttribute('href', '/uz');
  });

  test('the switch works from the keyboard', async ({ page }) => {
    await open(page, '/about');
    const uzbek = page.getByRole('link', { name: 'Oʻzbekcha (UZ)' });
    await uzbek.focus();
    await expect(uzbek).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL((url) => url.pathname === '/uz/about');
    await expect(page.getByText('Tamoyillar')).toBeVisible();

    await page.goto('/');
    await expect(page).toHaveURL((url) => url.pathname === '/uz');
    await expect(page.getByRole('button', { name: 'Yuborish' })).toBeVisible();
  });
});

test.describe('an Uzbek browser', () => {
  test.use({ locale: 'uz-UZ' });

  test('lands on /uz from / when nothing is stored', async ({ page }) => {
    await open(page, '/');
    await expect(page).toHaveURL((url) => url.pathname === '/uz');
    await expect(page.locator('html')).toHaveAttribute('lang', 'uz');
    await expect(page.getByRole('button', { name: 'Yuborish' })).toBeVisible();
  });

  test('stays in English after the switch even when storage is blocked', async ({
    page
  }) => {
    await page.addInitScript(() => {
      const setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, value: string) {
        if (key === 'way:locale') throw new Error('blocked');
        return setItem.call(this, key, value);
      };
    });
    await open(page, '/uz/about');
    await page.getByRole('link', { name: 'English (EN)' }).click();
    await expect(page).toHaveURL((url) => url.pathname === '/about');
    await expect(page.getByText('Ten seconds to thinking.')).toBeVisible();
    // Let the page hydrate and any redirect start before checking.
    await page.waitForLoadState('networkidle');
    // Arrived from Way's own page, so the browser's Uzbek is not applied.
    expect(pathOf(page)).toBe('/about');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('stays on / once English was picked', async ({ page }) => {
    await page.addInitScript(() =>
      window.localStorage.setItem('way:locale', 'en')
    );
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    expect(pathOf(page)).toBe('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

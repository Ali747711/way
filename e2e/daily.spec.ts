import { expect, test, type Page } from '@playwright/test';

const DAY_1 = new Date('2030-01-01T20:00:00');
const DAY_2 = new Date('2030-01-02T20:00:00');
const FEB_1 = new Date('2030-02-01T20:00:00');

const CORRECT_CODE =
  'function sumDigits(n) { return String(n).split("").reduce((a, c) => a + Number(c), 0); }';

const open = async (page: Page, date = DAY_1): Promise<void> => {
  await page.clock.setFixedTime(date);
  await page.goto('/');
};

const answerBox = (page: Page, title: string) => page.getByLabel(title);

const solveFirstFour = async (page: Page): Promise<void> => {
  await answerBox(page, 'Words puzzle 1').fill('cat');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Solved', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await page.getByRole('button', { name: 'Beta' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await answerBox(page, 'Math puzzle 1').fill('42');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await answerBox(page, 'Code puzzle 1').fill(CORRECT_CODE);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Solved', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
};

const solveAll = async (page: Page): Promise<void> => {
  await solveFirstFour(page);
  await answerBox(page, 'Create puzzle 1').fill('one two three');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
};

const failWords = async (page: Page): Promise<void> => {
  const box = answerBox(page, 'Words puzzle 1');
  for (const guess of ['aaa', 'bbb', 'ccc']) {
    await box.fill(guess);
    await page.getByRole('button', { name: 'Submit' }).click();
  }
  await expect(page.getByText('Out of attempts')).toBeVisible();
};

test.describe('daily play', () => {
  test('opens straight on problem 1 of 5', async ({ page }) => {
    await open(page);
    await expect(page.getByText('1 of 5')).toBeVisible();
    await expect(page.getByText('Words', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toHaveCount(0);
    await expect(page.getByRole('navigation')).toHaveCount(0);
  });

  test('solving five problems reaches Done', async ({ page }) => {
    await open(page);
    await solveAll(page);
    await expect(
      page.getByRole('heading', { name: "That's today." })
    ).toBeVisible();
    await expect(page.getByText(/Solved 5 of 5/)).toBeVisible();
    await expect(page.getByText('Come back tomorrow.')).toBeVisible();
    await expect(
      page.getByRole('link', { name: "This week's deep problem" })
    ).toHaveAttribute('href', '/deep');
  });

  test('three wrong answers show the solution as Out of attempts', async ({
    page
  }) => {
    await open(page);
    await failWords(page);
    await expect(page.getByText('Solution for Words puzzle 1.')).toBeVisible();
  });

  test('blank submission consumes no attempt', async ({ page }) => {
    await open(page);
    const box = answerBox(page, 'Words puzzle 1');
    await box.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Not quite')).toHaveCount(0);
    await page.getByRole('button', { name: 'Submit' }).click();
    await box.fill('   ');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Not quite')).toHaveCount(0);
    await failWords(page);
  });

  test('give up asks first and then shows the solution', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Give up' }).click();
    await expect(page.getByText(/Show the solution\?/)).toBeVisible();
    await page.getByRole('button', { name: 'Keep trying' }).click();
    await expect(page.getByText('Solution for Words puzzle 1.')).toHaveCount(0);
    await page.getByRole('button', { name: 'Give up' }).click();
    await page.getByRole('button', { name: 'Show solution' }).click();
    await expect(page.getByText('Solution for Words puzzle 1.')).toBeVisible();
  });

  test('hints reveal in order with a counter', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Hint 1 of 3' }).click();
    await expect(page.getByText('First hint?')).toBeVisible();
    await expect(page.getByText('Second hint?')).toHaveCount(0);
    await page.getByRole('button', { name: 'Hint 2 of 3' }).click();
    await expect(page.getByText('Second hint?')).toBeVisible();
  });

  test('reload keeps index, draft, hints, attempts and outcome', async ({
    page
  }) => {
    await open(page);
    await answerBox(page, 'Words puzzle 1').fill('wrong');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Not quite')).toBeVisible();
    await page.getByRole('button', { name: 'Hint 1 of 3' }).click();
    await answerBox(page, 'Words puzzle 1').fill('draft text');
    await page.reload();
    await expect(page.getByText('1 of 5')).toBeVisible();
    await expect(answerBox(page, 'Words puzzle 1')).toHaveValue('draft text');
    await expect(page.getByText('First hint?')).toBeVisible();
    await expect(page.getByText('Not quite')).toBeVisible();
    await expect(page.getByText('2 attempts left')).toBeVisible();
  });

  test('code: Run shows expected and actual, Timed out on an infinite loop, Submit passes', async ({
    page
  }) => {
    await open(page);
    await answerBox(page, 'Words puzzle 1').fill('cat');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Beta' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await answerBox(page, 'Math puzzle 1').fill('42');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    const code = answerBox(page, 'Code puzzle 1');
    await code.fill('function sumDigits(n) { return n; }');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(page.getByText(/Input:/)).toBeVisible();
    await expect(page.getByText(/Expected:/)).toBeVisible();
    await expect(page.getByText(/Actual:/)).toBeVisible();

    await code.fill('function sumDigits(n) { while (true) {} }');
    await page.getByRole('button', { name: 'Run' }).click();
    // The page must stay responsive while the worker spins.
    await page.getByRole('button', { name: 'Hint 1 of 3' }).click();
    await expect(page.getByText('First hint?')).toBeVisible();
    await expect(page.getByText('Timed out')).toBeVisible({ timeout: 3000 });

    await code.fill(CORRECT_CODE);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Solved', { exact: true })).toBeVisible();
  });

  test('a new date discards the unfinished set', async ({ page }) => {
    await open(page);
    await answerBox(page, 'Words puzzle 1').fill('cat');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Beta' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('3 of 5')).toBeVisible();

    await page.clock.setFixedTime(DAY_2);
    await page.reload();
    await expect(page.getByText('1 of 5')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Words puzzle 2' })
    ).toBeVisible();
  });

  test('Next after midnight moves to the new day without reload', async ({
    page
  }) => {
    await open(page);
    await answerBox(page, 'Words puzzle 1').fill('cat');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Beta' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.clock.setFixedTime(DAY_2);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('1 of 5')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Words puzzle 2' })
    ).toBeVisible();
  });

  test('follows the system dark color scheme', async ({ page }) => {
    const bg = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.emulateMedia({ colorScheme: 'light' });
    await open(page);
    const light = await bg();
    await page.emulateMedia({ colorScheme: 'dark' });
    const dark = await bg();
    expect(dark).not.toBe(light);
  });

  test('an unscheduled date shows Nothing scheduled for today.', async ({
    page
  }) => {
    await open(page, FEB_1);
    await expect(page.getByText('Nothing scheduled for today.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'About Way' })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  test('Done shows the area map with last: today', async ({ page }) => {
    await open(page);
    await solveAll(page);
    await expect(page.getByText('last: today')).toHaveCount(5);
    await expect(page.locator('[data-tone="fresh"]')).toHaveCount(5);
  });
});

test.describe('phone width', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('plays at phone width with no horizontal scroll', async ({ page }) => {
    await open(page);
    await expect(page.getByText('1 of 5')).toBeVisible();
    const width = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(width).toBeLessThanOrEqual(375);
    await expect(page.getByRole('button', { name: 'Submit' })).toBeInViewport();
  });
});

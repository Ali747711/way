import { expect, test } from '@playwright/test';

const DAY_1 = new Date('2030-01-01T20:00:00');

test.describe('deep and about', () => {
  test('deep problem plays with five hints and unlimited attempts', async ({
    page
  }) => {
    await page.clock.setFixedTime(DAY_1);
    await page.goto('/deep');
    await expect(page.getByText('Hint 1 of 5')).toBeVisible();

    const box = page.getByLabel('Deep puzzle');
    for (const guess of ['1', '2']) {
      await box.fill(guess);
      await page.getByRole('button', { name: 'Submit' }).click();
    }
    await expect(page.getByText('Out of attempts')).toHaveCount(0);

    await box.fill('99');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Solved', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText("That's this week.")).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Back to today' })
    ).toHaveAttribute('href', '/');
  });

  test('about page renders the principles', async ({ page }) => {
    await page.clock.setFixedTime(DAY_1);
    await page.goto('/about');
    await expect(
      page.getByRole('heading', { name: 'Way', exact: true })
    ).toBeVisible();
    await expect(page.getByText('Ten seconds to thinking.')).toBeVisible();
  });
});

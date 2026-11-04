import { expect, test } from '@playwright/test';

const DAY_1 = new Date('2030-01-01T20:00:00');

test('an invalid open answer explains itself, then a valid one solves', async ({
  page
}) => {
  await page.clock.setFixedTime(DAY_1);
  await page.goto('/');

  // Walk to the Create problem (5th of 5), solving the first four.
  await page.getByLabel('Words puzzle 1').fill('cat');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Beta' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Math puzzle 1').fill('42');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Give up' }).click();
  await page.getByRole('button', { name: 'Show solution' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  const box = page.getByLabel('Create puzzle 1');
  await box.fill('only two');
  await expect(page.getByText('2 words')).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Use at least 3 words.')).toBeVisible();
  await expect(page.getByText('Solved', { exact: true })).toHaveCount(0);

  await box.fill('one two three');
  await expect(page.getByText('Use at least 3 words.')).toHaveCount(0);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Solved', { exact: true })).toBeVisible();
});

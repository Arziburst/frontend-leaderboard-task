import { test, expect } from '@playwright/test';

test.describe('Racing Leaderboard', () => {
  test('page loads and shows leaderboard with initial rows', async ({ page }) => {
    await page.goto('/');

    const leaderboard = page.getByRole('region', { name: 'Racing leaderboard' });
    await expect(leaderboard).toBeVisible();

    const firstRow = leaderboard.locator('button.leaderboard-row').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    const rowCount = await leaderboard.locator('button.leaderboard-row').count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  test('clicking a row selects it with purple highlight', async ({ page }) => {
    await page.goto('/');

    const leaderboard = page.getByRole('region', { name: 'Racing leaderboard' });
    const firstRow = leaderboard.locator('button.leaderboard-row').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    await firstRow.click();
    await expect(firstRow).toHaveClass(/bg-purple-50/);

    await firstRow.click();
    await expect(firstRow).not.toHaveClass(/bg-purple-50/);
  });

  test('scrolling near bottom loads more rows', async ({ page }) => {
    await page.goto('/');

    const scrollContainer = page.getByTestId('leaderboard-scroll');
    await expect(scrollContainer).toBeVisible({ timeout: 15000 });

    const listInner = page.getByTestId('leaderboard-virtual-list');
    const heightBefore = await listInner.evaluate((el) => el.getBoundingClientRect().height);

    await scrollContainer.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await page.waitForTimeout(6000);

    const heightAfter = await listInner.evaluate((el) => el.getBoundingClientRect().height);
    expect(heightAfter).toBeGreaterThan(heightBefore);
  });
});

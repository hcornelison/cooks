import { test, expect } from '@playwright/test';

test('searching by ingredient finds the recipe and links to its page', async ({ page }) => {
  await page.goto('/search');
  await page.locator('#search-input').fill('walnut');

  const result = page.locator('#search-results .recipe-card', { hasText: "Heath's Banana Nut Bread" });
  await expect(result).toBeVisible();

  await result.click();
  await expect(page).toHaveURL(/\/recipes\/banana-nut-bread\/?$/);
});

test('clearing the query clears results, and a nonsense query returns nothing', async ({ page }) => {
  await page.goto('/search');
  const input = page.locator('#search-input');
  const results = page.locator('#search-results .recipe-card');

  await input.fill('banana');
  await expect(results.first()).toBeVisible();

  await input.fill('');
  await expect(results).toHaveCount(0);

  await input.fill('zzzznotarealingredientzzzz');
  await expect(results).toHaveCount(0);
});

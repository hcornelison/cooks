import { test, expect } from '@playwright/test';

test('header icons navigate to search and categories, and the wordmark returns home', async ({ page }) => {
  await page.goto('/');
  // Scoped to the header: the footer repeats "Search"/"Categories" as plain
  // text links, which would otherwise make these locators ambiguous.
  const header = page.locator('.site-header-inner');

  await header.getByRole('link', { name: 'Search' }).click();
  await expect(page).toHaveURL(/\/search\/?$/);

  await header.getByRole('link', { name: 'Categories' }).click();
  await expect(page).toHaveURL(/\/categories\/?$/);

  await header.getByRole('link', { name: 'Recipes' }).click();
  await expect(page).toHaveURL(/\/$/);
});

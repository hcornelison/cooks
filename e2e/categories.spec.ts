import { test, expect } from '@playwright/test';

test('lists recipes under each tag, and a recipe link navigates to its page', async ({ page }) => {
  await page.goto('/categories');

  const breadsSection = page.locator('.tag-section', { has: page.locator('h2', { hasText: 'Breads' }) });
  const link = breadsSection.getByRole('link', { name: "Heath's Banana Nut Bread" });
  await expect(link).toBeVisible();

  await link.click();
  await expect(page).toHaveURL(/\/recipes\/banana-nut-bread\/?$/);
  await expect(page.locator('h1.post-title')).toHaveText("Heath's Banana Nut Bread");
});

test('recipes are grouped under the right tag and not under unrelated ones', async ({ page }) => {
  await page.goto('/categories');

  const breadsSection = page.locator('.tag-section', { has: page.locator('h2', { hasText: 'Breads' }) });
  const dessertSection = page.locator('.tag-section', { has: page.locator('h2', { hasText: 'Dessert' }) });

  await expect(breadsSection.getByRole('link', { name: "Heath's Banana Nut Bread" })).toBeVisible();
  await expect(breadsSection.getByRole('link', { name: 'Butter Cream Frosting' })).toHaveCount(0);

  await expect(dessertSection.getByRole('link', { name: 'Butter Cream Frosting' })).toBeVisible();
  await expect(dessertSection.getByRole('link', { name: "Heath's Banana Nut Bread" })).toHaveCount(0);
});

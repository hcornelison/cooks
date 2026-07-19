import { test, expect } from '@playwright/test';

test('changing the scale updates quantities, leaving quantity-less ingredients unchanged', async ({ page }) => {
  await page.goto('/recipes/butter-cream-frosting');

  const butter = page.locator('.ingredients-list li[data-ingredient-text*="Sticks unsalted Butter"] .ingredient-label');
  const salt = page.locator('.ingredients-list li[data-ingredient-text="Large pinch of Salt"] .ingredient-label');

  await expect(butter).toContainText('4 Sticks unsalted Butter');
  await expect(salt).toHaveText('Large pinch of Salt');

  await page.locator('.select-scale select').selectOption('2');

  await expect(butter).toContainText('8 Sticks unsalted Butter');
  await expect(salt).toHaveText('Large pinch of Salt');
});

test('scaling also updates the shopping-list ("full ingredient list") view on component recipes', async ({ page }) => {
  await page.goto('/recipes/ninos-khachapuri');
  await page.getByText('View full ingredient list').click();

  const oil = page
    .locator('.full-ingredient-list .full-ingredient-group', { has: page.locator('h4', { hasText: 'Khachapuri Dough' }) })
    .locator('li[data-ingredient-text*="Sunflower or Vegetable Oil"] .ingredient-label');

  await expect(oil).toContainText('4 Tablespoons Sunflower');

  await page.locator('.select-scale select').selectOption('2');

  await expect(oil).toContainText('8 Tablespoons Sunflower');
});

test('reads the select value on load instead of assuming scale 1 (Safari tab-restore quirk)', async ({ page }) => {
  // iOS Safari can silently restore a <select>'s value (without firing a
  // `change` event) when it reloads a backgrounded tab it purged from
  // memory - see the comment in scale-recipes.js's init(). Simulate that by
  // setting the value before scale-recipes.js's own DOMContentLoaded
  // handler runs, with no `change` event involved.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const select = document.querySelector<HTMLSelectElement>('.select-scale select');
      if (select) select.value = '2';
    });
  });

  await page.goto('/recipes/banana-nut-bread');

  await expect(page.locator('li[data-ingredient-text="3 overly ripe Bananas"] .ingredient-label')).toHaveText(
    '6 overly ripe Bananas',
  );
});

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

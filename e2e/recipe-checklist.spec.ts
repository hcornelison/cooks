import { test, expect } from '@playwright/test';

test('checked state persists across a reload', async ({ page }) => {
  await page.goto('/recipes/banana-nut-bread');
  const firstIngredient = page.locator('.ingredients-list li input[type="checkbox"]').first();

  await firstIngredient.check();
  await expect(firstIngredient).toBeChecked();

  await page.reload();
  await expect(page.locator('.ingredients-list li input[type="checkbox"]').first()).toBeChecked();
});

test('clicking the row toggles the checkbox without double-toggling', async ({ page }) => {
  await page.goto('/recipes/banana-nut-bread');
  const direction = page.locator('.directions-list li').first();

  await direction.click();
  await expect(direction.locator('input[type="checkbox"]')).toBeChecked();
});

test('Clear Checks unchecks everything and the cleared state survives a reload', async ({ page }) => {
  await page.goto('/recipes/banana-nut-bread');
  const checkedItems = page.locator(
    '.ingredients-list input[type="checkbox"]:checked, .directions-list input[type="checkbox"]:checked, .notes-list input[type="checkbox"]:checked',
  );

  await page.locator('.ingredients-list li input[type="checkbox"]').first().check();
  await page.locator('.directions-list li input[type="checkbox"]').first().check();
  await page.locator('.notes-list li input[type="checkbox"]').first().check();
  await expect(checkedItems).toHaveCount(3);

  await page.getByRole('button', { name: 'Clear Checks' }).click();
  await expect(checkedItems).toHaveCount(0);

  await page.reload();
  await expect(checkedItems).toHaveCount(0);
});

test('shopping-list and per-part checkboxes for the same ingredient are independent', async ({ page }) => {
  await page.goto('/recipes/ninos-khachapuri');

  await page.getByText('View full ingredient list').click();

  const shoppingListSalt = page
    .locator('.full-ingredient-list .full-ingredient-group', { has: page.locator('h4', { hasText: 'Khachapuri Dough' }) })
    .locator('li[data-ingredient-text*="Kosher Salt"] input[type="checkbox"]');
  const perPartSalt = page
    .locator('.recipe-parts .recipe-part', { has: page.locator('.recipe-part-title', { hasText: 'Khachapuri Dough' }) })
    .locator('.ingredients-list li[data-ingredient-text*="Kosher Salt"] input[type="checkbox"]');

  await shoppingListSalt.check();
  await expect(shoppingListSalt).toBeChecked();
  await expect(perPartSalt).not.toBeChecked();
});

test('checked state is isolated per recipe', async ({ page }) => {
  await page.goto('/recipes/banana-nut-bread');
  await page.locator('.ingredients-list li input[type="checkbox"]').first().check();

  await page.goto('/recipes/butter-cream-frosting');
  await expect(page.locator('.ingredients-list li input[type="checkbox"]').first()).not.toBeChecked();

  await page.goto('/recipes/banana-nut-bread');
  await expect(page.locator('.ingredients-list li input[type="checkbox"]').first()).toBeChecked();
});

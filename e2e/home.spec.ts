import { test, expect } from '@playwright/test';

test('renders the recipe grid', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.recipe-card').first()).toBeVisible();
});

test('filtering by tag shows only matching recipes, and All restores the full grid', async ({ page }) => {
  await page.goto('/');
  const totalCount = await page.locator('.recipe-card').count();

  const breadsTag = page.locator('.tag-filter-btn', { hasText: 'Breads' });
  await breadsTag.click();
  await expect(breadsTag).toHaveClass(/active/);
  await expect(breadsTag).toHaveAttribute('aria-pressed', 'true');

  const visibleCards = page.locator('.recipe-card:not(.is-hidden)');
  const visibleCount = await visibleCards.count();
  expect(visibleCount).toBeGreaterThan(0);
  expect(visibleCount).toBeLessThan(totalCount);

  const tagsOfVisible = await visibleCards.evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).dataset.tags ?? ''),
  );
  for (const tags of tagsOfVisible) {
    expect(tags.split(',')).toContain('Breads');
  }

  const allTag = page.locator('.tag-filter-btn', { hasText: 'All' });
  await allTag.click();
  await expect(page.locator('.recipe-card:not(.is-hidden)')).toHaveCount(totalCount);
});

test('clicking a recipe card navigates to its recipe page', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.recipe-card', { hasText: "Heath's Banana Nut Bread" });

  await card.click();
  await expect(page).toHaveURL(/\/recipes\/banana-nut-bread\/?$/);
  await expect(page.locator('h1.post-title')).toHaveText("Heath's Banana Nut Bread");
});

test('tag filter buttons can be activated from the keyboard', async ({ page }) => {
  await page.goto('/');
  const breadsTag = page.locator('.tag-filter-btn', { hasText: 'Breads' });

  await breadsTag.focus();
  await page.keyboard.press('Enter');
  await expect(breadsTag).toHaveAttribute('aria-pressed', 'true');

  const allTag = page.locator('.tag-filter-btn', { hasText: 'All' });
  await allTag.focus();
  await page.keyboard.press(' ');
  await expect(allTag).toHaveAttribute('aria-pressed', 'true');
  await expect(breadsTag).toHaveAttribute('aria-pressed', 'false');
});

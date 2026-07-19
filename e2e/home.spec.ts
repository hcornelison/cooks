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

import { test, expect } from '@playwright/test';

test('toggling switches the theme, and it persists across a reload', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.getByRole('link', { name: 'Theme' });

  await toggle.click();
  const themeAfterFirstClick = await html.getAttribute('data-theme');
  expect(['light', 'dark']).toContain(themeAfterFirstClick);

  await toggle.click();
  const themeAfterSecondClick = await html.getAttribute('data-theme');
  expect(themeAfterSecondClick).not.toBe(themeAfterFirstClick);
  expect(['light', 'dark']).toContain(themeAfterSecondClick);

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', themeAfterSecondClick!);
});

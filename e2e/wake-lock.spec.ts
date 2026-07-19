import { test, expect } from '@playwright/test';

test('button visibility and toggling follow Wake Lock API support', async ({ page }) => {
  await page.goto('/recipes/banana-nut-bread');
  const supported = await page.evaluate(() => 'wakeLock' in navigator);
  const button = page.locator('#wake-lock-toggle');

  if (!supported) {
    await expect(button).toBeHidden();
    return;
  }

  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('aria-pressed', 'false');

  await button.click();

  // The lock request can succeed or be denied by the automation environment;
  // either way the button must land in a consistent, well-defined state.
  const pressed = await button.getAttribute('aria-pressed');
  const label = await button.locator('.wake-lock-label').textContent();
  if (pressed === 'true') {
    expect(label).toBe('Screen Staying Awake');
  } else {
    expect(pressed).toBe('false');
    expect(label).toBe('Keep Screen Awake');
  }
});

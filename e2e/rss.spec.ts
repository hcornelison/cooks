import { test, expect } from '@playwright/test';

test('serves a valid RSS feed listing recipes', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('xml');

  const body = await response.text();
  expect(body).toContain('<rss');
  expect(body).toContain('Heath&apos;s Banana Nut Bread');
  expect(body).toContain('/recipes/banana-nut-bread');
});

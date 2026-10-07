import { test, expect } from '@playwright/test';

test('deve carregar a página inicial da loja', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Verzel/i);
});
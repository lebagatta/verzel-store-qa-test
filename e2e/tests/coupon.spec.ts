import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('Validação de Cupons de Desconto', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await page.goto('/');
    
    // Adiciona um produto para ativar o carrinho e navega até ele
    const addToCartBtn = page.getByRole('button', { name: /adicionar/i }).first();
    await addToCartBtn.waitFor({ state: 'visible' });
    await addToCartBtn.click();
    await page.getByRole('link', { name: /carrinho/i }).click();
  });

  test('Deve aplicar cupom de desconto com sucesso', async ({ page }) => {
    await cartPage.applyCoupon('BEMVINDO10');
    // Verifica se a linha/label de Desconto é exibida no resumo do pedido
    await expect(page.locator('*:has-text("Desconto")').last()).toBeVisible();
  });

  test('Deve aceitar cupom em letras minúsculas ou com espaços (insensível)', async ({ page }) => {
    await cartPage.applyCoupon('  bemvindo10  ');

    await expect(page.locator('*:has-text("Desconto")').last()).toBeVisible();
  });

  test('Deve exibir mensagem de erro ao informar cupom inexistente', async ({ page }) => {
    await cartPage.applyCoupon('CUPOMINEXISTENTE');
    await expect(page.getByText(/cupom inválido|não encontrado/i)).toBeVisible();
  });

  test('Deve exibir mensagem de erro ao informar cupom expirado', async ({ page }) => {
    await cartPage.applyCoupon('VERAO2026');
    await expect(page.getByText(/cupom expirado|inválido/i)).toBeVisible();
  });
});
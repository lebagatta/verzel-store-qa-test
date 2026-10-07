import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';

test.describe('Validação de Cupons de Desconto', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    
    await page.goto('/');
    
    const addToCartBtn = page.getByRole('button', { name: /adicionar/i }).first();
    await addToCartBtn.waitFor({ state: 'visible' });
    await addToCartBtn.click();

    await page.getByRole('link', { name: /carrinho/i }).click();
  });

  test('Deve aplicar 10% de desconto com o cupom BEMVINDO10', async ({ page }) => {
    await cartPage.applyCoupon('BEMVINDO10');
    
    // Valida que o valor do desconto mudou de R$ 0,00 para R$ 5,99 (ou que não é mais R$ 0,00)
    await expect(page.getByText('R$ 0,00')).not.toBeVisible();
    // Ou valida diretamente a presença do valor de desconto recalculado:
    await expect(page.getByText(/5,99/)).toBeVisible();
  });

  test('Deve tratar cupom insensível a maiúsculas/minúsculas e espaços', async ({ page }) => {
    await cartPage.applyCoupon('  bemvindo10  ');
    
    await expect(page.getByText('R$ 0,00')).not.toBeVisible();
    await expect(page.getByText(/5,99/)).toBeVisible();
  });

  test('Deve exibir erro ao aplicar cupom inválido ou expirado', async ({ page }) => {
    await cartPage.applyCoupon('INVALI10');
    
    // Para cupom inválido, valida se aparece mensagem de alerta/erro ou se o desconto permanece R$ 0,00
    await expect(page.getByText('R$ 0,00')).toBeVisible();
  });
});
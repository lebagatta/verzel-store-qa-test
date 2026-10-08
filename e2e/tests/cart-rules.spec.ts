import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('Regras do Carrinho e Frete', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
  });

  test('Não deve permitir ultrapassar 5 unidades do mesmo produto', async ({ page }) => {
    await page.goto('/');
    const addToCartBtn = page.getByRole('button', { name: /adicionar/i }).first();
    await addToCartBtn.waitFor({ state: 'visible' });
    await addToCartBtn.click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const MAX_ALLOWED_QUANTITY = 5;

    for (let i = 1; i < MAX_ALLOWED_QUANTITY; i++) {
      if (!(await cartPage.isIncreaseButtonDisabled())) {
        await cartPage.increaseQuantity();
      }
    }

    const currentQuantity = await cartPage.getQuantityText();
    expect(currentQuantity.trim()).toBe(MAX_ALLOWED_QUANTITY.toString());

    await expect(cartPage.getIncreaseButtonLocator()).toBeDisabled();
  });

  test.describe('Análise de Valor Limite - Frete Grátis (R$ 200,00)', () => {
    
    test('Deve cobrar frete para subtotal de R$ 199,90 (abaixo do limite de R$ 200,00)', async ({ page }) => {
      await page.goto('/');
      
      // Adiciona Mochila (100,00) + Garrafa (50,00) + Boné (49,90) = R$ 199,90
      await page.locator('*:has-text("Mochila Urbana 20L")').getByRole('button', { name: /adicionar/i }).first().click();
      await page.locator('*:has-text("Garrafa Térmica 750ml")').getByRole('button', { name: /adicionar/i }).first().click();
      await page.locator('*:has-text("Boné Aba Curva")').getByRole('button', { name: /adicionar/i }).first().click();
      
      await page.getByRole('link', { name: /carrinho/i }).click();

      // Confirma que o frete cobrado é exibido
      await expect(page.getByText(/19,90/i).first()).toBeVisible();
      await expect(page.getByText(/faltam|falta/i)).toBeVisible();
    });

    test('Deve conceder frete grátis para subtotal de R$ 200,00 (limite exato)', async ({ page }) => {
      await page.goto('/');
      
      // Adiciona Mochila Urbana (R$ 100,00)
      await page.locator('*:has-text("Mochila Urbana 20L")').getByRole('button', { name: /adicionar/i }).first().click();
      await page.getByRole('link', { name: /carrinho/i }).click();

      // Incrementa para 2 unidades no carrinho (2x 100,00 = R$ 200,00)
      const increaseBtn = page.getByRole('button', { name: '+' }).or(page.locator('button:has-text("+")')).first();
      await increaseBtn.click();

      // Confirma frete grátis no valor limite exato
      await expect(page.getByText(/frete grátis|grátis/i).first()).toBeVisible();
    });

    test('Deve conceder frete grátis para subtotal acima de R$ 200,00', async ({ page }) => {
      await page.goto('/');
      
      // Adiciona Jaqueta Corta-Vento (R$ 229,90)
      await page.locator('*:has-text("Jaqueta Corta-Vento")').getByRole('button', { name: /adicionar/i }).first().click();
      await page.getByRole('link', { name: /carrinho/i }).click();

      // Confirma frete grátis para valor acima do limite
      await expect(page.getByText(/frete grátis|grátis/i).first()).toBeVisible();
    });
  });
});
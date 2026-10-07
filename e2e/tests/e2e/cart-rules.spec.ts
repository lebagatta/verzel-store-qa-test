import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';

test.describe('Regras do Carrinho e Frete', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    
    await page.goto('/');
    
    const addToCartBtn = page.getByRole('button', { name: /adicionar/i }).first();
    await addToCartBtn.waitFor({ state: 'visible' });
    await addToCartBtn.click();

    await page.getByRole('link', { name: /carrinho/i }).click();
  });

  test('Não deve permitir ultrapassar 5 unidades do mesmo produto', async ({ page }) => {
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

  test('Deve aplicar frete grátis para compras acima de R$ 200,00', async ({ page }) => {
    const FREE_SHIPPING_THRESHOLD = 200.00;
    
    const unitPrice = await cartPage.getUnitPrice(); 
    
    const requiredTotalItems = Math.ceil(FREE_SHIPPING_THRESHOLD / unitPrice);
    const clicksNeeded = requiredTotalItems - 1;

    for (let i = 0; i < clicksNeeded; i++) {
      if (!(await cartPage.isIncreaseButtonDisabled())) {
        await cartPage.increaseQuantity();
      }
    }

    await expect(cartPage.getFreeShippingLocator()).toBeVisible();
  });
});
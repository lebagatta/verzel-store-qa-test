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

    // Clica até atingir o limite de 5 unidades (inicia com 1 no carrinho)
    for (let i = 1; i < MAX_ALLOWED_QUANTITY; i++) {
      if (!(await cartPage.isIncreaseButtonDisabled())) {
        await cartPage.increaseQuantity();
      }
    }

    // 1. Valida explicitamente que a quantidade real exibida na UI é de 5 unidades
    const currentQuantity = await cartPage.getQuantityText();
    expect(currentQuantity.trim()).toBe(MAX_ALLOWED_QUANTITY.toString());

    // 2. Valida se o botão de incrementar ficou desabilitado após atingir o limite
    await expect(cartPage.getIncreaseButtonLocator()).toBeDisabled();
  });

  test('Deve aplicar frete grátis para compras acima de R$ 200,00', async ({ page }) => {
    const FREE_SHIPPING_THRESHOLD = 200.00;
    
    // Captura o preço unitário dinamicamente do Page Object Model
    const unitPrice = await cartPage.getUnitPrice(); // Ex: R$ 59,90
    
    // Cálculo explícito de quantos itens adicionais precisamos incrementar para ultrapassar R$ 200,00
    // Como o carrinho já inicia com 1 item, calculamos as adições necessárias:
    const requiredTotalItems = Math.ceil(FREE_SHIPPING_THRESHOLD / unitPrice);
    const clicksNeeded = requiredTotalItems - 1;

    for (let i = 0; i < clicksNeeded; i++) {
      if (!(await cartPage.isIncreaseButtonDisabled())) {
        await cartPage.increaseQuantity();
      }
    }

    // Valida se o frete mudou para R$ 0,00 / Grátis usando a verificação de estado do Playwright
    await expect(cartPage.getFreeShippingLocator()).toBeVisible();
  });
});
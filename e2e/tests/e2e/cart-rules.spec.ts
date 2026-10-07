import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage'; // ✅ 2 níveis
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
    // Busca o botão de incrementar pela classe ou filtrando por texto '+'
    const increaseBtn = page.locator('button').filter({ hasText: '+' }).first();

    // Aguarda o botão estar pronto na tela
    await increaseBtn.waitFor({ state: 'visible' });

    // Clica 5 vezes para tentar ultrapassar o limite (já começa em 1 unidade)
    for (let i = 0; i < 5; i++) {
      if (await increaseBtn.isEnabled()) {
        await increaseBtn.click();
        await page.waitForTimeout(200);
      }
    }

    // Valida se o botão ficou desabilitado ou se a quantidade permaneceu em 5
    await expect(increaseBtn).toBeDisabled();
  });

  test('Deve aplicar frete grátis para compras acima de R$ 200,00', async ({ page }) => {
    const increaseBtn = page.locator('button').filter({ hasText: '+' }).first();
    await increaseBtn.waitFor({ state: 'visible' });

    // Produto custa R$ 59,90. 4 unidades = R$ 239,60 (ultrapassa R$ 200,00)
    for (let i = 0; i < 3; i++) {
      if (await increaseBtn.isEnabled()) {
        await increaseBtn.click();
        await page.waitForTimeout(200);
      }
    }

    // Valida se o frete mudou para R$ 0,00 ou exibe a mensagem de Frete Grátis
    await expect(page.getByText(/r\$\s?0,00|grátis/i).first()).toBeVisible();
  });
});
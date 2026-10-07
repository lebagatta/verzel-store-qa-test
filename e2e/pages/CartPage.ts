import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly discountValue: Locator;

  constructor(page: Page) {
    this.page = page;
    // Pega o input diretamente abaixo do rótulo "Cupom de desconto" ou pelo botão próximo
    this.couponInput = page.locator('input').filter({ hasText: '' }).first(); 
    // Ou usando o botão de referência:
    this.applyCouponButton = page.getByRole('button', { name: /aplicar cupom/i });
    
    // Pega o valor do desconto na tabela "Resumo do pedido"
    this.discountValue = page.locator('p, span, td').filter({ hasText: /^R\$\s?[\d.,]+/ }).nth(1);
  }

  async goto() {
    await this.page.goto('/carrinho');
  }

  async applyCoupon(code: string) {
    // Localiza o input que fica logo antes do botão "Aplicar cupom"
    const input = this.page.locator('form, div').filter({ has: this.applyCouponButton }).locator('input');
    await input.fill(code);
    await this.applyCouponButton.click();
  }
}
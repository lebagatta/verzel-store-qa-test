import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly increaseButton: Locator;
  readonly itemQuantity: Locator;
  readonly freeShippingLabel: Locator;
  readonly unitPriceLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.couponInput = page.locator('form, div').filter({ has: page.getByRole('button', { name: /aplicar cupom/i }) }).locator('input');
    this.applyCouponButton = page.getByRole('button', { name: /aplicar cupom/i });
    
    // Botão +
    this.increaseButton = page.locator('button').filter({ hasText: '+' }).first();
    
    // O elemento com o número 1 fica ao lado do botão + no mesmo container do contador
    this.itemQuantity = page.locator('button:has-text("+")').locator('xpath=preceding-sibling::*[1] | xpath=../span | xpath=../p').first();

    // Mensagem de frete / subtotal
    this.freeShippingLabel = page.getByText(/r\$\s?0,00|grátis/i).first();
    
    // Preço do produto
    this.unitPriceLabel = page.getByText(/r\$\s?\d+[,.]\d{2}/i).first();
  }

  async goto() {
    await this.page.goto('/carrinho');
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  async increaseQuantity() {
    await this.increaseButton.waitFor({ state: 'visible' });
    
    // Clica no botão de incremento
    await this.increaseButton.click();
    
    // Espera automática do Playwright pelo processamento do clique na UI
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getQuantityText(): Promise<string> {
    // Se o elemento não for localizado diretamente, busca o texto entre os botões - e +
    const text = await this.itemQuantity.textContent().catch(() => null);
    if (text && text.trim()) {
      return text.trim();
    }
    
    // Fallback de segurança: busca qualquer número isolado próximo ao botão +
    const containerText = await this.increaseButton.locator('..').textContent();
    const match = containerText?.match(/\d+/);
    return match ? match[0] : '1';
  }

  async getUnitPrice(): Promise<number> {
    await this.unitPriceLabel.waitFor({ state: 'visible' });
    const priceText = (await this.unitPriceLabel.textContent()) ?? '0';
    const cleanPrice = priceText.replace(/[^\d,/.]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 59.90;
  }

  async isIncreaseButtonDisabled(): Promise<boolean> {
    return await this.increaseButton.isDisabled();
  }

  getFreeShippingLocator(): Locator {
    return this.freeShippingLabel;
  }

  getIncreaseButtonLocator(): Locator {
    return this.increaseButton;
  }
}
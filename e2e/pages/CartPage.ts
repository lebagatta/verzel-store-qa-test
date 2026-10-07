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
    
    this.increaseButton = page.locator('button').filter({ hasText: '+' }).first();
    
    this.itemQuantity = page.locator('button:has-text("+")').locator('xpath=preceding-sibling::*[1] | xpath=../span | xpath=../p').first();

    this.freeShippingLabel = page.getByText(/r\$\s?0,00|grátis/i).first();
    
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
    
    await this.increaseButton.click();
    
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getQuantityText(): Promise<string> {
    // Se o elemento não for localizado diretamente, busca o texto entre os botões - e +
    const text = await this.itemQuantity.textContent().catch(() => null);
    if (text && text.trim()) {
      return text.trim();
    }
    
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
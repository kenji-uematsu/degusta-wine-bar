import { test, expect } from '@playwright/test';
import { site } from '../src/data/site';

test.describe('TOPページ', () => {
  test('正常に表示され、店舗名が確認できる', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/Degusta/);
    await expect(page.locator('header .logo img')).toHaveAttribute('alt', /Degusta/);
  });

  test('主要セクションが存在する', async ({ page }) => {
    await page.goto('/');
    for (const id of ['about', 'our-style', 'menu', 'wine', 'food', 'instagram', 'space', 'access', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });
});

test.describe('アクセス情報', () => {
  test('住所・アクセス・営業時間・定休日が表示される', async ({ page }) => {
    await page.goto('/#access');
    const access = page.locator('#access');
    await expect(access).toContainText(site.address || '正式な住所は確認中です。');
    await expect(access).toContainText(site.access || '最寄り駅・道順は確認後に掲載します。');
    await expect(access).toContainText(site.hours || '正式な営業時間は確認中です。');
    await expect(access).toContainText(site.closedDays || '確認後に掲載します。');
  });

  test('電話番号が表示され、タップで発信できる', async ({ page }) => {
    test.skip(!site.phone, '電話番号が未確定のためスキップ');
    await page.goto('/#access');
    const telLink = page.locator('#access a[href^="tel:"]');
    await expect(telLink).toContainText(site.phone);
    await expect(telLink).toHaveAttribute('href', `tel:${site.phone.replace(/[^+\d]/g, '')}`);
  });

  test('Google Mapsへのリンクが存在する', async ({ page }) => {
    test.skip(!site.mapUrl, 'Google MapsのURLが未確定のためスキップ');
    await page.goto('/#access');
    const mapLink = page.locator('#access a', { hasText: 'Google Mapsで見る' });
    await expect(mapLink).toHaveAttribute('href', site.mapUrl);
    await expect(mapLink).toHaveAttribute('target', '_blank');
  });
});

test.describe('Instagram', () => {
  test('Instagramへの導線が存在する', async ({ page }) => {
    await page.goto('/#instagram');
    const section = page.locator('#instagram');
    if (site.instagramUrl) {
      const link = section.locator('a', { hasText: 'Instagram' });
      await expect(link).toHaveAttribute('href', site.instagramUrl);
      await expect(link).toHaveAttribute('target', '_blank');
    } else {
      await expect(section.locator('a')).toHaveCount(0);
    }
  });
});

test.describe('問い合わせ', () => {
  test('問い合わせセクションが存在し、CTAが操作できる', async ({ page }) => {
    await page.goto('/#contact');
    const contact = page.locator('#contact');
    await expect(contact).toBeAttached();
    await expect(contact.locator('.contact-actions')).toBeVisible();
  });
});

test.describe('予約CTA', () => {
  test('スマホ・PCともに#contactアンカーが表示される', async ({ page }) => {
    await page.goto('/');
    const anchorCta = page.locator('.hero-actions .reservation-switch a[href="#contact"]');
    await expect(anchorCta).toBeVisible();
  });
});



/**
 * TC-01 Contact Details | TC-02 Credentials | TC-03 Partners
 * TC-04 Services | TC-05 Industries | TC-08 Copyright | TC-09 Brand
 * Verifies that all factual content on the English version matches the context document.
 */
import { test, expect } from '@playwright/test';
import { SITE, PHONE, EMAIL, REG_NO, ICPAC_NO } from './helpers';

test.describe('Contact details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('phone number appears in nav CTA', async ({ page }) => {
    await expect(page.locator('.nav-cta')).toContainText(PHONE);
  });

  test('phone number links are tel: hrefs', async ({ page }) => {
    const links = page.locator(`a[href="tel:+35799444325"]`);
    // At minimum the contact section + footer link are present on all viewports
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('WhatsApp button links to correct number', async ({ page }) => {
    const waLink = page.locator(`a[href*="wa.me/35799444325"]`).first();
    await expect(waLink).toBeVisible();
  });

  test('email address is visible and correct', async ({ page }) => {
    await expect(page.locator(`a[href="mailto:${EMAIL}"]`).first()).toBeVisible();
  });

  test('contact section shows correct address', async ({ page }) => {
    const address = page.locator('#contact .detail-v').filter({ hasText: 'Sokratous' });
    await expect(address).toContainText('Mesa Geitonia');
    await expect(address).toContainText('4006');
    await expect(address).toContainText('Limassol');
  });

  test('contact section shows working hours', async ({ page }) => {
    const hours = page.locator('#contact .detail-v').filter({ hasText: '9:00' });
    await expect(hours).toContainText('Monday');
    await expect(hours).toContainText('Friday');
    await expect(hours).toContainText('18:00');
  });
});

test.describe('Company credentials', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('footer shows Registration No', async ({ page }) => {
    await expect(page.locator('.ftr-reg')).toContainText(REG_NO);
  });

  test('footer shows ICPAC Licence No', async ({ page }) => {
    await expect(page.locator('.ftr-reg')).toContainText(ICPAC_NO);
  });

  test('trust bar shows 27+ years', async ({ page }) => {
    await expect(page.locator('#trust')).toContainText('27+');
  });

  test('hero stats show ICPAC and ACCA', async ({ page }) => {
    const stats = page.locator('#hero .hero-stat-row');
    await expect(stats).toContainText('ICPAC');
    await expect(stats).toContainText('ACCA');
  });
});

test.describe('Partners', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('Andreas Rousos card is present with correct data', async ({ page }) => {
    const card = page.locator('#partners .prt-card').filter({ hasText: 'Andreas Rousos' });
    await expect(card).toContainText('17');
    await expect(card).toContainText('ACCA');
    await expect(card).toContainText('ICPAC');
  });

  test('Marios Panagiotou card is present with correct data', async ({ page }) => {
    const card = page.locator('#partners .prt-card').filter({ hasText: 'Marios Panagiotou' });
    await expect(card).toContainText('10');
    await expect(card).toContainText('ACCA');
    await expect(card).toContainText('ICPAC');
  });

  test('partner photos load without broken images', async ({ page }) => {
    const photos = page.locator('.prt-photo');
    const count = await photos.count();
    expect(count).toBe(2);
    for (let i = 0; i < count; i++) {
      const naturalWidth = await photos.nth(i).evaluate(
        (img: HTMLImageElement) => img.naturalWidth,
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Services', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('Audit & Assurance card shows all 5 sub-items', async ({ page }) => {
    const card = page.locator('#services .svc-card').filter({ hasText: 'Audit' });
    for (const item of ['Statutory Audits', 'IFRS Reporting', 'Internal Audit', 'Due Diligence', 'Risk Assessment']) {
      await expect(card).toContainText(item);
    }
  });

  test('Tax Services card shows both sub-items', async ({ page }) => {
    const card = page.locator('#services .svc-card').filter({ hasText: 'Tax Services' });
    await expect(card).toContainText('Corporate Tax Compliance');
    await expect(card).toContainText('Tax Planning');
  });
});

test.describe('Industries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  const industries = [
    'Real Estate', 'Construction', 'Shipping',
    'Technology', 'Investment Funds', 'SMEs', 'International Groups',
  ];

  for (const industry of industries) {
    test(`industry "${industry}" is listed`, async ({ page }) => {
      await expect(page.locator('#industries')).toContainText(industry);
    });
  }
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('footer shows registered address', async ({ page }) => {
    const reg = page.locator('.ftr-reg');
    await expect(reg).toContainText('1 Oktovriou 3');
    await expect(reg).toContainText('Mesa Geitonia');
    await expect(reg).toContainText('Limassol');
  });

  test('copyright line is present', async ({ page }) => {
    await expect(page.locator('.ftr-bottom')).toContainText('Notabene Accountants (CY) Limited');
    await expect(page.locator('.ftr-bottom')).toContainText('All rights reserved');
  });

  test('tagline is present', async ({ page }) => {
    await expect(page.locator('.ftr-bottom')).toContainText('Audit');
    await expect(page.locator('.ftr-bottom')).toContainText('Tax');
    await expect(page.locator('.ftr-bottom')).toContainText('Advisory');
  });

  test('no Instagram links anywhere on page', async ({ page }) => {
    const igLinks = page.locator('a[href*="instagram"]');
    await expect(igLinks).toHaveCount(0);
  });
});

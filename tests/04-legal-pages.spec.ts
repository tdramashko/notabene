/**
 * TC-10 — Legal Pages Content
 * Verifies all sections are present in privacy-policy.html and terms.html,
 * and that contact details match the context document.
 */
import { test, expect } from '@playwright/test';
import { SITE, EMAIL, REG_NO, ICPAC_NO } from './helpers';

test.describe('Privacy Policy — structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${SITE}/privacy-policy.html`);
  });

  test('page has correct H1', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('all 10 sections are present', async ({ page }) => {
    const headings = page.locator('.legal-body h2');
    await expect(headings).toHaveCount(10);
  });

  const sections = [
    'Introduction',
    'Data We Collect',
    'How We Use Your Data',
    'Legal Basis for Processing',
    'Data Retention',
    'Data Sharing',
    'Your Rights',
    'Cookies',
    'Security',
    'Contact',
  ];

  for (const section of sections) {
    test(`section "${section}" is present`, async ({ page }) => {
      await expect(page.locator('.legal-body')).toContainText(section);
    });
  }

  test('GDPR rights list has 6 items', async ({ page }) => {
    // The rights list follows the h2 "Your Rights"
    const rightsSection = page.locator('.legal-body').getByText('Right of access');
    await expect(rightsSection).toBeVisible();
    const items = page.locator('.legal-body ul').filter({ hasText: 'Right of access' }).locator('li');
    await expect(items).toHaveCount(6);
  });

  test('contact block shows correct details', async ({ page }) => {
    const body = page.locator('.legal-body');
    await expect(body).toContainText(REG_NO);
    await expect(body).toContainText(ICPAC_NO);
    // Two email links exist in body (p7_1 text + contact address block) — first() avoids strict mode
    await expect(body.locator(`a[href="mailto:${EMAIL}"]`).first()).toBeVisible();
  });

  test('dataprotection.gov.cy link is present and clickable', async ({ page }) => {
    const link = page.locator('a[href*="dataprotection.gov.cy"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://www.dataprotection.gov.cy');
    await expect(link).toHaveAttribute('target', '_blank');
  });
});

test.describe('Terms & Conditions — structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${SITE}/terms.html`);
  });

  test('page has correct H1', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Terms');
  });

  test('all 11 sections are present', async ({ page }) => {
    const headings = page.locator('.legal-body h2');
    await expect(headings).toHaveCount(11);
  });

  const sections = [
    'Introduction',
    'Services',
    'Client Obligations',
    'Fees and Payment',
    'Confidentiality',
    'Intellectual Property',
    'Limitation of Liability',
    'Anti-Money Laundering',
    'Termination',
    'Governing Law',
    'Contact',
  ];

  for (const section of sections) {
    test(`section "${section}" is present`, async ({ page }) => {
      await expect(page.locator('.legal-body')).toContainText(section);
    });
  }

  test('client obligations list has 4 items', async ({ page }) => {
    const list = page.locator('.legal-body ul').filter({ hasText: 'accurate' });
    const items = list.locator('li');
    await expect(items).toHaveCount(4);
  });

  test('contact block shows correct details', async ({ page }) => {
    const body = page.locator('.legal-body');
    await expect(body).toContainText(REG_NO);
    await expect(body).toContainText(ICPAC_NO);
    await expect(body.locator(`a[href="mailto:${EMAIL}"]`).first()).toBeVisible();
  });
});

test.describe('Legal pages — shared layout', () => {
  for (const file of ['privacy-policy.html', 'terms.html']) {
    test.describe(file, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`${SITE}/${file}`);
      });

      test('hero banner is visible', async ({ page }) => {
        await expect(page.locator('.legal-hero')).toBeVisible();
        await expect(page.locator('.legal-hero h1')).toBeVisible();
      });

      test('"Last updated" meta is present', async ({ page }) => {
        await expect(page.locator('.legal-meta')).toContainText('2026');
      });

      test('footer reg block shows both numbers', async ({ page }) => {
        const reg = page.locator('.ftr-reg');
        await expect(reg).toContainText(REG_NO);
        await expect(reg).toContainText(ICPAC_NO);
      });

      test('footer nav links point to index.html sections', async ({ page }) => {
        const aboutLink = page.locator('footer a[href="index.html#about"]');
        await expect(aboutLink).toBeVisible();
      });
    });
  }
});

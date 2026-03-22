/**
 * TC-07 — Navigation & Links
 * Verifies that all nav anchors scroll to the correct section and
 * that section headings are not obscured by the fixed nav bar.
 */
import { test, expect } from '@playwright/test';
import { SITE } from './helpers';

const NAV_SECTIONS = ['about', 'services', 'industries', 'partners', 'contact'] as const;

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  for (const section of NAV_SECTIONS) {
    test(`nav link "${section}" scrolls to correct section`, async ({ page }) => {
      await page.locator(`#nav a[href="#${section}"]`).click();
      await page.waitForTimeout(600); // allow smooth scroll

      const sectionEl = page.locator(`#${section}`);
      await expect(sectionEl).toBeInViewport();

      // Heading must not be hidden behind the fixed nav (scroll-margin-top check)
      const navBottom = await page.locator('#nav').evaluate(
        (el) => el.getBoundingClientRect().bottom,
      );
      const sectionTop = await sectionEl.evaluate(
        (el) => el.getBoundingClientRect().top,
      );
      expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 2); // 2px tolerance
    });
  }

  test('logo links back to top of home page', async ({ page }) => {
    await page.locator('#nav a[href="#about"]').click();
    await page.locator('.nav-logo').click();
    await page.waitForTimeout(400);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('footer Privacy Policy link opens correct page', async ({ page }) => {
    await page.locator('footer a[href="privacy-policy.html"]').first().click();
    await expect(page).toHaveURL(/privacy-policy\.html/);
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('footer Terms & Conditions link opens correct page', async ({ page }) => {
    await page.locator('footer a[href="terms.html"]').first().click();
    await expect(page).toHaveURL(/terms\.html/);
    await expect(page.locator('h1')).toContainText('Terms');
  });

  test('footer LinkedIn opens in new tab', async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('footer a[href*="linkedin"]').first().click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    expect(newPage.url()).toContain('linkedin');
  });
});

test.describe('Legal pages — back link', () => {
  for (const legalPage of ['privacy-policy.html', 'terms.html']) {
    test(`${legalPage} "Back to Home" returns to index`, async ({ page }) => {
      await page.goto(`${SITE}/${legalPage}`);
      await page.locator('.legal-back').click();
      await expect(page).toHaveURL(new RegExp('(index\\.html|notabene/?)$'));
    });
  }
});

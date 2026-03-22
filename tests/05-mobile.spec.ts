/**
 * Mobile UX — hamburger menu (nav links only), standalone phone icon,
 * and globe lang popup in the nav bar.
 * Runs against the "mobile" project (Pixel 7 viewport).
 */
import { test, expect } from '@playwright/test';
import { SITE, waitForI18n } from './helpers';

// Skip when running on a desktop-sized viewport
// (hamburger + mobile icons are display:none via CSS above 1024 px)
test.beforeEach(async ({ page }, testInfo) => {
  const vp = page.viewportSize();
  if (vp && vp.width > 1024) {
    testInfo.skip();
  }
});

test.describe('Mobile menu — open / close', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    await expect(page.locator('#hamburger')).toBeVisible();
  });

  test('mobile menu is hidden by default', async ({ page }) => {
    await expect(page.locator('#mob-menu')).toBeHidden();
  });

  test('clicking hamburger opens mobile menu', async ({ page }) => {
    await page.locator('#hamburger').click();
    await expect(page.locator('#mob-menu')).toBeVisible();
    await expect(page.locator('#hamburger')).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking hamburger again closes mobile menu', async ({ page }) => {
    await page.locator('#hamburger').click();
    await expect(page.locator('#mob-menu')).toBeVisible();
    await page.locator('#hamburger').click();
    await expect(page.locator('#mob-menu')).toBeHidden();
    await expect(page.locator('#hamburger')).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking a mobile menu link closes the menu and scrolls', async ({ page }) => {
    await page.locator('#hamburger').click();
    await page.locator('#mob-menu a[href="#services"]').click();
    await page.waitForTimeout(600);
    await expect(page.locator('#mob-menu')).toBeHidden();
    await expect(page.locator('#services')).toBeInViewport();
  });
});

test.describe('Mobile menu — nav links only (no lang/call inside)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
    await page.locator('#hamburger').click();
  });

  test('contains all 5 nav links', async ({ page }) => {
    const menu = page.locator('#mob-menu');
    for (const href of ['#about', '#services', '#industries', '#partners', '#contact']) {
      await expect(menu.locator(`a[href="${href}"]`)).toBeVisible();
    }
  });

  test('lang switcher is NOT inside the hamburger menu', async ({ page }) => {
    await expect(page.locator('#mob-menu .lang-switcher')).toHaveCount(0);
  });

  test('call button is NOT inside the hamburger menu', async ({ page }) => {
    await expect(page.locator('#mob-menu .btn-fill')).toHaveCount(0);
  });
});

test.describe('Mobile nav — phone icon button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('phone icon button is visible in nav bar', async ({ page }) => {
    await expect(page.locator('.mob-phone-btn')).toBeVisible();
  });

  test('phone icon button links to correct number', async ({ page }) => {
    await expect(page.locator('.mob-phone-btn'))
      .toHaveAttribute('href', 'tel:+35799444325');
  });
});

test.describe('Mobile nav — lang popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
  });

  test('globe lang button is visible in nav bar', async ({ page }) => {
    await expect(page.locator('#mob-lang-btn')).toBeVisible();
  });

  test('lang popup is hidden by default', async ({ page }) => {
    await expect(page.locator('#lang-popup')).toBeHidden();
  });

  test('clicking globe button opens lang popup', async ({ page }) => {
    await page.locator('#mob-lang-btn').click();
    await expect(page.locator('#lang-popup')).toBeVisible();
    await expect(page.locator('#mob-lang-btn')).toHaveAttribute('aria-expanded', 'true');
  });

  test('lang popup contains all three language buttons', async ({ page }) => {
    await page.locator('#mob-lang-btn').click();
    const popup = page.locator('#lang-popup');
    await expect(popup.locator('[data-lang="en"]')).toBeVisible();
    await expect(popup.locator('[data-lang="el"]')).toBeVisible();
    await expect(popup.locator('[data-lang="ru"]')).toBeVisible();
  });

  test('selecting a language closes the popup', async ({ page }) => {
    await page.locator('#mob-lang-btn').click();
    await page.locator('#lang-popup [data-lang="el"]').click();
    await page.waitForTimeout(200);
    await expect(page.locator('#lang-popup')).toBeHidden();
  });

  test('language switch works from nav popup', async ({ page }) => {
    await waitForI18n(page);
    await page.locator('#mob-lang-btn').click();
    await page.locator('#lang-popup [data-lang="ru"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#mob-menu a[href="#about"]')).toContainText('О нас');
  });

  test('opening lang popup closes hamburger menu if open', async ({ page }) => {
    await page.locator('#hamburger').click();
    await expect(page.locator('#mob-menu')).toBeVisible();
    await page.locator('#mob-lang-btn').click();
    await expect(page.locator('#mob-menu')).toBeHidden();
    await expect(page.locator('#lang-popup')).toBeVisible();
  });

  test('opening hamburger menu closes lang popup if open', async ({ page }) => {
    await page.locator('#mob-lang-btn').click();
    await expect(page.locator('#lang-popup')).toBeVisible();
    await page.locator('#hamburger').click();
    await expect(page.locator('#lang-popup')).toBeHidden();
    await expect(page.locator('#mob-menu')).toBeVisible();
  });
});

test.describe('Mobile legal pages', () => {
  for (const file of ['privacy-policy.html', 'terms.html']) {
    test.describe(file, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`${SITE}/${file}`);
      });

      test('phone icon button is in nav bar', async ({ page }) => {
        await expect(page.locator('.mob-phone-btn')).toBeVisible();
      });

      test('globe lang button is in nav bar', async ({ page }) => {
        await expect(page.locator('#mob-lang-btn')).toBeVisible();
      });

      test('lang popup opens and shows all languages', async ({ page }) => {
        await page.locator('#mob-lang-btn').click();
        const popup = page.locator('#lang-popup');
        await expect(popup.locator('[data-lang="en"]')).toBeVisible();
        await expect(popup.locator('[data-lang="el"]')).toBeVisible();
        await expect(popup.locator('[data-lang="ru"]')).toBeVisible();
      });
    });
  }
});

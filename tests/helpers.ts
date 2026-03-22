import { Page, expect } from '@playwright/test';

export const SITE = process.env['BASE_URL'] ?? 'https://tdramashko.github.io/notabene';

export const PHONE     = '+357 99 444 325';
export const PHONE_RAW = '+35799444325';
export const EMAIL     = 'office@notabene.cy';
export const REG_NO    = 'C375615';
export const ICPAC_NO  = 'E1014';

/**
 * Switch the active language.
 * Clicks the first visible lang button (desktop or mobile switcher).
 */
export async function switchLang(page: Page, lang: 'en' | 'el' | 'ru') {
  // Pick the first visible lang button across all switchers (desktop nav or mob-menu)
  const btn = page.locator(`.lang-btn[data-lang="${lang}"]`).first();
  await btn.click();
  await page.waitForTimeout(300);
}

/**
 * Wait until the page is fully loaded and the TRANSLATIONS object is available.
 * Uses networkidle so all scripts have executed before we probe the DOM.
 */
export async function waitForI18n(page: Page) {
  // 'load' is sufficient — translations.js is a synchronous script tag,
  // so TRANSLATIONS is defined before the load event fires.
  // 'networkidle' hangs when external fonts (Google Fonts) keep connections open.
  await page.waitForLoadState('load');
}

/**
 * Assert that an element's visible text contains the expected string (case-insensitive).
 */
export async function assertTextContains(page: Page, selector: string, expected: string) {
  const el = page.locator(selector).first();
  await expect(el).toContainText(expected, { ignoreCase: true });
}

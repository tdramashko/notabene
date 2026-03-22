/**
 * TC-06 — Language Switcher & Localisation
 * Verifies EN / ΕΛ / RU switching on homepage and legal pages,
 * language persistence across page loads, and full content translation.
 */
import { test, expect, Page } from '@playwright/test';
import { SITE, switchLang, waitForI18n } from './helpers';

// Spot-check strings unique to each language to confirm the switch worked
const LANG_PROBES = {
  en: { nav: 'About',    hero: 'in Cyprus',         contact: 'Contact' },
  el: { nav: 'Σχετικά', hero: 'στην Κύπρο',         contact: 'Επικοινωνία' },
  ru: { nav: 'О нас',   hero: 'на Кипре',            contact: 'Контакты' },
} as const;

type Lang = keyof typeof LANG_PROBES;

async function assertHomeLang(page: Page, lang: Lang) {
  const p = LANG_PROBES[lang];
  await expect(page.locator('#nav .nav-links').first()).toContainText(p.nav);
  await expect(page.locator('#hero')).toContainText(p.hero);
  await expect(page.locator('#contact .label').first()).toContainText(p.contact);
  await expect(page.locator('footer')).toContainText(p.contact);
}

test.describe('Language switcher — homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE);
    await waitForI18n(page);
  });

  test('defaults to English', async ({ page }) => {
    await assertHomeLang(page, 'en');
    await expect(page.locator('#nav .lang-switcher .lang-btn[data-lang="en"]')).toHaveClass(/active/);
  });

  test('switches to Greek (ΕΛ)', async ({ page }) => {
    await switchLang(page, 'el');
    await assertHomeLang(page, 'el');
    await expect(page.locator('#nav .lang-switcher .lang-btn[data-lang="el"]')).toHaveClass(/active/);
  });

  test('switches to Russian (RU)', async ({ page }) => {
    await switchLang(page, 'ru');
    await assertHomeLang(page, 'ru');
    await expect(page.locator('#nav .lang-switcher .lang-btn[data-lang="ru"]')).toHaveClass(/active/);
  });

  test('can switch between all three languages in sequence', async ({ page }) => {
    for (const lang of ['el', 'ru', 'en'] as Lang[]) {
      await switchLang(page, lang);
      await assertHomeLang(page, lang);
    }
  });
});

test.describe('Language persistence', () => {
  test('chosen language survives page reload', async ({ page }) => {
    await page.goto(SITE);
    await waitForI18n(page);
    await switchLang(page, 'ru');
    await expect(page.locator('#nav .nav-links').first()).toContainText('О нас');

    await page.reload();
    await waitForI18n(page);
    await expect(page.locator('#nav .nav-links').first()).toContainText('О нас');
  });

  test('language chosen on homepage carries over to privacy-policy page', async ({ page }) => {
    await page.goto(SITE);
    await waitForI18n(page);
    await switchLang(page, 'el');

    await page.goto(`${SITE}/privacy-policy.html`);
    await waitForI18n(page);

    // Nav should still be Greek
    await expect(page.locator('#nav .nav-links').first()).toContainText('Σχετικά');
    // Page heading should be Greek
    await expect(page.locator('.legal-hero h1')).toContainText('Πολιτική Απορρήτου');
  });

  test('language chosen on homepage carries over to terms page', async ({ page }) => {
    await page.goto(SITE);
    await waitForI18n(page);
    await switchLang(page, 'ru');

    await page.goto(`${SITE}/terms.html`);
    await waitForI18n(page);

    await expect(page.locator('#nav .nav-links').first()).toContainText('О нас');
    await expect(page.locator('.legal-hero h1')).toContainText('Условия');
  });
});

test.describe('Legal pages — full translation', () => {
  const legalProbes = {
    en: {
      privacy: { heading: 'Privacy Policy',            backLink: 'Back to Home', h1: 'Introduction' },
      terms:   { heading: 'Terms & Conditions',        backLink: 'Back to Home', h1: 'Introduction' },
    },
    el: {
      privacy: { heading: 'Πολιτική Απορρήτου',        backLink: 'Επιστροφή',   h1: 'Εισαγωγή' },
      terms:   { heading: 'Όροι & Προϋποθέσεις',       backLink: 'Επιστροφή',   h1: 'Εισαγωγή' },
    },
    ru: {
      privacy: { heading: 'Политика конфиденциальности', backLink: 'главную',    h1: 'Введение' },
      terms:   { heading: 'Условия использования',     backLink: 'главную',      h1: 'Введение' },
    },
  } as const;

  for (const lang of ['en', 'el', 'ru'] as const) {
    for (const legalPage of ['privacy', 'terms'] as const) {
      const file = legalPage === 'privacy' ? 'privacy-policy.html' : 'terms.html';
      const probe = legalProbes[lang][legalPage];

      test(`${file} translates fully to ${lang.toUpperCase()}`, async ({ page }) => {
        // Set language via localStorage before navigation
        await page.goto(SITE);
        await waitForI18n(page);
        await switchLang(page, lang);

        await page.goto(`${SITE}/${file}`);
        await waitForI18n(page);

        await expect(page.locator('.legal-hero h1')).toContainText(probe.heading);
        await expect(page.locator('.legal-back')).toContainText(probe.backLink);
        await expect(page.locator('.legal-body h2').first()).toContainText(probe.h1);

        // Footer translates too
        const footerNav = page.locator('footer nav[aria-label="Footer navigation"] .ftr-col-h');
        if (lang === 'el') await expect(footerNav).toContainText('Πλοήγηση');
        if (lang === 'ru') await expect(footerNav).toContainText('Навигация');
        if (lang === 'en') await expect(footerNav).toContainText('Navigation');
      });
    }
  }
});

test.describe('Legal pages — lang switcher present', () => {
  for (const file of ['privacy-policy.html', 'terms.html']) {
    test(`${file} has lang switcher (at least one visible)`, async ({ page }) => {
      await page.goto(`${SITE}/${file}`);
      // On desktop the nav switcher is visible; on mobile the mob-menu switcher is present in DOM.
      // Assert at least one [data-lang] button exists on the page.
      const anyBtn = page.locator('.lang-btn[data-lang="en"]').first();
      await expect(anyBtn).toBeAttached();
      const anyElBtn = page.locator('.lang-btn[data-lang="el"]').first();
      await expect(anyElBtn).toBeAttached();
    });
  }
});

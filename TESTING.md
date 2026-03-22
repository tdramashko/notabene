# Notabene Accountants — Playwright Test Suite

End-to-end tests for https://tdramashko.github.io/notabene, written in **Playwright + TypeScript**.

Tests run against the **live GitHub Pages site** — no local server required.

---

## Setup

```bash
npm install
npx playwright install chromium   # only Chromium is used
```

---

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | Full suite — both desktop and mobile projects |
| `npm run test:desktop` | Desktop (Chromium) only |
| `npm run test:mobile` | Mobile (Pixel 7 / Chromium) only |
| `npm run test:i18n` | `03-i18n.spec.ts` only |
| `npm run test:content` | `02-content.spec.ts` only |
| `npm run test:legal` | `04-legal-pages.spec.ts` only |
| `npm run report` | Open the last HTML report in a browser |

---

## Projects (browsers / devices)

| Project | Device | Runs |
|---|---|---|
| `chromium` | Desktop Chrome (1280 × 720) | All 5 test files |
| `mobile` | Pixel 7 via Chromium | `02`, `04`, `05` — nav and i18n suites excluded because the desktop nav bar is hidden on mobile |

---

## Test files

| File | Suite | Description |
|---|---|---|
| `01-navigation.spec.ts` | Navigation | Anchor scroll, logo link, footer links, legal page back-links |
| `02-content.spec.ts` | Content | Phone/email/address/hours, partner cards, service items, industries, footer |
| `03-i18n.spec.ts` | Localisation | EN/ΕΛ/RU switching, language persistence across reloads and page navigations, full legal-page translation |
| `04-legal-pages.spec.ts` | Legal pages | Privacy Policy and T&C structure, headings, GDPR list, `dataprotection.gov.cy` link |
| `05-mobile.spec.ts` | Mobile UX | Hamburger open/close, nav links, phone pill button, lang popup toggle, mutual-exclusion logic, legal pages on mobile |
| `helpers.ts` | — | Shared constants (`SITE`, `PHONE`, `EMAIL`, `REG_NO`, `ICPAC_NO`) and `switchLang` / `waitForI18n` helpers |

---

## Configuration highlights (`playwright.config.ts`)

```ts
timeout: 30_000       // per test
expect.timeout: 8_000 // per assertion
retries: 1            // one automatic retry on CI
workers: 4            // parallel workers
```

Traces are captured on first retry; screenshots on failure. Reports are saved to `playwright-report/`.

---

## Helper utilities (`tests/helpers.ts`)

```ts
SITE        // 'https://tdramashko.github.io/notabene'
PHONE       // '+357 99 444 325'
EMAIL       // 'office@notabene.cy'
REG_NO      // 'C375615'
ICPAC_NO    // 'E1014'

switchLang(page, 'el')   // clicks the correct .lang-btn and waits 300 ms
waitForI18n(page)        // waits for page 'load' state (sufficient; translations.js is synchronous)
```

---

## Notes

- **Mobile tests skip automatically on desktop viewports** — a `test.beforeEach` guard checks `vp.width > 1024` and calls `testInfo.skip()`.
- **Strict mode** — Playwright's strict locator mode is active; use `.first()` when a selector intentionally matches multiple elements (e.g. `mailto:` links that appear in both body and footer).
- **Lang popup selectors** — The `#lang-popup` lives inside `#nav`, so use `#nav .lang-switcher .lang-btn` (not `#nav .lang-btn`) when targeting the desktop switcher to avoid strict-mode violations.

# Notabene Accountants — Website

[![CI](https://github.com/tdramashko/notabene/actions/workflows/test.yml/badge.svg)](https://github.com/tdramashko/notabene/actions/workflows/test.yml)

Static marketing site for **Notabene Accountants (CY) Limited**, hosted on GitHub Pages.

**Live:** https://tdramashko.github.io/notabene

---

## Repository structure

```
notabene/
├── index.html              # Main landing page
├── privacy-policy.html     # Privacy Policy (GDPR)
├── terms.html              # Terms & Conditions
│
├── css/
│   ├── style.css           # Main stylesheet (all pages)
│   └── legal.css           # Additional styles for legal pages
│
├── js/
│   ├── translations.js     # All EN / ΕΛ / RU string data (TRANSLATIONS object)
│   ├── i18n.js             # Language engine — reads translations.js, wires buttons
│   └── main.js             # Nav scroll shadow, fade-in observer, mobile menu & lang popup
│
└── assets/
    └── images/             # Logo variants and partner photos
```

---

## Pages

| File | URL path | Description |
|---|---|---|
| `index.html` | `/` | Hero, Trust Bar, About, Services, Industries, Partners, Contact, Footer |
| `privacy-policy.html` | `/privacy-policy.html` | GDPR-compliant privacy policy |
| `terms.html` | `/terms.html` | Terms & Conditions |

---

## Internationalisation (i18n)

The site supports **English (EN)**, **Greek (ΕΛ)**, and **Russian (RU)**.

### How it works

1. `translations.js` exports a global `TRANSLATIONS` object:
   ```js
   const TRANSLATIONS = {
     en: { nav: {…}, hero: {…}, about: {…}, … },
     el: { … },
     ru: { … },
   };
   ```

2. HTML elements carry a `data-i18n` or `data-i18n-html` attribute whose value is a dot-path into the translations object:
   ```html
   <h2 data-i18n="about.heading">Independent expertise.</h2>
   <p  data-i18n-html="hero.title">Audit &amp; Tax<br><em>in Cyprus</em></p>
   ```
   - `data-i18n` → sets `textContent` (safe — strips any inner HTML)
   - `data-i18n-html` → sets `innerHTML` (use only for trusted strings that need `<br>`, `<em>`, `<a>` etc.)

3. `i18n.js` runs on `DOMContentLoaded`:
   - Reads `localStorage['nb-lang']` or detects the browser language (`el`, `ru`, or falls back to `en`)
   - Calls `translateDOM(lang)` which walks all `[data-i18n]` / `[data-i18n-html]` elements
   - Wires click listeners on every `.lang-btn` element (desktop switcher + mobile popup)
   - Persists the chosen language to `localStorage` so it survives reloads and carries across pages

### Adding a new string

1. Add the key to all three language blocks in `translations.js`
2. Add `data-i18n="section.key"` (or `data-i18n-html`) to the HTML element
3. Provide a sensible English fallback as the element's initial text content (shown before JS runs)

---

## Mobile navigation

On viewports ≤ 1024 px the desktop nav (`nav-links`, `lang-switcher`, `nav-cta`) is hidden via CSS and replaced with three elements on the right side of the nav bar:

| Element | Class | Behaviour |
|---|---|---|
| **Call** pill | `.mob-phone-btn` | Direct `tel:` link — blue filled pill |
| **Globe** icon | `.mob-icon-btn` inside `.mob-lang-wrap` | Toggles `#lang-popup` dropdown |
| **Hamburger** | `#hamburger` | Toggles `#mob-menu` (nav links only) |

The two interactive elements (lang popup / hamburger menu) are **mutually exclusive** — opening one closes the other. Clicking anywhere outside dismisses the lang popup.

---

## Deployment

The site is a plain static site — no build step required.

```
git push origin master   # GitHub Pages deploys automatically (~30–60 s)
```

**GitHub Pages settings:** Source → Deploy from branch `master`, root `/`.

---

## Development

Open any `.html` file directly in a browser, or serve locally:

```bash
# Python (built-in)
python -m http.server 8080

# Node (if npx available)
npx serve .
```

> **Note:** `localStorage` language persistence works the same on `localhost` as on the live site.

---

## Known design decisions

- **No build toolchain** — vanilla HTML/CSS/JS for maximum simplicity and zero dependencies
- **Google Fonts (Inter)** loaded via `<link>` — CDN, not self-hosted
- **Scroll animations** use `IntersectionObserver` with `.fade` / `.in` classes
- **`networkidle` not used** in tests — Google Fonts keeps connections alive indefinitely; `'load'` state is sufficient since `TRANSLATIONS` is defined synchronously

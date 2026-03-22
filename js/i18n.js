/* ============================================================
   Notabene — i18n Engine
   Requires: translations.js loaded before this file
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY  = 'nb-lang';
  const SUPPORTED    = Object.keys(TRANSLATIONS);
  const DEFAULT_LANG = 'en';

  /* ── Resolve nested key e.g. "hero.title" → TRANSLATIONS[lang].hero.title ── */
  function getString(lang, keyPath) {
    return keyPath.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : null), TRANSLATIONS[lang]);
  }

  /* ── Map browser language tag to a supported locale ── */
  function detectBrowserLang() {
    const tag = (navigator.language || '').toLowerCase().split('-')[0];
    const map = { el: 'el', ru: 'ru' };
    return map[tag] || null;
  }

  /* ── Apply all data-i18n / data-i18n-html attributes ── */
  function translateDOM(lang) {
    /* Plain text — safe textContent swap */
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const val = getString(lang, el.dataset.i18n);
      if (val !== null) el.textContent = val;
    });

    /* HTML content — only for trusted markup (br, em, amp; in title strings) */
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const val = getString(lang, el.dataset.i18nHtml);
      if (val !== null) el.innerHTML = val;
    });
  }

  /* ── Highlight the active language button ── */
  function setActiveButton(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) =>
      btn.classList.toggle('active', btn.dataset.lang === lang)
    );
  }

  /* ── Main apply function ── */
  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;

    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    translateDOM(lang);
    setActiveButton(lang);
  }

  /* ── Init ── */
  function init() {
    const saved    = localStorage.getItem(STORAGE_KEY);
    const detected = detectBrowserLang();
    const lang     = SUPPORTED.includes(saved) ? saved : (detected || DEFAULT_LANG);

    /* Wire up all lang buttons on the page */
    document.querySelectorAll('.lang-btn').forEach((btn) =>
      btn.addEventListener('click', () => applyLang(btn.dataset.lang))
    );

    applyLang(lang);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

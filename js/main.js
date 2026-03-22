/* ============================================================
   Notabene Accountants — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: scroll shadow + active section highlight ── */
  const nav   = document.getElementById('nav');
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
      );
    });
  }, { threshold: 0.3 });

  secs.forEach((s) => sectionObserver.observe(s));

  /* ── Fade-in on scroll ── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade').forEach((el) => fadeObserver.observe(el));

  /* ── Mobile menu toggle ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mob-menu');
  let menuOpen = false;

  function closeMobileMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', false);
  }

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('is-open', menuOpen);
    hamburger.setAttribute('aria-expanded', menuOpen);
    // close lang popup if open
    closeLangPopup();
  });

  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', closeMobileMenu)
  );

  /* ── Lang popup toggle ── */
  const langToggle = document.getElementById('mob-lang-btn');
  const langPopup  = document.getElementById('lang-popup');

  function closeLangPopup() {
    if (!langPopup) return;
    langPopup.classList.remove('is-open');
    langToggle.setAttribute('aria-expanded', false);
  }

  if (langToggle && langPopup) {
    function onOutsideClick() {
      closeLangPopup();
    }

    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langPopup.classList.toggle('is-open');
      langToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        closeMobileMenu();
        // Add outside-click listener only while popup is open
        document.addEventListener('click', onOutsideClick);
      } else {
        document.removeEventListener('click', onOutsideClick);
      }
    });

    // Close popup after a language is selected, remove outside listener
    langPopup.querySelectorAll('.lang-btn').forEach((btn) =>
      btn.addEventListener('click', () => {
        closeLangPopup();
        document.removeEventListener('click', onOutsideClick);
      })
    );
  }
})();

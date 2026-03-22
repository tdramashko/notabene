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

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('is-open', menuOpen);
    hamburger.setAttribute('aria-expanded', menuOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', false);
    })
  );
})();

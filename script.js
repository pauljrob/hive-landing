/* ════════════════════════════════════════════════════════
   HIVE LANDING — script.js
   Vanilla JS: nav scroll, entrance animations, terminal typeIn
   ════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Nav scroll blur ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Hero entrance ───────────────────────────────────── */
  const hero = document.querySelector('.section-hero');
  if (hero) {
    if (prefersReducedMotion) {
      hero.classList.add('hero-loaded');
    } else {
      // Defer one frame so transitions apply
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hero.classList.add('hero-loaded');
        });
      });
    }
  }

  /* ── IntersectionObserver — generic scroll animations ── */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-scroll-animate]').forEach((el) => {
      scrollObserver.observe(el);
    });
  } else {
    // No JS/reduced motion — show everything immediately
    document.querySelectorAll('[data-scroll-animate]').forEach((el) => {
      el.classList.add('visible');
    });
  }

  /* ── Architecture diagram animation ─────────────────── */
  const archDiagram = document.querySelector('.arch-diagram');
  if (archDiagram) {
    if (prefersReducedMotion) {
      archDiagram.classList.add('animated');
    } else if ('IntersectionObserver' in window) {
      const archObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              archDiagram.classList.add('animated');
              archObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      archObserver.observe(archDiagram);
    } else {
      archDiagram.classList.add('animated');
    }
  }

  /* ── Terminal log typeIn ─────────────────────────────── */
  const termLog = document.getElementById('termLog');
  if (termLog) {
    const logLines = termLog.querySelectorAll('.log-line');

    const startTypeIn = () => {
      if (prefersReducedMotion) {
        logLines.forEach((l) => l.classList.add('visible'));
        return;
      }
      logLines.forEach((line, i) => {
        setTimeout(() => {
          line.classList.add('visible');
        }, i * 90);
      });
    };

    if ('IntersectionObserver' in window) {
      const termObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Small delay before starting the typeIn
              setTimeout(startTypeIn, 200);
              termObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      termObserver.observe(termLog);
    } else {
      startTypeIn();
    }
  }

  /* ── Smooth scroll for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

})();

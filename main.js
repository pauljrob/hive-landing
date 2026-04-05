/* ============================================================
   HIVE LANDING — main.js
   Nav scroll behavior + Hero canvas + Scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav scroll ──────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── Hero canvas: slow-drifting node network ─────────────── */
  const canvas = document.getElementById('heroCanvas');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');

    const NODE_COUNT   = 48;
    const MAX_DIST     = 160;   // px — max distance for drawing an edge
    const NODE_RADIUS  = 2.5;
    const SPEED        = 0.18;  // pixels per frame
    const NODE_OPACITY_MIN = 0.1;
    const NODE_OPACITY_MAX = 0.3;
    const EDGE_OPACITY  = 0.055;

    // Amber accent color components
    const R = 212, G = 135, B = 26;

    let W = 0, H = 0;
    let nodes = [];
    let raf;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        nodes.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: Math.cos(angle) * SPEED * (0.5 + Math.random()),
          vy: Math.sin(angle) * SPEED * (0.5 + Math.random()),
          opacity: NODE_OPACITY_MIN + Math.random() * (NODE_OPACITY_MAX - NODE_OPACITY_MIN),
          r: NODE_RADIUS * (0.6 + Math.random() * 0.8),
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        // Wrap around edges
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = EDGE_OPACITY * (1 - dist / MAX_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${R},${G},${B},${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${n.opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    function init() {
      resize();
      createNodes();
      tick();
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      resize();
      // Don't recreate nodes on resize — just let existing ones continue
      tick();
    });
    ro.observe(canvas);

    init();
  }


  /* ── Scroll reveal (IntersectionObserver) ────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }


  /* ── Terminal replay loop ────────────────────────────────── */
  // When the terminal section enters the viewport, restart the animation
  const terminalLines = document.getElementById('terminalLines');
  if (terminalLines && 'IntersectionObserver' in window) {
    let hasAnimated = false;

    const termObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            // Force animation restart by briefly toggling a class
            terminalLines.querySelectorAll('.terminal__line').forEach((line) => {
              line.style.animationPlayState = 'running';
            });
          }
        }
      },
      { threshold: 0.2 }
    );

    termObserver.observe(terminalLines);
  }

})();

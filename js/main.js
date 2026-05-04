/* =============================================
   AGROMIX — main.js
   ============================================= */

// ── MENU MOBILE ──────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

function closeNav() {
  navMenu.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) closeNav();
});

// ── SCROLL: PROGRESSO + HEADER ───────────────
const header       = document.getElementById('header');
const progressBar  = document.getElementById('scroll-progress');

function onScroll() {
  const scrollY   = window.scrollY;
  const docH      = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = docH > 0 ? (scrollY / docH) * 100 : 0;

  if (progressBar) progressBar.style.width = pct + '%';

  header.classList.toggle('scrolled', scrollY > 60);
  header.style.boxShadow = scrollY > 30
    ? '0 2px 28px rgba(0,0,0,0.13)'
    : '0 2px 16px rgba(0,0,0,0.08)';
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── CONTADOR DE STATS (com easing) ───────────
function easeOutQuad(t) { return t * (2 - t); }

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const start    = performance.now();

  function tick(now) {
    const elapsed = Math.min(now - start, duration);
    const progress = easeOutQuad(elapsed / duration);
    el.textContent = Math.round(progress * target);
    if (elapsed < duration) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// ── REVEAL ON SCROLL (up / left / right) ─────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay
        ? parseFloat(entry.target.dataset.delay)
        : i * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── TILT 3D EM CARDS (só desktop/mouse) ──────
function enableTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll(
    '.produto-card:not(.produto-card--cta):not(.produto-card--vitrine), .mvv-card, .diferencial-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r   = card.getBoundingClientRect();
      const dx  = ((e.clientX - r.left) / r.width  - 0.5) * 2;  // -1..1
      const dy  = ((e.clientY - r.top)  / r.height - 0.5) * 2;  // -1..1
      card.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-5px)`;
      card.style.boxShadow = `${-dx * 10}px ${dy * 6}px 32px rgba(0,0,0,0.13)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

enableTilt();

// ── ACTIVE NAV LINK ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-desktop a:not(.nav-btn-vitrine)');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.style.color = active ? 'var(--verde)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));

// ── TYPED EFFECT NA HERO SLOGAN ───────────────
(function typedSlogan() {
  const el = document.querySelector('.hero-slogan');
  if (!el) return;
  const text    = el.textContent.trim();
  const cursor  = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'animation: blink 0.8s step-end infinite; color: var(--verde-logo);';
  el.textContent = '';
  el.appendChild(cursor);

  let i = 0;
  const style = document.createElement('style');
  style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(style);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, 55);
    } else {
      setTimeout(() => cursor.remove(), 1200);
    }
  }

  // Inicia após 600ms (deixa o hero carregar primeiro)
  setTimeout(type, 600);
})();

// ── CONTAGEM REGRESSIVA SUAVE DE ÍCONES ───────
// Adiciona classe 'in-view' quando a seção de historia fica visível
const historiaSection = document.getElementById('historia');
if (historiaSection) {
  const historiaObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      historiaSection.classList.add('in-view');
      historiaObs.disconnect();
    }
  }, { threshold: 0.3 });
  historiaObs.observe(historiaSection);
}

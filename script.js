/* ============================================================
   PIZZERIA DA GINO — script.js
   ============================================================ */

/* ------------------------------------------------------------
   Active nav link detection
   ------------------------------------------------------------ */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === path || (path === '' && page === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ------------------------------------------------------------
   Navbar scroll shadow
   ------------------------------------------------------------ */
function initNavScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;
  const toggle = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

/* ------------------------------------------------------------
   Mobile drawer
   ------------------------------------------------------------ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.querySelector('.mobile-drawer');
  const overlay   = document.querySelector('.mobile-drawer-overlay');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-drawer .nav-link').forEach(l =>
    l.addEventListener('click', closeDrawer)
  );
}

/* ------------------------------------------------------------
   Scroll reveal (IntersectionObserver)
   ------------------------------------------------------------ */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ------------------------------------------------------------
   Language toggle  (uses data-lang on <html> — flash-free)
   ------------------------------------------------------------ */
function initLanguage() {
  const flagButtons = document.querySelectorAll('.flag-btn');
  let currentLang   = document.documentElement.getAttribute('data-lang') || 'en';

  // Sync button state to whatever was set by the early <head> script
  syncButtons(currentLang);

  flagButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      currentLang = this.getAttribute('data-lang');
      localStorage.setItem('language', currentLang);
      document.documentElement.setAttribute('data-lang', currentLang);
      document.documentElement.lang = currentLang;
      syncButtons(currentLang);
      updateFloatingTooltips(currentLang);
    });
  });

  function syncButtons(lang) {
    flagButtons.forEach(btn =>
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang)
    );
    document.documentElement.lang = lang;
  }
}

/* ------------------------------------------------------------
   Main food carousel (index.html)
   ------------------------------------------------------------ */
let carouselIndex = 0;
let carouselTimer = null;
let totalSlides   = 0;

function initCarousel() {
  const slides     = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  totalSlides = slides.length;
  if (totalSlides === 0) return;

  showSlide(0);
  startAutoRotate();

  const wrapper = document.querySelector('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoRotate);
    wrapper.addEventListener('mouseleave', startAutoRotate);
  }

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      carouselIndex = i;
      showSlide(i);
      startAutoRotate();
    });
  });
}

function startAutoRotate() {
  stopAutoRotate();
  carouselTimer = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % totalSlides;
    showSlide(carouselIndex);
  }, 6000);
}

function stopAutoRotate() {
  if (carouselTimer) clearInterval(carouselTimer);
}

function changeSlide(direction) {
  carouselIndex = (carouselIndex + direction + totalSlides) % totalSlides;
  showSlide(carouselIndex);
  startAutoRotate();
}

function showSlide(index) {
  document.querySelectorAll('.carousel-slide').forEach((slide, i) =>
    slide.classList.toggle('show', i === index)
  );
  document.querySelectorAll('.indicator').forEach((ind, i) =>
    ind.classList.toggle('active', i === index)
  );
}

/* ------------------------------------------------------------
   Pizzeria carousel (contact.html, hover effect)
   ------------------------------------------------------------ */
function initPizzeriaCarousel() {
  const hero   = document.querySelector('.contact-hero');
  const slides = document.querySelectorAll('.pizzeria-slide');
  if (!hero || slides.length === 0) return;

  showPizzariaSlide(0);
  hero.addEventListener('mouseenter', () => showPizzariaSlide(1));
  hero.addEventListener('mouseleave', () => showPizzariaSlide(0));
}

function showPizzariaSlide(index) {
  document.querySelectorAll('.pizzeria-slide').forEach((slide, i) =>
    slide.classList.toggle('show', i === index)
  );
}

/* ------------------------------------------------------------
   Floating widgets tooltip text (language-aware)
   ------------------------------------------------------------ */
const TOOLTIPS = {
  whatsapp: { en: 'Contact via WhatsApp', it: 'Contattaci su WhatsApp' },
  google:   { en: 'Our Google Reviews',   it: 'Le nostre recensioni Google' }
};

function updateFloatingTooltips(lang) {
  const waTooltip = document.querySelector('.whatsapp-tooltip');
  if (waTooltip) waTooltip.textContent = TOOLTIPS.whatsapp[lang] || TOOLTIPS.whatsapp.en;

  const gTooltip = document.querySelector('.google-reviews-tooltip');
  if (gTooltip) gTooltip.textContent = TOOLTIPS.google[lang] || TOOLTIPS.google.en;
}

/* ------------------------------------------------------------
   WhatsApp widget
   ------------------------------------------------------------ */
function injectWhatsApp() {
  if (document.querySelector('.whatsapp-widget')) return;
  const lang = document.documentElement.getAttribute('data-lang') || 'en';

  const widget = document.createElement('a');
  widget.href   = 'https://wa.me/390587721414';
  widget.target = '_blank';
  widget.rel    = 'noopener noreferrer';
  widget.className = 'whatsapp-widget';
  widget.setAttribute('aria-label', 'WhatsApp');

  widget.innerHTML = `
    <div class="whatsapp-widget-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="whatsapp-logo" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#25D366"/>
        <path fill="white" d="M22.5 9.5A9.1 9.1 0 0 0 7.2 20.4L6 26l5.8-1.5A9.1 9.1 0 0 0 22.5 9.5zm-6.5 14a7.5 7.5 0 0 1-3.8-1l-.3-.2-3.1.8.8-3-.2-.3A7.5 7.5 0 1 1 16 23.5zm4.1-5.6c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1-.5.7-.6.8-.2.2-.4.1a6 6 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.5c-.1-.2 0-.4.1-.5l.3-.4.2-.3v-.3l-.7-1.6c-.2-.4-.4-.3-.5-.3h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.8 4.8 0 0 0 1 2.4 10.9 10.9 0 0 0 4.1 3.6 4.5 4.5 0 0 0 2.7.6 2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.5-.3z"/>
      </svg>
      <span class="whatsapp-tooltip">${TOOLTIPS.whatsapp[lang]}</span>
    </div>
  `;
  document.body.appendChild(widget);
}

/* ------------------------------------------------------------
   Google Reviews widget
   ------------------------------------------------------------ */
function injectGoogleReviews() {
  if (document.querySelector('.google-reviews-widget')) return;
  const lang = document.documentElement.getAttribute('data-lang') || 'en';

  const widget = document.createElement('a');
  widget.href   = 'https://www.google.com/maps/place/Pizzeria+da+Gino/@43.662879,10.6346143,17z/data=!4m16!1m9!3m8!1s0x132a75ee92fe77c7:0xc6d37d62beb9f284!2sPizzeria+da+Gino!8m2!3d43.662879!4d10.6346143!9m1!1b1!16s%2Fg%2F11bwqbprts!3m5!1s0x132a75ee92fe77c7:0xc6d37d62beb9f284!8m2!3d43.662879!4d10.6346143!16s%2Fg%2F11bwqbprts?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDUxNy4wIKXMDSoASAFQAw%3D%3D';
  widget.target = '_blank';
  widget.rel    = 'noopener noreferrer';
  widget.className = 'google-reviews-widget';
  widget.setAttribute('aria-label', 'Google Reviews');

  widget.innerHTML = `
    <div class="google-reviews-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
      </svg>
      <span class="google-reviews-tooltip">${TOOLTIPS.google[lang]}</span>
    </div>
  `;
  document.body.appendChild(widget);
}

/* ------------------------------------------------------------
   Mobile video autoplay
   ------------------------------------------------------------ */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  videos.forEach(video => {
    // Ensure muted + playsinline are set programmatically (some browsers need this)
    video.muted = true;
    video.playsInline = true;

    function tryPlay() {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    }

    // Attempt 1: immediately
    tryPlay();

    // Attempt 2: when video enters the viewport
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) tryPlay(); });
      }, { threshold: 0.1 });
      io.observe(video);
    }

    // Attempt 3: on first user interaction (required by some strict browsers)
    ['touchstart', 'touchend', 'click'].forEach(evt => {
      document.addEventListener(evt, tryPlay, { once: true, passive: true });
    });
  });
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initNavScroll();
  initMobileMenu();
  initReveal();
  initLanguage();
  initCarousel();
  initPizzeriaCarousel();
  injectWhatsApp();
  injectGoogleReviews();
  initVideoAutoplay();
  // Sync tooltips to current language at startup
  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  updateFloatingTooltips(lang);
});

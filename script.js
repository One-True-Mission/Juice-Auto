/* ============================================================
   JUICE AUTOMOTIVE - script.js
   Bilingual engine, hamburger, gallery carousel, nav state
   ============================================================ */

/* ---------- BILINGUAL ENGINE ---------- */
(function () {
  var STORAGE_KEY = 'juice-lang';
  var current = localStorage.getItem(STORAGE_KEY) || 'en';

  function applyLang(lang) {
    current = lang;
    document.documentElement.setAttribute('lang', lang);

    // Text nodes tagged with data-en / data-es
    var nodes = document.querySelectorAll('[data-en]');
    nodes.forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val !== null) el.textContent = val;
    });

    // Placeholders tagged with data-en-ph / data-es-ph
    var phNodes = document.querySelectorAll('[data-en-ph]');
    phNodes.forEach(function (el) {
      var val = el.getAttribute('data-' + lang + '-ph');
      if (val !== null) el.setAttribute('placeholder', val);
    });

    // Toggle button label shows the OTHER language
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      var label = toggle.querySelector('.lang-label');
      if (label) label.textContent = (lang === 'en') ? 'Español' : 'English';
    }

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function init() {
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        applyLang(current === 'en' ? 'es' : 'en');
      });
    }
    applyLang(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---------- HAMBURGER / MOBILE PANEL ---------- */
(function () {
  function init() {
    var burger = document.getElementById('hamburger');
    var panel = document.getElementById('navPanel');
    var backdrop = document.getElementById('navBackdrop');
    if (!burger || !panel || !backdrop) return;

    function open() {
      burger.classList.add('is-open');
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      burger.classList.remove('is-open');
      panel.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (panel.classList.contains('is-open')) close(); else open();
    }

    burger.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

/* ---------- ACTIVE NAV STATE ---------- */
(function () {
  function init() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.classList.add('is-active');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

/* ---------- GALLERY CAROUSEL (peek / featured) ---------- */
(function () {
  function init() {
    var carousel = document.querySelector('.gallery-carousel');
    if (!carousel) return;
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    if (slides.length === 0) return;

    var index = 0;
    var timer = null;
    var DWELL = 2000; // featured image holds for 2 seconds before advancing

    // build dots
    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', function () { goTo(i, true); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function layout() {
      var slideW = slides[0].offsetWidth; // layout width, ignores the scale transform
      var viewportW = carousel.querySelector('.carousel-viewport').offsetWidth;
      var offset = (viewportW / 2) - (slideW / 2) - (index * slideW);
      track.style.transform = 'translateX(' + offset + 'px)';
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    }
    function goTo(i, manual) {
      index = (i + slides.length) % slides.length;
      layout();
      if (manual) restart();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function start() {
      stop();
      timer = setTimeout(function () { next(); start(); }, DWELL);
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function restart() { start(); }

    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1, true); });
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1, true); });
    slides.forEach(function (s, i) {
      s.addEventListener('click', function () { if (i !== index) goTo(i, true); });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, { passive: true });
    carousel.addEventListener('touchend', start, { passive: true });
    window.addEventListener('resize', layout);

    layout();
    start();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

/* ---------- FORM VALIDATION ---------- */
(function () {
  function init() {
    var form = document.getElementById('bookForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      var required = form.querySelectorAll('[required]');
      var ok = true;
      required.forEach(function (f) {
        if (!f.value.trim()) {
          ok = false;
          f.style.borderColor = '#c0392b';
        } else {
          f.style.borderColor = '';
        }
      });
      if (!ok) e.preventDefault();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
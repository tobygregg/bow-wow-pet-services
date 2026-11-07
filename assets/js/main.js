/* ─────────────────────────────────────────────────────────────
   BoW WoW Pet Services – site scripts (vanilla JS, no libraries)
   Header · mobile menu · reveals · services explorer · photo ribbon
   gallery + lightbox · quote form
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header: solid background once scrolled ───────────────── */
  var header = document.querySelector('.site-header');
  var mobileBar = document.querySelector('.mobile-bar');
  var contact = document.getElementById('contact');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hide the sticky mobile bar while the contact form is on screen
  if (mobileBar && contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mobileBar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(contact);
  }

  /* ── Mobile menu ──────────────────────────────────────────── */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
    menu.hidden = !open;
    header.classList.toggle('menu-open', open);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  }

  /* ── Active nav link ──────────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          byId[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navIo.observe(el);
    });
  }

  /* ── Scroll reveals ───────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ── Photo ribbon: duplicate items for a seamless loop ────── */
  var track = document.querySelector('.ribbon-track');
  if (track && !reduceMotion) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      var img = c.querySelector('img');
      if (img) img.alt = '';
      track.appendChild(c);
    });
  }

  /* ── Services explorer (ARIA tabs) ────────────────────────── */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.svc-tab'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    // keep the chosen chip in view on mobile
    var list = tab.parentElement;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  // Swipe between services on the photo (mobile)
  var panels = document.querySelector('.svc-panels');
  if (panels && tabs.length) {
    var sx = null, sy = null;
    panels.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    panels.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && e.target.closest('.svc-photo')) {
        var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
        selectTab(tabs[(cur + (dx < 0 ? 1 : -1) + tabs.length) % tabs.length]);
      }
      sx = null;
    });
  }

  /* ── "Ask about…" buttons pre-select the service in the form ─ */
  var serviceSelect = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!serviceSelect) return;
      var want = btn.getAttribute('data-service');
      Array.prototype.forEach.call(serviceSelect.options, function (o) { if (o.text === want) serviceSelect.value = o.value || o.text; });
    });
  });

  /* ── Gallery: show more + lightbox ────────────────────────── */
  var gallery = document.querySelector('[data-gallery]');
  var moreBtn = document.querySelector('[data-gallery-more]');
  if (gallery && moreBtn) {
    moreBtn.addEventListener('click', function () {
      var open = gallery.classList.toggle('show-all');
      moreBtn.setAttribute('aria-expanded', String(open));
      moreBtn.textContent = open ? 'Show fewer photos' : 'Show more photos';
      if (open) gallery.querySelectorAll('.g-more').forEach(function (el) { el.classList.add('is-visible'); });
    });
  }

  var lb = document.getElementById('lightbox');
  if (gallery && lb) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.g-item'));
    var lbImg = lb.querySelector('.lb-img');
    var lbText = lb.querySelector('.lb-text');
    var lbCount = lb.querySelector('.lb-count');
    var current = 0, lastFocus = null;

    function visibleItems() { return items.filter(function (el) { return el.offsetParent !== null; }); }
    function show(i) {
      var list = visibleItems();
      current = (i + list.length) % list.length;
      var img = list[current].querySelector('img');
      var full = img.getAttribute('srcset').split(',').pop().trim().split(' ')[0];
      lbImg.src = full;
      lbImg.alt = img.alt;
      lbText.textContent = list[current].getAttribute('data-caption') || '';
      lbCount.textContent = (current + 1) + ' / ' + list.length;
    }
    function openLb(el) {
      lastFocus = el;
      show(visibleItems().indexOf(el));
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }
    function closeLb() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (el) {
      el.setAttribute('aria-label', 'Open photo: ' + (el.getAttribute('data-caption') || 'gallery photo'));
      el.addEventListener('click', function () { openLb(el); });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'Tab') { // keep focus inside the viewer
        var f = lb.querySelectorAll('button');
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      tx = null;
    });
  }

  /* ── Quote form: inline validation + sending state ────────── */
  var form = document.querySelector('.quote-form');
  if (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('.field'));
    function check(f) {
      var ok = f.checkValidity() && f.value.trim() !== '';
      f.closest('.f-group').classList.toggle('has-error', !ok);
      f.setAttribute('aria-invalid', String(!ok));
      return ok;
    }
    fields.forEach(function (f) {
      var err = f.closest('.f-group').querySelector('.f-error');
      if (err) { err.id = f.id + '-err'; f.setAttribute('aria-describedby', err.id); }
      f.addEventListener('blur', function () { if (f.value) check(f); });
      f.addEventListener('input', function () { if (f.closest('.f-group').classList.contains('has-error')) check(f); });
    });
    form.addEventListener('submit', function (e) {
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { e.preventDefault(); bad[0].focus(); return; }
      form.classList.add('is-sending');
      var label = form.querySelector('.btn-label');
      if (label) label.textContent = 'Sending…';
    });
  }

  /* ── Footer year ──────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

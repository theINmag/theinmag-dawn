/* ==========================================================================
   theinmag-section-bg-parallax.js

   Mobile stand-in for `background-attachment: fixed` on the sitewide
   .theinmag-section-bg layer (snippets/theinmag-section-bg.liquid).

   WHY THIS EXISTS. background-attachment: fixed is what gives the locked
   background look on desktop: the image holds still while the section scrolls
   over it. Phones cannot paint that smoothly. WebKit (iOS Safari and the
   Instagram / Facebook in-app browsers, which is most of our traffic) repaints
   a fixed background in steps instead of compositing it during scroll, and
   every time the URL bar slides in or out the visual viewport resizes so
   background-size: cover re-crops the image. Both read to a user as the
   background jumping around. Ryan reported exactly that on /pages/newsletter
   on 2026-08-04.

   WHAT THIS DOES INSTEAD. The image layer is made one large-viewport tall and
   moved with translate3d by exactly the distance its section has scrolled.
   That lands it in the same place a fixed background would sit, so the look is
   unchanged, but a transform is GPU-composited (no repaint stutter) and 100lvh
   does not change when the URL bar hides (nothing to re-crop). No jump.

   PROGRESSIVE ENHANCEMENT. This sets data-theinmag-bg-parallax on each layer it
   drives, and that attribute is what switches on the matching CSS in
   assets/theinmag-base.css. A browser that never runs this file keeps the plain
   scrolling background instead of a broken half-state. It never runs on desktop
   (which keeps real background-attachment: fixed) or under
   prefers-reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  /* Double-bind guard - the snippet emits this script tag once per render and
     a page can render the background snippet more than once. Same pattern as
     __theinmagTileAddInit. */
  if (window.__theinmagSectionBgParallax) return;
  window.__theinmagSectionBgParallax = true;

  if (!window.matchMedia || !window.requestAnimationFrame) return;

  /* Must stay in step with the media query in assets/theinmag-base.css. */
  var MOBILE = '(max-width: 749px), (hover: none) and (pointer: coarse)';

  var mqMobile = window.matchMedia(MOBILE);
  var mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var layers = [];
  var running = false;
  var ticking = false;

  function collect() {
    layers = [];
    var nodes = document.querySelectorAll('.theinmag-section-bg__image');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      /* The clipping wrapper. It is inset:0 inside the calling section, so its
         box is the section's box, and it is what the image must be measured
         against. */
      var wrap = el.parentElement;
      if (!wrap) continue;
      layers.push({ el: el, wrap: wrap, top: 0 });
    }
  }

  /* Document-relative offsets, read once per start/resize rather than per
     frame, so scrolling never forces a layout. */
  function measure() {
    var sy = window.pageYOffset;
    for (var i = 0; i < layers.length; i++) {
      layers[i].top = layers[i].wrap.getBoundingClientRect().top + sy;
    }
  }

  function paint() {
    ticking = false;
    var sy = window.pageYOffset;
    for (var i = 0; i < layers.length; i++) {
      /* How far this section has travelled up past the top of the viewport.
         Moving the image down by that amount cancels the section's movement,
         so the image sits still on screen, which is the fixed-background look. */
      layers[i].el.style.transform = 'translate3d(0,' + (sy - layers[i].top) + 'px,0)';
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  /* Permanent, attached once. Re-checks whether we should be running at all
     (belt and braces: the media query 'change' event is the primary signal,
     but converging from resize too means a missed event cannot strand a layer
     in the wrong state), then re-measures if we are. */
  function onResize() {
    sync();
    if (!running) return;
    measure();
    onScroll();
  }

  function onLoad() {
    /* Late images and webfonts push sections down the page, so offsets taken
       at DOM-ready go stale. */
    if (running) {
      measure();
      onScroll();
    }
  }

  function start() {
    if (running) return;
    collect();
    if (!layers.length) return;
    running = true;
    for (var i = 0; i < layers.length; i++) {
      layers[i].el.setAttribute('data-theinmag-bg-parallax', '');
    }
    measure();
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function stop() {
    if (!running) return;
    running = false;
    for (var i = 0; i < layers.length; i++) {
      layers[i].el.removeAttribute('data-theinmag-bg-parallax');
      layers[i].el.style.transform = '';
    }
    window.removeEventListener('scroll', onScroll);
  }

  function sync() {
    if (mqMobile.matches && !mqReduced.matches) start();
    else stop();
  }

  function listen(mq) {
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);
  }

  function init() {
    sync();
    listen(mqMobile);
    listen(mqReduced);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('load', onLoad);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

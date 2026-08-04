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

  /* PREFERRED PATH. Where scroll-driven animations exist, the CSS in
     assets/theinmag-base.css does the moving and the browser advances it off
     the main thread, so it cannot fall behind the page the way a scroll
     listener can. All this file does then is write the section height into
     --theinmag-bg-h (the keyframe end point needs it) and flip the attribute
     that arms the CSS. No scroll listener, no per-frame work at all. */
  var COMPOSITED =
    !!(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()'));

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
      layers.push({ el: el, wrap: wrap });
    }
  }

  /* Composited path only: hand the section height to the keyframes. Runs on
     start and on resize, never per frame. */
  function measure() {
    for (var i = 0; i < layers.length; i++) {
      var h = layers[i].wrap.getBoundingClientRect().height;
      layers[i].wrap.style.setProperty('--theinmag-bg-h', h + 'px');
    }
  }

  function paint() {
    ticking = false;
    for (var i = 0; i < layers.length; i++) {
      /* Read the section's CURRENT position rather than a cached offset, so
         anything that shifts the page (a late image, a reflow, chrome moving)
         cannot leave the background sitting at a stale distance. One rect read
         per layer per frame is cheap: pages carry one or two of these. */
      var top = layers[i].wrap.getBoundingClientRect().top;
      /* Cancelling the section's own movement leaves the image sitting still
         on screen, which is the fixed-background look. */
      layers[i].el.style.transform = 'translate3d(0,' + -top + 'px,0)';
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
    if (COMPOSITED) {
      /* The section height feeds the keyframe end point, so it has to be
         rewritten whenever the section can have changed size. */
      measure();
      return;
    }
    onScroll();
  }

  function onLoad() {
    /* Late images and webfonts change section heights. */
    if (running) onResize();
  }

  function start() {
    if (running) return;
    collect();
    if (!layers.length) return;
    running = true;
    for (var i = 0; i < layers.length; i++) {
      /* Puts the image layer one viewport tall, on both paths. */
      layers[i].el.setAttribute('data-theinmag-bg-parallax', '');
    }
    if (COMPOSITED) {
      measure();
      for (var j = 0; j < layers.length; j++) {
        /* Arms the CSS scroll-driven animation. Set last, so the height is
           already in place and the animation never runs a frame against a
           missing end point. */
        layers[j].wrap.setAttribute('data-theinmag-bg-lock', '');
      }
      return;
    }
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function stop() {
    if (!running) return;
    running = false;
    for (var i = 0; i < layers.length; i++) {
      layers[i].el.removeAttribute('data-theinmag-bg-parallax');
      layers[i].el.style.transform = '';
      layers[i].wrap.removeAttribute('data-theinmag-bg-lock');
      layers[i].wrap.style.removeProperty('--theinmag-bg-h');
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

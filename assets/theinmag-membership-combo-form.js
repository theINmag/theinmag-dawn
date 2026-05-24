(function () {
  'use strict';

  /* Combo Membership PDP selector + gallery. Adapted from
     theinmag-membership-form.js for the single-option (Length) bundle
     product: the Combo product carries ONE option, so variant matching
     keys off option1 = Length. No Format selector, no Digital-only path,
     no Rolling (architecture-blocked). The Combo always ships the print
     copy, so the starting-issue chooser + print-stock gating stay. */

  const section = document.querySelector('[data-theinmag-membership-combo-form]');
  if (!section) return;

  const form = section.querySelector('[data-membership-form]');
  if (!form) return;

  const variantsScript = section.querySelector('[data-membership-variants]');
  if (!variantsScript) return;

  let variants;
  try {
    variants = JSON.parse(variantsScript.textContent);
  } catch (err) {
    console.error('[theinmag-membership-combo-hero] failed to parse variants JSON', err);
    return;
  }

  const variantInput = form.querySelector('[data-variant-id-input]');
  const priceDisplay = section.querySelector('[data-price-display]');
  const propStarting = form.querySelector('[data-prop-starting-mag]');
  const propRemaining = form.querySelector('[data-prop-remaining]');
  const propIncluded = form.querySelector('[data-prop-mags-included]');
  const widget = section.querySelector('[data-widget]');
  /* Floating-cart elements live OUTSIDE the section in the DOM (so their
     z-index escapes the hero's stacking context), so look them up at
     document level. */
  const backToOrder = document.querySelector('[data-back-to-order]');
  const floatingSummary = document.querySelector('[data-floating-cart-summary]');
  const floatingIssue = document.querySelector('[data-floating-cart-issue]');
  const floatingCtaPrice = document.querySelector('[data-floating-cart-cta-price]');
  const floatingTap = document.querySelector('[data-floating-cart-tap]');
  const floatingCta = document.querySelector('[data-floating-cart-cta]');

  const currentIssue = section.dataset.currentIssue;
  const nextIssue = section.dataset.nextIssue;
  const printInStock = section.dataset.printInStock === 'true';

  function selectedTile(optionName) {
    return form.querySelector(
      '[data-option-name="' + optionName + '"] [aria-pressed="true"]'
    );
  }
  function selected(optionName) {
    const tile = selectedTile(optionName);
    return tile ? tile.dataset.value : null;
  }
  function setSelected(optionName, value) {
    const tiles = form.querySelectorAll(
      '[data-option-name="' + optionName + '"] [data-value]'
    );
    tiles.forEach(function (tile) {
      tile.setAttribute('aria-pressed', tile.dataset.value === value ? 'true' : 'false');
    });
  }

  function formatMoney(cents) { return '$' + (cents / 100).toFixed(2); }
  function padNumber(n) { return n < 10 ? '0' + n : String(n); }
  function issueNumberOf(label) { return parseInt(String(label).replace('Mag', ''), 10); }
  function magLabelFor(n) { return 'Mag' + padNumber(n); }

  function countForLength(length) { return length === '8-Issue' ? 8 : 4; }

  function computeMagsIncluded(startMag, length) {
    const count = countForLength(length);
    const startNum = issueNumberOf(startMag);
    const labels = [];
    for (let i = 0; i < count; i += 1) {
      labels.push(magLabelFor(startNum + i));
    }
    return labels.join(', ');
  }
  function computeRemainingAfterFirst(length) {
    return String(countForLength(length) - 1);
  }
  function findVariant(length) {
    return variants.find(function (v) { return v.option1 === length; });
  }

  function update() {
    const length = selected('length');
    let starting = selected('starting');

    /* The Combo always includes the print copy, so the "current issue"
       start is only offered when the current print issue is in stock. */
    const currentTile = form.querySelector('[data-option-name="starting"] [data-value="current"]');
    if (currentTile) {
      currentTile.hidden = !printInStock;
      if (!printInStock && starting === 'current') {
        starting = 'next';
        setSelected('starting', 'next');
      }
    }

    const variant = findVariant(length);
    if (variant) {
      if (variantInput) variantInput.value = variant.id;
      if (priceDisplay) priceDisplay.textContent = formatMoney(variant.price);
      if (floatingCtaPrice) floatingCtaPrice.textContent = formatMoney(variant.price);
    }

    if (floatingSummary && length) {
      floatingSummary.textContent = length + ' Combo';
    }
    if (floatingIssue) {
      const startMagForCard = starting === 'current' ? currentIssue : nextIssue;
      const startLabel = starting === 'current' ? 'Start with ' : 'Starts with ';
      floatingIssue.textContent = startLabel + startMagForCard;
    }

    const startMag = starting === 'current' ? currentIssue : nextIssue;
    if (propStarting) propStarting.value = startMag;
    if (propRemaining) propRemaining.value = computeRemainingAfterFirst(length);
    if (propIncluded) propIncluded.value = computeMagsIncluded(startMag, length);
  }

  /* Media gallery - one big main image plus a thumb strip below. One slide
     visible at a time; clicking a thumb or a prev/next arrow toggles it. */
  (function gallery() {
    const slides = Array.prototype.slice.call(section.querySelectorAll('[data-slide]'));
    const thumbBtns = Array.prototype.slice.call(section.querySelectorAll('[data-thumb]'));
    if (slides.length === 0) return;

    let activeSlide = 0;
    function show(i) {
      activeSlide = (i + slides.length) % slides.length;
      slides.forEach(function (slide, j) {
        slide.classList.toggle('is-active', j === activeSlide);
      });
      thumbBtns.forEach(function (btn, j) {
        btn.classList.toggle('is-active', j === activeSlide);
      });
    }

    thumbBtns.forEach(function (btn, j) {
      btn.addEventListener('click', function () { show(j); });
    });

    const prevArrow = section.querySelector('[data-media-prev]');
    const nextArrow = section.querySelector('[data-media-next]');
    if (prevArrow) prevArrow.addEventListener('click', function () { show(activeSlide - 1); });
    if (nextArrow) nextArrow.addEventListener('click', function () { show(activeSlide + 1); });
  })();

  form.querySelectorAll('[data-option-name] [data-value]').forEach(function (tile) {
    tile.addEventListener('click', function () {
      const group = tile.closest('[data-option-name]');
      if (!group) return;
      setSelected(group.dataset.optionName, tile.dataset.value);
      update();
    });
  });

  /* Accordion open/close - one at a time. */
  const accTriggers = section.querySelectorAll('[data-acc-trigger]');
  accTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.closest('[data-accordion]').querySelector('[data-acc-panel]');

      accTriggers.forEach(function (other) {
        if (other !== trigger && other.getAttribute('aria-expanded') === 'true') {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = other.closest('[data-accordion]').querySelector('[data-acc-panel]');
          if (otherPanel) otherPanel.setAttribute('data-open', 'false');
        }
      });

      trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.setAttribute('data-open', expanded ? 'false' : 'true');
    });
  });

  /* "Back to my order" floating button visibility - shown when the widget's
     bottom has scrolled past the top of viewport. */
  function syncBackToOrder() {
    if (!backToOrder || !widget) return;
    const rect = widget.getBoundingClientRect();
    const widgetBottom = rect.top + rect.height;
    backToOrder.dataset.show = widgetBottom >= 0 ? 'false' : 'true';
  }

  function onScroll() {
    syncBackToOrder();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  syncBackToOrder();

  function scrollBackToWidget() {
    if (!widget) return;
    const header = document.querySelector('.theinmag-header-section') || document.querySelector('header[role="banner"]');
    const headerH = header ? header.offsetHeight : 0;
    const top = widget.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  }

  if (floatingTap) {
    floatingTap.addEventListener('click', scrollBackToWidget);
  }

  if (floatingCta && form) {
    floatingCta.addEventListener('click', function () {
      update();
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.submit();
      }
    });
  }

  const ratingLink = section.querySelector('[data-rating-jump]');
  if (ratingLink) {
    ratingLink.addEventListener('click', function (evt) {
      const href = ratingLink.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      evt.preventDefault();
      const header = document.querySelector('.theinmag-header-section') || document.querySelector('header[role="banner"]');
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  update();
})();

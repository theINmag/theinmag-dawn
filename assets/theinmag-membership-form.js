(function () {
  'use strict';

  const section = document.querySelector('[data-theinmag-membership-form]');
  if (!section) return;

  const form = section.querySelector('[data-membership-form]');
  if (!form) return;

  const variantsScript = section.querySelector('[data-membership-variants]');
  if (!variantsScript) return;

  let variants;
  try {
    variants = JSON.parse(variantsScript.textContent);
  } catch (err) {
    console.error('[theinmag-membership-hero] failed to parse variants JSON', err);
    return;
  }

  const variantInput = form.querySelector('[data-variant-id-input]');
  const priceDisplay = section.querySelector('[data-price-display]');
  const propStarting = form.querySelector('[data-prop-starting-mag]');
  const propRemaining = form.querySelector('[data-prop-remaining]');
  const propIncluded = form.querySelector('[data-prop-mags-included]');
  const heroSwap = section.querySelector('[data-hero-swap]');
  const thumbSwap = section.querySelector('[data-thumb-swap]');
  const heroPrint = section.dataset.heroPrint;
  const heroDigital = section.dataset.heroDigital;
  const heroCombo = section.dataset.heroCombo;
  const primaryCta = section.querySelector('[data-primary-cta]');
  const widget = section.querySelector('[data-widget]');
  /* Floating-cart elements are document-level lookups: the aside lives
     OUTSIDE the hero section in the DOM (so its z-index escapes the
     hero's stacking context), so section.querySelector won't find it. */
  const backToOrder = document.querySelector('[data-back-to-order]');
  const floatingSummary = document.querySelector('[data-floating-cart-summary]');
  const floatingIssue = document.querySelector('[data-floating-cart-issue]');
  const floatingCtaPrice = document.querySelector('[data-floating-cart-cta-price]');
  const floatingTap = document.querySelector('[data-floating-cart-tap]');
  const floatingCta = document.querySelector('[data-floating-cart-cta]');
  const rollingOnlyEls = section.querySelectorAll('[data-rolling-only]');
  const shippingNote = section.querySelector('[data-shipping-note]');
  const postAddTile = section.querySelector('[data-post-add-tile]');

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

  function computeMagsIncluded(startMag, length) {
    if (length === 'Rolling') return startMag;
    const count = length === '4-Issue' ? 4 : 8;
    const startNum = issueNumberOf(startMag);
    const labels = [];
    for (let i = 0; i < count; i += 1) {
      labels.push(magLabelFor(startNum + i));
    }
    return labels.join(', ');
  }
  function computeRemainingAfterFirst(length) {
    if (length === '4-Issue') return '3';
    if (length === '8-Issue') return '7';
    return '0';
  }
  function findVariant(format, length) {
    return variants.find(function (v) {
      return v.option1 === format && v.option2 === length;
    });
  }

  function heroSrcFor(format) {
    if (format === 'Digital' && heroDigital) return heroDigital;
    if (format === 'Combo' && heroCombo) return heroCombo;
    return heroPrint;
  }

  /* Price shown on each Length pill + inside the Add to cart button. */
  const ctaPrice = section.querySelector('[data-cta-price]');
  const lengthPriceEls = Array.prototype.slice.call(
    form.querySelectorAll('[data-option-name="length"] [data-pill-price]')
  );
  function priceLabel(cents, length) {
    return formatMoney(cents) + (length === 'Rolling' ? '/drop' : '');
  }

  function update() {
    const format = selected('format');
    const length = selected('length');
    let starting = selected('starting');

    const currentTile = form.querySelector('[data-option-name="starting"] [data-value="current"]');
    const startingGroup = form.querySelector('[data-starting-group]');
    const digitalStartNote = form.querySelector('[data-digital-start-note]');

    if (format === 'Digital') {
      /* Digital has no print-stock wait and no "next issue" split - it
         always begins with the current issue. Force current, hide the
         chooser, and show the explanatory note. (Combo keeps the choice
         because it ships the print copy.) */
      starting = 'current';
      setSelected('starting', 'current');
      if (currentTile) currentTile.hidden = false;
      if (startingGroup) startingGroup.hidden = true;
      if (digitalStartNote) digitalStartNote.hidden = false;
    } else {
      if (startingGroup) startingGroup.hidden = false;
      if (digitalStartNote) digitalStartNote.hidden = true;
      const needsPrintStock = format === 'Print' || format === 'Combo';
      const hideCurrent = needsPrintStock && !printInStock;
      if (currentTile) {
        currentTile.hidden = hideCurrent;
        if (hideCurrent && starting === 'current') {
          starting = 'next';
          setSelected('starting', 'next');
        }
      }
    }

    const variant = findVariant(format, length);
    if (variant) {
      if (variantInput) variantInput.value = variant.id;
      if (priceDisplay) {
        let priceStr = formatMoney(variant.price);
        if (length === 'Rolling') priceStr += ' per drop';
        priceDisplay.textContent = priceStr;
      }
      /* Mirror the price onto the floating cart CTA. Rolling still
         reads "$X per drop" so the user sees what they will be charged
         at the next drop, not a fictional total. */
      if (floatingCtaPrice) {
        let ctaPriceStr = formatMoney(variant.price);
        if (length === 'Rolling') ctaPriceStr += ' / drop';
        floatingCtaPrice.textContent = ctaPriceStr;
      }
    }

    /* Repaint each Length pill's price for the chosen format, and the price
       inside the Add to cart button. */
    lengthPriceEls.forEach(function (el) {
      const tile = el.closest('[data-value]');
      const len = tile ? tile.dataset.value : null;
      const v = len ? findVariant(format, len) : null;
      el.textContent = v ? priceLabel(v.price, len) : '';
    });
    if (ctaPrice) ctaPrice.textContent = variant ? priceLabel(variant.price, length) : '';

    /* Floating cart summary: e.g. "4-Issue Print" + "Start with Mag09".
       Length-then-format reads more naturally per Ryan's call - "4-Issue
       Print" rolls off the tongue better than "Print - 4-Issue". */
    if (floatingSummary && format && length) {
      floatingSummary.textContent = length + ' ' + format;
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

    /* Variant image swap on Format selection - both the main hero photo
       (top of the left column) and the first thumbnail in the strip. */
    const nextSrc = heroSrcFor(format);
    if (heroSwap && nextSrc && heroSwap.src !== nextSrc) heroSwap.src = nextSrc;
    if (thumbSwap && nextSrc && thumbSwap.src !== nextSrc) thumbSwap.src = nextSrc;

    /* Cancel-anytime accordion appears only on Rolling. */
    rollingOnlyEls.forEach(function (el) {
      el.hidden = length !== 'Rolling';
    });

    /* Rolling Print + Rolling Combo have shipping baked into the price per
       spec 2.16. Flag this up-front so customers don't expect to be charged
       again at checkout. (Backend variant flagging lands in Stage 7.) */
    if (shippingNote) {
      const hasShipping = (format === 'Print' || format === 'Combo') && length === 'Rolling';
      shippingNote.hidden = !hasShipping;
    }

    /* Post-add wait-time tile is print-relevant. Hide for Digital-only
       customers - their mag lands in their inbox, no road trip. */
    if (postAddTile) {
      postAddTile.hidden = format === 'Digital';
    }
  }

  /* Media gallery - one big main image plus a thumb strip below, mirroring
     the typical product page (theinmag-single-mags-hero). One slide is
     visible at a time; clicking a thumb or a prev/next arrow toggles the
     active slide. Slide 0 is the Format-driven variant photo, kept in
     sync by update() via data-hero-swap / data-thumb-swap. */
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
     bottom has scrolled past the top of viewport so the user is below the
     order surface and needs a quick path back to confirm + add. Click
     scrolls smoothly back to the widget top, header-offset aware. */
  function syncBackToOrder() {
    if (!backToOrder || !widget) return;
    const rect = widget.getBoundingClientRect();
    const widgetBottom = rect.top + rect.height;
    /* data-show drives a CSS opacity + translateY transition. Toggling
       it (instead of the hidden attribute which hard-flips display)
       lets the card slide in from above on desktop / from below on
       mobile when the user scrolls past the widget. */
    backToOrder.dataset.show = widgetBottom >= 0 ? 'false' : 'true';
  }

  function onScroll() {
    syncBackToOrder();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  syncBackToOrder();

  /* Floating cart - body tap scrolls back to the widget; CTA submits
     the form's currently-selected variant. The listener sits on the
     inner tap button (not the outer data-back-to-order wrapper) so
     the CTA's click doesn't accidentally trigger a scroll-back too. */
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
    floatingCta.addEventListener('click', function (evt) {
      /* Re-run update() before submit so the form's hidden inputs are
         in sync with whatever the user last picked - cheap insurance
         in case the card was clicked without an intervening update. */
      update();
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.submit();
      }
    });
  }

  /* Rating-link click scrolls to the reviews section. Header-offset aware
     so the target heading isn't hidden behind the sticky nav. */
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

  /* Pre-select Format / Length from URL query params. The /pages/membership
     chooser deep-links here as ?format=Print&length=8-Issue so the buyer
     lands on the chosen plan, then still picks current-vs-next issue before
     adding to cart. Only applies a value if a matching pill exists. */
  (function preselectFromQuery() {
    var params = new URLSearchParams(window.location.search);
    ['format', 'length'].forEach(function (name) {
      var val = params.get(name);
      if (!val) return;
      var safe = window.CSS && CSS.escape ? CSS.escape(val) : val;
      var tile = form.querySelector('[data-option-name="' + name + '"] [data-value="' + safe + '"]');
      if (tile) setSelected(name, val);
    });
  })();

  update();
})();

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
  const valuePriceEl = section.querySelector('[data-value-price]');
  const perMagEl = section.querySelector('[data-per-mag]');
  const saveEl = section.querySelector('[data-save]');
  const singlePrint = parseInt(section.dataset.singlePrint || '0', 10) || 0;
  const singleDigital = parseInt(section.dataset.singleDigital || '0', 10) || 0;

  const currentIssue = section.dataset.currentIssue;
  const nextIssue = section.dataset.nextIssue;
  const printInStock = section.dataset.printInStock === 'true';

  /* First-mag step. For Print the starting issue is picked in the shared
     start picker dialog (assets/theinmag-start-picker.js), which opens on
     the first Add to cart / Buy now and gates the submit. Digital always
     starts with the current issue and never sees it. */
  const firstMagRow = section.querySelector('[data-first-mag]');
  const firstMagCover = section.querySelector('[data-first-mag-cover]');
  const firstMagName = section.querySelector('[data-first-mag-name]');
  const firstMagNote = section.querySelector('[data-first-mag-note]');
  const firstMagChange = section.querySelector('[data-first-mag-change]');
  const printStartHint = section.querySelector('[data-print-start-hint]');
  let chosenStart = null;      /* e.g. "Mag09" once picked for Print */
  let pendingSubmitter = null; /* the button that started the gated submit */

  function picker() { return window.theinmagStartPicker || null; }
  function needsPick(format) { return format === 'Print' && !chosenStart; }

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

  function computeMagsIncluded(startMag, length, skipSoldOut) {
    /* The picker knows which issues are sold out and skips them for Print.
       Digital never skips (digital is never sold out). Falls back to the
       plain consecutive list if the picker script has not loaded. */
    const p = picker();
    if (p && typeof p.compute === 'function') {
      return p.compute(startMag, length, { skipSoldOut: skipSoldOut !== false }).magsIncluded;
    }
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

  /* Subscription selling-plan input - enabled (and set) only when the chosen
     variant carries a selling plan (Rolling), so Shopify creates a subscription. */
  const sellingPlanInput = form.querySelector('[data-selling-plan-input]');

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

    /* Starting issue. Digital: always the current issue, say so, hide the
       first-mag row. Print: show the picked mag (cover + name + note) once
       chosen, otherwise the one-line hint that the pick comes next. */
    const digitalStartNote = form.querySelector('[data-digital-start-note]');
    let startMag;
    if (format === 'Digital') {
      startMag = currentIssue;
      if (digitalStartNote) digitalStartNote.hidden = false;
      if (firstMagRow) firstMagRow.hidden = true;
      if (printStartHint) printStartHint.hidden = true;
    } else {
      if (digitalStartNote) digitalStartNote.hidden = true;
      if (chosenStart) {
        startMag = chosenStart;
        if (firstMagRow) firstMagRow.hidden = false;
        if (printStartHint) printStartHint.hidden = true;
        if (firstMagName) firstMagName.textContent = chosenStart;
        if (firstMagNote) {
          const p = picker();
          const st = p ? p.state() : null;
          const chosenNum = issueNumberOf(chosenStart);
          const curNum = issueNumberOf(currentIssue);
          if (chosenNum > curNum) {
            firstMagNote.textContent = 'Ships on drop day' + (st && st.releaseText ? ', ' + st.releaseText : '') + '.';
          } else if (st && st.currentSoldOut && chosenNum < curNum) {
            firstMagNote.textContent = 'Posts within 3 business days. ' + currentIssue + ' is sold out, so it is skipped.';
          } else {
            firstMagNote.textContent = 'Posts within 3 business days.';
          }
        }
        if (firstMagCover) {
          const p2 = picker();
          const src = p2 ? p2.state().coverFor(chosenStart) : '';
          if (src) { firstMagCover.src = src; firstMagCover.hidden = false; } else { firstMagCover.hidden = true; }
        }
      } else {
        /* Not picked yet: mirror the picker's own default so the hidden
           inputs are consistent with each other even before the pick
           (the gate guarantees a pick before any Print submit anyway). */
        const p0 = picker();
        const st0 = p0 ? p0.state() : null;
        if (st0) startMag = st0.currentSoldOut ? (st0.prevAvailable ? st0.prevIssue : st0.nextIssue) : st0.currentIssue;
        else startMag = propStarting ? propStarting.value : currentIssue;
        if (firstMagRow) firstMagRow.hidden = true;
        if (printStartHint) printStartHint.hidden = false;
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
      /* Value row: price, per-mag and the saving vs single issues, computed
         live from the current issue's single prices. Rolling has no bundle
         maths so it reads "cancel anytime". */
      const count = length === '4-Issue' ? 4 : (length === '8-Issue' ? 8 : 0);
      const single = format === 'Digital' ? singleDigital : singlePrint;
      if (valuePriceEl) valuePriceEl.textContent = formatMoney(variant.price) + (length === 'Rolling' ? ' per drop' : '');
      if (perMagEl) perMagEl.textContent = count ? 'that\'s ' + formatMoney(Math.round(variant.price / count)) + ' a mag' : 'cancel anytime';
      if (saveEl) {
        const saving = count && single ? single * count - variant.price : 0;
        if (saving > 0) { saveEl.textContent = 'Save ' + formatMoney(saving) + ' vs single mags'; saveEl.hidden = false; }
        else saveEl.hidden = true;
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

    /* Subscription: attach the selling plan only when the chosen variant has
       one (Rolling). A disabled input isn't submitted, so Print/Digital 4 & 8
       stay one-time purchases. */
    if (sellingPlanInput) {
      if (variant && variant.selling_plan_id) {
        sellingPlanInput.value = variant.selling_plan_id;
        sellingPlanInput.disabled = false;
      } else {
        sellingPlanInput.value = '';
        sellingPlanInput.disabled = true;
      }
    }

    /* Floating cart summary: e.g. "4-Issue Print" + "Start with Mag09".
       Length-then-format reads more naturally per Ryan's call - "4-Issue
       Print" rolls off the tongue better than "Print - 4-Issue". */
    if (floatingSummary && format && length) {
      floatingSummary.textContent = length + ' ' + format;
    }
    if (floatingIssue) {
      if (format === 'Digital') floatingIssue.textContent = 'Starts with ' + currentIssue;
      else if (chosenStart) floatingIssue.textContent = 'Starts with ' + chosenStart;
      else floatingIssue.textContent = 'Pick your first mag next';
    }

    if (propStarting) propStarting.value = startMag;
    if (propRemaining) propRemaining.value = computeRemainingAfterFirst(length);
    if (propIncluded) propIncluded.value = computeMagsIncluded(startMag, length, format !== 'Digital');

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

  /* Gate every Print submit behind the start picker. Runs on the form
     itself, so it fires BEFORE the document-level cart intercepts. After
     the pick we re-submit with the SAME button (Add to cart or Buy now,
     whose name="checkout" must survive), and the guard lets it through. */
  function resubmit(submitter) {
    if (typeof form.requestSubmit === 'function') {
      try { form.requestSubmit(submitter || undefined); return; } catch (e) { /* fall through */ }
    }
    if (submitter && submitter.name === 'checkout') {
      const h = document.createElement('input');
      h.type = 'hidden'; h.name = 'checkout'; h.value = '';
      form.appendChild(h);
    }
    form.submit();
  }
  function openPickerThen(submitter, confirmLabel) {
    const p = picker();
    if (!p) return false;
    pendingSubmitter = submitter || null;
    p.open({
      length: selected('length'),
      preselect: chosenStart,
      confirmLabel: confirmLabel,
      opener: submitter || primaryCta,
      onPick: function (result) {
        chosenStart = result.startMag;
        update();
        if (pendingSubmitter !== undefined && confirmLabel !== 'Save') {
          const btn = pendingSubmitter;
          pendingSubmitter = null;
          resubmit(btn);
        }
      },
      onCancel: function () { pendingSubmitter = null; }
    });
    return true;
  }
  form.addEventListener('submit', function (evt) {
    const format = selected('format');
    if (!needsPick(format)) return;
    const submitter = evt.submitter || null;
    const isBuyNow = !!(submitter && submitter.name === 'checkout');
    if (!openPickerThen(submitter, isBuyNow ? 'Buy now' : 'Add to cart')) return; /* no picker: let it through with the safe default */
    evt.preventDefault();
    evt.stopImmediatePropagation();
  });
  if (firstMagChange) {
    firstMagChange.addEventListener('click', function () {
      openPickerThen(firstMagChange, 'Save');
    });
  }
  /* If the picker script lands after this one, nothing above breaks:
     the first submit simply opens it once it exists. Re-run update() so
     the sold-out skip is reflected in _mags_included once compute() is
     available. */
  document.addEventListener('theinmag:start-picker-ready', update);

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

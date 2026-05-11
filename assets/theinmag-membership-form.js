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
    console.error('[theinmag-membership-form] failed to parse variants JSON', err);
    return;
  }

  const variantInput = form.querySelector('[data-variant-id-input]');
  const priceDisplay = section.querySelector('[data-price-display]');
  const propStarting = form.querySelector('[data-prop-starting-mag]');
  const propRemaining = form.querySelector('[data-prop-remaining]');
  const propIncluded = form.querySelector('[data-prop-mags-included]');

  const currentIssue = section.dataset.currentIssue;
  const nextIssue = section.dataset.nextIssue;
  const printInStock = section.dataset.printInStock === 'true';

  function selected(optionName) {
    const tile = form.querySelector(
      '[data-option-name="' + optionName + '"] [aria-pressed="true"]'
    );
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

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function padNumber(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function issueNumberOf(label) {
    return parseInt(String(label).replace('Mag', ''), 10);
  }

  function magLabelFor(n) {
    return 'Mag' + padNumber(n);
  }

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

  function update() {
    const format = selected('format');
    const length = selected('length');
    let starting = selected('starting');

    const currentTile = form.querySelector(
      '[data-option-name="starting"] [data-value="current"]'
    );

    const needsPrintStock = format === 'Print' || format === 'Combo';
    const hideCurrent = needsPrintStock && !printInStock;

    if (currentTile) {
      currentTile.hidden = hideCurrent;
      if (hideCurrent && starting === 'current') {
        starting = 'next';
        setSelected('starting', 'next');
      }
    }

    const variant = findVariant(format, length);
    if (variant) {
      if (variantInput) variantInput.value = variant.id;
      if (priceDisplay) {
        let priceStr = formatMoney(variant.price);
        if (length === 'Rolling') priceStr += '/drop';
        priceDisplay.textContent = priceStr;
      }
    }

    const startMag = starting === 'current' ? currentIssue : nextIssue;
    if (propStarting) propStarting.value = startMag;
    if (propRemaining) propRemaining.value = computeRemainingAfterFirst(length);
    if (propIncluded) propIncluded.value = computeMagsIncluded(startMag, length);
  }

  form.querySelectorAll('[data-option-name] [data-value]').forEach(function (tile) {
    tile.addEventListener('click', function () {
      const group = tile.closest('[data-option-name]');
      if (!group) return;
      setSelected(group.dataset.optionName, tile.dataset.value);
      update();
    });
  });

  update();
})();

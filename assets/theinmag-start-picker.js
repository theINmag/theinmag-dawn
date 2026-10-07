/* theinmag-start-picker
   The "which mag arrives first?" step for Print memberships. One dialog,
   rendered by snippets/theinmag-start-picker.liquid, used by BOTH the
   Membership PDP hero (theinmag-membership-form.js) and the sitewide
   membership popup (snippets/theinmag-membership-popup.liquid).

   Why it exists: a Print membership must never be added to the cart
   without a starting issue (_starting_mag, order #51018), and once the
   current issue's print run sells out the honest choices are "the one
   before it, posted now" or "the next one, on drop day". Grandparents
   buy a lot of these, so the choice is covers, not labels.

   Public API (window.theinmagStartPicker):
     open({ length, confirmLabel, onPick(result), onCancel, opener })
       result = { startMag, magsIncluded, remaining, kind }
     compute(startMag, length, { skipSoldOut })  -> same shape, no UI
     state()  -> { currentIssue, nextIssue, prevIssue, currentSoldOut, ... }

   START MODES (2026-10-01): "choice" is the dialog above. "single" runs
   inside the back-start cutoff before a drop while the current print run
   is gone: the back issue stops being a START (two parcels a fortnight
   apart) and exactly one start is offered, the next issue, pre-selected
   because there is nothing to choose. The back issue becomes an ADD-ON
   that rides in the same parcel. The Liquid decides the mode
   (data-start-mode) from next_release_date; callers that may add a
   second cart line pass allowAddOn: true and read result.addOn
   ({ issue, variantId, price, rrp } or null). Pre-selecting the only
   tile is a deliberate exception to the no-silent-default rule: the copy
   names the issue and the date, and the add-on stays an explicit tap.

   Preview overrides, all sessionStorage so they stick for the tab:
     ?soldout=1 / ?soldout=0        force / clear the sold-out state
     ?startmode=single / =choice     force a start mode; ?startmode=0 clears
   They change nothing about what is submitted beyond what the real state
   would. */
(function () {
  'use strict';
  if (window.__theinmagStartPickerInit) return;
  var dialog = document.querySelector('[data-theinmag-start-picker]');
  if (!dialog) return;
  window.__theinmagStartPickerInit = true;

  /* Escape the hero's stacking context: a transformed ancestor traps a
     fixed dialog. Same move the peek lightbox makes. */
  if (dialog.parentNode !== document.body) document.body.appendChild(dialog);

  var MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DROP_MONTHS = [2, 6, 10]; /* Feb, Jun, Oct */

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function label(n) { return 'Mag' + pad(n); }
  function num(lbl) { var m = /Mag\s*0*(\d+)/i.exec(String(lbl || '')); return m ? parseInt(m[1], 10) : NaN; }

  /* ---------- state ---------- */
  var ds = dialog.dataset;
  var S = {
    currentNum: num(ds.current),
    prevNum: num(ds.prev),
    nextNum: num(ds.next),
    next2Num: num(ds.next2),
    releaseDay: parseInt((ds.releaseIso || '').split('-')[2] || '15', 10),
    currentSoldOutLive: ds.currentSoldOut === 'true',
    prevAvailable: ds.prevAvailable === 'true',
    releaseText: ds.release || '',
    releaseMonth: parseInt((ds.releaseIso || '').split('-')[1] || '10', 10),
    releaseYear: parseInt((ds.releaseIso || '').split('-')[0] || String(new Date().getFullYear()), 10),
    nowYear: new Date().getFullYear()
  };
  S.currentIssue = label(S.currentNum);
  S.prevIssue = label(S.prevNum);
  S.nextIssue = label(S.nextNum);
  S.next2Issue = isNaN(S.next2Num) ? label(S.nextNum + 1) : label(S.next2Num);
  if (isNaN(S.next2Num)) S.next2Num = S.nextNum + 1;

  var previewSoldOut = false;
  try {
    var q = new URLSearchParams(window.location.search).get('soldout');
    if (q === '1') sessionStorage.setItem('theinmag.previewSoldOut', '1');
    if (q === '0') sessionStorage.removeItem('theinmag.previewSoldOut');
    previewSoldOut = sessionStorage.getItem('theinmag.previewSoldOut') === '1';
  } catch (e) { /* storage blocked: no preview override */ }

  var previewStartMode = '';
  try {
    var qm = new URLSearchParams(window.location.search).get('startmode');
    if (qm === 'single' || qm === 'choice') sessionStorage.setItem('theinmag.previewStartMode', qm);
    if (qm === '0') sessionStorage.removeItem('theinmag.previewStartMode');
    previewStartMode = sessionStorage.getItem('theinmag.previewStartMode') || '';
  } catch (e) { /* storage blocked: no preview override */ }

  function currentSoldOut() { return S.currentSoldOutLive || previewSoldOut; }
  function soldOutNums() { return currentSoldOut() ? [S.currentNum] : []; }
  /* Single mode needs a sold-out current issue whatever the override says:
     while the current print run is on the shelf it IS the honest start. */
  function startMode() {
    var mode = previewStartMode || ds.startMode || 'choice';
    return mode === 'single' && currentSoldOut() ? 'single' : 'choice';
  }
  var ADDON = ds.addon === 'true' && ds.addonVariant ? {
    issue: ds.addonIssue,
    variantId: parseInt(ds.addonVariant, 10),
    price: parseInt(ds.addonPrice || '0', 10),
    rrp: parseInt(ds.addonRrp || '0', 10),
    priceText: ds.addonPriceText || '',
    rrpText: ds.addonRrpText || ''
  } : null;

  /* Drop month + year for an unreleased issue n (n >= nextNum). Drops run
     Feb / Jun / Oct; anchor is the next release date metafield. */
  function dropInfo(n) {
    var k = n - S.nextNum;
    var startIdx = DROP_MONTHS.indexOf(S.releaseMonth);
    if (startIdx < 0) startIdx = 2;
    var idx = (startIdx + k) % 3;
    var wraps = Math.floor((startIdx + k) / 3);
    return { month: MONTHS[DROP_MONTHS[idx]], year: S.releaseYear + wraps };
  }
  function whenText(n) {
    if (n <= S.currentNum) return 'now';
    var d = dropInfo(n);
    return d.month + (d.year !== S.nowYear ? ' ' + d.year : '');
  }
  /* Full drop date for an unreleased issue: the next issue uses the
     metafield text as rendered; later issues are computed on the drop
     rhythm, e.g. "15 February 2027". */
  function dropText(n) {
    if (n <= S.nextNum) return S.releaseText;
    var d = dropInfo(n);
    return S.releaseDay + ' ' + d.month + ' ' + d.year;
  }
  function dropShort(n) {
    var d = dropInfo(n);
    return S.releaseDay + ' ' + d.month.slice(0, 3) + ' ' + d.year;
  }

  /* The issues a membership of `length` gets when it starts at startNum.
     Sold-out issues at or below the current one are skipped (and reported
     so the UI can show the skip). Future issues are never sold out. */
  function plan(startNum, length, opts) {
    var skip = !opts || opts.skipSoldOut !== false;
    var count = length === '8-Issue' ? 8 : (length === '4-Issue' ? 4 : 1);
    var items = [];
    var n = startNum;
    var got = 0;
    var guard = 0;
    while (got < count && guard < 40) {
      guard += 1;
      var isSkipped = skip && n <= S.currentNum && soldOutNums().indexOf(n) !== -1;
      if (isSkipped) { items.push({ n: n, skipped: true }); n += 1; continue; }
      items.push({ n: n, skipped: false });
      got += 1;
      n += 1;
    }
    return items;
  }

  function compute(startMag, length, opts) {
    var startNum = num(startMag);
    var items = plan(startNum, length, opts).filter(function (i) { return !i.skipped; });
    var included = length === 'Rolling' ? label(startNum) : items.map(function (i) { return label(i.n); }).join(', ');
    var remaining = length === '4-Issue' ? '3' : (length === '8-Issue' ? '7' : '0');
    var kind = startNum === S.currentNum ? 'current' : (startNum > S.currentNum ? 'next' : 'prev');
    return { startMag: label(startNum), magsIncluded: included, remaining: remaining, kind: kind };
  }

  /* ---------- analytics (guarded, never blocks) ---------- */
  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    try {
      var p = params || {};
      p.page_path = window.location.pathname;
      window.gtag('event', name, p);
    } catch (e) { /* no-op */ }
  }

  /* ---------- DOM ---------- */
  var tilesWrap = dialog.querySelector('[data-tiles]');
  var tiles = Array.prototype.slice.call(dialog.querySelectorAll('[data-tile]'));
  var subEl = dialog.querySelector('[data-sub]');
  var chipsEl = dialog.querySelector('[data-chips]');
  var noteEl = dialog.querySelector('[data-plan-note]');
  var asideEl = dialog.querySelector('[data-plan-aside]');
  var confirmBtn = dialog.querySelector('[data-confirm]');
  var cancelBtn = dialog.querySelector('[data-cancel]');
  var closeBtn = dialog.querySelector('[data-close]');

  var addonBtn = dialog.querySelector('[data-addon-toggle]');
  var addonWord = dialog.querySelector('[data-addon-word]');
  var titleEl = dialog.querySelector('#theinmag-start-picker-title');

  var session = null; /* { length, onPick, onCancel, opener, allowAddOn, addOnPreselect } */
  var picked = null;  /* issue number */
  var addOnOn = false; /* add-on toggle state for this open() */

  /* The add-on rides in the NEXT issue's parcel, so it is only offered
     while the next issue is the picked start (Pat's rule, 2026-10-01). */
  function addOnOffered() {
    return !!(ADDON && session && session.allowAddOn === true && startMode() === 'single' && picked === S.nextNum);
  }

  function tileFor(n) {
    return tiles.filter(function (t) { return num(t.dataset.issue) === n; })[0] || null;
  }

  function applyState() {
    var soldOut = currentSoldOut();
    var prevTile = tileFor(S.prevNum);
    var curTile = tileFor(S.currentNum);
    var nextTile = tileFor(S.nextNum);
    var next2Tile = tileFor(S.next2Num);

    var single = startMode() === 'single';
    dialog.setAttribute('data-start-mode', single ? 'single' : 'choice');

    /* Which tiles show. In-stock: current + next. Sold out: prev (if we
       have it) + current (stamped, not selectable) + next. Single mode:
       the next issue alone; the copy explains why. */
    if (prevTile) prevTile.hidden = single || !(soldOut && S.prevAvailable);
    if (curTile && single) curTile.hidden = true;
    else if (curTile) curTile.hidden = false;
    if (next2Tile) {
      next2Tile.hidden = !single;
      var n2st = next2Tile.querySelector('[data-status]');
      if (n2st) n2st.textContent = 'Drops ' + dropText(S.next2Num);
      var n2pill = next2Tile.querySelector('[data-next2-pill]');
      if (n2pill) n2pill.textContent = dropShort(S.next2Num);
    }
    if (curTile) {
      curTile.setAttribute('aria-disabled', soldOut ? 'true' : 'false');
      var stamp = curTile.querySelector('[data-stamp]');
      if (stamp) stamp.hidden = !soldOut;
      var st = curTile.querySelector('[data-status]');
      if (st) {
        st.textContent = soldOut ? 'Print sold out' : 'In stock, posts this week';
        st.classList.toggle('theinmag-start-picker__status--soldout', soldOut);
      }
    }
    if (nextTile) {
      var nst = nextTile.querySelector('[data-status]');
      if (nst) nst.textContent = 'Drops ' + S.releaseText;
    }
    if (prevTile) {
      var pst = prevTile.querySelector('[data-status]');
      if (pst) pst.textContent = 'Ready to post now';
    }
    var visible = tiles.filter(function (t) { return !t.hidden; }).length;
    if (tilesWrap) tilesWrap.setAttribute('data-count', String(visible));

    /* Tiles always read in issue order (prev, current, next), which is the
       DOM order, so a sold-out crossover shows Mag09, Mag10, Mag11 rather
       than jumping a number (Ryan, 2026-09-23). The sold-out current issue
       keeps its stamp and stays unselectable via aria-disabled, so it reads
       as a tombstone in its right place instead of the default answer.
       Supersedes the 2026-09-19 reorder that pushed it to the end. */
    if (prevTile) prevTile.style.order = '';
    if (nextTile) nextTile.style.order = '';
    if (curTile) curTile.style.order = '';

    if (titleEl) {
      titleEl.textContent = 'Which mag arrives first?';
    }
    if (subEl) {
      if (single) {
        subEl.textContent = 'Start with ' + S.nextIssue + ', or wait for ' + S.next2Issue + ' in ' + whenText(S.next2Num) + '.';
      } else {
        subEl.textContent = soldOut
          ? S.currentIssue + ' print has sold out. Choose ' + S.prevIssue + ', ready to post now, or ' + S.nextIssue + ', dropping ' + S.releaseText + '.'
          : 'Start with a current mag, or wait for the next issue!';
      }
    }

    /* Add-on card: only in single mode, only for callers that can add a
       second cart line (the PDP hero and the sitewide popup; the bundle
       modal has its own back-issue tile and passes nothing). */
    if (addonBtn) {
      var offered = addOnOffered();
      addonBtn.hidden = !offered;
      if (!offered) addOnOn = false;
      addonBtn.setAttribute('aria-pressed', addOnOn ? 'true' : 'false');
      if (addonWord) addonWord.textContent = addOnOn ? 'Added' : 'Add';
    }
  }

  function renderPlan() {
    if (!session) return;
    /* No tile tapped yet: clear the plan and prompt for an explicit pick. */
    if (asideEl) asideEl.hidden = true;
    if (noteEl) noteEl.hidden = false;
    if (picked == null) {
      if (chipsEl) chipsEl.innerHTML = '';
      if (noteEl) noteEl.innerHTML = '<strong>Tap a mag to choose your first issue.</strong>';
      return;
    }
    var length = session.length;
    var items = plan(picked, length);
    var rolling = length === 'Rolling';
    if (rolling) {
      /* Show the first drop after the start too, so a sold-out skip is
         visible for Rolling as well. */
      var next = picked + 1;
      while (next <= S.currentNum && soldOutNums().indexOf(next) !== -1) { items.push({ n: next, skipped: true }); next += 1; }
      items.push({ n: next, skipped: false });
    }
    var withAddOn = addOnOffered() && addOnOn;
    if (chipsEl) {
      chipsEl.innerHTML = '';
      if (withAddOn) {
        var ali = document.createElement('li');
        ali.className = 'theinmag-start-picker__chip theinmag-start-picker__chip--addon';
        var astrong = document.createElement('span');
        astrong.textContent = ADDON.issue;
        ali.appendChild(astrong);
        var asmall = document.createElement('small');
        asmall.textContent = 'add-on, same parcel';
        ali.appendChild(asmall);
        chipsEl.appendChild(ali);
      }
      items.forEach(function (it, idx) {
        var li = document.createElement('li');
        li.className = 'theinmag-start-picker__chip' + (it.skipped ? ' theinmag-start-picker__chip--skipped' : (idx === 0 ? ' theinmag-start-picker__chip--first' : ''));
        var strong = document.createElement('span');
        strong.textContent = label(it.n);
        li.appendChild(strong);
        var small = document.createElement('small');
        small.textContent = it.skipped ? 'sold out' : whenText(it.n);
        li.appendChild(small);
        chipsEl.appendChild(li);
      });
      if (rolling) {
        var more = document.createElement('li');
        more.className = 'theinmag-start-picker__chip theinmag-start-picker__chip--more';
        more.textContent = 'then every new mag as it drops';
        chipsEl.appendChild(more);
      }
    }
    if (noteEl) {
      var skipped = items.filter(function (i) { return i.skipped; });
      var count = length === '8-Issue' ? 8 : (length === '4-Issue' ? 4 : 0);
      var html = '';
      if (picked > S.currentNum) {
        /* Future start: the tile already carries the drop date and the
           add-on chip says "same parcel", so the only line left is the
           postie one, and it sits beside the label (Ryan, 2026-10-01). */
        html = '';
        if (asideEl) { asideEl.textContent = 'Watch out for the postie.'; asideEl.hidden = false; }
        if (noteEl) noteEl.hidden = true;
      } else if (skipped.length) {
        html = '<strong>' + label(picked) + ' posts within three business days.</strong> ' + skipped.map(function (i) { return label(i.n); }).join(' and ') + ' print has sold out, so your membership skips it' + (count ? ' and you still get all ' + count + ' mags' : '') + '.';
      } else {
        html = '<strong>' + label(picked) + ' posts within three business days.</strong>';
      }
      noteEl.innerHTML = html;
    }
  }

  /* Show the "printed upside down on purpose" card for the picked issue, if
     that issue has one. Wrappers are rendered by the Liquid snippet, one per
     selectable issue, and self-gate on the single_mag.flip_note metafield, so
     an issue with no stunt has an empty wrapper and nothing appears. A
     membership buyer never sees the single-mag PDP, so without this they
     would meet the upside-down pages for the first time in the letterbox. */
  var flipWraps = Array.prototype.slice.call(dialog.querySelectorAll('[data-flip-for]'));
  function renderFlipNote() {
    var lbl = label(picked);
    flipWraps.forEach(function (w) {
      var mine = w.getAttribute('data-flip-for') === lbl;
      // Hide empty wrappers too, so a matched issue with no note adds no gap.
      w.hidden = !mine || !w.querySelector('.theinmag-flip-callout');
    });
  }

  function select(n, focus) {
    var t = tileFor(n);
    if (!t || t.hidden || t.getAttribute('aria-disabled') === 'true') return;
    picked = n;
    tiles.forEach(function (tile) { tile.setAttribute('aria-pressed', tile === t ? 'true' : 'false'); });
    if (focus) t.focus();
    syncAddOn();
    renderPlan();
    renderFlipNote();
    updateConfirmEnabled();
  }

  /* Confirm stays disabled until the buyer actively taps a tile, so a
     membership can never be added by inertia with a sold-out or back
     issue as an unseen default. */
  function updateConfirmEnabled() {
    if (confirmBtn) confirmBtn.disabled = picked == null;
  }

  function openDialog() {
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
      dialog.classList.add('is-fallback-open');
    }
  }
  function closeDialog() {
    if (typeof dialog.close === 'function') {
      if (dialog.open) dialog.close();
    } else {
      dialog.removeAttribute('open');
      dialog.classList.remove('is-fallback-open');
    }
    if (session && session.opener && typeof session.opener.focus === 'function') {
      try { session.opener.focus(); } catch (e) { /* no-op */ }
    }
  }

  /* Show or hide the add-on card for the current pick; a pick that moves
     off the next issue also switches the add-on off. */
  function syncAddOn() {
    if (!addonBtn) return;
    var offered = addOnOffered();
    addonBtn.hidden = !offered;
    if (!offered) addOnOn = false;
    addonBtn.setAttribute('aria-pressed', addOnOn ? 'true' : 'false');
    if (addonWord) addonWord.textContent = addOnOn ? 'Added' : 'Add';
    if (confirmBtn) confirmBtn.textContent = confirmLabel();
  }
  function confirmLabel() {
    var base = (session && session.confirmLabel) || 'Add to cart';
    if (!(addOnOffered() && addOnOn)) return base;
    if (base === 'Add to cart') return 'Add both to cart';
    if (base === 'Buy now') return 'Buy both now';
    return base;
  }
  function setAddOn(on) {
    addOnOn = !!on;
    if (addonBtn) addonBtn.setAttribute('aria-pressed', addOnOn ? 'true' : 'false');
    if (addonWord) addonWord.textContent = addOnOn ? 'Added' : 'Add';
    if (confirmBtn) confirmBtn.textContent = confirmLabel();
    renderPlan();
  }

  function open(opts) {
    session = opts || {};
    session.length = session.length || '4-Issue';
    /* No silent default: every membership surface (PDP hero, sitewide
       popup, Build-a-Bundle) must force an explicit tap so the buyer never
       ships a sold-out or back issue by inertia. Reset any prior selection
       and keep confirm disabled until a tile is tapped. */
    picked = null;
    addOnOn = false;
    tiles.forEach(function (tile) { tile.setAttribute('aria-pressed', 'false'); });
    applyState();
    if (confirmBtn) confirmBtn.textContent = confirmLabel();
    openDialog();
    /* Honour only a genuine prior explicit choice (reopening via Change). */
    var start = session.preselect != null ? num(session.preselect) : NaN;
    if (!isNaN(start)) select(start, true);
    /* Single mode: the next issue is the only start there is, so it is
       already chosen when the dialog opens (the copy says which and when).
       The add-on is never pre-selected unless the buyer chose it before
       and is reopening via Change. */
    if (startMode() === 'single' && picked == null) select(S.nextNum, false);
    if (addOnOffered() && session.addOnPreselect === true) setAddOn(true);
    renderPlan();
    updateConfirmEnabled();
    track('start_picker_open', { length: session.length, sold_out: currentSoldOut() ? 'yes' : 'no', start_mode: startMode() });
  }

  function confirm() {
    if (!session || picked == null) return;
    var result = compute(label(picked), session.length);
    result.startMode = startMode();
    result.addOn = (addOnOffered() && addOnOn)
      ? { issue: ADDON.issue, variantId: ADDON.variantId, price: ADDON.price, rrp: ADDON.rrp, priceText: ADDON.priceText, rrpText: ADDON.rrpText }
      : null;
    track('start_pick_' + result.kind, { start_mag: result.startMag, length: session.length, start_mode: result.startMode, add_on: result.addOn ? 'yes' : 'no' });
    var cb = session.onPick;
    closeDialog();
    session = null;
    if (typeof cb === 'function') cb(result);
  }
  function cancel() {
    var cb = session && session.onCancel;
    track('start_picker_cancel', {});
    closeDialog();
    session = null;
    if (typeof cb === 'function') cb();
  }

  tiles.forEach(function (t) {
    t.addEventListener('click', function () { select(num(t.dataset.issue), false); });
  });
  if (addonBtn) addonBtn.addEventListener('click', function () {
    setAddOn(!addOnOn);
    track(addOnOn ? 'start_addon_on' : 'start_addon_off', { issue: ADDON ? ADDON.issue : '' });
  });
  if (confirmBtn) confirmBtn.addEventListener('click', confirm);
  if (cancelBtn) cancelBtn.addEventListener('click', cancel);
  if (closeBtn) closeBtn.addEventListener('click', cancel);
  /* Backdrop click closes (the dialog element itself is the backdrop hit). */
  dialog.addEventListener('click', function (e) { if (e.target === dialog) cancel(); });
  /* Esc: the native dialog fires 'cancel' before closing. */
  dialog.addEventListener('cancel', function (e) { e.preventDefault(); cancel(); });
  /* Arrow keys move between visible tiles (radiogroup behaviour). */
  if (tilesWrap) tilesWrap.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var vis = tiles.filter(function (t) { return !t.hidden && t.getAttribute('aria-disabled') !== 'true'; });
    var i = vis.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    var j = e.key === 'ArrowRight' ? (i + 1) % vis.length : (i - 1 + vis.length) % vis.length;
    select(num(vis[j].dataset.issue), true);
  });

  window.theinmagStartPicker = {
    open: open,
    compute: compute,
    state: function () {
      return {
        currentIssue: S.currentIssue, nextIssue: S.nextIssue, prevIssue: S.prevIssue,
        currentSoldOut: currentSoldOut(), prevAvailable: S.prevAvailable, releaseText: S.releaseText,
        startMode: startMode(), addOn: ADDON, next2Issue: S.next2Issue,
        next2When: whenText(S.next2Num),
        dropTextFor: function (mag) { var n = num(mag); return n > S.currentNum ? dropText(n) : ''; },
        coverFor: function (mag) { var t = tileFor(num(mag)); var img = t ? t.querySelector('img:not([hidden])') : null; return img ? img.currentSrc || img.src : ''; }
      };
    },
    isOpen: function () { return !!dialog.open; }
  };
  document.dispatchEvent(new CustomEvent('theinmag:start-picker-ready'));
})();

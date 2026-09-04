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

   Preview override: ?soldout=1 on any URL forces the sold-out state for
   this browser session (sessionStorage); ?soldout=0 clears it. Lets the
   sold-out design be checked on the preview theme while stock is still
   on the shelf. It changes nothing about what is submitted beyond what a
   real sell-out would. */
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

  var previewSoldOut = false;
  try {
    var q = new URLSearchParams(window.location.search).get('soldout');
    if (q === '1') sessionStorage.setItem('theinmag.previewSoldOut', '1');
    if (q === '0') sessionStorage.removeItem('theinmag.previewSoldOut');
    previewSoldOut = sessionStorage.getItem('theinmag.previewSoldOut') === '1';
  } catch (e) { /* storage blocked: no preview override */ }

  function currentSoldOut() { return S.currentSoldOutLive || previewSoldOut; }
  function soldOutNums() { return currentSoldOut() ? [S.currentNum] : []; }

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
  var confirmBtn = dialog.querySelector('[data-confirm]');
  var cancelBtn = dialog.querySelector('[data-cancel]');
  var closeBtn = dialog.querySelector('[data-close]');

  var session = null; /* { length, onPick, onCancel, opener } */
  var picked = null;  /* issue number */

  function tileFor(n) {
    return tiles.filter(function (t) { return num(t.dataset.issue) === n; })[0] || null;
  }

  function applyState() {
    var soldOut = currentSoldOut();
    var prevTile = tileFor(S.prevNum);
    var curTile = tileFor(S.currentNum);
    var nextTile = tileFor(S.nextNum);

    /* Which tiles show. In-stock: current + next. Sold out: prev (if we
       have it) + current (stamped, not selectable) + next. */
    if (prevTile) prevTile.hidden = !(soldOut && S.prevAvailable);
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

    if (subEl) {
      subEl.textContent = soldOut
        ? S.currentIssue + ' print has sold out. Start with ' + S.prevIssue + ' today, or wait for ' + S.nextIssue + '.'
        : 'Start with the mag on the shelf now, or wait for the new one.';
    }
  }

  function renderPlan() {
    if (!session || picked == null) return;
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
    if (chipsEl) {
      chipsEl.innerHTML = '';
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
        html = 'Nothing posts until <strong>' + S.releaseText + '</strong>. ' + label(picked) + ' ships on drop day.';
      } else if (skipped.length) {
        html = '<strong>' + label(picked) + ' posts within three business days.</strong> ' + skipped.map(function (i) { return label(i.n); }).join(' and ') + ' print has sold out, so your membership skips it' + (count ? ' and you still get all ' + count + ' mags' : '') + '.';
      } else {
        html = '<strong>' + label(picked) + ' posts within three business days.</strong>' + (count ? ' Then one new mag every drop until you have all ' + count + '.' : ' Then every new mag as it drops.');
      }
      noteEl.innerHTML = html;
    }
  }

  function select(n, focus) {
    var t = tileFor(n);
    if (!t || t.hidden || t.getAttribute('aria-disabled') === 'true') return;
    picked = n;
    tiles.forEach(function (tile) { tile.setAttribute('aria-pressed', tile === t ? 'true' : 'false'); });
    if (focus) t.focus();
    renderPlan();
  }

  function defaultPick() {
    if (currentSoldOut()) return S.prevAvailable ? S.prevNum : S.nextNum;
    return S.currentNum;
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

  function open(opts) {
    session = opts || {};
    session.length = session.length || '4-Issue';
    applyState();
    if (confirmBtn) confirmBtn.textContent = session.confirmLabel || 'Add to cart';
    var start = session.preselect != null ? num(session.preselect) : NaN;
    if (isNaN(start)) start = defaultPick();
    openDialog();
    select(start, true);
    if (picked == null) select(defaultPick(), true);
    track('start_picker_open', { length: session.length, sold_out: currentSoldOut() ? 'yes' : 'no' });
  }

  function confirm() {
    if (!session || picked == null) return;
    var result = compute(label(picked), session.length);
    track('start_pick_' + result.kind, { start_mag: result.startMag, length: session.length });
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
        coverFor: function (mag) { var t = tileFor(num(mag)); var img = t ? t.querySelector('img:not([hidden])') : null; return img ? img.currentSrc || img.src : ''; }
      };
    },
    isOpen: function () { return !!dialog.open; }
  };
  document.dispatchEvent(new CustomEvent('theinmag:start-picker-ready'));
})();

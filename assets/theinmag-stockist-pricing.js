/* theinmag-stockist-pricing.js
   The stockist ordering experience on /pages/instock.

   THE RULE THIS FILE EXISTS TO ENFORCE: no discount percentage is ever
   written down in the theme. Two rates are live at once (new stockists are
   on 45%, Canterbury is grandfathered at 50%), so any hardcoded figure is
   guaranteed to be wrong for somebody. Instead we hand the entered code to
   Shopify and read back what it actually does:

     POST /cart/update.js {"discount": CODE}   stores the code on the cart
     GET  /cart.js                             reports what it did

   The value comes off line_level_discount_allocations[].discount_application
   (value + value_type, the discount's own definition), NOT from dividing
   cents, which would drift on rounding.

   MEASURED BEHAVIOUR THIS RELIES ON (checked live 6 Aug 2026):
   - An EMPTY cart cannot price a code. Every code reads applicable:false,
     real or invented. So we only claim a code is good once there is a line
     to test it against.
   - Applying a bad code REPLACES a good one and drops the discount. So a
     failed attempt puts the previous code back.
   - Shopify floors the discount allocation, so the charged line price is
     ceil(rrp * (1 - value/100)). Verified against four real line items
     (Mag10 print and digital, Mag01 print, Snack Pack). Tile prices use
     ceil for that reason, which also guarantees we round in the safe
     direction: the figure shown can never sit under the figure charged.

   Cart totals are not estimated at all. RRP is the sum of
   original_line_price and the payable figure is the sum of
   final_line_price, both straight from Shopify. */

(function () {
  if (window.__theinmagStockistPricingInit) return;
  window.__theinmagStockistPricingInit = true;

  var root = document.querySelector('[data-stockist-pricing]');
  if (!root) return;

  /* How long a stockist's code and resolved rate survive in their browser.
     Set by the section so it can be tuned without a code push. Issues drop
     every 4 months, so this wants to outlast an ordering cycle. */
  var MEMORY_DAYS = parseInt(root.getAttribute('data-memory-days'), 10) || 90;

  /* Free shipping threshold in cents. MEASURED 2026-08-07: Shopify applies
     it to the DISCOUNTED subtotal, not RRP. A 50% stockist with 3x Mag10 is
     $71.85 RRP but $35.94 payable, and AusPost charged $9.99; at 4x
     ($47.92 payable) it went free. So we count down against what they PAY. */
  var FREE_SHIPPING = (parseFloat(root.getAttribute('data-free-shipping')) || 40) * 100;
  var TTL_MS = MEMORY_DAYS * 24 * 60 * 60 * 1000;
  var STORE_KEY = 'theinmag:stockist:v' + (root.getAttribute('data-cache-version') || '1');
  var GATE_KEY = 'theinmag:stockist-gate-seen';

  /* ----------------------------------------------------------------
     State. One object, three surfaces read from it.
     status: none | checking | applied | pending | unconfirmed
       applied     the code priced a real cart line, rate is known
       pending     the code is on the cart but the cart was empty, so
                   there was nothing to price it against yet
       unconfirmed the code was tested against a loaded cart and did
                   not apply. We say we could not confirm it, never
                   that it is invalid: a code that does not exist and
                   a code that merely cannot stack look identical.
     ---------------------------------------------------------------- */
  var state = {
    code: '',
    rate: null,
    valueType: null,
    allocationMethod: null,
    status: 'none',
    cart: null,
    busy: false,
    /* A one-off message about the LAST thing the stockist did, kept apart
       from status so a failed attempt can be reported without throwing
       away the working code that is still on the cart. */
    notice: null
  };

  /* ---------------------------- storage ---------------------------- */

  function loadSaved() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || !saved.code) return null;
      if (!saved.savedAt || Date.now() - saved.savedAt > TTL_MS) {
        window.localStorage.removeItem(STORE_KEY);
        return null;
      }
      return saved;
    } catch (e) { return null; }
  }

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({
        code: state.code,
        rate: state.rate,
        valueType: state.valueType,
        allocationMethod: state.allocationMethod,
        savedAt: Date.now()
      }));
    } catch (e) { /* private mode, carry on unremembered */ }
  }

  function forget() {
    try { window.localStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  /* "Just having a look" is honoured for the browsing SESSION by default,
     so the gate does not nag on every page view. Set the section's
     "How often the entry lightbox asks" to "Every time the page loads" to
     make it more insistent. Either way a remembered CODE skips the gate,
     so this only ever affects the browse path. */
  var GATE_ALWAYS = root.getAttribute('data-gate-repeat') === 'always';

  /* ?gate=1 forces the lightbox open whatever the setting says, so it can
     be reviewed without clearing browser storage. Harmless in the wild: it
     only ever shows the gate, and nobody arrives with that parameter. */
  var FORCE_GATE = /[?&]gate=1(&|$)/.test(window.location.search);

  function gateSeen() {
    if (GATE_ALWAYS) return false;
    try { return window.sessionStorage.getItem(GATE_KEY) === '1'; } catch (e) { return false; }
  }
  function markGateSeen() {
    try { window.sessionStorage.setItem(GATE_KEY, '1'); } catch (e) {}
  }

  /* ---------------------------- helpers ---------------------------- */

  function money(cents) {
    return '$' + (Math.round(cents) / 100).toFixed(2);
  }

  /* The charged price for one unit, derived the way Shopify derives it.

     Two kinds of code are live. Most are a percentage. The founding pair
     (INMYSTORE-EARLYBIRD, INMYSTORE-GATHERED) are a FLAT amount off each
     eligible item per the stockist playbook, so they arrive as value_type
     "fixed_amount".

     ceil on the percentage matches Shopify, which floors the allocation, and
     it also rounds in the only safe direction: shown can never sit under
     charged. Returns null when we cannot work it out, which puts the tile
     back to retail rather than guessing. */
  function stockistPrice(rrpCents) {
    if (!(state.rate > 0)) return null;
    if (state.valueType === 'percentage') {
      return Math.ceil(rrpCents * (1 - state.rate / 100));
    }
    /* A flat amount is only per-unit when Shopify allocated it "each". If it
       is spread "across" the order we cannot attribute it to one tile, so we
       decline rather than under-quote. */
    if (state.valueType === 'fixed_amount' && state.allocationMethod === 'each') {
      return Math.max(0, rrpCents - Math.round(state.rate * 100));
    }
    return null;
  }

  function normalise(v) {
    return (v || '').trim().toUpperCase();
  }

  function getCart() {
    return fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); });
  }

  function putDiscount(code) {
    return fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ discount: code })
    }).then(function (r) { return r.json(); });
  }

  /* Pull the real discount definition out of a cart, for our code. */
  /* Resolve the code's real value, and resolve it CONSERVATIVELY.

     A Shopify discount has target_selection "entitled", meaning it covers a
     chosen set of products, not the whole catalogue. Canterbury happens to
     cover every print issue and the Snack Pack today (measured), but nothing
     guarantees a NEW issue gets added to that set. If Mag11 ships and nobody
     adds it to the discount, a naive "read the first rate and apply it to
     every tile" would quote $11.98 on a mag that charges $23.95. That is
     exactly the under-quote Ryan called the angry-stockist scenario.

     So: take the LOWEST rate across the cart lines that correspond to a
     product actually shown on this page, counting an undiscounted line as
     0%. One non-entitled product on the page collapses the tile pricing back
     to retail rather than quoting a discount it will not get. Lines for
     products NOT on this page (something added from /pages/shop) are ignored
     so they cannot drag the page's prices down. */
  function readRate(cart, code) {
    var wanted = normalise(code);
    var onPage = {};
    root.querySelectorAll('[data-rrp-price][data-variant-id]').forEach(function (row) {
      onPage[row.getAttribute('data-variant-id')] = true;
    });

    var lowest = null;
    var sawType = null;
    var sawMethod = null;
    (cart.items || []).forEach(function (item) {
      if (!onPage[String(item.variant_id)]) return;
      var lineRate = 0;
      (item.line_level_discount_allocations || []).forEach(function (alloc) {
        var app = alloc && alloc.discount_application;
        if (!app || normalise(app.title) !== wanted) return;
        lineRate = parseFloat(app.value);
        sawType = app.value_type;
        sawMethod = app.allocation_method;
      });
      if (lowest === null || lineRate < lowest) lowest = lineRate;
    });

    if (lowest === null) return null;      /* nothing from this page in the cart yet */
    if (lowest === 0) return { value: 0, valueType: sawType || 'percentage', allocationMethod: sawMethod };
    return { value: lowest, valueType: sawType, allocationMethod: sawMethod };
  }

  function isApplicable(cart, code) {
    var wanted = normalise(code);
    return (cart.discount_codes || []).some(function (d) {
      return normalise(d.code) === wanted && d.applicable === true;
    });
  }

  /* ---------------------------- elements --------------------------- */

  var gate = document.querySelector('[data-stockist-gate]');
  var gateInput = gate && gate.querySelector('[data-stockist-code-input]');
  var gateStatus = gate && gate.querySelector('[data-stockist-status]');

  var codeRow = root.querySelector('[data-stockist-coderow]');
  var rowField = codeRow && codeRow.querySelector('[data-stockist-field]');
  var rowInput = codeRow && codeRow.querySelector('[data-stockist-code-input]');
  var rowStatus = codeRow && codeRow.querySelector('[data-stockist-status]');
  var appliedBox = codeRow && codeRow.querySelector('[data-stockist-applied]');
  var appliedCode = codeRow && codeRow.querySelector('[data-stockist-applied-code]');
  var appliedDetail = codeRow && codeRow.querySelector('[data-stockist-applied-detail]');
  var rowLabel = codeRow && codeRow.querySelector('[data-stockist-coderow-label]');

  var bar = root.querySelector('[data-checkout-bar]');
  var barItems = bar && bar.querySelector('[data-checkout-items]');
  var barEmpty = bar && bar.querySelector('[data-checkout-empty]');
  var barCount = bar && bar.querySelector('[data-checkout-count]');
  var barRrp = bar && bar.querySelector('[data-checkout-rrp]');
  var barPay = bar && bar.querySelector('[data-checkout-pay-total]');
  var barNote = bar && bar.querySelector('[data-checkout-note]');
  var barGo = bar && bar.querySelector('[data-checkout-go]');

  /* ---------------------------- rendering -------------------------- */

  var STATUS_TEXT = {
    checking: { tone: 'info', icon: '', text: 'Checking your code' },
    applied: { tone: 'ok', icon: '✓', text: '' },
    pending: { tone: 'info', icon: '', text: 'Code saved. Your prices appear as soon as you add your first mag.' },
    /* Never "invalid". A code that does not exist and a code that cannot
       stack with what is in the basket look identical from the storefront,
       so we say what we actually know. */
    unconfirmed: { tone: 'warn', icon: '!', text: 'We could not confirm that code against this order, so prices below are retail. Email heyhey@theinmag.com.au and we will sort it out.' }
  };

  function paintStatus(el) {
    if (!el) return;
    var conf = state.notice || STATUS_TEXT[state.status];
    if (!conf) { el.hidden = true; return; }
    var text = conf.text;
    if (state.notice) {
      el.className = 'theinmag-stockist-status theinmag-stockist-status--' + conf.tone;
      el.innerHTML = '';
      var noticeIcon = document.createElement('span');
      noticeIcon.className = 'theinmag-stockist-status__icon';
      noticeIcon.setAttribute('aria-hidden', 'true');
      noticeIcon.textContent = '!';
      el.appendChild(noticeIcon);
      el.appendChild(document.createTextNode(text));
      el.hidden = false;
      return;
    }
    if (state.status === 'applied') {
      /* One source of wording, so the gate and the code row can never
         describe the same code differently. */
      text = 'Your code is on. ' + appliedDetailText();
    }
    el.className = 'theinmag-stockist-status theinmag-stockist-status--' + conf.tone;
    el.innerHTML = '';
    if (conf.icon) {
      var ic = document.createElement('span');
      ic.className = 'theinmag-stockist-status__icon';
      ic.setAttribute('aria-hidden', 'true');
      ic.textContent = conf.icon;
      el.appendChild(ic);
    }
    el.appendChild(document.createTextNode(text));
    el.hidden = false;
  }

  function trimRate(rate) {
    return String(Math.round(rate * 100) / 100);
  }

  function paintCodeRow() {
    if (!codeRow) return;
    var isOn = state.status === 'applied' || state.status === 'pending';
    if (appliedBox) {
      appliedBox.hidden = !isOn;
      if (isOn && appliedCode) appliedCode.textContent = state.code;
      if (isOn && appliedDetail) appliedDetail.textContent = appliedDetailText();
    }
    if (rowField) rowField.hidden = isOn;
    /* Once the code is on, the invitation to enter one is just noise. */
    if (rowLabel) rowLabel.hidden = isOn;
    /* One message, not two: when the code is on, the confirmation box says
       it all, so the status line stays out of the way. */
    if (rowStatus) {
      if (isOn && !state.notice) rowStatus.hidden = true;
      else paintStatus(rowStatus);
    }
  }

  function appliedDetailText() {
    if (state.status === 'pending') return 'Your prices appear as soon as you add your first mag.';
    /* rate 0 means at least one product on this page is not covered by the
       code, so we quote nobody a discount and let checkout be the truth. */
    if (state.rate > 0 && state.valueType === 'percentage') {
      return "You're seeing your real prices, " + trimRate(state.rate) + '% off retail.';
    }
    if (state.rate > 0 && state.valueType === 'fixed_amount' && state.allocationMethod === 'each') {
      return "You're seeing your real prices, " + money(state.rate * 100) + ' off each mag.';
    }
    return 'Your prices are confirmed at checkout.';
  }

  /* Tiles only ever show a stockist price we resolved from the live cart.
     Anything else and they show retail alone. */
  function paintTiles() {
    var priced = state.status === 'applied';
    root.querySelectorAll('[data-rrp-price]').forEach(function (row) {
      var out = row.querySelector('[data-stockist-price]');
      if (!out) return;
      var rrp = parseInt(row.getAttribute('data-rrp-price'), 10);
      var price = priced && rrp ? stockistPrice(rrp) : null;
      if (price === null) {
        out.hidden = true;
        out.textContent = '';
        row.classList.remove('is-stockist-priced');
        return;
      }
      out.textContent = money(price);
      out.hidden = false;
      row.classList.add('is-stockist-priced');
    });
  }

  function paintBar() {
    if (!bar) return;
    var cart = state.cart;
    var count = (cart && cart.item_count) || 0;

    if (barEmpty) barEmpty.hidden = count > 0;
    if (barItems) barItems.hidden = count < 1;

    if (barCount) barCount.textContent = count ? count + (count === 1 ? ' mag' : ' mags') : '';
    if (barGo) barGo.disabled = count < 1;

    if (!count) {
      if (barItems) barItems.innerHTML = '';
      if (barRrp) barRrp.textContent = '';
      if (barPay) barPay.textContent = '';
      /* The empty line already says this. Saying it twice reads as filler. */
      if (barNote) barNote.textContent = '';
      return;
    }

    var rrpTotal = 0;
    var payTotal = 0;
    (cart.items || []).forEach(function (it) {
      rrpTotal += it.original_line_price || 0;
      payTotal += it.final_line_price != null ? it.final_line_price : (it.line_price || 0);
    });
    var discounted = payTotal < rrpTotal;

    if (barItems) {
      barItems.innerHTML = '';
      (cart.items || []).forEach(function (it) {
        /* Escapes not literals, so the banned dash characters never appear
           in our source. Same match as the shop grid's own strip. */
        var name = (it.product_title || it.title || '').replace(/^theINmag\s*[-\u2013\u2014]\s*/i, '');
        var li = document.createElement('li');
        li.className = 'theinmag-shop-grid__checkout-item';

        var nameEl = document.createElement('span');
        nameEl.className = 'theinmag-shop-grid__checkout-item-name';
        var qtyEl = document.createElement('b');
        qtyEl.textContent = it.quantity + '× ';
        nameEl.appendChild(qtyEl);
        nameEl.appendChild(document.createTextNode(name));

        var rightEl = document.createElement('span');
        rightEl.className = 'theinmag-shop-grid__checkout-item-right';

        var lineRrp = it.original_line_price || 0;
        var linePay = it.final_line_price != null ? it.final_line_price : (it.line_price || 0);
        if (linePay < lineRrp) {
          var wasEl = document.createElement('span');
          wasEl.className = 'theinmag-shop-grid__checkout-item-rrp';
          wasEl.textContent = money(lineRrp);
          rightEl.appendChild(wasEl);
        }
        var priceEl = document.createElement('span');
        priceEl.className = 'theinmag-shop-grid__checkout-item-price';
        priceEl.textContent = money(linePay);
        rightEl.appendChild(priceEl);

        var rmEl = document.createElement('button');
        rmEl.type = 'button';
        rmEl.className = 'theinmag-shop-grid__checkout-item-remove';
        rmEl.setAttribute('data-checkout-remove', it.key);
        rmEl.setAttribute('aria-label', 'Remove ' + name);
        rmEl.innerHTML = '&times;';
        rightEl.appendChild(rmEl);

        li.appendChild(nameEl);
        li.appendChild(rightEl);
        barItems.appendChild(li);
      });
    }

    if (barRrp) {
      barRrp.textContent = discounted ? 'RRP ' + money(rrpTotal) : '';
      barRrp.hidden = !discounted;
    }
    if (barPay) barPay.textContent = money(payTotal);
    if (barNote) {
      var lead = discounted
        ? 'Your code is on.'
        : 'Retail prices until you enter your code.';
      var shortfall = FREE_SHIPPING - payTotal;
      var postage = shortfall > 0
        ? 'Add ' + money(shortfall) + ' more for free postage.'
        : 'Postage is free on this order.';
      barNote.textContent = lead + ' ' + postage;
    }
  }

  function render() {
    paintCodeRow();
    paintTiles();
    paintBar();
    if (gate) paintStatus(gateStatus);
  }

  /* The peek lightbox sets its own price from a data attribute, so the shop
     grid calls this straight afterwards to add the stockist figure. Without
     it the lightbox would quote retail while the tile behind it quotes the
     stockist price, on the same screen. */
  window.__theinmagStockistPeekPrice = function (el, rrpAttr) {
    if (!el) return;
    var rrp = parseInt(rrpAttr, 10);
    var price = state.status === 'applied' && rrp ? stockistPrice(rrp) : null;
    if (price === null) return;
    el.textContent = '';
    var was = document.createElement('span');
    was.className = 'theinmag-shop-grid__checkout-item-rrp';
    was.textContent = money(rrp);
    var now = document.createElement('b');
    now.textContent = money(price);
    el.appendChild(was);
    el.appendChild(now);
  };

  /* ---------------------------- the flow --------------------------- */

  function refreshCart() {
    return getCart().then(function (cart) {
      state.cart = cart;
      /* Re-verify on every cart read. A remembered rate that has since
         changed corrects itself here, within one fetch of page load. */
      if (state.code && cart.item_count > 0) {
        if (isApplicable(cart, state.code)) {
          var found = readRate(cart, state.code);
          if (found) {
            state.rate = found.value;
            state.valueType = found.valueType;
            state.allocationMethod = found.allocationMethod;
          }
          state.status = 'applied';
          save();
        } else if (state.status === 'applied' || state.status === 'pending') {
          /* The code is stored but does nothing for this basket. Do not
             price the tiles off a stale rate. */
          state.status = 'unconfirmed';
          state.rate = null;
        }
      }
      render();
      return cart;
    }).catch(function () { render(); });
  }

  function submitCode(raw) {
    var code = normalise(raw);
    if (!code || state.busy) return;
    var previous = state.code;
    state.busy = true;
    state.notice = null;
    state.status = 'checking';
    render();

    putDiscount(code)
      .then(function (cart) {
        state.cart = cart;
        if (!cart || cart.item_count < 1) {
          /* Nothing to price it against. Keep it, say so plainly. */
          state.code = code;
          state.rate = null;
          state.valueType = null;
          state.status = 'pending';
          save();
          return;
        }
        if (isApplicable(cart, code)) {
          var found = readRate(cart, code);
          state.code = code;
          state.rate = found ? found.value : null;
          state.valueType = found ? found.valueType : null;
          state.allocationMethod = found ? found.allocationMethod : null;
          state.status = 'applied';
          save();
          return;
        }
        /* Failed. Put the previous code back, because applying a bad code
           wipes a good one and drops the discount with it. Then re-resolve
           it so the tiles keep showing the price the cart is really on. */
        state.code = previous;
        state.rate = null;
        state.valueType = null;
        if (previous) {
          state.notice = {
            tone: 'warn',
            text: 'We could not confirm ' + code + ', so your code ' + previous + ' is still on this order.'
          };
          state.status = 'pending';
          return putDiscount(previous).then(function (restored) {
            state.cart = restored;
            save();
            return refreshCart();
          });
        }
        state.status = 'unconfirmed';
        forget();
      })
      .catch(function () {
        /* A network blip, a 429, or an offline moment is NOT a bad code.
           Saying "we could not confirm that code" here would send a stockist
           chasing a problem that is ours, so say what actually happened and
           leave their code alone. */
        state.notice = {
          tone: 'warn',
          text: 'We could not reach the cart just then. Check your connection and try again.'
        };
        state.code = previous;
        state.status = previous ? 'pending' : 'none';
      })
      .then(function () {
        state.busy = false;
        render();
        if (state.status === 'applied' || state.status === 'pending') closeGate();
      });
  }

  function clearCode() {
    state.notice = null;
    state.code = '';
    state.rate = null;
    state.valueType = null;
    state.status = 'none';
    forget();
    putDiscount('').then(function (cart) { state.cart = cart; render(); }).catch(render);
  }

  /* ---------------------------- the gate --------------------------- */

  var lastFocus = null;

  function openGate() {
    if (!gate) return;
    lastFocus = document.activeElement;
    gate.hidden = false;
    document.body.style.overflow = 'hidden';
    /* Switches on the real page blur behind the card. The CSS excludes the
       gate itself, which only works because the gate now lives on <body>. */
    document.documentElement.setAttribute('data-theinmag-gate-open', '');
    if (gateInput) setTimeout(function () { gateInput.focus(); }, 60);
  }

  function closeGate() {
    if (!gate || gate.hidden) return;
    gate.hidden = true;
    document.body.style.overflow = '';
    document.documentElement.removeAttribute('data-theinmag-gate-open');
    markGateSeen();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  /* ------------------------ the mINion ---------------------------
     Same behaviour as the 404 page: the sitewide character pool fills the
     slot, and this lets you flick to another one. It reads the pool's own
     sessionStorage cache of valid indices rather than probing again, so
     the button simply stays disabled if the pool has not settled.
     ---------------------------------------------------------------- */
  function setupCharacter() {
    if (!gate) return;
    var stage = gate.querySelector('[data-stockist-character-stage]');
    var slot = gate.querySelector('[data-stockist-character]');
    var btn = gate.querySelector('[data-stockist-character-switch]');
    if (!stage || !slot || !btn) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var indices = [];
    var swapping = false;

    function readPool() {
      try {
        var raw = window.sessionStorage.getItem('theinmagCharacterPool');
        var parsed = raw && JSON.parse(raw);
        return parsed && parsed.indices ? parsed.indices.slice() : null;
      } catch (e) { return null; }
    }

    btn.disabled = true;
    var waits = 0;
    (function waitForPool() {
      var cached = readPool();
      if (slot.querySelector('img') && cached && cached.length > 1) {
        indices = cached;
        btn.disabled = false;
        return;
      }
      if (++waits > 100) return; /* about 10s, then leave it disabled */
      setTimeout(waitForPool, 100);
    })();

    btn.addEventListener('click', function () {
      if (swapping || btn.disabled) return;
      var img = slot.querySelector('img');
      if (!img) return;
      var match = img.src.match(/character-(\d+)\.png/);
      var current = match ? parseInt(match[1], 10) : null;
      var next = null;
      for (var i = 0; i < 20 && next === null; i++) {
        var pick = indices[Math.floor(Math.random() * indices.length)];
        if (pick !== current) next = pick;
      }
      if (next === null) return;

      swapping = true;
      btn.disabled = true;
      var swap = function () {
        img.src = img.src.replace(/character-\d+\.png/, 'character-' + next + '.png');
        stage.classList.remove('is-switching-out');
        swapping = false;
        btn.disabled = false;
      };
      if (reduced) { swap(); return; }
      stage.classList.add('is-switching-out');
      /* Fires on the stage transition, with a timeout backstop so a
         missed transitionend can never leave the character invisible. */
      var done = false;
      var finish = function () { if (done) return; done = true; swap(); };
      stage.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 320);
    });
  }

  if (gate) {
    /* Out of the section so position:fixed resolves against the viewport,
       the same move the peek lightbox on this page makes. */
    document.body.appendChild(gate);
    setupCharacter();

    gate.addEventListener('click', function (e) {
      if (e.target.closest('[data-stockist-gate-close]')) { closeGate(); return; }
      if (e.target.closest('[data-stockist-submit]')) {
        submitCode(gateInput && gateInput.value);
      }
    });
    gate.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeGate(); return; }
      if (e.key === 'Enter' && e.target.closest('[data-stockist-code-input]')) {
        e.preventDefault();
        submitCode(gateInput && gateInput.value);
      }
      /* Keep tab inside the card while it is open. */
      if (e.key !== 'Tab') return;
      var focusables = gate.querySelectorAll('button, input, [href]');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------------------- wiring ----------------------------- */

  if (codeRow) {
    codeRow.addEventListener('click', function (e) {
      if (e.target.closest('[data-stockist-submit]')) { submitCode(rowInput && rowInput.value); return; }
      if (e.target.closest('[data-stockist-applied-change]')) {
        clearCode();
        if (rowInput) setTimeout(function () { rowInput.focus(); }, 40);
      }
    });
    codeRow.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.closest('[data-stockist-code-input]')) {
        e.preventDefault();
        submitCode(rowInput && rowInput.value);
      }
    });
  }

  if (bar) {
    bar.addEventListener('click', function (e) {
      var rm = e.target.closest('[data-checkout-remove]');
      if (rm) {
        var key = rm.getAttribute('data-checkout-remove');
        if (!key) return;
        rm.disabled = true;
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: key, quantity: 0 })
        })
          .then(function (r) { return r.json(); })
          .then(function (cart) {
            state.cart = cart;
            render();
            if (root.__theinmagRefreshCartCount) root.__theinmagRefreshCartCount();
          })
          .catch(function () { rm.disabled = false; });
        return;
      }
      if (e.target.closest('[data-checkout-go]')) {
        /* The code is already on the cart, but carry it in the URL too so
           checkout gets it even if the cart session was rebuilt. */
        window.location.href = state.code
          ? '/discount/' + encodeURIComponent(state.code) + '?redirect=/checkout'
          : '/checkout';
      }
    });
  }

  document.addEventListener('theinmag:cart-updated', function () { refreshCart(); });

  /* Reset each tile's quantity to 1 once it has been added. Without this,
     setting 6 and clicking Add twice silently orders 12, and the stockist
     only finds out in the order summary. The running order is visible right
     above, so nothing is lost by starting from 1 again. */
  root.addEventListener('click', function (e) {
    if (!e.target.closest('[data-shop-add]')) return;
    var row = e.target.closest('.theinmag-bundle-tile__row');
    var qty = row && row.querySelector('[data-tile-qty]');
    if (qty) setTimeout(function () { qty.value = '1'; }, 700);
  });

  /* ---------------------------- start ------------------------------ */

  var saved = loadSaved();
  if (saved) {
    /* A returning stockist never retypes. Paint their remembered price
       straight away, then confirm it against the cart. */
    state.code = saved.code;
    state.rate = saved.rate;
    state.valueType = saved.valueType;
    state.allocationMethod = saved.allocationMethod;
    state.status = saved.rate != null ? 'applied' : 'pending';
    render();
    if (gate && FORCE_GATE) openGate();
    putDiscount(saved.code).then(function (cart) {
      state.cart = cart;
      return refreshCart();
    }).catch(function () { refreshCart(); });
  } else {
    render();
    refreshCart();
    if (gate && (FORCE_GATE || !gateSeen())) openGate();
  }
})();

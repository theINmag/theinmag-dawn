/*
 * theinmag-membership-plan-guard.js
 * ------------------------------------------------------------
 * Catch-all guard so a Membership subscription variant can NEVER sit in the
 * cart (and so reach checkout) without its Appstle selling plan attached.
 *
 * WHY THIS EXISTS. The membership form (theinmag-membership-hero + its JS)
 * always attaches the Rolling selling plan when it adds to cart. But any path
 * that bypasses that form adds the Rolling variant as a ONE-TIME line with no
 * plan: a /cart/{variant}:1 permalink from an email or ad, a headless/Storefront
 * API add, or a stray express-checkout add. A planless Rolling line is a paid
 * order with no recurring contract: the customer is never re-billed and never
 * lands on the shipping list. See the 2026-09 leak (order #52457).
 *
 * WHAT IT DOES. On the cart surfaces it reads /cart.js, finds any line whose
 * variant is a subscription (Rolling) variant but that carries NO selling plan,
 * and repairs it with /cart/change.js (attaches the plan, preserves line
 * properties and quantity). Verified primitive: change.js by line key +
 * selling_plan attaches plan 694268952892 and keeps _starting_mag etc.
 *
 * SCOPE. It ONLY ever touches a variant that is in the plan map (the Rolling
 * variants). The one-time 4-Issue / 8-Issue lines carry no plan by design and
 * are never touched.
 *
 * This is defence-in-depth. The real platform guarantee is the Appstle
 * "subscription only" setting on the Rolling variants (requires_selling_plan),
 * which makes Shopify itself reject a planless add. This guard closes the
 * window before/around that, and any path the setting misses.
 * ------------------------------------------------------------
 */
(function () {
  'use strict';

  /* Rolling variant id -> Appstle selling plan id. Read from the Liquid-injected
     map (self-updates if ids change); falls back to the known live ids so the
     guard still works if the injected map is missing or unparseable. */
  var FALLBACK_MAP = { '53083687715132': 694268952892, '53083687747900': 694268952892 };

  function planMap() {
    var el = document.querySelector('[data-theinmag-membership-plan-map]');
    if (el) {
      try {
        var parsed = JSON.parse(el.textContent);
        if (parsed && Object.keys(parsed).length) return parsed;
      } catch (e) { /* fall through to fallback */ }
    }
    return FALLBACK_MAP;
  }

  function getJSON(url, opts) {
    return fetch(url, opts).then(function (r) {
      return r.json().then(function (b) { return { status: r.status, body: b }; });
    });
  }

  /* Repair every offending line, one at a time (change.js rewrites the cart, so
     line keys shift between calls; re-reading the cart each pass keeps it safe). */
  function repairPass(map) {
    return getJSON('/cart.js').then(function (res) {
      var cart = res.body || {};
      var items = cart.items || [];
      var bad = null;
      for (var i = 0; i < items.length; i += 1) {
        var it = items[i];
        var planId = map[String(it.variant_id)];
        if (planId && !it.selling_plan_allocation) { bad = it; break; }
      }
      if (!bad) return { repaired: false, done: true };
      return getJSON('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bad.key, quantity: bad.quantity, selling_plan: map[String(bad.variant_id)] })
      }).then(function (chg) {
        return { repaired: chg.status === 200, done: false, ok: chg.status === 200 };
      });
    });
  }

  /* Repair until no offending line remains (bounded so a persistent failure
     can never loop forever). Returns whether any repair happened and whether
     everything is now clean. */
  function repairAll(map, guardCount) {
    guardCount = guardCount || 0;
    if (guardCount > 6) return Promise.resolve({ anyRepaired: true, clean: false });
    return repairPass(map).then(function (r) {
      if (r.done) return { anyRepaired: guardCount > 0, clean: true };
      if (!r.ok) return { anyRepaired: true, clean: false };
      return repairAll(map, guardCount + 1).then(function (next) {
        return { anyRepaired: true, clean: next.clean };
      });
    });
  }

  /* If a line could not be repaired, stop it reaching checkout: disable the
     standard checkout submit and hide the express (Shop Pay / PayPal / GPay)
     buttons, with a plain message. Better a blocked cart than a broken order. */
  function blockCheckout() {
    var checkoutBtns = document.querySelectorAll('button[name="checkout"], input[name="checkout"]');
    checkoutBtns.forEach(function (b) { b.disabled = true; });
    var express = document.querySelectorAll('.additional-checkout-buttons, [data-shopify="dynamic-checkout-cart"]');
    express.forEach(function (e) { e.hidden = true; });
    if (!document.querySelector('[data-theinmag-plan-guard-msg]') && checkoutBtns.length) {
      var note = document.createElement('p');
      note.setAttribute('data-theinmag-plan-guard-msg', '');
      note.style.cssText = 'margin:12px 0 0;font-size:0.9rem;line-height:1.4;';
      note.textContent = 'We are setting up your membership. Please refresh this page, or remove and re-add the membership from its page.';
      var host = checkoutBtns[0].closest('.cart__ctas') || checkoutBtns[0].parentElement;
      if (host) host.appendChild(note);
    }
  }

  var RELOAD_FLAG = 'theinmagPlanGuardReloaded';

  function runOnCartPage(map) {
    repairAll(map).then(function (r) {
      if (!r.anyRepaired) { clearReloadFlag(); return; } /* clean cart: clear the flag, leave the page */
      if (!r.clean) { blockCheckout(); return; }         /* could not fix: block, do not loop */
      /* Repaired: reload once so line rows, prices and totals reflect the
         subscription. Loop guard so a repeatedly-dirty cart can't reload forever. */
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      try { sessionStorage.setItem(RELOAD_FLAG, '1'); } catch (e) { /* private mode */ }
      window.location.reload();
    }).catch(function () { /* fail open: defence-in-depth must never break the cart */ });
  }

  function clearReloadFlag() {
    try { sessionStorage.removeItem(RELOAD_FLAG); } catch (e) { /* ignore */ }
  }

  var map = planMap();
  var onCartPage = /(^|\/)cart(\/|$|\?)/.test(window.location.pathname + window.location.search)
    || !!document.querySelector('#main-cart-items');

  if (onCartPage) {
    runOnCartPage(map);
  } else {
    /* Off the cart page (e.g. the drawer surface): repair silently, no reload. */
    repairAll(map).then(function (r) { if (r.anyRepaired && !r.clean) blockCheckout(); })
      .catch(function () { /* fail open */ });
    clearReloadFlag();
  }

  /* Re-check when the cart changes on the same page. The membership popup
     dispatches `cart:updated` on document after a popup add (including on /cart
     and the funnel strips), so a popup Rolling add is repaired even without a
     reload. Only acts when an offending line is actually present. */
  document.addEventListener('cart:updated', function () {
    repairAll(map).catch(function () { /* fail open */ });
  });
})();

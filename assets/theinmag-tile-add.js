/*
  theinmag-tile-add.js
  Canonical "add to cart from a product tile" handler for theINmag.

  Listens once on the document for clicks on any [data-shop-add] button
  (carrying data-variant-id), POSTs to /cart/add.js with a Dawn sections
  payload so the cart drawer can re-render, flips the button to "Added",
  refreshes the cart-count badge and publishes the Dawn cartUpdate event
  (so the sitewide floating cart pill + toast update), then slides the
  cart drawer out.

  Idempotent: guards against binding more than once even if the script
  tag is included by more than one section on the same page.

  This is the shared source of truth. The Membership "Join the club"
  trigger ([data-membership-popup-trigger]) is owned by
  snippets/theinmag-membership-popup.liquid, which mounts its own listener.

  Rollout note: /shop (theinmag-shop-grid), Cart (theinmag-cart-featured)
  and the funnel strip (theinmag-funnel-strip) still carry their own inline
  copies of this handler. Migrate them onto this asset surface-by-surface,
  removing each inline copy as you go so there's never a double-bind.
*/
(function () {
  if (window.__theinmagTileAddInit) return;
  window.__theinmagTileAddInit = true;

  function flashFeedback(message) {
    var feedback = document.querySelector('[data-shop-feedback]');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.removeAttribute('hidden');
    clearTimeout(feedback._timer);
    feedback._timer = setTimeout(function () {
      feedback.setAttribute('hidden', '');
    }, 2400);
  }

  function flipButton(btn, success) {
    var addLabel = btn.querySelector('[data-add-label]');
    var addedLabel = btn.querySelector('[data-added-label]');
    if (!addLabel || !addedLabel) return;
    if (success) {
      addLabel.setAttribute('hidden', '');
      addedLabel.removeAttribute('hidden');
      clearTimeout(btn._flipTimer);
      btn._flipTimer = setTimeout(function () {
        addedLabel.setAttribute('hidden', '');
        addLabel.removeAttribute('hidden');
      }, 1800);
    } else {
      var original = addLabel.textContent;
      addLabel.textContent = 'Try again';
      clearTimeout(btn._flipTimer);
      btn._flipTimer = setTimeout(function () {
        addLabel.textContent = original || 'Add';
      }, 2200);
    }
  }

  function refreshCartCount(productTitle) {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
        });
        document.body.setAttribute('data-theinmag-cart-count', cart.item_count);
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
        if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'theinmag-tile-add',
            cartData: cart,
            productTitle: productTitle || ''
          });
        }
      })
      .catch(function () { /* swallow - graceful degradation */ });
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-shop-add]');
    if (!btn) return;
    event.preventDefault();
    var variantId = btn.getAttribute('data-variant-id');
    if (!variantId) return;
    if (btn._pending) return;
    btn._pending = true;

    /* Build the sections payload so the response carries fresh cart-drawer
       + cart-icon-bubble HTML, the same flow Dawn's product-form.js uses. */
    var cartDrawer = document.querySelector('cart-drawer');
    var sectionIds = cartDrawer && typeof cartDrawer.getSectionsToRender === 'function'
      ? cartDrawer.getSectionsToRender().map(function (s) { return s.id; }).join(',')
      : '';

    var body = new FormData();
    body.append('id', variantId);
    body.append('quantity', '1');
    if (sectionIds) {
      body.append('sections', sectionIds);
      body.append('sections_url', window.location.pathname);
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: body
    })
      .then(function (r) {
        if (!r.ok) throw new Error('Add failed');
        return r.json();
      })
      .then(function (data) {
        flipButton(btn, true);
        /* Success toast is owned by the sitewide floating cart (subscribes
           to the cartUpdate published below). Don't flash a second one. */
        refreshCartCount(data.product_title);
        if (cartDrawer && data.sections && typeof cartDrawer.renderContents === 'function') {
          cartDrawer.renderContents(data);
        }
      })
      .catch(function () {
        flipButton(btn, false);
        flashFeedback('Could not add to cart. Try again.');
      })
      .finally(function () {
        setTimeout(function () { btn._pending = false; }, 600);
      });
  });
})();

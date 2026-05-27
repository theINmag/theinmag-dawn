/* theinmag-flyout-newsletter
   Persistent rectangular tab plus expandable card. Posts to Klaviyo
   (list SMGVLB) on submit. TEST_MODE skips the API call until launch.

   Default state on every page load (unless subscribed):
     - tab visible bottom-left
     - card hidden
     - 40% scroll auto-expands the card ONCE per session,
       only if no dismiss cookie is set
   X (or Esc) minimises card to tab and sets a 14-day dismiss cookie.
   Successful submit sets a 10-year subscribed cookie and hides everything. */

(function () {
  'use strict';

  const TEST_MODE = false;

  const KLAVIYO_ENDPOINT = 'https://a.klaviyo.com/client/subscriptions';
  const KLAVIYO_REVISION = '2026-04-15';
  const COOKIE_DISMISSED = 'theinmag_flyout_dismissed';
  const COOKIE_SUBSCRIBED = 'theinmag_flyout_subscribed';
  const SESSION_KEY = 'theinmag_flyout_session_triggered';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const root = document.querySelector('[data-theinmag-flyout]');
  if (!root) return;

  const tab = root.querySelector('[data-theinmag-flyout-tab]');
  const card = root.querySelector('[data-theinmag-flyout-card]');
  const closeBtn = root.querySelector('[data-theinmag-flyout-close]');
  const form = root.querySelector('[data-theinmag-flyout-form]');
  const submitBtn = root.querySelector('[data-theinmag-flyout-submit]');
  const errorEl = root.querySelector('[data-theinmag-flyout-error]');
  const formState = root.querySelector('[data-theinmag-flyout-form-state]');
  const successState = root.querySelector('[data-theinmag-flyout-success-state]');
  const emailInput = form.querySelector('input[name="email"]');
  const firstNameInput = form.querySelector('input[name="first_name"]');

  const scrollTriggerPercent = parseInt(root.dataset.scrollTrigger, 10) || 40;
  const dismissDays = parseInt(root.dataset.dismissDays, 10) || 14;
  const publicKey = root.dataset.klaviyoPublicKey;
  const listId = root.dataset.klaviyoListId;

  let lastFocusedBeforeOpen = null;
  let autoTriggered = false;

  // ---------- Cookie / session helpers ----------

  function readCookie(name) {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + '=' + encodeURIComponent(value) +
      '; expires=' + expires.toUTCString() +
      '; path=/; SameSite=Lax';
  }

  function isSubscribed() {
    return !!readCookie(COOKIE_SUBSCRIBED);
  }

  function isDismissed() {
    return !!readCookie(COOKIE_DISMISSED);
  }

  function alreadyAutoTriggeredThisSession() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markAutoTriggeredThisSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {
      // ignore
    }
  }

  // ---------- State transitions ----------

  function showTab() {
    root.hidden = false;
    card.hidden = true;
    tab.hidden = false;
    document.removeEventListener('keydown', onKeydown);
  }

  function showCard(opts) {
    const isAuto = opts && opts.viaAutoTrigger;
    card.classList.remove('is-success');
    root.hidden = false;
    card.hidden = false;
    tab.hidden = true;
    formState.hidden = false;
    successState.hidden = true;

    if (isAuto) markAutoTriggeredThisSession();

    lastFocusedBeforeOpen = document.activeElement;
    requestAnimationFrame(function () {
      closeBtn.focus();
    });

    document.addEventListener('keydown', onKeydown);
  }

  function dismissToTab() {
    writeCookie(COOKIE_DISMISSED, '1', dismissDays);
    showTab();
    if (lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === 'function') {
      lastFocusedBeforeOpen.focus();
    }
  }

  function hideEverything() {
    root.hidden = true;
    card.hidden = true;
    tab.hidden = true;
    document.removeEventListener('keydown', onKeydown);
  }

  function showSuccess() {
    card.classList.add('is-success');
    formState.hidden = true;
    successState.hidden = false;
    writeCookie(COOKIE_SUBSCRIBED, '1', 365 * 10);
    setTimeout(hideEverything, 6000);
  }

  // ---------- Keyboard handling (focus trap + Esc) ----------

  function getFocusable() {
    return Array.prototype.slice.call(
      card.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function onKeydown(e) {
    if (card.hidden) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      dismissToTab();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // ---------- Scroll trigger ----------

  function getScrollPercent() {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
    const scrolled = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if (docHeight <= 0) return 100;
    return (scrolled / docHeight) * 100;
  }

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      scrollTicking = false;
      if (autoTriggered) return;
      if (getScrollPercent() >= scrollTriggerPercent) {
        autoTriggered = true;
        window.removeEventListener('scroll', onScroll);
        console.info('[theinmag-flyout] auto-trigger fired at ' + Math.round(getScrollPercent()) + '% document scroll depth.');
        showCard({ viaAutoTrigger: true });
      }
    });
  }

  // ---------- Klaviyo submission ----------

  function submitToKlaviyo(email, firstName) {
    const profileAttrs = {
      email: email,
      subscriptions: {
        email: { marketing: { consent: 'SUBSCRIBED' } }
      }
    };
    if (firstName) profileAttrs.first_name = firstName;

    const body = {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'theINmag flyout newsletter',
          profile: {
            data: {
              type: 'profile',
              attributes: profileAttrs
            }
          }
        },
        relationships: {
          list: {
            data: { type: 'list', id: listId }
          }
        }
      }
    };

    return fetch(KLAVIYO_ENDPOINT + '?company_id=' + encodeURIComponent(publicKey), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': KLAVIYO_REVISION
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (res.status === 202 || res.ok) return true;
      return res.text().then(function (text) {
        throw new Error('Klaviyo ' + res.status + ': ' + (text || 'unknown error'));
      });
    });
  }

  // ---------- Form submit ----------

  function setError(msg) {
    if (msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
      emailInput.removeAttribute('aria-invalid');
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    setError('');

    const email = (emailInput.value || '').trim();
    const firstName = (firstNameInput.value || '').trim();

    if (!email || !EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.');
      emailInput.focus();
      return;
    }

    submitBtn.disabled = true;

    if (TEST_MODE) {
      console.info('[theinmag-flyout] TEST_MODE on; skipping Klaviyo. Payload:', { email: email, first_name: firstName });
      setTimeout(function () {
        submitBtn.disabled = false;
        showSuccess();
      }, 400);
      return;
    }

    submitToKlaviyo(email, firstName)
      .then(function () {
        submitBtn.disabled = false;
        showSuccess();
      })
      .catch(function (err) {
        console.error('[theinmag-flyout] Klaviyo submit failed:', err);
        submitBtn.disabled = false;
        setError("Sorry, that didn't go through. Please try again.");
      });
  }

  // ---------- Init ----------

  if (isSubscribed()) {
    // Permanent suppression: never show anything again.
    root.parentNode && root.parentNode.removeChild(root);
    return;
  }

  // Tab is the default visible state on every page load.
  showTab();

  closeBtn.addEventListener('click', dismissToTab);
  tab.addEventListener('click', function () { showCard(); });
  form.addEventListener('submit', onSubmit);

  // Auto-expand at scroll threshold, gated by dismiss cookie + per-session flag.
  const willAutoTrigger = !isDismissed() && !alreadyAutoTriggeredThisSession();

  console.info(
    '[theinmag-flyout] ready. Tab visible. ' +
    (willAutoTrigger
      ? 'Auto-trigger armed at ' + scrollTriggerPercent + '% document scroll depth.'
      : 'Auto-trigger suppressed (' +
          (isDismissed() ? 'dismissed cookie' : 'already triggered this session') +
        '). Click the tab to open manually.')
  );

  if (willAutoTrigger) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // catch deep-link / restored-scroll landings
  }
})();

/* theinmag-newsletter-page
   Standalone newsletter page form. Posts to Klaviyo (list SMGVLB) via
   the client subscription API. TEST_MODE skips the API call until
   launch. Mirrors the submission flow used by theinmag-flyout-newsletter
   but without cookies, scroll triggers, or focus traps. */

(function () {
  'use strict';

  const TEST_MODE = false;

  const KLAVIYO_ENDPOINT = 'https://a.klaviyo.com/client/subscriptions';
  const KLAVIYO_REVISION = '2026-04-15';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const root = document.querySelector('[data-theinmag-newsletter-page]');
  if (!root) return;

  const form = root.querySelector('[data-theinmag-newsletter-form]');
  const submitBtn = root.querySelector('[data-theinmag-newsletter-submit]');
  const errorEl = root.querySelector('[data-theinmag-newsletter-error]');
  const formState = root.querySelector('[data-theinmag-newsletter-form-state]');
  const successState = root.querySelector('[data-theinmag-newsletter-success-state]');
  const emailInput = form.querySelector('input[name="email"]');
  const firstNameInput = form.querySelector('input[name="first_name"]');

  const publicKey = root.dataset.klaviyoPublicKey;
  const listId = root.dataset.klaviyoListId;

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

  function showSuccess() {
    formState.hidden = true;
    successState.hidden = false;
    successState.focus && successState.focus();
  }

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
          custom_source: 'theINmag newsletter page',
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

  // Ties THIS BROWSER to the profile we just subscribed. Without it a new
  // subscriber stays anonymous to Klaviyo's onsite tracking, so nothing that
  // depends on knowing who is browsing (Active on Site, Viewed Product, browse
  // abandonment) ever fires for them. Klaviyo's own popup does this
  // automatically; posting to the subscriptions API alone does not.
  // Feature-detected and wrapped: analytics must never break a successful signup.
  function identifyToKlaviyo(email, firstName) {
    try {
      if (window.klaviyo && typeof window.klaviyo.identify === 'function') {
        const person = { email: email };
        if (firstName) person.first_name = firstName;
        window.klaviyo.identify(person);
      } else if (window._learnq && typeof window._learnq.push === 'function') {
        // Legacy onsite object uses $-prefixed keys.
        const legacy = { $email: email };
        if (firstName) legacy.$first_name = firstName;
        window._learnq.push(['identify', legacy]);
      }
    } catch (err) {
      console.warn('[theinmag-newsletter-page] Klaviyo identify skipped:', err);
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
      console.info('[theinmag-newsletter-page] TEST_MODE on; skipping Klaviyo. Payload:', { email: email, first_name: firstName });
      setTimeout(function () {
        submitBtn.disabled = false;
        showSuccess();
      }, 400);
      return;
    }

    submitToKlaviyo(email, firstName)
      .then(function () {
        identifyToKlaviyo(email, firstName);
        submitBtn.disabled = false;
        showSuccess();
      })
      .catch(function (err) {
        console.error('[theinmag-newsletter-page] Klaviyo submit failed:', err);
        submitBtn.disabled = false;
        setError("Sorry, that didn't go through. Please try again.");
      });
  }

  form.addEventListener('submit', onSubmit);
  console.info('[theinmag-newsletter-page] ready.');
})();

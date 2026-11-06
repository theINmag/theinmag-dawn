/*
  theINmag gift step pop-up (cart page). Built 2026-11-06.
  Markup: snippets/theinmag-gift-step.liquid. One question per slide, a
  close button and Back on every slide, so nobody gets trapped.

  Saves cart attributes for Pat (Gift, First mag to buyer, First mag
  posted to, _wrap_*) and the cart note (envelope message). Hidden inputs
  with form="cart" carry the same values on the checkout POST.

  Street address searches Google Places (New) as you type and fills suburb,
  state and postcode (6 Nov); without Google it is the manual form plus
  suburb type-to-fill, as before.

  Gate: a Check out tap on a cart with a Print item and no answer opens
  the pop-up instead of leaving. Until answered, the express wallet
  buttons (Shop Pay, PayPal) stay hidden: they would skip the question.
*/
(function () {
  if (window.__theinmagGiftStep) return;
  window.__theinmagGiftStep = true;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var root = document.querySelector('[data-tgs]');
    var footer = document.getElementById('main-cart-footer');
    if (!root || !footer) return;

    var dialog = root.querySelector('[data-tgd]');
    var summary = root.querySelector('[data-tgs-summary]');
    var summaryText = root.querySelector('[data-tgs-summary-text]');
    var hidGift = root.querySelector('[data-tgs-hidden-gift]');
    var hidFirst = root.querySelector('[data-tgs-hidden-first]');
    var hidAddress = root.querySelector('[data-tgs-hidden-address]');
    var note = root.querySelector('[data-tgd-note]');
    var noteCount = root.querySelector('[data-tgd-note-count]');
    var wrapForm = root.querySelector('[data-tgd-wrap-form]');
    var wrapChoice = root.querySelector('[data-tgd-wrap-choice]');
    var fields = root.querySelectorAll('[data-tgd-field]');
    var doneWrap = root.querySelector('[data-tgd-done-wrap]');
    var doneKid = root.querySelector('[data-tgd-done-kid]');
    var doneSelf = root.querySelector('[data-tgd-done-self]');
    var hidSelf = root.querySelector('[data-tgs-hidden-selfwrap]');

    var state = {
      answer: root.getAttribute('data-answer') || '',
      membership: root.getAttribute('data-has-membership') === 'true',
      wrap: hidFirst && hidFirst.value === 'Yes',
      selfWrap: hidSelf && hidSelf.value === 'Yes',
      // Has the membership wrap question been answered for this cart? A
      // Print membership added AFTER the gift answer must still be asked.
      wrapAsked: root.getAttribute('data-wrap-asked') === 'Yes'
    };

    // Anything still to ask before checkout?
    function needsAnswer() {
      if (!state.answer) return true;
      return state.answer === 'Yes' && state.membership && !state.wrapAsked;
    }
    var history = [];
    var current = 'ask';
    var passing = false;
    var noTimer = null;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- a random kid mINion per page load ---------- */
    // Pool is assets/character-1..53.png; never #16 (wind-up bomb) or #53.
    (function pickMinion() {
      var base = root.getAttribute('data-tgd-minion-base') || '';
      if (!base) return;
      var pool = [];
      for (var i = 1; i <= 52; i++) if (i !== 16) pool.push(i);
      var n = pool[Math.floor(Math.random() * pool.length)];
      var src = base.split('?')[0].replace(/character-1_300x\.png$/, 'character-' + n + '_300x.png');
      root.querySelectorAll('[data-tgd-minion]').forEach(function (img) { img.src = src; });
    })();

    /* ---------- helpers ---------- */
    function active() { return !root.hidden; }

    function field(name) {
      for (var i = 0; i < fields.length; i++) if (fields[i].getAttribute('data-tgd-field') === name) return fields[i];
      return null;
    }
    function val(name) { var f = field(name); return f ? f.value.trim() : ''; }

    function missing() {
      var bad = [];
      ['name', 'street', 'suburb', 'state'].forEach(function (n) { if (!val(n)) bad.push(n); });
      if (!/^\d{4}$/.test(val('postcode'))) bad.push('postcode');
      return bad;
    }
    function markFields() {
      var pcf = field('postcode');
      if (pcf && /^\d{3}$/.test(pcf.value.trim()) && pcData && pcData['0' + pcf.value.trim()]) pcf.value = '0' + pcf.value.trim();
      var bad = missing();
      fields.forEach(function (f) {
        var n = f.getAttribute('data-tgd-field');
        var isBad = bad.indexOf(n) !== -1;
        f.setAttribute('aria-invalid', isBad ? 'true' : 'false');
        if (isBad) f.setAttribute('aria-describedby', 'tgd-err-' + n);
        else f.removeAttribute('aria-describedby');
      });
      return bad;
    }
    function composed() {
      var line2 = [val('suburb'), val('state'), val('postcode')].filter(Boolean).join(' ');
      return [val('name'), val('street'), line2].filter(Boolean).join(', ');
    }

    /* ---------- Australian address check (postcode, state, suburb) ----------
       assets/theinmag-au-postcodes.json = { "3564": ["VIC", ["ECHUCA", ...]] },
       built from the AU postcode list Pat validates against. Loaded only when
       the address form opens. If it fails to load, nothing is blocked. */
    var pcData = null;
    var pcLoading = null;
    var suburbOverride = '';
    function loadPostcodes() {
      if (pcData || pcLoading) return pcLoading;
      var url = root.getAttribute('data-postcodes-url');
      if (!url) return null;
      pcLoading = fetch(url).then(function (r) { return r.json(); })
        .then(function (j) { pcData = j; buildSuburbIndex(j); return j; })
        .catch(function () { pcData = null; });
      return pcLoading;
    }
    // Suburb -> [{s: 'ECHUCA', st: 'VIC', pc: '3564'}], for type-to-fill.
    var suburbIndex = [];
    function buildSuburbIndex(j) {
      suburbIndex = [];
      Object.keys(j).forEach(function (pc) {
        var st = String(j[pc][0]);
        j[pc][1].forEach(function (name) { suburbIndex.push({ s: name, n: norm(name), st: st, pc: pc }); });
      });
      suburbIndex.sort(function (a, b) { return a.n < b.n ? -1 : a.n > b.n ? 1 : 0; });
    }
    function suburbMatches(typed) {
      var q = norm(typed);
      if (q.length < 2 || !suburbIndex.length) return [];
      var starts = [], contains = [], seen = {};
      for (var i = 0; i < suburbIndex.length && starts.length < 4; i++) {
        var e = suburbIndex[i];
        var key = e.n + '|' + e.pc;
        if (seen[key]) continue;
        if (e.n.indexOf(q) === 0) { starts.push(e); seen[key] = 1; }
        else if (contains.length < 4 && e.n.indexOf(' ' + q) !== -1) { contains.push(e); seen[key] = 1; }
      }
      return starts.concat(contains).slice(0, 4);
    }

    // Apostrophes vanish, anything else non-letter becomes a space, so
    // "O'Connor", "OConnor" and "Brighton-Le-Sands" / "Brighton Le Sands" match.
    function norm(t) { return String(t || '').toUpperCase().replace(/['\u2019`]/g, '').replace(/[^A-Z]/g, ' ').replace(/\s+/g, ' ').trim(); }
    function titleCase(t) { return t.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }
    function closeness(a, b) {
      // share of letter pairs in common, enough to rank "Echoca" next to "Echuca"
      function pairs(x) { var o = []; for (var i = 0; i < x.length - 1; i++) o.push(x.substr(i, 2)); return o; }
      var pa = pairs(a), pb = pairs(b), hit = 0;
      pa.forEach(function (p) { var i = pb.indexOf(p); if (i !== -1) { hit++; pb.splice(i, 1); } });
      return (2 * hit) / ((a.length - 1) + (b.length - 1) || 1);
    }
    // Returns null when fine, else {field, message, suggestions}
    function addressProblem() {
      if (!pcData) return null;
      var pc = val('postcode'), st = val('state'), sub = norm(val('suburb'));
      var entry = pcData[pc];
      if (!entry) return { field: 'postcode', message: "We can't find postcode " + pc + ". Please check it." };
      var states = String(entry[0]).split('|');
      if (st && states.indexOf(st) === -1) return { field: 'postcode', message: 'Postcode ' + pc + ' is in ' + states.join(' or ') + ', not ' + st + '.' };
      var hit = entry[1].some(function (x) { return norm(x) === sub; });
      if (sub && !hit && suburbOverride !== sub + '|' + pc) {
        var seenR = {};
        var ranked = entry[1].filter(function (x) { var k = norm(x); if (seenR[k]) return false; seenR[k] = 1; return true; })
          .sort(function (a, b) { return closeness(sub, norm(b)) - closeness(sub, norm(a)); }).slice(0, 3);
        return { field: 'suburb', message: "We can't find " + titleCase(sub) + ' at postcode ' + pc + '.', suggestions: ranked };
      }
      return null;
    }
    var suggestBox = root.querySelector('[data-tgd-suggest]');
    function showSuggestions(list, typed) {
      if (!suggestBox) return;
      suggestBox.innerHTML = '';
      suggestBox.removeAttribute('role');
      suggestBox.removeAttribute('aria-label');
      if (!list || !list.length) { suggestBox.hidden = true; return; }
      var lead = document.createElement('p');
      lead.className = 'tgd__suggest-lead';
      lead.textContent = 'Did you mean:';
      suggestBox.appendChild(lead);
      list.forEach(function (name) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tgd__suggest-btn';
        b.textContent = titleCase(name);
        b.addEventListener('click', function () {
          var f = field('suburb');
          f.value = titleCase(name);
          suggestBox.hidden = true;
          markFields();
          var e = document.getElementById('tgd-err-suburb');
          if (e) e.textContent = 'Please add a suburb.';
        });
        suggestBox.appendChild(b);
      });
      var keep = document.createElement('button');
      keep.type = 'button';
      keep.className = 'tgd__suggest-keep';
      keep.textContent = 'Keep "' + typed + '"';
      keep.addEventListener('click', function () {
        suburbOverride = norm(typed) + '|' + val('postcode');
        suggestBox.hidden = true;
        var f = field('suburb');
        f.setAttribute('aria-invalid', 'false');
      });
      suggestBox.appendChild(keep);
      suggestBox.hidden = false;
    }

    // Type-to-fill: tap a match and suburb, state and postcode fill together.
    function showLiveMatches(typed) {
      if (!suggestBox) return;
      suburbOverride = '';
      var list = suburbMatches(typed);
      suggestBox.innerHTML = '';
      if (!list.length) { suggestBox.hidden = true; return; }
      suggestBox.setAttribute('role', 'listbox');
      suggestBox.setAttribute('aria-label', 'Matching suburbs');
      list.forEach(function (e) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tgd__suggest-btn tgd__suggest-btn--row';
        b.setAttribute('role', 'option');
        var multi = e.st.indexOf('|') !== -1;
        b.textContent = titleCase(e.s) + ' ' + (multi ? '' : e.st + ' ') + e.pc;
        // Keep the input focused so a tap is not lost to the keyboard closing.
        b.addEventListener('pointerdown', function (ev) { ev.preventDefault(); });
        b.addEventListener('click', function () { pickSuburb(e); });
        suggestBox.appendChild(b);
      });
      suggestBox.hidden = false;
    }
    function pickSuburb(e) {
      var fs = field('suburb'), fst = field('state'), fpc = field('postcode');
      if (fs) fs.value = titleCase(e.s);
      if (fst && e.st.indexOf('|') === -1) fst.value = e.st;
      if (fpc) fpc.value = e.pc;
      suggestBox.hidden = true;
      ['suburb', 'state', 'postcode'].forEach(function (n) {
        var el = document.getElementById('tgd-err-' + n);
        var d = { suburb: 'Please add a suburb.', state: 'Please choose a state.', postcode: 'Postcode needs 4 numbers.' };
        if (el) el.textContent = d[n];
      });
      markFields();
      var next = root.querySelector('[data-tgd-wrap-next]');
      if (next) next.focus();
    }

    var suburbField = field('suburb');
    if (suburbField) {
      suburbField.addEventListener('blur', function () {
        setTimeout(function () {
          if (suggestBox && suggestBox.getAttribute('role') === 'listbox') suggestBox.hidden = true;
        }, 150);
      });
    }

    /* ---------- Street address search (Google Places API, New) ----------
       Ryan, 6 Nov: typing "49 Pakenham Street" should offer the real
       address and fill suburb, state and postcode. Maps JS loads only when
       the address form opens. Autocomplete Data API with a session token,
       then one fetchFields on the pick, so Google bills per session. Any
       failure (key, quota, network) quietly leaves the manual fields and the
       suburb type-to-fill; checkout is never blocked. The key is a public,
       website-restricted browser key (data-places-key on the snippet).
       addressProblem() still checks whatever gets filled. */
    var streetField = field('street');
    var addrBox = root.querySelector('[data-tgd-addr-suggest]');
    var addrCredit = root.querySelector('[data-tgd-addr-credit]');
    var places = null;        // the places library, once loaded
    var placesDead = false;   // gave up: manual fields only
    var placesLoading = false;
    var placesFails = 0;
    var sessionToken = null;
    var addrTimer = null;
    var addrSeq = 0;
    var addrList = [];
    var addrActive = -1;
    var lastFilled = '';

    function giveUpPlaces() {
      placesDead = true;
      places = null;
      clearTimeout(addrTimer);
      addrSeq++;
      hideAddr();
      if (streetField) {
        ['role', 'aria-autocomplete', 'aria-controls', 'aria-expanded', 'aria-activedescendant'].forEach(function (a) { streetField.removeAttribute(a); });
      }
    }

    function loadPlaces() {
      if (places || placesDead || placesLoading) return;
      var key = root.getAttribute('data-places-key');
      if (!key || !streetField || !addrBox) { placesDead = true; return; }
      placesLoading = true;
      new Promise(function (resolve, reject) {
        // Google calls this on a bad or blocked key.
        var prevAuth = window.gm_authFailure;
        window.gm_authFailure = function () {
          giveUpPlaces();
          if (typeof prevAuth === 'function') prevAuth();
        };
        if (window.google && google.maps && typeof google.maps.importLibrary === 'function') { resolve(); return; }
        window.__tgdMapsReady = function () { resolve(); };
        var s = document.createElement('script');
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) +
          '&v=weekly&loading=async&region=AU&language=en-AU&callback=__tgdMapsReady';
        s.async = true;
        s.onerror = reject;
        document.head.appendChild(s);
        setTimeout(function () { reject(new Error('timeout')); }, 10000);
      }).then(function () {
        return google.maps.importLibrary('places');
      }).then(function (lib) {
        if (placesDead) return;
        if (!lib || !lib.AutocompleteSuggestion || !lib.AutocompleteSessionToken) throw new Error('no places');
        places = lib;
        // Browser address autofill would cover our list; Google's own widget does the same.
        streetField.setAttribute('autocomplete', 'off');
        streetField.setAttribute('role', 'combobox');
        streetField.setAttribute('aria-autocomplete', 'list');
        streetField.setAttribute('aria-controls', addrBox.id);
        streetField.setAttribute('aria-expanded', 'false');
        // Typed before Google arrived? Search now.
        if (document.activeElement === streetField) queueAddress(streetField.value);
      }).catch(giveUpPlaces).then(function () { placesLoading = false; });
    }

    function hideAddr() {
      if (!addrBox) return;
      addrBox.hidden = true;
      addrBox.innerHTML = '';
      addrList = [];
      addrActive = -1;
      if (addrCredit) addrCredit.hidden = true;
      if (streetField && places) {
        streetField.setAttribute('aria-expanded', 'false');
        streetField.removeAttribute('aria-activedescendant');
      }
    }

    var lastQuery = '';
    function queueAddress(v) {
      clearTimeout(addrTimer);
      if (!places) return;
      var q = String(v || '').trim().replace(/\s+/g, ' ');
      if (q.length < 4 || q === lastFilled) { addrSeq++; lastQuery = ''; hideAddr(); return; }
      if (q === lastQuery) return; // a trailing space is not a new search (each request is billed)
      addrTimer = setTimeout(function () { lastQuery = q; searchAddress(q); }, 400);
    }

    function searchAddress(q) {
      if (!places) return;
      var my = ++addrSeq;
      if (!sessionToken) sessionToken = new places.AutocompleteSessionToken();
      places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: q,
        sessionToken: sessionToken,
        includedRegionCodes: ['au'],
        includedPrimaryTypes: ['street_address', 'premise', 'subpremise', 'route'],
        language: 'en-AU',
        region: 'au'
      }).then(function (res) {
        if (my !== addrSeq) return;
        placesFails = 0;
        var list = ((res && res.suggestions) || [])
          .map(function (s) { return s.placePrediction; })
          .filter(Boolean)
          .slice(0, 5);
        renderAddr(list, q);
      }).catch(function () {
        if (my !== addrSeq) return;
        hideAddr();
        // Two failures in a row (quota, network): stop asking Google.
        if (++placesFails >= 2) giveUpPlaces();
      });
    }

    function predText(p, part) {
      var t = p && p[part];
      return t && t.text ? t.text : '';
    }

    function renderAddr(list, typed) {
      if (!addrBox) return;
      addrBox.innerHTML = '';
      addrList = list;
      addrActive = -1;
      streetField.removeAttribute('aria-activedescendant');
      if (!list.length || document.activeElement !== streetField) { hideAddr(); return; }
      list.forEach(function (p, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tgd__addr-opt';
        b.id = 'tgd-addr-opt-' + i;
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', 'false');
        b.tabIndex = -1;
        var main = document.createElement('span');
        main.className = 'tgd__addr-main';
        main.textContent = predText(p, 'mainText') || predText(p, 'text');
        var sub = document.createElement('span');
        sub.className = 'tgd__addr-sub';
        sub.textContent = predText(p, 'secondaryText').replace(/,\s*Australia$/, '');
        b.appendChild(main);
        if (sub.textContent) b.appendChild(sub);
        // Keep the input focused so a tap is not lost to the keyboard closing.
        b.addEventListener('pointerdown', function (ev) { ev.preventDefault(); });
        b.addEventListener('click', function () { pickAddress(p, typed); });
        addrBox.appendChild(b);
      });
      addrBox.hidden = false;
      if (addrCredit) addrCredit.hidden = false;
      streetField.setAttribute('aria-expanded', 'true');
      if (suggestBox) suggestBox.hidden = true;
      keepAddrVisible();
    }

    // Phones with the keyboard up: scroll the sheet so the rows sit under
    // the field instead of behind the keyboard.
    function keepAddrVisible() {
      var vv = window.visualViewport;
      var visibleBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
      var last = addrCredit && !addrCredit.hidden ? addrCredit : addrBox;
      var over = last.getBoundingClientRect().bottom - visibleBottom + 8;
      if (over <= 0) return;
      var room = streetField.getBoundingClientRect().top - dialog.getBoundingClientRect().top - 40;
      if (room > 0) dialog.scrollTop += Math.min(over, room);
    }

    function setActive(i) {
      var opts = addrBox.querySelectorAll('[role="option"]');
      if (!opts.length) return;
      addrActive = (i + opts.length) % opts.length;
      opts.forEach(function (o, k) { o.setAttribute('aria-selected', k === addrActive ? 'true' : 'false'); });
      streetField.setAttribute('aria-activedescendant', opts[addrActive].id);
      opts[addrActive].scrollIntoView({ block: 'nearest' });
    }

    // Arrow keys, Enter and Escape while the address list is open.
    function addrKeys(e) {
      if (!addrBox || addrBox.hidden || !addrList.length) return false;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(addrActive + 1); return true; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(addrActive - 1); return true; }
      if (e.key === 'Enter' && addrActive >= 0) {
        e.preventDefault();
        pickAddress(addrList[addrActive], streetField.value.trim());
        return true;
      }
      if (e.key === 'Escape') { e.preventDefault(); hideAddr(); return true; }
      return false;
    }

    function capFirst(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; }

    function pickAddress(p, typed) {
      typed = typed || '';
      var main = predText(p, 'mainText');
      hideAddr();
      clearTimeout(addrTimer);
      addrSeq++;
      // Show the pick straight away; the rest fills a moment later.
      if (main) streetField.value = main;
      lastFilled = streetField.value.trim();
      var place;
      try { place = p.toPlace(); } catch (err) { place = null; }
      sessionToken = null; // used up by this pick; the next keystroke starts a new session
      lastQuery = '';
      if (!place) { afterFill(false); return; }
      place.fetchFields({ fields: ['addressComponents'] }).then(function () {
        sessionToken = null;
        fillFromComponents(place.addressComponents || [], main, typed);
        afterFill(true);
      }).catch(function () {
        // Details failed: the street line stays, the rest is typed by hand.
        sessionToken = null;
        afterFill(false);
      });
    }

    function fillFromComponents(comps, main, typed) {
      function get(type, short) {
        for (var i = 0; i < comps.length; i++) {
          var c = comps[i];
          if (c.types && c.types.indexOf(type) !== -1) return (short ? c.shortText : c.longText) || '';
        }
        return '';
      }
      var unit = get('subpremise'), num = get('street_number'), route = get('route');
      var street;
      if (num && route) {
        street = num + ' ' + route;
        // "3" -> 3/12 Little Smith Street; "unit 5" -> Unit 5, 20 Bay Street
        if (unit) street = /^[0-9a-z]{1,5}$/i.test(unit) ? unit + '/' + street : capFirst(unit) + ', ' + street;
      } else {
        // Google knows the street but not the number: keep the line as
        // shown in the row, which carries what was typed.
        street = main || route || streetField.value.trim();
      }
      // A number typed up front that Google dropped: trust the row text.
      var tn = typed.match(/^\s*(?:unit|u|apt|flat|shop)?\s*(\d+[a-z]?(?:\s*\/\s*\d+[a-z]?)?)\s/i);
      if (tn && main && street.replace(/\s/g, '').indexOf(tn[1].replace(/\s/g, '')) === -1 &&
          main.replace(/\s/g, '').indexOf(tn[1].replace(/\s/g, '')) !== -1) street = main;
      // Rural lot and mail numbers Google drops ("Lot 2" came back as "2 ...").
      var lot = typed.match(/^\s*(lot|rmb|rsd|cmb)\s*(\d+[a-z]?)\b/i);
      if (lot && !new RegExp('\\b' + lot[1] + '\\b', 'i').test(street)) {
        var word = lot[1].toLowerCase() === 'lot' ? 'Lot' : lot[1].toUpperCase();
        street = word + ' ' + lot[2] + ' ' + street.replace(new RegExp('^' + lot[2] + '\\s+', 'i'), '');
      }
      // Only overwrite the street if they have not kept typing since the tap.
      if (streetField.value.trim() === lastFilled) {
        streetField.value = street;
        lastFilled = street;
      }

      var suburb = get('locality') || get('postal_town') || get('sublocality_level_1') || get('sublocality');
      var st = get('administrative_area_level_1', true).toUpperCase();
      var pc = get('postal_code');
      var fs = field('suburb'), fst = field('state'), fpc = field('postcode');
      if (fs && suburb) fs.value = suburb;
      if (fst && st && fst.querySelector('option[value="' + st + '"]')) fst.value = st;
      // No postcode from Google: one match in our AU list fills it.
      if (!pc && suburb && suburbIndex.length) {
        var n = norm(suburb), pcs = {};
        suburbIndex.forEach(function (e) {
          if (e.n === n && (!st || String(e.st).split('|').indexOf(st) !== -1)) pcs[e.pc] = 1;
        });
        var keys = Object.keys(pcs);
        if (keys.length === 1) pc = keys[0];
      }
      if (fpc && /^\d{4}$/.test(pc)) fpc.value = pc;
    }

    function afterFill(complete) {
      suburbOverride = '';
      if (suggestBox) suggestBox.hidden = true;
      var d = { street: 'Please add a street address.', suburb: 'Please add a suburb.', state: 'Please choose a state.', postcode: 'Postcode needs 4 numbers.' };
      var bad = missing();
      Object.keys(d).forEach(function (n) {
        var el = document.getElementById('tgd-err-' + n);
        if (el) el.textContent = d[n];
        var f = field(n);
        if (f && bad.indexOf(n) === -1) {
          f.setAttribute('aria-invalid', 'false');
          f.removeAttribute('aria-describedby');
        }
      });
      // Anything Google could not fill gets the focus; otherwise Next.
      var gap = ['name', 'street', 'suburb', 'state', 'postcode'].filter(function (n) { return bad.indexOf(n) !== -1; })[0];
      var target = complete && !gap ? root.querySelector('[data-tgd-wrap-next]') : field(gap || 'suburb');
      if (target) target.focus();
    }

    if (streetField) {
      streetField.addEventListener('blur', function () {
        setTimeout(function () {
          if (document.activeElement !== streetField) {
            hideAddr();
            sessionToken = null; // an abandoned search must not bleed into the next one (billing)
          }
        }, 150);
      });
    }

    function formOpened() {
      loadPostcodes();
      loadPlaces();
    }

    function wrapActive() {
      return state.answer === 'Yes' && state.membership && state.wrap;
    }

    function syncHidden() {
      if (hidGift) hidGift.value = state.answer;
      if (hidFirst) hidFirst.value = wrapActive() ? 'Yes' : '';
      if (hidAddress) hidAddress.value = wrapActive() ? composed() : '';
      if (hidSelf) hidSelf.value = selfWrapActive() ? 'Yes' : '';
    }

    // No Print membership: "post it to me" just means they type their own
    // address at checkout.
    function selfWrapActive() {
      return state.answer === 'Yes' && !state.membership && state.selfWrap;
    }

    function save(extra) {
      syncHidden();
      var on = wrapActive();
      var body = {
        attributes: {
          'Gift': state.answer,
          'First mag to buyer': on ? 'Yes' : '',
          'First mag posted to': on ? composed() : '',
          '_wrap_name': on ? val('name') : '',
          '_wrap_street': on ? val('street') : '',
          '_wrap_suburb': on ? val('suburb') : '',
          '_wrap_state': on ? val('state') : '',
          '_wrap_postcode': on ? val('postcode') : '',
          'Posting to buyer to wrap': selfWrapActive() ? 'Yes' : '',
          '_gift_wrap_asked': state.answer === 'Yes' && state.wrapAsked ? 'Yes' : ''
        }
      };
      if (extra) for (var k in extra) body[k] = extra[k];
      return fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body)
      }).catch(function () {});
    }

    function updateCount() {
      if (note && noteCount) noteCount.textContent = note.value.length + ' of 50';
    }

    function renderPage() {
      syncHidden();
      footer.setAttribute('data-gift-state', !active() ? 'na' : (needsAnswer() ? 'unanswered' : 'answered'));
      if (!summary) return;
      summary.hidden = !state.answer;
      if (!summaryText) return;
      if (state.answer === 'No') {
        summaryText.textContent = 'Not a gift.';
      } else if (state.answer === 'Yes') {
        var msg = note && note.value.trim();
        var t = msg ? 'Special envelope message: "' + msg + '"' : 'Gift for a kid.';
        if (wrapActive()) t += (msg ? '. ' : ' ') + 'First mag comes to you to hand over.';
        summaryText.textContent = t;
      }
    }

    /* ---------- slides ---------- */
    function step(name) { return root.querySelector('[data-tgd-step="' + name + '"]'); }

    function show(name, back) {
      var from = step(current);
      var to = step(name);
      if (!to) return;
      if (!back && current !== name) history.push(current);
      if (from && from !== to) from.hidden = true;
      to.hidden = false;
      to.classList.remove('is-in', 'is-back');
      if (!reduced) {
        void to.offsetWidth;
        to.classList.add(back ? 'is-back' : 'is-in');
      }
      current = name;
      dialog.setAttribute('aria-labelledby', '');
      var title = to.querySelector('.tgd__title');
      if (title) {
        if (!title.id) title.id = 'tgd-title-' + name;
        dialog.setAttribute('aria-labelledby', title.id);
      }
      if (name === 'wrap') {
        if (wrapForm) wrapForm.hidden = !state.wrap;
        if (wrapChoice) wrapChoice.hidden = !!state.wrap;
        if (state.wrap) formOpened();
      }
      if (name === 'done') {
        if (doneWrap) doneWrap.hidden = !wrapActive();
        if (doneKid) doneKid.hidden = selfWrapActive();
        if (doneSelf) doneSelf.hidden = !selfWrapActive();
      }
      // Focus the slide's first control (title for screen readers on later slides)
      setTimeout(function () {
        var focusEl = name === 'ask' ? to.querySelector('[data-tgd-answer="Yes"]') : title;
        if (focusEl) focusEl.focus({ preventScroll: true });
      }, 30);
    }

    function back() {
      var prev = history.pop();
      if (prev) show(prev, true);
      else if (current !== 'ask') show('ask', true);
    }

    function open(startAt) {
      clearTimeout(noTimer);
      history = [];
      Array.prototype.forEach.call(root.querySelectorAll('[data-tgd-step]'), function (s) { s.hidden = true; });
      current = startAt || 'ask';
      show(current, true);
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      document.documentElement.classList.add('tgd-open');
    }

    var closingByButton = false;
    function close() {
      closingByButton = true;
      clearTimeout(noTimer);
      // A half-filled wrap address never counts; keep whatever message was typed.
      if (wrapForm && !wrapForm.hidden && missing().length) state.wrap = false;
      if (state.answer) save({ note: note ? note.value.trim() : '' });
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      document.documentElement.classList.remove('tgd-open');
      renderPage();
    }

    function goCheckout() {
      if (passing) return;
      var form = document.getElementById('cart');
      var btn = document.getElementById('checkout');
      // The planless-membership guard disables Check out; respect it.
      if (!form || !btn || btn.disabled) { close(); return; }
      passing = true;
      var timeout = new Promise(function (res) { setTimeout(res, 2500); });
      Promise.race([save({ note: note ? note.value.trim() : '' }), timeout]).then(function () {
        clearTimeout(noTimer);
        // Keep the pop-up showing until checkout loads, so the cart never
        // flashes back up in between (Tam, 6 Nov).
        if (typeof form.requestSubmit === 'function') form.requestSubmit(btn);
        else btn.click();
      });
    }

    /* ---------- wiring ---------- */
    root.querySelectorAll('[data-tgd-close]').forEach(function (b) { b.addEventListener('click', close); });
    root.querySelectorAll('[data-tgd-back]').forEach(function (b) {
      if (b.closest('[data-tgd-step="wrap"]')) return; // handled below
      b.addEventListener('click', back);
    });
    dialog.addEventListener('close', function () {
      clearTimeout(noTimer);
      // Escape key closes natively and skips close(): save what was typed.
      if (!closingByButton && !passing) {
        if (wrapForm && !wrapForm.hidden && missing().length) state.wrap = false;
        if (state.answer) save({ note: note ? note.value.trim() : '' });
      }
      closingByButton = false;
      document.documentElement.classList.remove('tgd-open');
      renderPage();
    });
    // Tap on the dimmed backdrop closes it, like any pop-up.
    dialog.addEventListener('click', function (e) {
      if (e.target !== dialog) return;
      var r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    });

    root.querySelectorAll('[data-tgs-open]').forEach(function (b) {
      b.addEventListener('click', function () { open('ask'); });
    });

    root.querySelectorAll('[data-tgd-answer]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.answer = b.getAttribute('data-tgd-answer');
        if (state.answer === 'No') {
          state.wrap = false;
          state.selfWrap = false;
          state.wrapAsked = false;
          if (note) { note.value = ''; updateCount(); }
          save({ note: '' });
          show('no');
          noTimer = setTimeout(goCheckout, 700);
        } else {
          save();
          show('message');
        }
      });
    });

    if (note) note.addEventListener('input', updateCount);

    root.querySelectorAll('[data-tgd-message]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-tgd-message') === 'skip' && note) {
          note.value = '';
          updateCount();
        }
        save({ note: note ? note.value.trim() : '' });
        if (state.membership) {
          show('wrap');
        } else {
          // Single mags: nothing more to ask. A quick "Sounds good!", then checkout.
          show('no');
          noTimer = setTimeout(goCheckout, 700);
        }
      });
    });

    root.querySelectorAll('[data-tgd-wrap]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-tgd-wrap') === 'yes') {
          state.wrap = true;
          if (wrapChoice) wrapChoice.hidden = true;
          if (wrapForm) wrapForm.hidden = false;
          formOpened();
          var f = field('name');
          if (f) setTimeout(function () { f.focus(); }, 30);
        } else {
          state.wrap = false;
          state.wrapAsked = true;
          save();
          show('done');
        }
      });
    });

    var wrapNext = root.querySelector('[data-tgd-wrap-next]');
    if (wrapNext) {
      wrapNext.addEventListener('click', function () {
        var bad = markFields();
        if (bad.length) {
          var f = field(bad[0]);
          if (f) f.focus();
          return;
        }
        var problem = addressProblem();
        if (problem) {
          var pf = field(problem.field);
          var err = document.getElementById('tgd-err-' + problem.field);
          if (err) err.textContent = problem.message;
          if (pf) {
            pf.setAttribute('aria-invalid', 'true');
            pf.setAttribute('aria-describedby', 'tgd-err-' + problem.field);
            pf.focus();
          }
          showSuggestions(problem.suggestions, val('suburb'));
          return;
        }
        if (suggestBox) suggestBox.hidden = true;
        state.wrapAsked = true;
        save();
        show('done');
      });
    }

    fields.forEach(function (f) {
      f.addEventListener('keydown', function (e) {
        if (f === streetField && addrKeys(e)) return;
        if (e.key === 'Enter' && wrapNext) { e.preventDefault(); wrapNext.click(); }
      });
      f.addEventListener('input', function () {
        if (f.getAttribute('data-tgd-field') === 'postcode') f.value = f.value.replace(/\D/g, '').slice(0, 4);
        if (f.getAttribute('aria-invalid') === 'true') {
          var n = f.getAttribute('data-tgd-field');
          var e = document.getElementById('tgd-err-' + n);
          var defaults = { name: 'Please add your name.', street: 'Please add a street address.', suburb: 'Please add a suburb.', state: 'Please choose a state.', postcode: 'Postcode needs 4 numbers.' };
          if (e && defaults[n]) e.textContent = defaults[n];
          markFields();
        }
        if (f.getAttribute('data-tgd-field') === 'suburb') showLiveMatches(f.value);
        if (f === streetField) queueAddress(f.value);
      });
    });

    var go = root.querySelector('[data-tgd-go]');
    if (go) go.addEventListener('click', goCheckout);

    // Back from the wrap form returns to the yes/no choice first.
    var wrapStep = step('wrap');
    if (wrapStep) {
      wrapStep.querySelector('[data-tgd-back]').addEventListener('click', function () {
        if (wrapForm && !wrapForm.hidden) {
          wrapForm.hidden = true;
          if (wrapChoice) wrapChoice.hidden = false;
          state.wrap = false;
          save();
          return;
        }
        back();
      });
    }

    // Back button from checkout restores this page from the browser cache
    // with the pop-up still open: put it away and allow a fresh go.
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      passing = false;
      closingByButton = true;
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
      document.documentElement.classList.remove('tgd-open');
      renderPage();
    });

    /* ---------- the checkout gate ---------- */
    // Bound on document in capture: Dawn replaces <form id="cart"> when
    // lines change, which would drop a listener bound on the form.
    document.addEventListener('submit', function (e) {
      if (!e.target || e.target.id !== 'cart') return;
      if (passing || !active()) return;
      var submitter = e.submitter || null;
      if (submitter && submitter.name && submitter.name !== 'checkout') return;
      if (!needsAnswer()) return; // answered earlier: straight through
      e.preventDefault();
      e.stopPropagation();
      // A gift whose membership arrived later only needs the wrap question.
      open(state.answer === 'Yes' ? 'wrap' : 'ask');
    }, true);

    /* ---------- keep honest when lines change on this page ---------- */
    function refreshFromCart() {
      fetch('/cart.js', { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          var items = cart.items || [];
          var physical = items.some(function (it) {
            return it.requires_shipping || /(^|\/ )Print( \/|$)/.test(it.variant_title || '');
          });
          // Only a Print membership whose first mag ships now offers the
          // hand-over option; a future-issue start arrives at the drop.
          var curNum = parseInt(root.getAttribute('data-current-num'), 10) || 0;
          var printMem = items.filter(function (it) {
            return it.handle === 'membership' && /Print/.test(it.variant_title || '');
          });
          var memShipsNow = printMem.some(function (it) {
            var start = it.properties && it.properties._starting_mag;
            if (!start || !curNum) return true;
            return (parseInt(String(start).replace(/\D/g, ''), 10) || 0) <= curNum;
          });
          // A future-start membership beside something that posts now
          // (Mag11 single + membership from Mag12) also gets the question.
          var otherShipsNow = items.some(function (it) {
            return it.handle !== 'membership' && it.requires_shipping;
          });
          state.membership = memShipsNow || (printMem.length > 0 && otherShipsNow);
          root.hidden = !physical;
          if (!state.membership && (state.wrap || state.wrapAsked)) {
            state.wrap = false;
            state.wrapAsked = false;
            save();
          }
          renderPage();
        })
        .catch(function () {});
    }
    if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
      subscribe(PUB_SUB_EVENTS.cartUpdate, refreshFromCart);
    }

    renderPage();
  });
})();

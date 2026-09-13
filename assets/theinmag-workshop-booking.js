/* theinmag-workshop-booking
   Booking form for the hidden Caloundra workshops page. Reads live spots
   from the theinmag-workshop-booking Worker and posts bookings to it. The
   Worker owns the hard 25-per-session cap; this script just reflects it and
   fails gracefully if the Worker is unreachable (the server still enforces
   the cap on submit). */
(function () {
  'use strict';

  var root = document.querySelector('[data-wsb-root]');
  if (!root) return;
  var worker = (root.dataset.workerUrl || '').replace(/\/+$/, '');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Fallback session definitions (times are fixed; live counts overlay these).
  var SESSIONS = [
    { key: 's1', time: '9:00am' },
    { key: 's2', time: '10:15am' }
  ];
  var counts = {};        // key -> { left, cap, booked } once availability loads
  var selected = null;
  var scrolledToEnd = false;

  var $ = function (sel) { return root.querySelector(sel); };
  var sessionsEl = $('[data-wsb-sessions]');
  var childrenEl = $('[data-wsb-children]');
  var consentEl = $('[data-wsb-consent]');
  var tickEl = $('[data-wsb-tick]');
  var consentBox = $('[data-wsb-consent-box]');
  var scrollHint = $('[data-wsb-scrollhint]');
  var submitBtn = $('[data-wsb-submit]');
  var errorEl = $('[data-wsb-error]');
  var formEl = $('[data-wsb-form]');
  var successEl = $('[data-wsb-success]');
  var recapEl = $('[data-wsb-recap]');
  var pName = $('[data-wsb-pname]');
  var pEmail = $('[data-wsb-pemail]');
  var pPhone = $('[data-wsb-pphone]');

  /* ---- Availability ---- */
  function loadAvailability() {
    if (!worker) { renderSessions(); return; }
    fetch(worker + '/availability', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && Array.isArray(data.sessions)) {
          data.sessions.forEach(function (s) { counts[s.key] = { left: s.left, cap: s.cap, booked: s.booked }; });
        }
        renderSessions();
      })
      .catch(function () { renderSessions(); });
  }

  function renderSessions() {
    sessionsEl.innerHTML = '';
    SESSIONS.forEach(function (s) {
      var c = counts[s.key];
      var known = c && typeof c.left === 'number';
      var full = known && c.left <= 0;
      var lab = document.createElement('label');
      lab.className = 'theinmag-wsb__session' + (selected === s.key ? ' is-selected' : '') + (full ? ' is-full' : '');
      var leftText = !known
        ? 'Spots available'
        : full
          ? 'Fully booked'
          : c.left + (c.left === 1 ? ' spot left' : ' spots left');
      var leftClass = full ? ' is-full' : (known && c.left <= 5 ? ' is-low' : '');
      lab.innerHTML =
        '<input type="radio" name="wsb-session" value="' + s.key + '"' + (full ? ' disabled' : '') + (selected === s.key ? ' checked' : '') + '>' +
        '<span class="theinmag-wsb__session-time">' + s.time + '</span>' +
        '<span class="theinmag-wsb__session-left' + leftClass + '">' + leftText + '</span>';
      if (!full) {
        lab.addEventListener('click', function () { selected = s.key; renderSessions(); validate(); });
      }
      sessionsEl.appendChild(lab);
    });
  }

  /* ---- Children ---- */
  function addChild(focus) {
    var row = document.createElement('div');
    row.className = 'theinmag-wsb__child-row';
    var input = document.createElement('input');
    input.className = 'theinmag-wsb__in';
    input.type = 'text';
    input.placeholder = "Child's first name";
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', validate);
    var age = document.createElement('input');
    age.className = 'theinmag-wsb__in theinmag-wsb__age';
    age.type = 'text';
    age.inputMode = 'numeric';
    age.placeholder = 'Age';
    age.setAttribute('aria-label', "Child's age");
    age.setAttribute('autocomplete', 'off');
    age.addEventListener('input', validate);
    var rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'theinmag-wsb__child-remove';
    rm.setAttribute('aria-label', 'Remove this child');
    rm.innerHTML = '&times;';
    rm.addEventListener('click', function () { row.remove(); syncRemove(); validate(); });
    row.appendChild(input);
    row.appendChild(age);
    row.appendChild(rm);
    childrenEl.appendChild(row);
    syncRemove();
    if (focus) input.focus();
  }

  function syncRemove() {
    var rows = childrenEl.querySelectorAll('.theinmag-wsb__child-row');
    rows.forEach(function (r) {
      r.querySelector('.theinmag-wsb__child-remove').style.visibility = rows.length > 1 ? 'visible' : 'hidden';
    });
  }

  function childData() {
    return Array.prototype.slice.call(childrenEl.querySelectorAll('.theinmag-wsb__child-row'))
      .map(function (row) {
        var inps = row.querySelectorAll('input');
        return {
          name: ((inps[0] && inps[0].value) || '').trim(),
          age: ((inps[1] && inps[1].value) || '').trim()
        };
      })
      .filter(function (c) { return c.name.length; });
  }

  /* ---- Consent scroll gate ---- */
  function checkScroll() {
    if (scrolledToEnd) return;
    if (consentEl.scrollTop + consentEl.clientHeight >= consentEl.scrollHeight - 8) {
      scrolledToEnd = true;
      tickEl.classList.add('is-unlocked');
      scrollHint.classList.add('is-done');
      scrollHint.textContent = 'Thanks for reading. You can tick to agree now.';
      validate();
    }
  }

  /* ---- Validation ---- */
  function validate() {
    if (errorEl) errorEl.hidden = true;
    var kids = childData();
    var ok = selected &&
      kids.length >= 1 &&
      kids.every(function (c) { return c.name && c.age; }) &&
      pName.value.trim() &&
      EMAIL_RE.test(pEmail.value.trim()) &&
      consentBox.checked;
    submitBtn.disabled = !ok;
  }

  /* ---- Submit ---- */
  function onSubmit(e) {
    e.preventDefault();
    errorEl.hidden = true;
    var kids = childData();
    var payload = {
      session: selected,
      children: kids,
      parent_name: pName.value.trim(),
      parent_email: pEmail.value.trim(),
      parent_phone: pPhone.value.trim(),
      consent: consentBox.checked === true
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';

    fetch(worker + '/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, data: d }; }); })
      .then(function (res) {
        submitBtn.textContent = 'Book my spot';
        var d = res.data || {};
        if (res.status >= 200 && res.status < 300 && d.ok) {
          showSuccess(kids);
          return;
        }
        // Not enough spots, or a validation error. Refresh counts if given.
        if (Array.isArray(d.sessions)) {
          d.sessions.forEach(function (s) { counts[s.key] = { left: s.left, cap: s.cap, booked: s.booked }; });
          renderSessions();
        }
        errorEl.hidden = false;
        errorEl.textContent = d.error || "Sorry, that didn't go through. Please try again.";
        submitBtn.disabled = false;
      })
      .catch(function () {
        submitBtn.textContent = 'Book my spot';
        errorEl.hidden = false;
        errorEl.textContent = "Sorry, that didn't go through. Please check your connection and try again.";
        submitBtn.disabled = false;
      });
  }

  function showSuccess(kids) {
    var sess = SESSIONS.filter(function (s) { return s.key === selected; })[0];
    formEl.hidden = true;
    successEl.hidden = false;
    recapEl.innerHTML = '<b>' + (sess ? sess.time : '') + ' session</b><br>' +
      kids.length + ' ' + (kids.length === 1 ? 'child' : 'children') + ': ' +
      kids.map(function (c) { return c.name + ' (' + c.age + ')'; }).join(', ');
    var card = document.getElementById('theinmag-wsb-book');
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- Wire up ---- */
  loadAvailability();
  addChild(false);
  $('[data-wsb-add]').addEventListener('click', function () { addChild(true); });
  consentEl.addEventListener('scroll', checkScroll);
  consentBox.addEventListener('change', validate);
  [pName, pEmail, pPhone].forEach(function (el) { el.addEventListener('input', validate); });
  formEl.addEventListener('submit', onSubmit);
  setTimeout(checkScroll, 200);
})();

/* "How the morning runs" carousel: arrows + dots + swipe, kept in sync. */
(function () {
  'use strict';
  var car = document.querySelector('[data-wsb-carousel]');
  if (!car) return;
  var track = car.querySelector('[data-wsb-track]');
  if (!track) return;
  var slides = track.children;
  var n = slides.length;
  if (!n) return;
  var prev = car.querySelector('[data-wsb-prev]');
  var next = car.querySelector('[data-wsb-next]');
  var dotsWrap = car.querySelector('[data-wsb-dots]');
  var i = 0;
  var dots = [];

  if (dotsWrap) {
    for (var k = 0; k < n; k++) {
      (function (idx) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'theinmag-wsb__car-dot' + (idx === 0 ? ' is-active' : '');
        d.setAttribute('aria-label', 'Go to step ' + (idx + 1));
        d.addEventListener('click', function () { go(idx); });
        dotsWrap.appendChild(d);
        dots.push(d);
      })(k);
    }
  }

  function go(idx) {
    i = Math.max(0, Math.min(n - 1, idx));
    var s = slides[i];
    var sRect = s.getBoundingClientRect();
    var tRect = track.getBoundingClientRect();
    track.scrollBy({ left: (sRect.left + sRect.width / 2) - (tRect.left + tRect.width / 2), behavior: 'smooth' });
    update();
  }
  function update() {
    for (var k = 0; k < dots.length; k++) dots[k].classList.toggle('is-active', k === i);
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === n - 1;
  }
  if (prev) prev.addEventListener('click', function () { go(i - 1); });
  if (next) next.addEventListener('click', function () { go(i + 1); });

  var t;
  track.addEventListener('scroll', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var tRect = track.getBoundingClientRect();
      var center = tRect.left + tRect.width / 2;
      var best = 0, bestDist = Infinity;
      for (var k = 0; k < n; k++) {
        var r = slides[k].getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - center);
        if (d < bestDist) { bestDist = d; best = k; }
      }
      if (best !== i) { i = best; update(); }
    }, 90);
  }, { passive: true });

  update();
})();

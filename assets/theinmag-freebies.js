/* ================================================================
   theinmag-freebies.js
   Page-wide JS for /pages/freebies. Loaded once from the banner section.

   Subsystems (all vanilla, no framework, state lives in the DOM):
     1. Order     - seeded shuffle of the rendered cards. Seed is held in
                    sessionStorage so a refresh keeps the same order, a new
                    visitor / new day gets a fresh one, and the SHUFFLE
                    button regenerates it. Featured cards float to the top.
     2. Filter    - category + mag dropdowns + debounced search apply
                    client-side over the rendered DOM via data-* attrs.
                    Filter state is mirrored into the URL (?category&mag&q)
                    so a filtered view is shareable.
     3. Paginate  - "Load more" reveals the next batch. No infinite scroll.
                    A live filter/search reveals all matches and hides the
                    button; clearing it restores the paginated view.
     4. Lightbox  - tap / Enter opens the modal from the card's data-* attrs.
                    Manages focus trap, Esc / backdrop close, ?id= history
                    state (shareable + back-button closes + deep-link opens),
                    download, and Web Share API.
   No em dashes anywhere - hyphens only.
   ================================================================ */
(function () {
  'use strict';

  if (typeof document === 'undefined') return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SEED_KEY = 'theinmag-freebies-seed';
  var SHARE_TEXT = 'Free creative idea from theINmag - made by Aussie kids 🎨';

  function slice(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  /* ---------- seeded RNG ---------- */

  function makeSeed() {
    var d = new Date();
    var day = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return (day ^ Math.floor(Math.random() * 1e9)) >>> 0;
  }

  function getSeed(reset) {
    try {
      if (!reset) {
        var existing = sessionStorage.getItem(SEED_KEY);
        if (existing !== null) return parseInt(existing, 10) >>> 0;
      }
      var seed = makeSeed();
      sessionStorage.setItem(SEED_KEY, seed);
      return seed;
    } catch (e) {
      return makeSeed();
    }
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function orderCards(cards, seed) {
    var rng = mulberry32(seed);
    var a = cards.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    var featured = [];
    var rest = [];
    a.forEach(function (c) {
      if (c.getAttribute('data-featured') === 'true') featured.push(c);
      else rest.push(c);
    });
    return featured.concat(rest);
  }

  /* ================================================================
     App
     ================================================================ */

  var App = {
    grid: null,
    columns: null,
    cards: [],
    order: [],
    moreBtn: null,
    noResults: null,
    liveRegion: null,
    initialBatch: 18,
    batchSize: 18,
    revealed: 18,
    filter: { category: 'all', mag: 'all', q: '' },

    init: function () {
      this.grid = document.querySelector('[data-theinmag-freebies-grid]');
      if (!this.grid) return;

      this.columns = this.grid.querySelector('[data-theinmag-freebies-columns]');
      this.cards = slice(this.grid.querySelectorAll('[data-theinmag-freebie-card]'));
      this.moreBtn = this.grid.querySelector('[data-theinmag-freebies-more]');
      this.noResults = this.grid.querySelector('[data-theinmag-freebies-no-results]');
      this.liveRegion = this.grid.querySelector('[data-theinmag-freebies-live]');

      this.initialBatch = parseInt(this.grid.getAttribute('data-initial-batch'), 10) || 18;
      this.batchSize = parseInt(this.grid.getAttribute('data-batch-size'), 10) || 18;
      this.revealed = this.initialBatch;

      // Seed + initial shuffle.
      if (this.cards.length && this.columns) {
        this.order = orderCards(this.cards, getSeed(false));
        this.applyDOMOrder();
      } else {
        this.order = this.cards.slice();
      }

      this.bindControls();
      this.readFilterFromURL();
      this.render();

      Lightbox.init(this);
    },

    applyDOMOrder: function () {
      var cols = this.columns;
      this.order.forEach(function (card) { cols.appendChild(card); });
    },

    bindControls: function () {
      var self = this;

      var categorySel = document.querySelector('[data-theinmag-freebies-category]');
      if (categorySel) {
        categorySel.addEventListener('change', function () {
          self.filter.category = categorySel.value || 'all';
          self.revealed = self.initialBatch;
          self.render();
          self.writeFilterToURL();
        });
      }

      var magSel = document.querySelector('[data-theinmag-freebies-mag]');
      if (magSel) {
        magSel.addEventListener('change', function () {
          self.filter.mag = magSel.value || 'all';
          self.revealed = self.initialBatch;
          self.render();
          self.writeFilterToURL();
        });
      }

      var searchInput = document.querySelector('[data-theinmag-freebies-search]');
      var searchBtn = document.querySelector('[data-theinmag-freebies-search-btn]');
      var searchTimer = null;
      var runSearch = function () {
        self.filter.q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        self.revealed = self.initialBatch;
        self.render();
        self.writeFilterToURL();
      };
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          clearTimeout(searchTimer);
          searchTimer = setTimeout(runSearch, 300);
        });
        searchInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); clearTimeout(searchTimer); runSearch(); }
        });
      }
      if (searchBtn) {
        searchBtn.addEventListener('click', function () { clearTimeout(searchTimer); runSearch(); });
      }

      var shuffleBtn = document.querySelector('[data-theinmag-freebies-shuffle]');
      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function () {
          if (!self.cards.length || !self.columns) return;
          self.order = orderCards(self.cards, getSeed(true));
          self.applyDOMOrder();
          self.revealed = self.initialBatch;
          self.render();
        });
      }

      if (this.moreBtn) {
        this.moreBtn.addEventListener('click', function () {
          self.revealed = Math.min(self.revealed + self.batchSize, self.order.length);
          self.render();
        });
      }
    },

    isFiltering: function () {
      return this.filter.category !== 'all' || this.filter.mag !== 'all' || this.filter.q !== '';
    },

    render: function () {
      var f = this.filter;
      var filtering = this.isFiltering();
      var count = 0;

      if (filtering) {
        this.order.forEach(function (card) {
          var ok = true;
          if (f.category !== 'all' && card.getAttribute('data-category') !== f.category) ok = false;
          if (ok && f.mag !== 'all' && card.getAttribute('data-mag') !== f.mag) ok = false;
          if (ok && f.q) {
            var hay = card.getAttribute('data-search') || '';
            if (hay.indexOf(f.q) === -1) ok = false;
          }
          card.classList.remove('theinmag-freebie-card--hidden');
          card.classList.toggle('theinmag-freebie-card--filtered-out', !ok);
          if (ok) count++;
        });
        if (this.moreBtn) this.moreBtn.hidden = true;
      } else {
        var revealed = this.revealed;
        this.order.forEach(function (card, i) {
          card.classList.remove('theinmag-freebie-card--filtered-out');
          card.classList.toggle('theinmag-freebie-card--hidden', i >= revealed);
        });
        count = Math.min(revealed, this.order.length);
        if (this.moreBtn) this.moreBtn.hidden = revealed >= this.order.length;
      }

      if (this.noResults) {
        this.noResults.classList.toggle('is-visible', filtering && count === 0);
      }
      if (this.liveRegion) {
        this.liveRegion.textContent = count + ' freebie' + (count === 1 ? '' : 's') + ' showing.';
      }
    },

    setCategory: function (slug) {
      this.filter.category = slug || 'all';
      var sel = document.querySelector('[data-theinmag-freebies-category]');
      if (sel) sel.value = this.filter.category;
      this.revealed = this.initialBatch;
      this.render();
      this.writeFilterToURL();
      if (this.grid && this.grid.scrollIntoView) {
        this.grid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    },

    currentParams: function () {
      var params = new URLSearchParams();
      if (this.filter.category !== 'all') params.set('category', this.filter.category);
      if (this.filter.mag !== 'all') params.set('mag', this.filter.mag);
      if (this.filter.q) params.set('q', this.filter.q);
      return params;
    },

    writeFilterToURL: function () {
      var params = this.currentParams();
      if (Lightbox.openId) params.set('id', Lightbox.openId);
      var qs = params.toString();
      history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : ''));
    },

    readFilterFromURL: function () {
      var params = new URLSearchParams(location.search);
      var cat = params.get('category');
      var mag = params.get('mag');
      var q = params.get('q');

      if (cat) {
        this.filter.category = cat;
        var sel = document.querySelector('[data-theinmag-freebies-category]');
        if (sel) sel.value = cat;
      }
      if (mag) {
        this.filter.mag = mag;
        var msel = document.querySelector('[data-theinmag-freebies-mag]');
        if (msel) msel.value = mag;
      }
      if (q) {
        this.filter.q = q.toLowerCase();
        var input = document.querySelector('[data-theinmag-freebies-search]');
        if (input) input.value = q;
      }
    },

    cardByHandle: function (handle) {
      for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i].getAttribute('data-handle') === handle) return this.cards[i];
      }
      return null;
    }
  };

  /* ================================================================
     Lightbox
     ================================================================ */

  var Lightbox = {
    app: null,
    root: null,
    panel: null,
    image: null,
    titleEl: null,
    magEl: null,
    creatorEl: null,
    writeupEl: null,
    categoryPill: null,
    audienceWrap: null,
    downloadBtn: null,
    shareBtn: null,
    moreBtn: null,
    shareFeedback: null,
    closeBtn: null,
    backdrop: null,
    pagesBadge: null,
    openId: null,
    pushed: false,
    lastFocused: null,
    currentCard: null,

    init: function (app) {
      this.app = app;
      this.root = document.querySelector('[data-theinmag-freebies-lightbox]');
      if (!this.root) return;

      this.panel = this.root.querySelector('.theinmag-freebies-lightbox__panel');
      this.image = this.root.querySelector('[data-theinmag-freebies-lightbox-image]');
      this.titleEl = this.root.querySelector('[data-theinmag-freebies-lightbox-title]');
      this.magEl = this.root.querySelector('[data-theinmag-freebies-lightbox-mag]');
      this.creatorEl = this.root.querySelector('[data-theinmag-freebies-lightbox-creator]');
      this.writeupEl = this.root.querySelector('[data-theinmag-freebies-lightbox-writeup]');
      this.categoryPill = this.root.querySelector('[data-theinmag-freebies-lightbox-category]');
      this.audienceWrap = this.root.querySelector('[data-theinmag-freebies-lightbox-audience]');
      this.downloadBtn = this.root.querySelector('[data-theinmag-freebies-lightbox-download]');
      this.shareBtn = this.root.querySelector('[data-theinmag-freebies-lightbox-share]');
      this.moreBtn = this.root.querySelector('[data-theinmag-freebies-lightbox-more]');
      this.shareFeedback = this.root.querySelector('[data-theinmag-freebies-lightbox-share-feedback]');
      this.closeBtn = this.root.querySelector('[data-theinmag-freebies-lightbox-close]');
      this.backdrop = this.root.querySelector('[data-theinmag-freebies-lightbox-backdrop]');
      this.pagesBadge = this.root.querySelector('[data-theinmag-freebies-lightbox-pages]');

      var self = this;

      app.cards.forEach(function (card) {
        card.addEventListener('click', function () { self.open(card, true); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.open(card, true); }
        });
      });

      this.closeBtn && this.closeBtn.addEventListener('click', function () { self.userClose(); });
      this.backdrop && this.backdrop.addEventListener('click', function () { self.userClose(); });

      document.addEventListener('keydown', function (e) {
        if (self.root.hasAttribute('hidden')) return;
        if (e.key === 'Escape') { self.userClose(); }
        else if (e.key === 'Tab') { self.trapFocus(e); }
      });

      this.shareBtn && this.shareBtn.addEventListener('click', function () { self.share(); });
      this.moreBtn && this.moreBtn.addEventListener('click', function () {
        if (!self.currentCard) return;
        var slug = self.currentCard.getAttribute('data-category') || 'all';
        self.userClose();
        self.app.setCategory(slug);
      });

      window.addEventListener('popstate', function () {
        var id = new URLSearchParams(location.search).get('id');
        if (id) {
          var card = self.app.cardByHandle(id);
          if (card && self.openId !== id) self.open(card, false);
        } else if (self.openId) {
          self.close();
        }
      });

      // Deep link - open the modal if the page loaded with ?id=handle.
      var deepId = new URLSearchParams(location.search).get('id');
      if (deepId) {
        var deepCard = app.cardByHandle(deepId);
        if (deepCard) this.open(deepCard, false);
      }
    },

    open: function (card, push) {
      this.currentCard = card;
      var handle = card.getAttribute('data-handle') || '';
      this.openId = handle;

      var title = card.getAttribute('data-title') || '';
      var alt = card.getAttribute('data-image-alt') || title;
      var preview = card.getAttribute('data-preview-url') || '';
      var magLabel = card.getAttribute('data-mag-label') || '';
      var kidAttr = card.getAttribute('data-kid-attr') || '';
      var categoryLabel = card.getAttribute('data-category-label') || '';
      var audience = card.getAttribute('data-audience') || '';
      var downloadUrl = card.getAttribute('data-download-url') || '';
      var downloadName = card.getAttribute('data-download-name') || '';
      var pdfPages = parseInt(card.getAttribute('data-pdf-pages'), 10) || 0;
      var longEl = card.querySelector('[data-freebie-long]');

      if (this.image) { this.image.src = preview; this.image.alt = alt; }
      if (this.titleEl) this.titleEl.textContent = title;

      if (this.magEl) {
        if (magLabel) { this.magEl.textContent = 'From ' + magLabel; this.magEl.hidden = false; }
        else this.magEl.hidden = true;
      }
      if (this.creatorEl) {
        if (kidAttr) { this.creatorEl.textContent = kidAttr; this.creatorEl.hidden = false; }
        else this.creatorEl.hidden = true;
      }
      if (this.writeupEl) this.writeupEl.innerHTML = longEl ? longEl.innerHTML : '';

      if (this.categoryPill) {
        if (categoryLabel) { this.categoryPill.textContent = categoryLabel; this.categoryPill.hidden = false; }
        else this.categoryPill.hidden = true;
      }
      if (this.audienceWrap) {
        this.audienceWrap.innerHTML = '';
        audience.split(',').forEach(function (tag) {
          tag = tag.trim();
          if (!tag) return;
          var span = document.createElement('span');
          span.className = 'theinmag-freebies-lightbox__pill theinmag-freebies-lightbox__pill--audience';
          span.textContent = 'For ' + tag;
          this.audienceWrap.appendChild(span);
        }, this);
      }

      if (this.pagesBadge) {
        if (pdfPages > 1) { this.pagesBadge.textContent = pdfPages + ' pages'; this.pagesBadge.hidden = false; }
        else this.pagesBadge.hidden = true;
      }

      if (this.downloadBtn) {
        this.downloadBtn.setAttribute('href', downloadUrl);
        if (downloadName) this.downloadBtn.setAttribute('download', downloadName);
      }

      if (this.moreBtn) {
        this.moreBtn.hidden = !categoryLabel;
        if (categoryLabel) this.moreBtn.textContent = 'See more in ' + categoryLabel + ' →';
      }
      if (this.shareFeedback) this.shareFeedback.hidden = true;

      this.lastFocused = document.activeElement;
      this.root.hidden = false;
      this.root.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (this.panel) this.panel.scrollTop = 0;
      this.closeBtn && this.closeBtn.focus();

      if (push) {
        var params = this.app.currentParams();
        params.set('id', handle);
        history.pushState({ fbId: handle }, '', location.pathname + '?' + params.toString());
        this.pushed = true;
      } else {
        this.pushed = false;
      }
    },

    userClose: function () {
      if (this.pushed) { history.back(); }
      else {
        this.close();
        var params = this.app.currentParams();
        var qs = params.toString();
        history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : ''));
      }
    },

    close: function () {
      if (!this.root) return;
      this.openId = null;
      this.pushed = false;
      this.currentCard = null;
      this.root.hidden = true;
      this.root.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (this.lastFocused && this.lastFocused.focus) this.lastFocused.focus();
    },

    share: function () {
      var url = location.origin + location.pathname + '?id=' + encodeURIComponent(this.openId || '');
      var title = this.titleEl ? this.titleEl.textContent : 'theINmag freebie';
      var self = this;
      if (navigator.share) {
        navigator.share({ title: title, text: SHARE_TEXT, url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_TEXT + ' ' + url).then(function () { self.flashShared(); }, function () {});
      } else {
        window.prompt('Copy this link', url);
      }
    },

    flashShared: function () {
      if (!this.shareFeedback) return;
      this.shareFeedback.textContent = 'Link copied. Go share the goodness.';
      this.shareFeedback.hidden = false;
    },

    trapFocus: function (e) {
      var focusable = this.panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      var visible = slice(focusable).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
      if (!visible.length) return;
      var first = visible[0];
      var last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  function init() { App.init(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

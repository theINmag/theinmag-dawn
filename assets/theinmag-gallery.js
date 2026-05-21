/* ================================================================
   theinmag-gallery.js
   Page-wide JS for /pages/gallery. Loaded once from the hero section.

   Three subsystems:
     1. LazyLoad   - IntersectionObserver reveals --hidden cards in
                     batches as the sentinel enters the viewport.
     2. Filter     - chips + sort + 300ms-debounced search apply
                     client-side over the rendered DOM via data-* attrs.
                     No fetch, no extra round-trips.
     3. Lightbox   - card tap or Enter populates the modal from the
                     tapped card's data-* attrs, handles multi-page
                     carousel + keyboard + swipe + cross-links.

   All state lives in the DOM. No global state object, no framework.
   ================================================================ */
(function () {
  'use strict';

  if (typeof document === 'undefined') return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var gridSection = document.querySelector('[data-theinmag-gallery-grid]');
    if (!gridSection) return;

    var cards = Array.prototype.slice.call(
      gridSection.querySelectorAll('[data-theinmag-gallery-card]')
    );

    var initialBatch = parseInt(gridSection.getAttribute('data-initial-batch'), 10) || 24;
    var batchSize = parseInt(gridSection.getAttribute('data-batch-size'), 10) || 24;

    cards = sortCardsNewestFirst(gridSection, cards, initialBatch);

    LazyLoad.init(gridSection, cards, initialBatch, batchSize);
    Filter.init(gridSection, cards);
    Lightbox.init(cards);
    PlaceholderRotator.init();
  }

  /* ---------- Newest-first ordering ----------
     Server-side metaobject sort (Liquid `sort` by a field key) returns an empty
     list, so order here by each card's data-submitted-at (ISO string, lexical
     sort == chronological). Re-append cards in date order via one fragment
     (single reflow) and reset the lazy-load hidden flags so the first batch
     shown is the newest. */
  function sortCardsNewestFirst(gridSection, cards, initialBatch) {
    var columns = gridSection.querySelector('[data-theinmag-gallery-columns]');
    if (!columns || cards.length < 2) return cards;
    var sorted = cards.slice().sort(function (a, b) {
      var da = a.getAttribute('data-submitted-at') || '';
      var db = b.getAttribute('data-submitted-at') || '';
      if (da === db) return 0;
      return da < db ? 1 : -1;
    });
    var frag = document.createDocumentFragment();
    sorted.forEach(function (card, i) {
      if (i < initialBatch) card.classList.remove('theinmag-gallery-card--hidden');
      else card.classList.add('theinmag-gallery-card--hidden');
      frag.appendChild(card);
    });
    columns.appendChild(frag);
    return sorted;
  }

  /* ---------- LazyLoad ---------- */

  var LazyLoad = {
    init: function (gridSection, cards, initialBatch, batchSize) {
      var sentinel = gridSection.querySelector('[data-theinmag-gallery-sentinel]');
      if (!sentinel || cards.length <= initialBatch) return;

      var revealed = initialBatch;
      var total = cards.length;

      if (!('IntersectionObserver' in window)) {
        // Fallback - reveal everything immediately
        for (var i = revealed; i < total; i++) {
          cards[i].classList.remove('theinmag-gallery-card--hidden');
        }
        sentinel.parentNode && sentinel.parentNode.removeChild(sentinel);
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var end = Math.min(revealed + batchSize, total);
          for (var i = revealed; i < end; i++) {
            cards[i].classList.remove('theinmag-gallery-card--hidden');
          }
          revealed = end;
          if (revealed >= total) {
            observer.disconnect();
            sentinel.parentNode && sentinel.parentNode.removeChild(sentinel);
          }
        });
      }, { rootMargin: '600px 0px' });

      observer.observe(sentinel);
    }
  };

  /* ---------- Filter ---------- */

  var Filter = {
    state: { category: 'all', query: '' },
    cards: [],
    gridSection: null,
    columnsEl: null,
    noResultsEl: null,
    liveEl: null,
    searchTimer: null,

    init: function (gridSection, cards) {
      this.gridSection = gridSection;
      this.cards = cards;
      this.columnsEl = gridSection.querySelector('[data-theinmag-gallery-columns]');
      this.noResultsEl = gridSection.querySelector('[data-theinmag-gallery-no-results]');
      this.liveEl = gridSection.querySelector('[data-theinmag-gallery-live]');

      this.bindCategorySelect();
      this.bindSearch();
    },

    bindCategorySelect: function () {
      var self = this;
      var sel = document.querySelector('[data-theinmag-gallery-category]');
      if (!sel) return;
      sel.addEventListener('change', function () {
        self.state.category = sel.value;
        self.apply();
      });
    },

    bindSearch: function () {
      var self = this;
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (!input) return;
      input.addEventListener('input', function () {
        clearTimeout(self.searchTimer);
        self.searchTimer = setTimeout(function () {
          self.state.query = (input.value || '').trim().toLowerCase();
          self.apply();
        }, 300);
      });
    },

    apply: function () {
      var q = this.state.query;
      var cat = this.state.category;
      var matchCount = 0;
      this.cards.forEach(function (card) {
        var match = true;
        if (cat !== 'all') {
          if (card.getAttribute('data-category') !== cat) match = false;
        }
        if (match && q) {
          var hay = [
            card.getAttribute('data-first-name') || '',
            card.getAttribute('data-last-initial') || '',
            card.getAttribute('data-town') || '',
            card.getAttribute('data-state') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-age') || ''
          ].join(' ');
          if (hay.indexOf(q) === -1) match = false;
        }
        card.classList.toggle('theinmag-gallery-card--filtered-out', !match);
        // When a filter or search is active, reveal cards past the lazy-load
        // threshold too - otherwise a name search would silently miss any
        // match that hasn't been scroll-revealed yet.
        if (q || cat !== 'all') {
          card.classList.remove('theinmag-gallery-card--hidden');
        }
        if (match) matchCount++;
      });

      if (this.noResultsEl) {
        var showEmpty = matchCount === 0 && (q !== '' || cat !== 'all');
        this.noResultsEl.classList.toggle('is-visible', showEmpty);
        this.noResultsEl.classList.toggle('visually-hidden', !showEmpty);
      }

      if (this.liveEl) {
        this.liveEl.textContent = matchCount + ' creation' + (matchCount === 1 ? '' : 's') + ' showing.';
      }
    },

    setSearchAndFilter: function (query, category) {
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (input) input.value = query || '';
      this.state.query = (query || '').toLowerCase();

      var sel = document.querySelector('[data-theinmag-gallery-category]');
      if (sel) sel.value = category || 'all';
      this.state.category = category || 'all';

      this.apply();
      // Scroll the grid into view so the kid sees the filter result.
      if (this.gridSection && this.gridSection.scrollIntoView) {
        this.gridSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }
  };

  /* ---------- Lightbox ---------- */

  var Lightbox = {
    root: null,
    panel: null,
    image: null,
    counter: null,
    prevBtn: null,
    nextBtn: null,
    attributionEl: null,
    writeupEl: null,
    townBtn: null,
    ageBtn: null,
    closeBtn: null,
    backdrop: null,
    townTpl: '',
    ageTpl: '',
    currentImages: [],
    currentIdx: 0,
    currentCard: null,
    lastFocused: null,
    touchStartX: null,

    init: function (cards) {
      this.root = document.querySelector('[data-theinmag-gallery-lightbox]');
      if (!this.root) return;
      // Re-parent the modal to <body> so no theme section wrapper (which may
      // create a stacking/containing-block context via transform, filter, or
      // background-attachment: fixed on a sibling) can trap the fixed overlay
      // and let grid cards show through the backdrop. Child refs survive a move.
      if (this.root.parentNode !== document.body) document.body.appendChild(this.root);
      this.panel = this.root.querySelector('.theinmag-gallery-lightbox__panel');
      this.media = this.root.querySelector('[data-theinmag-gallery-lightbox-media]');
      this.image = this.root.querySelector('[data-theinmag-gallery-lightbox-image]');
      this.counter = this.root.querySelector('[data-theinmag-gallery-lightbox-counter]');
      this.prevBtn = this.root.querySelector('[data-theinmag-gallery-lightbox-prev]');
      this.nextBtn = this.root.querySelector('[data-theinmag-gallery-lightbox-next]');
      this.attributionEl = this.root.querySelector('[data-theinmag-gallery-lightbox-attribution]');
      this.writeupEl = this.root.querySelector('[data-theinmag-gallery-lightbox-writeup]');
      this.townBtn = this.root.querySelector('[data-theinmag-gallery-lightbox-town]');
      this.ageBtn = this.root.querySelector('[data-theinmag-gallery-lightbox-age]');
      this.closeBtn = this.root.querySelector('[data-theinmag-gallery-lightbox-close]');
      this.backdrop = this.root.querySelector('[data-theinmag-gallery-lightbox-backdrop]');
      this.townTpl = this.root.getAttribute('data-town-template') || 'More from kids in [town]';
      this.ageTpl = this.root.getAttribute('data-age-template') || 'More from kids age [age]';

      var self = this;
      cards.forEach(function (card) {
        card.addEventListener('click', function () { self.open(card); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            self.open(card);
          }
        });
      });

      this.closeBtn && this.closeBtn.addEventListener('click', function () { self.close(); });
      this.backdrop && this.backdrop.addEventListener('click', function () { self.close(); });
      this.prevBtn && this.prevBtn.addEventListener('click', function () { self.go(-1); });
      this.nextBtn && this.nextBtn.addEventListener('click', function () { self.go(1); });

      document.addEventListener('keydown', function (e) {
        if (self.root.hasAttribute('hidden')) return;
        if (e.key === 'Escape') self.close();
        else if (e.key === 'ArrowLeft') self.go(-1);
        else if (e.key === 'ArrowRight') self.go(1);
      });

      // Swipe gestures
      this.image && this.image.parentNode && this.image.parentNode.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches.length) self.touchStartX = e.touches[0].clientX;
      }, { passive: true });
      this.image && this.image.parentNode && this.image.parentNode.addEventListener('touchend', function (e) {
        if (self.touchStartX == null) return;
        var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
        if (endX != null) {
          var delta = endX - self.touchStartX;
          if (Math.abs(delta) > 40) self.go(delta < 0 ? 1 : -1);
        }
        self.touchStartX = null;
      });

      // Town / age cross-link buttons - filter grid + close
      this.townBtn && this.townBtn.addEventListener('click', function () {
        if (!self.currentCard) return;
        var town = self.currentCard.getAttribute('data-town') || '';
        Filter.setSearchAndFilter(town, 'all');
        self.close();
      });
      this.ageBtn && this.ageBtn.addEventListener('click', function () {
        if (!self.currentCard) return;
        var age = self.currentCard.getAttribute('data-age') || '';
        Filter.setSearchAndFilter(age, 'all');
        self.close();
      });
    },

    open: function (card) {
      this.currentCard = card;
      var imagesStr = card.getAttribute('data-image-urls') || '';
      this.currentImages = imagesStr ? imagesStr.split('|||').filter(Boolean) : [];
      this.currentIdx = 0;

      this.attributionEl.textContent = card.getAttribute('data-attribution') || '';
      this.writeupEl.textContent = card.getAttribute('data-write-up') || '';

      var town = card.getAttribute('data-town') || '';
      var age = card.getAttribute('data-age') || '';
      if (town && this.townBtn) {
        this.townBtn.textContent = this.townTpl.replace('[town]', this.titleCase(town));
        this.townBtn.hidden = false;
      } else if (this.townBtn) {
        this.townBtn.hidden = true;
      }
      if (age && this.ageBtn) {
        this.ageBtn.textContent = this.ageTpl.replace('[age]', age);
        this.ageBtn.hidden = false;
      } else if (this.ageBtn) {
        this.ageBtn.hidden = true;
      }

      this.render();

      this.lastFocused = document.activeElement;
      this.root.hidden = false;
      this.root.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('theinmag-gallery-lightbox-open');
      this.closeBtn && this.closeBtn.focus();
    },

    close: function () {
      if (!this.root) return;
      this.root.hidden = true;
      this.root.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.body.classList.remove('theinmag-gallery-lightbox-open');
      if (this.lastFocused && this.lastFocused.focus) this.lastFocused.focus();
    },

    go: function (delta) {
      if (this.currentImages.length <= 1) return;
      this.currentIdx = (this.currentIdx + delta + this.currentImages.length) % this.currentImages.length;
      this.render();
    },

    render: function () {
      if (!this.currentImages.length) {
        this.image.removeAttribute('src');
        this.image.alt = '';
        if (this.media) { this.media.style.backgroundImage = ''; this.media.classList.remove('is-loading'); }
        this.prevBtn && (this.prevBtn.hidden = true);
        this.nextBtn && (this.nextBtn.hidden = true);
        this.counter && (this.counter.hidden = true);
        return;
      }

      var self = this;
      var url = this.currentImages[this.currentIdx];
      // Instant placeholder: the grid cover thumb (~800px) is already cached, so
      // show it immediately behind the full image, which fades in once loaded.
      // Only the first image has a matching cached cover; later pages just show
      // the loading state.
      var cover = this.currentCard ? this.currentCard.getAttribute('data-cover-url') : '';
      if (this.media) {
        this.media.style.backgroundImage = (this.currentIdx === 0 && cover) ? 'url("' + cover + '")' : '';
        this.media.classList.add('is-loading');
      }
      this.image.classList.remove('is-loaded');
      this.image.alt = this.currentCard ? (this.currentCard.querySelector('img') || {}).alt || '' : '';
      this.image.onload = function () {
        self.image.classList.add('is-loaded');
        if (self.media) self.media.classList.remove('is-loading');
      };
      this.image.onerror = function () {
        if (self.media) self.media.classList.remove('is-loading');
      };
      this.image.src = url;
      // Cached images may already be complete - fire the loaded state now.
      if (this.image.complete && this.image.naturalWidth) {
        this.image.classList.add('is-loaded');
        if (this.media) this.media.classList.remove('is-loading');
      }

      var multi = this.currentImages.length > 1;
      this.prevBtn && (this.prevBtn.hidden = !multi);
      this.nextBtn && (this.nextBtn.hidden = !multi);
      if (this.counter) {
        if (multi) {
          this.counter.hidden = false;
          this.counter.textContent = (this.currentIdx + 1) + ' of ' + this.currentImages.length;
        } else {
          this.counter.hidden = true;
        }
      }
    },

    titleCase: function (s) {
      return (s || '').replace(/\w\S*/g, function (t) {
        return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
      });
    }
  };

  /* ---------- Search placeholder rotator ---------- */

  var PlaceholderRotator = {
    init: function () {
      var bar = document.querySelector('[data-theinmag-gallery-filter-bar]');
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (!bar || !input) return;
      var raw = bar.getAttribute('data-placeholders') || '';
      var list = raw.split('|||').filter(Boolean);
      if (list.length <= 1) return;
      var i = 0;
      setInterval(function () {
        if (document.activeElement === input || input.value) return;
        i = (i + 1) % list.length;
        input.placeholder = list[i];
      }, 3200);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

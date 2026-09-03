/* ================================================================
   theinmag-gallery.js
   Page-wide JS for /pages/gallery. Loaded once from the hero section.

   Data source: client-side, because Shopify's Liquid only exposes ~50
   metaobjects to a page. The grid carries an ordered list of sources:
     1. data-gallery-json          -> the live ANCHOR Worker feed
                                      (theinmag-gallery-review, edge-cached ~1h;
                                      always current, no manual rebuild).
     2. data-gallery-json-fallback -> the static assets/gallery-data.json
                                      snapshot (last good copy).
   It renders from the first that responds: ALL published creations, newest-first,
   with infinite scroll + instant search. If both fail it falls back to the
   server-rendered cards (the capped ~50) so the page is never blank.

   Subsystems:
     1. JsonGallery - fetch snapshot, render cards in batches on scroll,
                      client-side category + search filter over the full set.
     2. Fallback    - the original lazy-load + filter over server-rendered cards.
     3. Lightbox    - delegated card open -> modal with multi-page carousel,
                      keyboard, swipe, cross-links. Works for both render paths.
     4. PlaceholderRotator - rotating search placeholder.
   ================================================================ */
(function () {
  'use strict';

  if (typeof document === 'undefined') return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function sized(url, w) {
    if (!url) return '';
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'width=' + w;
  }

  function titleCase(s) {
    return (s || '').replace(/\w\S*/g, function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
  }

  function hideLoader(section) {
    var l = section.querySelector('[data-theinmag-gallery-loader]');
    if (!l) return;
    l.classList.add('is-done');
    // Bulletproof: hide inline too, so a missing/last .is-done CSS rule can
    // never leave the loader stuck over the grid.
    l.style.display = 'none';
  }

  function init() {
    var gridSection = document.querySelector('[data-theinmag-gallery-grid]');
    if (!gridSection) return;

    Lightbox.init(gridSection);
    PlaceholderRotator.init();

    // Safety net: never leave the loading screen up forever.
    setTimeout(function () { hideLoader(gridSection); }, 6000);

    // Try data sources in order: the live Worker feed first (always current),
    // then the static asset snapshot (last good copy), then the server-rendered
    // cards (the Liquid ~50 cap). Each step degrades gracefully so the gallery
    // is never blank even if the Worker is unreachable.
    var sources = [
      gridSection.getAttribute('data-gallery-json'),
      gridSection.getAttribute('data-gallery-json-fallback'),
    ].filter(Boolean);

    function tryLoad(i) {
      if (i >= sources.length) {
        console.warn('[gallery] all snapshots failed - showing server cards only');
        Fallback.init(gridSection);
        hideLoader(gridSection);
        return;
      }
      fetch(sources[i], { credentials: 'omit' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (data) {
          var list = (data && data.creations) || [];
          if (!list.length) throw new Error('empty snapshot');
          console.log('[gallery] loaded snapshot:', list.length, 'creations from', sources[i]);
          JsonGallery.init(gridSection, list);
        })
        .catch(function (err) {
          console.warn('[gallery] source failed (' + (err && err.message) + '):', sources[i]);
          tryLoad(i + 1);
        });
    }

    if (sources.length) tryLoad(0);
    else { Fallback.init(gridSection); hideLoader(gridSection); }
  }

  /* ---------- JsonGallery (primary) ---------- */

  var JsonGallery = {
    section: null,
    columns: null,
    cols: [],
    colCount: 0,
    sentinel: null,
    noResultsEl: null,
    liveEl: null,
    emptyEl: null,
    all: [],
    // THE ARCHIVE: every published creation OLDER than the feed's rolling 90-day
    // window (added 2026-09-04 on Ryan's call). It is NOT part of the default
    // browse view and is never fetched on page load. It loads lazily the first
    // time someone actually searches, and only then joins the search pool.
    //
    // WHY IT EXISTS: measured 2026-09-04, 2,790 creations are published but the
    // feed carries 1,226, and this search only ever filtered what was loaded. So a
    // kid published more than ~90 days ago could not find themselves by typing
    // their name. That is about 1,564 kids who were told they were published. The
    // standing rule is that kids must be able to find their own creations, so
    // search now reaches all of them.
    //
    // WHY LAZY, AND WHY NOT JUST WIDEN THE FEED: the window is what stops this page
    // building 2,790 cards on a phone, which is the class of bug that crashed iOS
    // Safari in July 2026. Loading the archive on page load would reintroduce that
    // weight for every visitor, and most visitors never search. Fetching it on the
    // first keystroke keeps first paint identical and puts the ~350KB (gzipped)
    // cost only on the person who asked for it.
    archive: [],
    archiveUrl: null,
    archiveState: 'idle', // idle | loading | ready | failed

    filtered: [],
    rendered: 0,
    batch: 24,
    observer: null,
    mediaObserver: null,
    useObserver: false,
    state: { category: 'all', query: '' },
    searchTimer: null,
    resizeTimer: null,

    // Match the CSS breakpoints the column-count fallback used.
    computeColCount: function () {
      var w = window.innerWidth;
      return w >= 1200 ? 4 : w >= 768 ? 3 : w >= 480 ? 2 : 1;
    },

    // Cover image width requested from Shopify CDN, sized to the column the
    // card actually renders into. Single-column phones get 500 (≈1.4× retina
    // at 360px display) instead of 800; saves ~40% of bytes on the slowest
    // connections without visible softness on kid-art photography.
    coverWidth: function () {
      var n = this.colCount || this.computeColCount();
      return n === 1 ? 500 : n === 4 ? 800 : 600;
    },

    init: function (section, creations) {
      this.section = section;
      this.columns = section.querySelector('[data-theinmag-gallery-columns]');
      this.noResultsEl = section.querySelector('[data-theinmag-gallery-no-results]');
      this.liveEl = section.querySelector('[data-theinmag-gallery-live]');
      this.scopeNoteEl = document.querySelector('[data-theinmag-gallery-search-scope]');
      this.disclaimerEl = document.querySelector('[data-theinmag-gallery-disclaimer]');
      this.archiveUrl = section.getAttribute('data-gallery-archive') || null;
      this.emptyEl = section.querySelector('.theinmag-gallery-grid__empty');
      // If the server rendered the empty state (Liquid's ~50-metaobject cap
      // returned nothing published), there's no columns container. Build one so
      // the fetched snapshot still renders instead of silently falling back.
      if (!this.columns) {
        this.columns = document.createElement('div');
        this.columns.className = 'theinmag-gallery-grid__columns';
        this.columns.setAttribute('data-theinmag-gallery-columns', '');
        if (this.emptyEl && this.emptyEl.parentNode) {
          this.emptyEl.parentNode.insertBefore(this.columns, this.emptyEl);
        } else {
          section.appendChild(this.columns);
        }
      }

      this.batch = parseInt(section.getAttribute('data-batch-size'), 10) || 24;
      this.all = creations;
      this.filtered = creations;
      this.colCount = this.computeColCount();
      this.setupMediaObserver();

      // Build the first batch OFF-DOM first. If buildCard throws, the live
      // server-rendered cards are untouched and the outer .catch runs Fallback,
      // so a render bug can never leave the gallery blank.
      var firstCards = [];
      var end = Math.min(this.batch, this.filtered.length);
      for (var i = 0; i < end; i++) firstCards.push(this.buildCard(this.filtered[i], i));

      // Safe to take over the DOM now. Switch from CSS multi-column (fills DOWN
      // columns) to flex columns with round-robin placement (fills ACROSS the
      // top row), so the newest creations sit at the top reading left-to-right.
      if (this.emptyEl) this.emptyEl.style.display = 'none';
      var oldSentinel = section.querySelector('[data-theinmag-gallery-sentinel]');
      if (oldSentinel && oldSentinel.parentNode) oldSentinel.parentNode.removeChild(oldSentinel);
      this.columns.classList.add('is-js-masonry');
      this.buildCols(this.colCount);
      this.rendered = 0;
      this.placeCards(firstCards);

      this.sentinel = document.createElement('div');
      this.sentinel.className = 'theinmag-gallery-grid__sentinel';
      this.sentinel.setAttribute('aria-hidden', 'true');
      this.columns.parentNode.insertBefore(this.sentinel, this.columns.nextSibling);
      this.updateSentinel();

      this.bindControls();
      this.setupInfiniteScroll();
      this.bindResize();
      this.fillWhileVisible();
      this.pumpVisibleMedia();
      this.hideLoader();
    },

    // Image recycling: the gallery keeps every rendered card in the DOM, but only
    // the images near the viewport carry a live `src`. Cards that scroll well past
    // release their decoded image (removeAttribute src) and reload it just before
    // they return to view. The reserved aspect-ratio box means releasing an image
    // never shifts layout or scroll. This caps decoded-image memory flat no matter
    // how large the archive grows, which is what was crashing memory-limited phones
    // and in-app browsers (the whole 1000-card archive decoded at once).
    setupMediaObserver: function () {
      this.useObserver = ('IntersectionObserver' in window);
      if (!this.useObserver || this.mediaObserver) return;
      var self = this;
      // Generous margin: load ~1500px before a card enters view so it is ready as
      // the reader scrolls into it, release it ~1500px after it leaves. The wide
      // band (viewport + ~3000px) keeps a handful of images live at once and any
      // reload is served warm from the browser cache, so no thrash at the edge.
      this.mediaObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var media = entries[i].target;
          if (entries[i].isIntersecting) self.loadMedia(media);
          else self.unloadMedia(media);
        }
      }, { rootMargin: '1500px 0px' });
    },

    observeMedia: function (card) {
      if (!this.mediaObserver || !card) return;
      var medias = card.querySelectorAll('.theinmag-gallery-card__media');
      for (var i = 0; i < medias.length; i++) this.mediaObserver.observe(medias[i]);
    },

    loadMedia: function (media) {
      var imgs = media.querySelectorAll('img[data-src]');
      for (var i = 0; i < imgs.length; i++) {
        var src = imgs[i].getAttribute('data-src');
        if (imgs[i].getAttribute('src') !== src) imgs[i].setAttribute('src', src);
      }
    },

    unloadMedia: function (media) {
      var imgs = media.querySelectorAll('img[data-src]');
      for (var i = 0; i < imgs.length; i++) imgs[i].removeAttribute('src');
    },

    // Synchronously load whatever media already sits in (or near) the first screen,
    // so the top of the gallery paints immediately without waiting on the observer's
    // first async callback.
    pumpVisibleMedia: function () {
      if (!this.mediaObserver || !this.columns) return;
      var medias = this.columns.querySelectorAll('.theinmag-gallery-card__media');
      var limit = window.innerHeight + 1500;
      for (var i = 0; i < medias.length; i++) {
        if (medias[i].getBoundingClientRect().top < limit) this.loadMedia(medias[i]);
      }
    },

    // True while there are more cards to render AND the sentinel sits within the
    // load zone (current viewport + a margin). Reserved tile aspect-ratios make
    // this measurement accurate even before images finish loading.
    sentinelInLoadZone: function () {
      if (!this.sentinel || this.rendered >= this.filtered.length) return false;
      return this.sentinel.getBoundingClientRect().top < (window.innerHeight + 800);
    },

    // Keep rendering batches until the screen (plus margin) is full or all done.
    // Fixes the stall where short, image-less tiles kept the sentinel in view so
    // the IntersectionObserver only fired once and loading halted around ~48.
    fillWhileVisible: function () {
      var guard = 0;
      while (this.sentinelInLoadZone() && guard < 500) { this.renderNextBatch(); guard++; }
    },

    hideLoader: function () {
      var loader = this.section.querySelector('[data-theinmag-gallery-loader]');
      if (!loader) return;
      loader.classList.add('is-done');
      loader.style.display = 'none';
    },

    buildCols: function (n) {
      // Dropping the old cards: stop observing their media so released/stale
      // elements are not tracked. Re-observation happens as new cards are placed.
      if (this.mediaObserver) this.mediaObserver.disconnect();
      this.cols = [];
      this.columns.innerHTML = '';
      for (var i = 0; i < n; i++) {
        var col = document.createElement('div');
        col.className = 'theinmag-gallery-grid__col';
        this.columns.appendChild(col);
        this.cols.push(col);
      }
    },

    // Round-robin: card k -> column (k % colCount). The first colCount cards
    // form the top row (newest across the top); the next form the second row.
    placeCards: function (cardEls) {
      for (var i = 0; i < cardEls.length; i++) {
        this.cols[this.rendered % this.colCount].appendChild(cardEls[i]);
        this.observeMedia(cardEls[i]);
        this.rendered++;
      }
      this.updateSentinel();
    },

    updateSentinel: function () {
      if (this.sentinel) this.sentinel.style.display = this.rendered >= this.filtered.length ? 'none' : '';
    },

    bindControls: function () {
      var self = this;
      var sel = document.querySelector('[data-theinmag-gallery-category]');
      if (sel) sel.addEventListener('change', function () {
        self.state.category = sel.value;
        self.applyFilter();
      });
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (input) {
        // Start fetching the archive as soon as the box is FOCUSED, before a
        // single character is typed. Intent to search is the signal, and the
        // ~0.5s head start usually means the full set is ready by the time they
        // finish typing a name, so the results do not visibly jump.
        input.addEventListener('focus', function () { self.loadArchive(); });
        input.addEventListener('input', function () {
          clearTimeout(self.searchTimer);
          self.loadArchive();
          self.searchTimer = setTimeout(function () {
            self.state.query = (input.value || '').trim().toLowerCase();
            self.applyFilter();
          }, 250);
        });
      }
    },

    bindResize: function () {
      var self = this;
      window.addEventListener('resize', function () {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function () {
          var n = self.computeColCount();
          if (n === self.colCount) return;
          // Column count changed: re-render the same number of cards into the
          // new column layout, preserving newest-first round-robin order.
          var shown = self.rendered;
          self.colCount = n;
          self.buildCols(n);
          self.rendered = 0;
          var target = Math.min(shown || self.batch, self.filtered.length);
          var cards = [];
          for (var i = 0; i < target; i++) cards.push(self.buildCard(self.filtered[i], i));
          self.placeCards(cards);
          self.pumpVisibleMedia();
        }, 200);
      });
    },

    matches: function (c) {
      if (this.state.category !== 'all' && c.category !== this.state.category) return false;
      var q = this.state.query;
      if (!q) return true;
      var hay = [c.first_name, c.last_initial, c.town, c.state, (c.tags || []).join(' '), c.age, c.write_up]
        .join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    },

    // What a filter run searches over. With NO query this is the windowed feed
    // alone, so the default browse view and its DOM weight are exactly as before.
    // Only a real search widens the pool to every published creation.
    searchPool: function () {
      if (!this.state.query || this.archiveState !== 'ready' || !this.archive.length) return this.all;
      return this.all.concat(this.archive);
    },

    // Fetch the archive once, on the first search. Failure is non-fatal by design:
    // search keeps working over the windowed feed, which is exactly the behaviour
    // that shipped before this existed, so a Worker blip degrades to the old
    // gallery rather than to a broken one.
    loadArchive: function () {
      var self = this;
      if (this.archiveState !== 'idle' || !this.archiveUrl) return;
      this.archiveState = 'loading';
      this.updateSearchScopeNote();
      fetch(this.archiveUrl, { credentials: 'omit' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (data) {
          var list = (data && data.creations) || [];
          // Defensive dedupe: the two sets are disjoint by construction (the
          // Worker splits one result set on the window boundary), but an id that
          // appeared twice would render a duplicate card, so never trust it.
          var seen = {};
          self.all.forEach(function (c) { seen[c.id] = true; });
          self.archive = list.filter(function (c) {
            if (seen[c.id]) return false;
            seen[c.id] = true;
            return true;
          });
          self.archiveState = 'ready';
          console.log('[gallery] archive loaded:', self.archive.length, 'older creations now searchable');
          // Only re-run if a search is still active; if they cleared the box while
          // it loaded, re-filtering would yank the default view out from under them.
          if (self.state.query) self.applyFilter();
          else self.updateSearchScopeNote();
        })
        .catch(function (err) {
          self.archiveState = 'failed';
          console.warn('[gallery] archive failed (' + (err && err.message) + '), searching recent creations only');
          self.updateSearchScopeNote();
        });
    },

    // Tells the searcher WHICH set they are looking at, in words. A kid who
    // searches their name and sees nothing needs to know whether that means "not
    // here" or "still loading", otherwise the honest answer looks like a dead end.
    updateSearchScopeNote: function () {
      var el = this.scopeNoteEl;
      if (!el) return;
      var msg = '';
      if (this.state.query) {
        if (this.archiveState === 'loading') msg = 'Looking through every creation, one moment...';
        else if (this.archiveState === 'ready') msg = 'Searching all ' + (this.all.length + this.archive.length) + ' creations, not just the recent ones.';
        else if (this.archiveState === 'failed') msg = 'Searching recent creations only just now. Try again in a moment to search them all.';
      }
      el.textContent = msg;
      el.classList.toggle('is-visible', msg !== '');
      // The browse disclaimer opens with "Last 3 months", which is only true of
      // the default windowed view. Stand it down while a search is active so it
      // cannot contradict the scope line directly above it.
      if (this.disclaimerEl) this.disclaimerEl.hidden = !!this.state.query;
    },

    applyFilter: function () {
      var self = this;
      this.filtered = this.searchPool().filter(function (c) { return self.matches(c); });
      this.buildCols(this.colCount);
      this.rendered = 0;
      this.renderNextBatch();
      this.fillWhileVisible();
      this.pumpVisibleMedia();

      var none = this.filtered.length === 0;
      var showNo = none && (this.state.query !== '' || this.state.category !== 'all');
      // NEVER say "nothing found" while the archive is still in flight. Between
      // the 250ms keystroke debounce and the fetch landing there is a moment when
      // an archive-only name genuinely has no match in the windowed set, and
      // flashing "no creations found" at a kid searching their own name is the
      // one wrong answer this whole feature exists to prevent. The scope note
      // says "looking through every creation" instead, and the real result
      // replaces it a moment later.
      if (this.state.query && this.archiveState === 'loading') showNo = false;
      if (this.noResultsEl) {
        this.noResultsEl.classList.toggle('is-visible', showNo);
        this.noResultsEl.classList.toggle('visually-hidden', !showNo);
      }
      if (this.liveEl) {
        this.liveEl.textContent = this.filtered.length + ' creation' + (this.filtered.length === 1 ? '' : 's') + ' showing.';
      }
      this.updateSearchScopeNote();
      if (this.section.scrollIntoView && (this.state.query || this.state.category !== 'all')) {
        this.section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    },

    renderNextBatch: function () {
      var end = Math.min(this.rendered + this.batch, this.filtered.length);
      var cards = [];
      for (var i = this.rendered; i < end; i++) cards.push(this.buildCard(this.filtered[i], i));
      this.placeCards(cards);
    },

    setupInfiniteScroll: function () {
      var self = this;
      // A throttled scroll/resize listener is the reliable primary trigger;
      // the IntersectionObserver is a backup for layout changes without a scroll
      // (e.g. images settling). Both funnel into fillWhileVisible.
      var lastRun = 0;
      function onScroll() {
        var now = Date.now();
        if (now - lastRun < 100) return;
        lastRun = now;
        self.fillWhileVisible();
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      if ('IntersectionObserver' in window && this.sentinel) {
        this.observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) self.fillWhileVisible(); });
        }, { rootMargin: '800px 0px' });
        this.observer.observe(this.sentinel);
      }
    },

    attribution: function (c) {
      var a = c.first_name + ' ' + c.last_initial + '.';
      if (c.town) {
        a += ' │ ' + c.town;
        if (c.state) a += ' ' + c.state;
        if (c.age) a += ', age ' + c.age;
      }
      return a;
    },

    buildCard: function (c, index) {
      var fulls = (c.images || []).map(function (u) { return sized(u, 1400); });
      var cover = (c.images && c.images.length) ? sized(c.images[0], this.coverWidth()) : '';
      var attribution = this.attribution(c);

      var article = document.createElement('article');
      article.className = 'theinmag-gallery-card' + (c.is_text_only ? ' theinmag-gallery-card--text' : '');
      article.setAttribute('data-theinmag-gallery-card', '');
      article.setAttribute('data-category', c.category || 'art');
      article.setAttribute('data-first-name', (c.first_name || '').toLowerCase());
      article.setAttribute('data-last-initial', (c.last_initial || '').toLowerCase());
      article.setAttribute('data-town', (c.town || '').toLowerCase());
      article.setAttribute('data-state', (c.state || '').toLowerCase());
      article.setAttribute('data-age', c.age || '');
      article.setAttribute('data-tags', (c.tags || []).join(','));
      article.setAttribute('data-submitted-at', c.submitted_at || '');
      article.setAttribute('data-cover-url', cover);
      article.setAttribute('data-image-urls', fulls.join('|||'));
      article.setAttribute('data-image-count', (c.images || []).length);
      article.setAttribute('data-write-up', c.write_up || '');
      article.setAttribute('data-attribution', attribution);
      article.setAttribute('data-index', index);
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'button');
      article.setAttribute('aria-label', 'View creation by ' + c.first_name + ' ' + c.last_initial + (c.town ? ' from ' + c.town : ''));

      if (c.is_text_only || !c.images || !c.images.length) {
        var metaT = document.createElement('div');
        metaT.className = 'theinmag-gallery-card__meta';
        var attrT = document.createElement('p');
        attrT.className = 'theinmag-gallery-card__attribution';
        attrT.textContent = attribution;
        metaT.appendChild(attrT);
        if (c.write_up) {
          var wT = document.createElement('p');
          wT.className = 'theinmag-gallery-card__writeup theinmag-gallery-card__writeup--text';
          wT.textContent = c.write_up;
          metaT.appendChild(wT);
        }
        article.appendChild(metaT);
        return article;
      }

      var media = document.createElement('div');
      media.className = 'theinmag-gallery-card__media';

      if (c.images.length > 1) {
        // Multi-page submission. On mobile the media is a native horizontal
        // swipe carousel through every page (nobody opens the lightbox on a
        // phone). On desktop it shows only the first page (others display:none
        // so they aren't downloaded) and a tap still opens the lightbox.
        media.className += ' theinmag-gallery-card__media--multi';
        if (c.cover_w && c.cover_h) media.style.setProperty('--gallery-card-ar', c.cover_w + ' / ' + c.cover_h);
        var cw = this.coverWidth();
        var track = document.createElement('div');
        track.className = 'theinmag-gallery-card__track';
        for (var k = 0; k < c.images.length; k++) {
          var slide = document.createElement('img');
          slide.className = 'theinmag-gallery-card__image theinmag-gallery-card__slide';
          if (k === 0 && c.cover_w && c.cover_h) slide.style.aspectRatio = c.cover_w + ' / ' + c.cover_h;
          var slideUrl = (k === 0) ? cover : sized(c.images[k], cw);
          // With the observer, the media observer sets src near the viewport and
          // releases it far away. Without it, fall back to eager src + native lazy.
          if (this.useObserver) {
            slide.setAttribute('data-src', slideUrl);
          } else {
            slide.src = slideUrl;
            slide.loading = 'lazy';
          }
          slide.alt = c.alt_text || '';
          slide.decoding = 'async';
          slide.setAttribute('draggable', 'false');
          slide.setAttribute('oncontextmenu', 'return false;');
          track.appendChild(slide);
        }
        media.appendChild(track);

        var badge = document.createElement('span');
        badge.className = 'theinmag-gallery-card__badge';
        badge.setAttribute('aria-label', c.images.length + ' pages');
        badge.innerHTML = '<span class="theinmag-gallery-card__badge-current">1</span>/<span class="theinmag-gallery-card__badge-total">' + c.images.length + '</span>';
        media.appendChild(badge);

        // Keep the badge's current-page number in sync as the carousel is swiped.
        (function (trk, bdg, total) {
          trk.addEventListener('scroll', function () {
            var w = trk.clientWidth || 1;
            var idx = Math.min(total, Math.max(1, Math.round(trk.scrollLeft / w) + 1));
            var cur = bdg.querySelector('.theinmag-gallery-card__badge-current');
            if (cur) cur.textContent = idx;
          }, { passive: true });
        })(track, badge, c.images.length);
      } else {
        var img = document.createElement('img');
        img.className = 'theinmag-gallery-card__image';
        // Reserve the exact box BEFORE the image loads so tiles don't jump/drop
        // as they paint in - and so the infinite-scroll height math is accurate.
        // The reserved box also means releasing the src (image recycling) never
        // shifts layout, so an off-screen card can drop its decoded image safely.
        if (c.cover_w && c.cover_h) img.style.aspectRatio = c.cover_w + ' / ' + c.cover_h;
        if (this.useObserver) {
          img.setAttribute('data-src', cover);
        } else {
          img.src = cover;
          img.loading = 'lazy';
        }
        img.alt = c.alt_text || '';
        img.decoding = 'async';
        img.setAttribute('draggable', 'false');
        img.setAttribute('oncontextmenu', 'return false;');
        media.appendChild(img);
      }
      article.appendChild(media);

      var meta = document.createElement('div');
      meta.className = 'theinmag-gallery-card__meta';
      var attr = document.createElement('p');
      attr.className = 'theinmag-gallery-card__attribution';
      attr.textContent = attribution;
      meta.appendChild(attr);
      if (c.write_up) {
        var w = document.createElement('p');
        w.className = 'theinmag-gallery-card__writeup';
        w.textContent = c.write_up;
        meta.appendChild(w);
      }
      article.appendChild(meta);
      return article;
    },

    setSearchAndFilter: function (query, category) {
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (input) input.value = query || '';
      this.state.query = (query || '').toLowerCase();
      var sel = document.querySelector('[data-theinmag-gallery-category]');
      if (sel) sel.value = category || 'all';
      this.state.category = category || 'all';
      // A programmatic search (a deep link, or a "find your creation" link in an
      // email) must reach the archive too, or the one route we point kids at would
      // be the one route that only searches the recent set.
      if (this.state.query) this.loadArchive();
      this.applyFilter();
    }
  };

  /* ---------- Fallback: lazy-load + filter over server cards ---------- */

  var Fallback = {
    init: function (gridSection) {
      var cards = Array.prototype.slice.call(gridSection.querySelectorAll('[data-theinmag-gallery-card]'));
      var initialBatch = parseInt(gridSection.getAttribute('data-initial-batch'), 10) || 24;
      var batchSize = parseInt(gridSection.getAttribute('data-batch-size'), 10) || 24;

      // Newest-first over the (capped) server set.
      var columns = gridSection.querySelector('[data-theinmag-gallery-columns]');
      if (columns && cards.length > 1) {
        cards = cards.slice().sort(function (a, b) {
          var da = a.getAttribute('data-submitted-at') || '';
          var db = b.getAttribute('data-submitted-at') || '';
          return da === db ? 0 : (da < db ? 1 : -1);
        });
        var frag = document.createDocumentFragment();
        cards.forEach(function (card, i) {
          if (i < initialBatch) card.classList.remove('theinmag-gallery-card--hidden');
          else card.classList.add('theinmag-gallery-card--hidden');
          frag.appendChild(card);
        });
        columns.appendChild(frag);
      }

      LazyLoad.init(gridSection, cards, initialBatch, batchSize);
      Filter.init(gridSection, cards);
    }
  };

  var LazyLoad = {
    init: function (gridSection, cards, initialBatch, batchSize) {
      var sentinel = gridSection.querySelector('[data-theinmag-gallery-sentinel]');
      if (!sentinel || cards.length <= initialBatch) return;
      var revealed = initialBatch, total = cards.length;
      if (!('IntersectionObserver' in window)) {
        for (var i = revealed; i < total; i++) cards[i].classList.remove('theinmag-gallery-card--hidden');
        sentinel.parentNode && sentinel.parentNode.removeChild(sentinel);
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var end = Math.min(revealed + batchSize, total);
          for (var i = revealed; i < end; i++) cards[i].classList.remove('theinmag-gallery-card--hidden');
          revealed = end;
          if (revealed >= total) { observer.disconnect(); sentinel.parentNode && sentinel.parentNode.removeChild(sentinel); }
        });
      }, { rootMargin: '600px 0px' });
      observer.observe(sentinel);
    }
  };

  var Filter = {
    state: { category: 'all', query: '' },
    cards: [], gridSection: null, noResultsEl: null, liveEl: null, searchTimer: null,
    init: function (gridSection, cards) {
      this.gridSection = gridSection; this.cards = cards;
      this.noResultsEl = gridSection.querySelector('[data-theinmag-gallery-no-results]');
      this.liveEl = gridSection.querySelector('[data-theinmag-gallery-live]');
      var self = this;
      var sel = document.querySelector('[data-theinmag-gallery-category]');
      if (sel) sel.addEventListener('change', function () { self.state.category = sel.value; self.apply(); });
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (input) input.addEventListener('input', function () {
        clearTimeout(self.searchTimer);
        self.searchTimer = setTimeout(function () { self.state.query = (input.value || '').trim().toLowerCase(); self.apply(); }, 300);
      });
    },
    apply: function () {
      var q = this.state.query, cat = this.state.category, matchCount = 0;
      this.cards.forEach(function (card) {
        var match = true;
        if (cat !== 'all' && card.getAttribute('data-category') !== cat) match = false;
        if (match && q) {
          var hay = [card.getAttribute('data-first-name') || '', card.getAttribute('data-last-initial') || '',
            card.getAttribute('data-town') || '', card.getAttribute('data-state') || '',
            card.getAttribute('data-tags') || '', card.getAttribute('data-age') || ''].join(' ');
          if (hay.indexOf(q) === -1) match = false;
        }
        card.classList.toggle('theinmag-gallery-card--filtered-out', !match);
        if (q || cat !== 'all') card.classList.remove('theinmag-gallery-card--hidden');
        if (match) matchCount++;
      });
      if (this.noResultsEl) {
        var showEmpty = matchCount === 0 && (q !== '' || cat !== 'all');
        this.noResultsEl.classList.toggle('is-visible', showEmpty);
        this.noResultsEl.classList.toggle('visually-hidden', !showEmpty);
      }
      if (this.liveEl) this.liveEl.textContent = matchCount + ' creation' + (matchCount === 1 ? '' : 's') + ' showing.';
    },
    setSearchAndFilter: function (query, category) {
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (input) input.value = query || '';
      this.state.query = (query || '').toLowerCase();
      var sel = document.querySelector('[data-theinmag-gallery-category]');
      if (sel) sel.value = category || 'all';
      this.state.category = category || 'all';
      this.apply();
      if (this.gridSection && this.gridSection.scrollIntoView) {
        this.gridSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }
  };

  // Whichever render path is active, cross-link filtering routes here.
  function activeFilter() {
    return (JsonGallery.all && JsonGallery.all.length) ? JsonGallery : Filter;
  }

  /* ---------- Lightbox (delegated; works for both paths) ---------- */

  var Lightbox = {
    root: null, panel: null, media: null, image: null, counter: null,
    prevBtn: null, nextBtn: null, attributionEl: null, writeupEl: null,
    townBtn: null, ageBtn: null, closeBtn: null, backdrop: null,
    townTpl: '', ageTpl: '', currentImages: [], currentIdx: 0, currentCard: null,
    lastFocused: null, touchStartX: null,

    init: function (gridSection) {
      this.root = document.querySelector('[data-theinmag-gallery-lightbox]');
      if (!this.root) return;
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

      // Delegated open: any card (server- or JS-rendered) inside the grid.
      gridSection.addEventListener('click', function (e) {
        var card = e.target.closest && e.target.closest('[data-theinmag-gallery-card]');
        if (card) self.open(card);
      });
      gridSection.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest && e.target.closest('[data-theinmag-gallery-card]');
        if (card) { e.preventDefault(); self.open(card); }
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

      this.media && this.media.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches.length) self.touchStartX = e.touches[0].clientX;
      }, { passive: true });
      this.media && this.media.addEventListener('touchend', function (e) {
        if (self.touchStartX == null) return;
        var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
        if (endX != null) { var d = endX - self.touchStartX; if (Math.abs(d) > 40) self.go(d < 0 ? 1 : -1); }
        self.touchStartX = null;
      });

      this.townBtn && this.townBtn.addEventListener('click', function () {
        if (!self.currentCard) return;
        activeFilter().setSearchAndFilter(self.currentCard.getAttribute('data-town') || '', 'all');
        self.close();
      });
      this.ageBtn && this.ageBtn.addEventListener('click', function () {
        if (!self.currentCard) return;
        activeFilter().setSearchAndFilter(self.currentCard.getAttribute('data-age') || '', 'all');
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
      if (town && this.townBtn) { this.townBtn.textContent = this.townTpl.replace('[town]', titleCase(town)); this.townBtn.hidden = false; }
      else if (this.townBtn) this.townBtn.hidden = true;
      if (age && this.ageBtn) { this.ageBtn.textContent = this.ageTpl.replace('[age]', age); this.ageBtn.hidden = false; }
      else if (this.ageBtn) this.ageBtn.hidden = true;

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
      var cover = this.currentCard ? this.currentCard.getAttribute('data-cover-url') : '';
      if (this.media) {
        this.media.style.backgroundImage = (this.currentIdx === 0 && cover) ? 'url("' + cover + '")' : '';
        this.media.classList.add('is-loading');
      }
      this.image.classList.remove('is-loaded');
      this.image.alt = this.currentCard ? (this.currentCard.querySelector('img') || {}).alt || '' : '';
      this.image.onload = function () { self.image.classList.add('is-loaded'); if (self.media) self.media.classList.remove('is-loading'); };
      this.image.onerror = function () { if (self.media) self.media.classList.remove('is-loading'); };
      this.image.src = url;
      if (this.image.complete && this.image.naturalWidth) { this.image.classList.add('is-loaded'); if (this.media) this.media.classList.remove('is-loading'); }

      var multi = this.currentImages.length > 1;
      this.prevBtn && (this.prevBtn.hidden = !multi);
      this.nextBtn && (this.nextBtn.hidden = !multi);
      if (this.counter) {
        if (multi) { this.counter.hidden = false; this.counter.textContent = (this.currentIdx + 1) + ' of ' + this.currentImages.length; }
        else this.counter.hidden = true;
      }
    }
  };

  /* ---------- Search placeholder rotator ---------- */

  var PlaceholderRotator = {
    init: function () {
      var bar = document.querySelector('[data-theinmag-gallery-filter-bar]');
      var input = document.querySelector('[data-theinmag-gallery-search]');
      if (!bar || !input) return;
      var list = (bar.getAttribute('data-placeholders') || '').split('|||').filter(Boolean);
      if (list.length <= 1) return;
      var i = 0;
      setInterval(function () {
        if (document.activeElement === input || input.value) return;
        i = (i + 1) % list.length;
        input.placeholder = list[i];
      }, 3200);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

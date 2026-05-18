/* theinmag-curriculum-accordion
 * Single-open accordion behaviour for the /pages/for-teachers
 * curriculum-mapping section. One item open at a time; click an open
 * item to close it. Respects prefers-reduced-motion (no max-height
 * animation, instant snap).
 *
 * Hyphens only, never em or en dashes (code comments included).
 */

(function () {
    'use strict';

    var SELECTOR_ROOT = '[data-theinmag-curriculum-accordion]';
    var SELECTOR_ITEM = '[data-theinmag-accordion-item]';
    var SELECTOR_TRIGGER = '[data-theinmag-accordion-trigger]';
    var SELECTOR_PANEL = '[data-theinmag-accordion-panel]';
    var ATTR_OPEN = 'data-open';

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function setItemState(item, open) {
        var trigger = item.querySelector(SELECTOR_TRIGGER);
        var panel = item.querySelector(SELECTOR_PANEL);
        if (!trigger || !panel) return;

        if (open) {
            item.setAttribute(ATTR_OPEN, 'true');
            trigger.setAttribute('aria-expanded', 'true');
            if (prefersReducedMotion()) {
                panel.style.maxHeight = 'none';
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        } else {
            item.setAttribute(ATTR_OPEN, 'false');
            trigger.setAttribute('aria-expanded', 'false');
            panel.style.maxHeight = '';
        }
    }

    function initRoot(root) {
        var items = Array.prototype.slice.call(root.querySelectorAll(SELECTOR_ITEM));
        if (!items.length) return;

        /* Set initial state from data-open. First item flagged
           data-open="true" in the markup gets opened on load. */
        items.forEach(function (item) {
            var initiallyOpen = item.getAttribute(ATTR_OPEN) === 'true';
            setItemState(item, initiallyOpen);
        });

        root.addEventListener('click', function (event) {
            var trigger = event.target.closest(SELECTOR_TRIGGER);
            if (!trigger || !root.contains(trigger)) return;

            var item = trigger.closest(SELECTOR_ITEM);
            if (!item) return;

            var isOpen = item.getAttribute(ATTR_OPEN) === 'true';

            /* Close all items, then open the clicked one if it was closed.
               Clicking an already-open item collapses it (no replacement). */
            items.forEach(function (other) {
                setItemState(other, false);
            });
            if (!isOpen) {
                setItemState(item, true);
            }
        });

        /* Recalculate the open item's max-height on viewport resize so
           the panel adapts to font / wrapping changes. Debounced via rAF. */
        var resizeRaf = null;
        window.addEventListener('resize', function () {
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(function () {
                items.forEach(function (item) {
                    if (item.getAttribute(ATTR_OPEN) === 'true') {
                        var panel = item.querySelector(SELECTOR_PANEL);
                        if (panel && !prefersReducedMotion()) {
                            panel.style.maxHeight = panel.scrollHeight + 'px';
                        }
                    }
                });
            });
        });
    }

    function init() {
        var roots = document.querySelectorAll(SELECTOR_ROOT);
        Array.prototype.forEach.call(roots, initRoot);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Dropdown list — Alpine.js component (CSP-compatible).
 *
 * Spec: components/dropdown-list/A-basic/spec.md
 * Skill reference: .claude/skills/hyva-alpine-component/SKILL.md
 *
 * CSP rules applied:
 *   • Named global constructor (this file, `initDropdownList`), registered
 *     with `Alpine.data()` inside an `alpine:init` listener with `{once: true}`.
 *   • No `x-model`. Interactions wire `:aria-selected` / `:data-active` +
 *     `@click` / `@keydown` handlers.
 *   • Method arguments are passed via `data-*` attributes; handlers read
 *     `this.$el.dataset.*` or `this.$event.target.dataset.*`.
 *   • No inline property mutation from templates — every state change is a
 *     named method on the component.
 *   • Range iteration (`x-for="i in N"`) is not used; `x-for` iterates over
 *     arrays sourced from the DOM (see `init()`).
 *
 * The component supports two authoring modes (spec §7.4):
 *   1. DOM-driven — consumer renders the `<li role="option">` list directly.
 *      `init()` enumerates the option elements, reads `data-value`, seeds
 *      `selectedValue` from any pre-existing `aria-selected="true"`, and
 *      drives keyboard nav through those DOM nodes.
 *   2. Config-driven — consumer passes `items` through `x-data` (future; the
 *      DOM-driven path is the primary one shipped in A-basic). The shape
 *      `{ value, label, disabled }` is documented in the README.
 */

function initDropdownList() {
    return {
        // ── State ────────────────────────────────────────────────────────
        open: false,
        activeIndex: -1,
        selectedValue: null,
        // Derived from DOM on mount — { value, disabled, el } per option.
        items: [],

        // ── Lifecycle ────────────────────────────────────────────────────
        init() {
            // Enumerate `<li role="option">` children of the listbox in DOM
            // order. `$refs.list` points at the `<ul class="dropdown-list">`.
            // Falls back to `$el` if the consumer hasn't wired a $ref.
            const listEl = this.$refs.list || this.$el;
            const optionEls = Array.from(
                listEl.querySelectorAll('[role="option"]')
            );

            this.items = optionEls.map((el) => ({
                value: el.dataset.value,
                disabled: el.getAttribute('aria-disabled') === 'true',
                el: el,
            }));

            // Seed `selectedValue` from any pre-existing
            // `aria-selected="true"` in the markup.
            const preSelected = this.items.find(
                (item) => item.el.getAttribute('aria-selected') === 'true'
            );
            if (preSelected) {
                this.selectedValue = preSelected.value;
            }
        },

        // ── Open / close / toggle ────────────────────────────────────────
        openList() {
            if (this.open) return;
            this.open = true;

            // On open, seed `activeIndex` to the currently-selected item
            // (so keyboard nav starts there) or to the first non-disabled
            // item if nothing is selected yet.
            const selectedIdx = this.items.findIndex(
                (item) => item.value === this.selectedValue
            );
            if (selectedIdx >= 0 && !this.items[selectedIdx].disabled) {
                this.activeIndex = selectedIdx;
            } else {
                this.activeIndex = this.firstEnabledIndex();
            }

            this.$dispatch('dropdown:open', {});
            // Scroll after render so the measured `scrollTop` is correct.
            this.$nextTick(() => this.scrollActiveIntoView());
        },

        closeList() {
            if (!this.open) return;
            this.open = false;
            this.activeIndex = -1;
            this.$dispatch('dropdown:close', { reason: 'programmatic' });
        },

        toggle() {
            if (this.open) {
                this.closeList();
            } else {
                this.openList();
            }
        },

        // ── Keyboard nav (bound via @keydown on the listbox container) ──
        handleKeydown() {
            const event = this.$event;
            const key = event.key;

            if (key === 'ArrowDown') {
                event.preventDefault();
                this.focusNext();
            } else if (key === 'ArrowUp') {
                event.preventDefault();
                this.focusPrev();
            } else if (key === 'Home') {
                event.preventDefault();
                this.focusFirst();
            } else if (key === 'End') {
                event.preventDefault();
                this.focusLast();
            } else if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
                event.preventDefault();
                this.selectActive();
            } else if (key === 'Escape' || key === 'Esc') {
                event.preventDefault();
                this.closeList();
            }
        },

        // ── Roving-focus helpers ─────────────────────────────────────────
        firstEnabledIndex() {
            for (let i = 0; i < this.items.length; i++) {
                if (!this.items[i].disabled) return i;
            }
            return -1;
        },

        lastEnabledIndex() {
            for (let i = this.items.length - 1; i >= 0; i--) {
                if (!this.items[i].disabled) return i;
            }
            return -1;
        },

        focusNext() {
            if (this.items.length === 0) return;
            const len = this.items.length;
            let idx = this.activeIndex;
            for (let step = 0; step < len; step++) {
                idx = (idx + 1) % len;
                if (!this.items[idx].disabled) {
                    this.activeIndex = idx;
                    this.dispatchHighlight();
                    this.scrollActiveIntoView();
                    return;
                }
            }
        },

        focusPrev() {
            if (this.items.length === 0) return;
            const len = this.items.length;
            let idx = this.activeIndex < 0 ? len : this.activeIndex;
            for (let step = 0; step < len; step++) {
                idx = (idx - 1 + len) % len;
                if (!this.items[idx].disabled) {
                    this.activeIndex = idx;
                    this.dispatchHighlight();
                    this.scrollActiveIntoView();
                    return;
                }
            }
        },

        focusFirst() {
            const idx = this.firstEnabledIndex();
            if (idx >= 0) {
                this.activeIndex = idx;
                this.dispatchHighlight();
                this.scrollActiveIntoView();
            }
        },

        focusLast() {
            const idx = this.lastEnabledIndex();
            if (idx >= 0) {
                this.activeIndex = idx;
                this.dispatchHighlight();
                this.scrollActiveIntoView();
            }
        },

        // Keep the active option in view when the container scrolls. Uses
        // the `<ul>` itself as the scroll container (its `overflow-y: auto`
        // from the CSS utility is what clips the item list).
        scrollActiveIntoView() {
            if (this.activeIndex < 0) return;
            const item = this.items[this.activeIndex];
            if (!item || !item.el) return;
            const listEl = this.$refs.list || this.$el;

            const itemTop = item.el.offsetTop;
            const itemBottom = itemTop + item.el.offsetHeight;
            const viewTop = listEl.scrollTop;
            const viewBottom = viewTop + listEl.clientHeight;

            if (itemTop < viewTop) {
                listEl.scrollTop = itemTop;
            } else if (itemBottom > viewBottom) {
                listEl.scrollTop = itemBottom - listEl.clientHeight;
            }
        },

        // ── Selection ────────────────────────────────────────────────────
        selectActive() {
            if (this.activeIndex < 0) return;
            const item = this.items[this.activeIndex];
            if (!item || item.disabled) return;
            this.selectValue(item.value, item.el);
        },

        // Bound to each option's @click. Reads the option's dataset.value
        // (no positional argument — CSP rule) and the element itself from
        // $event.target (closest option ancestor if the click landed on
        // the label or icon).
        select() {
            const target = this.$event.target.closest('[role="option"]');
            if (!target) return;
            if (target.getAttribute('aria-disabled') === 'true') return;
            const value = target.dataset.value;
            this.selectValue(value, target);
        },

        selectValue(value, targetEl) {
            this.selectedValue = value;
            // Resolve the label from the option's DOM — whatever sits in
            // `.dropdown-list__label` is the human-facing string. Fall back
            // to the element's text content if the slot class isn't present.
            const labelEl = targetEl
                ? targetEl.querySelector('.dropdown-list__label')
                : null;
            const label = labelEl
                ? labelEl.textContent.trim()
                : targetEl
                  ? targetEl.textContent.trim()
                  : value;
            this.$dispatch('dropdown:select', { value, label });
            // Close after selection. Use the private dispatcher so the
            // `reason` is accurate.
            if (this.open) {
                this.open = false;
                this.activeIndex = -1;
                this.$dispatch('dropdown:close', { reason: 'select' });
            }
        },

        // Hover updates the roving-focus index so the mouse and keyboard
        // stay aligned (standard listbox pattern).
        hoverItem() {
            const target = this.$event.target.closest('[role="option"]');
            if (!target) return;
            if (target.getAttribute('aria-disabled') === 'true') return;
            const idx = this.items.findIndex((item) => item.el === target);
            if (idx >= 0) {
                this.activeIndex = idx;
                this.dispatchHighlight();
            }
        },

        dispatchHighlight() {
            if (this.activeIndex < 0) return;
            const item = this.items[this.activeIndex];
            if (!item) return;
            this.$dispatch('dropdown:highlight', {
                value: item.value,
                index: this.activeIndex,
            });
        },

        // ── Outside-click ────────────────────────────────────────────────
        closeOnOutsideClick() {
            if (!this.open) return;
            this.open = false;
            this.activeIndex = -1;
            this.$dispatch('dropdown:close', { reason: 'outside-click' });
        },

        // ── State-access helpers (bound in templates) ────────────────────
        isActive() {
            // Bound via `:data-active="isActive"` inside the x-for loop.
            // Alpine exposes the loop variable `index` on `this` at call
            // time. Returns a string so the attribute is rendered as
            // `data-active="true"` / `data-active="false"`.
            return this.index === this.activeIndex ? 'true' : 'false';
        },

        isSelected() {
            // Bound via `:aria-selected="isSelected"` inside the x-for loop.
            // Accesses the loop variable `item` via `this`.
            return this.item && this.item.value === this.selectedValue
                ? 'true'
                : 'false';
        },

        // Convenience query for empty / non-empty.
        hasItems() {
            return this.items.length > 0;
        },
    };
}

// Register the constructor with Alpine. The skill's canonical pattern uses an
// `alpine:init` listener, but that fires synchronously inside `Alpine.start()` —
// so if THIS module loads AFTER alpine.js has already started, the listener
// never runs. Handle both orderings: if Alpine is already on window, register
// eagerly; otherwise wait for the event.
if (window.Alpine && typeof window.Alpine.data === 'function') {
    window.Alpine.data('initDropdownList', initDropdownList);
} else {
    window.addEventListener(
        'alpine:init',
        () => window.Alpine.data('initDropdownList', initDropdownList),
        { once: true }
    );
}

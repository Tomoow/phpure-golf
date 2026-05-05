/**
 * Dropdown list — Alpine.js component (CSP-compatible).
 *
 * Spec: components/dropdown-list/A-basic/spec.md
 * Skill reference: .claude/skills/hyva-alpine-component/SKILL.md
 *
 * Accessibility (WAI-ARIA 1.2 combobox / listbox pattern):
 *   • Each option gets a stable, deterministic `id` derived from Alpine's
 *     `$id()` magic — the parent combobox trigger binds
 *     `aria-activedescendant` to this id so screen readers can track
 *     keyboard navigation.
 *   • The listbox also gets an `$id()`-derived id so a sibling combobox
 *     trigger can bind `aria-controls`.
 *   • On every close path (Escape, outside-click, selection, programmatic
 *     toggle) focus is restored to the trigger via `$refs.trigger?.focus()`.
 *   • Tab is NOT intercepted — native focus exit must work.
 *   • The `dropdown:close` event's `reason` field carries one of
 *     'escape' | 'outside' | 'select' | 'toggle' | 'programmatic' so
 *     consumers can react differently.
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
 *     arrays sourced from the DOM (see `init()`) or passed via `items` in
 *     `x-data`.
 *
 * The component supports two authoring modes (spec §7.4):
 *   1. DOM-driven — consumer renders the `<li role="option">` list directly.
 *      `init()` enumerates the option elements, reads `data-value`, seeds
 *      `selectedValue` from any pre-existing `aria-selected="true"`, and
 *      drives keyboard nav through those DOM nodes.
 *   2. Config-driven — consumer passes `items` through `x-data`. The shape
 *      `{ value, label, disabled }` is documented in the README.
 */

function initDropdownList(initialConfig = {}) {
    return {
        // ── State ────────────────────────────────────────────────────────
        open: false,
        activeIndex: -1,
        selectedValue: null,
        // Derived from DOM on mount OR from the constructor arg — each entry
        // is { value, label, disabled, el? } (el only populated in DOM-driven
        // mode; config-driven leaves it null until x-for renders the row).
        items: [],
        // Stable id roots for ARIA wiring. Populated in init().
        listboxId: '',
        // True when items were supplied via the constructor arg and the
        // consumer owns the <li> rendering via x-for. We skip the DOM-scan
        // in that case.
        _configDriven: false,

        // ── Lifecycle ────────────────────────────────────────────────────
        init() {
            // Allocate stable IDs up-front so every option id we emit is
            // deterministic across renders.
            this.listboxId = this.$id('dropdown-list');

            if (Array.isArray(initialConfig.items) && initialConfig.items.length > 0) {
                this._configDriven = true;
                this.items = initialConfig.items.map((item) => ({
                    value: item.value,
                    label: item.label,
                    disabled: item.disabled === true,
                    el: null,
                }));
                if (initialConfig.selectedValue !== undefined) {
                    this.selectedValue = initialConfig.selectedValue;
                }
                return;
            }

            // DOM-driven mode: enumerate `<li role="option">` children of the
            // listbox in DOM order. `$refs.list` points at the `<ul
            // class="dropdown-list">`. Falls back to `$el` if the consumer
            // hasn't wired a $ref.
            const listEl = this.$refs.list || this.$el;
            const optionEls = Array.from(
                listEl.querySelectorAll('[role="option"]')
            );

            this.items = optionEls.map((el) => ({
                value: el.dataset.value,
                label: el.dataset.label || (
                    el.querySelector('.dropdown-list__label')
                        ? el.querySelector('.dropdown-list__label').textContent.trim()
                        : el.textContent.trim()
                ),
                disabled: el.getAttribute('aria-disabled') === 'true',
                el: el,
            }));

            // Seed `selectedValue` from any pre-existing
            // `aria-selected="true"` in the markup.
            const preSelected = this.items.find(
                (item) => item.el && item.el.getAttribute('aria-selected') === 'true'
            );
            if (preSelected) {
                this.selectedValue = preSelected.value;
            }

            // Assign a stable id to each seed option so consumers using a
            // sibling <button role="combobox"> can bind
            // :aria-activedescendant="activeOptionId" directly.
            this.items.forEach((item, idx) => {
                if (item.el && !item.el.id) {
                    item.el.id = this.optionId(item.value, idx);
                }
            });
        },

        // ── ARIA id helpers ──────────────────────────────────────────────
        optionId(value, idx) {
            // Deterministic id built from the listbox root. If a value is
            // missing (config-driven with no `value`) we fall back to idx so
            // the id is still unique inside the listbox.
            const suffix = (value !== undefined && value !== null && value !== '')
                ? String(value)
                : 'idx-' + idx;
            return this.listboxId + '-option-' + suffix;
        },

        // The id currently pointed at by aria-activedescendant. Empty when
        // the list is closed or no item is active.
        get activeOptionId() {
            if (!this.open) return '';
            if (this.activeIndex < 0) return '';
            const item = this.items[this.activeIndex];
            if (!item) return '';
            return this.optionId(item.value, this.activeIndex);
        },

        // The currently-active item's value (used by templates to set
        // :data-active without exposing activeIndex directly).
        get activeValue() {
            if (!this.open) return null;
            if (this.activeIndex < 0) return null;
            const item = this.items[this.activeIndex];
            return item ? item.value : null;
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

        // `reason` is one of 'escape' | 'outside' | 'select' | 'toggle' |
        // 'programmatic'. When the list closes focus is restored to
        // `$refs.trigger` if defined — this is the combobox focus-return
        // contract (A11Y-005).
        closeList(reason) {
            if (!this.open) return;
            this.open = false;
            this.activeIndex = -1;
            this.$dispatch('dropdown:close', { reason: reason || 'programmatic' });
            this.restoreFocus();
        },

        // Restore focus to the combobox trigger if the consumer wired a
        // `trigger` ref. Silent no-op otherwise (DOM-only listboxes without a
        // trigger, e.g. Example 1's static matrix, never need this).
        restoreFocus() {
            const trigger = this.$refs.trigger;
            if (trigger && typeof trigger.focus === 'function') {
                trigger.focus();
            }
        },

        toggle() {
            if (this.open) {
                this.closeList('toggle');
            } else {
                this.openList();
            }
        },

        // Open the list and land the active index on the first enabled
        // option. Used by combobox triggers to wire ArrowDown → open.
        openAndFocusFirst() {
            if (!this.open) this.openList();
            this.focusFirst();
        },

        // Open the list and land on the last enabled option (ArrowUp
        // convention when the list is closed).
        openAndFocusLast() {
            if (!this.open) this.openList();
            this.focusLast();
        },

        // ── Keyboard nav (bound via @keydown on the listbox container) ──
        handleKeydown() {
            const event = this.$event;
            const key = event.key;

            // Never swallow Tab — the user must be able to leave the
            // listbox normally. Escape, arrows, Home/End, Enter/Space are
            // the only keys we intercept.
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
                this.closeList('escape');
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
            if (!item) return;
            const listEl = this.$refs.list || this.$el;

            // DOM-driven: element already known. Config-driven: look up by
            // deterministic id.
            let el = item.el;
            if (!el) {
                el = listEl.querySelector('#' + CSS.escape(this.optionId(item.value, this.activeIndex)));
            }
            if (!el) return;

            const itemTop = el.offsetTop;
            const itemBottom = itemTop + el.offsetHeight;
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

        // Config-driven row click handler. Consumers bind
        // `x-on:click="pickItem(item)"` inside the x-for template.
        pickItem(item) {
            if (!item || item.disabled) return;
            this.selectValue(item.value, null, item.label);
        },

        selectValue(value, targetEl, explicitLabel) {
            this.selectedValue = value;
            // Resolve the label from the most specific source available:
            //   1. explicit arg (config-driven rows pass item.label)
            //   2. option's __label slot textContent
            //   3. option's full textContent
            //   4. the matching entry in `items`
            //   5. the raw value
            let label;
            if (explicitLabel !== undefined) {
                label = explicitLabel;
            } else if (targetEl) {
                const labelEl = targetEl.querySelector('.dropdown-list__label');
                label = labelEl
                    ? labelEl.textContent.trim()
                    : targetEl.textContent.trim();
            } else {
                const match = this.items.find((item) => item.value === value);
                label = match ? match.label : value;
            }
            this.$dispatch('dropdown:select', { value, label });
            // Close after selection. Restore focus to the trigger so the
            // user's keyboard context is preserved.
            if (this.open) {
                this.open = false;
                this.activeIndex = -1;
                this.$dispatch('dropdown:close', { reason: 'select' });
                this.restoreFocus();
            }
        },

        // Hover updates the roving-focus index so the mouse and keyboard
        // stay aligned (standard listbox pattern). Consumers bind
        // `x-on:mouseenter="hoverItemByValue(item.value)"` in config-driven
        // mode, or `x-on:mouseenter="hoverItem"` in DOM-driven mode.
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

        hoverItemByValue(value) {
            const idx = this.items.findIndex((item) => item.value === value);
            if (idx < 0) return;
            if (this.items[idx].disabled) return;
            this.activeIndex = idx;
            this.dispatchHighlight();
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
            this.$dispatch('dropdown:close', { reason: 'outside' });
            // No focus restoration on outside-click: the user has already
            // chosen to focus somewhere else. Returning focus to the
            // trigger would steal focus away from whatever they clicked.
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

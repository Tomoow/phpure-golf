// Alpine constructor for a full country selector (all ~250 countries) with
// searchable dropdown. Uses the same country catalog as phone-input.js, plus a
// simple `filter` string so the user can type to narrow the list.
//
// Accessibility (WAI-ARIA 1.2 combobox):
//   • The trigger element is expected to carry `role="combobox"`,
//     `aria-haspopup="listbox"`, `:aria-expanded="open"`,
//     `:aria-controls="listboxId"`, and
//     `:aria-activedescendant="activeOptionId"`.
//   • Options live in a sibling `<ul :id="listboxId" role="listbox">` and each
//     `<li role="option">` gets a deterministic id via `optionId(code)`.
//   • ArrowDown/ArrowUp/Enter/Space/Escape work from the trigger. ArrowDown/
//     ArrowUp inside the panel's search `<input>` walk the filtered list.
//   • On close (Escape, outside-click, selection) focus is restored to the
//     trigger via `$refs.trigger?.focus()`.
//
// Usage (HTML):
//   <div class="combobox" x-data="initCountrySelector({ defaultCountry: null })"
//        x-on:click.outside="close()">
//       <div class="form-field" role="combobox" tabindex="0"
//            x-ref="trigger"
//            aria-haspopup="listbox"
//            :aria-expanded="open"
//            :aria-controls="listboxId"
//            :aria-activedescendant="activeOptionId"
//            :aria-labelledby="labelId"
//            x-on:click="toggle()"
//            x-on:keydown.down.prevent="openAndFocusFirst()"
//            x-on:keydown.up.prevent="openAndFocusLast()"
//            x-on:keydown.enter.prevent="toggle()"
//            x-on:keydown.space.prevent="toggle()"
//            x-on:keydown.escape="close()">
//           <!-- trigger content (flag, label, chevron) -->
//       </div>
//       <div class="combobox__panel" x-show="open" x-cloak>
//           <input type="search" x-model="filter" …
//                  x-on:keydown.down.prevent="focusNext()"
//                  x-on:keydown.up.prevent="focusPrev()"
//                  x-on:keydown.enter.prevent="pickActive()"
//                  x-on:keydown.escape="close()" />
//           <ul :id="listboxId" role="listbox" :aria-labelledby="labelId">
//               <template x-for="c in filtered()" :key="c.code">
//                   <li class="dropdown-list__item" role="option"
//                       :id="optionId(c.code)"
//                       :aria-selected="selected && selected.code === c.code"
//                       :data-active="activeValue === c.code"
//                       x-on:click="pick(c)"
//                       x-on:mouseenter="activeValue = c.code">
//                       …
//                   </li>
//               </template>
//           </ul>
//       </div>
//   </div>

import { countriesPopularFirst, countryByCode } from './country-data.js';

function initCountrySelector(opts = {}) {
    return {
        countries: countriesPopularFirst,
        selected: opts.defaultCountry ? countryByCode(opts.defaultCountry) : null,
        open: false,
        filter: '',
        // The country code of the currently-highlighted option, or null when
        // nothing is active. Drives `:aria-activedescendant` on the trigger
        // and `:data-active` on each `<li>`.
        activeValue: null,
        // Stable ids for ARIA wiring (generated on mount via Alpine's $id).
        listboxId: '',
        labelId: '',

        init() {
            this.listboxId = this.$id('country-selector-listbox');
            this.labelId = this.$id('country-selector-label');
        },

        // ── ARIA id helpers ──────────────────────────────────────────────
        optionId(code) {
            return this.listboxId + '-option-' + code;
        },

        get activeOptionId() {
            if (!this.open) return '';
            if (!this.activeValue) return '';
            return this.optionId(this.activeValue);
        },

        // ── Open / close / toggle ────────────────────────────────────────
        toggle() {
            if (this.open) {
                this.close();
            } else {
                this.openPanel();
            }
        },

        openPanel() {
            if (this.open) return;
            this.open = true;
            // Seed activeValue to the selected country (if any), else the
            // first option in the current (unfiltered) list.
            const list = this.filtered();
            if (this.selected && list.find((c) => c.code === this.selected.code)) {
                this.activeValue = this.selected.code;
            } else if (list.length > 0) {
                this.activeValue = list[0].code;
            } else {
                this.activeValue = null;
            }
            // After render, move focus into the search input so the user can
            // start typing immediately. The $nextTick is important: the
            // panel is gated by `x-show` and needs a tick to be displayed.
            this.$nextTick(() => {
                if (this.$refs.search && typeof this.$refs.search.focus === 'function') {
                    this.$refs.search.focus();
                }
                this.scrollActiveIntoView();
            });
        },

        close() {
            if (!this.open) return;
            this.open = false;
            this.filter = '';
            this.activeValue = null;
            this.restoreFocus();
        },

        // Focus the trigger back. Called from every close path except
        // outside-click (where stealing focus would disrupt the user's new
        // target).
        restoreFocus() {
            if (this.$refs.trigger && typeof this.$refs.trigger.focus === 'function') {
                this.$refs.trigger.focus();
            }
        },

        // Close path for outside-click — no focus restoration.
        closeOnOutside() {
            if (!this.open) return;
            this.open = false;
            this.filter = '';
            this.activeValue = null;
        },

        openAndFocusFirst() {
            if (!this.open) this.openPanel();
            this.$nextTick(() => this.focusFirst());
        },

        openAndFocusLast() {
            if (!this.open) this.openPanel();
            this.$nextTick(() => this.focusLast());
        },

        // ── Roving-focus navigation ──────────────────────────────────────
        focusNext() {
            const list = this.filtered();
            if (list.length === 0) {
                this.activeValue = null;
                return;
            }
            const idx = list.findIndex((c) => c.code === this.activeValue);
            const next = idx < 0 ? 0 : (idx + 1) % list.length;
            this.activeValue = list[next].code;
            this.scrollActiveIntoView();
        },

        focusPrev() {
            const list = this.filtered();
            if (list.length === 0) {
                this.activeValue = null;
                return;
            }
            const idx = list.findIndex((c) => c.code === this.activeValue);
            const prev = idx < 0
                ? list.length - 1
                : (idx - 1 + list.length) % list.length;
            this.activeValue = list[prev].code;
            this.scrollActiveIntoView();
        },

        focusFirst() {
            const list = this.filtered();
            if (list.length === 0) {
                this.activeValue = null;
                return;
            }
            this.activeValue = list[0].code;
            this.scrollActiveIntoView();
        },

        focusLast() {
            const list = this.filtered();
            if (list.length === 0) {
                this.activeValue = null;
                return;
            }
            this.activeValue = list[list.length - 1].code;
            this.scrollActiveIntoView();
        },

        scrollActiveIntoView() {
            if (!this.open || !this.activeValue) return;
            const el = document.getElementById(this.optionId(this.activeValue));
            if (el && typeof el.scrollIntoView === 'function') {
                el.scrollIntoView({ block: 'nearest' });
            }
        },

        // ── Selection ────────────────────────────────────────────────────
        pick(country) {
            this.selected = country;
            this.open = false;
            this.filter = '';
            this.activeValue = null;
            this.$dispatch('country:change', { country });
            this.restoreFocus();
        },

        // Enter pressed in the search input: pick whichever option is
        // currently highlighted via activeValue.
        pickActive() {
            if (!this.activeValue) return;
            const country = this.countries.find((c) => c.code === this.activeValue);
            if (country) this.pick(country);
        },

        // Returns a filtered view of countries. Case-insensitive, matches
        // English name, native name, and dial code.
        filtered() {
            const q = this.filter.trim().toLowerCase();
            if (!q) return this.countries;
            return this.countries.filter((c) =>
                c.name.toLowerCase().includes(q) ||
                (c.native && c.native.toLowerCase().includes(q)) ||
                (c.dial && c.dial.includes(q))
            );
        },
    };
}

// Robust registration (same pattern as dropdown-list and phone-input).
if (window.Alpine && typeof window.Alpine.data === 'function') {
    window.Alpine.data('initCountrySelector', initCountrySelector);
} else {
    window.addEventListener(
        'alpine:init',
        () => window.Alpine.data('initCountrySelector', initCountrySelector),
        { once: true }
    );
}

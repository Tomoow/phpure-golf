// Alpine constructor for a full country selector (all ~250 countries) with
// searchable dropdown. Uses the same country catalog as phone-input.js, plus a
// simple `filter` string so the user can type to narrow the list.
//
// Usage (HTML):
//   <div class="combobox" x-data="initCountrySelector({ defaultCountry: null })">
//       <button type="button" class="form-field" x-on:click="toggle()">
//           <span class="form-field__affix">
//               <span x-show="!selected" …globe icon…></span>
//               <span x-show="selected" x-text="selected && selected.flag"></span>
//           </span>
//           <span class="form-field__input" x-text="selected ? selected.native : 'Select a country'"></span>
//           <span class="form-field__affix"><svg …chevron…/></span>
//       </button>
//       <div class="combobox__panel" x-show="open" x-cloak>
//           <input type="search" x-model="filter" placeholder="Search…" />
//           <ul class="dropdown-list" role="listbox">
//               <template x-for="c in filtered()" :key="c.code">
//                   <li class="dropdown-list__item" role="option"
//                       :aria-selected="selected && selected.code === c.code"
//                       x-on:click="pick(c)">
//                       <span class="dropdown-list__leading" x-text="c.flag"></span>
//                       <span class="dropdown-list__label" x-text="c.native"></span>
//                   </li>
//               </template>
//               <template x-if="filtered().length === 0">
//                   <li class="dropdown-list__empty" role="presentation">No results</li>
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

        toggle() {
            this.open = !this.open;
            if (!this.open) this.filter = '';
        },

        close() {
            this.open = false;
            this.filter = '';
        },

        pick(country) {
            this.selected = country;
            this.close();
            this.$dispatch('country:change', { country });
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

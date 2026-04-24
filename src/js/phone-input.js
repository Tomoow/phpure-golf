// Alpine constructor for a phone-number input — format-as-you-type via
// `libphonenumber-js`'s `AsYouType`, plus a country-code picker that lists
// dial codes. Dispatches `phone:change` with { country, number, e164 } when
// either the country or the number changes.
//
// Usage (HTML):
//   <div class="form-field" x-data="initPhoneInput({ defaultCountry: 'BE' })">
//       <!-- Country-code trigger. Opens a small dial-code picker. -->
//       <div class="combobox combobox--auto" x-on:click.outside="closePicker()">
//           <button type="button" class="form-field__affix combobox__trigger"
//                   aria-haspopup="listbox"
//                   :aria-expanded="pickerOpen"
//                   x-on:click="togglePicker()">
//               <span x-text="selected.flag"></span>
//               <span x-text="selected.dial"></span>
//               <svg class="size-5 combobox__chevron" …></svg>
//           </button>
//           <div class="combobox__panel" x-show="pickerOpen" x-cloak>
//               <ul class="dropdown-list" role="listbox">
//                   <template x-for="c in uniqueDialCountries" :key="c.code">
//                       <li class="dropdown-list__item" role="option"
//                           :aria-selected="selected.code === c.code"
//                           x-on:click="pickCountry(c)">
//                           <span class="dropdown-list__leading" x-text="c.flag"></span>
//                           <span class="dropdown-list__label" x-text="`${c.native} (${c.dial})`"></span>
//                       </li>
//                   </template>
//               </ul>
//           </div>
//       </div>
//       <input type="tel" class="form-field__input"
//              :value="national"
//              x-on:input="onInput($event.target.value)"
//              placeholder="4 123 45 67" />
//   </div>

import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';
import { countriesPopularFirst, countryByCode } from './country-data.js';

// Distinct dial-code list — some countries share +1 etc.; we keep the first
// (popular-first) occurrence so the picker doesn't have 30 +1 entries.
const uniqueDialCountries = (() => {
    const seen = new Set();
    const out = [];
    for (const c of countriesPopularFirst) {
        if (seen.has(c.dial)) continue;
        seen.add(c.dial);
        out.push(c);
    }
    return out;
})();

function initPhoneInput(opts = {}) {
    const defaultCountry = opts.defaultCountry || 'BE';
    return {
        uniqueDialCountries,
        selected: countryByCode(defaultCountry) || uniqueDialCountries[0],
        national: '',   // user-visible national portion, formatted as they type
        e164: '',       // canonical E.164 (+32412345678) for form submission
        pickerOpen: false,

        togglePicker() { this.pickerOpen = !this.pickerOpen; },
        closePicker() { this.pickerOpen = false; },

        pickCountry(country) {
            this.selected = country;
            this.closePicker();
            // Re-format the existing national number with the new country.
            this.reformat();
            this.emit();
        },

        onInput(raw) {
            this.national = this.formatAsYouType(raw);
            this.updateE164();
            this.emit();
        },

        formatAsYouType(raw) {
            const formatter = new AsYouType(this.selected.code);
            return formatter.input(raw);
        },

        reformat() {
            this.national = this.formatAsYouType(this.national);
            this.updateE164();
        },

        updateE164() {
            const digits = this.national.replace(/\D+/g, '');
            if (!digits) {
                this.e164 = '';
                return;
            }
            let dial;
            try {
                dial = '+' + getCountryCallingCode(this.selected.code);
            } catch (e) {
                dial = this.selected.dial || '';
            }
            this.e164 = dial + digits;
        },

        emit() {
            this.$dispatch('phone:change', {
                country: this.selected.code,
                national: this.national,
                e164: this.e164,
            });
        },
    };
}

// Robust registration (same pattern as dropdown-list).
if (window.Alpine && typeof window.Alpine.data === 'function') {
    window.Alpine.data('initPhoneInput', initPhoneInput);
} else {
    window.addEventListener(
        'alpine:init',
        () => window.Alpine.data('initPhoneInput', initPhoneInput),
        { once: true }
    );
}

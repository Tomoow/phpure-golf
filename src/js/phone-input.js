// Alpine constructor for a phone-number input — format-as-you-type via
// `libphonenumber-js`'s `AsYouType`, plus a country-code picker that lists
// dial codes. Dispatches `phone:change` with { country, number, e164 } when
// either the country or the number changes.
//
// Accessibility (WAI-ARIA 1.2 combobox) for the country-code picker:
//   • The trigger carries `role="combobox"`, `aria-haspopup="listbox"`,
//     `:aria-expanded="pickerOpen"`, `:aria-controls="listboxId"`,
//     `:aria-activedescendant="activeOptionId"`, and `:aria-labelledby="labelId"`
//     pointing at a hidden `<span>` carrying stable context text
//     ("Country code: <flag> <dial>") so screen readers announce the current
//     selection without stuttering on every re-render (A11Y-026).
//   • ArrowDown/ArrowUp/Enter/Space/Escape work from the trigger.
//   • On close (Escape, outside-click, selection) focus is restored to the
//     trigger via `$refs.trigger?.focus()` (A11Y-005).

import { AsYouType, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
// Per-country example phone numbers (mobile) shipped with libphonenumber-js.
// Used to generate a real-format placeholder so the user sees what a number
// for the currently selected country actually looks like — e.g. BE renders
// `0470 12 34 56`, NL renders `06 12345678`, FR renders `06 12 34 56 78`.
import mobileExamples from 'libphonenumber-js/examples.mobile.json';
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
        // The code of the currently-highlighted option, or null when nothing
        // is active. Drives `:aria-activedescendant` on the trigger.
        activeValue: null,
        // Stable ids for ARIA wiring.
        listboxId: '',
        labelId: '',

        init() {
            this.listboxId = this.$id('phone-input-listbox');
            this.labelId = this.$id('phone-input-label');
        },

        // ── ARIA id helpers ──────────────────────────────────────────────
        optionId(code) {
            return this.listboxId + '-option-' + code;
        },

        get activeOptionId() {
            if (!this.pickerOpen) return '';
            if (!this.activeValue) return '';
            return this.optionId(this.activeValue);
        },

        // Country-specific placeholder for the `<input type="tel">`. Uses
        // libphonenumber-js's bundled example-mobile-number dataset — so BE
        // renders `0470 12 34 56`, NL renders `06 12345678`, GB renders
        // `07400 123456`, etc. Falls back to an empty string if an example
        // isn't available (rare — libphonenumber ships one for every ISO
        // code we support).
        get placeholder() {
            if (!this.selected) return '';
            try {
                const example = getExampleNumber(this.selected.code, mobileExamples);
                return example ? example.formatNational() : '';
            } catch (e) {
                return '';
            }
        },

        // ── Open / close / toggle ────────────────────────────────────────
        togglePicker() {
            if (this.pickerOpen) {
                this.closePicker();
            } else {
                this.openPicker();
            }
        },

        openPicker() {
            if (this.pickerOpen) return;
            this.pickerOpen = true;
            // Seed activeValue to the selected country so keyboard nav
            // starts from the current selection.
            this.activeValue = this.selected ? this.selected.code : this.uniqueDialCountries[0].code;
            this.$nextTick(() => this.scrollActiveIntoView());
        },

        closePicker() {
            if (!this.pickerOpen) return;
            this.pickerOpen = false;
            this.activeValue = null;
            this.restoreFocus();
        },

        // Outside-click close: no focus restoration (user has already
        // focused somewhere else by clicking).
        closePickerOnOutside() {
            if (!this.pickerOpen) return;
            this.pickerOpen = false;
            this.activeValue = null;
        },

        restoreFocus() {
            if (this.$refs.trigger && typeof this.$refs.trigger.focus === 'function') {
                this.$refs.trigger.focus();
            }
        },

        openAndFocusFirst() {
            if (!this.pickerOpen) this.openPicker();
            this.$nextTick(() => this.focusFirst());
        },

        openAndFocusLast() {
            if (!this.pickerOpen) this.openPicker();
            this.$nextTick(() => this.focusLast());
        },

        // ── Roving-focus navigation ──────────────────────────────────────
        focusNext() {
            const list = this.uniqueDialCountries;
            if (list.length === 0) { this.activeValue = null; return; }
            const idx = list.findIndex((c) => c.code === this.activeValue);
            const next = idx < 0 ? 0 : (idx + 1) % list.length;
            this.activeValue = list[next].code;
            this.scrollActiveIntoView();
        },

        focusPrev() {
            const list = this.uniqueDialCountries;
            if (list.length === 0) { this.activeValue = null; return; }
            const idx = list.findIndex((c) => c.code === this.activeValue);
            const prev = idx < 0
                ? list.length - 1
                : (idx - 1 + list.length) % list.length;
            this.activeValue = list[prev].code;
            this.scrollActiveIntoView();
        },

        focusFirst() {
            const list = this.uniqueDialCountries;
            if (list.length === 0) { this.activeValue = null; return; }
            this.activeValue = list[0].code;
            this.scrollActiveIntoView();
        },

        focusLast() {
            const list = this.uniqueDialCountries;
            if (list.length === 0) { this.activeValue = null; return; }
            this.activeValue = list[list.length - 1].code;
            this.scrollActiveIntoView();
        },

        scrollActiveIntoView() {
            if (!this.pickerOpen || !this.activeValue) return;
            const el = document.getElementById(this.optionId(this.activeValue));
            if (el && typeof el.scrollIntoView === 'function') {
                el.scrollIntoView({ block: 'nearest' });
            }
        },

        // ── Selection ────────────────────────────────────────────────────
        pickCountry(country) {
            this.selected = country;
            this.pickerOpen = false;
            this.activeValue = null;
            // Re-format the existing national number with the new country.
            this.reformat();
            this.emit();
            this.restoreFocus();
        },

        pickActive() {
            if (!this.activeValue) return;
            const country = this.uniqueDialCountries.find((c) => c.code === this.activeValue);
            if (country) this.pickCountry(country);
        },

        // ── Input handling ───────────────────────────────────────────────
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

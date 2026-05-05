// Country catalog sourced from `world-countries` (ISO 3166-1 alpha-2 / alpha-3
// / M49 codes, calling codes, native names, flag emojis). Reshaped into a flat
// list we can feed into the dropdown-list component.
//
// Shape of each entry:
//   { code: 'BE',            // ISO alpha-2
//     name: 'Belgium',       // English common name
//     native: 'België',      // Native-language common name
//     flag: '🇧🇪',            // Emoji flag (two regional-indicator chars)
//     dial: '+32' }          // E.164 dial code
//
// The dial-code list is de-duplicated for the phone-input picker (some
// countries share the same dial code; we keep one representative each).

import all from 'world-countries';

function primaryNative(nativeName) {
    if (!nativeName) return null;
    const firstLang = Object.values(nativeName)[0];
    return firstLang && (firstLang.common || firstLang.official);
}

function primaryDial(idd) {
    if (!idd || !idd.root) return null;
    // idd.root: "+32", idd.suffixes: [""] | ["90", "91"] etc.
    // For selection UX we want the canonical country dial code (no suffix).
    return idd.root + (idd.suffixes && idd.suffixes.length === 1 && idd.suffixes[0] ? idd.suffixes[0] : '');
}

export const countries = all
    .map((c) => ({
        code: c.cca2,
        name: c.name && c.name.common,
        native: primaryNative(c.name && c.name.nativeName) || (c.name && c.name.common),
        flag: c.flag,
        dial: primaryDial(c.idd),
    }))
    .filter((c) => c.code && c.name && c.dial)
    .sort((a, b) => a.name.localeCompare(b.name));

// Useful "popular" ordering — these bubble to the top of the picker by default.
const POPULAR = ['BE', 'NL', 'LU', 'FR', 'DE', 'GB', 'US', 'ES', 'IT'];

export const countriesPopularFirst = [
    ...POPULAR.map((code) => countries.find((c) => c.code === code)).filter(Boolean),
    ...countries.filter((c) => !POPULAR.includes(c.code)),
];

// Lookup helpers
export function countryByCode(code) {
    return countries.find((c) => c.code === code);
}

export function countryByDial(dial) {
    return countries.find((c) => c.dial === dial);
}

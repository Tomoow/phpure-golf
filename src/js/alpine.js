// Single shared Alpine bootstrap for every preview page.
// Preview HTML files import this as a module so Alpine is never loaded from a CDN,
// matching the CSP-compliant approach the dev team uses in the live Hyvä theme.

import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';

Alpine.plugin(collapse);
Alpine.plugin(focus);

window.Alpine = Alpine;
Alpine.start();

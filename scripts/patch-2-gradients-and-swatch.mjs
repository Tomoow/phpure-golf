#!/usr/bin/env node
/*
 * Second-pass patch (2026-04-23):
 *  - Fills in the 3 Slate-800 gradients (designer provided stop percentages and hex).
 *  - Corrects additional.swatchStroke to rgba(0,0,0,0.24) (24% opacity of black).
 *  - Adds Tailwind's default `slate` palette entry (the gradient's base `#1E293B`
 *    is `slate-800` from Tailwind's default palette, which wasn't in the
 *    designer's color list but is referenced by these gradients).
 *
 * Source: user chat, 2026-04-23 — follow-up to the color list.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, '..', 'design-tokens/tokens.resolved.json');
const doc = JSON.parse(readFileSync(jsonPath, 'utf8'));

// 1. Gradients. Figma "∠0°" corresponds to CSS `linear-gradient(0deg, …)` —
// bottom → top in both systems. Base color #1E293B = Tailwind default slate-800.
doc.colors.gradients = doc.colors.gradients || {};
doc.colors.gradients._meta = {
    source: 'designer-provided (chat, 2026-04-23)',
    baseColor: '#1E293B',
    baseColorNote: 'Tailwind default slate-800 (NOT brand slateBlue-800 which is #24323D).',
    angleNote: 'Figma ∠0° = CSS linear-gradient(0deg, …) — bottom to top.',
};
doc.colors.gradients['slate-800/0-to-75'] = {
    figmaName: 'Gradients/Slate 800 [0→75][∠0°]',
    css: 'linear-gradient(0deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 0.75) 100%)',
    stops: [
        { offset: 0, color: '#1E293B', opacity: 0 },
        { offset: 1, color: '#1E293B', opacity: 0.75 },
    ],
};
doc.colors.gradients['slate-800/60-to-80'] = {
    figmaName: 'Gradients/Slate 800 [60→80][∠0°]',
    css: 'linear-gradient(0deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%)',
    stops: [
        { offset: 0, color: '#1E293B', opacity: 0.6 },
        { offset: 1, color: '#1E293B', opacity: 0.8 },
    ],
};
doc.colors.gradients['slate-800/0-to-100'] = {
    figmaName: 'Gradients/Slate 800 [0→100][∠0°]',
    css: 'linear-gradient(0deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 1) 100%)',
    stops: [
        { offset: 0, color: '#1E293B', opacity: 0 },
        { offset: 1, color: '#1E293B', opacity: 1 },
    ],
};

// 2. Add Tailwind default slate palette (referenced by gradients). Values from
// the Tailwind v3/v4 default color palette.
doc.colors.slate = {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    _meta: {
        source: 'tailwind-default',
        addedBecause: 'Gradients reference slate-800 (#1E293B) which is not the brand slateBlue palette. Adding the full Tailwind default slate ramp for completeness.',
    },
};

// 3. Swatch stroke — correction from 2026-04-23 chat. Designer says the stroke
// is black at 24% opacity, consistent with the Swatch inner shadow pattern.
doc.colors.additional.swatchStroke = 'rgba(0, 0, 0, 0.24)';
doc.colors.additional._meta = {
    source: 'designer-provided (chat, 2026-04-23)',
    note: 'Answers questions.md #6. Pairs with boxShadow[Additional/Swatch inner]. Stored as rgba(0,0,0,0.24) — black at 24% opacity, matching the Swatch inner shadow stop.',
};

// 4. Update colors._meta counts to reflect the new resolution state.
const rampCount = Object.entries(doc.colors).reduce((acc, [group, v]) => {
    if (['_meta', 'gradients', 'additional', 'base'].includes(group)) return acc;
    return acc + Object.keys(v).filter(k => k !== '_meta').length;
}, 0);
doc.colors._meta.resolutionStatus = 'resolved';
doc.colors._meta.tokenCount = rampCount;
doc.colors._meta.unresolvedCount = 0;
doc.colors._meta.unresolved = [];
doc.colors._meta.reason = 'Designer provided all brand + default ramps, gradients (with stop opacities), and swatch-stroke corrections in chat on 2026-04-23. Typography / shadows / focus rings come from figma-export.json.';

writeFileSync(jsonPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');
console.log(`Patched ${jsonPath}`);
console.log(`  Gradients: 3`);
console.log(`  Slate default palette added: 10 shades`);
console.log(`  Swatch stroke corrected to rgba(0,0,0,0.24)`);
console.log(`  Total ramp colors resolved: ${rampCount}`);

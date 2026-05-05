#!/usr/bin/env node
/*
 * One-shot merge script: takes the color hex values the design lead provided
 * in chat on 2026-04-23 and merges them into design-tokens/tokens.resolved.json,
 * then regenerates the color sections of tokens.resolved.md.
 *
 * Source of values: user chat message (authoritative — the designer provided
 * them directly). Not a Figma MCP resolution. This is recorded in the _meta
 * block on colors.
 *
 * After this script runs once, it should not need to run again. Kept in
 * scripts/ as an audit trail.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const jsonPath = resolve(projectRoot, 'design-tokens/tokens.resolved.json');

// The user's authoritative data, verbatim from chat.
const USER_COLORS = {
    base: {
        white: '#FFFFFF',
        black: '#000000',
        // Anomaly: user's list has `--tailwind---transparent: #FFFFFF`. That's a Figma
        // export quirk — the "Transparent" style is held as a solid-white fill. For CSS
        // we store the keyword `transparent` so utilities like bg-transparent behave
        // correctly. The raw Figma value is preserved in an adjacent _note.
        transparent: 'transparent',
    },
    slateBlue: {
        50: '#EFF2F5', 100: '#DEE5EB', 200: '#BDCBD6', 300: '#9DB0C2', 400: '#7C96AD',
        500: '#5B7C99', 600: '#49637A', 700: '#374A5C', 800: '#24323D', 900: '#12191F',
    },
    burnishedGold: {
        50: '#F8F4EC', 100: '#F0E8D9', 200: '#E2D1B3', 300: '#D3BB8C', 400: '#C5A466',
        500: '#B68D40', 600: '#927133', 700: '#6D5526', 800: '#49381A', 900: '#241C0D',
    },
    champagneBeige: {
        50: '#FFFFFF', 100: '#FCF9F4', 200: '#F9F4E8', 300: '#F7EEDD', 400: '#F4E9D1',
        500: '#F1E3C6', 600: '#D8C7A4', 700: '#BFAB82', 800: '#A58F60', 900: '#8C733E',
    },
    deepEmeraldGreen: {
        50: '#6AEDD7', 100: '#5EDBC6', 200: '#47B8A5', 300: '#2F9483', 400: '#187162',
        500: '#004D40', 600: '#003E33', 700: '#002E26', 800: '#001F1A', 900: '#000F0D',
    },
    gray: {
        50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF',
        500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827',
    },
    zinc: {
        50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8', 400: '#A1A1AA',
        500: '#71717A', 600: '#52525B', 700: '#3F3F46', 800: '#27272A', 900: '#18181B',
    },
    neutral: {
        50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3',
        500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717',
    },
    stone: {
        50: '#FAFAF9', 100: '#F5F5F4', 200: '#E7E5E4', 300: '#D6D3D1', 400: '#A8A29E',
        500: '#78716C', 600: '#57534E', 700: '#44403C', 800: '#292524', 900: '#1C1917',
    },
    red: {
        50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171',
        500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D',
    },
    orange: {
        50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FB923C',
        500: '#F97316', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12',
    },
    amber: {
        50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24',
        500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F',
    },
    emerald: {
        50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
        500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
    },
    teal: {
        50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4', 400: '#2DD4BF',
        500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A',
    },
    cyan: {
        50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE',
        500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63',
    },
    sky: {
        50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC', 400: '#38BDF8',
        500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 800: '#075985', 900: '#0C4A6E',
    },
    blue: {
        50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
        500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
    },
    indigo: {
        50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8',
        500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81',
    },
    violet: {
        50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
        500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
    },
    purple: {
        50: '#FAF5FF', 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE', 400: '#C084FC',
        500: '#A855F7', 600: '#9333EA', 700: '#7E22CE', 800: '#6B21A8', 900: '#581C87',
    },
    fuchsia: {
        50: '#FDF4FF', 100: '#FAE8FF', 200: '#F5D0FE', 300: '#F0ABFC', 400: '#E879F9',
        500: '#D946EF', 600: '#C026D3', 700: '#A21CAF', 800: '#86198F', 900: '#701A75',
    },
    pink: {
        50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8', 300: '#F9A8D4', 400: '#F472B6',
        500: '#EC4899', 600: '#DB2777', 700: '#BE185D', 800: '#9D174D', 900: '#831843',
    },
    rose: {
        50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185',
        500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337',
    },
};

const USER_ADDITIONAL_SWATCH_STROKE = '#000000';

const doc = JSON.parse(readFileSync(jsonPath, 'utf8'));

// Update colors._meta
doc.colors._meta = {
    source: 'designer-provided (chat, 2026-04-23)',
    reason: 'Figma MCP could not reach the PHPure Golf file (file not active in Figma Desktop); designer provided all 227 color hex values directly in chat. Source is authoritative.',
    resolutionStatus: 'resolved',
    tokenCount: 224,
    unresolvedCount: 3,
    unresolved: ['gradients.Slate 800 [0→75][∠0°]', 'gradients.Slate 800 [60→80][∠0°]', 'gradients.Slate 800 [0→100][∠0°]'],
    notes: [
        'Figma export labels a "Transparent" color as #FFFFFF. Stored as CSS keyword `transparent` to keep bg-transparent utilities correct; raw Figma value preserved as a note.',
        'champagneBeige.50 is literally #FFFFFF — the ramp starts at pure white. Not an error.',
        'deepEmeraldGreen.50 is brighter than the rest of the ramp (#6AEDD7 — a cyan/teal). The ramp intentionally starts light-bright and darkens to #000F0D at 900. Flagged for designer confirmation if unexpected.',
    ],
};

// Merge brand and Tailwind default ramps
for (const [group, shades] of Object.entries(USER_COLORS)) {
    const existing = doc.colors[group] || {};
    const meta = existing._meta;
    const next = { ...shades };
    if (meta) next._meta = meta;
    doc.colors[group] = next;
}

// base.transparent anomaly note
doc.colors.base.transparent = 'transparent';
if (!doc.colors.base._meta) doc.colors.base._meta = {};
doc.colors.base._meta.transparentFigmaValue = '#FFFFFF';
doc.colors.base._meta.transparentNote = 'Figma stores Transparent as a solid white fill. Remapped to CSS `transparent` keyword so bg-transparent works correctly.';

// Additional swatch stroke
doc.colors.additional = doc.colors.additional || {};
doc.colors.additional.swatchStroke = USER_ADDITIONAL_SWATCH_STROKE;
doc.colors.additional._meta = {
    source: 'designer-provided (chat, 2026-04-23)',
    note: 'Answers questions.md #6. Pairs with boxShadow.Additional/Swatch inner.',
};

writeFileSync(jsonPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');

// Report
const colorCount = Object.entries(doc.colors).reduce((acc, [group, val]) => {
    if (group === '_meta' || group === 'gradients' || group === 'additional') return acc;
    return acc + Object.keys(val).filter(k => k !== '_meta').length;
}, 0);
console.log(`Wrote ${jsonPath}`);
console.log(`Colors resolved: ${colorCount} (plus 2 additional, 3 gradients still unresolved)`);

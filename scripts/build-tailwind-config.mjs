#!/usr/bin/env node
/*
 * build-tailwind-config.mjs
 *
 * Reads design-tokens/tokens.resolved.json, emits src/css/theme.css — the
 * Tailwind v4 @theme block that every generated component compiles against.
 *
 * Tailwind v4 note: there is no tailwind.config.js in v4. The @theme block in
 * CSS is the authoritative source for custom tokens. This script exists so that
 * tokens.resolved.json stays the one editable token file and theme.css stays a
 * pure generated artifact.
 *
 * ── SAFETY ──────────────────────────────────────────────────────────────────
 * The script refuses to emit concrete token values when tokens.resolved.json
 * still contains the null-valued placeholders produced by the Phase 0 resolver
 * (see design-tokens/questions.md entry #1). If a color ramp has null values,
 * the script exits with a non-zero status and prints the offending keys so we
 * don't silently ship a theme.css full of empty colors.
 *
 * Override with --allow-nulls only if you're deliberately regenerating in a
 * pre-token state — it writes a placeholder file explaining the situation.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const tokensPath = resolve(projectRoot, 'design-tokens/tokens.resolved.json');
const themeOut = resolve(projectRoot, 'src/css/theme.css');

const allowNulls = process.argv.includes('--allow-nulls');

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

function flattenColors(colorsObj) {
    // Input: { slateBlue: { "50": "#EFF2F5", ... }, gray: { "50": "#..." }, gradients: {...}, additional: {...} }
    // Output: { "slate-blue-50": "#EFF2F5", ..., "additional-swatch-stroke": "rgba(...)" }
    // Skips: "_meta", "gradients" (handled separately → --background-image-*).
    // Special-cases: "base" → direct names (white/black/transparent),
    //                "additional" → "additional-<key>" form.
    const out = {};
    const unresolved = [];
    for (const [group, shades] of Object.entries(colorsObj)) {
        if (group === '_meta' || group === 'gradients') continue;
        if (group === 'base') {
            for (const [name, value] of Object.entries(shades)) {
                if (name === '_meta') continue;
                if (typeof value !== 'string') {
                    unresolved.push(`base.${name}`);
                    continue;
                }
                out[kebab(name)] = value;
            }
            continue;
        }
        if (group === 'additional') {
            for (const [name, value] of Object.entries(shades)) {
                if (name === '_meta') continue;
                if (typeof value !== 'string') continue;
                out[`additional-${kebab(name)}`] = value;
            }
            continue;
        }
        const groupKey = kebab(group);
        for (const [shade, value] of Object.entries(shades)) {
            if (shade === '_meta') continue;
            if (value == null) {
                unresolved.push(`${group}.${shade}`);
                continue;
            }
            if (typeof value !== 'string') continue; // defensive — skip complex objects
            out[`${groupKey}-${shade}`] = value;
        }
    }
    return { flat: out, unresolved };
}

function flattenGradients(colorsObj) {
    // gradients: { "slate-800/0-to-75": { css: "...", stops: [...] }, ... }
    const out = {};
    const gradients = colorsObj.gradients || {};
    for (const [name, data] of Object.entries(gradients)) {
        if (name === '_meta') continue;
        if (data && typeof data.css === 'string') {
            const key = name.replace(/\//g, '-');
            out[key] = data.css;
        }
    }
    return out;
}

function kebab(s) {
    return s
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

function buildBlock() {
    const lines = [];
    lines.push('/* THIS FILE IS GENERATED from design-tokens/tokens.resolved.json.');
    lines.push(' * Run `npm run tokens:build` to regenerate. Do not hand-edit.');
    lines.push(' */');
    lines.push('');
    lines.push('@theme {');

    // Font families — always DM Sans per the POC override.
    lines.push('    /* Fonts — single family (DM Sans) for the POC. */');
    lines.push("    --font-sans: 'DM Sans', system-ui, sans-serif;");
    lines.push("    --font-serif: 'DM Sans', system-ui, sans-serif;");
    lines.push("    --font-mono: 'DM Sans', ui-monospace, monospace;");
    lines.push('');

    // Colors.
    const { flat, unresolved } = flattenColors(tokens.colors || {});
    if (unresolved.length && !allowNulls) {
        console.error('\n  Error: tokens.resolved.json has unresolved color values.\n');
        console.error('  The following keys have null hex values:\n');
        for (const k of unresolved.slice(0, 30)) console.error(`    - ${k}`);
        if (unresolved.length > 30) console.error(`    ... and ${unresolved.length - 30} more`);
        console.error('\n  Resolve them via the Figma MCP (see design-tokens/questions.md #1)');
        console.error('  and re-run. To bypass for a placeholder build, pass --allow-nulls.\n');
        process.exit(1);
    }
    if (Object.keys(flat).length) {
        lines.push('    /* Colors — resolved from Figma via figma-extractor + designer chat. */');
        for (const [name, value] of Object.entries(flat)) {
            lines.push(`    --color-${name}: ${value};`);
        }
        lines.push('');
    }

    // Gradients (Tailwind v4 background-image tokens).
    const gradients = flattenGradients(tokens.colors || {});
    if (Object.keys(gradients).length) {
        lines.push('    /* Gradients — CSS background-image tokens. */');
        for (const [name, value] of Object.entries(gradients)) {
            lines.push(`    --background-image-${name}: ${value};`);
        }
        lines.push('');
    }

    // Spacing (usually Tailwind defaults — emit only if explicitly present).
    // Tailwind v4's `--spacing(N)` CSS function expects a base `--spacing` variable
    // (default 0.25rem). Emitting individual `--spacing-N` entries alone is not
    // enough — the function fails with "--spacing theme variable not found" unless
    // the base is also declared. We emit both: the base for `--spacing(N)` usage,
    // plus every concrete `--spacing-N` for `var(--spacing-N)` references.
    if (tokens.spacing && Object.keys(tokens.spacing).filter(k => k !== '_meta').length) {
        lines.push('    /* Spacing. The base `--spacing` underpins Tailwind v4\'s --spacing(N) function. */');
        lines.push('    --spacing: 0.25rem;');
        for (const [k, v] of Object.entries(tokens.spacing)) {
            if (k === '_meta') continue;
            lines.push(`    --spacing-${kebab(k)}: ${v};`);
        }
        lines.push('');
    }

    // Border radius.
    if (tokens.borderRadius && Object.keys(tokens.borderRadius).filter(k => k !== '_meta').length) {
        lines.push('    /* Border radius. */');
        for (const [k, v] of Object.entries(tokens.borderRadius)) {
            if (k === '_meta') continue;
            lines.push(`    --radius-${kebab(k)}: ${v};`);
        }
        lines.push('');
    }

    // Box shadow.
    if (tokens.boxShadow && Object.keys(tokens.boxShadow).filter(k => k !== '_meta').length) {
        lines.push('    /* Shadows and focus rings. */');
        for (const [k, v] of Object.entries(tokens.boxShadow)) {
            if (k === '_meta') continue;
            lines.push(`    --shadow-${kebab(k)}: ${v};`);
        }
        lines.push('');
    }

    lines.push('}');
    lines.push('');

    return { content: lines.join('\n'), unresolvedCount: unresolved.length };
}

const { content, unresolvedCount } = buildBlock();
writeFileSync(themeOut, content, 'utf8');

const note = unresolvedCount
    ? ` (with ${unresolvedCount} unresolved tokens skipped — --allow-nulls)`
    : '';
console.log(`Wrote ${themeOut}${note}`);

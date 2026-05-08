# Review — form-checkbox/A-basic

**Date:** 2026-05-08
**Reviewer:** component-reviewer (automated)
**Verdict:** PASS

## Summary

The form-checkbox atom faithfully implements the spec, integrating all six designer decisions (Q#28–#33) baked into a single `@utility form-checkbox` shell driven by `:has()` state selectors and CSS custom properties. Architecture mirrors the approved form-field shell: state cascade flows through slot tokens (`--check-bg`, `--check-border`, `--check-glyph`, `--check-focus-ring`, `--check-focus-outline`), with size and feedback modifiers overriding only what they need. Native `<input type="checkbox">` is preserved (visually hidden via `opacity:0` + `position:absolute`, NOT `display:none`), keyboard reachability is intact even when disabled, and the indeterminate visual is a CSS-only `::after` bar — no SVG asset needed. Preview renders all 12 cells of the M-size state matrix plus size ladder, stacked-with-hint, four feedback modifiers, an interactive section, and a `<fieldset>+<legend>` group. Preview-only `force-*` scaffold classes are documented in the `<style>` block as mirrors of the real selectors. Visual parity with Figma node `1420:30806` confirmed via screenshot — the rendered state matrix matches the Figma component set's structure (variants × states), with the documented WCAG fixes (slate-blue-500 unchecked border, indeterminate visual, invalid border) applied per spec §3.3.

## Findings

### Spec conformance
- [x] All variants rendered in preview.html (Unchecked / Checked / Indeterminate × Default / Hover / Focus / Disabled = 12 cells, plus invalid + invalid-focus)
- [x] All states rendered or documented (force-hover/focus/disabled/checked/indeterminate scaffolds in preview `<style>`, plus interactive live cells exercising real selectors)
- [x] Token references match (every value resolves to `--color-*`, `--shadow-focus/*`, `--spacing-*`, `--radius-base`, `--font-sans`)

### Hyvä conventions
- [x] Folder structure matches kit (`src/web/tailwind/components/form-checkbox.css`, parallel to buttons/A-basic and form-field/A-basic)
- [x] Escaping correct in PHTML (n/a — atom is CSS-only, no PHTML)
- [x] Layout XML valid (n/a — atom is CSS-only)
- [x] CSS uses `@utility` (16 `@utility` blocks: form-checkbox, __input, __box, __text, __label, __hint, __required, --sm, --lg, --error, --warning, --success, -group, -group__legend; plus 3 `.form-checkbox:has(...)` glyph-reveal rules — necessary cross-element selectors that can't be expressed in a single `@utility`)

### Accessibility
- [x] Keyboard reachable (native `<input>` retained, `opacity:0` + `position:absolute`, never `display:none`; disabled keeps tab-reachability per Q#31, no `pointer-events:none`)
- [x] Focus ring visible (`box-shadow: var(--check-focus-ring)` + `outline: 2px solid var(--check-focus-outline)` with `outline-offset: 2px` — emerald-500 default 9.83:1, rose-700 invalid 6.37:1, both pass WCAG 2.4.11)
- [x] ARIA correct (`aria-invalid="true"` drives invalid visual; `aria-describedby` wired to hint id; `aria-hidden="true"` on visual `__box` and decorative `__required` asterisk; `<fieldset>` + `<legend>` for groups)
- [x] Semantic HTML (`<label>` wrapper, native `<input type="checkbox">`, `<fieldset>` + `<legend>` for groups; touch target `padding-block: --spacing-1` on S/M to reach ≥24×24 px per WCAG 2.5.8, suppressed on L)

### CSP
- [x] No inline `<script>` with behavior beyond seeding (only `<script type="module">` at preview.html:734-737, body is `el.indeterminate = true` — explicitly allowed and CSP-safe; same one-liner documented in README:135-138)
- [x] No inline event handlers (grep for `on(click|change|submit|input|focus|blur|load|mouse|key)=` returned 0 hits across all 4 files)
- [x] No `javascript:` URLs (grep returned 0 hits)

### Sync
- [x] PHTML/CSS and preview.html class lists identical (40 unique classes in preview; all `form-checkbox*` classes resolve to `@utility` blocks in form-checkbox.css; `force-*`/`page`/`matrix`/`stack`/`cell`/`group`/`ladder`/`caption`/`note`/`lede`/`section`/`col-head`/`row-head` are preview-scaffold classes defined in preview's own `<style>` block, explicitly marked "preview-only scaffolding")
- [x] DOM structures match (every checkbox in preview uses the documented `<label> > <input> + <span class="form-checkbox__box"> > <svg> + <span class="form-checkbox__text"> > <span class="form-checkbox__label"> [+ <span class="form-checkbox__hint">]` pattern, matching README §Layout examples verbatim)
- [x] Alpine directives identical (n/a — no Alpine; preview's `[x-cloak]` defensive style is unused)

### Lint
- [x] token-linter PASS (lint-report.md verdict PASS, 0 findings; `style="` grep across preview + README + CSS returned 0 hits)

## Punch list (if FAIL)

(none — verdict is PASS)

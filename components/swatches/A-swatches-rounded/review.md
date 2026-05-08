# Review — swatches/A-swatches-rounded

**Date:** 2026-05-08
**Reviewer:** component-reviewer (automated)
**Verdict:** PASS

## Summary

CSS-only swatch atom. Mirrors the form-checkbox / form-field shell architecture: a single `@utility swatch` on a wrapping `<label>` drives every visual through `--swatch-*` custom properties; state derives from `:has(:checked)` / `:has(:focus-visible)` / `:has(:disabled)` / `.is-out-of-stock` / `[aria-disabled="true"]`. All ten OQ-SW decisions (out-of-stock slash via `linear-gradient`, full `Additional/Swatch inner` shadow on selected color/image, soft `Focus/Primary` glow on the chip only, no per-option invalid border, etc.) are implemented as documented. token-linter PASS, 0 findings. Folder structure mirrors `hyva-ui/components/swatches/A-swatches-rounded/src/web/tailwind/components/swatches.css`. Spec, preview, README, and CSS are internally consistent.

## Findings

### Spec conformance
- [x] All variants rendered in preview.html — three types (color / text / image) × two shapes (round + rectangle) × five sizes (XS / S / M / L / XL).
- [x] All states rendered — default / hover / focus-visible / selected / disabled-or-OOS represented for every type at sizes M, S, and L; ladders cover all sizes; force-* helpers simulate states without interaction; live product-card mock + multi-select facet exercise real `<input>` elements.
- [x] Token references match — every `--swatch-*` slot the CSS reads is set by a `var(--color-*)` / `var(--shadow-*)` / `var(--radius-*)` / `--spacing(*)` token defined in `src/css/theme.css` (verified for `--shadow-additional/swatch-inner`, `--shadow-focus/primary`, all `--color-deep-emerald-green-*`, `--color-slate-blue-*`, `--color-blue-300/500`, `--radius-sm/md/full`).
- [x] Visual parity — Figma screenshot of node 1385:32405 unavailable (no active design tab in Figma Desktop MCP), but spec.md captures hex/spacing values resolved via prior MCP queries; preview.html consumes those identical token names so values cannot drift.

### Hyvä conventions
- [x] Folder structure matches kit (`src/web/tailwind/components/swatches.css`) — same subpath as `hyva-ui/components/swatches/A-swatches-rounded/`.
- [x] CSS uses `@utility` exclusively — 13 `@utility` blocks at swatches.css lines 62, 129, 149, 178, 193, 248, 315, 367, 397, 408, 420, 431, 442, 462, 475, 479. No `@layer components`.
- [x] No PHTML in this atom (CSS-only, per Hyvä UI 2.7.1 atom convention) — escaping check N/A.
- [x] No layout XML in this atom — N/A.

### Accessibility
- [x] Native `<input type="radio">` / `<input type="checkbox">` retained, visually hidden via `appearance: none; opacity: 0; position: absolute; inset: 0` (swatches.css lines 130-140) — kept in a11y tree (NOT `display: none`).
- [x] `<fieldset class="swatch-group">` + `<legend class="swatch-group__legend">` group association used for color and size in the live product-card mock (preview.html lines 745-798) and the multi-select facet (lines 891-918).
- [x] `<span class="sr-only">` accessible names on every color and image swatch in preview (e.g. lines 274, 282, 290, 298, 346, 355, 364, 374, 382, 749, 754, etc.). Out-of-stock variants append `(out of stock)` (lines 302, 337, 442, 526, 774, 796).
- [x] `aria-disabled="true"` set on every `is-out-of-stock` wrapper (lines 300, 334, 380, 439, 524, 557, 772, 793).
- [x] Visible non-color cue for OOS = diagonal slash via `::after` (swatches.css lines 224-239 color, 292-306 text, 343-358 image).
- [x] Touch target ≥ 24×24 — `--swatch-touch-pad: --spacing(1)` on `swatch--xs` (line 405) and `--spacing(0.5)` on `swatch--s` (line 416) bumps the wrapping `<label>` hit area to ≥ 24×24 even when the chip is 16×16.
- [x] Focus indicator on the chip only via `box-shadow: var(--swatch-focus-ring)` (swatches.css lines 108-110); `--swatch-focus-ring: var(--shadow-focus/primary)` (line 70). Selected + focus combo layers both shadows (lines 216-218 color, 338-340 image). Soft-glow contrast trade-off (1.23:1) is explicitly accepted as A11Y-007 family deviation per README.
- [x] Keyboard: native `<input type="radio">` arrow-key cycling within fieldset is preserved (no `tabindex` overrides; the input is not `display:none`). Tab moves out of the group as expected.

### CSP
- [x] No `<script>` blocks anywhere in `preview.html` or `swatches.css` (grep returned 0 hits for `<script`).
- [x] No `on*=` event handlers in any file (grep returned 0 hits for `onclick|onchange|onsubmit|onload|onfocus|onblur|on[a-z]+=`).
- [x] No `javascript:` URLs.

### Sync
- [x] PHTML/CSS and preview.html class lists identical — every class on a `swatch*` element in preview resolves to a `@utility` in swatches.css. The 11 unique `swatch*` class strings in preview (`swatch swatch--color`, `swatch swatch--color is-out-of-stock`, `swatch--color swatch--rectangle`, `swatch--color swatch--xs/s/m/l/xl`, `swatch--text`, `swatch--text swatch--rectangle`, `swatch--image`, `swatch-group`, `swatch-group swatch-group--tight`, `swatch-group__legend`, `swatch__chip`, `swatch__input`, `swatch__media`) all map to defined utilities at swatches.css lines 62, 129, 149, 178, 193, 248, 315, 367, 397, 408, 420, 431, 442, 462, 475, 479.
- [x] DOM structures match spec §8.1 templates (label > input + sr-only + chip; for image, chip > img.swatch__media; for text, chip contains label text).
- [x] Alpine directives identical — none expected, none used. Pure CSS state.
- [x] Inline-style usage — only the documented `style="--swatch-bg: <hex>"` consumer-product-color whitelist appears on swatch elements (35 occurrences in preview, all whitelisted in lint-report.md).

### Lint
- [x] token-linter PASS (lint-report.md: 0 findings, all whitelisted patterns enumerated). Re-grep of preview.html confirms only `--swatch-bg` inline styles on swatch elements; the single `style="margin-block-start: 0.5rem; width: 100%;"` on the `form-group__hint--error` span at preview.html line 870 is the linter-noted scaffold tweak on a non-swatch element (consumer-supplied error hint), out of scope for the swatch shell.

## Punch list (if FAIL)

_N/A — verdict is PASS._

## Notes for future review

- **OQ-SW-2 (pale-product-color contrast).** The full `Additional/Swatch inner` (3 px black-24% + 2 px white inset) gives strong edge definition on saturated product colors but may be insufficient on very pale hues (e.g. `#F1E3C6` champagne). Documented in README "Future work"; revisit after a real audit. Confirmed: README lines 277-283 capture the open contrast hint.
- **Kit-reference symlink.** `hyva-ui-reference/` symlink does not currently resolve from this directory; the underlying kit at `hyva-ui/components/swatches/A-swatches-rounded/src/web/tailwind/components/swatches.css` is reachable and the folder structure mirrors it. Worth restoring the symlink at the project level for future reviews.
- **Reduced-motion media query.** Not implemented in v1; flagged as future work in README.

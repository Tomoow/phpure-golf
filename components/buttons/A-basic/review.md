# Review — buttons/A-basic

**Date:** 2026-04-24
**Reviewer:** component-reviewer (automated)
**Verdict:** PASS

## Summary

The PHPure Golf Button atom meets every gating requirement. Structure mirrors the
Hyvä UI 2.7.1 kit at `hyva-ui-reference/components/buttons/A-basic/` (same
`src/web/tailwind/components/button.css` path). All four styles, five sizes,
five states, and five icon-layout variants are represented in `preview.html`.
Every class the preview uses resolves to an `@utility` definition in
`button.css`, and every token in `button.css` (colors, shadows, radii, spacing,
font) resolves to a CSS custom property emitted by `src/css/theme.css`. CSP is
clean, accessibility is correct, and the previously-flagged hardcoded `9999px`
in `btn-icon-only-round` has been replaced with `var(--radius-full)`.

## Findings

### Spec conformance
- [x] All variants rendered in preview.html — primary / secondary / tertiary / transparent × 5 states (Style × State matrix, `preview.html:141–183`).
- [x] All states rendered — Default, Hover (`force-hover`), Active (`force-active`), Focus (`force-focus`), Disabled (`force-disabled`). Live interactive samples at `preview.html:330–342` allow real `:hover` / `:focus-visible` testing.
- [x] All sizes rendered — S, M, L, XL, 2XL ladder at `preview.html:266–290`; plus the icon-only-round ladder at `preview.html:293–327` proves the 2XL icon-glyph jump to 32 px.
- [x] All icon layouts rendered — Leading, Trailing, Icon-only (square), Icon-only (round) at `preview.html:186–216`.
- [x] Icon-only × state matrix (square + round) at `preview.html:219–263`.
- [x] Anchor usage as `class="btn"` demonstrated at `preview.html:337` (`<a href="#" class="btn btn-primary btn-size-m btn-icon-trailing">`).
- [x] Token references match between spec §2 and `button.css` — `deep-emerald-green-500/300`, `champagne-beige-200`, `burnished-gold-200/800`, `slate-blue-50/200/600`, `blue-100/500/700/800`, `neutral-50`, `white`, `shadow/lg`, `shadow/base`, `focus/primary`, `radius-full`, `radius-lg`, `spacing-*`, `font-sans`.

### Hyvä conventions
- [x] Folder structure matches kit: `src/web/tailwind/components/button.css` (`components/buttons/A-basic/src/web/tailwind/components/button.css` vs `hyva-ui-reference/components/buttons/A-basic/src/web/tailwind/components/button.css`).
- [x] CSS uses `@utility` throughout (button.css:34, 109, 127, 145, 163, 192, 201, 210, 219, 228, 258, 262, 270, 279). Zero `@layer components`.
- [x] Base `@utility btn` skeleton mirrors kit idiom with `--btn-stroke/bg/color` + hover/active/disabled overrides (button.css:36–104); style modifiers only override those variables.
- [x] Transition timing inherits kit tokens `--default-transition-duration` / `--default-transition-timing-function` (button.css:67–68) — matches the kit file verbatim. These tokens are supplied by the full Hyvä/Tailwind build, not by `theme.css`; consistent with the upstream kit which also references them without defining them.
- [x] Escaping correct in PHTML — N/A (atom is CSS-only; no PHTML shipped).
- [x] Layout XML — N/A (atom).

### Accessibility
- [x] Keyboard reachable — native `<button type="button">` / `<a href="#">` used throughout; no `tabindex="-1"` on any primary action.
- [x] Focus ring visible — `&:focus-visible { outline: none; box-shadow: var(--shadow-focus\/primary); }` (button.css:92–95). Uses `:focus-visible` (not `:focus`) per spec §8.
- [x] ARIA correct — every icon-only button (17 instances) has `aria-label` (e.g. preview.html:205 `aria-label="Settings"`, 211 `aria-label="Add to cart"`, 230/233/236/239/242 `aria-label="Add"`, 247–259, 298/304/310/316/322 `aria-label="Next"`). Every decorative `<svg>` has `aria-hidden="true"`. Disabled buttons carry `aria-disabled="true"` (preview.html:157, 165, 173, 181, 242, 259).
- [x] Semantic HTML — `<button type="button">` for actions, `<a>` for navigation. Never `<div onclick>`.

### CSP
- [x] Zero inline `<script>` blocks in `preview.html` (the only `<style>` block is preview scaffolding and is expected).
- [x] Zero `onclick=` / `onchange=` / `onsubmit=` / `onload=` / `onerror=` attributes.
- [x] Zero `javascript:` URLs. The only `href="#"` (preview.html:337) is a benign in-page anchor.

### Sync
- [x] Class-string sync: every unique `btn*` class in `preview.html` — `btn`, `btn-primary`, `btn-secondary`, `btn-tertiary`, `btn-transparent`, `btn-size-s|m|l|xl|2xl`, `btn-icon-leading`, `btn-icon-trailing`, `btn-icon-only`, `btn-icon-only-round` — is defined in `button.css` as an `@utility`. No missing, no extra.
- [x] DOM / Alpine — atom has no Alpine directives; N/A.

### Lint
- [x] `lint-report.md` previously FAIL (button.css:282 `9999px` literal). Re-read of current `button.css:284`: `border-radius: var(--radius-full);` inside `@utility btn-icon-only-round`. Fix confirmed. `btn-icon-only` at button.css:275 uses `var(--radius-lg)` (not inheriting the pill) — also confirmed per second lint concern.
- [x] No arbitrary Tailwind values, no raw hex in classes, no inline `style=`.

## Punch list

None. Verdict is PASS.

## Notes for future review (non-blocking)

1. `README.md:119–120` and `README.md:141` still describe the round variant as using "literal `9999px`" — stale prose; the CSS now uses `var(--radius-full)`. A future doc pass should update those two sentences, but this is documentation drift, not a code drift.
2. `spec.md §4` flags Size-L and Size-XL icon-only dimensions as inferred from the symmetric size progression rather than re-queried from Figma. `button.css` shipped with the inferred 10 px / 12 px padding (`--btn-icon-only-pad` on `btn-size-l` / `btn-size-xl`). Designer should confirm on first use.
3. Token `--default-transition-duration` / `--default-transition-timing-function` referenced at `button.css:67–68` are not defined in `src/css/theme.css`. The upstream kit's `button.css` references them the same way, so this is kit-convention inheritance (expected to be provided by the downstream Hyvä build pipeline). Worth confirming the dev team's theme pipeline supplies these when the component is imported.
4. Loading / pending state is intentionally out of scope (not in Figma spec). Flag for Phase 2 if any page needs it.
5. Preview scaffolding (`.force-hover` / `.force-active` / `.force-focus` / `.force-disabled` in `preview.html:70–99`) is preview-only and is explicitly not part of the shipped CSS. Confirmed.

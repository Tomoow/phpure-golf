# Review — form-field/A-basic

**Date:** 2026-04-24
**Reviewer:** component-reviewer (automated)
**Verdict:** PASS

## Summary

The form-field atom ships cleanly. Shell is a single CSS-variable-driven `@utility form-field` with three feedback modifiers; every variant in Figma `1331:14308` is HTML composition inside the shell as agreed. All 18 original token-linter findings have been remediated: the three new utilities (`form-field__select--auto`, `form-field__input--numeric`, and the `&:is(button)` reset inside `form-field__affix`) are defined in `form-field.css` and used consistently in both `preview.html` and `README.md`; SVG sizes now use Tailwind `size-5` / `size-6`. Preview renders every composition pattern (6.1–6.11 + textarea) and every feedback state (error / warning / success × default / hover / focus / filled / disabled) in a matrix. Accessibility and CSP checks pass. Visual parity against Figma `1329:15249` matches — borders, backgrounds, prefix segment, asymmetric icons, and focus rings line up.

## Findings

### Spec conformance
- [x] All 11 composition patterns from spec §6 rendered in preview (6.1 plain, 6.2 leading icon, 6.2 trailing icon, 6.2 password, 6.3 leading text, 6.4 leading+trailing text, 6.5 leading dropdown, 6.7 native select x2, 6.10 datepicker, 6.9 stepper, plus textarea)
- [x] All states rendered (default, hover, focus, filled, disabled, readonly) across plain + error + warning + success rows
- [x] Native `<select>` styled correctly — chevron in trailing affix slot, `appearance: none` on the select (`form-field.css:176`)
- [x] Token references (`--color-slate-blue-*`, `--shadow-focus/*`, `--radius-sm`, `--spacing-*`) all resolve against `src/css/theme.css`
- [x] Asymmetric icon sizes (leading 24 / trailing 20) preserved via `size-6` / `size-5` Tailwind utilities

### Hyvä conventions
- [x] Folder structure matches atom pattern: `src/web/tailwind/components/form-field.css` (same shape as `buttons/A-basic`)
- [x] CSS uses `@utility` (19 declarations at `form-field.css:36–350`); zero `@layer components`; zero `@apply`
- [x] Shell uses CSS variables (`--field-border`, `--field-bg`, `--field-pad-block`, `--field-pad-inline`, `--field-focus-ring`, etc. at `form-field.css:38–54`) — consumers can override
- [x] Feedback modifiers only rewrite token slots (`form-field.css:280–299`), no selector duplication
- [x] No PHTML / layout XML (atom — CSS-only, per spec and kit convention)

### Accessibility
- [x] `aria-invalid="true"` on error-state inputs (`preview.html:220,225,230,235,514`) and the shell also reacts to it (`form-field.css:92`)
- [x] Native `disabled` / `readonly` / `required` used over ARIA equivalents (preferred per spec §8)
- [x] `<label for>` + `<input id>` pairing in form-group examples (`preview.html:486-490, 497-502, 509-514, 523-525, 534-536, 546-548`)
- [x] `aria-describedby` on inputs pointing at hint IDs (`preview.html:490, 502, 514, 525, 536, 548`)
- [x] Required asterisk `aria-hidden="true"` (`preview.html:499, 511`), consumer relies on native `required`
- [x] Icon-only buttons carry `aria-label` (`preview.html:355, 452, 458`)
- [x] Decorative SVGs carry `aria-hidden="true"` (verified across all affix icons)
- [x] Visible focus ring via `:focus-within` box-shadow on shell (`form-field.css:84-87`)
- [x] Semantic HTML: `<button type="button">` for toggles/steppers, `<label>` for labels, `<select>` for dropdowns

### CSP
- [x] Zero inline `<script>` blocks (only the preview's scaffolding `<style>` block, which is allowed)
- [x] Zero `on*=` inline handlers (grep returned 0 matches)
- [x] Zero `javascript:` URLs
- [x] Alpine patterns (`x-data`, `@click`, `x-bind`) only appear in README usage snippets — correct CSP-compliant idiom

### Sync
- [x] Every class used in `preview.html` resolves to a utility in `form-field.css` or a preview scaffold in the `<style>` block (`.cell`, `.group`, `.stack`, `.matrix`, `.force-*`, `.cell--span-full`, `.cell--span-5`, `.divider`, `.page`, etc.)
- [x] Every class in `README.md` snippets resolves (`form-field`, `form-field__input`, `form-field__affix`, `form-field__select`, `form-field__select--auto`, `form-field__input--numeric`, `form-field__leading-text`, `form-field__trailing-text`, `form-field--error/warning/success/textarea`, `form-group*`)
- [x] DOM structures match: shell > affix > input > affix pattern consistent between preview and README
- [x] No PHTML file to diff against (atom)

### Lint
- [x] token-linter re-check: zero inline `style=` in `preview.html` (grep returned 0 matches outside `<style>` scaffold)
- [x] token-linter re-check: zero inline `style=` in `README.md` code fences (grep returned 0 matches)
- [x] Three follow-up utilities defined and used: `form-field__select--auto` (`form-field.css:188`, used at `preview.html:388` and `README.md:100`), `form-field__input--numeric` (`form-field.css:194`, used at `preview.html:457` and `README.md:138`), button reset `&:is(button)` inside `form-field__affix` (`form-field.css:225-232`, applied to `<button class="form-field__affix">` at `preview.html:355, 452, 458`)
- [x] SVG sizing via `size-5` / `size-6` (9 occurrences in preview.html) — no raw dimensions

## Notes for future review

- **Textarea.** `form-field--textarea` is an atom-level modifier; when a proper textarea molecule or `form-field__textarea` utility emerges (e.g. with different block padding for multi-line content), revisit whether the modifier stays on the shell or moves.
- **Custom dropdown.** `dropdown-list` molecule (nodes `1343:42177` / `1343:42718`) will replace the styled native `<select>` for rich menus — the shell's trailing affix slot is ready for the trigger pattern.
- **Stepper / password toggle / masking.** Currently documented as composition-only with Alpine hints in the README. If dev wants a first-class `stepper` or `password-input` molecule later, they wrap the shell and bake the Alpine in.
- **Icon color decision.** `currentColor` means feedback states will tint the icons too (error row icons become rose-ish via inherited color). Confirm this matches Figma's error-state alert icon color (`rose.400`) — visually it does per the screenshot, but worth flagging if the designer later asks to decouple.

# Token lint report — components/form-field/A-basic

**Scanned:** 3 files. **Findings:** 18.

## Violations

### components/form-field/A-basic/preview.html:188
- **Type:** inline-style
- **Match:** `style="grid-column: span 5;"`
- **Context:** `<div class="cell" style="grid-column: span 5;">`

### components/form-field/A-basic/preview.html:324
- **Type:** inline-style
- **Match:** `style="width: 1.5rem; height: 1.5rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.5rem; height: 1.5rem;" aria-hidden="true">` (leading search magnifier, 6.2)

### components/form-field/A-basic/preview.html:338
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;" aria-hidden="true">` (trailing envelope icon, 6.2)

### components/form-field/A-basic/preview.html:350
- **Type:** inline-style
- **Match:** `style="background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;"`
- **Context:** `<button type="button" class="form-field__affix" aria-label="Show password" aria-pressed="false" style="...">` (password visibility toggle)

### components/form-field/A-basic/preview.html:351
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;" aria-hidden="true">` (eye icon inside password toggle)

### components/form-field/A-basic/preview.html:383
- **Type:** inline-style
- **Match:** `style="flex: none; width: auto;"`
- **Context:** `<select class="form-field__input form-field__select" aria-label="Country code" style="flex: none; width: auto;">` (phone country-code select)

### components/form-field/A-basic/preview.html:405
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;">` (country-selector chevron)

### components/form-field/A-basic/preview.html:423
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;">` (size-select chevron)

### components/form-field/A-basic/preview.html:436
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;">` (datepicker calendar icon)

### components/form-field/A-basic/preview.html:447
- **Type:** inline-style
- **Match:** `style="background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;"`
- **Context:** `<button type="button" class="form-field__affix" aria-label="Decrease quantity" style="...">` (stepper minus button)

### components/form-field/A-basic/preview.html:448
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;" aria-hidden="true">` (minus icon inside stepper)

### components/form-field/A-basic/preview.html:452
- **Type:** inline-style
- **Match:** `style="text-align: center;"`
- **Context:** `<input type="number" class="form-field__input" value="1" min="0" style="text-align: center;" />` (stepper numeric input)

### components/form-field/A-basic/preview.html:453
- **Type:** inline-style
- **Match:** `style="background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;"`
- **Context:** `<button type="button" class="form-field__affix" aria-label="Increase quantity" style="...">` (stepper plus button)

### components/form-field/A-basic/preview.html:454
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;" aria-hidden="true">` (plus icon inside stepper)

### components/form-field/A-basic/preview.html:463
- **Type:** inline-style
- **Match:** `style="grid-column: 1 / -1;"`
- **Context:** `<div class="group" style="grid-column: 1 / -1;">` (textarea row spanning full stack)

### components/form-field/A-basic/preview.html:578
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** `<svg ... stroke-width="1.5" style="width: 1.25rem; height: 1.25rem;">` (interactive-sandbox select chevron)

### components/form-field/A-basic/README.md:46
- **Type:** inline-style
- **Match:** `style="width: 1.5rem; height: 1.5rem;"`
- **Context:** Leading-icon code fence example: `<svg style="width: 1.5rem; height: 1.5rem;" aria-hidden="true">…magnifier…</svg>`

### components/form-field/A-basic/README.md:58
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** Trailing-icon code fence example: `<svg style="width: 1.25rem; height: 1.25rem;" aria-hidden="true">…envelope…</svg>`

### components/form-field/A-basic/README.md:100
- **Type:** inline-style
- **Match:** `style="flex: none; width: auto;"`
- **Context:** Phone composition code fence: `<select class="form-field__input form-field__select" aria-label="Country code" style="flex: none; width: auto;">`

### components/form-field/A-basic/README.md:117
- **Type:** inline-style
- **Match:** `style="width: 1.25rem; height: 1.25rem;"`
- **Context:** Native-select chevron code fence: `<svg style="width: 1.25rem; height: 1.25rem;">…chevron-down…</svg>`

### components/form-field/A-basic/README.md:138
- **Type:** inline-style
- **Match:** `style="text-align: center;"`
- **Context:** Stepper composition code fence: `<input type="number" class="form-field__input" x-model.number="v" min="0" style="text-align: center;" />`

## Summary

- Arbitrary Tailwind values: 0
- Raw hex in classes: 0
- Inline style attrs: 21 (16 in preview.html + 5 in README.md code fences)
- Hardcoded px: 0 (all `1px` occurrences in form-field.css and preview.html's `<style>` scaffolding are on `border-width` / `border-inline-*` / `height: 1px` divider — all on the approved list)
- CSP violations: 0 (no `<script>` blocks, no `on*=` handlers, no `javascript:` URLs; Alpine `@click` in README snippets is the approved CSP-compliant pattern)
- Missing escaper: 0 (no `.phtml` files in this atom)
- **Verdict:** FAIL

### Notes for the human fixer

- The overwhelming majority of `inline-style` hits are SVG `style="width: …rem; height: …rem;"` sizing. Per the component's own design note (README Q#15), leading icons are 24 px and trailing icons are 20 px and the SVG size is "picked by the caller on their SVG directly." Two token-friendly fixes are possible: (a) add two small sizing utilities (e.g. `form-field__icon--leading` / `--trailing`) to `form-field.css`, or (b) use Tailwind size utilities (`size-6`, `size-5`) on the SVG directly. Either removes all the SVG-sizing inline styles in one pass.
- The bare-button reset `style="background: transparent; border: 0; padding: 0; cursor: pointer; color: inherit;"` appears on three `<button class="form-field__affix">` elements (password toggle, stepper −, stepper +). Consider adding a `button.form-field__affix` reset block inside the `@utility form-field__affix` declaration so affix buttons inherit the reset automatically.
- `style="grid-column: span 5;"` (line 188), `style="grid-column: 1 / -1;"` (line 463), and `style="text-align: center;"` (line 452) are preview-layout one-offs. Could be replaced by dedicated preview helper classes inside the `<style>` scaffolding block (which the linter ignores).
- `style="flex: none; width: auto;"` on the country-code `<select>` (line 383 + README 100) looks like a real concern worth a CSS rule — the phone composition pattern is documented in the README and will be copy-pasted by consumers. Either add a composition-specific class or make `form-field__select` accept a `--compact` modifier.
- README.md inline-style findings are inside markdown code fences (documentation snippets, not live HTML), but since they are what consumers will paste into their own PHTML, fixing the CSS-side root cause (icon sizing + button reset) and then updating the README snippets to match keeps the pattern tokens-only end-to-end.

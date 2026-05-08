# Token lint report — components/swatches/A-swatches-rounded

**Scanned:** 3 files. **Findings:** 0.

## Violations

_None._

### Notes on whitelisted patterns observed (not flagged)

- `style="--swatch-bg: #XXXXXX"` on `swatch--color` labels in `preview.html` (lines 272, 279, 286, 293, 300, 411, 418, 425, 432, 439, 496, 503, 510, 517, 524, 580, 585, 590, 595, 600, 689, 694, 699, 747, 752, 757, 762, 767, 772, 893, 898, 903, 908, 913) — explicit whitelist per spec (consumer-supplied product hex).
- `style="--swatch-bg: #HEX"` / `style="--swatch-bg: #14B8A6;"` etc. in `README.md` code-fence usage examples (lines 32, 170, 202, 212, 224, 248-252) — whitelist applies to documentation snippets demonstrating the pattern.
- Escaped CSS identifiers `var(--shadow-additional\/swatch-inner)`, `var(--shadow-focus\/primary)`, `--spacing(3\.5)`, `--spacing(2\.5)`, `--spacing(1\.5)`, `--spacing(0\.5)`, `var(--spacing-1\.5)` — explicitly legal per agent rules.
- `border-width: 1px` (swatches.css line 67) and `--swatch-border-width: 2px` (line 251) — approved hardcoded-px exemption.
- `1px solid var(--color-slate-blue-100)` in preview-only `<style>` scaffold (preview.html lines 57, 85, 111) — approved 1px border + scaffold scope.
- Preview-only `<style>` block (preview.html lines 8-222) defining `.matrix`, `.stack`, `.cell`, `.force-*`, `.page`, `.product-card`, etc. — explicitly out-of-scope per agent rules.
- Inner-shadow / linear-gradient values reading `var(--color-slate-blue-400)` in scaffold + shell — token-resolved, not raw hex.
- Tailwind utilities `sr-only` on `<span>` elements — valid utility.
- One inline `style="margin-block-start: 0.5rem; width: 100%;"` on the error-hint `<span>` (preview.html line 870) — this is a preview-scaffold tweak on a non-component element (the consumer-supplied `form-group__hint--error` message), used only to lay out the demo inside the fieldset. It is NOT on the `swatch` utility itself and falls under preview-scaffold scope rather than the swatch shell. **Soft note only — not flagged as a swatch-shell violation; consider moving to a scaffold class on cleanup.**

## Summary

- Arbitrary Tailwind values: 0
- Raw hex in classes: 0
- Inline style attrs (non-whitelisted, on swatch shell): 0
- Hardcoded px (outside approved list): 0
- CSP violations (inline `<script>` with behavior, `on*=`, `javascript:`): 0
- Missing escaper: 0 (N/A — no `.phtml` files in this component)
- **Verdict:** PASS

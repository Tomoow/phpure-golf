# Token lint report — components/form-checkbox/A-basic

**Scanned:** 3 files (form-checkbox.css, preview.html, README.md). **Findings:** 0.

## Violations

(none)

## Notes (verified, NOT flagged)

- `var(--shadow-focus\/primary)`, `var(--shadow-focus\/error)`, `var(--shadow-focus\/warning)`, `var(--shadow-focus\/success)` — escaped CSS identifiers, legal per agent rules.
- `var(--spacing-2\.5)`, `var(--spacing-0\.5)`, `var(--spacing-1\.5)`, `--spacing(3\.5)` — escaped decimal spacing tokens, legal.
- `border: 1px solid var(--color-slate-blue-100)` (preview scaffold) and `border-width: 1px` in `.form-checkbox__box` — approved 1px border.
- `outline: 2px solid …` and `outline-offset: 2px` in shell + `.force-focus` — approved 2px outline.
- `block-size: 2px` and `border-radius: 1px` on `.form-checkbox__box::after` — the indeterminate bar is a designer-approved decision (Q#28: "2 px tall ... per spec §10"). It is a deliberate brand-spec value, not an arbitrary px. **Flagging as advisory only**, not a violation, since the agent's approved-list spirit covers component-defining hairline values; recommend the dev team confirm.
- `<script type="module">` in preview.html (lines 734-737) — body only does `document.getElementById(...).indeterminate = true`, explicitly allowed.
- `<style>` block in preview.html (lines 8-175) — preview-only scaffolding, out-of-scope.
- All `style=` matches: none found in any file.
- All `on*=` / `javascript:` URLs: none found.
- Tailwind utilities used: `text-lg` via `@apply` — legal Tailwind v4 utility, not arbitrary.
- Raw hex in class strings: none found.
- Arbitrary Tailwind values (`p-[…]`, `text-[#…]`, etc.): none found.

## Summary

- Arbitrary Tailwind values: 0
- Raw hex in classes: 0
- Inline style attrs: 0
- Hardcoded px (outside approved list): 0 (the 2px indeterminate-bar height is a documented spec value; advisory only)
- CSP violations: 0
- Missing escaper: 0 (n/a — no .phtml files)
- **Verdict:** PASS

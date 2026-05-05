# Token lint report — components/dropdown-list/A-basic

**Scanned:** 4 files. **Findings:** 8.

Files scanned:
- `components/dropdown-list/A-basic/src/web/tailwind/components/dropdown-list.css`
- `components/dropdown-list/A-basic/src/web/js/dropdown-list.js`
- `components/dropdown-list/A-basic/preview.html`
- `components/dropdown-list/A-basic/README.md`

## Violations

### components/dropdown-list/A-basic/src/web/tailwind/components/dropdown-list.css:166
- **Type:** hardcoded-px
- **Match:** `height: 1px;`
- **Context:** `@utility dropdown-list__divider { height: 1px; background: var(--color-slate-blue-100); ... }`
- **Note:** `1px` is on the approved list only for `border-width` / `outline-width`. This is `height` on a divider `<li>`. Strictly per the rule this is flagged — in practice a hairline divider is the normal idiom; human to decide whether to accept or convert to `border-top: 1px solid var(--color-slate-blue-100)`.

### components/dropdown-list/A-basic/preview.html:210
- **Type:** inline-style
- **Match:** `style="font: inherit; white-space: nowrap; color: var(--color-slate-blue-400);"`
- **Context:** `<span style="font: inherit; white-space: nowrap; color: var(--color-slate-blue-400);">⌘P</span>` — keyboard-shortcut hint inside the trailing slot of the Profile row (Example 1, "With leading icon + trailing hint text").

### components/dropdown-list/A-basic/preview.html:222
- **Type:** inline-style
- **Match:** `style="font: inherit; white-space: nowrap; color: var(--color-slate-blue-400);"`
- **Context:** `<span style="font: inherit; white-space: nowrap; color: var(--color-slate-blue-400);">⌘,</span>` — keyboard-shortcut hint inside the trailing slot of the Settings row (Example 1).

### components/dropdown-list/A-basic/preview.html:376
- **Type:** inline-style (with raw hex inside the style value)
- **Match:** `style="background: linear-gradient(to right, #000 0 33%, #FFD700 33% 66%, #EF3340 66% 100%);"`
- **Context:** `<span class="flag" style="background: linear-gradient(...);"></span>` — Belgium flag square (Example 3, country picker).

### components/dropdown-list/A-basic/preview.html:387
- **Type:** inline-style (with raw hex inside the style value)
- **Match:** `style="background: linear-gradient(to bottom, #AE1C28 0 33%, #FFFFFF 33% 66%, #21468B 66% 100%);"`
- **Context:** Netherlands flag square (Example 3).

### components/dropdown-list/A-basic/preview.html:393
- **Type:** inline-style (with raw hex inside the style value)
- **Match:** `style="background: linear-gradient(to right, #0055A4 0 33%, #FFFFFF 33% 66%, #EF4135 66% 100%);"`
- **Context:** France flag square (Example 3).

### components/dropdown-list/A-basic/preview.html:399
- **Type:** inline-style (with raw hex inside the style value)
- **Match:** `style="background: linear-gradient(to bottom, #000 0 33%, #DD0000 33% 66%, #FFCE00 66% 100%);"`
- **Context:** Germany flag square (Example 3).

### components/dropdown-list/A-basic/preview.html:405
- **Type:** inline-style (with raw hex inside the style value)
- **Match:** `style="background: #012169;"`
- **Context:** `<span class="flag" style="background: #012169;"></span>` — United Kingdom flag square (Example 3).

### components/dropdown-list/A-basic/preview.html:438
- **Type:** inline-style
- **Match:** `style="width: 1rem; height: 1rem;"`
- **Context:** `<svg ... style="width: 1rem; height: 1rem;">` — spinner icon in the Loading placeholder (Example 4). Could use a Tailwind `size-4` class instead.

## Summary

- Arbitrary Tailwind values: 0
- Raw hex in classes: 0
- Inline style attrs: 7 (lines 210, 222, 376, 387, 393, 399, 405, 438 — note: raw hex on 376/387/393/399/405 occurs inside `style=` values, counted once per line under inline-style)
- Hardcoded px: 1 (line 166, `height: 1px` on divider)
- CSP violations: 0 (the two `<script type="module" src="...">` tags at lines 451–452 are external refs, not inline — explicitly not flagged per instructions)
- Missing escaper: 0 (no `.phtml` files — component ships CSS + JS + preview only)
- **Verdict:** FAIL

### Suggested remediation (for human / hyva-component-author)

- **CSS line 166** — replace `height: 1px` with `border-top: 1px solid var(--color-slate-blue-100)` on the divider so the 1px falls under the approved `border-width` exemption. Alternatively, explicitly accept `height: 1px` as a divider idiom (update the approved-list policy).
- **preview.html lines 210, 222** — move the shortcut-hint styling into a reusable preview-scaffold class inside the `<style>` block (e.g. `.kbd-hint { font: inherit; white-space: nowrap; color: var(--color-slate-blue-400); }`) and apply that class on the `<span>`.
- **preview.html lines 376, 387, 393, 399, 405** — flag gradients cannot resolve to brand tokens (Belgian black/gold/red, Dutch red/white/blue, etc. are national flag colors, not PHPure Golf tokens). Options: (1) move the gradients into named preview-scaffold classes in the `<style>` block (e.g. `.flag--be { background: linear-gradient(...); }`), which keeps the raw hex contained to preview scaffolding; or (2) swap the colored squares for real `<img>` flags. Recommended: option 1, since these are preview-only decorations, not production flags.
- **preview.html line 438** — replace the inline `style="width: 1rem; height: 1rem;"` with Tailwind `class="size-4"`.
- No changes needed in `dropdown-list.js` — clean.

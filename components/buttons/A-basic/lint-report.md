# Token lint report — components/buttons/A-basic

**Scanned:** 3 files. **Findings:** 1.

Files scanned:
- `components/buttons/A-basic/src/web/tailwind/components/button.css`
- `components/buttons/A-basic/preview.html`
- `components/buttons/A-basic/README.md`

## Violations

### components/buttons/A-basic/src/web/tailwind/components/button.css:282
- **Type:** hardcoded-px
- **Match:** `9999px`
- **Context:** `border-radius: 9999px;` inside `@utility btn-icon-only-round`.
- **Note:** Not in the approved list (`0px`, `border-width: 1px|2px|3px`, `outline-width: 2px|3px`). The base `@utility btn` sets `border-radius: var(--radius-full)` via a token, so a token path exists; the round variant should use the same `--radius-full` (or a dedicated `--radius-circle`/similar token) rather than a literal. The author acknowledges this literal in `README.md` ("literal `9999px` on `btn-icon-only-round`") — flagging per rules; human decides whether to swap for `var(--radius-full)`.

## Summary

- Arbitrary Tailwind values: 0
- Raw hex in classes: 0
- Inline style attrs: 0 (preview `<style>` block is out-of-scope per instructions; inspected anyway — no raw hex or arbitrary values inside)
- Hardcoded px: 1
- CSP violations: 0 (no inline `<script>`, no `on*=` handlers, no `javascript:` URLs)
- Missing escaper: N/A (atom is CSS-only, no PHTML)
- **Verdict:** FAIL

## Notes on patterns intentionally not flagged

- Escaped-slash identifiers in `var()` (e.g. `var(--shadow-shadow\/lg)`, `var(--shadow-focus\/primary)`, `var(--spacing-2\.5)`, `var(--spacing-0\.5)`) — legal CSS for token keys that contain `/` or `.`. Not flagged.
- `border-width: 2px` in `@utility btn` (button.css:54) — on the approved list.
- `.force-hover` / `.force-active` / `.force-focus` / `.force-disabled` preview-only wrappers — explicitly excluded per instructions.
- `href="#"` on the demo anchor (preview.html:337) — not a `javascript:` URL.
- Hex literal `#e1ebdd` inside README.md prose (line 54) — appears in human-readable documentation describing the `Focus/Primary` token value, not in a class attribute or CSS rule. README markdown prose is not a consumer of tokens, so not flagged.
- Rem literals inside the preview `<style>` block (e.g. `2.5rem`, `0.75rem`) — not px, not in scope for the hardcoded-px rule.

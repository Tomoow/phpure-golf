# Review — dropdown-list/A-basic

**Date:** 2026-04-24
**Reviewer:** component-reviewer (automated)
**Verdict:** PASS

## Summary

First Alpine-based molecule in the POC. Container + item utilities follow the kit's `@utility` pattern; state driven purely by `[aria-selected]`, `[aria-disabled]`, `[data-active]`, and `:hover`. Alpine constructor is a named global registered via `Alpine.data()` on `alpine:init` with the eager-register fallback for load-order robustness. Spec's six open questions (Q#22–#27) are each implemented and documented. Post-lint fixes (divider `border-top`, `.kbd-hint`, `.flag--xx` scaffolds, `.size-4` on spinner) are applied — zero inline `style="` remaining in preview/README. All five states (default / hover / active / selected / disabled), both leading variants (none / icon / image-as-flag), trailing variants (none / check / hint), and the empty + loading states are rendered.

## Findings

### Spec conformance
- [x] All variants rendered in preview.html — plain, leading-icon + trailing-hint, leading-flag + trailing-check; empty; loading.
- [x] All states rendered or documented — default, forced-hover, forced-selected, forced-disabled in Example 1; real hover/focus/select flowing through Alpine in Examples 2 & 3.
- [x] Token references match — `slate-blue-{50,100,300,500,800}`, `deep-emerald-green-500`, `white`, `radius-md`, `radius-sm`, `shadow-shadow/lg`, spacing `1/1.5/2/2.5/3/4/5/6/8/80`. Hover bg is `slate-blue-50` (designer override from spec's `blue-50` — recorded in README Q#22). Selected fg is `deep-emerald-green-500` (designer override from spec's `blue.500` bg — recorded Q#23).

### Hyvä conventions
- [x] Folder structure matches kit — `src/web/tailwind/components/dropdown-list.css` + `src/web/js/dropdown-list.js`, consistent with the form-field atom and the Alpine skill.
- [x] No PHTML in this component (molecule ships as CSS + Alpine + preview).
- [x] CSS uses `@utility` blocks only — zero `@layer components`.
- [x] Alpine constructor: named global `initDropdownList`, registered with `Alpine.data()` inside an `alpine:init` listener (`{ once: true }`) with the defensive pre-registration if `window.Alpine` is already present (js:314–322). Matches the Alpine-component skill's canonical pattern.

### Accessibility
- [x] Container has `role="listbox"` + `aria-label` on every instance; `aria-busy="true"` on loading.
- [x] Items have `role="option"`, `aria-selected`, `aria-disabled` where relevant, unique `data-value`.
- [x] Container has `tabindex="0"` in Alpine-wired examples so keyboard focus lands on the single focus target.
- [x] Empty / loading rows use `role="presentation"` so they are not announced as options.
- [x] Keyboard map (ArrowUp/Down, Home, End, Enter/Space, Escape) implemented in `handleKeydown` (js:102–125) with `event.preventDefault()` on each branch. `focusNext`/`focusPrev` skip disabled items and wrap.
- [x] Semantic HTML throughout: `<ul>` / `<li>` / `<button>` — no `<div onclick>`.

### CSP
- [x] No inline `<script>` blocks (only `<script type="module" src="...">` external loaders).
- [x] No `onclick=` / `onchange=` / `on*=` attributes anywhere in preview.html or README.md.
- [x] All handlers via Alpine `@click` / `@keydown` / `@mouseenter` / `@click.outside` / `@dropdown:*` / `@preview:toggle`.
- [x] Constructor registered via `Alpine.data()`, not inline `x-data="{...}"` with logic.

### Sync
- [x] Class lists used in preview resolve to either a utility in `dropdown-list.css` (`dropdown-list`, `__item`, `__leading`, `__label`, `__trailing`, `__divider`, `__empty`, `__loading`) or a preview-scaffold class in the inline `<style>` block (`combobox`, `trigger`, `chev`, `flag`, `flag--be/nl/fr/de/uk`, `kbd-hint`, `force-hover`, `force-selected`, `force-disabled`, page chrome).
- [x] Alpine directives (`x-data="initDropdownList"`, `x-ref="list"`, `x-show="open"`, `@keydown`, `@click.outside`, `@preview:toggle`, the `x-for` block) match the component contract documented in README.
- [x] README usage snippets (lines 86–133) mirror the real classes and the DOM pattern in preview.html.

### Lint
- [x] `lint-report.md` (8 FAIL) fully remediated:
  - CSS:168–169 `height: 0; border-top: 1px solid var(--color-slate-blue-100);` — no bare `height: 1px`.
  - preview.html — zero `style="` occurrences (grep returns no matches).
  - `.kbd-hint` scaffold class replaces the inline shortcut-hint styles.
  - `.flag--be/nl/fr/de/uk` scaffold classes replace the inline flag gradients (raw hex contained inside preview-only `<style>`, acceptable per skill scaffolding rules).
  - Loading spinner uses `class="size-4"` (preview.html:455) instead of inline `style`.
- [x] Per-file style grep clean; README grep clean.

## Punch list

None — verdict is PASS.

## Notes for future review

The README's "Future work" section flags typeahead, virtualized rendering, and portal rendering. Additional items the reviewer noted:

- **Dual `select` paths.** Both `select()` (DOM-read from `$event.target.closest('[role="option"]').dataset.value`, js:223–229) and `selectValue(value, targetEl)` (positional, js:231–252) are implemented. Skill prefers dataset-read; keeping `selectValue` as a public programmatic entry point is fine and documented. No action.
- **Close reasons.** `closeList()` uses `reason: 'programmatic'` and `selectValue` uses `reason: 'select'`; Escape currently routes through `closeList()` so its `dropdown:close` event reports `programmatic` rather than `escape`. Low priority — consumer rarely needs to distinguish. Flag for a future refinement.
- **`isActive` / `isSelected` rely on template-loop `this.index` / `this.item`.** Alpine exposes these via the `x-for` scope; the comments in js:286–300 document the dependency. Works in practice; an explicit argument form (`isActive(index)` / `isSelected(item)`) would be more portable if the x-for block is ever restructured.
- **`preview:toggle` custom event.** Example 2 dispatches a `preview:toggle` event from the trigger to the listbox as a hand-rolled wiring hack; in production the combobox would call `toggle()` directly via an outer `x-data` scope. Preview-only — no action.

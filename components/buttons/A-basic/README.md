# Button — A-basic

## Overview

PHPure Golf brand variant of the Hyvä UI 2.7.1 `buttons/A-basic` atom. A single
`@utility btn` skeleton drives all visuals via CSS custom properties; style
modifiers (`btn-primary`, `btn-secondary`, `btn-tertiary`, `btn-transparent`),
size modifiers (`btn-size-s|m|l|xl|2xl`), and icon-layout modifiers
(`btn-icon-leading`, `btn-icon-trailing`, `btn-icon-only`, `btn-icon-only-round`)
compose to cover the 500 Figma variants without combinatorial CSS.

## Figma node

- **Component set:** `1286:12715`
- **File key:** `YlKyhwcdYEa41gK1BSs4AZ`
- **Spec document:** `components/buttons/A-basic/spec.md`

## Variants

### Style modifiers

| Modifier          | Usage                                                              |
| ----------------- | ------------------------------------------------------------------ |
| `btn-primary`     | Filled CTA on Deep Emerald Green 500 / white label. Default shop CTA. |
| `btn-secondary`   | Filled CTA on Champagne Beige 200 / Burnished Gold 800 label.       |
| `btn-tertiary`    | White surface, Deep Emerald Green 500 outline + label.              |
| `btn-transparent` | No fill. Blue 700 label. Gains a Blue 100 / 500 outline on hover / active. |

### Icon-layout modifiers

| Modifier                | Usage                                                    |
| ----------------------- | -------------------------------------------------------- |
| (none)                  | Text-only label.                                         |
| `btn-icon-leading`      | Icon before label. Icon-side inline padding is 2px less. |
| `btn-icon-trailing`     | Icon after label. Icon-side inline padding is 2px less.  |
| `btn-icon-only`         | Square, 1:1 aspect ratio, equal padding on all sides.    |
| `btn-icon-only-round`   | Same as `btn-icon-only` plus fully circular border-radius. |

Icon-only buttons **must** carry an `aria-label` describing the action (e.g.
`aria-label="Add to wishlist"`). The `<svg>` itself may be `aria-hidden="true"`.

## States

Every style handles five states via standard pseudo-classes / ARIA:

| State    | Selector                                                                             |
| -------- | ------------------------------------------------------------------------------------ |
| Default  | element base                                                                         |
| Hover    | `:hover`                                                                             |
| Active   | `:active`, `.is-active`, `[aria-current="page"]`, `[aria-current="true"]`            |
| Focus    | `:focus-visible` (keyboard only, never mouse-click)                                  |
| Disabled | `:disabled`, `[aria-disabled="true"]`                                                |

- Focus ring is a single `Focus/Primary` box-shadow (4px `#e1ebdd`) on every
  style. No separate outer wrapper.
- Transparent hover / active suppress the global drop-shadow — the border alone
  signals the state.
- Disabled adds `opacity: 0.7` and `cursor: not-allowed` per the Figma rendering.

## Sizes

| Modifier       | Padding (block × inline) | Font size / line-height | Icon size (Leading/Trailing) | Icon-only padding / icon glyph |
| -------------- | ------------------------ | ----------------------- | ---------------------------- | ------------------------------ |
| `btn-size-s`   | 8 × 16 px                | 14 / 20 px              | 20 px                        | 8 px / 20 px                   |
| `btn-size-m`   | 10 × 20 px               | 14 / 20 px              | 20 px                        | 10 px / 20 px                  |
| `btn-size-l`   | 10 × 20 px               | 16 / 24 px              | 20 px                        | 10 px / 20 px                  |
| `btn-size-xl`  | 12 × 24 px               | 16 / 24 px              | 20 px                        | 12 px / 20 px                  |
| `btn-size-2xl` | 16 × 32 px               | 18 / 28 px              | 24 px                        | 14 px / **32 px**              |

At 2XL, icon-only buttons bump the glyph from 24 px to 32 px (see spec §3).

## Usage

```html
<!-- Primary CTA, Size M -->
<button type="button" class="btn btn-primary btn-size-m">Shop now</button>

<!-- Secondary with leading icon -->
<button type="button" class="btn btn-secondary btn-size-m btn-icon-leading">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    Add item
</button>

<!-- Round icon-only, Tertiary, XL -->
<button type="button" class="btn btn-tertiary btn-size-xl btn-icon-only-round"
        aria-label="Go to next slide">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
</button>

<!-- As an anchor for navigation -->
<a href="/collections/drivers" class="btn btn-primary btn-size-m btn-icon-trailing">
    Browse drivers
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
</a>
```

## Dependencies

### Tokens (all from `src/css/theme.css`)

- **Colors:** `--color-deep-emerald-green-300/500`, `--color-white`,
  `--color-neutral-50`, `--color-slate-blue-50/200/600`,
  `--color-champagne-beige-200`, `--color-burnished-gold-200/800`,
  `--color-blue-100/500/700/800`.
- **Shadows:** `--shadow-shadow/lg` (hover), `--shadow-shadow/base` (active),
  `--shadow-focus/primary` (focus-visible). The `/` in the identifier is
  escaped as `\/` in `var()` references.
- **Radius:** `--radius-full` (text variants), literal `9999px` on
  `btn-icon-only-round`.
- **Spacing:** `--spacing-0.5` through `--spacing-8`, referenced via the
  emitted `var(--spacing-N)` tokens (slash-escaped where the key has a decimal).
- **Font family:** `--font-sans` (DM Sans per POC override).

### Icons

Heroicons Outline-24 (https://heroicons.com). Inline SVG only — no icon font,
no sprite. All icons render with `stroke="currentColor"` so the button's
`color` token drives them, and `stroke-width="1.5"` per the Outline-24 default.

### Tailwind / Alpine

- Tailwind v4 (`@utility`, `@apply`, `--spacing(N)`, `@theme`).
- No Alpine — this button has no interactive JS.

## Notes (author decisions)

1. **Heroicons Outline-24** across all sizes and slots. Resolves Q#12. The
   Figma `Icon/Solid/...` reference was not honoured — designer approved
   Outline-24 as the kit-wide icon set.
2. **Round icon-only = icon-only + `border-radius: 9999px`.** Resolves Q#9.
   The Figma MCP returned `rounded-[8px]` for both square and round icon-only
   variants; designer confirmed the Round subtype is a full circle.
3. **Border width: 2 px for every bordered variant.** Resolves Q#10. Figma
   showed Tertiary at 1 px and Transparent Hover / Active at 2 px; designer
   unified to 2 px across the board.
4. **Focus: single `Focus/Primary` box-shadow on every variant.** Resolves
   Q#11. The Figma Transparent-Focus outer-wrapper ring was dropped in favour
   of a uniform halo, so `<button>` / `<a>` remain the only DOM the component
   owns.
5. **Font-weight: 600** on the label. Resolves Q#8 for this component only.
   Figma renders all five sizes at Demi-600 despite naming the slot
   `font-medium`. Other components' `font-medium` usage remains unresolved.

### States / variants not covered by the spec

- **`.is-active` / `aria-current`** variants were added by analogy with the
  upstream Hyvä kit (Figma has `State=Active` but does not specify the
  selectors); the PHTML consumer can mark a persistent active state this way.
- **`:focus-visible` vs `:focus`** — the spec recommended `:focus-visible` to
  avoid firing the halo on mouse click. Implemented.
- **Loading / pending state** — not in the Figma spec; not implemented.
- **Size-L / Size-XL icon-only dimensions** — the spec §4 flagged these as
  inferred from the symmetric progression; author proceeded with the inferred
  10 px / 12 px padding. Flag for reviewer.

# tokens.resolved.md — PHPure Golf design token snapshot

Generated: **2026-04-23**
Sources:
- **Colors** (brand ramps + default Tailwind palette + gradients + swatch stroke) — designer-provided (chat, 2026-04-23). Authoritative.
- **Typography, shadows, focus rings** — `design-tokens/figma-export.json` (Figma values baked into the export).
- **Spacing, border-radius, breakpoints** — Tailwind v4 defaults (confirmed by designer 2026-04-23).

> **FONT OVERRIDE:** This POC uses DM Sans for ALL text. Figma references ITC Avant Garde Gothic Pro and Dejanire Headline, but those commercial fonts aren't available. Every text style is rendered in DM Sans. The original family is preserved in `tokens.resolved.json` under each text style's `figmaFontFamily` field for traceability.

> **Resolved in full** as of 2026-04-23. Every color (including gradients and the swatch stroke) has an authoritative value.

---

## Brand color ramps

### Slate Blue (`slate-blue-*`)

| Shade | Hex        |
|------:|:-----------|
| 50    | `#EFF2F5`  |
| 100   | `#DEE5EB`  |
| 200   | `#BDCBD6`  |
| 300   | `#9DB0C2`  |
| 400   | `#7C96AD`  |
| 500   | `#5B7C99`  |
| 600   | `#49637A`  |
| 700   | `#374A5C`  |
| 800   | `#24323D`  |
| 900   | `#12191F`  |

### Burnished Gold (`burnished-gold-*`)

| Shade | Hex        |
|------:|:-----------|
| 50    | `#F8F4EC`  |
| 100   | `#F0E8D9`  |
| 200   | `#E2D1B3`  |
| 300   | `#D3BB8C`  |
| 400   | `#C5A466`  |
| 500   | `#B68D40`  |
| 600   | `#927133`  |
| 700   | `#6D5526`  |
| 800   | `#49381A`  |
| 900   | `#241C0D`  |

### Champagne Beige (`champagne-beige-*`)

| Shade | Hex        | Note                                     |
|------:|:-----------|:-----------------------------------------|
| 50    | `#FFFFFF`  | Ramp starts at pure white — intentional. |
| 100   | `#FCF9F4`  |                                          |
| 200   | `#F9F4E8`  |                                          |
| 300   | `#F7EEDD`  |                                          |
| 400   | `#F4E9D1`  |                                          |
| 500   | `#F1E3C6`  |                                          |
| 600   | `#D8C7A4`  |                                          |
| 700   | `#BFAB82`  |                                          |
| 800   | `#A58F60`  |                                          |
| 900   | `#8C733E`  |                                          |

### Deep Emerald Green (`deep-emerald-green-*`)

| Shade | Hex        | Note                                                                       |
|------:|:-----------|:---------------------------------------------------------------------------|
| 50    | `#6AEDD7`  | **Non-standard** — the 50 shade is a bright cyan/teal. Verify w/ designer. |
| 100   | `#5EDBC6`  |                                                                            |
| 200   | `#47B8A5`  |                                                                            |
| 300   | `#2F9483`  |                                                                            |
| 400   | `#187162`  |                                                                            |
| 500   | `#004D40`  | Primary brand color.                                                       |
| 600   | `#003E33`  |                                                                            |
| 700   | `#002E26`  |                                                                            |
| 800   | `#001F1A`  |                                                                            |
| 900   | `#000F0D`  |                                                                            |

---

## Base colors

| Token         | Value         | Note                                                                 |
|:--------------|:--------------|:---------------------------------------------------------------------|
| `white`       | `#FFFFFF`     |                                                                      |
| `black`       | `#000000`     |                                                                      |
| `transparent` | `transparent` | Figma's "Transparent" style is stored as a solid-white fill (`#FFFFFF`). Remapped to the CSS `transparent` keyword so `bg-transparent` behaves correctly. Raw Figma value preserved in `tokens.resolved.json`. |

---

## Default Tailwind palette

19 default Tailwind ramps (50–900): `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` — 190 entries. 18 of them came verbatim from the designer's list; `slate` was added when the gradients revealed it was needed (base color `#1E293B` = Tailwind default `slate-800`). See `tokens.resolved.json` for full values.

---

## Additional

| Token                     | Value                 | Note                                                                                   |
|:--------------------------|:----------------------|:---------------------------------------------------------------------------------------|
| `additional.swatchStroke` | `rgba(0, 0, 0, 0.24)` | Outer stroke on color/fabric swatches. Black at 24 % opacity, matching the `Swatch inner` shadow. |

---

## Gradients

Base color is **Tailwind default `slate-800` (`#1E293B`)**, not the brand `slateBlue-800` (`#24323D`). Tailwind's default `slate` ramp has also been added to `tokens.resolved.json` under `colors.slate` to support this. Angle `0°` in Figma corresponds to CSS `linear-gradient(0deg, …)` — bottom-to-top.

| Token                     | Stops                                    | CSS                                                                          |
|:--------------------------|:-----------------------------------------|:-----------------------------------------------------------------------------|
| `slate-800/0-to-75`       | `#1E293B` @ 0 % → `#1E293B` @ 75 %       | `linear-gradient(0deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 0.75) 100%)` |
| `slate-800/60-to-80`      | `#1E293B` @ 60 % → `#1E293B` @ 80 %      | `linear-gradient(0deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%)` |
| `slate-800/0-to-100`      | `#1E293B` @ 0 % → `#1E293B` @ 100 %      | `linear-gradient(0deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 1) 100%)`     |

---

## Typography

**All text styles render in DM Sans regardless of the Figma family.** 52 text styles resolved from `figma-export.json`. Representative samples:

| Token                                 | Figma family                   | Size | Line-height | Weight |
|:--------------------------------------|:-------------------------------|-----:|------------:|-------:|
| `text-xs/leading-4/font-medium`       | ITC Avant Garde Gothic Pro     | 12   | 16          | 500    |
| `text-sm/leading-5/font-medium`       | ITC Avant Garde Gothic Pro     | 14   | 20          | 500    |
| `text-base/leading-6/font-medium`     | ITC Avant Garde Gothic Pro     | 16   | 24          | 500    |
| `text-lg/leading-7/font-medium`       | ITC Avant Garde Gothic Pro     | 18   | 28          | 500    |
| `text-xl/leading-7/font-medium`       | ITC Avant Garde Gothic Pro     | 20   | 28          | 500    |
| `text-2xl/leading-8/font-normal`      | Dejanire Headline              | 24   | 32          | 400    |
| `text-3xl/leading-9/font-normal`      | Dejanire Headline              | 30   | 36          | 400    |
| `text-4xl/leading-10/font-normal`     | Dejanire Headline              | 36   | 40          | 400    |

Weights present: 300, 400, 500, 700. No 600 (Demi) style, despite the Button component previously returning Demi-600 via the MCP — flag for designer if that discrepancy matters.

Full set of 52 styles in `tokens.resolved.json`.

---

## Shadows

| Token                     | CSS value                                                                             |
|:--------------------------|:--------------------------------------------------------------------------------------|
| `Shadow/sm`               | `0 1px 2px 0 rgba(0,0,0,0.05)`                                                        |
| `Shadow/base`             | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)`                           |
| `Shadow/md`               | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`                     |
| `Shadow/lg`               | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`                   |
| `Shadow/xl`               | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)`                 |
| `Shadow/2xl`              | `0 25px 50px -12px rgba(0,0,0,0.25)`                                                  |
| `Shadow/inner`            | `inset 0 2px 4px 0 rgba(0,0,0,0.06)`                                                  |
| `Additional/Swatch inner` | `inset 0 0 0 3px rgba(0,0,0,0.24), inset 0 0 0 2px #FFFFFF`                           |

Authoritative values from `tokens.resolved.json` — the strings above are formatted for readability. See the JSON for exact rgba precision.

---

## Focus rings

| Token           | CSS value           | Purpose                   |
|:----------------|:--------------------|:--------------------------|
| `Focus/Primary` | `0 0 0 4px #E1EBDD` | Default focus ring        |
| `Focus/Error`   | `0 0 0 4px #FECDD3` | Error/invalid input       |
| `Focus/Warning` | `0 0 0 4px #FDE68A` | Warning state             |
| `Focus/Success` | `0 0 0 4px #A7F3D0` | Success state             |

---

## Spacing, border-radius, breakpoints

All three categories use **Tailwind v4 defaults**, confirmed by designer 2026-04-23. `_meta.source: tailwind-default` is now an attribution rather than a pending flag.

- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- No custom `xs` breakpoint (the `xs = 376px` from `PROJECT_CONTEXT.md` was dropped).
- No Bootstrap values.

---

## Ready for

Once you've reviewed this file and confirmed the open questions (#2–5), the next step is:

```sh
npm run tokens:build
```

…which reads `tokens.resolved.json` and writes `src/css/theme.css` (the Tailwind v4 `@theme` block). **I have not run this yet.** It's the hard checkpoint from the project brief.

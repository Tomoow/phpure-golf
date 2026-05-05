# Button — A-basic — spec

Figma-extracted spec for the PHPure Golf brand button. Token names reference `design-tokens/tokens.resolved.json`. **Do not reproduce hex values** — resolve names via the theme.

---

## 1. Overview

**Purpose.** Primary interactive element for CTAs, form actions, and navigation. 4 visual styles × 5 sizes × 5 icon variations × 5 states (500 total variants in Figma).

**Figma node (colon form):** `1286:12715`
**Figma node (dash form):** `1286-12715`
**Figma file key:** `YlKyhwcdYEa41gK1BSs4AZ`

**Variant properties (Figma component set):**

| Property | Values |
|---|---|
| `Size`  | `S`, `M`, `L`, `XL`, `2XL` |
| `Style` | `Primary`, `Secondary`, `Tertiary`, `Transparent` |
| `Icon`  | `None`, `Leading`, `Trailing`, `Only`, `Only (Round)` |
| `State` | `Default`, `Hover`, `Focus`, `Active`, `Disabled` |

**Total symbols in Figma:** 500 (verified from `get_metadata`).

**Author decision log — required calls before implementing:**

1. The Figma component renders text-with-label buttons (`Icon=None|Leading|Trailing`) as a **pill** (`border-radius: 99999px` — fully rounded). But `Icon=Only` and `Icon=Only (Round)` render with **`border-radius: 8px`** (a square with rounded corners), not a circle — and the MCP returns identical code for both `Only` and `Only (Round)`. Yet the rendered screenshot clearly shows `Only (Round)` as a full circle. **Flag Q#9 in `questions.md`.** Author must confirm `Only (Round)` is meant to be fully circular (`border-radius: 9999px`) — otherwise fall back to the MCP-reported `8px` and match the `Only` variant.
2. The Hyvä kit `button.css` ships `--btn-stroke`, `--btn-bg`, `--btn-color` CSS custom properties with hover/active/disabled overrides. The PHPure Golf design uses the **same structural model** (bg / text / border overrides per state), so the author should keep the kit's `@utility btn` skeleton and only change token values. See §2 for the variant×state matrix.
3. **Border-width inconsistency** between styles: `Tertiary` uses a **1px** border, but `Transparent` Hover and Active use a **2px** border. See Q#10. Author should preserve these per-style widths rather than unifying.
4. Figma returns the text style token name `text-sm/leading-5/font-medium` but the resolved font weight on the Button is **Demi 600**, while `tokens.resolved.json` has this same token at weight **400/500**. This is the pre-existing question #8 in `questions.md`. For this component the author should use **font-weight: 600** (matching the Figma-rendered weight on the button) unless the designer says otherwise.
5. Focus shadow uses the `Focus/Primary` token (`0 0 0 4px #e1ebdd`) on 3 of 4 styles. `Transparent` Focus is different: the shadow is applied **on the button itself**, but the OUTER wrapper gets a separate `4px #bfdbfe` (blue.200) border with a `6px` radius. Author should replicate this as an additional outer ring via `outline` or a parent wrapper. See §2 notes.

---

## 2. Variant matrix — Size=M, Icon=None

Rows = `Style`. Columns = `State`. Each cell lists `bg / text / border / shadow` tokens by name. Unless noted, border is absent (no stroke).

**All values extracted from these Figma nodes (Size=M, Icon=None):**

| Style | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| Primary | `1287:11236` | `1287:11264` | `1287:11296` | `1287:11326` | `1287:11358` |
| Secondary | `1287:11460` | `1287:11470` | `1287:11480` | `1287:11490` | `1287:11500` |
| Tertiary | `1287:11610` | `1287:11620` | `1287:11630` | `1287:11640` | `1287:11650` |
| Transparent | `1287:11760` | `1287:11770` | `1287:11780` | `1287:11790` | `1287:11800` |

### Primary

| Property | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| Background | `deepEmeraldGreen.500` | `deepEmeraldGreen.300` | `deepEmeraldGreen.500` | `deepEmeraldGreen.500` | `slateBlue.600` |
| Text       | `base.white` | `neutral.50` | `base.white` | `base.white` | `slateBlue.50` |
| Border     | none | none | none | none | none |
| Shadow     | none | `Shadow/lg` | `Focus/Primary` | `Shadow/base` | none |
| Opacity    | 1 | 1 | 1 | 1 | `0.70` (container) |

### Secondary

| Property | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| Background | `champagneBeige.200` | `burnishedGold.200` | `champagneBeige.200` | `burnishedGold.200` | `slateBlue.50` |
| Text       | `burnishedGold.800` | `burnishedGold.800` | `burnishedGold.800` | `burnishedGold.800` | `slateBlue.600` |
| Border     | none | none | none | none | none |
| Shadow     | none | `Shadow/lg` | `Focus/Primary` | `Shadow/base` | none |
| Opacity    | 1 | 1 | 1 | 1 | `0.70` (container) |

### Tertiary

| Property | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| Background | `base.white` | `base.white` | `base.white` | `base.white` | `base.white` |
| Text       | `deepEmeraldGreen.500` | `deepEmeraldGreen.500` | `deepEmeraldGreen.500` | `deepEmeraldGreen.500` | `slateBlue.600` |
| Border     | `1px solid deepEmeraldGreen.500` | `1px solid deepEmeraldGreen.500` | `1px solid deepEmeraldGreen.500` | `1px solid deepEmeraldGreen.500` | `1px solid slateBlue.200` |
| Shadow     | none | `Shadow/lg` | `Focus/Primary` | `Shadow/base` | none |
| Opacity    | 1 | 1 | 1 | 1 | `0.70` (container) |

### Transparent

| Property | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| Background | `base.transparent` | `base.transparent` | `base.transparent` | `base.transparent` | `base.transparent` |
| Text       | `blue.700` | `blue.800` | `blue.700` | `blue.800` | `slateBlue.600` |
| Border     | none | `2px solid blue.100` | none¹ | `2px solid blue.500` | none |
| Shadow     | none | none² | `Focus/Primary` | none² | none |
| Opacity    | 1 | 1 | 1 | 1 | `0.70` (container) |

¹ Transparent-Focus is distinct: the button itself has no border, but the OUTER wrapper acquires a **4px solid `blue.200`** border with `6px` radius (a bigger outer ring). The button-level `Focus/Primary` drop-shadow is also applied. Author should render this as an outer focus ring (e.g. via `outline: 4px solid var(--color-blue-200); outline-offset: 2px; border-radius: 6px` on wrapper, or `box-shadow: 0 0 0 4px var(--color-blue-200)`).

² Transparent Hover and Active do **not** receive `Shadow/lg` / `Shadow/base` (unlike the other three styles). They gain a visible border instead, which is the Transparent way of signalling the state.

---

## 3. Sizes

All sizes are captured at `Style=Primary, Icon=None, State=Default`. Typography token names reference `tokens.resolved.json/typography`. Note on weight: see decision log #4.

**Figma nodes:**

| Size | Node (Primary, None, Default) | Overall size (W × H, Icon=None) |
|---|---|---|
| S   | `1286:12714` | 75 × 36 |
| M   | `1287:11236` | 83 × 40 |
| L   | `1287:11243` | 89 × 44 |
| XL  | `1287:11250` | 97 × 48 |
| 2XL | `1287:11257` | 119 × 60 |

### Padding, typography, icon dimensions per size

| Size | Padding (block × inline), Icon=None | Padding, Icon=Leading (pl / pr / py) | Typography token | Gap (icon ↔ label) | Icon size | Icon-Only pad / size |
|---|---|---|---|---|---|---|
| S   | 8 × 16 px  | 14 / 16 / 8 px  | `text-sm/leading-5/font-medium`¹  | 6 px | 20 px | `8px` / 36×36 |
| M   | 10 × 20 px | 18 / 20 / 10 px | `text-sm/leading-5/font-medium`¹  | 6 px | 20 px | `10px` / 40×40 |
| L   | 10 × 20 px | 18 / 20 / 10 px | `text-base/leading-6/font-medium`¹ | 6 px | 20 px | `10px` / 44×44 |
| XL  | 12 × 24 px | 22 / 24 / 12 px | `text-base/leading-6/font-medium`¹ | 6 px | 20 px | `12px` / 48×48 |
| 2XL | 16 × 32 px | 30 / 32 / 16 px | `text-lg/leading-7/font-medium`¹  | 6 px | 24 px (Leading/Trailing) / **32 px (Icon-Only)** | `14px` / 60×60 |

¹ All sizes use the `font-medium` slot, but Figma renders at **weight 600 (Demi)** (see decision log #4).

**Sizing observations:**
- `Icon=Leading` / `Icon=Trailing` use **asymmetric horizontal padding** (less padding on the icon side). Ratio: `padding-start = padding-inline − 2px` when the icon leads (e.g. M: pl=18, pr=20). Mirror for trailing.
- `Icon=Only` uses **equal padding on all sides** (single `p-*` value).
- Block padding is identical for all icon variants at a given size: S=8, M=10, L=10, XL=12, 2XL=16.
- Icon size stays at **20px for S / M / L / XL**, and jumps to **24px** for 2XL (Leading/Trailing) or **32px** for 2XL Icon-Only. This is the one deviation from a uniform icon-size scale.

---

## 4. Icon-only variant

Two subtypes:
- **`Icon=Only`** — square button with rounded corners.
- **`Icon=Only (Round)`** — designed to be fully circular per the Figma rendered screenshot, but the MCP `get_design_context` returns the SAME `rounded-[8px]` value as `Only` for both. See §1 decision log #1 and Q#9.

### Dimensions

| Size | Button W×H | Inner padding (all sides) | Icon size | Outer wrapper radius (Figma React) | Inner radius (MCP) |
|---|---|---|---|---|---|
| S   | 36 × 36 | 8 px  | 20 px | `16px`  | `8px` |
| M   | 40 × 40 | 10 px | 20 px | `16px`  | `8px` |
| L   | 44 × 44 | 10 px | 20 px | `16px`¹ | `8px`¹ |
| XL  | 48 × 48 | 12 px | 20 px | `16px`¹ | `8px`¹ |
| 2XL | 60 × 60 | 14 px | 32 px | `16px`  | `8px` |

¹ L and XL not individually re-queried for Icon-Only dimensions; inferred by the symmetric size progression (S=36, M=40, L=44, XL=48, 2XL=60). Author should verify L and XL before implementing if in doubt.

### Accessibility

Icon-only buttons have no visible text. They **must** include an `aria-label` attribute naming the action (e.g. `aria-label="Add to wishlist"`). If the icon conveys text content that is announced elsewhere in the page, the icon itself must be decorative (`aria-hidden="true"`) with the label on the button.

### Style coverage

**All 4 style variants (Primary / Secondary / Tertiary / Transparent) support Icon=Only and Icon=Only (Round).** Figma metadata confirms: 5 sizes × 4 styles × 2 icon-only subvariants × 5 states = 200 icon-only symbols. The other 300 symbols are the text+icon variants.

---

## 5. Shape & spacing

### Border radius

| Icon mode | Radius |
|---|---|
| `None` / `Leading` / `Trailing` (text visible) | `99999px` (fully pill — treat as `--radius-full` / `9999px`) |
| `Only`        | `8px` (inner) on wrapper `16px` — see Q#9 |
| `Only (Round)` | Figma screenshot shows fully circular; MCP reports `8px`. See Q#9 |

None of the Figma radius values map cleanly onto `tokens.resolved.json/borderRadius` which is the Tailwind v4 default scale (`md: 0.375rem = 6px`, `lg: 0.5rem = 8px`, `xl: 0.75rem = 12px`, `2xl: 1rem = 16px`, `full: 9999px`).

**Mapping to existing tokens:**

| Figma value | Token match |
|---|---|
| `99999px` | `borderRadius.full` (`9999px`) — pill |
| `8px`     | `borderRadius.lg` (`0.5rem = 8px`) |
| `16px`    | `borderRadius.2xl` (`1rem = 16px`) — only on the outer Icon-Only wrapper div |
| `6px`     | `borderRadius.md` (`0.375rem = 6px`) — only on the Transparent Focus outer wrapper |

### Border width

Not uniform across styles:

| Style | Border width |
|---|---|
| Primary | 0 (none) |
| Secondary | 0 (none) |
| Tertiary | **1px** (all states) |
| Transparent | **0** Default/Focus/Disabled, **2px** Hover/Active |
| Transparent outer-wrapper focus ring | **4px** |

See §1 decision log #3 and Q#10.

---

## 6. Typography

Every size maps to a text style token from `tokens.resolved.json/typography`:

| Size | Token | Figma reports | Resolved in tokens |
|---|---|---|---|
| S   | `text-sm/leading-5/font-medium` | size=14, line=20, **weight=600 Demi** | size=14, line=20, weight=400 |
| M   | `text-sm/leading-5/font-medium` | size=14, line=20, **weight=600 Demi** | size=14, line=20, weight=400 |
| L   | `text-base/leading-6/font-medium` | size=16, line=24, **weight=600 Demi** | size=16, line=24, weight=400 |
| XL  | `text-base/leading-6/font-medium` | size=16, line=24, **weight=600 Demi** | size=16, line=24, weight=400 |
| 2XL | `text-lg/leading-7/font-medium` | size=18, line=28, **weight=600 Demi** | size=18, line=28, weight=400 |

**Weight inconsistency:** the `font-medium` token slot in the token export says 400/500, but Figma's Button symbols are rendered at weight 600 (ITC Avant Garde Gothic Pro, Demi). This is pre-existing question **#8** in `questions.md`. For the Button specifically, render at **font-weight: 600** — the visually tested and designer-approved weight on the component.

**Font family:** `ITC Avant Garde Gothic Pro` in Figma → **`DM Sans`** per the POC `fontFamilyOverrides` in `tokens.resolved.json`. Use `fontFamily.sans`.

**Letter-spacing:** 0% on all sizes.

---

## 7. Auto-layout

- **Direction:** `flex-row`.
- **`Icon=Leading`:** icon first, label second, `gap: 6px`. Container padding is asymmetric — the side with the icon gets 2px less horizontal padding (e.g. Size M: `pl=18px`, `pr=20px`, `py=10px`).
- **`Icon=Trailing`:** label first, icon second, `gap: 6px`. Asymmetric the other way (`pl=20px`, `pr=18px`, `py=10px`).
- **`Icon=None`:** single label child, symmetric padding.
- **`Icon=Only` / `Icon=Only (Round)`:** single icon child, square container with symmetric padding on all sides.
- **Alignment:** `items-center justify-center`.
- **Overflow:** `overflow-clip` on the inner wrapper (keeps the border-radius corner-clip consistent).
- **`content-stretch flex items-start`** on the OUTER wrapper — this is Figma's top-level container for the button and does not need to be preserved in the generated component (Hyvä's `<button class="btn">` IS the interactive element, not a wrapped div).

---

## 8. Implied interactions

- **Element type:** `<button>` for actions; `<a class="btn">` for navigation. The kit's `@utility btn` works on both. Author must preserve this dual-purpose usage.
- **Hover transition:** Figma doesn't expose a duration; inherit from the kit's `--default-transition-duration` / `--default-transition-timing-function` (already applied to `background-color`, `border-color`, `color`, `outline-color`, `box-shadow` in `button.css`).
- **Disabled behavior:** preserve the kit's existing approach — both `:disabled` (native `<button disabled>`) and `[aria-disabled="true"]` should match the Disabled visuals. Disabled containers also carry `opacity: 0.70` on the Figma rendering — add as a Disabled-only rule (`opacity: 0.70;`).
- **Focus-visible vs focus:** the Figma `State=Focus` visual is strong enough (4px halo) that it must only fire on `:focus-visible` (keyboard focus), not all `:focus`, to avoid a click-fired halo on mouse-clickers. Author should use `:focus-visible` rather than `:focus`.
- **Active:** CSS `:active`, `.is-active`, `[aria-current="page"]`, `[aria-current="true"]` — match the kit's existing `&:is(...)` selector.

---

## 9. Open questions

New questions introduced by this component. All logged in `design-tokens/questions.md`:

- **Q#9** — Icon=Only vs Icon=Only (Round): MCP returns identical `rounded-[8px]` for both, but the rendered screenshot clearly shows Only (Round) as fully circular. Need designer confirmation on the actual radius for Only (Round).
- **Q#10** — Border-width inconsistency: Tertiary uses 1px, Transparent Hover/Active uses 2px. Intentional? If so, the author will preserve; if not, choose one.
- **Q#11** — Transparent Focus uses a different outer-ring mechanism (4px outer wrapper border) than the other three styles (which rely on `Focus/Primary` box-shadow halo only). Need designer confirmation on whether this is intentional or a Figma-side quirk.
- **Q#12** — Icon library: confirmed Heroicons per `CLAUDE.md` → `src/fonts/...` section says "Icons: Heroicons." The Figma asset names returned include e.g. `Icon/Solid/photograph` — this matches Heroicons naming. Author should map Figma icon names to the Heroicons v2 set (`<component>/solid` / `<component>/outline`).
- (Pre-existing) **Q#8** — `font-medium` slot returns weight 400/500 in tokens but weight 600 on the Figma Button. Not blocking; use 600 for this component.

---

## Appendix — referenced Figma node IDs

For the reviewer to cross-check against the live Figma file:

- **Component set:** `1286:12715`
- **Primary M States:** Default `1287:11236`, Hover `1287:11264`, Focus `1287:11296`, Active `1287:11326`, Disabled `1287:11358`
- **Secondary M States:** Default `1287:11460`, Hover `1287:11470`, Focus `1287:11480`, Active `1287:11490`, Disabled `1287:11500`
- **Tertiary M States:** Default `1287:11610`, Hover `1287:11620`, Focus `1287:11630`, Active `1287:11640`, Disabled `1287:11650`
- **Transparent M States:** Default `1287:11760`, Hover `1287:11770`, Focus `1287:11780`, Active `1287:11790`, Disabled `1287:11800`
- **Primary Default — all sizes (Icon=None):** S `1286:12714`, M `1287:11236`, L `1287:11243`, XL `1287:11250`, 2XL `1287:11257`
- **Primary Default — Icon=Leading across sizes:** S `1287:11910`, M `1287:11912`, L `1287:11914`, XL `1287:11916`, 2XL `1287:11918`
- **Primary Default — Icon=Only:** S `1287:14560`, M `1287:14568`, L `1287:14576`, XL `1287:14584`, 2XL `1287:14592`
- **Primary Default — Icon=Only (Round):** S `1287:15660`, M `1287:15668`, L `1287:15676`, XL `1287:15684`, 2XL `1287:15692`

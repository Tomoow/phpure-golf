# product-card / A-basic — Spec Sheet

**Figma node:** `2256:7466` (`ui_productcard_a_swatches`)
**Figma URL:** https://figma.com/design/YlKyhwcdYEa41gK1BSs4AZ/?node-id=2256-7466
**Extraction date:** 2026-05-13
**Atom or molecule call:** **MOLECULE.** This is a card that COMPOSES five approved atoms (`buttons`, `swatches`, `review`, `form-checkbox`, `status` — `status` is implied by the "In stock / Out of stock" stock-state axis but is not rendered in any of the eight Figma leaves; see §3 + OQ-PC-2). It introduces three card-local sub-elements that are NOT atoms: the image frame, the price display, and the corner promo/"New" badge.
**Hyvä kit starting point:** `hyva-ui-reference/components/product-card/A-card-with-swatches/` — same name family ("card with swatches"), same Magento_Catalog wiring (`product/list/item.phtml` + `product/list/wishlist/button.phtml` + `product/list/compare/button.phtml`), same `view_mode = grid|list` axis driven from layout XML. The kit version is structurally compatible; visual presentation diverges (rounded `rounded-2xl` card with champagne-beige background instead of white card with shadow, rounded-full pill buttons, swatches under the product name, no compare/wishlist hover swap, etc.).

---

## §1 Variant matrix

The Figma frame `2256:7466` contains **eight default-state leaves** plus **two additional hover/other-product variants** that are HIDDEN in the source frame and therefore out of scope for this spec (logged in OQ-PC-5).

The eight in-scope leaves are the full Cartesian product of three binary axes: **Device (Desktop | Mobile) × Style (Grid | List) × Promo (False | True)** = 2 × 2 × 2 = **8 leaves**. Product variant `Gear` is the only one populated (the variant property `Product = Clothes` exists but only on the two hidden Hover frames — also OQ-PC-5).

| # | Node ID | Device | Style | Promo | Outer size (px) | Image frame (px) |
|--:|---|---|---|---|---|---|
| 1 | `2256:7370` | Desktop | Grid | False | 376 × 658 | 336 × 240 (image area, full-bleed content within card padding) |
| 2 | `5870:46733` | Desktop | Grid | True  | 376 × 658 | 336 × 240 |
| 3 | `5867:16444` | Mobile  | Grid | False | 158 × 478 | 142 × ~102 (image area, padded `px-2` inside card) |
| 4 | `5870:48289` | Mobile  | Grid | True  | 158 × 478 | 142 × ~102 |
| 5 | `2256:7418` | Desktop | List | False | 960 × 352 | 320 × 320 (square, sits left of content) |
| 6 | `11109:24592` | Desktop | List | True  | 960 × 352 | 320 × 320 |
| 7 | `11109:23973` | Mobile  | List | False | 320 × 228 | 109 × 102 (image area, ~50/50 split with text) |
| 8 | `11109:24757` | Mobile  | List | True  | 320 × 228 | 109 × 102 |

**Hidden / out-of-scope leaves in the same frame** (see OQ-PC-5):
- `2256:7442` (Desktop, List, **State=Hover**, Product=**Clothes**, Promo=False) — 960 × 412.
- `2256:7394` (Desktop, **Style=Original Grid**, State=Hover, Product=Clothes, Promo=False) — 376 × 666. The "Original" qualifier suggests an older grid layout retained for reference; not part of the live matrix.

**Axis verification — is "Mobile" a real variant or just responsive?** Real variant. Across leaves the following changes when `Device` flips from Desktop → Mobile:
- Outer card width hard-codes to 158 px (grid) or 320 px (list) — not a percentage of parent.
- Inner padding switches: Desktop grid = `px-5 py-4` (20 / 16 px); Mobile grid = `py-4` only with image in `px-2` and meta in `px-3`. Desktop list = `p-4` with `gap-6`; Mobile list = `py-4 px-3 gap-4`.
- The "Add to cart" button changes from icon-leading-with-label (`"🛒 Add to cart"`) on Desktop to **icon-only** (no label) on Mobile. Same for wishlist on Mobile — already icon-only across both breakpoints.
- The product title weight changes from **Bold** (Desktop, `font-['ITC_Avant_Garde_Gothic_Pro:Bold']` weight 700) to **Demi** (Mobile, weight 600). See §7.
- The list-view layout direction flips: Desktop list = horizontal row (image left, content right); Mobile list = horizontal row but stacked differently (image + buttons in left column, meta + swatches + price + comparison in right column).
- The promo `-20%` badge anchors differently: Desktop top-right of card content (Grid) or top-left edge of card (List); Mobile pins to the right edge with `rounded-bl-lg rounded-tl-lg` (corner radius on left side only, since it hugs the right edge).
- The "New" beige badge also moves: Desktop Grid = top, immediately left of where the `-20%` badge would sit (so the two stack horizontally when promo=true); Mobile = below the `-20%` badge on the right edge.

So while the responsive behaviour COULD in principle achieve this with breakpoint utilities, Figma treats Desktop and Mobile as distinct leaves with different DOM ordering — not a fluid scale-down. The molecule output will use breakpoint utilities (`md:`, `lg:`) to switch between the two, but the structural rules below must be respected per breakpoint.

**Axis verification — is Promo a real variant or a runtime flag?** Real Figma variant property (`Promo=False|True`). Behaviour when `True`:
- A red `-20%` corner badge appears at the card edge (top-right Desktop grid, top-left Desktop list, right-edge Mobile). Badge background `red.600 = #DC2626`, white text, `text-sm/leading-5/font-normal` weight, `rounded-bl-lg` + `rounded-br-lg` (Desktop grid) or `rounded-bl-lg` + `rounded-tl-lg` (List + Mobile, where it hugs the side). Padding `px-1 py-2.5` (4 px / 10 px), height 40 px.
- The CURRENT price colour flips from `slateBlue.800 = #24323D` to `red.600 = #DC2626`, same `text-2xl/leading-8/font-normal` size on Desktop and Mobile grid; flips to `text-xl/leading-7/font-normal` (20 / 28) on Mobile list — see OQ-PC-1.
- An OLD strikethrough price renders next to the current price (gap 12–16 px). Font: `text-base/leading-6/font-light` (16 / 24, weight 300) on Desktop list and Mobile, BUT `text-lg/leading-7/font-light` (18 / 28, weight 300) on Desktop Grid. The Figma typography lookup confirms two different sizes — see OQ-PC-3.
- The "New" beige badge stays in place but stacks with the `-20%` badge.

So Promo is a binary axis driving: (a) corner badge presence, (b) current-price colour, (c) addition of old-price element, with size variations per breakpoint.

**Axis verification — is "In-stock / Out-of-stock" present?** **Not in this Figma frame.** The user mentioned a 4th implicit axis (Stock state), but none of the eight default-state leaves render a stock-status indicator. The Hyvä kit template renders `$block->getChildBlock('stockstatus')->setData('product', $product)->toHtml()` between price and the button row, so the slot exists structurally in the kit, and the project HAS an approved `status` atom with `status--stock-status` + `status--in-stock` + `status--out-of-stock` modifiers. **Decision (logged as OQ-PC-2):** the molecule must render the stock-status slot using the `status` atom, but its exact placement in the card and its in-card typography token are not specified in Figma. The author needs a designer answer before shipping.

---

## §2 Anatomy (top-to-bottom, per layout)

### 2.1 Desktop Grid (`2256:7370`, 376 × 658)

| # | Element | Atom or new? | Atom class / token reference |
|--:|---|---|---|
| 1 | **Card root** (rounded-2xl, `champagneBeige.100` bg, hidden overflow) | NEW card-local | `product-card__root` — see §4.1 |
| 2 | **"New" badge** (absolute top, beige `champagneBeige.500`, deepEmeraldGreen.500 text, `rounded-bl-lg rounded-br-lg`, 40 px tall, `px-1 py-2.5`) | NEW card-local | `product-card__badge product-card__badge--new` — see §4.3 |
| 3 | **"-20%" badge** (only when promo=true, red.600 bg, white text, same shape as #2 but anchored differently) | NEW card-local | `product-card__badge product-card__badge--promo` — see §4.3 |
| 4 | **Image frame** (full-bleed 336 × 240, rotated-square aspect-ratio container that Figma uses to crop the bag PNG into a stylised 45°-tilt square — see OQ-PC-4) | NEW card-local | `product-card__image-frame` + `product-card__image` — see §4.2 |
| 5 | **Inner content column** (`w-[280px]`, flex-col, `gap-4`) | layout helper | `product-card__body` |
| 5a | **Brand label** ("Druids") `text-sm/leading-5/font-normal`, `deepEmeraldGreen.500` | NEW card-local | `product-card__brand` |
| 5b | **Product title** ("Flyknit Racer") `text-lg/leading-7/font-bold`, `slateBlue.800`, truncated with ellipsis on one line | NEW card-local | `product-card__title` |
| 5c | **Reviews summary** (mini, 1 star + "4.1" + "(12)") | **existing atom** | `review-summary` + `review-summary--mono` (see §3) |
| 5d | **Color swatches row** (4 swatches, S size = 22 px) | **existing atom** | `swatch-group` containing four `.swatch.swatch--color.swatch--s` — see §3 |
| 5e | **Price row** (current price only when promo=false; current + old strikethrough when promo=true) | NEW card-local | `product-card__price-row` containing `product-card__price-current` and optional `product-card__price-old` — see §4.4 |
| 5f | **Stock status row** *(slot present in kit, not rendered in Figma)* | **existing atom** | `status status--dot status--stock-status status--in-stock` (or `--out-of-stock`) — see §3, OQ-PC-2 |
| 5g | **Action row** (Add-to-cart button + Wishlist icon-only round button) | **existing atom × 2** | `btn btn-primary btn-size-m` and `btn btn-icon-only-round btn-secondary btn-size-m` — see §3 |
| 5h | **Add to comparison** checkbox + label | **existing atom** | `form-checkbox` (size M) + label — see §3 |

### 2.2 Desktop List (`2256:7418` / `11109:24592`, 960 × 352)

Same elements as Desktop Grid but reflowed horizontally:
- Card root flex-row, `p-4 gap-6`.
- Image frame to the LEFT, fixed `w-[320px] h-[320px]` square (image keeps its rotated-aspect-ratio inside).
- Inner column to the right, flex-col with `gap-6`.
  - Top row inside the right column: **Brand + Title + short description** (LIST view adds a description paragraph, two lines max, ellipsis, `text-sm/leading-5/font-normal`, `slateBlue.500` color, `h-12 overflow-hidden text-ellipsis`) on the LEFT, **Reviews summary** floats to the RIGHT same row.
  - Swatches row below.
  - Price row below.
  - Action row below (button row + wishlist + Add-to-comparison stays a separate line in the list variant).

The "New" badge in the LIST variant anchors to the top-LEFT of the card edge with `rounded-bl-lg rounded-tl-lg`, sitting BELOW the `-20%` badge when promo=true.

### 2.3 Mobile Grid (`5867:16444` / `5870:48289`, 158 × 478)

Compressed vertical card:
- Card root `py-4` only (no horizontal padding on root); image wrapper has `px-2`; meta wrapper has `px-3`.
- Image frame ~142 × 102 (visually a smaller version of the Desktop Grid image).
- Inner column `w-full` (= 134 px usable inside `px-3`).
- Brand label → Title (this time **Demi**, weight 600, not Bold).
- Reviews summary.
- Swatches row but at **XS size** (16-px chips, ring size grows to 20 px around the selected chip; see §3).
- Price row: `text-2xl/leading-8/font-normal` (24 / 32) same as Desktop Grid.
- Action row: **`btn-icon-only-round`** for BOTH primary (no "Add to cart" label) AND wishlist on Mobile. Same `btn-size-m` paddings.
- Add to comparison checkbox at end. Label can wrap onto two lines ("Add to comparison" splits at "Add to" / "comparison" — see OQ-PC-6).

The `-20%` corner badge on Mobile pins to the right edge with `rounded-bl-lg rounded-tl-lg` (radius on the LEFT side of the badge, since it hugs the right edge of the card).

### 2.4 Mobile List (`11109:23973` / `11109:24757`, 320 × 228)

Horizontal compact card, ~50/50 split:
- Card root `py-4 px-3 gap-4 flex-row`.
- LEFT column (`flex-1`, `gap-3`): image (~109 × 102, centred) + action buttons (icon-only primary + icon-only round wishlist) sitting BELOW the image, NOT below the price.
- RIGHT column (`flex-1`, `gap-3`): brand → title (Demi) → reviews summary → swatches row (XS size) → price row (`text-xl/leading-7/font-normal` = 20 / 28, NOT 24 / 32 — Mobile List downshifts the price by one step; see OQ-PC-1) → add to comparison checkbox.

The "New" badge on Mobile List anchors LEFT (the original beige `rounded-bl-lg rounded-tl-lg` flipped, becomes `rounded-br-lg rounded-tr-lg` on the left edge — Figma serves a slightly smaller variant: `text-xs/leading-4/font-normal` 12 / 16 instead of 14 / 20, and `py-2 px-1` instead of `py-2.5 px-1`; see OQ-PC-7).

---

## §3 Atom composition map

| Card slot | Atom | Class / variant | Size | Notes |
|---|---|---|---|---|
| **Wishlist heart** | `buttons` | `btn btn-secondary btn-icon-only-round btn-size-m` | M (40 × 40 px) | Border `burnishedGold.700` = `#6D5526`, heart icon in `burnishedGold.700`. Treat as **toggle**: `aria-pressed`, accessible-name "Add to wishlist" / "Remove from wishlist". Same atom on Desktop AND Mobile, same M size in all four layouts. |
| **Add to cart (label visible)** | `buttons` | `btn btn-primary btn-icon-leading btn-size-m` | M | Used on Desktop Grid + Desktop List + Mobile *N/A — see below*. Pill shape (`rounded-full`), `deepEmeraldGreen.500` bg, white text, leading shopping-cart icon 20 × 20. |
| **Add to cart (icon-only)** | `buttons` | `btn btn-primary btn-icon-only-round btn-size-m` | M | Used on **Mobile Grid + Mobile List**. The cart icon stays the same; the "Add to cart" label is dropped. Width fills available space (`flex-1`). The button keeps the rounded-full pill shape (so it's a wide pill with just an icon centred). Verify pill vs round: see OQ-PC-8. |
| **Color swatches row** | `swatches/A-swatches-rounded` | `swatch-group` containing N × `swatch swatch--color` | **S (22 px)** Desktop, **XS (16 px)** Mobile | Spacing between swatches `gap-1.5` (6 px). No legend. 4 colors shown in default Figma demo. The 5th "out-of-stock" swatch (with x-circle overlay) appears only in the List variants (Desktop List + Mobile List); both Grid variants show 4 swatches without the OOS one. **Max-count + wrap rule:** Figma frames cap to 4 (Grid) or 5 (List) — no `+N more` overflow chip is shown anywhere in the eight leaves. Wrap policy: see OQ-PC-9. |
| **Stock status indicator** | `status/A-basic` | `status status--dot status--stock-status status--in-stock` (or `--out-of-stock`) | default | **Not present in any Figma leaf.** Hyvä kit template renders this between price and action row. Spec recommendation: render it under the price row (Desktop Grid / Mobile Grid) or at the right edge of the price row (Desktop List). See OQ-PC-2. |
| **Star rating** | `review/A-basic` | `review-summary review-summary--mono` (mono single-star + "4.1" + "(12)") | default | **Composition:** Leading=None, Stars=Mono-single-star (1 filled star icon, NOT 5-star track), Trailing=Score "4.1" (`text-sm/leading-5/font-bold`, `slateBlue.800`) + Counter "(12)" (`text-sm/leading-5/font-normal`, `slateBlue.500`). This is the COMPACT "Mini Reviews summary" variant of the atom, not the full 5-star track. See OQ-PC-10 — the atom currently ships the full 5-star track default; the card requires a mono-single-star modifier which may need to be added to the review atom. |
| **Add to comparison** | `form-checkbox/A-basic` | `form-checkbox` (size M, 20 × 20 box) with label "Add to comparison" | M | Sits as the last row of the card, full-width, `gap-1.5` between checkbox and label (6 px). On Mobile Grid the label wraps to two lines. |
| **(no other atoms used)** | | | | |

---

## §4 New card-local sub-elements

### 4.1 `product-card__root`
- **Purpose:** the wrapping `<form>` (when product is saleable, per Hyvä kit) or `<div>` (when not), holding all card content.
- **Shape:** `rounded-2xl` (16 px corner radius; the Figma value is `rounded-[12px]` = 12 px, which sits between `xl` and `2xl` — **using `rounded-xl` = 12 px** matches the design exactly).
- **Background:** `champagneBeige.100 = #FCF9F4`.
- **Overflow:** `overflow-hidden` (so the corner badges' rounded-bottom corners clip against the card's rounded edges cleanly).
- **Layout per breakpoint:** see §5.
- **No shadow, no border** in the default state (`hover:` adds a shadow — see §8).

### 4.2 `product-card__image-frame` + `product-card__image`
- **Purpose:** consistent product-image container with a fixed aspect ratio.
- **Sizing:**
  - Desktop Grid: `aspect-[336/240] w-full` (1.4 : 1) — 240 px tall.
  - Desktop List: `aspect-square w-[320px]` (1 : 1) — 320 × 320.
  - Mobile Grid: `aspect-[142/102] w-full` (~1.39 : 1) — ~102 px tall.
  - Mobile List: `w-[109px] h-[102px]` (~1.07 : 1).
- **Image positioning:** `object-cover` `pointer-events-none size-full` — Figma's actual implementation rotates the underlying image at 45° (`-rotate-45` wrapper + `rotate-[24.47deg]` keeper) to produce the "tilted bag" visual. This is a **demo-only artistic choice** (the rotated-aspect-ratio keeper assumes a square source image and crops it to look stylised). For the molecule's production CSS, the recommendation is to render a straightforward `object-cover` image and ignore the Figma rotation hack — see OQ-PC-4 for confirmation.
- **No border, no shadow, no background fill** on the frame itself (the card's beige bg shows through where the image is transparent).

### 4.3 `product-card__badge` (+ `--new` / `--promo`)
- **Purpose:** small corner ribbon-style label that hangs from the top edge of the card.
- **Shared shape:** height 40 px (Mobile List variant: 32 px — see OQ-PC-7), `px-1 py-2.5` (4 / 10 px), `flex items-center justify-center`, `whitespace-nowrap`. The CORNER radius depends on anchor:
  - Anchored to TOP-CENTER hanging down: `rounded-bl-lg rounded-br-lg` (radius on bottom corners, top is flush with card edge). Used by `--new` on Desktop Grid + Mobile Grid `--new`, by `--promo` on Desktop Grid.
  - Anchored to TOP-LEFT hugging the left edge: `rounded-bl-lg rounded-tl-lg` (effectively radius on the *outer* corners — but Figma shows this rotated/scaled, so visually it's `rounded-br-lg rounded-tr-lg` on the right inner edge — see Figma node `11109:24619` / `11109:24621`). Used by `--promo` and `--new` on Desktop List.
  - Anchored to TOP-RIGHT hugging the right edge: `rounded-bl-lg rounded-tl-lg` (radius on the inner side). Used by Mobile variants.
- **Variant `--new` colors:** bg `champagneBeige.500 = #F1E3C6`, text `deepEmeraldGreen.500 = #004D40`, font `text-sm/leading-5/font-normal` (14 / 20, weight 500). Label = "New".
- **Variant `--promo` colors:** bg `red.600 = #DC2626`, text white, font `text-sm/leading-5/font-normal` (14 / 20, weight 500). Label = "-20%" (the percentage is data — runtime). 
- **Mobile List `--new` smaller-typography sub-variant:** `text-xs/leading-4/font-normal` (12 / 16), height 32 px, `py-2 px-1` — see OQ-PC-7 for whether this should be parameterised or simply use a `.product-card__badge--sm` modifier on Mobile List.
- **Z-order:** above the image (because they're absolutely positioned over it).

### 4.4 `product-card__price-row` + `product-card__price-current` + `product-card__price-old`
- **Purpose:** display the product price; show original (strikethrough) + sale price together when promo=true.
- **Layout:**
  - Default (no promo): `flex gap-0.5 items-start` (2 px gap), only `__price-current` rendered.
  - Promo: Desktop Grid = `flex gap-4 items-center` (16 px gap); Desktop List = `flex gap-1 items-center` (4 px gap); Mobile Grid = `flex gap-3 items-center` (12 px gap); Mobile List = `flex gap-3 items-center` (12 px gap). See OQ-PC-3 for inter-price gap inconsistency.
- **`__price-current` typography & color:**
  - Default: `text-2xl/leading-8/font-normal` (24 / 32, weight 500), color `slateBlue.800 = #24323D`.
  - Promo Desktop Grid + Mobile Grid + Desktop List: same `text-2xl/leading-8/font-normal`, color `red.600 = #DC2626`.
  - Promo Mobile List: `text-xl/leading-7/font-normal` (20 / 28), color `red.600`. (OQ-PC-1.)
- **`__price-old` (promo only):**
  - Desktop Grid: `text-lg/leading-7/font-light` (18 / 28, weight 300), color `slateBlue.800` (`#24323D`), `line-through`. (Figma node `7681:31588` — "ITC Avant Garde Gothic Pro Book size=18".)
  - Desktop List + Mobile Grid + Mobile List: `text-base/leading-6/font-light` (16 / 24, weight 300), color `slateBlue.800`, `line-through`. (Figma nodes `11109:24835`, `7681:31754`.)
  - The visible discrepancy between Desktop Grid (18 px) and the other three (16 px) is genuine in Figma. See OQ-PC-3.
- **Strikethrough decoration:** `text-decoration: line-through` with `text-decoration-skip-ink: none` and `text-decoration-style: solid` (per Figma's `[text-decoration-skip-ink:none] decoration-solid`).

### 4.5 `product-card__description` (Desktop List only)
- **Purpose:** short product description shown only in the List view on Desktop (not present in Grid or in any Mobile leaf).
- **Typography:** `text-sm/leading-5/font-normal` (14 / 20, weight 500), color `slateBlue.500 = #5B7C99`.
- **Truncation:** `h-12 overflow-hidden text-ellipsis` (clip to two lines). The CSS standard way to clamp to N lines is `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;` — Figma's overflow strategy here is fixed-height + text-ellipsis, which only ellipsises the LAST visible line if it overflows. Recommendation: use line-clamp utility. See OQ-PC-11.

### 4.6 `product-card__action-row`
- **Purpose:** holds the "Add to cart" button + the wishlist icon-button, side by side.
- **Layout:** `flex gap-2 items-start w-full` (8 px gap). Primary button is `flex-1` (grows to fill); wishlist button is `shrink-0`.
- **No separate "compare" icon button:** the Hyvä kit ships a compare button alongside wishlist; the Figma design does NOT render a compare icon in any leaf, so the molecule's default action row should include the cart + wishlist only. (See OQ-PC-12 about whether to keep the Hyvä compare slot wired-up but rendered conditionally.)

---

## §5 Dimensions

| Layout | Outer card | Card padding | Body width | Image frame | Image aspect | Action row | Price row position |
|---|---|---|---|---|---|---|---|
| **Desktop Grid** (376 × 658) | `w-[376px]` total; `rounded-xl`; content area is the full 376 px width since the image is full-bleed within `px-5 py-4` | `px-5 py-4` (20 / 16 px) | `w-[280px]` (inner content stack, centred under image) | `w-full h-[240px]` (336 × 240 px area, full-bleed inside padding) | 1.4 : 1 (336 / 240) | bottom of card, `flex gap-2`, primary button `flex-1`, wishlist `shrink-0` | between swatches and action row |
| **Desktop List** (960 × 352) | `w-[960px]`; `rounded-xl`; `flex-row` | `p-4` (16 px all sides) with `gap-6` (24 px) between image and content | `flex-1` (grows after image; ~600 px wide on a 960-px outer) | `w-[320px] h-[320px]` square | 1 : 1 | sits as the LAST row of content, `flex gap-2`, primary `flex-1` capped at 218 px wide via Figma `w-[218px]` constraint | sits ABOVE action row; aligned left |
| **Mobile Grid** (158 × 478) | `w-[158px]`; `rounded-xl`; `py-4` only (root has no horizontal padding) | image wrapper `px-2` (8 px); meta wrapper `px-3` (12 px) | `w-full` inside the meta wrapper (~134 px usable) | `w-full h-[102px]`-ish (~142 × 102) | ~1.39 : 1 | last row of content; primary = `btn-icon-only-round` filling `flex-1`; wishlist = `btn-icon-only-round` shrink-0 | between swatches and action row |
| **Mobile List** (320 × 228) | `w-[320px]`; `rounded-xl`; `flex-row` with `py-4 px-3 gap-4` (16 / 12 / 16 px) | `py-4 px-3 gap-4` | `flex-1` for each of the two columns (LEFT column = image + action row; RIGHT column = text + swatches + price + compare) | `w-[109px] h-[102px]` (centred in LEFT column with `flex items-center justify-center`) | ~1.07 : 1 | sits BELOW the image in the LEFT column | sits in RIGHT column above the compare checkbox |

---

## §6 Tokens (every value used, mapped to `tokens.resolved.json`)

All values traceable to `design-tokens/tokens.resolved.json` via the figma-export style names.

### 6.1 Colors

| Role | Token path | Hex |
|---|---|---|
| Card root background | `colors.champagneBeige.100` | `#FCF9F4` |
| "New" badge background | `colors.champagneBeige.500` | `#F1E3C6` |
| "New" badge text + brand label text | `colors.deepEmeraldGreen.500` | `#004D40` |
| Promo "-20%" badge background + promo current-price text | `colors.red.600` | `#DC2626` |
| Promo "-20%" badge text | `colors.base.white` | `#FFFFFF` |
| Product title text + price (non-promo) + reviews score "4.1" | `colors.slateBlue.800` | `#24323D` |
| Reviews counter "(12)" + description text + swatch outline 200 | `colors.slateBlue.500` | `#5B7C99` |
| Description text in Desktop List | `colors.slateBlue.500` | `#5B7C99` |
| Wishlist icon button border | `colors.burnishedGold.700` | `#6D5526` |
| Wishlist icon (inside button) | `colors.burnishedGold.700` | `#6D5526` |
| Primary button background | `colors.deepEmeraldGreen.500` | `#004D40` |
| Primary button text + cart icon | `colors.base.white` | `#FFFFFF` |
| Swatch unselected outer ring (size XS Mobile only, on the lightest swatch) | `colors.slateBlue.200` | `#BDCBD6` |
| Swatch selected outer ring | `colors.deepEmeraldGreen.300` | `#2F9483` |
| Swatch selected inner white halo | `colors.base.white` | `#FFFFFF` |
| Swatch demo color: navy/sage | (literal `#9FB4A9` — not a brand token) | `#9FB4A9` |
| Swatch demo color: emerald-700 | `colors.emerald.700` | `#047857` |
| Swatch demo color: charcoal | (literal `#3A3A3A` — not a brand token) | `#3A3A3A` |
| Swatch demo color: amber-700 | `colors.amber.700` | `#B45309` |
| Swatch out-of-stock (List variants) | (literal `#52B4A8` — close to `deepEmeraldGreen.200=#47B8A5` but not exact) | `#52B4A8` |
| Checkbox border (Add to comparison, unchecked default) | `colors.slateBlue.300` | `#9DB0C2` |
| Checkbox background | `colors.base.white` | `#FFFFFF` |
| Comparison-label text | `colors.slateBlue.800` | `#24323D` |

**Notes on swatch demo colors:** the four sample colors `#9FB4A9`, `#3A3A3A`, `#52B4A8` are literal demo values not in the brand palette. These are placeholders for runtime product-color data; the molecule itself doesn't need to surface them as tokens. (OQ-PC-13.)

### 6.2 Spacing

| Role | Token | Value |
|---|---|---|
| Card root padding-x (Desktop Grid) | `spacing.5` | `1.25rem` (20 px) |
| Card root padding-y (Desktop Grid, Mobile Grid) | `spacing.4` | `1rem` (16 px) |
| Card root padding (Desktop List) | `spacing.4` | `1rem` |
| Card root padding (Mobile List) | `spacing.4` x / `spacing.3` y? Actually `py-4 px-3` | `1rem` / `0.75rem` |
| Mobile-Grid image wrapper padding-x | `spacing.2` | `0.5rem` (8 px) |
| Mobile-Grid meta wrapper padding-x | `spacing.3` | `0.75rem` (12 px) |
| Card body `gap` (Desktop Grid + Mobile Grid) | `spacing.4` | `1rem` (16 px) |
| Card content gap-between-major-blocks (Desktop List) | `spacing.6` | `1.5rem` (24 px) |
| Title block `gap` | `spacing.4` | `1rem` (16 px) |
| Brand-to-title `gap` | `spacing.0` (stacked, no gap, "Brand and product" frame uses default `items-start` no gap) | — |
| Meta `gap` (mobile list) | `spacing.1` | `0.25rem` (4 px) |
| Inner row gap inside list mobile (right-column items) | `spacing.3` | `0.75rem` (12 px) |
| Swatches inter-chip `gap` | `spacing.1.5` | `0.375rem` (6 px) |
| Reviews-summary inner `gap` (star to label) | `spacing.0.5` | `0.125rem` (2 px) |
| Price-row gap (Desktop Grid promo) | `spacing.4` | `1rem` (16 px) |
| Price-row gap (Mobile Grid promo + Mobile List promo) | `spacing.3` | `0.75rem` (12 px) |
| Price-row gap (Desktop List promo) | `spacing.1` | `0.25rem` (4 px) |
| Price-row gap (default no promo) | `spacing.0.5` | `0.125rem` (2 px) |
| Action-row gap (Add-to-cart to wishlist) | `spacing.2` | `0.5rem` (8 px) |
| Add-to-comparison gap (checkbox to label) | `spacing.1.5` | `0.375rem` (6 px) |
| Badge `px` | `spacing.1` | `0.25rem` (4 px) |
| Badge `py` (40 px tall variant) | `spacing.2.5` | `0.625rem` (10 px) |
| Badge `py` (32 px tall Mobile List `--new` only — OQ-PC-7) | `spacing.2` | `0.5rem` (8 px) |

### 6.3 Border radius

| Role | Token | Value |
|---|---|---|
| Card root corners | `borderRadius.xl` | `0.75rem` (12 px) — Figma `rounded-[12px]` exact match |
| Badge corners (hanging from top) | `borderRadius.lg` | `0.5rem` (8 px) |
| Primary button + wishlist button (pill / circle) | `borderRadius.full` | `9999px` |
| Swatch chip | `borderRadius.full` | `9999px` |
| Checkbox box | `borderRadius.base` (4 px) | `0.25rem` (4 px) |

### 6.4 Box shadow

| Role | Token | Value |
|---|---|---|
| Card default | (none) | — |
| Card `:hover` | `boxShadow.Shadow/lg` (recommendation; not specified in any visible Figma leaf — see OQ-PC-14) | `0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)` |
| Swatch selected inner halo | `boxShadow.Additional/Swatch inner` (already used by `swatches/A-swatches-rounded`) | `inset 0px 0px 0px 3px rgba(0, 0, 0, 0.24), inset 0px 0px 0px 2px #ffffff` |
| Wishlist + cart focus ring | `boxShadow.Focus/Primary` | `0px 0px 0px 4px #e1ebdd` |
| Checkbox focus ring | `boxShadow.Focus/Primary` | `0px 0px 0px 4px #e1ebdd` |

---

## §7 Typography

| Element | Figma family | Resolved family | Style (size / line-height) | Weight | Color |
|---|---|---|---|---|---|
| Brand label ("Druids") | DM Sans | DM Sans | `text-sm/leading-5/font-normal` (14 / 20) | 500 (Medium) | `deepEmeraldGreen.500` |
| Product title — Desktop | ITC Avant Garde Gothic Pro Bold | DM Sans | `text-lg/leading-7/font-bold` (18 / 28) | 700 | `slateBlue.800` |
| Product title — Mobile | ITC Avant Garde Gothic Pro Demi | DM Sans | `text-lg/leading-7/font-medium` (18 / 28) | 400 (the `text-lg/leading-7/font-medium` token in `tokens.resolved.json` maps to weight 400 — see OQ-PC-15 about the weight inconsistency between Figma "Demi=600" and the token weight=400) | `slateBlue.800` |
| Description (Desktop List only) | DM Sans Medium | DM Sans | `text-sm/leading-5/font-normal` (14 / 20) | 500 | `slateBlue.500` |
| Price current — default + Desktop List promo + Desktop Grid promo + Mobile Grid promo | DM Sans Medium | DM Sans | `text-2xl/leading-8/font-normal` (24 / 32) | 500 | `slateBlue.800` (default) / `red.600` (promo) |
| Price current — Mobile List promo | DM Sans Medium | DM Sans | `text-xl/leading-7/font-normal` (20 / 28) | 500 | `red.600` |
| Price old (Desktop Grid promo) | ITC AGGP Book size 18 | DM Sans | `text-lg/leading-7/font-light` (18 / 28) | 400 (token weight) | `slateBlue.800` + line-through |
| Price old (Desktop List + Mobile Grid + Mobile List promo) | ITC AGGP Book size 16 | DM Sans | `text-base/leading-6/font-light` (16 / 24) | 400 | `slateBlue.800` + line-through |
| Reviews score "4.1" | ITC AGGP Bold | DM Sans | `text-sm/leading-5/font-bold` (14 / 20) | 700 | `slateBlue.800` |
| Reviews counter "(12)" | DM Sans Medium | DM Sans | `text-sm/leading-5/font-normal` (14 / 20) | 500 | `slateBlue.500` |
| "Add to cart" button label | ITC AGGP Demi | DM Sans | `text-sm/leading-5/font-medium` (14 / 20) | 400 (token weight; Figma weight 600 — see same OQ-PC-15) | `base.white` |
| "Add to comparison" label | DM Sans Medium | DM Sans | `text-sm/leading-5/font-normal` (14 / 20) | 500 | `slateBlue.800` |
| Badge "New" label | DM Sans Medium | DM Sans | `text-sm/leading-5/font-normal` (14 / 20) | 500 | `deepEmeraldGreen.500` |
| Badge "New" label — Mobile List ONLY | DM Sans Medium | DM Sans | `text-xs/leading-4/font-normal` (12 / 16) | 500 | `deepEmeraldGreen.500` |
| Badge "-20%" label | DM Sans Medium | DM Sans | `text-sm/leading-5/font-normal` (14 / 20) | 500 | `base.white` |

**Figma applies `font-variation-settings: 'opsz' 14`** to many text elements (consistent with the pattern flagged for `status` and `review` atoms in questions.md #45 / #52). Same recommendation: apply it — harmless when the font has no `opsz` axis. (OQ-PC-16.)

---

## §8 States

The Figma frame `2256:7466` contains a `State` axis with values `Default` and `Hover`. **Only `Default` is populated for the 8 in-scope leaves.** Two `Hover` leaves exist but are **hidden in the source frame** (`2256:7442` Desktop List Hover/Clothes; `2256:7394` Desktop "Original Grid" Hover/Clothes). The hidden Hover leaves use the Product=Clothes content, NOT Product=Gear, which makes them unsuitable as canonical Hover references for the Gear leaves. (OQ-PC-5.)

Therefore the following state matrix is partly extrapolated from common e-commerce patterns and from the existing approved atoms. Each row is flagged as Figma-sourced or Spec-recommendation.

| State | Behaviour | Source |
|---|---|---|
| **Default** | All eight leaves as documented above. | Figma |
| **`:hover` on card** | Apply `boxShadow.Shadow/lg`. Optionally `transition: box-shadow 200ms`. **No** image zoom (Figma Hover leaves don't show one; they only restructure the buttons). | Spec recommendation, pending OQ-PC-14 |
| **`:hover` on primary button** | Per `buttons/A-basic` atom CSS (`--button-bg-hover` flows through). Darkens the deep-emerald to `deepEmeraldGreen.600`. | Atom |
| **`:hover` on wishlist button** | Per `buttons/A-basic` atom CSS (`btn-secondary` hover): subtle bg-tint with `burnishedGold.700` border darkening. | Atom |
| **`:hover` on swatch** | Per `swatches/A-swatches-rounded` atom CSS: outer ring transitions to `deepEmeraldGreen.300` border. | Atom |
| **`:focus-visible`** on cart / wishlist / swatch / checkbox | Each atom provides its own focus ring (Focus/Primary token). | Atom |
| **Card disabled (out-of-stock at product level)** | Hyvä kit replaces the `<form>` with a `<div>` (no add-to-cart submission). The molecule should: (a) drop the `Add to cart` button OR replace it with a "Notify me" CTA; (b) render `status status--out-of-stock` in the stock-status slot; (c) keep wishlist + compare available. This behaviour is not in Figma — see OQ-PC-2. | Hyvä kit + spec recommendation |
| **Promo layering** | The `-20%` and `New` badges are absolutely positioned above the image. `overflow-hidden` on the card root crops their hanging bottoms cleanly against the card's rounded corners. | Figma |
| **Loading** | Not specified in Figma. Hyvä kit's price-box uses `x-defer="intersect"` for lazy hydration but there's no skeleton state in the molecule itself. | Spec recommendation: no loading state in the molecule (parent listing component owns it). |

---

## §9 Accessibility

### 9.1 Link target — whole card vs explicit CTA
The Hyvä kit makes only the **product image** and the **product title** clickable links to the product page; the card wrapper itself is a `<form>` (or `<div>`), not a link. The Add-to-cart button submits the form to the add-to-cart URL. The Figma frame doesn't indicate any whole-card link wrapper.

**Spec decision:** follow the Hyvä kit exactly — title link (`product-card__title` wraps `<a>`) + image link (`product-card__image-frame` wraps `<a>`). No whole-card link. This is the standard pattern for forms with nested interactive controls (a whole-card link would trap the button presses).

### 9.2 Heading semantics
- Product title is a heading. Recommended level: `<h3>` (assuming the listing page uses `<h1>` for page title, `<h2>` for section titles like "Featured", and individual cards as `<h3>`). Hyvä kit doesn't wrap the title in a heading element by default — the `<a class="product-item-link">` is bare. **Spec decision:** wrap the title link in an `<h3>` for semantic correctness, override the kit. See OQ-PC-17.

### 9.3 Price strikethrough — screen-reader copy
The `<s>` / `<del>` element makes the strikethrough visible but does not convey "this was the original price". Recommended DOM:

```html
<span class="product-card__price-old">
  <span class="sr-only">Original price</span>
  <s aria-hidden="true">€95.99</s>
</span>
<span class="product-card__price-current">
  <span class="sr-only">Sale price</span>
  <span aria-hidden="true">€79.99</span>
</span>
```

For non-promo: a single `__price-current` with `<span class="sr-only">Price</span>` is sufficient.

### 9.4 Wishlist toggle
The wishlist button is a TOGGLE, not a one-shot action. ARIA:
```html
<button type="button" aria-pressed="false" aria-label="Add Flyknit Racer to wishlist"
        class="btn btn-secondary btn-icon-only-round btn-size-m">
  <svg aria-hidden="true">…heart…</svg>
</button>
```
When toggled on: `aria-pressed="true"`, accessible name flips to "Remove Flyknit Racer from wishlist". The Hyvä kit's `wishlist/button.phtml` partial wires this up via a child block — the molecule re-uses that block.

### 9.5 Promo badge text alternative
The badge text "-20%" should be announced as "20 percent off" rather than "minus twenty percent". The most reliable approach:
```html
<span class="product-card__badge product-card__badge--promo" aria-label="20 percent off">
  <span aria-hidden="true">-20%</span>
</span>
```

### 9.6 "New" badge
Visible label "New" is already descriptive. Add no extra `aria-label`. Optionally:
```html
<span class="product-card__badge product-card__badge--new">New</span>
```

### 9.7 Reviews summary
Per the existing `review/A-basic` atom: the row is wrapped in `<div role="img" aria-label="Rated 4.1 out of 5 stars based on 12 reviews">`, and the inner glyphs are `aria-hidden="true"`. The molecule inherits this from the atom.

### 9.8 Stock status
Render via the `status` atom: `<span class="status status--dot status--stock-status status--in-stock" role="status">In stock</span>`. The atom's `role="status"` provides the live-region semantics when the value changes.

### 9.9 Color-only meaning
- The promo state communicates "this is on sale" via THREE redundant cues: (a) red current-price color, (b) strikethrough old price, (c) "-20%" badge. ≥2 cues satisfy WCAG 1.4.1 (use of color).
- The selected swatch communicates "selected" via the outer emerald-300 ring + the inner white halo, both visual — but the swatch atom additionally exposes `aria-checked="true"`, so 1.4.1 is satisfied.
- The wishlist toggle: filled heart vs outline heart + `aria-pressed` toggle = compliant.

### 9.10 Keyboard navigation order
Within a single card the tab order should be: (1) title link, (2) image link IS the same destination as the title link, so it can be `tabindex="-1"` (Hyvä kit does this), (3) each swatch (radio-group keyboard semantics provided by `swatches/A-swatches-rounded`), (4) Add to cart, (5) wishlist toggle, (6) Add to comparison checkbox. Total tab stops per card = 1 (title) + N swatches + 3 (cart, wishlist, compare) = ~8 stops.

### 9.11 Touch target sizes (WCAG 2.5.8)
- Wishlist + cart icon-only round button: 40 × 40 px (`btn-size-m`) → passes 24 × 24 minimum, but recommended 44 × 44 (Apple HIG / WCAG 2.2 AAA). See OQ-PC-18.
- Mobile XS swatches: 16-px chip + 6-px gap on either side = ~28 px hit area per swatch. Fails 24 × 24 minimum unless the `.swatch` parent expands the hit area via padding. This is a known issue from questions.md #41 (OQ-SW-8); the swatch atom recommendation there applies here too — expand the click target via `padding` on the wrapping `<label>` without changing the visible chip size.

---

## §10 Open questions (numbered, dated 2026-05-13)

The questions are mirrored in `/Users/tomlievens/cursor/phpure-golf/design-tokens/questions.md` starting at entry #58, continuing the running log.

### OQ-PC-1 (#58) — Mobile-List promo price size downshift
The Mobile List promo variant renders the current price at `text-xl/leading-7/font-normal` (20 / 28) instead of `text-2xl/leading-8/font-normal` (24 / 32) used everywhere else. Is this intentional (because mobile-list has the price competing for horizontal space with the strikethrough old price), or a Figma slip? If intentional, the molecule needs a `.product-card__price-current--sm` modifier. If not, normalise to 24 / 32.

### OQ-PC-2 (#59) — Stock-status slot placement + token mapping
The Hyvä kit template renders a stock-status indicator between the price row and the action row, but NONE of the eight Figma leaves show a stock-status indicator. Need designer guidance: (a) is the indicator suppressed by design? (b) if not, where exactly should the `status` atom (`status status--dot status--stock-status status--in-stock|--out-of-stock`) sit in each of the four layouts? (c) should the molecule render `Notify me` CTA in the action row when out-of-stock, replacing the Add-to-cart button?

### OQ-PC-3 (#60) — Old strikethrough price size inconsistency
The old-price size differs between Desktop Grid (18 / 28 = `text-lg/leading-7/font-light`) and Desktop List + Mobile Grid + Mobile List (16 / 24 = `text-base/leading-6/font-light`). Both are weight 300 ITC AGGP Book → resolved to DM Sans weight 400. Confirm: (a) is the 18-px Desktop Grid size intentional or should it be 16 px everywhere? (b) inter-price gap also varies (Desktop Grid 16 px; Desktop List 4 px; Mobile Grid 12 px; Mobile List 12 px) — same question.

### OQ-PC-4 (#61) — Image rotated-aspect-ratio implementation
Figma uses a `-rotate-45` + nested `rotate-[24.47deg]` aspect-ratio keeper to crop a square image into a stylised 45°-tilt frame. The visible product photo (the bag) is rendered in its NORMAL orientation; the rotation only affects the cropping mask. This is a Figma-prototyping artefact that doesn't translate cleanly to CSS. Recommendation: render the image at native aspect-ratio with `object-cover` in a fixed-aspect frame, ignore the rotation. Confirm with designer.

### OQ-PC-5 (#62) — Hidden Hover + Clothes variants
Two Figma leaves are hidden in `2256:7466`: `2256:7442` (Desktop List Hover/Clothes) and `2256:7394` (Desktop "Original Grid" Hover/Clothes). Both use Product=Clothes, not Product=Gear. The Hover state for the LIVE eight leaves is therefore unspecified, and the molecule needs canonical Hover references. Need: either (a) un-hide the Hover variants, or (b) confirm "Hover should match the design-system default Card hover = Shadow/lg + 200 ms transition, no image zoom".

### OQ-PC-6 (#63) — Mobile-Grid comparison label wrap
On Mobile Grid the "Add to comparison" label is shown wrapped on two lines ("Add to" / "comparison"). Need: confirm whether to allow natural wrapping (Spec recommendation: `whitespace-normal`) or force single-line with shorter copy like "Compare".

### OQ-PC-7 (#64) — Mobile-List "New" badge smaller-typography sub-variant
On Mobile List the "New" badge uses 12 / 16 typography and 32 px height (vs 14 / 20 + 40 px height everywhere else). Two ways to handle this: (a) parameterise via a `.product-card__badge--sm` modifier and apply only on Mobile List, or (b) just use breakpoint utilities to switch typography at `lg:`. Pick one for consistency with the design-system patterns established in the existing atoms.

### OQ-PC-8 (#65) — Mobile primary button shape
On Mobile (Grid + List) the Add-to-cart button has no text label, just the cart icon. Two interpretations: (a) the button is still a wide PILL (`rounded-full`, fills available width via `flex-1`, icon centred) — this is what Figma renders; OR (b) the button should be a circle icon (`btn-icon-only-round`, `size-10`). The Figma DOM matches (a) (pill shape, full width). Confirm — (a) is what the existing `btn-icon-only-round` utility produces when applied to a `flex-1` parent? Probably need a new `btn-icon-only-pill` modifier or just keep `btn-icon-leading` and let the label be empty/hidden.

### OQ-PC-9 (#66) — Swatch overflow policy
The card shows 4 swatches (Grid) or 5 swatches (List) and no "+N more" overflow indicator. For a real product that has 8 colors, the molecule needs a policy: (a) wrap to N lines, (b) horizontally scroll, (c) cap to first N + show "+M more" chip linking to PDP. The Hyvä kit doesn't handle this either. Need designer answer.

### OQ-PC-10 (#67) — Reviews-summary mono-single-star variant
The Figma reviews summary in this card is the COMPACT mono-single-star variant (1 star + "4.1" + "(12)"), NOT the full 5-star track that the `review/A-basic` atom currently ships as default. Need: either (a) confirm the atom should add a `--mono` modifier exposing the single-star presentation, or (b) confirm the card embeds its own mini-reviews-summary using inline classes. Spec recommendation: (a) — extend the `review` atom with `review-summary--mono`.

### OQ-PC-11 (#68) — Description multi-line clamp strategy (Desktop List only)
Desktop List shows a 2-line product description with `h-12 overflow-hidden text-ellipsis`. Standard CSS for 2-line clamp is `-webkit-line-clamp: 2` etc. Confirm the molecule should use `line-clamp-2` Tailwind utility (renders the trailing `…`) vs fixed `h-12` + plain overflow:hidden (no ellipsis, just hard cut).

### OQ-PC-12 (#69) — Compare-button slot
The Hyvä kit's `item.phtml` template includes a "compare" icon button next to wishlist in the action row. The Figma design does NOT render a compare button in any leaf. Two options: (a) molecule drops the compare slot entirely; (b) molecule keeps the kit's compare slot wired-up but hidden by default (rendered only when a layout-XML arg enables it). Spec recommendation: (b) — preserve kit compatibility, hide by default.

### OQ-PC-13 (#70) — Demo-color swatch handling
Three swatch colors used in the Figma demo (`#9FB4A9` sage, `#3A3A3A` charcoal, `#52B4A8` lighter teal for the out-of-stock chip) are not in the brand palette. They're stand-in demo data. Confirm: do these need to be added as tokens (probably no — runtime product data drives swatch colors via inline `--swatch-bg` per the atom), or just documented as demo artifacts?

### OQ-PC-14 (#71) — Card hover shadow choice
No Figma leaf shows the card with a hover shadow (the Hover variants are hidden, see OQ-PC-5). The Hyvä kit uses `hover:shadow-lg`. Recommendation: apply `boxShadow.Shadow/lg` on `:hover` with `transition: box-shadow 200ms ease-out`. Confirm.

### OQ-PC-15 (#72) — DM Sans weight remap for ITC Demi (600) and Bold (700)
The Mobile product title in Figma is ITC AGGP **Demi = weight 600**, but the `tokens.resolved.json` typography entry for `text-lg/leading-7/font-medium` is weight 400. Same for the "Add to cart" button label (Figma Demi 600 → token weight 400). DM Sans ships weights 300 / 400 / 500 / 600 / 700 in self-hosted /src/fonts/dm-sans/. **Recommendation:** correct the token to weight 600 for these styles, OR leave the token at 400 and accept the small visual difference (the DM Sans 400 vs 600 is noticeable — 600 reads bolder). This same question applies to other components and should be answered globally.

### OQ-PC-16 (#73) — `font-variation-settings: 'opsz' 14`
Same recurring question as in questions.md #45, #52 (status, review atoms). Confirm whether to apply it on the card's text elements. Recommendation: apply — harmless if absent.

### OQ-PC-17 (#74) — Heading level for product title
The Hyvä kit doesn't wrap the title in a heading element. For a category page with many cards, each card title should be an `<h3>` (assuming `<h1>` = page name, `<h2>` = section). Confirm — this overrides the kit pattern but matches a11y guidance.

### OQ-PC-18 (#75) — Touch-target size for icon-only buttons on Mobile
`btn-size-m` gives a 40 × 40 px icon-only round button. WCAG 2.2 AAA recommends 44 × 44. Recommendation: leave at 40 × 40 (matches Figma exactly + passes AA), document in `accessibility-review.md`.

---

**End of spec.** Pair this file with `figma-screenshots/*.png` for visual reference. The component-author agent now has enough to produce both the CSS atoms+molecule and the static `preview.html` mirror.

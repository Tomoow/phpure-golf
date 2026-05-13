# Reviews summary — A-basic (spec)

| Field | Value |
|---|---|
| Figma node ID | `1385:28923` ("Reviews summary" frame) |
| Figma URL | https://figma.com/design/YlKyhwcdYEa41gK1BSs4AZ/?node-id=1385-28923 |
| Extraction date | 2026-05-13 |
| Extractor | `figma-extractor` subagent |
| MCP source | `figma-desktop` (local Dev Mode MCP) |
| Component category | **Atom** (no review-card body / author / date — this is a compact star-rating *row*) |
| Closest Hyvä UI 2.7.1 kit folder | None — see §1 |

---

## 1. Atom vs molecule call — and which kit folder is the starting point

**Call: atom.** The Figma node is a single horizontal row composed of up to three slots
(Leading, Stars, Trailing). It contains no review body text, no reviewer name, no
avatar, no date, no helpful-vote counter, no review-card chrome. It is a **rating
summary row** used as a compact star-display in product cards, in PDP headers,
in mini-cart rows, and in listing tiles — exactly the kind of inline element the
Magento layout calls "Reviews summary" (the same name as the `<view.summary>`
block on the product page).

**Closest kit folder: none of the two `product-reviews/*` folders apply.** Both
`hyva-ui-reference/components/product-reviews/A-basic/` and `.../B-minimal/`
ship the **full review list** for a PDP — a Magento_Review `list.phtml` that
iterates `$block->getReviewsCollection()`, renders each review as a card with
title, body, author + date, and a star row. The star-row chunk *inside* each
review card is the only architectural overlap with this Figma atom:

```php
// hyva-ui-reference/components/product-reviews/A-basic/.../list.phtml lines 85-100
<div class="flex flex-row" role="img" aria-label="...">
    <?php while ($i < $starsFilled): ?>
        <?= $lucideIcons->starHtml('text-amber-400', $size, $size, ["aria-hidden" => "true"]); ?>
    <?php endwhile; ?>
    <?php while ($i < $starsEmpty): ?>
        <?= $lucideIcons->starHtml('text-slate-200', $size, $size, ["aria-hidden" => "true"]); ?>
    <?php endwhile; ?>
</div>
```

That pattern (`role="img"` + `aria-label` on the flex row, two stacks of star
SVGs from `LucideIcons`) is what the author should mirror — but everything
*around* it (the leading title + counter pill, the trailing score / counter,
the empty-state placeholder, the half-star clipping) is brand-new.

**Output shape:** because this is an atom and Hyvä UI 2.7.1 ships atoms as CSS,
the deliverable is

```
components/review/A-basic/
├── src/web/tailwind/components/review.css
├── preview.html
└── README.md
```

No Magento_Review folder, no `.phtml`, no layout XML. The author may optionally
extend the PHTML inside `product-reviews/A-basic` later to *use* this atom via
its CSS classes, but that is a follow-up molecule, not part of this atom's
deliverable.

---

## 2. Inventory of the node

The frame `1385:28923` is 348 × 952 px and contains **24 leaf instances** of a
single component set `Base/_Reviews summary` (parent `1384:29081`). Every leaf
is one row, top-aligned, height 20 px (matching the star size). Cataloguing by
the three variant axes:

### Variant axes (3)

| Axis | Values |
|---|---|
| **Leading** | `None`, `Title`, `Title + Counter` |
| **Stars** | `True`, `False` |
| **Trailing** | `None`, `Score`, `Counter`, `Score + Counter` |

3 × 2 × 4 = **24 combinations** = the 24 leaves observed. No combinations
omitted, no Size axis, no State axis (the atom is read-only — see §7).

### The 24 leaves

| # | Node ID | Leading | Stars | Trailing | Width × H |
|---|---|---|---|---|---|
| 1 | `1385:29185` | None | True | None | 92 × 20 |
| 2 | `1385:29105` | None | True | Score | 126 × 20 |
| 3 | `1385:29145` | None | True | Counter | 185 × 20 |
| 4 | `1385:28922` | None | True | Score + Counter | 211 × 20 |
| 5 | `1385:30386` | Title | False | None | 55 × 20 |
| 6 | `1385:29065` | Title | True | None | 159 × 20 |
| 7 | `1385:29345` | Title | True | Score | 193 × 20 |
| 8 | `1385:29823` | Title | True | Counter | 252 × 20 |
| 9 | `1385:29385` | Title | True | Score + Counter | 278 × 20 |
| 10 | `1385:30586` | Title | False | Score | 89 × 20 |
| 11 | `1385:30626` | Title | False | Counter | 148 × 20 |
| 12 | `1385:30666` | Title | False | Score + Counter | 174 × 20 |
| 13 | `1385:29463` | Title + Counter | False | None | 79 × 20 |
| 14 | `1385:29225` | Title + Counter | True | None | 183 × 20 |
| 15 | `1385:29265` | Title + Counter | True | Score | 217 × 20 |
| 16 | `1385:30426` | Title + Counter | True | Counter | 276 × 20 |
| 17 | `1385:30231` | Title + Counter | True | Score + Counter | 302 × 20 |
| 18 | `1385:30706` | Title + Counter | False | Score | 113 × 20 |
| 19 | `1385:30746` | Title + Counter | False | Counter | 172 × 20 |
| 20 | `1385:30786` | Title + Counter | False | Score + Counter | 198 × 20 |
| 21 | `1385:30466` | None | False | Score | 22 × 20 |
| 22 | `1385:30506` | None | False | Counter | 81 × 20 |
| 23 | `1385:30546` | None | False | Score + Counter | 107 × 20 |
| 24 | `1385:30346` | None | False | None | 260 × 20 |

Leaf 24 is the **empty-state / placeholder** — when no axis selects anything
visible, Figma fills the slot with the literal string `[Empty Reviews summary
component]` in rose-500. That label is a Figma-author hint that the consumer
forgot to enable any slot, not a runtime-rendered string. See §6.

### What is NOT in the node

This atom is a **display-only summary**. It is NOT:

- **Not a review card.** No reviewer name, no body, no date, no avatar, no
  "Was this helpful?" — none of that. (Those live in
  `product-reviews/A-basic`/`B-minimal`, on the PDP, and are a separate
  follow-up molecule.)
- **Not an interactive rating widget.** No hover-fill-stars, no
  click-to-rate, no radiogroup ARIA. No `:hover` or `:focus` variant exists
  in the component set. See §7 OQ-RV-1 if the dev team needs an interactive
  version.
- **Not multi-size.** All 24 leaves render at the same fixed height (20 px
  stars, 14 px text). No Size = S / M / L axis. See §7 OQ-RV-2.
- **Not interactive itself.** The whole row is text-and-glyph content — it
  may sit inside an `<a>` that links to the reviews tab/section, but that
  wrapping is the consumer's responsibility, not the atom's.

---

## 3. Anatomy and auto-layout rules

Every leaf shares the same outer frame:

```
.review-summary  (= Figma "Base/_Reviews summary" frame)
└── content-stretch flex gap-[12px] items-start  ← 12 px between slot groups
    ├── (optional) .review-summary__leading
    │       content-stretch flex gap-[4px] items-start  ← 4 px between title and pill
    │       ├── <p>Reviews</p>                          (Title — see §4)
    │       └── (optional) .review-summary__leading-counter
    │              bg-deepEmeraldGreen-500  size-20  rounded-[10px]  flex justify-center items-center
    │              └── <p>9</p>                         (count label — see §4)
    ├── (optional) .review-summary__stars
    │       content-stretch flex items-start
    │       └── 5 × .review-summary__star
    │              size-20  position:relative  margin-right:-2px  (last has no margin)
    │              ├── <span.empty>   (full star, fill = slateBlue-200)
    │              └── <span.filled>  (full star, fill = champagneBeige-700, clipped to 0..100% of width)
    └── (optional) .review-summary__trailing
            content-stretch flex gap-[4px] items-start
            ├── (optional) <p class="...__score">4.1</p>
            └── (optional) <p class="...__count">(12 reviews)</p>
```

### Spacing facts (from Figma get_design_context across leaves)

| Element | Property | Value | Source |
|---|---|---|---|
| Outer row | flex direction | row | `1385:29186` (Base) |
| Outer row | gap between slot-groups (leading / stars / trailing) | **12 px** | `gap-[12px]` |
| Outer row | alignment | `items-start` | all leaves |
| Stars slot | flex direction | row | `1384:29100` |
| Stars slot | gap between adjacent stars | **−2 px** (overlap) | `mr-[-2px]` on stars 1–4, 0 on star 5 |
| Stars slot | per-star slot box | **20 × 20 px** | `size-[20px]` |
| Leading slot | gap (title ↔ counter pill) | **4 px** | `gap-[4px]` on `Leading items` |
| Trailing slot | gap (score ↔ counter) | **4 px** | `gap-[4px]` on `Trailing items` |
| Title + counter pill | pill shape | 20 × 20 px circle, `rounded-[10px]` | `1384:29084` |
| Title + counter pill | inner top-padding | 2 px (`pt-[2px]`) | nested flex container |
| Title + counter pill | label box | 16 × 14 px (`w-[16px] h-[14px]`) | `1384:29085` |

The −2 px star overlap is intentional: the star's bounding box (20 × 20 px) is
larger than its visible path (~14 × 13.4 px, see §5), so Figma overlaps the
slots by 2 px to bring the visible stars to a nicely tight cluster. The
effective visual gap between adjacent star centres ends up at 18 px, leaving
~4 px of negative space between star tips.

### Outer container height

Every leaf is **20 px tall** — the height of one star slot. The 14 px text
(line-height 20 px) and the 20 × 20 px counter pill both fit exactly in this
20 px row. No vertical padding, no border.

### No breakpoint variation

Figma shows one size only. The atom should render the same at mobile (375),
tablet (768), and desktop (1280+). If a Size = S variant is needed for
density-constrained layouts (e.g. mobile product cards), it has to be
designed first — see §7 OQ-RV-2.

---

## 4. Tokens used — every fill, stroke, and text color

All values are sourced from `get_variable_defs` on `1385:28923` cross-referenced
with `get_design_context` on representative leaves (§extract log). Every value
resolves cleanly to an existing token in
`design-tokens/tokens.resolved.json` — **no new tokens needed**, no fabricated
values.

### Colors

| Element | Figma variable | Hex | Token in `tokens.resolved.json` |
|---|---|---|---|
| **Filled star** fill | `Tailwind/Champagne Beige/700` | `#BFAB82` | `colors.champagneBeige.700` |
| **Empty star** fill | `Tailwind/Slate Blue/200` | `#BDCBD6` | `colors.slateBlue.200` |
| **Title** text ("Reviews") | `Tailwind/Slate Blue/800` | `#24323D` | `colors.slateBlue.800` |
| **Title-pill** background | `Tailwind/Deep Emerald Green/500` | `#004D40` | `colors.deepEmeraldGreen.500` |
| **Title-pill** label ("9") | `Tailwind/white` | `#FFFFFF` | `colors.base.white` |
| **Score** text ("4.1") | `Tailwind/Slate Blue/800` | `#24323D` | `colors.slateBlue.800` |
| **Counter** text ("(12 reviews)") | `Tailwind/Slate Blue/500` | `#5B7C99` | `colors.slateBlue.500` |
| **Empty-state placeholder** text | `Tailwind/rose/500` | `#F43F5E` | `colors.rose.500` (Figma authoring hint, see §6) |

### Typography (all map to existing typography tokens; family is DM Sans per `fontFamilyOverrides`)

| Element | Figma textStyle | Resolved token | Family | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|---|---|---|
| **Title** ("Reviews") | `text-sm/leading-5/font-medium` | `typography.text-sm/leading-5/font-medium` | DM Sans (was ITC Avant Garde Gothic Pro Demi) | 14 px | 20 px | **600** | 0% |
| **Title-pill** label ("9") | `text-xs/leading-4/font-medium` | `typography.text-xs/leading-4/font-medium` | DM Sans (was ITC Avant Garde Gothic Pro Demi) | 12 px | 16 px | **600** | 0% |
| **Score** ("4.1") | `text-sm/leading-5/font-bold` | `typography.text-sm/leading-5/font-bold` | DM Sans (was ITC Avant Garde Gothic Pro Bold) | 14 px | 20 px | **700** | 0% |
| **Counter** ("(12 reviews)") | `text-sm/leading-5/font-normal` | `typography.text-sm/leading-5/font-normal` | DM Sans | 14 px | 20 px | **500** | 0% |
| **Empty-state placeholder** | `text-sm/leading-5/font-medium` | `typography.text-sm/leading-5/font-medium` | DM Sans (was Demi 600) | 14 px | 20 px | 600 | 0% |

Notes:

- All title/pill/score weights pull from the `font-medium` and `font-bold`
  textStyle entries which carry the **Demi 600 / Bold 700** weight override
  the Button spec also encountered (see `questions.md` #8). This is consistent.
- The Counter text element is rendered in Figma with `style={{
  fontVariationSettings: "'opsz' 14" }}`. This is the same `opsz` axis
  question raised for the Status atom in `questions.md` #45. Same answer
  applies: apply the rule if the local DM Sans build ships the axis, otherwise
  no-op. See §7 OQ-RV-3.
- DM Sans family follows the `fontFamily.sans` token in
  `tokens.resolved.json`.

### Radii

| Element | Value | Token / source |
|---|---|---|
| Title-pill | `rounded-[10px]` (= half of 20 px → fully circular) | **Not a named token in `borderRadius`**. The Tailwind default radii closest are `lg = 8px` and `xl = 12px`; `full = 9999px` would also yield a perfect circle since `size = 20 × 20`. **The author should use `rounded-full` (= 9999px)** which is visually identical and uses an existing token. See §7 OQ-RV-4. |
| Stars | 0 (the SVG itself has soft tips but no border-radius on the slot) | n/a |

### Borders, shadows, strokes

None. No element in the 24 leaves has a border, an outline, a shadow, a focus
ring, or any effect. The atom is pure type + glyph.

### No new tokens required

Every color and every typography style maps to an existing entry in
`design-tokens/tokens.resolved.json`. The only token-shape concern is the
title-pill radius (`10px`) which has no exact named token — switching to
`rounded-full` (`9999px`) gives the same circle visually for a `20 × 20` box.
Documented as §7 OQ-RV-4 for designer confirmation.

---

## 5. Star glyph specifics

### Glyph shape

Figma uses a **custom 5-point star path** (not Heroicons, not Lucide).
Recovered SVG path data is identical for both filled and empty layers — only
the fill colour differs. Path:

```svg
<svg viewBox="0 0 14 13.3715" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.45387 0.396789C6.62577 -0.132262 7.37423 -0.132263 7.54613 0.396788L8.80494 4.271C8.88182 4.5076 9.1023 4.66779 9.35107 4.66779H13.4247C13.9809 4.66779 14.2122 5.37962 13.7622 5.70659L10.4666 8.10099C10.2653 8.24722 10.1811 8.50641 10.258 8.74301L11.5168 12.6172C11.6887 13.1463 11.0832 13.5862 10.6331 13.2592L7.33753 10.8648C7.13627 10.7186 6.86373 10.7186 6.66247 10.8648L3.36687 13.2592C2.91683 13.5862 2.31131 13.1463 2.48321 12.6172L3.74202 8.74301C3.81889 8.50641 3.73468 8.24722 3.53341 8.10099L0.23781 5.7066C-0.212228 5.37962 0.0190606 4.66779 0.575338 4.66779H4.64893C4.8977 4.66779 5.11818 4.5076 5.19506 4.271L6.45387 0.396789Z"
        fill="currentColor"/>
</svg>
```

Saved verbatim to `figma-screenshots/star-empty-slateBlue200.svg` and
`figma-screenshots/star-filled-champagneBeige700.svg`.

The viewBox is **slightly wider than tall** (14 × 13.3715) — this is a normal
5-point-star aspect ratio (a regular pentagram's outer-vertex bounding box is
~1:0.951 wide-to-tall when the bottom pair of vertices sits flush with the
baseline). Author must keep this aspect ratio; do NOT force `viewBox="0 0 14
14"` or the path will distort.

### Glyph rendering inside the 20-px slot

Each star slot is **20 × 20 px**. The Figma path is placed inside that slot
with insets `[15%_15%_18.14%_15%]` — meaning:

- top: 15% of 20 = 3 px from the top
- right: 15% of 20 = 3 px from the right
- bottom: 18.14% of 20 ≈ 3.628 px from the bottom
- left: 15% of 20 = 3 px from the left

Net rendered visible area: 14 × 13.372 px, top-aligned (the extra 0.6 px of
bottom padding accommodates the aspect-ratio difference). The visible glyph
floats in a 20 × 20 box with ~3 px of empty space on each side — that's what
gives the 5-star row its visual density.

### Fractional fill mechanism (half-stars / quarter-stars / arbitrary %)

Figma implements partial fills by **layering two stars and clipping the top
layer to a fraction of the width from the left**:

```html
<div class="review-summary__star">                  <!-- 20 × 20 slot, position:relative -->
  <div class="review-summary__star-bg" style="inset: 15% 15% 18.14% 15%">
    <!-- empty star path, fill = slate-blue-200 -->
  </div>
  <div class="review-summary__star-fg-clip"
       style="inset: 0 var(--unfilled-pct, 100%) 0 0; overflow: hidden">
    <div class="review-summary__star-fg" style="inset: 15% 15% 18.14% 15%">
      <!-- filled star path, fill = champagne-beige-700 -->
    </div>
  </div>
</div>
```

In Figma the demo state shows the 4th and 5th stars with `inset-[0_95%_0_0]`
on the clipping container — that is **95% right-inset = only the leftmost 5%
of the filled layer is visible**. So the rendered demo isn't 4.1 stars; it's
~3 + 5% + 5% ≈ 3.1 stars. The **trailing score `4.1`** in those variants is
**not synchronised** to the visual stars — they are independent text content
and are placeholder dummy data in the design.

For runtime, the author should expose a single CSS custom property
`--review-summary-fill: <fraction 0..1>` per star (or per row) and compute the
clip-right inset as `calc((1 - var(--review-summary-fill)) * 100%)`. That
supports any continuous fill (half-star = `0.5`, quarter-star = `0.25`).

### Star color tokens

| Layer | Token | Hex |
|---|---|---|
| Empty / track | `colors.slateBlue.200` | `#BDCBD6` |
| Filled / value | `colors.champagneBeige.700` | `#BFAB82` |

Note that the Hyvä kit's `product-reviews/A-basic` uses
`text-amber-400` + `text-slate-200` for filled/empty (per `list.phtml`). The
PHPure Golf brand replaces amber-400 with **champagne-beige-700** — a warmer,
more golden-yellow tone matching the rest of the brand ramp. The author must
NOT inherit the kit's amber.

### Star icon set divergence (open question)

CLAUDE.md states "Icons: Heroicons." but Figma supplied a custom 5-point path
(see §6 OQ-RV-5). The two options are:

1. **Inline the Figma path** (preferred — perfect parity with design, ~600
   bytes of SVG per row).
2. **Substitute Heroicons solid `star`** — visible curve mismatch; the brand
   star is slightly more pointed and slightly squatter than Heroicons.

Spec recommends option 1.

---

## 6. Empty-state / placeholder behaviour

Leaf 24 (`1385:30346`) is `Leading=None, Stars=False, Trailing=None` — i.e.
**every slot is empty**. Figma fills this state with the literal string
`[Empty Reviews summary component]` rendered at `text-sm/leading-5/font-medium`,
colour `rose.500` (`#F43F5E`).

**Important interpretation:** this is a **Figma-authoring guard rail**, not a
runtime UI element. It exists to flag a misconfigured component (the consumer
forgot to pass *any* visible content). At runtime, the atom should:

- Render **nothing** (an empty `<div>` with `display: none`) if no rating
  data, no title, no count, and no score are supplied.
- OR render a **graceful degraded state** — e.g. just `(0 reviews)` in
  `colors.slateBlue.500` — which is the standard e-commerce pattern when a
  product has no reviews yet.

This deserves a designer call — see §7 OQ-RV-6. **Do not literally render
`[Empty Reviews summary component]` in production.**

---

## 7. Open questions (added to `design-tokens/questions.md`)

These are spec-side ambiguities that block the author. Each entry is mirrored
in `questions.md` as #50–#56 with full context.

| ID | Cross-ref | One-line summary |
|---|---|---|
| OQ-RV-1 | `questions.md` #50 | Read-only display vs interactive rating-input — does this atom need a clickable / keyboard-arrow-nav variant for "Write a review" forms, or is rating-input a separate atom? |
| OQ-RV-2 | `questions.md` #51 | Single 20-px size only — no S/L variants. Does the product-card need a 16-px-star version? Does the PDP heading need a 24-px-star version? |
| OQ-RV-3 | `questions.md` #52 | `fontVariationSettings: 'opsz' 14` on the counter text — same `opsz` axis question as the status atom (#45). |
| OQ-RV-4 | `questions.md` #53 | Title-pill radius is `10px` (= half of 20-px size, i.e. a circle). Use `rounded-full` (`9999px`) which gives the same visual but uses an existing token. |
| OQ-RV-5 | `questions.md` #54 | Star glyph is a custom path, not Heroicons / Lucide. CLAUDE.md says Heroicons — confirm using the Figma path. |
| OQ-RV-6 | `questions.md` #55 | Empty-state placeholder leaf renders `[Empty Reviews summary component]` in rose-500. Confirm this is a Figma-authoring hint (render nothing at runtime) OR designer wants a real "no reviews yet" string with token-driven styling. |
| OQ-RV-7 | `questions.md` #56 | Score-vs-stars de-synchronisation: in Figma demo states the trailing score (`4.1`) is not aligned with the visual star fill (~3.1 stars). Confirm the runtime contract: stars and score must both render from the same numeric value, OR they may be independent (e.g. score = "average of all reviews", stars = "rounded-to-half average"). |
| OQ-RV-8 | `questions.md` #57 | Star fill at `champagneBeige.700` (#BFAB82) on `colors.base.white`: contrast 1.94:1 — fails WCAG 2.2 SC 1.4.11 (≥3:1 required for UI components). Same family of WCAG bumps as form-field A11Y-007 and questions.md #30, #49. |

---

## 8. Implementation notes for `hyva-component-author`

When the author picks this up:

1. **Folder shape:** atom — `components/review/A-basic/src/web/tailwind/components/review.css` +
   `preview.html` + `README.md`. NO Magento_Review templates folder.
2. **Class root:** `review-summary` (BEM). Modifiers on the root:
   `review-summary--with-title`, `review-summary--with-title-counter`,
   `review-summary--with-stars`, `review-summary--with-score`,
   `review-summary--with-count`. (Or, simpler: compose by including/omitting
   the slot `<div>`s — no root-level modifiers needed because every slot is
   already optional in the DOM.)
3. **Star runtime API:** expose `--review-summary-fill: <0..1>` per star
   (or accept a 0..5 numeric rating on the root and use 5 inline `style="--review-summary-fill: ..."` declarations).
4. **A11y contract:**
   - Wrap the `__stars` block in `<div role="img" aria-label="X out of 5
     stars">` (mirror the kit's pattern, `list.phtml` line 86).
   - Counter pill: include an SR-only label so screen readers say "9 reviews"
     not just "9". E.g. `<span class="sr-only">reviews</span>` after the
     numeral.
   - `__count` text already includes the word "reviews" — no extra SR work.
   - Each individual `<span.review-summary__star>` is decorative (`aria-hidden`)
     because the parent's `aria-label` carries the information.
5. **No Alpine.** This is pure CSS + HTML. No `x-data`, no `x-on`.
6. **CSP:** zero inline event handlers, zero inline `<script>`. The custom
   property `--review-summary-fill` may be set inline via `style="..."` since
   that is style, not script (CSP `style-src` should already allow it; if a
   strict `style-src` policy is in place, document a fallback CSS-class scale
   `.fill-0`, `.fill-25`, `.fill-50`, `.fill-75`, `.fill-100`).

---

## 9. Audit trail (MCP queries performed during this extraction)

| Tool | nodeId | Purpose |
|---|---|---|
| `get_metadata` | `1385:28923` | Enumerated 24 leaves and axis values |
| `get_screenshot` | `1385:28923` | Visual reference (canvas) |
| `get_screenshot` | `1385:29185` | Stars only |
| `get_screenshot` | `1385:28922` | Stars + Score + Counter |
| `get_screenshot` | `1385:30231` | Title + Counter + Stars + Score + Counter (widest) |
| `get_screenshot` | `1385:30346` | Empty-state placeholder |
| `get_screenshot` | `1385:29463` | Title + Counter only (no stars) |
| `get_screenshot` | `1385:30466` | Score only (no stars, no leading) |
| `get_screenshot` | `1385:30546` | Score + Counter only (no stars, no leading) |
| `get_screenshot` | `1385:30786` | Title + Counter + Score + Counter (no stars) |
| `get_screenshot` | `1385:29065` | Title + Stars |
| `get_screenshot` | `1385:29225` | Title + Counter + Stars |
| `get_design_context` | `1385:29185` | Stars-only DOM + tokens |
| `get_design_context` | `1385:29105` | Stars + Score DOM + tokens |
| `get_design_context` | `1385:29145` | Stars + Counter DOM + tokens |
| `get_design_context` | `1385:28922` | Stars + Score + Counter DOM + tokens |
| `get_design_context` | `1385:29065` | Title + Stars DOM + tokens |
| `get_design_context` | `1385:29225` | Title + Counter + Stars DOM + tokens (pill geometry) |
| `get_design_context` | `1385:30231` | Title + Counter + Stars + Score + Counter (full) |
| `get_design_context` | `1385:30346` | Empty-state DOM + tokens |
| `get_design_context` | `1385:29463` | Title + Counter (no stars) — confirms pill geometry stable |
| `get_design_context` | `1385:30466` | Score only — confirms text-only trailing variant |
| `get_variable_defs` | `1385:28923` | Full token inventory for the frame |
| `curl` | localhost:3845 asset SVGs | Star path saved to `figma-screenshots/` |

All hex values, dimensions, and typography facts in this spec are traceable
to one of these calls.

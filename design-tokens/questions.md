# figma-extractor questions log

Each entry is numbered, dated, and records an ambiguity that blocked full token resolution. Answers from the design lead belong inline under each entry.

---

## 1. 2026-04-23 — Color hex values are unresolved: Figma Desktop MCP cannot reach the PHPure Golf design pages — **RESOLVED 2026-04-23 by designer**

> **Resolution (2026-04-23):** Designer provided all 227 color hex values directly in chat. Merged into `tokens.resolved.json` via `scripts/merge-user-colors.mjs`. Source flagged as `designer-provided (chat, 2026-04-23)` in `colors._meta`. One anomaly flagged below — see note on Transparent.
>
> **Notes introduced by the resolved data:**
> - Figma's `Tailwind/Transparent` style is `#FFFFFF` (a solid white). Remapped to the CSS `transparent` keyword so `bg-transparent` works correctly; raw Figma value preserved in `base._meta.transparentFigmaValue`.
> - `champagneBeige.50` is pure `#FFFFFF` — intentional per the ramp design.
> - `deepEmeraldGreen.50` is `#6AEDD7` (bright cyan/teal), which is atypical for a "50" shade on a dark-green ramp. Confirm this is intended (the ramp then transitions to `#004D40` at 500 and `#000F0D` at 900).
> - No value was provided for weight-600 (Demi) text styles even though the Button Figma node returned a Demi-600 style via MCP earlier in the session. Possibly a variant of the Button only. Flag if this becomes relevant in Phase 1.

**Original issue below preserved for audit.**



- **Item:** Hex values for all 227 color tokens in `figma-export.json` (brand ramps Slate Blue, Burnished Gold, Champagne Beige, Deep Emerald Green; the 18 default Tailwind palette ramps; `Tailwind/white`, `Tailwind/black`, `Tailwind/Transparent`; 3 gradients; `Additional/Swatch stroke`).
- **Queried (all failed with `No node could be found for the provided nodeId`):**
  - `5838:2501` (Homepage A)
  - `5838:2502` (Homepage B)
  - `6809:37242` (Mega menu)
  - `6809:37241` (Mobile nav)
  - `5846:4579` (Category — clubs)
  - `5851:13797` (PDP — clubs)
  - `6727:20299` (PDP — apparel)
  - `6237:10113` (Brand page)
  - `6911:27840` (About page)
  - `6931:29686` (Contact page)
  - `10248:37768` (Blog listing + detail)
  - `1286:12715` (Button)
  - `5838-2501` and `1286-12715` retried in hyphen form — same error.
- **Got:** `get_variable_defs` on node `0:1` (file root) returned `{}`. `get_metadata` on `0:1` returned a single page called "Thumbnail" containing only a frame, a vector, and a "Design system" text node. This means a different, smaller file — or a different tab of the same file — is currently active in Figma Desktop, and none of the PHPure Golf design pages are reachable.
- **Expected:** For each queried node, a map of Figma variable names → resolved values (e.g. `{'Tailwind/Slate Blue/500': '#5b7c99', ...}`) so that every entry in `figma-export.json/styles/colors` can be bound to a hex.
- **Need from human:**
  1. Open the PHPure Golf file (key `YlKyhwcdYEa41gK1BSs4AZ`) in Figma Desktop Dev Mode and make it the active tab, then re-run this agent.
  2. Alternatively, provide a Figma REST-API token so values can be pulled without the Desktop MCP.
  3. Until then, **no hex values have been recorded** for any of the 227 color tokens. `tokens.resolved.json` contains only the token names (value = `null`) under the `colors` object. The only confirmed color hexes are the 4 focus-ring colors below, which are embedded in the effect-style `value` strings already present in `figma-export.json`:
     - `Focus/Primary` → `#e1ebdd`
     - `Focus/Error` → `#fecdd3`
     - `Focus/Warning` → `#fde68a`
     - `Focus/Success` → `#a7f3d0`

---

## 2. 2026-04-23 — Spacing tokens not defined as Figma variables — **PROVISIONALLY RESOLVED**

> **Provisional:** By analogy with the breakpoint decision (designer chose Tailwind defaults), spacing is also treated as Tailwind v4 defaults unless the designer says otherwise. Flag if this assumption is wrong.

- **Item:** Spacing scale (`0`, `px`, `0.5`, `1` … `96`).
- **Queried:** `figma-export.json` — `collections` is empty. MCP unreachable (see #1).
- **Got:** No spacing variables in the export. `metadata.collectionsFound = 1` but `collectionsExported = 0`, suggesting the export plugin found a collection but did not serialize its contents.
- **Expected:** A dedicated spacing collection or a set of `space-*` / `size-*` / `gap-*` variables resolvable via `get_variable_defs`.
- **Need from human:** Confirm whether a spacing variable collection exists in the Figma file. If yes, re-run the export plugin with collection export enabled OR re-run this agent once the file is active in Figma Desktop. **Interim:** `tokens.resolved.json` contains the Tailwind v4 default spacing scale flagged with `"_meta": {"source": "tailwind-default"}`. Do not treat these as resolved.

---

## 3. 2026-04-23 — Border-radius tokens not defined as Figma variables — **PROVISIONALLY RESOLVED**

> **Provisional:** Same logic as #2 — Tailwind v4 defaults unless designer overrides.

- **Item:** Border-radius scale (`none`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`).
- **Queried:** `figma-export.json` — no `radius-*` or `border-radius/*` entries anywhere. MCP unreachable.
- **Got:** Nothing.
- **Expected:** A radius collection or per-variable definitions.
- **Need from human:** Confirm whether border-radius is a Figma variable collection. **Interim:** Tailwind v4 defaults recorded with `"_meta": {"source": "tailwind-default"}`.

---

## 4. 2026-04-23 — Breakpoints not defined as Figma variables — **RESOLVED 2026-04-23 by designer**

> **Resolution:** Designer picked Tailwind v4 defaults. No custom `xs = 376px`, no Bootstrap values. `tokens.resolved.json` keeps:
>
> | Name | Value |
> |------|-------|
> | sm   | 640 px  |
> | md   | 768 px  |
> | lg   | 1024 px |
> | xl   | 1280 px |
> | 2xl  | 1536 px |
>
> `_meta.source` remains `tailwind-default` but no longer "pending".

---

## 5. 2026-04-23 — Gradient definitions unresolved — **RESOLVED 2026-04-23 by designer**

> **Resolution:** Designer confirmed all 3 gradients use base color `#1E293B` (= Tailwind default `slate-800`, NOT the brand `slateBlue-800` which is `#24323D`). Opacity ramps:
> - `Slate 800 [0→75]` → 0 % → 75 %
> - `Slate 800 [60→80]` → 60 % → 80 %
> - `Slate 800 [0→100]` → 0 % → 100 %
>
> Angle is Figma 0° = CSS `linear-gradient(0deg, …)` — bottom-to-top. Tailwind's default `slate` palette (10 shades) was also added to `tokens.resolved.json` under `colors.slate` because the gradients reference it.

**Original entry below.**

- **Item:** `Gradients/Slate 800 [0→75][∠0°]`, `Gradients/Slate 800 [60→80][∠0°]`, `Gradients/Slate 800 [0→100][∠0°]`.
- **Queried:** Figma MCP (same nodes as #1) — unreachable.
- **Got:** Names only; `type: gradient_linear`; no stop data.

---

## 6. 2026-04-23 — `Additional/Swatch stroke` color unresolved — **RESOLVED 2026-04-23 by designer (updated)**

> **Resolution (final):** Designer clarified: `#000000` at **24 % opacity** — i.e. `rgba(0, 0, 0, 0.24)`, matching the `Additional/Swatch inner` shadow's 0.24 stop. The earlier bare `#000000` value was superseded; `tokens.resolved.json` now stores `additional.swatchStroke = "rgba(0, 0, 0, 0.24)"`.

**Original entry below.**

- **Item:** Single solid color used as the outer stroke on color/fabric swatches. Paired with `Additional/Swatch inner` (effect) which IS resolved as `inset 0px 0px 0px 3px rgba(0, 0, 0, 0.24), inset 0px 0px 0px 2px #ffffff`.
- **Queried:** See #1.
- **Got:** Name only.
- **Expected:** A single hex.
- **Need from human:** ~~Provide the hex or re-enable MCP access.~~ Answered: `#000000`.

---

## 7. 2026-04-23 — Open question: is `deepEmeraldGreen.50` intentionally a bright cyan? — **RESOLVED 2026-04-23 by designer**

> **Resolution:** Confirmed — `#6AEDD7` is intentional. The ramp is designed to start at a bright cyan/teal accent and darken to `#000F0D` at 900. No change needed.

---

## 8. 2026-04-23 — Open question: no Demi (600) text styles in the export, but Button Figma returned one

- **Item:** `figma-export.json/textStyles` has 52 styles, all at weights 300/400/500/700. No 600. But when I queried the Button node `1286:12715` via Figma MCP at the start of this session, three Demi-600 styles appeared:
  - `text-sm/leading-5/font-medium` → Demi 600
  - `text-base/leading-6/font-medium` → Demi 600
  - `text-lg/leading-7/font-medium` → Demi 600
- **Why flag:** Name says `font-medium` (which is 500 in Tailwind) but weight is 600. One of these is wrong — either the style name is misleading, or the weight override on the Button is a one-off.
- **Need from designer:** Is the Button supposed to render at 600, while other `font-medium` text is 500? Or should all `font-medium` be unified?
- **2026-04-24 update:** Reconfirmed while extracting the Button spec — ALL 5 sizes (S/M/L/XL/2XL) of the Button use Demi-600 regardless of which `font-medium` size slot. Spec tells author to render at 600 for this component specifically. Other components' `font-medium` usage is still unresolved.

---

## 9. 2026-04-24 — Icon=Only vs Icon=Only (Round) — MCP returns identical code; Figma screenshot shows them as different shapes (Button spec extraction)

- **Item:** The Button component set (`1286:12715`) has two icon-only subvariants: `Icon=Only` and `Icon=Only (Round)`. Visually in the Figma rendered screenshot of the full set, `Icon=Only` is a square with rounded corners and `Icon=Only (Round)` is a fully circular pill. However, `get_design_context` returns **identical** CSS for both subvariants at every size:
  - `Icon=Only` (Size S, Primary, Default) — `1287:14560` — `p-[8px] rounded-[8px]` on inner, `rounded-[16px]` on outer wrapper.
  - `Icon=Only (Round)` (Size S, Primary, Default) — `1287:15660` — `p-[8px] rounded-[8px]` on inner, `rounded-[16px]` on outer wrapper.
  - Same at Size M (`1287:14568` vs `1287:15668`) and 2XL (`1287:14592` vs `1287:15692`).
- **Expected:** `Icon=Only (Round)` to report `rounded-[9999px]` (fully circular), distinct from `Icon=Only`.
- **Need from designer:** Confirm whether `Icon=Only (Round)` is genuinely a full circle (`border-radius: 9999px`) or whether both are the same `8px`-cornered square. If the former, also state whether this is a per-size radius (e.g. `Only (Round)` Size S = 18px half-height = circle, Size 2XL = 30px half-height = circle).
- **Interim handling:** `components/buttons/A-basic/spec.md` documents the MCP-reported `8px` value and flags the discrepancy. Author must pause on the `Only (Round)` variant until this is answered.

---

## 10. 2026-04-24 — Border-width inconsistency between Tertiary (1px) and Transparent (2px) button styles

- **Item:** While extracting the Button component set (`1286:12715`), two of the four styles use visible borders, but at different widths:
  - `Tertiary` (all states): **1px** solid `deepEmeraldGreen.500` Default/Hover/Focus/Active, `1px` solid `slateBlue.200` Disabled.
  - `Transparent` Hover: **2px** solid `blue.100`. Transparent Active: **2px** solid `blue.500`.
  - Transparent Default / Focus / Disabled: no border.
- **Why flag:** Tertiary and Transparent both rely on borders to distinguish them from the background, but the widths differ. This may be intentional (Tertiary = subtle outline for a visually-quieter CTA; Transparent = more emphatic border on interaction because there's no bg fill), or it may be a Figma-side authoring drift.
- **Need from designer:** Confirm that Tertiary=1px and Transparent=2px is intentional. If yes, the author will implement both widths as-is. If no, pick one width (likely 1px to match Tertiary) and the Transparent border will be restyled to match.

---

## 11. 2026-04-24 — Transparent-Focus outer ring uses a different mechanism than other styles

- **Item:** For the Button component set `1286:12715`, the `State=Focus` visual differs structurally between `Transparent` and the other 3 styles:
  - `Primary / Secondary / Tertiary` Focus: the button itself gets `box-shadow: 0 0 0 4px #e1ebdd` (the `Focus/Primary` token). Outer wrapper is untouched.
  - `Transparent` Focus (node `1287:11780`): the button gets the same `Focus/Primary` shadow PLUS the OUTER wrapper gets a separate `border-4 border-[#bfdbfe] border-solid rounded-[6px]` (4px `blue.200` border at 6px radius).
- **Why flag:** This is an uncommon pattern (a focus state that modifies an ancestor element). The author needs to know whether to (a) render this as an outer wrapper `<div>` with its own border on Focus, (b) approximate using `outline: 4px solid blue-200; outline-offset: 2px` on the button itself, or (c) drop the outer ring and only apply the `Focus/Primary` shadow for consistency with the other styles.
- **Need from designer:** Confirm intention. Options with tradeoffs:
  1. **Keep the distinct outer ring** — matches Figma exactly, but requires a wrapper and complicates `<button>`/`<a>` usage.
  2. **Use `outline` on the button** — close visual match, no wrapper required, cleanest implementation.
  3. **Drop the outer ring** — visually diverges from Figma; not recommended.

---

## 12. 2026-04-24 — Icon library mapping from Figma icon names to Heroicons v2

- **Item:** During Button spec extraction, Figma returned icon references like `Icon/Solid/photograph` on the Leading/Trailing/Only variants. This naming pattern matches the legacy Heroicons v1 name (`photograph`) but Heroicons v2 renamed it to `photo`. `CLAUDE.md` states "Icons: Heroicons." — but not which version.
- **Why flag:** Before the author implements Icon=Leading/Trailing/Only variants of the button, the icon library version and a name-mapping strategy must be pinned down.
- **Need from dev/designer:**
  1. Heroicons v1 or v2?
  2. Solid, outline, mini, or micro sets in use?
  3. If v2: the author will map Figma names to v2 equivalents (`photograph` → `photo`, `login` → `arrow-right-on-rectangle`, `logout` → `arrow-left-on-rectangle`, etc.) — confirm this rename-mapping is OK.
  4. Icon source: `@heroicons/react`, self-hosted SVG sprites, or inline SVG? (Hyvä convention is usually inline SVG or a sprite.)

---

## 13. 2026-04-24 — Form field: icon color in the base shell

- **Item:** In the base form-field Figma `1329:15248`, the leading and trailing icon fills resolve to `Tailwind/blue/400 = #60A5FA`. The variant screenshots at node `1331:14308` show icons rendered in slate/grey, not blue.
- **Queried:** `1329:15249` (base shell) via `get_variable_defs` and `get_design_context` on variant `1329:15248`.
- **Got:** `Tailwind/blue/400` assigned to the icon strokes on the base placeholder component.
- **Why flag:** The `blue.400` value is likely the "question-mark" placeholder icon color used inside Figma as a preview, not the production icon color. Production icons probably inherit `currentColor` from the input text (`slateBlue.500`) OR use a neutral slate variant.
- **Need from designer:** For leading/trailing icons in the base form-field, specify: (a) `currentColor` (inherits from `text-*`), or (b) a fixed token like `slateBlue.400` / `slateBlue.500`, or (c) keep `blue.400` as shown in Figma. This affects every icon-decorated variant (search, email, password toggle, etc.).
- **Cross-ref:** `components/form-field/A-basic/spec.md` §3.2 and OQ-1.

---

## 14. 2026-04-24 — Form field: hint-text color for warning & success feedback states

- **Item:** The hint-text color for the `error` feedback variant is clearly `rose.500` (Figma `1329:15315` returns `Tailwind/rose/500: #F43F5E`). For `warning` and `success` feedback variants, the hint-text color wasn't cleanly isolated from the rest of the variable set — the Warning variant (`1331:32305`) returned `amber.400 + amber.500`, and the Success variant (`1331:36651`) returned `emerald.400 + emerald.500`, but which one paints the hint text vs the trailing icon was ambiguous.
- **Queried:** `1331:29647` (Error), `1331:32305` (Warning), `1331:36651` (Success).
- **Got:** Error hint text = `rose.500` (unambiguous). Warning and Success hint text: inferred by symmetry to be the `.500` variant.
- **Why flag:** Before the author writes `.form-field--warning` and `.form-field--success` modifier CSS, we need the hint-text color pinned down.
- **Need from designer:** Confirm hint-text colors: warning = `amber.500`? success = `emerald.500`? (Or are they the `.400` tier to match the icon color?)
- **Cross-ref:** spec §3.3 and §4, OQ-2.

---

## 15. 2026-04-24 — Form field: leading icon is 24px, trailing icon is 20px

- **Item:** In the base form-field shell (`1329:15249`), the leading icon slot (`1329:15233`) is `size-[24px]` and the trailing icon slot (`1329:15238`) is `size-[20px]`. This asymmetry replicates across all variants in `1331:14308`.
- **Queried:** `get_design_context` on `1329:15248`.
- **Got:** Leading = 24 × 24 px, Trailing = 20 × 20 px.
- **Why flag:** Uncommon in design systems — usually leading and trailing icon slots share one size. May be intentional (leading = content icon, meant to be visually anchoring; trailing = action/status icon, smaller to feel tappable-but-secondary). Or may be a Figma authoring drift.
- **Need from designer:** Confirm per-slot icon size or unify to a single size.
- **Cross-ref:** spec §6.2, OQ-4.

---

## 16. 2026-04-24 — Form field: `readonly` state is not represented in Figma

- **Item:** HTML `<input readonly>` is visually distinct from `<input disabled>` (readonly inputs can receive focus and be selected/copied; disabled cannot). Figma's form-field variants don't cover `readonly` — only `Disabled`.
- **Queried:** `1329:15249`, enumerated all `State` values → `Placeholder / Hover / Focus / Active / Filled / Disabled`. No `Readonly`.
- **Why flag:** Author needs to know how to style readonly fields. Likely candidates: (a) reuse the Disabled styling (bg = `slateBlue.50`, border = `slateBlue.200`, text = `slateBlue.400`), minus the cursor change; (b) keep the default visual and rely only on the `readonly` attribute.
- **Need from designer:** Pick one. The spec currently assumes (a).
- **Cross-ref:** spec §4.5, OQ-5.

---

## 17. 2026-04-24 — Form field: `Leading text` exists but `Trailing text` doesn't

- **Item:** Figma has `Type = Leading text` for a prefix-text segment (e.g. `https://`) but no matching `Type = Trailing text` for a suffix-text segment (e.g. `EUR`, `kg`, `%`).
- **Queried:** enumerated `Type` values in `1331:14308` → `Default / Leading dropdown / Trailing dropdown / Leading text`.
- **Why flag:** Trailing-text suffix is a very common input pattern. Without a Figma reference, the author would have to mirror the leading-text styling onto the trailing side.
- **Need from designer:** Is a trailing-text suffix allowed? If yes, confirm that mirroring the leading-text styling (same bg `slateBlue.50`, same border, same padding but flipped L/R) is acceptable, OR provide a Figma node.
- **Cross-ref:** spec §6.4, OQ-6.

---

## 18. 2026-04-24 — Form field: dropdown variants — native `<select>` or custom Alpine menu?

- **Item:** The `Leading dropdown` and `Trailing dropdown` variants in `1331:14308` show an "XX" text + chevron-down icon in a dedicated segment. Figma doesn't show the opened dropdown menu or its contents, so it's ambiguous whether a styled native `<select>` is sufficient or whether a custom Alpine menu is required (to support, e.g., country flags + names, formatted currency rows, search-inside-menu).
- **Queried:** `1331:14379` (Leading dropdown), `1331:14601` (Trailing dropdown).
- **Why flag:** Implementation choice drives: accessibility (native `<select>` is perfect; custom requires combobox ARIA), bundle size (native = 0 JS; Alpine combobox = ~100 LOC), keyboard affordance (native = free; Alpine = must implement).
- **Need from designer / dev team:** Pick one:
  1. **Native `<select>`** — styled with chevron via background image or paired pseudo-icon. Simplest, a11y-complete.
  2. **Alpine combobox** — full custom rendering of each option. Required if options need flags, avatars, two-line layout, or inline search.
- **Cross-ref:** spec §6.5, §6.6, OQ-7.

---

## 19. 2026-04-24 — Form field: no stepper variant in `1331:14308`

- **Item:** A numeric stepper (`- [ 0 ] +` pattern, common for quantity pickers) is not present as a `Type` value in the form-field variants set. Only `Default / Leading dropdown / Trailing dropdown / Leading text` exist.
- **Queried:** enumerated `Type` values → no `Stepper`.
- **Why flag:** The spec author asked about steppers in Mode 2 instructions. Either (a) a stepper design lives in another Figma frame (maybe a PDP add-to-cart node), (b) it hasn't been designed yet, or (c) it's expected to be composed from the existing shell + buttons.
- **Need from designer:** Confirm: does a stepper component exist in Figma? If yes, provide the node ID. If no, confirm the composition pattern: `form-field > button.stepper--minus + input[type=number] + button.stepper--plus`, styled with the same tokens as the shell.
- **Cross-ref:** spec §6.9, OQ-8.

---

## 20. 2026-04-24 — Form field: datepicker / mask library decisions are dev-team-side

- **Item:** Datepicker (`<input type="date">` vs Flatpickr vs litepicker) and input masks (currency formatting, IBAN formatting, credit card spacing) are behavior layers that sit on top of the `form-field` shell. This spec covers styling; library choice is for the dev team.
- **Why flag:** Recording the dependency so the dev team knows to pick these and author knows NOT to ship styling specific to any one library.
- **Need from dev team:** Confirm which libraries will be used so the author can add library-specific trigger-button styling later if needed. Until then, the shell stays library-agnostic.
- **Cross-ref:** spec §6.10, §6.11, OQ-9.

---

## 21. 2026-04-24 — Form field: required-field indicator (asterisk on label vs native `required`)

- **Item:** Figma's form-field variants don't show a required-field indicator on the label. Standard practice options: (a) append a red asterisk to the label text, (b) rely on the HTML `required` attribute and browser-provided affordance, (c) both.
- **Queried:** all `Label=True` leaves in `1331:14308` — none show an asterisk.
- **Why flag:** Author needs to decide how to render `required` visually.
- **Need from designer:** Pick:
  1. **Red asterisk appended to label** — `<label>Name <span class="text-rose-500" aria-hidden="true">*</span></label>`. Visible, explicit.
  2. **Native `required` only** — browser-provided styling; may differ across browsers and be invisible to sighted users.
  3. **Both** — belt-and-braces.
- **Cross-ref:** spec §7, OQ-10.

---

## 22. 2026-04-24 — Dropdown list item: no `focus` (roving / keyboard-active) variant in Figma

- **Item:** The list-item component set at `1343:42177` enumerates `State = Default | Hover | Selected | Disabled` — no `Focus` / `Active-Descendant` / roving-focus state. Typical listbox patterns render keyboard-highlighted items with a distinct visual (outline, inset ring, or a brand-accent bg).
- **Queried:** `1343:42177` metadata — 24 leaves, 4 State values, no Focus.
- **Interim:** Spec assumes the roving-focus visual equals the Hover visual (`bg-blue.50`, same text colors) since they serve the same semantic purpose (not-yet-selected but indicated).
- **Need from designer:** Confirm reusing Hover as roving-focus is acceptable, OR provide a distinct focus treatment (e.g. 2px inset `blue.500` ring, or `Focus/Primary` outer ring).
- **Cross-ref:** `components/dropdown-list/A-basic/spec.md` §4.5, §4.7, DL-1.

---

## 23. 2026-04-24 — Dropdown list item: Selected state relies on color only (no trailing check icon)

- **Item:** Selected state (`1343:42427`, `1343:42429`, etc.) inverts the whole row: `bg-blue.500`, label `blue.50`, trailing text `blue.200`. No check-icon / tick glyph in the trailing slot to disambiguate selection.
- **Queried:** All 6 Selected leaves (`1343:42427`, `1343:42429`, `1343:42431`, `1343:42433`, `1343:42435`, `1343:42437`) — none include a trailing check.
- **Why flag:** WCAG 1.4.1 discourages color-alone as the sole indicator. `aria-selected="true"` handles screen readers, but low-vision sighted users benefit from a visual glyph (typical listbox pattern: Heroicons `check` in the trailing slot at `colors.blue.50`).
- **Need from designer:** Confirm color-only is intentional, OR approve a trailing Heroicons `check` at 20 × 20 px for the Selected state.
- **Cross-ref:** `components/dropdown-list/A-basic/spec.md` §4.6, DL-2.

---

## 24. 2026-04-24 — Dropdown list container: no `max-height` defined in Figma

- **Item:** The container at `1343:42718` uses `overflow-clip` but no explicit `max-height` on the panel. On Figma canvas every variant shows 10 items at 44 px height = 440 px tall, which happens to be the full content height — no scroll was forced. In production, dropdowns must cap height and scroll internally.
- **Queried:** `get_design_context` on `1343:42651` — no max-height reported.
- **Need from designer:** Pick the max-height policy:
  1. **Fixed `max-h-60` (15rem ≈ 5 items).**
  2. **Fixed `max-h-80` (20rem ≈ 7 items).**
  3. **Fluid viewport-based** — e.g. `max-h-[calc(100vh-8rem)]`, clips below the fold but never taller than the viewport.
  4. **Prop-driven** — expose `--dropdown-list-max-h` as a CSS custom property; consumers set per-instance.
- **Interim:** spec records `max-h-60` as the default.
- **Cross-ref:** `components/dropdown-list/A-basic/spec.md` §3.1, DL-3.

---

## 25. 2026-04-24 — Dropdown list: no inter-item separators / dividers

- **Item:** Figma container (`1343:42718`) stacks items with `gap: 0` and no border-top / bottom line between rows. Each Hover / Selected row's bg simply touches the next row's bg.
- **Queried:** `get_design_context` on `1343:42651` — no between-item borders.
- **Why flag:** Some dropdown patterns (Stripe, Shopify) use hairline dividers for visual scannability; others (Apple, Material) don't. Need confirmation for this brand.
- **Need from designer:** Confirm no dividers is intentional (current state), OR specify divider token (likely `1px slateBlue.200` between each item).
- **Cross-ref:** `components/dropdown-list/A-basic/spec.md` §3.5, DL-4.

---

## 26. 2026-04-24 — Dropdown list: first/last item's bg doesn't match container corner radius

- **Item:** Container has `rounded-[6px]` (`borderRadius.md`) but items have `rounded: 0` on their own bg fills (Hover / Selected). Visually in Figma this works because the container has `overflow-clip` — the item bg is masked by the container's rounded corners.
- **Queried:** `1343:42651` (container default) and hover/selected items inside.
- **Why flag:** The `overflow-clip` + rounded-container pattern relies on the stacking context being correct. When the consumer adds `transform` or `filter` effects to the container for animation, `overflow-clip` can break. Standard alternative: apply `rounded-t-[6px]` to the first item and `rounded-b-[6px]` to the last item (using `first:` / `last:` utilities).
- **Need from designer:** Confirm the `overflow-clip` approach is fine (matches Figma exactly), OR approve the `first:rounded-t-md last:rounded-b-md` fallback for resilience.
- **Interim:** spec uses `overflow-hidden` + rounded container to mirror Figma.
- **Cross-ref:** `components/dropdown-list/A-basic/spec.md` §3.3, DL-5.

---

## 27. 2026-04-24 — Dropdown list: no empty / loading state in Figma

- **Item:** No Figma design for:
  - **Empty state:** "No results found" / "No matches" — shown when a filtered combobox has zero matches.
  - **Loading state:** spinner / skeleton rows — shown when options are fetched async.
- **Queried:** metadata on `1343:42718` — only 6 Type variants (Default / Leading image / Leading icon × Trailing text on/off); no state-level variants.
- **Why flag:** A-basic ships with Alpine; eventually it'll back a country-selector and a product-search combobox — both of which need an empty-match state. Without a design, the author will either skip it or pick a default visual (centered `slateBlue.400` text at `text-sm/leading-5/font-normal`).
- **Need from designer:** Confirm whether A-basic needs empty / loading slots now, and if yes, provide a Figma reference.
- **Cross-ref:** `components/dropdown-list/A-basic/spec.md` §2 (DL-6), §11.

---

## 28. 2026-05-08 — Form checkbox: no Indeterminate state in Figma (OQ-CB-1)

- **Item:** The Checkbox component set (`1420:30806`) enumerates `State = Default | Hover | Focus | Disabled` and `Checked = True | False`. There is NO Indeterminate variant.
- **Queried:** `1420:30806` metadata — 72 leaves, no `Indeterminate` in any variant property.
- **Why flag:** Indeterminate is a standard ARIA tri-state pattern used by "select all" headers in tables and parent rows in nested checklist trees. It must be supported by the shell. Without a Figma reference the author has to choose colours and a glyph shape.
- **Need from designer:** Confirm:
  1. **Colours:** Same emerald-200 fill + white glyph as Checked? Or a different palette (e.g. emerald with reduced opacity, or a separate token)?
  2. **Glyph:** Horizontal bar (10 × 2 px in M)? Or Heroicons outline `minus`? Or some other shape?
  3. **Disabled-Indeterminate:** Mirror Disabled-Checked (white box + slate-blue-200 glyph)? Or a different treatment?
- **Interim:** Spec recommends emerald-200 fill, white horizontal bar (10 × 2 px in M, scaling proportionally), Disabled-Indeterminate matching Disabled-Checked.
- **Cross-ref:** `components/form-checkbox/A-basic/spec.md` §2, §3.3.

---

## 29. 2026-05-08 — Form checkbox: no Invalid / error state in Figma (OQ-CB-2)

- **Item:** The Checkbox component set has no `Invalid` / `Error` variant, only Default / Hover / Focus / Disabled. The shell still needs an invalid affordance for use cases like "you must accept the terms" or "select at least one".
- **Queried:** `1420:30806` metadata.
- **Why flag:** Without a Figma reference the author has to extrapolate. Form-field's invalid state uses `rose.500` border + `Focus/Error` ring + `rose.700` outline; the same pattern likely applies here, but the question is what happens to the FILL when an invalid checkbox is also checked: keep the brand emerald, or switch to a rose fill?
- **Need from designer:** Pick:
  1. **Brand fill stays.** Invalid-Checked = emerald fill + white glyph + rose-500 border (or no border, since the fill IS the surface) + rose hint text underneath. Most readable for users who DID make the correct choice but the form still rejects (e.g. validation race conditions).
  2. **Rose fill.** Invalid-Checked = rose-500 fill + white glyph. More immediate visual error.
- **Interim:** Spec recommends option 1 (brand fill stays; rose communicated via hint text + focus ring).
- **Cross-ref:** `components/form-checkbox/A-basic/spec.md` §2, §3.3 (last 3 rows).

---

## 30. 2026-05-08 — Form checkbox: default unchecked border fails WCAG 1.4.11 (OQ-CB-3)

- **Item:** Figma's default unchecked state (`1420:31133`) uses `Tailwind/Slate Blue/300 = #9DB0C2` for the box border. Contrast against `colors.white` is 2.23:1 — WCAG 2.2 AA UI components require ≥3:1 (1.4.11).
- **Queried:** `1420:31133`, `1420:31145`, `1420:31157` — all `slateBlue.300`.
- **Why flag:** Form-field already deviates from Figma here for the same reason — its unchecked-default border was bumped from `slateBlue.300` to `slateBlue.500` and an A11Y-007 entry was added to `accessibility-review.md`. The checkbox should match the field for consistency and to clear the audit.
- **Need from designer:** Approve the same WCAG bump: `slateBlue.300` → `slateBlue.500` for the default unchecked border. (The disabled border stays `slateBlue.100` because disabled UI is exempt from 1.4.11.)
- **Cross-ref:** `components/form-checkbox/A-basic/spec.md` §2, §3.3, §7. Update `accessibility-review.md` if approved.

---

## 31. 2026-05-08 — Form checkbox: Disabled-Checked is unfilled white with slate-blue-200 glyph (OQ-CB-4)

- **Item:** The Disabled-Checked variant (`1420:31175`) does NOT show a faded emerald fill — it's a white box with a `slateBlue.100` border and a `slateBlue.200` checkmark. Visually this reads as "unchecked but with a tick floating in it" rather than the typical "filled but greyed out" disabled-checked pattern.
- **Queried:** `1420:31175` `get_design_context` — confirmed `bg-white`, `border-[#dee5eb]`, glyph asset `58521c5b…` rendered in slate-blue-200.
- **Why flag:** The form-checkbox should communicate "this option WAS selected, now it's locked" — most users read a faded emerald fill as that. A white box reads as unchecked. This may be intentional (consistent with form-field's all-white disabled fields) or a Figma authoring choice that doesn't translate well to atoms.
- **Need from designer:** Pick:
  1. **Match Figma exactly.** White box + slate-blue-100 border + slate-blue-200 glyph.
  2. **Standard pattern.** Faded emerald fill (e.g. `deepEmeraldGreen.200` at 50% opacity, or `deepEmeraldGreen.100` if it exists) + white glyph.
- **Interim:** Spec mirrors Figma (option 1).
- **Cross-ref:** `components/form-checkbox/A-basic/spec.md` §2, §3.3 (Checked/Disabled row).

---

## 32. 2026-05-08 — Form checkbox: Disabled label colour stays slateBlue.700 in Figma (OQ-CB-5)

- **Item:** In `1420:31277` (M / Disabled / Unchecked / Label) and `1420:31283` (M / Disabled / Checked / Label), the label text is rendered at `slateBlue.700` — the same colour as the enabled label. There is no opacity drop, no colour shift.
- **Queried:** `1420:31277` `get_design_context`.
- **Why flag:** A disabled checkbox row should communicate "you can't change this" through the WHOLE row, not just the box. Form-group's disabled state drops the label to `slateBlue.400`. Keeping the label at 700 makes the row read as enabled at a glance.
- **Need from designer:** Pick:
  1. **Match Figma.** Label stays `slateBlue.700` when disabled.
  2. **Match form-group.** Disabled label drops to `slateBlue.400`. (Spec recommendation.)
- **Cross-ref:** `components/form-checkbox/A-basic/spec.md` §2.

---

## 33. 2026-05-08 — Form checkbox: glyph SVG identity + Size S glyph + Size S hint typography (OQ-CB-7, OQ-CB-9)

- **Item — part a (OQ-CB-7):** Figma ships the checkmark as two SVG assets — `fdae2b47…` for non-disabled checked variants and `58521c5b…` for the Disabled-Checked variant. Both render a tick at 10 × 10 px inside a 20 × 20 box (Size M). The S-size glyph dimensions weren't isolated in the probed nodes (only Size M variants returned the asset URLs).
- **Item — part b (OQ-CB-9):** No `Size = S` + `Text = Label + Hint text` variant was probed for hint typography. Spec extrapolates `text-xs/leading-4/font-normal` by analogy with the M (`text-sm/leading-5`) → L (`text-base/leading-6`) progression. Figma did return `text-xs` for the S+Label-only and S+None variants but the hint sizing was not directly observed at S.
- **Why flag:**
  1. The author needs to know whether to draw the glyph as inline SVG (recommended, since stroke colour can drive from `currentColor` and collapse the two Figma assets into one) or to use the Figma SVGs verbatim. Heroicons outline-24 `check` was confirmed as the project icon set in `CLAUDE.md`, so the author would prefer Heroicons here too. Confirm the Figma tick is shape-equivalent to Heroicons `check`.
  2. The S-size glyph proportions need to be confirmed: 10px glyph in 20px box (M) → 8px glyph in 16px box (S)? Or some other ratio?
  3. The S-size hint typography needs an explicit Figma source instead of an extrapolation.
- **Need from designer:**
  1. Confirm Heroicons outline-24 `check` is the canonical glyph for both checkbox and any other tick usage in the system. The author will inline it as SVG and drive colour from `currentColor`.
  2. Provide / confirm the S-size glyph dimensions (likely 8 × 8 px).
  3. Provide the Figma node for `Size = S, Text = Label + Hint text` so hint typography can be confirmed (Figma should have `1420:31045` and `1420:31051` covering this — agent did not probe them in this pass).
- **Cross-ref:** `components/form-checkbox/A-basic/spec.md` §2, §3.2, §3.4, §4.

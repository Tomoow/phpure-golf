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

---

## 34. 2026-05-08 — Swatch out-of-stock visual: diagonal slash vs Heroicons-X overlay (OQ-SW-1)

- **Item:** Figma's `Disabled` color/image swatch variants (`1385:33447`, `1385:33741`) overlay a `Heroicons solid X` icon inside a small white square at 50 % opacity over the swatch. The Disabled-Text variant (`1385:32599`) instead draws a diagonal strikethrough line (`-45°` rotation, slate-blue-400 stroke) across the pill. The Hyvä UI 2.7.1 kit (`hyva-ui/components/swatches/A-swatches-rounded/src/web/tailwind/components/swatches.css` lines 119-145) uses CSS `linear-gradient` to draw a single diagonal slash on color/image swatches when disabled.
- **Why flag:** The two approaches diverge — Figma uses an icon overlay (extra DOM node per swatch), the kit uses a CSS gradient (zero DOM, scales with size, recognised Hyvä convention).
- **Spec recommendation:** Use the kit's CSS-gradient diagonal-slash for color/image swatches and a strikethrough line for text swatches — no DOM cost, scales with size, matches Hyvä convention. Reject the Heroicons-X overlay.
- **Question for designer:** Confirm the spec recommendation, OR specify that the Heroicons-X overlay must be retained. Also confirm whether "Disabled" and "Out of stock" should look identical (both use the diagonal slash) or whether they should diverge visually — Magento distinguishes the two semantically (disabled = configured-off by admin, out-of-stock = inventory zero).
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-1, §4.

---

## 35. 2026-05-08 — Swatch selected state: no check-glyph overlay on color swatches (OQ-SW-2)

- **Item:** Figma's `Selected` color and image swatch variants (`1385:33332`, `1385:33334`, `1385:33747`) do NOT overlay a check glyph. The selection signifier is a two-stop `box-shadow` (the `Additional/Swatch inner` token: 3 px black-24 % + 2 px white inset) plus an outer 2 px ring colored per shape (blue-500 Rectangle / deep-emerald-green-300 Round).
- **Why flag:** Many Magento swatch implementations stamp a check icon on the selected color swatch. The Figma design omits this in favor of the inner+outer ring affordance alone. This is a deliberate visual choice and could be controversial — small color swatches at XS / S (16 × 16 px) may not show the inner ring clearly.
- **Spec recommendation:** Adopt Figma's design exactly — no check glyph on color swatches. Document as a known divergence from common Magento defaults in the component README.
- **Question for designer:** Confirm. Specifically, is the white inner ring sufficient for accessibility on bright product colors (e.g. teal-300 / pink-300) where white-on-pale has minimal edge contrast, or should we additionally render a check glyph at sizes M and below?
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-2, §3.4, §4.

---

## 36. 2026-05-08 — Swatch shape switches the outer-ring palette (Rectangle = blue, Round = emerald) (OQ-SW-3)

- **Item:** Figma uses **different colors** for the selected/hover outer ring depending on shape:
  - Rectangle Selected color swatch (`1385:33332`): outer ring = `blue.500` (`#3B82F6`)
  - Round Selected color swatch (`1385:33334`): outer ring = `deepEmeraldGreen.300` (`#2F9483`)
  - Rectangle Hover color swatch (`1385:33186`): outer ring = `blue.300` (`#93C5FD`)
  - Text swatches always use emerald regardless of shape (Rectangle Hover/Selected/Focus all use `deepEmeraldGreen.300` per `1385:32473` / `1385:32557` / `1385:32515`)
- **Why flag:** The shape-based palette switch is unusual. A typical pattern uses ONE brand color for selection regardless of shape. Two questions: (a) is the blue palette intentional for the Rectangle color/image swatches, or is it a leftover from an earlier design iteration, and (b) which is the brand-recommended default for the homepage?
- **Spec recommendation:** Treat shape as a palette switch (`swatch--round` → emerald, default Rectangle → blue) but document that **Round + emerald is the brand-recommended default**. Rectangle + blue is retained for backwards compatibility with merchant overrides.
- **Question for designer:** Confirm. Or unify on emerald-300 across both shapes for color swatches, in which case the Rectangle blue palette is dropped.
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-3, §3.1, §4.1, §4.2.

---

## 37. 2026-05-08 — Swatch text-hover border = `deepEmeraldGreen.300`, not blue (OQ-SW-4)

- **Item:** Figma reports text · M · Hover (`1385:32473`) border = `deepEmeraldGreen.300`. The Hyvä UI 2.7.1 kit uses `--swatch-stroke: var(--color-blue-300)` on hover instead.
- **Why flag:** The PHPure Golf brand wants emerald-on-hover; the kit ships blue. The author must override the kit's hover palette wholesale for text swatches.
- **Spec recommendation:** Adopt Figma — `--swatch-ring-hover: var(--color-deep-emerald-green-300)` for text swatches in BOTH Rectangle and Round shapes.
- **Question for designer:** Confirm.
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-4, §3.2, §4.3.

---

## 38. 2026-05-08 — Swatch focus indicator: drop-shadow ring vs Figma's 4 px solid border (OQ-SW-5)

- **Item:** Figma's focus state differs by type:
  - text · M · Focus (`1385:32515`): 2 px emerald-300 border + outer drop-shadow `0 0 0 4px #E1EBDD` (= `Focus/Primary`)
  - color · M · Focus (`1385:33268`): 4 px-thick `blue.500` solid border, no drop-shadow
- **Why flag:** Two different focus indicators for two types of swatch is inconsistent and the 4 px solid border on color swatches creates layout shift (the chip grows by 2 px on focus). It also visually clashes with the 2 px Selected outer ring (focus-on-selected = thick blue ring obscuring the green selected ring).
- **Spec recommendation:** Standardise on the text-swatch pattern across all types: thin border + outer `box-shadow: var(--shadow-focus\/primary)` drop-shadow. No layout shift, consistent visual language with form-field / form-checkbox / button.
- **Question for designer:** Confirm. The alternative is to keep Figma's color-swatch 4 px focus border, in which case we must also reserve 2 px of margin around every color swatch to absorb the layout shift, which complicates group layout. The drop-shadow approach is preferred.
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-5, §3, §4.

---

## 39. 2026-05-08 — Selected text-swatch label: weight 600 + emerald-500 (OQ-SW-6)

- **Item:** Figma reports text · M · Selected (`1385:32557`) label color = `deepEmeraldGreen.500` (`#004D40`) at font-weight 600 (`ITC Avant Garde Gothic Pro Demi`, remapped to DM Sans 600 per `fontFamilyOverrides`). Default is weight 500 + `slateBlue.600`.
- **Why flag:** Toggling between sizes / colors causes visible text weight + color shifts. This is intentional emphasis but worth confirming, because it can be perceived as a "page jump" if the user is rapidly comparing options.
- **Spec recommendation:** Adopt Figma exactly.
- **Question for designer:** Confirm, or specify a softer treatment (e.g. weight stays 500, color shifts only).
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-6, §3.2, §4.3.

---

## 40. 2026-05-08 — Disabled text-swatch label color: drop the 75 % opacity, use `slateBlue.300` directly (OQ-SW-7)

- **Item:** Figma reports text · M · Disabled (`1385:32599`) label = `slateBlue.400` (`#7C96AD`) with `opacity: 0.75`. Multiplied through, this resolves visually equivalent to a flat `slateBlue.300` (`#9DB0C2`) — but the opacity layer creates a stacking context that interferes with the diagonal-slash overlay z-ordering and complicates the `currentColor`-based glyph color we want for any future check overlay.
- **Spec recommendation:** Replace `slateBlue.400 + opacity 0.75` with a flat `color: var(--color-slate-blue-300)`. Visually identical, simpler stacking.
- **Question for designer:** Confirm — or specify if there is a perceptual reason to retain the opacity multiplier.
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-7, §3.2, §4.3.

---

## 41. 2026-05-08 — Swatch sizes XS / S below WCAG 2.5.8 touch-target threshold (OQ-SW-8)

- **Item:** Figma color/image swatch sizes for XS = 16, S = 15.75 (sic, treat as 16), M = 20, L = 22, XL = 24 px. Sizes XS / S / M are smaller than the WCAG 2.5.8 24 × 24 px target. The Hyvä UI 2.7.1 kit overrides Figma here and forces all background-color/image swatches to a fixed 32 × 32 px regardless of variant.
- **Spec recommendation:** Keep Figma's chip dimensions for the visible chip, but extend the wrapping `<label>` via padding so the interactive hit area is ≥24×24 px for all sizes XS through L. Document in the README that **size M or larger is the recommended default for primary attribute pickers on mobile**; XS / S are reserved for filter-facet rows where the parent fieldset row already provides a larger interactive surface.
- **Question for designer:** Confirm. Specifically, do we ship XS and S at all in v1, or restrict to M / L / XL?
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-8, §5, §7.

---

## 42. 2026-05-08 — Swatch text-pill padding: pixel-perfect values, esp. L = 12 / 16 px (OQ-SW-9)

- **Item:** Figma reports per-size dimensions (e.g. `text · L · Default` = 48 × 44 px outer, no inner padding directly probed for L). Spec §5.2 derives padding by reverse engineering from outer dimension minus content (label "L" width). For Size L: 48 wide × 44 tall outer with `text-base/leading-6` (16 px font, 24 px line-height) leaves ~12 px vertical padding — unusually low for a 44 px-tall pill. M and XL look proportional.
- **Why flag:** Without probing the `Base/_Swatch {base}` instance for each size separately, the padding values are inferred. Author should confirm pixel-perfect padding from Figma at implementation time before shipping.
- **Question for designer:** Provide / confirm the exact `padding-block` and `padding-inline` for each text swatch size (XS, S, M, L, XL). Especially L feels visually tight per the spec author's calculation.
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-9, §5.2.

---

## 43. 2026-05-08 — Swatch shell `[aria-invalid]` support for unanswered required pickers (OQ-SW-10)

- **Item:** PDP attribute pickers are typically required (size + color must be selected before "Add to cart"). On submit attempt with no selection, the consumer (Alpine on the form / fieldset) sets `aria-invalid="true"` on the `<fieldset class="swatch-group">`. The shell should react with a tinted legend (rose-700) and a tinted focus ring (`Focus/Error`) without the consumer having to repaint anything.
- **Why flag:** Figma does not include an "invalid / unanswered" variant for swatches. This is a standard UX pattern (mirrors form-checkbox `aria-invalid` support — questions.md #29).
- **Spec recommendation:** Add `&[aria-invalid="true"]` to the `swatch-group` shell, overriding the legend color to `rose.700` and switching `--swatch-focus-ring` to `Focus/Error`. The same modifier on `swatch-group--multi` (multi-select) should be no-op since multi-select facets are never required.
- **Question for designer:** Confirm. Provide a Figma frame if a custom design exists.
- **Cross-ref:** `components/swatches/A-swatches-rounded/spec.md` §2 OQ-SW-10, §9.

---

## 44. 2026-05-13 — Status atom: no size variants in Figma (OQ-ST-1)

- **Item:** The Stock-status component set (`1385:32111`) ships a single fixed size — 24 px tall container, `text-base/leading-6/font-normal` label (DM Sans 500 @ 16/24), 12 × 12 dot or 20 × 20 icon. There is no S / M / L axis.
- **Queried:** `1385:32111` metadata — 10 leaves (5 status × 2 styles); no `Size` property in any variant name.
- **Why flag:** Stock status is commonly displayed at multiple sizes:
  - **Small** on a product card chip (paired with `text-sm/leading-5` price labels).
  - **Medium** on a PDP under the price (current Figma default).
  - **Large** in a quick-view modal heading.
  Without a Figma size axis the author has to either (a) ship only the 16/24 size and let consumers wrap it in a sized parent, or (b) extrapolate S (`text-sm` + 8 × 8 dot + 16 × 16 icon, gap 4 / 3 px) and L (`text-lg` + 14 × 14 dot + 24 × 24 icon, gap 8 / 6 px) and ship a 3-size shell.
- **Need from designer:** Pick one:
  1. **Ship size M only** (matches Figma). Document that consumers compose larger / smaller variants by their own type scale.
  2. **Ship S / M / L.** Provide Figma references for S and L or confirm the extrapolation above is acceptable.
- **Cross-ref:** `components/status/A-basic/spec.md` §3.3, §5, §6.2.

---

## 45. 2026-05-13 — Status atom: Figma applies `font-variation-settings: 'opsz' 14` to all labels (OQ-ST-2)

- **Item:** Every label in `1385:32111` ships with `style={{ fontVariationSettings: "'opsz' 14" }}` per `get_design_context`. This is the optical-size axis of a variable font, set to 14 — meaning the font is rendered as if it were physically being typeset at 14 pt even though the actual font-size is 16 px.
- **Queried:** `1385:32068`, `1385:32106` `get_design_context`.
- **Why flag:** The substitute font in this POC is **DM Sans**, served self-hosted from `src/fonts/dm-sans/`. DM Sans (Google Fonts variable build) ships an `opsz` axis from 9 to 36 — but the local woff2 in this project may have been subset and may not include the axis. If `opsz` is requested on a font that doesn't expose it, browsers silently ignore the request (no visual difference). The Figma source intent is preserved, but the implementation needs an explicit decision.
- **Need from designer:**
  1. Confirm whether `font-variation-settings: 'opsz' 14` should be applied to the `.status__label` rule. If the local DM Sans build doesn't ship the axis, the rule is a no-op and can be safely added.
  2. If the visual difference matters, the local DM Sans build may need to be regenerated with the `opsz` axis preserved.
- **Cross-ref:** `components/status/A-basic/spec.md` §6.2.

---

## 46. 2026-05-13 — Status atom: no text-only (no-glyph) variant in Figma (OQ-ST-3)

- **Item:** All 10 leaves include either a Coloured-Dot or an Icon glyph; there is no text-only variant.
- **Queried:** `1385:32111` — `Style` property has 2 values only: `Coloured Dot`, `Icon`.
- **Why flag:** A compact mobile mini-cart row, a category grid filter pill, or a search-result line item often omits indicator glyphs entirely (the text-status color alone communicates). If the dev team wants this variant the author can add a `status--text-only` modifier that hides `.status__glyph` and tints the label per the status semantic.
- **Need from designer:** Confirm whether a text-only variant is needed. If yes, also confirm whether the label color should change (e.g. emerald-700 for in-stock label, rose-700 for out-of-stock label) — since without the glyph, the slate-blue-800 label becomes color-neutral and the status semantic is lost.
- **Cross-ref:** `components/status/A-basic/spec.md` §7.3.

---

## 47. 2026-05-13 — Status atom: no "Notify me" / "Back-in-stock" CTA composition in Figma (OQ-ST-4)

- **Item:** When a product is `Out of stock`, many e-commerce sites render a "Notify me when in stock" CTA either next to or replacing the status indicator. The Figma source for `1385:32109` and `1385:32071` shows only the status label; no CTA.
- **Queried:** `1385:32109`, `1385:32071` `get_design_context` — only label + icon/dot, no button or link.
- **Why flag:** Affects whether `components/status/A-basic` ships as a pure display atom (yes per Figma) or whether it needs a "with-action" composition variant. The cleanest answer is: status atom stays pure, and the CTA is a separate `<button>` atom composed alongside in the parent template (PDP, product card, quick-view).
- **Need from designer / dev team:**
  1. Confirm the status atom is display-only.
  2. If a "with-action" composition is needed at the atom level (rather than the parent template level), provide a Figma frame.
- **Cross-ref:** `components/status/A-basic/spec.md` §4, §9.

---

## 48. 2026-05-13 — Status atom: wrap / truncate policy and RTL behavior unspecified (OQ-ST-5, OQ-ST-6)

- **Item — part a (wrap):** Figma sets `whitespace-nowrap` on the `<p>` label. When the parent container is narrower than the label, Figma's auto-layout would overflow rather than wrap. In production this matters because translated labels can be much longer than English (e.g. German "Vorrätig" → "Nicht auf Lager" = 16 chars; or Czech "Skladem" → "Není skladem" = 12 chars; long-string locales like Russian / Greek can push 25+ chars).
- **Item — part b (RTL):** The Figma source is LTR-only. The glyph sits at the inline-start of the label. In RTL (Arabic / Hebrew) the standard expectation is for the glyph to flip to the right side (inline-start in RTL).
- **Queried:** `1385:32068`–`1385:32110` `get_design_context` — no overflow / wrap rules beyond `whitespace-nowrap`. No RTL variants.
- **Why flag:** Both decisions affect the CSS authored by `hyva-component-author`. Wrap: should it stay `nowrap` and force the consumer layout to provide enough width? Or should it allow wrap with `white-space: normal` as a `status--wrap` modifier? RTL: relying on flex + `gap` (logical) handles the glyph position automatically — but only if the author uses flex, not float / margin-inline-end.
- **Need from designer:**
  1. **Wrap policy:** confirm `whitespace-nowrap` is the default and provide a `status--wrap` modifier; OR confirm wrap is acceptable by default; OR pick a truncation policy (`overflow: hidden; text-overflow: ellipsis`).
  2. **RTL:** confirm the glyph stays at inline-start (matching Figma's LTR layout) and that the author uses logical CSS (flex `gap`, `padding-inline-*`).
- **Cross-ref:** `components/status/A-basic/spec.md` §8.1, §8.2.

---

## 49. 2026-05-13 — Status atom: emerald-500 and amber-500 indicators fail WCAG 1.4.11 (OQ-ST-7)

- **Item:** Figma uses `Tailwind/emerald/500 = #10B981` for in-stock indicators and `Tailwind/amber/500 = #F59E0B` for the warning / "Stock status" variant. Both colors against `colors.white` produce:
  - `emerald.500` on white: **2.49 : 1** — fails WCAG 2.2 SC 1.4.11 (≥ 3 : 1 required for UI components).
  - `amber.500` on white: **2.18 : 1** — fails 1.4.11.
  - `rose.500` on white: 4.13 : 1 — passes 1.4.11.
- **Queried:** `1385:32068`, `1385:32072`, `1385:32106`, `1385:32110` — all return `emerald.500` or `amber.500`.
- **Why flag:** Form-field (#13, A11Y-007) and form-checkbox (#30) both deviated from Figma to clear WCAG 1.4.11. The status atom should match the same audit. The textual label (`slateBlue.800`) does provide a redundant non-color cue, which is the WCAG mitigation path — but only if a screen-reader user or low-vision user can read the label. The dot/icon is then "decorative" and 1.4.11 doesn't strictly apply.
- **Need from designer:** Pick one:
  1. **Keep Figma exactly.** Document in `accessibility-review.md` that emerald-500 / amber-500 are decorative reinforcement only; the label carries the meaning. Add an explicit a11y note ("dot is `aria-hidden`; status is communicated by the label text").
  2. **Bump to .600 shades to pass 1.4.11.** Use `emerald.600 = #059669` (3.06 : 1 — passes) and `amber.600 = #D97706` (3.43 : 1 — passes). Visually slightly darker but still recognisable. Affects the `--in-stock` and `--stock-status` modifiers.
- **Cross-ref:** `components/status/A-basic/spec.md` §10.2, `accessibility-review.md`.

---

## 50. 2026-05-13 — Reviews summary: display-only vs interactive rating-input (OQ-RV-1)

- **Item:** The Figma frame `1385:28923` contains 24 leaves but no `State` axis (no Hover / Focus / Active / Pressed). Every leaf is a **read-only display** of an already-computed rating. There is no clickable / keyboard-rateable variant.
- **Queried:** `1385:28923` metadata — variant axes are `Leading`, `Stars`, `Trailing`. No `State`. No `Interactive` boolean.
- **Why flag:** Many storefronts ship a separate but visually-similar "Rate this product" widget on the review-submission form (5 hover-fill-stars, clickable, ARIA `radiogroup` / `aria-valuenow`). It would be tempting to reuse this atom for both, but doing so quietly conflates a read-only display with an interactive input — different a11y contract, different DOM, different JS. The author needs an explicit decision.
- **Need from designer / dev team:** Pick one:
  1. **This atom is display-only.** A separate atom (`review/B-input` or `rating-input/A-basic`) will be designed later for the review-submission form. Spec recommendation.
  2. **Extend this atom with an interactive variant.** Add a `State = Interactive` variant family. Requires Hover (highlight stars 1..N on mouseover), Focus (visible focus ring on the currently-keyboard-active star), Pressed (commit selection). Each star becomes a `<button>` or each row a `<fieldset role="radiogroup">`. Provide Figma references.
- **Cross-ref:** `components/review/A-basic/spec.md` §2 (last paragraph), §7.

---

## 51. 2026-05-13 — Reviews summary: single 20-px star size only — no S / L axis (OQ-RV-2)

- **Item:** All 24 leaves render at the same fixed size (20 × 20 px stars, 14 px label, 12 px pill-counter glyph). No Size axis. The Hyvä UI 2.7.1 kit (`product-reviews/A-basic`) exposes `rating_star_size` as a layout-XML config option defaulting to 24 px, with B-minimal defaulting to 20 px — so the kit normally supports multiple sizes via prop.
- **Queried:** `1385:28923` metadata — no `Size` property.
- **Why flag:** A 20 px star is right for a product-card row but visually small at PDP-header scale, and visually large at a mini-cart row or a search-result line item. Common e-commerce sizing tiers:
  - **S:** 14 × 14 px stars + `text-xs/leading-4` text — for mini-cart, header dropdown, search results
  - **M:** 20 × 20 px stars + `text-sm/leading-5` text — current Figma default
  - **L:** 24 × 24 px stars + `text-base/leading-6` text — for PDP header
- **Need from designer:** Pick one:
  1. **Ship M only.** Document that consumers compose larger / smaller variants by wrapping the atom in a sized parent that overrides via CSS custom properties (e.g. `--review-summary-star-size: 24px`).
  2. **Ship S / M / L.** Provide Figma references for S and L, or confirm the extrapolation above is acceptable. Author then adds `review-summary--s` and `review-summary--l` modifiers.
- **Cross-ref:** `components/review/A-basic/spec.md` §2 ("What is NOT in the node"), §7.

---

## 52. 2026-05-13 — Reviews summary: `font-variation-settings: 'opsz' 14` on counter text (OQ-RV-3)

- **Item:** The Counter text element (`(12 reviews)`) ships with `style={{ fontVariationSettings: "'opsz' 14" }}`. This is the optical-size variable-font axis set to 14, the same pattern observed in the Status atom (questions.md #45).
- **Queried:** `1385:29145`, `1385:28922`, `1385:30231` `get_design_context`.
- **Why flag:** Identical question to #45 — DM Sans served self-hosted from `src/fonts/dm-sans/` may or may not ship the `opsz` axis. If absent, the rule is silently ignored.
- **Need from designer:** Same answer as #45 — confirm whether to apply `font-variation-settings: 'opsz' 14` to `.review-summary__count`. Spec recommendation: apply it; it is harmless when absent and matches Figma intent.
- **Cross-ref:** `components/review/A-basic/spec.md` §4, §7.

---

## 53. 2026-05-13 — Reviews summary: title-pill radius is `10px`, not a named token (OQ-RV-4)

- **Item:** The leading title-counter pill (`1384:29084`) renders as a 20 × 20 px square with `rounded-[10px]` — exactly half its size, i.e. a perfect circle. No existing `borderRadius` token equals 10 px (the scale is `sm = 2`, `base = 4`, `md = 6`, `lg = 8`, `xl = 12`, `2xl = 16`, `3xl = 24`, `full = 9999`).
- **Queried:** `1385:29225`, `1385:30231`, `1385:29463` `get_design_context`.
- **Why flag:** "Tokens only, no arbitrary values" per CLAUDE.md. `rounded-[10px]` is an arbitrary value. The visual intent (a circle on a 20 × 20 element) is captured perfectly by `rounded-full` (= 9999px) — the corner radius is clamped by the element's half-size, so a 20-px-square element with `rounded-full` renders identically to one with `rounded-[10px]`.
- **Need from designer:** Confirm switching the implementation to `rounded-full` is acceptable. The alternative is to add `borderRadius.10` (= 10px / 0.625rem) as a new named token, but that adds a token used in exactly one place.
- **Spec recommendation:** Use `rounded-full`. Same final pixels, no new tokens.
- **Cross-ref:** `components/review/A-basic/spec.md` §4 (Radii), §7.

---

## 54. 2026-05-13 — Reviews summary: star glyph is a custom path, not Heroicons or Lucide (OQ-RV-5)

- **Item:** Figma supplied two SVG assets (saved to `components/review/A-basic/figma-screenshots/star-{empty,filled}-*.svg`) with viewBox `0 0 14 13.3715` — a slightly wider-than-tall 5-point star. This does NOT match:
  - **Heroicons solid `star`** (viewBox `0 0 20 20`, square aspect)
  - **Lucide `star`** (viewBox `0 0 24 24`, square aspect; used by the kit's `product-reviews/A-basic`)
- **Queried:** `1385:29185` `get_design_context` + asset download from `http://localhost:3845/assets/...`.
- **Why flag:** CLAUDE.md mandates "Icons: Heroicons." The Figma design intentionally diverges. Two options:
  1. **Inline the Figma path.** ~600 bytes per row, perfect visual parity, `currentColor`-driven so the same DOM works for both empty and filled (just change `color`).
  2. **Substitute Heroicons solid `star`.** Looks visibly different — Heroicons' curve is fuller, the points are less sharp, and the aspect ratio is square not 14:13.4. The PHPure brand stars are pointier.
- **Need from designer:** Confirm option 1 (inline the Figma path). Confirm CLAUDE.md's "Heroicons only" rule has an exception for brand-bespoke glyphs like this star (and the dot/icon glyphs in the status atom, which are also custom).
- **Spec recommendation:** Inline. Update CLAUDE.md's icon policy with a footnote: "Heroicons for general-purpose UI iconography (close, chevron, search, etc.); brand-custom glyphs (review stars, status dots) inline from Figma."
- **Cross-ref:** `components/review/A-basic/spec.md` §5, `figma-screenshots/README.md`.

---

## 55. 2026-05-13 — Reviews summary: empty-state placeholder leaf — Figma authoring guard vs runtime UI (OQ-RV-6)

- **Item:** Leaf `1385:30346` (`Leading=None, Stars=False, Trailing=None`) is filled with the literal string `[Empty Reviews summary component]` rendered at `text-sm/leading-5/font-medium`, colour `rose.500` (`#F43F5E`).
- **Queried:** `1385:30346` `get_design_context`.
- **Why flag:** Two interpretations:
  1. **Figma authoring hint.** Standard pattern — when every slot is empty, designer puts a loud warning so a consumer can't accidentally ship an invisible component. At runtime the atom should render nothing (`display: none` or skip the DOM entirely).
  2. **Real "no reviews yet" string.** Designer intends `[Empty Reviews summary component]` to be replaced with `(No reviews yet)` or similar copy, styled in rose-500 to draw attention.
- **Need from designer:** Pick one:
  1. **Authoring hint.** Atom renders nothing if no rating data, no title, and no count are passed. Spec recommendation.
  2. **Real degraded state.** Provide the actual copy ("No reviews yet" / "Be the first to review") and confirm rose-500 as the colour token (or specify another — rose-500 is a strong error colour, which is unusual for a neutral "no reviews" state; `slateBlue.500` would be more typical).
- **Cross-ref:** `components/review/A-basic/spec.md` §6, §7.

---

## 56. 2026-05-13 — Reviews summary: stars and score in Figma demo are NOT synchronised (OQ-RV-7)

- **Item:** Every Figma leaf with both stars and a score shows ~3.1 visible stars (the clipping insets on the 4th and 5th stars are `inset-[0_95%_0_0]` = 5% filled) BUT the trailing score reads `4.1`. Reality check: 4.1 / 5 = 82% fill, so a true 4.1 rating should show stars 1–4 fully filled + star 5 at 10% — instead Figma shows 3 + 5% + 5% = 3.1 effective fill, with a literal "4.1" string in the trailing slot.
- **Queried:** `1385:28922`, `1385:29105`, `1385:29345`, `1385:29385`, `1385:30231` — all show the same de-synchronisation.
- **Why flag:** Possibilities:
  1. **Figma is just sloppy demo data.** Designer used a generic "partial fill" template for the stars and a generic "4.1" label, never intending the two to match. Runtime should compute both from a single source value. Spec recommendation.
  2. **Intentional design contract:** stars and score communicate different things — e.g. score = "exact average" (4.1), stars = "rounded-to-nearest-half average" (4.0) or some other quantisation. In that case the spec needs to document the exact rounding rule.
- **Need from designer:** Confirm the runtime contract:
  1. Single source of truth: a numeric rating (0 to 5, inclusive, in any decimal precision) drives both the star fills (continuous) and the printed score (rounded to 1 decimal). Spec recommendation.
  2. OR document a quantisation rule (e.g. stars rounded to halves, score to tenths).
- **Cross-ref:** `components/review/A-basic/spec.md` §5 (Fractional fill).

---

## 57. 2026-05-13 — Reviews summary: champagneBeige-700 filled-star fails WCAG 1.4.11 on white (OQ-RV-8)

- **Item:** Filled-star colour is `champagneBeige.700 = #BFAB82`. Contrast against `colors.base.white` (`#FFFFFF`) = **1.94 : 1** — fails WCAG 2.2 SC 1.4.11 (≥ 3 : 1 required for non-text UI components carrying meaning).
- **Empty-star colour** is `slateBlue.200 = #BDCBD6` — contrast on white = **1.50 : 1** — also fails 1.4.11. (Expected — the empty-star is a "track" / decorative background, but it carries meaning as the 0-state.)
- **Queried:** `1385:28923` `get_variable_defs`.
- **Why flag:** Same WCAG question as form-field (#13, A11Y-007), form-checkbox (#30), swatches focus-ring discussion, and status atom (#49). The textual score (`4.1`) and the textual counter (`(12 reviews)`) DO provide redundant non-colour cues — and the parent `<div role="img" aria-label="X out of 5 stars">` puts the rating into the accessibility tree. With that mitigation, the stars themselves can be argued as "decorative reinforcement of an accessible name carried by the parent" and 1.4.11 doesn't strictly apply.
- **Need from designer:** Pick one:
  1. **Keep Figma exactly.** Document the rating in `accessibility-review.md` that the star colours are decorative reinforcement (the meaning is carried by `aria-label` and by the visible score text); the stars themselves are `aria-hidden`. Spec recommendation.
  2. **Bump filled-star to a higher-contrast tone** — `champagneBeige.800 = #A58F60` (2.50 : 1) is still fail; `champagneBeige.900 = #8C733E` (3.43 : 1) passes. Or `burnishedGold.500 = #B68D40` (2.77 : 1, fail) → `burnishedGold.600 = #927133` (4.29 : 1, pass) — burnished-gold-600 is brand-consistent and passes 1.4.11 cleanly.
- **Cross-ref:** `components/review/A-basic/spec.md` §4 (Colors), §7. `accessibility-review.md` (when updated).

---

## 58. 2026-05-13 — Product card: Mobile-List promo price size downshift (OQ-PC-1)

- **Item:** Mobile List promo current-price renders at `text-xl/leading-7/font-normal` (20 / 28) instead of `text-2xl/leading-8/font-normal` (24 / 32) used in every other layout.
- **Queried:** `11109:24757` `get_design_context` (price node in `11109:24852` neighbourhood).
- **Why flag:** A 20 / 28 price vs 24 / 32 changes the visual weight of the most important card datum across breakpoints. May be intentional (Mobile List has very tight horizontal space with old + new prices side-by-side) or a Figma oversight.
- **Need from designer:** Pick one. (a) Confirm 20 / 28 on Mobile List promo only; molecule adds a `.product-card__price-current--sm` modifier applied at the `md:` breakpoint when style=list and promo=true. (b) Normalise everything to 24 / 32 — the molecule needs no extra modifier.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §4.4, §7.

---

## 59. 2026-05-13 — Product card: stock-status slot placement + OOS CTA (OQ-PC-2)

- **Item:** None of the eight in-scope Figma leaves (`2256:7466`) renders a stock-status indicator. The Hyvä kit template `product/list/item.phtml` calls `$block->getChildBlock('stockstatus')->...->toHtml()` between price and the action-row. The project ships an approved `status` atom with `status--stock-status` + `--in-stock` + `--out-of-stock` modifiers.
- **Queried:** All 8 default-state leaves; no `stockstatus` slot visible.
- **Why flag:** The molecule must wire up the slot for the dev team to import; absent a Figma reference, the placement and the OOS behaviour are unconstrained.
- **Need from designer:** Three sub-decisions:
  1. Is the in-stock indicator INTENTIONALLY hidden by design (common for "all listed products are in stock" stores) or just missing from the Figma frame? If hidden, the molecule renders the slot only when stock=out (recommendation).
  2. If shown, where? Spec recommendation: under the price row, above the action row, single-line, `status--dot` style.
  3. When out-of-stock, should the Add-to-cart button be replaced by a "Notify me when back in stock" CTA (the Hyvä kit drops the form entirely; some storefronts swap the CTA)?
- **Cross-ref:** `components/product-card/A-basic/spec.md` §3, §8, `components/status/A-basic/spec.md`.

---

## 60. 2026-05-13 — Product card: old strikethrough price inconsistency across layouts (OQ-PC-3)

- **Item:** The old strikethrough price uses two different sizes across the four promo layouts:
  - Desktop Grid promo: **18 / 28** (`text-lg/leading-7/font-light`) — Figma node `7681:31588`.
  - Desktop List + Mobile Grid + Mobile List promo: **16 / 24** (`text-base/leading-6/font-light`) — Figma nodes `11109:24835`, `7681:31754`.
  - Inter-price gap also varies: Desktop Grid 16 px, Desktop List 4 px, Mobile Grid 12 px, Mobile List 12 px.
- **Queried:** All four promo leaves `get_design_context`.
- **Why flag:** Probably a Figma slip — one designer copy-pasted with a different size override on one variant. But possible intent: Desktop Grid has the most vertical room to give the old price a slightly larger reading size.
- **Need from designer:** Pick one (a) normalise all four to 16 / 24 with `gap-3` (12 px) — single CSS pattern; (b) document the variation and accept Desktop Grid as a deliberate larger-old-price exception (molecule gets a per-layout modifier).
- **Cross-ref:** `components/product-card/A-basic/spec.md` §4.4, §7.

---

## 61. 2026-05-13 — Product card: rotated-aspect-ratio image cropping (OQ-PC-4)

- **Item:** Figma's image frame uses a `-rotate-45` outer wrapper + a nested `rotate-[24.47deg]` aspect-ratio keeper to crop the bag PNG into a stylised tilted-square. The visible product image inside the keeper is in NORMAL orientation; the rotation only affects the mask shape.
- **Queried:** `2256:6813`, `5867:16446`, `5870:48292`, `11109:23975` `get_design_context`.
- **Why flag:** This is a Figma prototyping artefact (auto-layout containers used to compute a non-integer aspect ratio). It does NOT translate to a meaningful CSS pattern — production code should render a straightforward `<img>` in a fixed-aspect-ratio container.
- **Need from designer:** Confirm: the molecule should use `aspect-[336/240]` (Desktop Grid), `aspect-square` (Desktop List), `aspect-[142/102]` (Mobile Grid), `w-[109px] h-[102px]` (Mobile List) with a normal `object-cover` image. The rotation hack is ignored.
- **Spec recommendation:** As above. The visual outcome is identical for any standard product photo.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §4.2, §5.

---

## 62. 2026-05-13 — Product card: hidden Hover variants + Clothes product (OQ-PC-5)

- **Item:** Frame `2256:7466` contains two HIDDEN leaves: `2256:7442` (Desktop, List, **State=Hover**, Product=**Clothes**, Promo=False) and `2256:7394` (Desktop, **Style=Original Grid**, State=Hover, Product=Clothes, Promo=False). Both use Product=Clothes content and Hover state. The eight visible leaves are all Product=Gear, State=Default.
- **Queried:** `2256:7466` metadata; both Hover leaves carry `hidden="true"`.
- **Why flag:** (a) The Hover state for the live Gear leaves is unspecified — no canonical reference; (b) the "Original Grid" qualifier on `2256:7394` is undocumented; (c) Product=Clothes never appears un-hidden — does the molecule need to support it as a runtime variant or is it just a Figma authoring convenience?
- **Need from designer:** Three answers:
  1. Should the Hover variants be un-hidden so they become the source of truth for the molecule's `:hover` state? Or is Hover decoratively "Shadow/lg + 200 ms transition" per spec recommendation in OQ-PC-14?
  2. What does "Original Grid" mean? Is `2256:7394` legacy / deprecated, or an alternative grid layout the molecule should support?
  3. Is Product=Clothes a meaningful runtime axis (different image aspect ratio? different button arrangement?) or just authoring placeholder?
- **Cross-ref:** `components/product-card/A-basic/spec.md` §1, §8, §10 (OQ-PC-14).

---

## 63. 2026-05-13 — Product card: Mobile-Grid "Add to comparison" label wrap (OQ-PC-6)

- **Item:** On Mobile Grid (`5867:16444`) the "Add to comparison" label is shown WRAPPED to two lines: "Add to" / "comparison". The 158-px card with `px-3` padding leaves ~110 px for the label + 6-px gap + 20-px box, so the label has ~84 px of width, which forces "Add to comparison" (16 chars) onto two lines.
- **Queried:** `5867:16444` `get_design_context` (node `8058:60189`).
- **Why flag:** Two interpretations: (a) intentional natural wrap — `whitespace-normal` and accept the two-line layout (spec recommendation), or (b) the label should be shortened to "Compare" on Mobile and stay single-line.
- **Need from designer:** Pick one. If (b), need confirmation that "Compare" is the desired Mobile copy (matches some other storefronts but not the Hyvä kit default).
- **Cross-ref:** `components/product-card/A-basic/spec.md` §2.3, §3.

---

## 64. 2026-05-13 — Product card: Mobile-List "New" badge smaller-typography (OQ-PC-7)

- **Item:** On Mobile List (`11109:23973`) the "New" badge renders smaller: `text-xs/leading-4/font-normal` (12 / 16) typography, 32 px height, `py-2 px-1`. Everywhere else the badge is `text-sm/leading-5/font-normal` (14 / 20), 40 px height, `py-2.5 px-1`.
- **Queried:** `11109:23973` `get_design_context` (node `11109:24002`).
- **Why flag:** The Mobile List card is the most space-constrained variant (228 px tall, two columns); a 40-px badge would visually crowd the 102-px image. The smaller badge makes sense, but the molecule needs to know whether this is layout-driven (handled via a `.product-card__badge--sm` modifier OR a `lg:` breakpoint utility) or part of a generic "compact" theme.
- **Need from designer:** Confirm the molecule should apply the smaller badge on Mobile List ONLY (`md:hidden` / `md:visible` swap, or layout-XML arg `compact_badge=true`).
- **Cross-ref:** `components/product-card/A-basic/spec.md` §4.3, §5.

---

## 65. 2026-05-13 — Product card: Mobile primary button shape (icon-only-pill vs icon-only-round) (OQ-PC-8)

- **Item:** On Mobile (Grid + List) the Add-to-cart button drops the "Add to cart" label and shows only the shopping-cart icon. The Figma DOM keeps the button as a `flex-1` wide pill (`rounded-full` + `flex-1` + `py-2.5 px-5`) — visually a WIDE PILL with just a centred icon, NOT a 40 × 40 circle.
- **Queried:** `5867:16463`, `5870:48313`, `11109:24058` `get_design_context`.
- **Why flag:** The existing `buttons/A-basic` atom exposes `btn-icon-only-round` which produces a CIRCLE (`size-10`), not a wide pill. The molecule needs a way to express "icon-only but width comes from parent" — either: (a) add a new `btn-icon-only-pill` utility to the atom, or (b) just keep `btn-icon-leading` and visually-hide the label with `sr-only` on Mobile while letting the button keep its wide-pill geometry from `flex-1`.
- **Need from designer:** Pick one. Spec recommendation: (b) — keep `btn-icon-leading` + `<span class="sr-only">Add to cart</span>` on Mobile; the icon stays centred (`justify-center`) when there's no visible label. No new atom utility needed.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §3, `components/buttons/A-basic/spec.md`.

---

## 66. 2026-05-13 — Product card: swatch overflow policy when >5 colors (OQ-PC-9)

- **Item:** All eight Figma leaves cap at 4 swatches (Grid) or 5 swatches (List). For a real product with 8+ colors, the molecule needs a defined overflow policy: (a) wrap to N lines, (b) horizontally scroll within the available width, (c) cap to first N and show a `+M more` chip linking to the PDP.
- **Queried:** All 8 leaves — no leaf shows wrap, scroll, or +N indicator.
- **Why flag:** Without a policy the molecule will silently truncate or wrap, possibly hiding stock-relevant variants. Common e-commerce default = option (c): cap to 5 + "+M more" chip.
- **Need from designer:** Pick one. If (c), define the visual treatment for the `+M more` chip (recommendation: same swatch shape, `bg-slateBlue.100`, text `text-xs/leading-4/font-medium`, color `slateBlue.700`, content `+3` etc.).
- **Cross-ref:** `components/product-card/A-basic/spec.md` §3, `components/swatches/A-swatches-rounded/spec.md`.

---

## 67. 2026-05-13 — Product card: reviews-summary mono-single-star variant (OQ-PC-10)

- **Item:** The product card uses a COMPACT mono-single-star reviews summary (1 filled star + "4.1" + "(12)"), NOT the full 5-star track. The current `review/A-basic` atom ships the 5-star track as default; there is no `--mono` or compact variant.
- **Queried:** `5728:34291`, `I5728:34291;1395:30022;1384:29100` (Stars subgroup, contains only 1 star with `percentage="100%" style="Mono"`).
- **Why flag:** Two options: (a) extend the `review` atom with a new `review-summary--mono` modifier that renders one filled star, the score, and the count — spec recommendation, keeps reuse clean; (b) the molecule embeds its own mini-reviews inline, bypassing the atom — adds duplication.
- **Need from designer:** Confirm (a). If yes, this turns into a follow-up task on the `review` atom: add `--mono` modifier renderable from existing slots (single `__star` child instead of 5; same `__score` + `__count` slots).
- **Cross-ref:** `components/product-card/A-basic/spec.md` §3, `components/review/A-basic/spec.md`.

---

## 68. 2026-05-13 — Product card: description 2-line clamp strategy (Desktop List only) (OQ-PC-11)

- **Item:** Desktop List shows a 2-line product description using `h-12 overflow-hidden text-ellipsis` (fixed-height crop with last-line ellipsis only). Standard CSS for true N-line clamp is `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;` (Tailwind: `line-clamp-2`).
- **Queried:** `11109:24604` `get_design_context`.
- **Why flag:** `h-12 + text-ellipsis` ellipsises only if the LAST visible line overflows; if the description is short (e.g. 30 chars) it just shows the short text with no ellipsis (correct). If it's 1.5 lines, you get the first full line + the second half-line with `…`. `line-clamp-2` is more predictable.
- **Need from designer:** Confirm `line-clamp-2` is acceptable (Tailwind v4 ships it as a utility). Spec recommendation: use `line-clamp-2` for predictability.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §4.5.

---

## 69. 2026-05-13 — Product card: compare-button slot (kit has it, Figma doesn't) (OQ-PC-12)

- **Item:** The Hyvä kit's `product/list/item.phtml` includes a `<?php if ($showAddToCompare): ?>` compare-icon button next to the wishlist icon (lines 205-209 of the kit template). The PHPure Figma design does NOT render a compare icon button in any of the eight leaves.
- **Queried:** All 8 leaves — no compare icon present.
- **Why flag:** Two options: (a) the molecule drops the compare slot entirely (cleaner output, diverges from kit); (b) the molecule keeps the kit's compare slot wired-up but renders nothing by default — render only when a layout-XML arg `show_compare=true` is set.
- **Need from designer:** Confirm (b) — spec recommendation. Preserves backward compat with the kit and keeps the design lean by default.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §4.6.

---

## 70. 2026-05-13 — Product card: demo swatch colors not in brand palette (OQ-PC-13)

- **Item:** The Figma demo uses four swatch colors: `#9FB4A9` (sage), `#3A3A3A` (charcoal), `#52B4A8` (light teal, used for the OOS chip in List variants), `#B45309` (amber, == brand `amber.700`). Three of the four are NOT in `tokens.resolved.json`.
- **Queried:** All 8 leaves — same four colors.
- **Why flag:** Swatch colors are RUNTIME product data (the merchant configures them per product). The molecule's CSS doesn't bake any swatch color — the `swatches/A-swatches-rounded` atom takes `--swatch-bg` inline per chip. So no new tokens are needed for swatch fills. But it's worth confirming the demo values are stand-ins, not brand swatches.
- **Need from designer:** Confirm: these are runtime demo data. No tokens to add.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §6.1.

---

## 71. 2026-05-13 — Product card: card hover shadow choice (OQ-PC-14)

- **Item:** The Hover leaves are hidden (see OQ-PC-5), so the card's `:hover` shadow is unspecified in Figma. The Hyvä kit applies `hover:shadow-lg` on the form element.
- **Queried:** `2256:7466` metadata + hidden leaves.
- **Why flag:** Hover behaviour needs to be defined for the molecule to ship.
- **Need from designer:** Confirm: apply `boxShadow.Shadow/lg` (`0px 4px 6px -2px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.1)`) on `:hover` with `transition: box-shadow 200ms ease-out`. No image zoom, no card translateY.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §8.

---

## 72. 2026-05-13 — Product card: DM Sans weight 600 (Demi) vs token weight 400 (OQ-PC-15)

- **Item:** Multiple Figma elements specify `ITC AGGP:Demi` (weight 600) — including the Mobile product title and the "Add to cart" button label. The corresponding token entries in `tokens.resolved.json` are: `text-lg/leading-7/font-medium` weight **400**; `text-sm/leading-5/font-medium` weight **400**. Replacing ITC AGGP with DM Sans, weight 400 vs weight 600 is a visible difference (DM Sans 600 reads noticeably bolder).
- **Queried:** `5867:16455` (Mobile title), `I1395:30244;1287:11913;1286:12570` (button label).
- **Why flag:** This is the same Figma-fidelity-vs-token-truth tension flagged across multiple atoms. Two options:
  1. **Correct the token weight.** Update `text-lg/leading-7/font-medium` and `text-sm/leading-5/font-medium` in `tokens.resolved.json` to weight 600. Re-run `scripts/build-tailwind-config.mjs`. Affects every component that already uses these tokens.
  2. **Keep the token weight at 400.** Accept the visual difference (DM Sans 400 vs ITC AGGP Demi 600 will read slightly lighter in the molecule).
- **Need from designer:** Pick one. This is a project-wide decision — answer it once and we apply across all components.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §7, `design-tokens/tokens.resolved.json` typography section.

---

## 73. 2026-05-13 — Product card: `font-variation-settings: 'opsz' 14` on text elements (OQ-PC-16)

- **Item:** Same recurring question as #45 (status), #52 (review). Most text elements in the card carry `style={{ fontVariationSettings: "'opsz' 14" }}` in Figma. DM Sans served self-hosted from `/src/fonts/dm-sans/` may or may not ship the `opsz` axis.
- **Queried:** Multiple nodes — pattern is everywhere.
- **Why flag:** Same answer as #45 / #52 expected.
- **Spec recommendation:** Apply it — harmless if absent.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §7. Cross-refs to questions.md #45, #52.

---

## 74. 2026-05-13 — Product card: heading level for product title (OQ-PC-17)

- **Item:** The Hyvä kit doesn't wrap the title in a heading element — `<a class="product-item-link">…name…</a>`. The molecule's product title should be a heading for semantic correctness. Recommendation: `<h3>` (assuming category page uses `<h1>` for page name, `<h2>` for section headings like "Featured", `<h3>` per card).
- **Queried:** `812:7347` (Desktop Grid title), `11109:24602` (List title), `5867:16455` (Mobile title).
- **Why flag:** Diverges from the Hyvä kit pattern. Need confirmation that the molecule should override the kit and add heading semantics.
- **Need from designer:** Confirm `<h3>` is the right level. Confirm overriding the kit is acceptable. If the parent listing page sometimes uses `<h2>` for cards (homepage hero slider), the molecule may need a `heading_level` layout-XML arg.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §9.2.

---

## 75. 2026-05-13 — Product card: touch-target sizes for icon-only buttons on Mobile (OQ-PC-18)

- **Item:** `btn-size-m` produces a 40 × 40 px icon-only round button. WCAG 2.2 AAA recommends 44 × 44; WCAG 2.5.8 (level AA) requires 24 × 24. The 40 × 40 button passes AA but fails AAA.
- **Queried:** `I812:7469;1287:15687` (wishlist), `I5867:16463;1287:11913` (mobile cart).
- **Why flag:** Mobile users have higher mis-tap rates than desktop. The Mobile-Grid card has two adjacent 40-px icon-only round buttons (cart on the LEFT filling `flex-1`, wishlist on the RIGHT `shrink-0`) — they sit very close together.
- **Need from designer:** Pick one: (a) keep 40 × 40 (matches Figma exactly, passes AA); document in `accessibility-review.md`; (b) bump to `btn-size-l` (44 × 44 or 48 × 48 — check the atom's L size) on Mobile only via a layout-XML arg or breakpoint utility.
- **Spec recommendation:** (a) — keep Figma fidelity, document the AAA-fail in the a11y review.
- **Cross-ref:** `components/product-card/A-basic/spec.md` §9.11, `components/buttons/A-basic/spec.md`.

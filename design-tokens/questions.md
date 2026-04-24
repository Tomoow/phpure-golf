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

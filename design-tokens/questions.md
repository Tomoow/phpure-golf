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

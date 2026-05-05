# CLAUDE.md — PHPure Golf Hyvä UI POC

This file is the contract for any Claude session working in this project. Read it before you touch anything.

---

## Purpose of this project

Proof-of-concept that Claude Code can produce clean, dev-ready Hyvä UI components and pages from a Figma design. The deliverable is a set of components and a homepage, polished enough that the dev team will adopt them into their own Hyvä UI kit.

This is **not** a running Magento install. No one compiles PHTML here. The dev team will import the output into their own Hyvä theme.

---

## Operating principles (non-negotiable)

1. **No interpretation.** If any spec, value, or requirement is ambiguous or missing, stop and ask. Never guess a color, spacing, font, behavior, or file location. Log every ambiguity in `design-tokens/questions.md` and wait for a human answer before proceeding on that item.
2. **Figma is the single source of truth for visuals.** Hex values, spacing, typography, radii, shadows — all come from Figma via the Figma MCP (`figma-desktop`) or from `design-tokens/tokens.resolved.json`. Never from training data, never from "reasonable defaults."
3. **Hyvä is the single source of truth for structure.** File paths, PHTML patterns, Alpine idioms, CSP compliance, naming — all follow Hyvä UI 2.7.1 conventions. Start from the files in `hyva-ui-reference/` and tweak. Do not invent new patterns.
4. **Tokens only, no arbitrary values.** Every color, spacing, font-size, radius, and shadow in generated code must resolve to a token in `src/css/theme.css` (the Tailwind v4 `@theme` block). No `p-[13px]`, no raw hex, no inline `style=`. If a value doesn't have a token yet, stop and ask.
5. **Use subagents for separation of concerns.** The orchestrator delegates to specialized subagents in `.claude/agents/`.
6. **Stop and ask beats producing something plausible.** 10 blocking questions is better than 1 wrong component.

---

## Stack facts

- **Hyvä UI library version:** 2.7.1 (Dec 2025 / Mar 2026 release). Read-only reference at `hyva-ui-reference/` (symlink to `/Users/tomlievens/cursor/phpure-golf/hyva-ui/`).
- **Hyvä Default Theme minimum:** 1.4+
- **Tailwind CSS:** **v4** (the Hyvä UI 2.7.1 kit uses `@utility`, `--spacing()`, `@theme`, and CSS custom properties. v3 is not compatible with this kit.)
- **Alpine.js:** v3
- **CSP compliance:** required. No inline `onclick`, no inline `<script>`. Use `x-on:`/`@` Alpine directives.
- **Fonts — POC override:** **DM Sans only.** Figma references ITC Avant Garde Gothic Pro and Dejanire Headline, but those commercial fonts are not available for this POC. Every text style that points to either is remapped to DM Sans. Self-hosted under `src/fonts/dm-sans/`. The remapping is recorded in `design-tokens/tokens.resolved.json` under `fontFamilyOverrides`.
- **Icons:** Heroicons.
- **Brand color ramps (from Figma):** Slate Blue (50–900), Burnished Gold (50–900), Champagne Beige (50–900), Deep Emerald Green (50–900). Plus the full default Tailwind palette.
- **Figma file key:** `YlKyhwcdYEa41gK1BSs4AZ` (PHPure Golf).
- **Figma MCP:** `figma-desktop` (local Figma Desktop Dev Mode MCP at `http://127.0.0.1:3845/mcp`). Tools: `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`, `create_design_system_rules`.

---

## Handoff model

Every component is produced as a **pair** so both the dev team and the designer can consume it:

### Atoms (button, inputs, icons, etc.)
Hyvä UI 2.7.1 ships atoms as CSS files (`@utility` blocks), not PHTML. So atoms produce:

- `components/<category>/<name>/src/web/tailwind/components/<name>.css` — the real Hyvä-style CSS the dev team imports.
- `components/<category>/<name>/preview.html` — static HTML using those classes, showing every variant and state.
- `components/<category>/<name>/README.md` — usage, variants, Figma node ID.

### Molecules / Organisms (header, card, banner, product-card, etc.)
These ship as full Magento theme folders (matching the kit's structure):

- `components/<category>/<name>/src/Magento_*/templates/*.phtml` — the real Hyvä PHTML.
- `components/<category>/<name>/src/Magento_*/layout/*.xml` — layout XML.
- `components/<category>/<name>/preview.html` — static HTML mirror using the same classes, same DOM, same Alpine directives so the designer can preview locally via Vite.
- `components/<category>/<name>/README.md` — usage, variants, Figma node ID.

The `.phtml`/`.css` and `preview.html` must stay in sync (same classes, same DOM, same Alpine). The `component-reviewer` subagent enforces this.

---

## Definition of done per component

A component is only **approved** when all of these are true:

- **Visual parity with Figma** at every breakpoint (mobile 375, tablet 768, desktop 1280+) and every state (default/hover/focus/active/disabled/error where applicable).
- **All styles resolve to tokens** in `src/css/theme.css`. No arbitrary Tailwind values, no raw hex, no inline `style=`.
- **Hyvä 2.7.1 conventions followed.** PHTML uses `<?= $escaper->escapeHtml(...) ?>`, `$block->getChildHtml()`, layout XML. CSS uses `@utility`. Alpine uses `x-on:`/`@` (never `onclick`). No inline `<script>`.
- **Accessible.** Keyboard navigable, visible focus ring, correct ARIA where needed, semantic HTML.
- **CSP-compliant.** Zero inline event handlers, zero inline `<script>`.
- **PHTML/CSS ↔ preview.html in sync.** Same classes, same DOM, same Alpine directives. `component-reviewer` verified.
- **README present** with Figma node ID, variants, states, and usage snippet.
- **`ui-kit-inventory.md` status flipped to `approved`** by `component-reviewer`.

---

## Repo conventions (stub — fills in as we learn)

- Paths are always relative to the project root unless noted.
- Component folder names match the Hyvä UI kit exactly (e.g. `buttons/A-basic`, `header/A-clean`).
- Variants are letters-plus-slug: `A-basic`, `B-compact`, `C-stacked`.
- Figma node IDs are recorded as `1286:12715` (colon form). Query the MCP with either colon or dash.
- When adding tokens, edit `src/css/theme.css` via `scripts/build-tailwind-config.mjs` only — never hand-edit.
- Questions in `design-tokens/questions.md` are numbered and dated.

---

## Subagent roster

Defined in `.claude/agents/`. Each has its own system prompt that includes these operating principles.

- **`figma-extractor`** — reads Figma MCP. Resolves token names → hex/spacing/radius. Extracts per-node specs.
- **`hyva-component-author`** — knows Hyvä UI 2.7.1. Takes a spec + a kit file and produces the component pair.
- **`token-linter`** — flags arbitrary Tailwind values, raw hex, inline `style`/`onclick`/`<script>`. Reports only; no auto-fix.
- **`component-reviewer`** — final gate. Only this agent flips status in `ui-kit-inventory.md` to `approved`.

---

## Phased workflow

- **Phase 0 (setup):** folders, subagents, tokens, Vite preview, inventory. _(You are here or just past.)_
- **Phase 1 (components):** tweak UI kit components into brand-correct versions, one at a time.
- **Phase 2 (pages):** compose a homepage from approved components.
- **Phase 3 (handoff):** dev team imports the approved files.

---

## Where things live

| Path | What |
|---|---|
| `hyva-ui-reference/` | Read-only symlink to the Hyvä UI 2.7.1 kit. Source of truth for structure. |
| `design-tokens/figma-export.json` | Original export from Figma (token names, no values). |
| `design-tokens/tokens.resolved.json` | Token names resolved to hex/px/etc. via Figma MCP. |
| `design-tokens/tokens.resolved.md` | Human-readable summary of the resolved tokens. |
| `design-tokens/questions.md` | Running log of ambiguities awaiting human answers. |
| `src/css/theme.css` | Tailwind v4 `@theme` block — the actual design token source for all generated code. |
| `src/css/styles.css` | Vite/Tailwind entry. |
| `src/fonts/dm-sans/` | Self-hosted DM Sans woff2 + `fonts.css`. |
| `components/` | Output of Phase 1. One folder per UI kit component. |
| `pages/` | Output of Phase 2. |
| `scripts/build-tailwind-config.mjs` | Reads `tokens.resolved.json`, writes `src/css/theme.css`. |
| `ui-kit-inventory.md` | Burn-down tracker: every kit component + its status. |
| `index.html` | Vite entry / component gallery. |
| `PROJECT_CONTEXT.md` | Pre-existing doc from the live child theme build. Not the source of truth for this POC but useful cross-reference. |

---

## Things NOT to do

- Do not modify anything inside `hyva-ui-reference/` — read-only.
- Do not modify anything inside `app/design/frontend/Phpure/golf/` — that's the live child theme build, separate from this POC.
- Do not fabricate hex, spacing, or any other design token. If the Figma MCP can't resolve it, log it and ask.
- Do not install Magento or attempt to render PHTML. Static previews (`preview.html`) only.
- Do not use Tailwind v3, Alpine v2, or any framework not listed above.
- Do not auto-fix lint violations — `token-linter` reports, humans decide.

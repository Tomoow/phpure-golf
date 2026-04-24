# PHPure Golf — Hyvä UI POC

This folder is a **proof-of-concept** for producing dev-ready Hyvä UI 2.7.1 components and a homepage from a Figma design, using Claude Code. The dev team will import the final output into their own Hyvä theme; nobody runs Magento here.

> Main operating document: [`CLAUDE.md`](./CLAUDE.md). Read it before touching anything.

---

## Run the preview locally

```sh
npm install
npm run dev
```

Vite serves the gallery at `http://localhost:5173/`. Each component's `preview.html` gets its own route once Phase 1 produces it.

To regenerate `src/css/theme.css` from `design-tokens/tokens.resolved.json`:

```sh
npm run tokens:build
```

(Right now this refuses to run because color values haven't finished resolving from the Figma MCP — see "Current blockers" below.)

---

## Where things live

| Path | What |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Operating principles, stack facts, handoff model, definition of done. Source of truth for Claude sessions. |
| [`hyva-ui-reference/`](./hyva-ui-reference) | Symlink to the Hyvä UI 2.7.1 kit (at `/Users/tomlievens/cursor/phpure-golf/hyva-ui/`). **Read-only.** Source of truth for structure. |
| [`design-tokens/figma-export.json`](./design-tokens/figma-export.json) | Raw export from Figma — token names, no values. |
| [`design-tokens/tokens.resolved.json`](./design-tokens/tokens.resolved.json) | Token names resolved to hex / px / css via the Figma MCP. Authoritative. |
| [`design-tokens/tokens.resolved.md`](./design-tokens/tokens.resolved.md) | Human-readable summary of the resolved tokens. Review this before generating theme.css. |
| [`design-tokens/questions.md`](./design-tokens/questions.md) | Running log of open ambiguities. Read before starting any new work. |
| [`src/css/styles.css`](./src/css/styles.css) | Vite + Tailwind v4 entry. |
| [`src/css/theme.css`](./src/css/theme.css) | **Generated** — the `@theme` block. Produced by `scripts/build-tailwind-config.mjs`. Do not hand-edit. |
| [`src/fonts/dm-sans/`](./src/fonts/dm-sans/) | Self-hosted DM Sans (variable font). Matches Google Fonts v17. |
| [`src/js/alpine.js`](./src/js/alpine.js) | Shared Alpine bootstrap for every preview page. |
| [`components/`](./components/) | Phase 1 output — one folder per Hyvä UI component. |
| [`pages/`](./pages/) | Phase 2 output — composed pages. |
| [`scripts/build-tailwind-config.mjs`](./scripts/build-tailwind-config.mjs) | Reads `tokens.resolved.json`, writes `src/css/theme.css`. |
| [`ui-kit-inventory.md`](./ui-kit-inventory.md) | Burn-down tracker: every kit component and its POC status. |
| [`.claude/agents/`](./.claude/agents/) | Subagent definitions (below). |

---

## Subagents

Four specialized agents handle the per-component work. Each has its operating principles embedded in its system prompt.

| Agent | Role | Tools |
|---|---|---|
| [`figma-extractor`](./.claude/agents/figma-extractor.md) | Resolves token names → values; produces per-component specs. Never writes component code. | Figma MCP (read), Write, Read |
| [`hyva-component-author`](./.claude/agents/hyva-component-author.md) | Takes a spec + a kit file and writes the component pair (PHTML/CSS + preview.html + README). | Read, Write, Edit |
| [`token-linter`](./.claude/agents/token-linter.md) | Scans generated code for arbitrary Tailwind values, raw hex, inline `style`/`onclick`/`<script>`. Reports only. | Read, Grep |
| [`component-reviewer`](./.claude/agents/component-reviewer.md) | Final gate. Spec conformance + Hyvä conventions + a11y + CSP + PHTML↔preview sync. Only this agent flips status to `approved`. | Read, Edit, Figma MCP (screenshot) |

---

## Hyvä AI skills

Two official [hyva-themes/hyva-ai-tools](https://github.com/hyva-themes/hyva-ai-tools) skills are consulted by the `hyva-component-author` and `component-reviewer` subagents as authoritative references:

- **`hyva-ui-component`** — variant matrix, dependency graph, README-reading protocol, layout-XML merge rules, `etc/view.xml` configuration pattern.
- **`hyva-alpine-component`** — CSP-compatible Alpine patterns (mandatory for any interactive component: modal, menu, minicart, accordion, gallery, etc.).

The skills live outside this repo — [`.claude/skills/`](./.claude/skills/) is gitignored because it's a symlink to the user's local clone of `hyva-ai-tools`. To bootstrap on a fresh machine:

```sh
git clone https://github.com/hyva-themes/hyva-ai-tools.git ~/hyva-ai-tools
cd /path/to/this/repo
~/hyva-ai-tools/install-hyva-skill.sh hyva-ui-component claude
~/hyva-ai-tools/install-hyva-skill.sh hyva-alpine-component claude
```

The installer auto-detects this project's `.claude/skills/` and symlinks both skills (plus their dependencies). `git pull ~/hyva-ai-tools` updates every installed skill.

The subagent files reference these by their symlinked paths (`.claude/skills/<name>/SKILL.md`). If the symlinks are missing, the subagent will stop and print the install command above.

---

## Phased workflow

- **Phase 0 — setup (current):** folders, subagents, tokens, Vite preview, inventory. This README, `CLAUDE.md`, and `.claude/agents/*` are the output.
- **Phase 1 — components:** tweak the Hyvä UI kit components one at a time. Start with Button (Figma `1286:12715`). Each component is `spec.md` → author-produced files → token-linter → reviewer → flipped to `approved`.
- **Phase 2 — pages:** compose a homepage from approved components (Homepage A or B — pending design lead's pick).
- **Phase 3 — handoff:** dev team imports the `approved` files from `components/` / `pages/` into their Hyvä theme.

---

## Current blockers

1. **Figma MCP — color hex resolution.** The PHPure Golf Figma file must be the **active tab** in Figma Desktop for `get_variable_defs` to resolve. The last run returned null for all 227 colors because the file wasn't open. Reopen and re-run `figma-extractor` in Mode 1.
   - See [`design-tokens/questions.md`](./design-tokens/questions.md) entries 1–6 for the full punch list.
2. **Homepage Figma node.** Phase 2 target not yet designated. Homepage A (`5838:2501`) and Homepage B (`5838:2502`) exist; design lead chooses.
3. **Tailwind v4 vs v3 — resolved.** POC uses v4 to match the Hyvä UI 2.7.1 kit. Documented in `CLAUDE.md`.
4. **Atom vs organism output split — resolved.** Atoms ship as CSS + preview.html; organisms ship as full Magento folder + preview.html.

---

## Notes on design decisions

- **Single font family.** DM Sans is the only font family. Figma uses ITC Avant Garde Gothic Pro and Dejanire Headline — both are remapped. The remapping is recorded in `tokens.resolved.json` under `fontFamilyOverrides`.
- **Icons.** Heroicons.
- **No CDN loads.** Alpine and fonts are bundled / self-hosted. This matches the live theme's CSP stance.
- **Read-only UI kit.** Claude never edits anything inside `hyva-ui-reference/`.

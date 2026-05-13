# Figma source assets — Reviews summary atom (1385:28923)

Extracted 2026-05-13 via `figma-desktop` MCP from PHPure Golf file
(`YlKyhwcdYEa41gK1BSs4AZ`).

## Files in this folder

| File | Source | Notes |
|---|---|---|
| `star-empty-slateBlue200.svg` | Figma asset `17e17ea2218da04040733845c0e2dff69a0856e4.svg` | The empty / track-layer star path. Fill = `#BDCBD6` (Tailwind/Slate Blue/200). |
| `star-filled-champagneBeige700.svg` | Figma asset `320323551f34703a78077bf2d77672eee02df705.svg` | The filled / value-layer star path. Fill = `#BFAB82` (Tailwind/Champagne Beige/700). |

Both SVGs render the **same path** at viewBox `0 0 14 13.3715`. The author should
inline the path once and drive fill via `currentColor` (then layer two copies — empty
underneath, filled clipped on top — to render fractional fills). They are NOT
Heroicons (Heroicons solid `star` ships at viewBox `0 0 20 20` with a different curve).
They are NOT Lucide either (the kit's `product-reviews` uses Lucide `star` at
viewBox `0 0 24 24`). This is a **custom Figma star** path, slightly asymmetrical
(W=14, H=13.3715 — wider than tall by ~5%).

## Variant screenshots

The full canvas screenshot of `1385:28923` (and per-variant screenshots) cannot
be exported as static files from the MCP — the tool returns them as inlined
image responses to the agent. They were inspected during extraction and the
visual evidence is documented in `../spec.md`. The frame canvas (348 × 952 px)
shows all 24 leaves laid out vertically; see spec §3 for the inventory.

For visual comparison during component review, re-run:

```
get_screenshot nodeId=1385:28923            # full frame, all 24 variants
get_screenshot nodeId=1385:29185            # Stars only (base)
get_screenshot nodeId=1385:28922            # Stars + Score + Counter (main use case)
get_screenshot nodeId=1385:30231            # Title + Counter + Stars + Score + Counter (widest)
get_screenshot nodeId=1385:30346            # Empty-state placeholder (rose-500)
```

## Star glyph divergence note for the orchestrator

The PHPure Golf design uses a **custom 5-point star path** (this folder's two
SVGs). Two project conventions might conflict:

1. **CLAUDE.md** says "Icons: Heroicons." Heroicons' `star` (solid 20 or outline
   24) has a recognisably different curve and is square (1:1 aspect). Using
   Heroicons here would visibly diverge from Figma.
2. **The Hyvä UI 2.7.1 kit** (`product-reviews/A-basic/.../list.phtml`) uses
   **Lucide** `star` via `$lucideIcons->starHtml(...)`. Different curve again.

Spec §6 flags this as an open question and recommends inlining the Figma path
(since the design is brand-bespoke and a star glyph is small enough that
shipping one extra path is essentially free). The author will inline the
14 × 13.3715 path into the CSS as a `data:` URL background or as an
`::before`/`::after` pseudo, OR — preferred — as an inline `<svg>` in the
PHTML / preview HTML so `currentColor` works.

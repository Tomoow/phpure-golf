# Figma screenshots — status / A-basic

Reference frames captured 2026-05-13 via `figma-desktop` MCP from the PHPure Golf file (key `YlKyhwcdYEa41gK1BSs4AZ`).

## Parent frame

| File | Figma node | Description |
|---|---|---|
| `00-stock-status-set.png` | `1385:32111` | Full "Stock status" frame — both styles, all 5 status values |

## Coloured-Dot row (Style = Coloured Dot)

| File | Figma node | Variant |
|---|---|---|
| `01-coloured-dot-in-stock.png` | `1385:32068` | In stock |
| `02-coloured-dot-in-stock-count.png` | `1385:32069` | In stock (#) |
| `03-coloured-dot-count-in-stock.png` | `1385:32070` | # in stock |
| `04-coloured-dot-out-of-stock.png` | `1385:32071` | Out of stock |
| `05-coloured-dot-stock-status.png` | `1385:32072` | Stock status (warning / unknown) |

## Icon row (Style = Icon)

| File | Figma node | Variant |
|---|---|---|
| `06-icon-in-stock.png` | `1385:32106` | In stock (Heroicons solid check-circle) |
| `07-icon-in-stock-count.png` | `1385:32107` | In stock (#) (Heroicons solid check-circle) |
| `08-icon-count-in-stock.png` | `1385:32108` | # in stock (Heroicons solid check-circle) |
| `09-icon-out-of-stock.png` | `1385:32109` | Out of stock (Heroicons solid x-circle) |
| `10-icon-stock-status.png` | `1385:32110` | Stock status (Heroicons solid exclamation-circle) |

## How to re-capture

The Figma Desktop MCP returns screenshots inline as base64 images in tool responses; they are not persisted to disk by the `figma-extractor` agent. To save them locally for visual diff, run any of:

```
# In Claude Code / Claude Desktop session:
get_screenshot nodeId=1385:32111   # parent frame
get_screenshot nodeId=1385:32068   # individual variants
…
```

…and right-click → "Save image as" each output, naming per the table above.

Alternatively, use the Figma REST API:

```
curl -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/YlKyhwcdYEa41gK1BSs4AZ?ids=1385:32111,1385:32068,1385:32069,1385:32070,1385:32071,1385:32072,1385:32106,1385:32107,1385:32108,1385:32109,1385:32110&format=png&scale=2"
```

The returned JSON contains signed URLs per node ID — wget each into this folder.

# BloomBot

Scene-centric bot. Flowers are the hero of every render — Garden-of-Eden-times-100,
impossible-beauty, cottagecore-to-cosmic. No character DNA — pure floral aesthetic.

## 6 render paths

| Path | What it is |
|---|---|
| `landscape` | Garden-of-Eden-times-100 dramatic outdoor backdrops (volcanic coasts, glaciers, cliffsides) with a flower species overtaking everything |
| `closeup` | Macro / mid-close frame, flowers are hero. Single bloom, cluster, bouquet-in-vase, stem-in-field |
| `cozy` | Cottagecore INTERIOR scenes — rooms drowning in flowers (farmhouse kitchens, sunny bedrooms, greenhouses, Parisian flower shops) |
| `garden-walk` | Walkable outdoor scenes DIALED TO 10× — paths / trails / hedge tunnels / arbors with impossible bloom density |
| `cosmic` | Alien planet / space / bioluminescent otherworldly flower visuals. Avatar-Pandora, nebula-flora, zero-g blooms |
| `dreamscape` | Surreal earthly flower takeovers — flowers reclaiming pianos, cathedrals, clockwork, sunken ships (Magritte-esque magical realism) |

## Axes rolled per render

Shared:
- `scene_palette` — overall color mood (50 entries, dedup window 5)
- `colorPalette` — secondary lighting keyed to vibe (VIBE_COLOR map)

Path-specific (all 50-entry Sonnet-seeded pools):
- `flower_types` — specific blooms (real + invented) shared across every path
- `lighting` — dramatic lighting direction/quality shared across paths
- `atmospheres` — ambient particle / weather / wildlife elements
- `landscape_settings` — dramatic wide-vista settings
- `closeup_framings` — macro composition strategies
- `cozy_interiors` — cottagecore indoor spaces
- `garden_walks` — walkable outdoor spaces
- `cosmic_scenes` — alien / space contexts
- `dreamscape_contexts` — surreal earthly takeover contexts

## Mediums

Multi-medium: `photography` ×3, `canvas`, `watercolor`, `pencil` — photography weighted 3x since it renders best for floral detail.

## Running

```bash
# Dev batch (no posting)
node scripts/iter-bot.js --bot bloombot --count 5 --mode random --label smoke

# Production (single post)
node scripts/run-bot.js --bot bloombot

# Regenerate any seed pool
node scripts/gen-seeds/bloombot/gen-<name>.js
```

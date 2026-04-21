# CoquetteBot

Mixed bot. Soft pink pastel everything. Cottagecore / princess / fairy /
ballet / Parisian-pastry energy. Every post: "I WANT TO BE HER" / "I WANT TO
LIVE THERE" / "OH MY GOD that's cute." Adult-feminine-pastel lane (vs CuddleBot's
kid-friendly cute). No male figures, no dark, no gritty.

## 6 render paths

| Path | What it is |
|---|---|
| `adorable-creatures` | Tiny cute creatures in pastel settings — big dewy eyes, no clothing focus |
| `cottagecore-scene` | Places girls want to LIVE IN — fairy doors, pink velvet bedrooms, ballet studios, Parisian cafés |
| `pink-nature` | Girliest nature imaginable — cherry-blossom paths, pink peony fields, pastel sunsets |
| `sweet-treats` | Food still-life, ZERO humans. Whimsical cute-animal characters OK as supporting |
| `coquette-fashion` | Human young woman, SOLO, editorial fashion — ribbon-corsets, tulle, pearl-bodices |
| `adorable-couture` | Clothing focal on fantasy character — fairy / princess / cute-animal in gown |

## Axes rolled per render

Shared:
- `scene_palette` — pink-dominant pastel palette
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `adorable_creatures` — fantasy + exaggerated-real creatures with BIG dewy eyes
- `cottagecore_scenes` — fairy-door / pink-velvet bedroom / ballet studio
- `pink_nature_scenes` — cherry blossom / peony / pink sunset
- `whimsical_sweets` — food still-life scenes, no humans
- `coquette_fashion_moments` — solo girl editorial moments
- `coquette_garments` — specific coquette clothing items
- `couture_wearers` — varied fantasy characters wearing couture
- `couture_scenes` — rich couture backdrops
- `cute_accessories` — shared across paths (pearls / ribbons / lace / bows)
- `atmospheres` — pink petal drift / fairy dust / sparkle motes
- `lighting` — golden-hour pastel / candle-warm / fairy-light-twinkle
- `scene_palettes` — pink-dominant pastel palettes

## Shared blocks

- `COQUETTE_ENERGY_BLOCK` — precious / dreamy / romantic / feminine
- `PINK_AND_PASTEL_DOMINANT_BLOCK` — pink always present
- `NO_DARK_NO_EDGY_BLOCK` — no menacing / gritty / cyberpunk
- `NO_HUMANS_IN_SWEETS_BLOCK` — sweets path zero humans
- `STYLIZED_AESTHETIC_BLOCK` — fairytale/watercolor/illustration leaning
- `SOLO_COMPOSITION_BLOCK` — fashion path girl is solo
- `NO_MALE_FIGURES_BLOCK` — never male characters
- `IMPOSSIBLE_BEAUTY_BLOCK` — coquette edition, precious-pretty
- `BLOW_IT_UP_BLOCK` — cuteness amplification within pastel palette

## Mediums

`fairytale`, `watercolor`, `canvas`, `pencil`, `photography`. **vibesByMedium**:
`fairytale` medium pins heavy on `coquette / enchanted / whimsical / shimmer`.

## Running

```bash
node scripts/iter-bot.js --bot coquettebot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot coquettebot
```

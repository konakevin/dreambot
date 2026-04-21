# CuddleBot

Scene-centric bot. Pure CUTE + COZY + CUDDLY. Every post makes girls and kids
go AWWW. Stylized ONLY — never photoreal (that's AnimalBot's job). Pixar /
Sanrio / Totoro-warmth energy. No humans.

## 5 render paths

| Path | What it is |
|---|---|
| `heartwarming-scene` | One adorable creature doing something heart-melting (fox-pup with leaf-umbrella, tiny dragon with book) |
| `cozy-landscape` | Miniature cozy worlds (mushroom villages, acorn cottages, pillow-fort forests, firefly glens) |
| `plushie-life` | Plushies alive Toy-Story-style (tea parties, movie nights, pillow-fort camping) |
| `creature-portrait` | Tight closeup of impossibly cute creature with storybook-illustration detail |
| `tiny-animal-friends` | Small creature pair/group warmth moments |

## Axes rolled per render

Shared:
- `scene_palette` — warm cozy storybook palette
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `cute_creatures` — fantasy cute + exaggerated real
- `heartwarming_activities` — picnics / tea / reading / napping
- `cozy_miniature_worlds` — tiny cozy settings
- `plushie_scenes` — plushie-alive warm activities
- `portrait_features` — dewy eyes / fluff / whiskers / sparkles
- `tiny_friendships` — pair/group warmth moments
- `atmospheres` — soft particles / fairy dust / petals / firefly-glow
- `lighting` — warm amber / storybook-soft / candle-lit / firefly-glow
- `scene_palettes` — warm pastel / cozy autumn / Sanrio-pastel / storybook-warm

## Shared blocks

- `CUTE_CUDDLY_COZY_BLOCK` — every render must trigger AWW
- `STYLIZED_NOT_PHOTOREAL_BLOCK` — never photoreal
- `NO_DARK_NO_INTENSE_BLOCK` — warm + bright + safe + wholesome
- `NO_PEOPLE_BLOCK` — no humans
- `IMPOSSIBLE_BEAUTY_BLOCK` — storybook edition, cute-beautiful
- `BLOW_IT_UP_BLOCK` — cuteness amplification

## Mediums

Stylized only: `animation`, `claymation`, `storybook`, `watercolor`,
`handcrafted`, `illustration`, `fairytale`, `anime`, `pencil`, `canvas`.
**BANNED:** photography, vaporwave, lego, pixels, render, comics.

## Running

```bash
node scripts/iter-bot.js --bot cuddlebot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot cuddlebot
```

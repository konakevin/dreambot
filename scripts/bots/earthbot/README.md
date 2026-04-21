# EarthBot

Scene-centric bot. EARTH ONLY. Every render is a theoretically plausible earthly
location dialed to 10× in drama, saturation, lighting, weather, composition —
but always within Earth's actual physics. National-Geographic-cover × 10.
Zero fantasy, zero cosmic, zero physics-defying. No humans, no animal subjects
(AnimalBot's job).

## 5 render paths

| Path | What it is |
|---|---|
| `vista` | Epic wide-scale Earth panoramas — Patagonian peaks, Icelandic coasts, Saharan dunes, Hawaiian lava, alpine valleys |
| `hidden-corner` | Intimate discovery tight-frame — fern grottos, moss streams, tide pools, forest clearings |
| `weather-moment` | Earth weather dialed up at ground level — aurora on ice, supercells, fog-in-redwoods, monsoon, blood-moon |
| `cozy-nature` | Warm inviting "I want to BE here" nature — sun-dappled clearings, willow rivers, pine trails |
| `sky` | Sky-IS-subject atmospheric phenomena — aurora, supercell structure, mammatus, Milky-Way arc, sun-dog, noctilucent clouds |

## Axes rolled per render

Shared:
- `scene_palette` — Earth-rooted overall color mood (50 entries)
- `colorPalette` — secondary lighting keyed to vibe (VIBE_COLOR map)

Path-specific (all 50-entry Sonnet-seeded pools):
- `earth_vistas` — epic Earth panoramas
- `hidden_earth_corners` — intimate Earth-nature discovery spots
- `earth_weather_phenomena` — ground-level weather events
- `cozy_earth_scenes` — warm inviting Earth-nature
- `sky_phenomena` — sky-IS-subject atmospheric spectacles
- `atmospheres` — Earth-plausible particles/mist/dust/snow
- `time_of_day` — light-cycle moments with atmospheric detail
- `biomes` — specific Earth biomes

## Shared blocks

- `EARTH_ONLY_BLOCK` — NON-NEGOTIABLE: no fantasy, no cosmic, no physics-defying
- `NATURE_IS_HERO_BLOCK` — land/sky/weather is subject
- `NO_PEOPLE_BLOCK` + `NO_WILDLIFE_BLOCK` — no human figures AND no animal subjects
- `IMPOSSIBLE_BEAUTY_BLOCK` — dialed to apex, wall-poster quality
- `DRAMATIC_LIGHTING_BLOCK` — named specific light treatments
- `BLOW_IT_UP_BLOCK` — stack weather/atmosphere, saturate, embellish within Earth physics

## Mediums

Photography-leaning: `photography`, `canvas`, `watercolor`, `pencil`.

## Running

```bash
# Dev batch (no posting)
node scripts/iter-bot.js --bot earthbot --count 5 --mode random --label smoke

# Production (single post)
node scripts/run-bot.js --bot earthbot

# Regenerate any seed pool
node scripts/gen-seeds/earthbot/gen-<name>.js
```

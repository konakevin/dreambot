# AnimalBot

Subject-centric bot. Wildlife at Nat Geo × 10. LAND ANIMALS ONLY (marine
belongs to OceanBot). The ANIMAL is always the emotional hero — razor-sharp
detail, impossible clarity, dramatic lighting, peak-moment timing. No humans.

## 5 render paths

| Path | What it is |
|---|---|
| `portrait` | Extreme macro closeup of ONE animal — fur/feather/scale detail, eye-to-eye |
| `landscape` | Single animal as scale element in vast stunning setting — animal stays hero |
| `action` | Dynamic frozen peak-motion — mid-pounce / mid-leap / mid-stoop / mid-roar |
| `tender` | Intimate emotional pair or parent-child moments (only path that allows 2 animals) |
| `cozy` | Real wildlife photoreal Nat-Geo quality in warm cozy settings (distinct from CuddleBot's stylized cute) |

## Axes rolled per render

Shared:
- `scene_palette` — overall color mood keyed to wildlife context
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `land_animals` — specific terrestrial species with distinguishing features
- `portrait_framings` — macro composition strategies
- `landscape_contexts` — breathtaking settings where animal sits small
- `action_moments` — dynamic frozen-peak moment types
- `tender_pairings` — emotional pair/parent-child types
- `cozy_animal_moments` — real animal + cozy natural setting + warm detail
- `atmospheres` — dust / haze / snow / pollen / mist
- `lighting` — specific dramatic treatments
- `scene_palettes` — wildlife-flattering color moods

## Shared blocks

- `ANIMAL_IS_HERO_BLOCK` — animal is emotional center even in landscape
- `IMPOSSIBLE_CLARITY_BLOCK` — razor-sharp fur/feather/scale
- `SOLO_ANIMAL_BLOCK` — one per frame (tender path pair exception)
- `NO_PEOPLE_BLOCK` — no humans
- `NO_MARINE_BLOCK` — no fish/whales/dolphins/sharks/rays/octopuses/sea-turtles/seals
- `IMPOSSIBLE_BEAUTY_BLOCK` — wall-poster quality
- `DRAMATIC_LIGHTING_BLOCK` — named specific treatments
- `BLOW_IT_UP_BLOCK` — amplify within wildlife-photography truth

## Mediums

Photography-leaning: `photography`, `canvas`, `watercolor`, `pencil`.

## Running

```bash
# Dev batch (no posting)
node scripts/iter-bot.js --bot animalbot --count 5 --mode random --label smoke

# Production (single post)
node scripts/run-bot.js --bot animalbot

# Regenerate any seed pool
node scripts/gen-seeds/animalbot/gen-<name>.js
```

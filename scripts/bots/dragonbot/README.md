# DragonBot

Mixed scene/character bot. High-fantasy magical worlds. LOTR / GoT /
Harry-Potter / Elden-Ring / Witcher / Warhammer-concept-art energy. Every
render: RICH magical feeling, theatrical lighting, mythic production value.
**Landscape is the flagship path** — stunning fantasy-world art is the bot's
core offering. Characters by role only.

## 6 render paths

| Path | What it is |
|---|---|
| `landscape` ⭐ FLAGSHIP | Stunning fantasy-world vistas + castles + ruins + mythic cities (no characters) |
| `fantasy-scene` | Character in rich magical-atmospheric scene — wizard at cliff, ranger in forest |
| `epic-moment` | Charged narrative moment — battle-charge, spell-cast, coronation, siege-assault |
| `dragon-scene` | Dragon as hero — coiled on hoard, in flight, sleeping in volcanic cave |
| `magic-moment` | ARCANE MAXIMALISM — 4-5 magical elements layered per scene, scene responds to magic |
| `cozy-arcane` | Cozy fantasy places — Hobbiton hearth, elven tea-garden, fae-glen, glowing-moss creek |

## pathWeights

Landscape weighted 3x (flagship). Fantasy-scene, dragon-scene, cozy-arcane at 2x.
Epic-moment + magic-moment at 1x.

## Axes rolled per render

Shared:
- `scene_palette` — epic-fantasy color mood
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `fantasy_characters` — by role (wizard/ranger/mage/knight/druid/paladin)
- `fantasy_landscapes` — flagship: castles/floating-islands/ruins/elven-forests
- `epic_moments` — charged narrative beats
- `dragon_types` — specific dragons (western/eastern/wyvern/ancient/crystal)
- `arcane_phenomena` — LAYERED 4-5-element magical scenes
- `cozy_arcane_settings` — inhabited + natural-with-magical-wildlife
- `architectural_elements` — castles/towers/temples/bridges/gates/thrones
- `atmospheres` — god-rays/swirling-mist/floating-embers/dragon-smoke
- `lighting` — cinematic fantasy (golden-hour, blue-hour, lantern, dragon-fire)
- `scene_palettes` — rich-earth/moody-storm/golden-dusk/arcane-violet

## Shared blocks

- `EPIC_FANTASY_BLOCK` — LOTR/GoT/Harry-Potter concept-art quality
- `MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK` — every render has magical feeling
- `PAINTERLY_ILLUSTRATION_BLOCK` — canvas/watercolor/illustration/pencil only
- `NO_NAMED_CHARACTERS_BLOCK` — archetypes only, no IP names
- `CINEMATIC_COMPOSITION_BLOCK` — movie-shot framing
- `IMPOSSIBLE_BEAUTY_BLOCK` — book-cover quality
- `BLOW_IT_UP_BLOCK` — Peter-Jackson-concept-art × 10
- `ARCANE_MAXIMALISM_BLOCK` — magic-moment path only (4-5 elements stacked)
- `WARM_QUIET_MAGIC_BLOCK` — cozy-arcane path only (tame + peaceful)

## Mediums

Painterly: `canvas`, `watercolor`, `illustration`, `pencil`.

## Running

```bash
node scripts/iter-bot.js --bot dragonbot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot dragonbot
```

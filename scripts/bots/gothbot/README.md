# GothBot

Mixed scene/character bot. Hauntingly beautiful dark fantasy. Castlevania /
Bloodborne / Dark-Souls / Elden-Ring / Tim-Burton / Crimson-Peak / Berserk /
gothic-fairy-tale energy. Elegant darkness — unsettling but gorgeous.
Characters by role only. **banPhrases:** `jack skellington`, `nightmare before
christmas` (auto-retries Sonnet).

## 6 render paths

| Path | What it is |
|---|---|
| `dark-scene` | Character in gothic setting — knight in crimson ballroom, cursed priest at altar |
| `dark-landscape` | Pure gothic landscape — haunted castle, foggy cemetery, blood-moon forest |
| `horror-creature` | Dark-fantasy creature as hero — werewolf, vampire, demon, wraith, wendigo |
| `goth-woman` | Exquisitely beautiful goth-hellspawn woman, solo, with unique dark accessory |
| `castlevania-scene` | Castlevania-game-art/Bloodborne/Berserk aesthetic scenes |
| `cozy-goth` | Cozy dark-fantasy pockets — candlelit library, witch's apothecary, rain-window grimoire |

## Axes rolled per render

Shared:
- `scene_palette` — gothic color mood
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `dark_characters` — knight / cursed-priest / gothic-noble / warlock / blood-hunter
- `gothic_landscapes` — haunted castles / cemeteries / cathedral ruins
- `dark_creatures` — werewolf / vampire / demon / wraith / wendigo / lich
- `goth_woman_accessories` — horns / crown / chains / wings / veil / thorns / antlers
- `castlevania_contexts` — cathedral / courtyard / stained-glass / crypt
- `cozy_goth_settings` — candlelit-library / gothic-bedroom / apothecary
- `atmospheres` — fog / rain / bats / ravens / candles-flicker
- `lighting` — chiaroscuro / moonlight / candle / stained-glass / lightning
- `scene_palettes` — deep purple / crimson / midnight black / oxblood

## Shared blocks

- `ELEGANT_DARKNESS_BLOCK` — haunting beauty, never gory
- `NO_JACK_SKELLINGTON_BLOCK` — engine enforces banned phrases
- `NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK` — atmospheric dread only
- `PAINTERLY_ILLUSTRATION_BLOCK` — rich ornate detail
- `NO_NAMED_CHARACTERS_BLOCK` — archetypes only
- `CINEMATIC_COMPOSITION_BLOCK` — movie-shot framing
- `SOLO_COMPOSITION_BLOCK` — character paths
- `IMPOSSIBLE_BEAUTY_BLOCK` — hauntingly-beautiful
- `BLOW_IT_UP_BLOCK` — Castlevania production-art × 10

## Mediums

Painterly/illustrated: `canvas`, `anime`, `comics`, `illustration`, `pencil`.

## Running

```bash
node scripts/iter-bot.js --bot gothbot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot gothbot
```

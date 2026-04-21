# TitanBot

Mixed bot. Mythology across ALL world pantheons at epic scale. Gods, titans,
deities, mythic battles, legendary landscapes, gnarly creatures, sexy mythic
women, cozy mythic places. Renaissance-painting × concept-art production.
Characters by role + pantheon, never named.

## 6 render paths

| Path | What it is |
|---|---|
| `deity-moment` | God/titan in divine-action moment — thunder-god mid-thunderbolt, death-god weighing soul |
| `mythological-landscape` | Sacred mythic realm, no characters — Olympus, Valhalla, Avalon, Mictlan |
| `epic-battle` | Cosmic-scale mythic battle — gods-vs-giants, titan-fall, hero-vs-monster |
| `mythic-creature` | GNARLY visceral mythic creatures — Hydra, Medusa, Minotaur, Kraken, Leviathan |
| `mythic-women` | Any mythic female in candid unsuspecting moment — sexy + cool via candid voyeuristic framing |
| `cozy-mythic` | Warm quiet mythic pockets — Greek symposium, Japanese tea-house, fae-glen, sacred grove |

## Axes rolled per render

Shared:
- `scene_palette` — mythic palette
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `deities` — god/titan archetypes across pantheons
- `pantheons_and_regalia` — cultural anchors + signature regalia
- `mythological_landscapes` — specific mythic-realm landscapes
- `epic_battles` — cosmic-battle setups
- `mythic_creatures` — GNARLY reimagined creatures
- `mythic_women_candid_moments` — any mythic female in candid action
- `cozy_mythic_settings` — inhabited + natural cozy-mythic
- `atmospheres` — divine phenomena (golden-dust, star-fall, divine-mist)
- `lighting` — divine lighting (god-rays, golden-corona, temple-candlelight)
- `scene_palettes` — mythic color moods (golden-god, blood-crimson, jade-and-turquoise)
- `architectural_elements` — mythic architecture (marble temple, ziggurat, pagoda)

## Shared blocks

- `MYTHIC_SCALE_BLOCK` — cosmic scale, gods 100-ft-tall
- `PANTHEON_DIVERSITY_BLOCK` — rotate across ALL world mythologies
- `NO_NAMED_DEITIES_BLOCK` — by role + pantheon + domain only
- `RENAISSANCE_CONCEPT_ART_BLOCK` — painterly grandeur
- `IMPOSSIBLE_BEAUTY_BLOCK` — mythic-sublime
- `BLOW_IT_UP_BLOCK` — book-cover × classical-oil × 10
- `MYTHIC_WOMAN_CANDID_BLOCK` — mythic-women path only (voyeuristic candid)
- `WARM_MYTHIC_BLOCK` — cozy-mythic path only (peaceful inhabited/natural)

## Mediums

`canvas`, `photography`, `render`.

## Running

```bash
node scripts/iter-bot.js --bot titanbot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot titanbot
```

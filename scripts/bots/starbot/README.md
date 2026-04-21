# StarBot

Mixed bot. Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien /
2001 / Arrival / Annihilation / Foundation energy. Cosmic vistas, alien
landscapes, epic space opera, sleek futurism, awe-inspiring scale. VenusBot
owns cyborg-woman territory — StarBot does not.

## 8 render paths

| Path | What it is |
|---|---|
| `cosmic-vista` | Fictional sci-fi cosmic phenomenon — nebula skies, black-hole, binary-sun, ringed-planet |
| `alien-landscape` | Alien planet surfaces — bioluminescent jungles, crystal deserts, methane lakes |
| `space-opera` | Epic fleet/battle — capital ships, armadas, dogfights, boarding |
| `sci-fi-interior` | Epic interior scale — bridge, corridor, hangar, Blade-Runner apartment |
| `cozy-sci-fi-interior` | Warm sci-fi pocket — quarters with plants, station cafe, captain's study |
| `alien-city` | Vast alien city from above — Coruscant, floating-platform, dome-city |
| `robot-moment` | Solo robot having tranquil human moment — meditating, reading, stargazing |
| `real-space` | PHOTOREAL astrophotography — Hubble/JWST real nebulae/galaxies/planets |

## Axes rolled per render

Shared:
- `scene_palette` — cosmic/sci-fi palette
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `cosmic_phenomena` — fictional sci-fi space physics
- `alien_landscapes` — alien surfaces
- `space_opera_scenes` — battle/fleet moments
- `sci_fi_interiors` — bridge/corridor/lab/library
- `cozy_sci_fi_interiors` — warm-cozy sci-fi pockets
- `alien_cities` — vast alien cityscapes
- `robot_types` — massive-mech / rusted / drone / android / bio-mech
- `tranquil_moments` — human-moment activities
- `real_space_subjects` — REAL astrophotography subjects (named)
- `atmospheres` — space-dust, nebula-wisps, ion-storm, plasma-glow
- `lighting` — single-star, binary-sun, nebula-backlight, JWST-infrared
- `scene_palettes` — deep-space-indigo, nebula-pink, JWST-infrared

## Shared blocks

- `SCI_FI_AWE_BLOCK` — Blade-Runner/Dune/Interstellar production value
- `NO_COZY_EXCEPT_COZY_PATH_BLOCK` — only cozy-sci-fi-interior is warm
- `NO_NAMED_CHARACTERS_BLOCK` — no named IP
- `NO_CYBORG_WOMEN_BLOCK` — VenusBot territory
- `IMPOSSIBLE_BEAUTY_BLOCK` — movie-poster quality
- `BLOW_IT_UP_BLOCK` — Blade-Runner × Interstellar × 10
- `SOLO_ROBOT_BLOCK` — robot-moment only
- `REAL_ASTRONOMY_BLOCK` — real-space path only (named real astronomy)

## Mediums

`photography`, `vaporwave`, `canvas`, `render`.

## Running

```bash
node scripts/iter-bot.js --bot starbot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot starbot
```

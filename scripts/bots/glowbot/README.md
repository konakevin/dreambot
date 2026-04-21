# GlowBot

Scene-centric bot. LIGHT IS THE HERO. Every render emotionally carried by the
light itself. Pandora-bioluminescent energy + Ghibli/Narnia/Rivendell soft-sacred
luminance. Viewer should feel RELAXED / AWE-INSPIRED / AT PEACE purely from how
the light lands. Zero characters, zero menace. Overlap with BloomBot is OK —
BloomBot's hero is flowers, GlowBot's is light.

## 4 render paths

| Path | What it is |
|---|---|
| `luminous-landscape` | Earthly landscapes where LIGHT is the soul — sun through mist, aurora on lake, golden-hour mountains, moonlit meadows |
| `ethereal-scene` | Ghibli/Narnia/Rivendell soft-magical scenes — floating islands, cloud palaces, divine staircases, moss-draped temples |
| `divine-moment` | Sacred-light FOCAL scenes — single sunbeam, firefly pillar, glowing doorway at twilight, shaft through broken cathedral ceiling |
| `dreamscape` | Pandora-bioluminescent otherworldly — glowing moss, crystalline forests, lakes of inner-glow, glowing-wildflower hillsides |

## Axes rolled per render

Shared:
- `scene_palette` — overall color mood (50 entries)
- `colorPalette` — secondary lighting keyed to vibe (VIBE_COLOR map)

Path-specific (all 50-entry Sonnet-seeded pools):
- `landscape_settings` — earthly landscapes for luminous-landscape
- `ethereal_scenes` — Ghibli/Narnia/Rivendell floating realms
- `divine_moments` — sacred focal events
- `dreamscape_contexts` — bioluminescent otherworldly
- `light_treatments` — specific light phenomena (god-rays / aurora / firefly / moss-glow)
- `emotional_tones` — explicit peaceful-awe target per render
- `atmospheres` — mist / pollen-motes / drifting-leaves / pearlescent-fog
- `architectural_elements` — shared across paths (temples/arches/bridges/portals/stairs)

## Shared blocks

- `LIGHT_IS_HERO_BLOCK` — replaces standard dramatic-lighting, enforces light-as-emotional-subject
- `AWE_AND_PEACE_BLOCK` — non-negotiable relaxed/awe-inspired/peaceful emotional read
- `NO_HARSH_DARK_FIERCE_BLOCK` — no menace, no threat, no aggressive lighting
- `NO_PEOPLE_BLOCK` — no humans (wildlife OK as peripheral scale)
- `IMPOSSIBLE_BEAUTY_BLOCK` — wall-poster / phone-wallpaper quality
- `BLOW_IT_UP_BLOCK` — stack layered luminance, max saturation within peaceful-awe

## Mediums

Stylized/painterly only: `watercolor`, `canvas`, `illustration`, `pencil`. No
photography — photorealism fights the sacred-luminance vibe.

## Running

```bash
# Dev batch (no posting)
node scripts/iter-bot.js --bot glowbot --count 5 --mode random --label smoke

# Production (single post)
node scripts/run-bot.js --bot glowbot

# Regenerate any seed pool
node scripts/gen-seeds/glowbot/gen-<name>.js
```

# MangaBot

Mixed scene/character bot. Japanese culture + anime aesthetic full spectrum.
Ghibli / Shinkai / Demon Slayer / Mononoke / Akira / Ghost in the Shell +
traditional Japan + mythology + Neo-Tokyo cyberpunk. Hand-drawn anime
illustration quality. Characters by role only (never named IP).

## 7 render paths

| Path | What it is |
|---|---|
| `anime-scene` | Classic anime scene with character-by-role — modern/traditional/mythic mix |
| `anime-landscape` | Pure Japanese environment — shrines, rice paddies, bamboo, torii, Edo streets |
| `mythological-creature` | Japanese mythological being as hero — kitsune, yokai, oni, tengu, ryujin |
| `cozy-anime` | Ghibli-warm heartwarming moments — Totoro/Ponyo/Kiki energy |
| `kawaii` | Explicit CUTE — chibi, big-eye, magical-girl, sparkle-heavy, shoujo |
| `slice-of-life` | Quiet daily anime — Shinkai 5cm-per-second melancholy-warmth |
| `neo-tokyo` | Cyberpunk Japan future — Blade-Runner-meets-Akira neon-rain |

## Axes rolled per render

Shared:
- `scene_palette` — anime-characteristic palette
- `colorPalette` — secondary lighting keyed to vibe

Path-specific (all 50-entry Sonnet-seeded pools):
- `anime_characters` — by role only, full spectrum
- `japanese_landscapes` — shrines/rice/bamboo/Edo/mountain
- `mythological_beings` — specific yokai/kami/creature types
- `cozy_anime_moments` — Ghibli-warm vignettes
- `kawaii_moments` — chibi + magical-girl + sparkle-cute
- `slice_of_life_moments` — quiet daily anime
- `neo_tokyo_settings` — cyberpunk-Japan locations
- `cultural_elements` — torii/paper-lanterns/tanabata/masks
- `atmospheres` — petal-rain/firefly/rain/fog/spirit-wisps
- `lighting` — Shinkai-sunset/Ghibli-dappled/Akira-neon
- `character_details` — anime-character visual vocabulary

## Shared blocks

- `ANIME_AESTHETIC_BLOCK` — Ghibli/Shinkai hand-drawn, never photoreal or 3D
- `NO_NAMED_CHARACTERS_BLOCK` — by role only, no IP names
- `CULTURAL_RESPECT_BLOCK` — authentic respectful Japanese rendering
- `IMPOSSIBLE_BEAUTY_BLOCK` — anime-movie-cover frame-worthy quality
- `BLOW_IT_UP_BLOCK` — stack drama + culture + lighting

## Mediums

Single medium: `anime`. **vibesByMedium** pins anime heavy on
`enchanted / cinematic / epic / ethereal / whimsical / arcane`.

## Running

```bash
node scripts/iter-bot.js --bot mangabot --count 5 --mode random --label smoke
node scripts/run-bot.js --bot mangabot
```

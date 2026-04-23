#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/scene_girls_lighting.json',
  total: 30,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CINEMATIC LIGHTING + HUE + SHADOW compositions for GothBot's scene-girls path — gothic scenes with a dark-fantasy woman caught mid-action in a richly detailed gothic environment. Each entry describes ONE dramatic atmospheric lighting setup.

Each entry: 25-40 words. Specifies KEY LIGHT (hue + direction + quality) + FILL / RIM / BOUNCE (counter hue) + SHADOW behavior + ATMOSPHERIC DETAIL (particles, mist, god rays, etc.).

━━━ DEDUP MANDATE ━━━
Across 30 entries, rotate every dimension aggressively. Max ~3-4 entries per hue family.

━━━ LIGHTING DIMENSIONS TO ROTATE ━━━

**KEY LIGHT HUE** — rotate:
- Warm: amber candle / torch orange / forge ember / alchemist gold / crimson hearth-glow / firelight-honey
- Cool: moonlit silver / twilight violet / cold sapphire / steel blue / ice cyan / pre-dawn indigo / cathedral blue
- Specialty / arcane: witch-fire emerald / fel-violet / poison-green / crimson-stained-glass / blacklight UV / opalescent-iridescent / pink-moon-glow / necromantic sapphire-white
- Natural/rare: storm-lightning flash / sunset-crimson / dawn-rose / aurora-green

**KEY LIGHT DIRECTION** — rotate:
- Low-right / low-left underlight
- Directly above top-down
- Rembrandt 45 from top-right or top-left
- Side hard-light (left or right)
- Rim-backlight from behind
- God-rays streaming through window
- Below uplight (dramatic chilling)
- Candle-by-the-face flickering close
- Firelight from hearth at mid-distance
- Overhead chandelier or candelabra

**FILL / RIM / BOUNCE** — always a secondary hue for temperature contrast. If key is warm, fill/rim is cool. If cool, warm. If specialty, warm or cool counter.

**SHADOW BEHAVIOR** — shadows are colored, never flat-neutral-gray:
- Cool violet shadow pockets
- Deep indigo cast shadows
- Plum purple ambient shadows
- Obsidian-black with subtle blue-tint
- Warm umber shadow from firelight
- Emerald-tinted shadow (near witch-fire)
- Deep teal cathedral shadow

**ATMOSPHERIC DETAIL** — always specify ONE:
- Volumetric fog / god rays through windows
- Floating embers or sparks drifting
- Drifting mist / breath-fog
- Dust motes caught in key beam
- Magical particles floating
- Stained-glass colored light patches
- Rain-streaked window with water refraction
- Firelight flicker wobble
- Candle smoke curling
- Distant lightning flash

━━━ TONE ANCHORS ━━━
Castlevania-game-art cinematic, Crimson-Peak Mario-Bava gothic painterly, Bloodborne dim cathedral glow, Interview-with-the-Vampire candlelit, Van-Helsing film-still chiaroscuro. Deep tenebrism. Dramatic. Atmospheric. Painterly-realism quality.

━━━ WRITING EXAMPLES (style target) ━━━
"Warm amber candle key-light from low-right casting upward shadow across her cheekbone, cool violet moonlight spilling through a tall window behind as rim-light, deep indigo pocket-shadows in the far corners, volumetric god-rays catching drifting dust motes"

"Cold sapphire moonlight streaming through stained-glass as key-light casting crimson-blue shards across the scene, warm firelight flicker from an unseen hearth as secondary fill, emerald-tinted shadow where witch-fire burns on a distant altar, floating ember motes drifting upward"

"Witch-fire emerald green glow from a ritual circle as key-light painting her face ghostly, cool steel-blue ambient spill from high stained-glass above, deep obsidian-black shadows beyond the circle, magical particles swirling up toward the vaulted ceiling"

"Rembrandt 45-degree amber candelabra light from top-right carving sharp cheekbone shadow, pink-moon-glow rose-light from a tall arch-window as fill catching her opposite cheek, plum-purple cast-shadows on the stone floor, drifting mist pooling low"

"Warm torch-orange flicker from a wall-sconce at mid-distance, cold crimson-stained-glass shaft from above-left casting blood-red patches across her cloak, deep teal cathedral shadows in the pillars behind her, faint breath-fog visible in the chill air"

━━━ HARD RULES ━━━
- 25-40 words per entry
- Every entry names: key hue + direction, fill/rim counter hue, shadow color, one atmospheric detail
- TWO distinct temperature hues minimum per entry (no flat single-color cast)
- Character-agnostic — don't describe her, just the lighting (path brief describes her)

━━━ BANNED ━━━
- NO "ring light" / "studio light" / "softbox" / "key light at 45 to camera" (these read as magazine-editorial)
- NO flat HDR lighting / flat magazine-beauty-light
- NO named photographer (Steven-Meisel, Annie-Leibovitz, etc.)
- NO modern neon / electric signs / fluorescents

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
/**
 * DRAGON_SCENE_ACTION — Mid-action cinematic moment pool.
 *
 * The dragon CAUGHT in a single cinematic beat. Action only — the
 * dragon's identity comes from DRAGON_SCENE_DRAGON, the stage from
 * DRAGON_SCENE_LANDSCAPE. Action describes what the dragon is doing
 * RIGHT NOW + how its body is configured in the beat.
 *
 * Mirrors existing 30-entry format: "<ACTION CAPS> — body text describing
 * the freeze-frame moment in painted-fantasy-cover detail."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_scene_action.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} DRAGON ACTION descriptions for DragonBot's dragon-scene path — single cinematic freeze-frame moments showing what the dragon is doing RIGHT NOW. Frazetta / Brom / Vallejo / Hildebrandt / Whelan painted-fantasy-novel cover register. LOTR / GoT / Elden Ring / Skyrim energy.

Each entry: 20-35 words. Format EXACTLY: \`<ACTION TITLE CAPS> — <body describing the configured pose + a SECONDARY beat that sells the moment (debris, lit air, displaced cloud, splintered stone, ground-shadow, etc.)>.\`

━━━ THE FRAME — ACTION + BODY CONFIGURATION ONLY ━━━

Each entry describes:
1. The PRIMARY action verb (banking / striking / roaring / launching / landing / clutching / etc.)
2. The dragon's BODY CONFIGURATION in that beat (wings half-furled / forelegs braced / tail whipping / jaw distended)
3. A SECONDARY effect that proves the action's force (dust erupting / wingtip-vortices flattening trees / shockwave / debris / sparks)

NEVER the dragon's identity (no scale color, no horn pattern — that's the dragon pool). NEVER the location (no "in the canyon", no "on the mountain" — that's the landscape pool). But a generic stage word ("cliff", "ledge", "tower", "ground", "treetop") is fine when the action requires it.

━━━ VARIETY MANDATE — distribute across these 10 action categories (~20 per category) ━━━

1. AERIAL APEX (banking / climbing / diving / wing-over / hammer-stall / vertical climb / barrel-roll) — wings doing the work
2. BREATH WEAPON (fire-cone / frost-blast / lightning-arc / acid-spray / shadow-breath / molten-slag) — throat luminous, jaw distended
3. LAUNCH / LANDING (lifting off / touching down / heavy impact / talon-grip-on-stone) — ground reaction
4. PERCH / TERRITORIAL DISPLAY (atop spire / cliff promontory / tower / standing-stone) — wings mantled / fanned / half-furled
5. ROAR / BELLOW / CHALLENGE — head thrown back / jaw distended / chest expanded / throat lit
6. STRIKE / CLAW / TAIL-LASH — combat beat with debris, shockwave, ground-explosion
7. EMERGENCE (from cave / from cloud / from water / from forest canopy / from cliff-mouth) — half-revealed silhouette
8. GLIDE / HOVER / STALL — wings fully extended, hold a beat in mid-air
9. COILED / GUARDING (around hoard / over kill / around egg / around rider's tower) — body wrapped, head raised in vigilance
10. ARCANE / RUNE-INFUSED MOMENT (wings ringed in glyph-light / breath-attack with rune-flame / breath-circle activating mid-blast) — magic moment WITH action

━━━ THE LANGUAGE PATTERN — mirror these existing entries' register ━━━

GOOD examples already in the pool (vary strongly from them):
  • "MID-ROAR — Ancient dragon perched atop crumbling obsidian tower, jaw distended impossibly wide, throat luminous with gathering fire-orange glow about to erupt."
  • "BANKING IN FLIGHT — Cobalt-scaled dragon rolling through steep spiral dive, wings tilted seventy degrees, wingtip-feathers brushing canyon wall, tail streaming behind like comet-tail."
  • "EMERGING FROM CAVE — Dragon's horned skull and muscular forelegs emerging from vertical cave-mouth in cliff-face, eyes glowing molten-gold, illuminating limestone stalactites in mouth-entrance."
  • "TAIL LASHING — Dragon coiled on arena floor, tail whipping in blurred arc toward coliseum wall, stone exploding from impact, gladiators diving for cover."

Notice: the body names the EXACT geometric configuration + a SECONDARY moment that sells the force.

━━━ BANS ━━━

- NO eating / feeding / devouring / gnawing / chewing prey carcasses (Kevin's rule — gross / off-brand)
- NO named IP dragons (Smaug, Drogon, Vermithor, Alduin, Toothless)
- NO scale-color identity language (no "obsidian", no "frost-rimed", no "verdigris" — that's the dragon pool)
- NO "majestic / fearsome / mighty / awesome / breathtaking" filler — name SPECIFIC body geometry
- NO posing-for-the-camera language — these are candid mid-action freeze-frames
- NO action verb repeats across entries — every entry has a distinct primary verb or distinct combination
- NO cute / cartoon / chibi / Disney

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, no markdown. Each string starts with \`<ACTION TITLE CAPS> — \` and is a single sentence.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

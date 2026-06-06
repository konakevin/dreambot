#!/usr/bin/env node
/**
 * PIXELBOT_EPIC_VISTA_SKY_OR_BACKDROP — 16-bit side-scrolling parallax-vista
 * backdrop sky layer. DITHERED color-bands stepping from the hard pixel-edge
 * horizon. FF6 airship-flyover / Chrono Trigger / Lufia II / Castlevania IV
 * background-vistas / DKC backgrounds / Sonic 2/3 horizons.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_epic_vista_sky_or_backdrop.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SKY-OR-BACKDROP entries for PixelBot's epic-vista path — far-backdrop sky/space layer for 16-bit side-scrolling parallax vistas (FF6 airship-flyover, Chrono Trigger world-map, Lufia II overworld, Castlevania IV background-vistas, DKC backgrounds, Sonic 2/3 horizons). DITHERED color-bands stepping from the hard pixel-edge horizon upward. Title-caps prefix THEN " — " separator THEN description.

━━━ THE BAR ━━━
Every entry is ONE specific sky / backdrop layer at the FAR PARALLAX DISTANCE. Specifies:
- COLOR-BAND PROGRESSION ("from coral-pink at the horizon through hot-magenta to deep-indigo above")
- DITHERING signal ("DITHERED color-bands", "chunky-pixel-edge", "stepping bands")
- HARD HORIZON LINE ("hard pixel-edge horizon", "chunky-pixel-edge horizon band sharp and blocky")
- SNES PALETTE register ("SNES-era saturated palette", "SNES muted palette", "FF6 sky-band aesthetic")
- A mood/atmospheric tag (dramatic / hopeful / peaceful / ominous / romantic / etc.)

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"GOLDEN-AMBER SUNSET — far backdrop sky with DITHERED golden-amber color-bands stepping from warm-yellow at the hard pixel-edge horizon through deep-orange to purple-violet above, SNES-era saturated palette, chunky-pixel-edge horizon band sharp and blocky."
"BLOOD-RED SUNSET — far backdrop sky with DITHERED blood-red color-bands stepping hard from crimson-red at the pixel-edge horizon through dark-maroon to near-black-purple above, dramatic ominous SNES palette, chunky-pixel-edge horizon knife-sharp."
"COOL-BLUE DAWN — far backdrop sky with DITHERED cool-blue color-bands stepping from icy-cyan at the hard pixel-edge horizon through steel-blue to deep-navy above, fresh early-dawn SNES palette, chunky-pixel-edge horizon stark and geometric."

━━━ VARIETY MANDATE (distribute across these backdrop categories) ━━━

- ~5 SUNSET (golden-amber / pink-orange / blood-red / soft-pastel / volcanic-magenta / harvest-orange / coral-sunset / wildfire-red / lavender-sunset / bloody-purple)
- ~5 DAWN (soft-pink dawn / golden dawn / mist-pink dawn / cool-blue dawn / lavender dawn / peach dawn / silver dawn / overcast dawn / spring-pink dawn / blue-hour-edge dawn)
- ~4 DAY / MIDDAY (clear-blue noon / hazy-summer noon / cumulus-puff afternoon / overcast-grey noon / windswept-blue afternoon / desert-bleached noon)
- ~4 STORMY / DRAMATIC (thundercloud wall / storm-front horizon / lightning-flash sky / tornado-funnel backdrop / rain-curtain horizon / typhoon-wrack sky)
- ~5 NIGHT / SPACE (deep-starlit night / crescent-moon night / full-moon night / aurora-night / nebula-purple night / cosmic-galactic backdrop / planet-rising backdrop / star-shower night / silver-moon night / blood-moon night)
- ~4 FANTASTICAL / RPG-SIGNATURE (twin-moons sky / drifting-island silhouette backdrop / castle-on-cloud-bank backdrop / dragon-silhouette horizon / floating-citadel backdrop / world-tree silhouette backdrop / volcano-eruption backdrop)
- ~3 CLOUD-FEATURED (cumulus-puff stack / wispy cirrus band / mackerel-pattern sky / heavy nimbus deck / scattered scatter-cloud / mountainous storm-cloud)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS open with "far backdrop sky with..." or equivalent ("far backdrop space with..." for cosmic).
- ALWAYS specify the COLOR PROGRESSION (named colors stepping from horizon upward).
- ALWAYS include "DITHERED" + "hard pixel-edge horizon" OR "chunky-pixel-edge" signal.
- ALWAYS include SNES-palette tag.
- Body is 40-55 words.

━━━ BANS ━━━
- NO photoreal sky / no realistic-cloud language — this is 16-bit dithered.
- NO foreground or midground details — backdrop layer ONLY.
- NO characters / silhouettes of people in the backdrop — pure environmental.
- NO smooth gradient language — explicit DITHERED color-band stepping only.
- NO modern aircraft / contrails / city-haze — fantasy/SNES register only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "TITLE-CAPS — body" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

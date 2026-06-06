#!/usr/bin/env node
/**
 * BRICKBOT_WESTERN_PHENOMENON — built western weather/event drama.
 * Audit 2026-06-05: 44 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_western_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PHENOMENON entries for BrickBot's western path — ONE big built environmental event in a Wild-West brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC western event (dust-storm wall, tumbleweed roll, gun-smoke puff, stampede, lightning-strike, train-arriving, fire-flash, etc.) AND shows how it's BUILT (cotton-elements, brown plant-elements, trans-orange flame, etc.). Reads BRICK.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 DUST / STORM: dust-storm wall, dust-devil, sand-storm, mesa-scattered dust-haze
- ~5 GUN / SHOT-EVENT: gun-smoke puff, muzzle-flash, rifle-volley, cannon-fire
- ~4 STAMPEDE / HERD: cattle stampede, horse stampede, buffalo-herd run
- ~4 RAIN / WEATHER: thunderstorm break, hail-fall, prairie-storm
- ~4 FIRE EVENTS: prairie-fire wall, burning-barn flames, campfire-roar, brand-iron sear
- ~3 RAILROAD: locomotive arriving, steam-billow, train-whistle blast (visual cue)
- ~3 LIGHTNING: bolt-strike on mesa, sky-flash, distant-strike
- ~3 TUMBLEWEED / DRIFT: rolling tumbleweed, blown-debris drift
- ~3 GOLD-STRIKE / MINING: gold-vein reveal, dynamite-blast, pickaxe-spark
- ~3 ARROW / ARMED-RAID: arrow-flight, war-cry charge, rider-charge
- ~2 RIVER / FORD: river crossing, flash-flood
- ~2 SUNSET-LONELY: lone-rider silhouette at sunset
- ~2 BUZZARD / VULTURE FLIGHT overhead
- ~1 GEYSER / HOT-SPRING burst
- ~1 LANDSLIDE / ROCKSLIDE
- ~1 MIRAGE-shimmer on desert

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT + HOW it's brick-built + WHERE. Touchpoints:
"DUST-STORM WALL — a built mass of cotton-elements + tan + cream 1×1 round-plates rolling across the mesa-flat, foreground figures braced into the wind, a frozen built habit"
"ROLLING TUMBLEWEED — two brown plant-element tumbleweeds frozen mid-bounce across a tan-plate street on near-invisible clear rods, the lonely-frontier punctuation drifting"
"GUNSMOKE PUFFS — trans-white + white 1×1 round-plates clustered on clear rods at revolver and rifle muzzles, frozen mid-shot, a built tang of smoke hanging low over the showdown"

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

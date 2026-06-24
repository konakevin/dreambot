#!/usr/bin/env node
/**
 * EarthBot night-landscapes — NIGHT_SKY axis (the backdrop + the light that
 * REVEALS the land). This axis carries the whole "shades of night" variety.
 *
 * GUARANTEED RATIO AT SCALE: rather than trust one prompt's "~25% this, ~20%
 * that" (Sonnet only approximates, and cross-batch dedup unevenly starves
 * categories — playbook "Weighted subThemes" / [[feedback_production_seed_equal_
 * share_per_subtheme]]), this generates each NIGHT-SKY LOOK as its OWN phase
 * with a FIXED count, then merges + shuffles. The blend is exact by
 * construction at any total — change TOTAL (or pass --total N), counts scale
 * proportionally from the per-look WEIGHTS.
 *
 * The blend (Kevin liked all the looks — none dominates):
 *   starry 25 · milky-way 20 (VARIED placement) · moonlit 18 · twilight 12 ·
 *   crescent 12 · aurora 8 (occasional treat) · faint 5
 *
 * Clean TRUE-TO-LIFE astrophotography — real colors, NEVER neon/hyperreal/
 * fantasy. Every entry names the sky AND how its light REVEALS the land (the
 * land is the visible hero, never a black silhouette). Physically coherent
 * (a bright moon washes the Milky Way; aurora only over cold land).
 *
 * Usage:  node gen-night-landscapes-night-sky.js [--total 200]
 */
const fs = require('fs');
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const totalArg = process.argv.indexOf('--total');
const TOTAL = totalArg !== -1 ? parseInt(process.argv[totalArg + 1], 10) : 200;
const OUT = 'scripts/bots/earthbot/seeds/night_landscapes_night_sky.json';
const TMP_DIR = path.resolve(__dirname, '../../bots/earthbot/seeds');

// Shared base — the bar, the guards, the output format. FEATURED look is
// appended per phase.
const BASE = `You are writing NIGHT-SKY entries for EarthBot's night-landscapes path. Each entry describes ONE night sky AND the natural light it casts down onto the landscape — because the LAND is the visible hero and must read pretty and clearly lit, never a black silhouette.

━━━ THE BAR — REAL, CLEAN NIGHT SKY THAT LIGHTS THE LAND ━━━

True-to-life astrophotography: real Milky-Way dust lanes, real star color, real moon-silver, real aurora green/teal. The kind of real night sky a person stops scrolling for. NEVER neon, NEVER hyperreal, NEVER a saturated fantasy galaxy, NEVER "glowing" sci-fi color.

━━━ EVERY ENTRY MUST LIGHT THE LAND ━━━

Say how this sky's light reaches the landscape — moonlight silvering the terrain, twilight holding its color, aurora-glow on snow, starlight on luminous snow / pale rock / reflective water. On a dark moonless night the land is revealed by luminous snow/pale-rock/water + starlight, NEVER pitch black.

━━━ AXIS-CLEAN ━━━

Sky + the light it casts ONLY. NO ground geology beyond what the light falls on (peaks/snow/water/forest). NO meteors/shooting stars (another axis). NO fog/mist/cloud-as-weather (another axis); "clear dark sky" is fine.

━━━ OUTPUT FORMAT ━━━

JSON array of STRINGS, each 16-28 words. No preamble, no markdown, no keys — just strings.`;

// Per-look phases. weight → proportional count of TOTAL. focus = the specific
// look + a couple of seed examples for that phase only.
const LOOKS = [
  {
    key: 'starry',
    weight: 25,
    focus: `FEATURED LOOK — PLAIN STARRY NIGHT (the everyday look): a sky FULL of sharp stars over a pretty, clearly-lit landscape. NO Milky-Way-core drama, NO moon. The land is luminous via snow / pale rock / glacier / reflective water catching the starlight.
Examples:
- A clear moonless sky full of sharp stars from horizon to horizon, the landscape softly lit in cool starlit grey, calm water mirroring the scattered stars
- A deep dark sky scattered with countless crisp stars of blue-white and warm gold, the snowcapped peaks pale and defined, the foreground luminous under starlight
- A rich quiet field of stars over the valley, a few brighter and a wash of fainter ones, pale rock and snow clearly legible beneath, no moon`,
  },
  {
    key: 'milky-way',
    weight: 20,
    focus: `FEATURED LOOK — THE MILKY WAY, with VARIED PLACEMENT (this is critical — do NOT always put a vertical pillar down the center): low arc across the whole horizon / a long diagonal slant / the galactic core off to one side behind a ridge / a broad band lying near-horizontal high across the frame / rising at a low angle from a far corner. Moonless; the land luminous via snow/pale-rock/water.
Examples:
- The Milky Way band arcing low and wide across the whole horizon, dust lanes stretching side to side, the snowfield luminous beneath the broad star band
- The galactic core glowing off to one side low behind a shoulder of the peaks, the rest of the band trailing diagonally to the far corner, water bright below
- A broad faint Milky Way band lying almost horizontal high across the frame, countless stars filling the sky, glacier ice luminous under the gentle starlight`,
  },
  {
    key: 'moonlit',
    weight: 18,
    focus: `FEATURED LOOK — A MOONLIT NIGHT: bright gibbous or full SILVER moonlight (or, for ~⅓ of these, a warm COPPER / harvest moon) clearly revealing the land. A scatter of bright stars — NO blazing Milky Way under the moon (the moon washes it out).
Examples:
- A bright gibbous moon overhead casting clean silver-blue light across the terrain, every ridge and tree clearly lit, the brighter stars still scattered above
- A high full moon flooding the landscape in soft silver light, the land fully and beautifully lit, a sparse field of bright stars in the deep sky
- A low copper harvest moon at the horizon casting warm amber-silver light across the terrain, the land clearly lit, a few bright stars in the deep blue sky`,
  },
  {
    key: 'twilight',
    weight: 12,
    focus: `FEATURED LOOK — DEEP TWILIGHT / BLUE HOUR with the FIRST stars: the land still holding its color, only the first few bright stars (or a faint emerging Milky Way) showing.
Examples:
- Deep blue-hour twilight, a last band of ember-orange along the horizon, the land still holding its color, the first bright stars emerging overhead
- Lingering cobalt dusk with a faint rose afterglow low in the sky, the terrain softly lit and colorful, only a few early stars showing`,
  },
  {
    key: 'crescent',
    weight: 12,
    focus: `FEATURED LOOK — A THIN / LOW CRESCENT MOON: gentle light just revealing the terrain while the dense star field stays bright overhead.
Examples:
- A thin crescent moon low at the horizon, just enough soft light to reveal the terrain while the dense star field stays bright overhead
- A slim crescent setting behind a ridge, the land softly lit, the stars still clear and bright across the sky above`,
  },
  {
    key: 'aurora',
    weight: 8,
    focus: `FEATURED LOOK — AURORA (an occasional treat): real green-and-teal curtains (occasional faint violet/red) rippling among the stars over COLD high-latitude land (snow/ice/fjord/tundra/boreal); the glow tints the snow and reflects in cold water. Real colors only, never neon.
Examples:
- Shimmering green-and-teal aurora curtains rippling among the stars, their soft glow washing faint color across the snowfield and trembling in the still cold fjord below
- A quiet arc of green aurora low over the tundra with a faint violet crown, cold light reflected softly across the snow and the dark still water at its edge`,
  },
  {
    key: 'faint',
    weight: 5,
    focus: `FEATURED LOOK — SOFT FAINT-FEW-STARS: a soft hazy night with just a few stars barely visible through the deepening blue, the land gently lit and still legible.
Examples:
- A soft hazy late-dusk sky with just a few stars barely visible through the deepening blue, the land gently lit and still legible
- A dim quiet sky with only the brightest few stars showing through soft haze, the terrain faintly but clearly lit below`,
  },
];

function shuffle(a) {
  // Deterministic-ish shuffle (no Math.random dependency issues in tooling).
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 2654435761) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

(async () => {
  const sumW = LOOKS.reduce((s, l) => s + l.weight, 0);
  const merged = [];
  for (const look of LOOKS) {
    const count = Math.max(1, Math.round((look.weight / sumW) * TOTAL));
    const tmp = path.join(TMP_DIR, `.tmp_night_sky_${look.key}.json`);
    console.log(`\n=== phase ${look.key}: ${count} entries ===`);
    await generatePool({
      outPath: path.relative(process.cwd(), tmp),
      total: count,
      batch: 12,
      append: false,
      metaPrompt: (n) =>
        `${BASE}\n\n${look.focus}\n\nGenerate ${n} entries of THIS featured look ONLY. JSON array of strings.`,
    });
    const entries = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    merged.push(...entries);
    fs.unlinkSync(tmp);
  }
  shuffle(merged);
  fs.writeFileSync(path.resolve(process.cwd(), OUT), JSON.stringify(merged, null, 2));
  console.log(`\n✅ night_sky: ${merged.length} entries written to ${OUT} (exact blend ratio)`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

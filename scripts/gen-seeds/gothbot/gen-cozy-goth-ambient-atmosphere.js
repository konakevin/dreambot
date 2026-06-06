#!/usr/bin/env node
/**
 * GOTHBOT_COZY_GOTH_AMBIENT_ATMOSPHERE — small atmospheric grace-notes
 * inside cozy-goth interiors (witch's apothecary / candlelit library /
 * scrying chamber / alchemy lab / curio cabinet). Drifting dust motes,
 * candle-smoke curls, steam from teacups, firelight rippling on walls,
 * dried petals settling. Intimate, warm-dark, peaceful. The OPPOSITE of
 * a phenomenon — quiet ambient detail.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_cozy_goth_ambient_atmosphere.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} AMBIENT ATMOSPHERE entries for GothBot's cozy-goth path — small atmospheric grace-notes inside a warm-dark gothic interior (witch's apothecary, candlelit library, scrying chamber, alchemy laboratory, curio cabinet, gothic study). Each entry is one short sentence (15-25 words) naming ONE quiet ambient detail.

━━━ THE BAR ━━━
Every entry: (1) names ONE quiet atmospheric grace-note (dust motes, candle-smoke, steam, firelight, petal-drift, mirror-glint, dripping wax, vellum-rustle); (2) places it in the interior with a soft visual signature; (3) reads PEACEFUL and INTIMATE, not dramatic or phenomenal. Crimson-Peak / Practical-Magic / Pan's-Labyrinth / Hocus-Pocus / 19th-c curio engraving register. Warm-dark gothic.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Dust-motes drifting lazily through a single amber shaft of candlelight, suspended like slow-falling gold in the still room air."
"A thin curl of candle-smoke rising from a just-snuffed taper, dissolving softly into the shadowed ceiling above."
"Steam rising gently from an untouched teacup on the side table, catching the warm hearth-glow in pale wisps."
"Firelight flickering unevenly across the wallpaper, sending slow amber waves and soft shadows rolling up toward the cornicing."
"A single dried rose-petal drifting from a vase, settling silently onto the floorboards in the low candlelight."

━━━ VARIETY MANDATE (distribute across these grace-note families) ━━━
- ~4 DUST / MOTES drifting in light-shafts
- ~3 CANDLE-SMOKE / TAPER-CURL rising/dissolving
- ~3 STEAM from teacup / kettle / cauldron / potion
- ~3 FIRELIGHT / HEARTH-GLOW flickering / rippling
- ~3 PETAL / LEAF / FEATHER drifting from vase / book / shelf
- ~2 WAX dripping / pooling on candlestick
- ~2 INK / VELLUM / PAGE rustling, curling, drying
- ~2 MIRROR / CRYSTAL / GLASS catching glint / refraction
- ~2 CHARCOAL / PIPE-SMOKE drifting from a censer / hookah / hearth
- ~1 INCENSE / SAGE-SMOKE / SANDALWOOD haze

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 15-25 words per entry.
- One single quiet ambient detail per entry — never two layered phenomena.
- Soft visual signature — "drifting", "rising", "settling", "pooling", "flickering".
- Place it inside the gothic interior (room context implied, but no character).

━━━ BANS ━━━
- NO dramatic phenomena (lightning, storms, supernatural events — those are dark-landscape).
- NO characters — ambient atmosphere is the room's quiet breath, no figure casting it.
- NO outdoor language (no wind, no rain, no fog rolling in — INDOOR ambient only).
- NO modern (electric flicker, neon, fluorescent).
- NO photographic register ("backlit", "tack-sharp", "HDR").

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

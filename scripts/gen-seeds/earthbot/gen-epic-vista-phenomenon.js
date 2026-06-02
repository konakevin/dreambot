#!/usr/bin/env node
/**
 * EarthBot epic-vista — PHENOMENON axis (CONDITIONAL 30% gate).
 *
 * THE chaos-reduction lever. Phenomenon fires on ~3 of 10 renders.
 * The other 7 of 10 are just clean magnificent geography + lighting +
 * sky — that restraint is what makes phenomenon HIT when it fires.
 *
 * Each entry: ONE rare real-Earth optical or weather phenomenon. No
 * stacks. No bioluminescence. No "stars-above-sunset". Just one
 * jaw-dropping real event the planet actually produces.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_phenomenon.json',
  total: 50,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PHENOMENON entries for EarthBot epic-vista — each entry describes ONE rare real-Earth optical or weather phenomenon that occasionally fires (~30% of renders).

━━━ THE BAR ━━━

These are the "wait, that's REAL?" moments — sun pillars, sun-dogs, fire rainbows, 22° halos, aurora curtains, mammatus storms, glory rings, green flash. Each entry is ONE phenomenon, described accurately enough that a meteorologist would nod. Real physics, real Earth — but the kind of moment you remember for a decade after seeing it once.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 15-25 words. Describe:
- The phenomenon NAME (sun pillar / sun-dogs / fire rainbow / 22° halo / etc.)
- Its visual character (how it looks — vertical light shaft / paired bright spots / prismatic band / etc.)
- Its position relative to scene (above the peak / arcing the valley / at horizon / etc.)
- (Optional) a one-detail note about its rarity / atmospheric conditions

ONE phenomenon per entry. NEVER stack ("rainbow AND sun-pillar AND aurora all together").

━━━ EXAMPLES ━━━

✓ "Double rainbow arcing complete across the valley, primary vivid below, secondary fainter above with reversed color order"
✓ "Single sun pillar rising vertical from the low sun, light shaft through ice-crystal air"
✓ "Sun-dogs (parhelia) flanking the sun at 22°, paired bright spots on either side of the disc"
✓ "Fire rainbow (circumhorizontal arc) glowing across high cirrus, prismatic band parallel to horizon"
✓ "22° halo ring around the sun, full pale circle drawn by ice crystals in cirrus sky"
✓ "Aurora borealis curtains rippling green and violet across the polar sky"
✓ "Crepuscular rays fanning from a cloud edge in spotlight-beam clarity"
✓ "Anticrepuscular rays converging at the opposite horizon point, ribbon-beams pulling toward antisolar"
✓ "Green flash at the moment of sunset disc disappearing, emerald spark held for one second"
✓ "Single distant lightning fork striking through anvil cloud, no rain in foreground"
✓ "Glory ring around the observer's shadow on cloud below (Brocken spectre halo)"
✓ "Total solar eclipse corona at totality, white-fire ring around the moon's silhouette"
✓ "Triple sun-dogs (rare cold-day phenomenon), full 22° halo plus paired parhelia plus upper tangent arc"
✓ "Wall cloud dropping from supercell base, rotating cylinder lit by setting sun behind"
✓ "Volcanic-haze sunset (real Krakatoa-style phenomenon), sky burning crimson-magenta hours after sunset"
✓ "Twin waterspouts touching down offshore, paired water columns connecting sea to cloud"
✓ "Mammatus storm-cell underside lit by sunset, bulbous pouches glowing rose-gold"
✓ "Lenticular cloud stack glowing iridescent at sunset, mother-of-pearl wave-disc tinting prismatic"
✓ "Nacreous (polar stratospheric) cloud glowing rainbow-iridescent in twilight (extreme high latitude only)"

✗ BAD — stacks: "Rainbow AND sun pillar AND aurora AND green flash all at once"
✗ BAD — bioluminescence: "Phosphorescent fungi glowing in foreground" (BANNED — sci-fi drift)
✗ BAD — Galaxies above sunset: "Milky Way arching above sunset gradient" (BANNED — stars and sunset don't co-exist)
✗ BAD — sci-fi: "Two moons rising" (BANNED — Earth has one moon)
✗ BAD — fantasy: "Magical glowing sky" (BANNED — use REAL phenomenon names)

━━━ CATEGORY DISTRIBUTION ━━━

- ~40% Optical rainbow varieties (double / triple / fire / sundog / 22°-halo / glory / circumzenithal)
- ~15% Polar light (aurora borealis / aurora australis)
- ~15% Light-ray phenomena (crepuscular / anticrepuscular / sun-pillar / sun-spotlight)
- ~15% Storm phenomena (lightning fork / tornado-base / waterspout / wall-cloud / mammatus)
- ~10% Sunset/sunrise rare (green flash / volcanic-haze sky / nacreous clouds)
- ~5% Extreme rare (total eclipse corona / Brocken spectre / Earth-shadow at horizon)

━━━ HARD BANS ━━━

- NO stacked phenomena per entry — ONE phenomenon only
- NO bioluminescence / glowworms / phosphorescent anything (sci-fi drift)
- NO galaxies-above-sunset (stars and sunset don't co-exist on Earth)
- NO multi-moons / twin-suns / triple-moons
- NO fantasy / magical / arcane / supernatural descriptors
- NO impossible-physics ("rainbow forming a perfect circle around the observer" — only naturally circular phenomena like glory)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. Each entry names ONE real Earth phenomenon.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

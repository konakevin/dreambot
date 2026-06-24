#!/usr/bin/env node
/**
 * EarthBot night-landscapes — LANDSCAPE axis (the pretty VISIBLE hero).
 *
 * A beautiful, detailed, VISIBLE real-Earth landscape that sits under a gorgeous
 * night sky — NOT a flat black silhouette (the old "sky sovereign, land silent"
 * minimalism). The night-sky look is a SEPARATE axis, so the SAME landscape
 * recombines with every sky → huge variety. YOUR job is only the land.
 *
 * GUARANTEED BIOME BALANCE (Kevin 2026-06-24: the pool was too mountain-heavy —
 * "all mountains, no tropical / desert / forest" — and mountain-lakes + terraced
 * rice paddies were over-common). Like the night_sky axis, this generates each
 * BIOME as its own phase with a fixed weight, then merges, so desert / tropical
 * / forest each get real share and mountains never dominate. Mountain-lakes are
 * deliberately minimized; terraced rice paddies are OUT. Change TOTAL (or pass
 * --total N) and the biome mix holds by construction.
 *
 * Usage:  node gen-night-landscapes-landscape.js [--total 200]
 */
const fs = require('fs');
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const totalArg = process.argv.indexOf('--total');
const TOTAL = totalArg !== -1 ? parseInt(process.argv[totalArg + 1], 10) : 200;
const OUT = 'scripts/bots/earthbot/seeds/night_landscapes_landscape.json';
const TMP_DIR = path.resolve(__dirname, '../../bots/earthbot/seeds');

const BASE = `You are writing LANDSCAPE entries for EarthBot's night-landscapes path. Each is ONE beautiful, dramatic, DETAILED real-Earth landscape — the kind a landscape photographer travels for — described so it reads RICH and VISIBLE, never a flat empty silhouette. A separate axis adds the night sky + light; YOUR job is ONLY the land: its geology, structure, depth and natural detail.

━━━ THE BAR — A PRETTY, DETAILED, VISIBLE LANDSCAPE ━━━

Real geology with genuine structure and depth: a layered foreground, a dominant landform, distance. The most-magnificent REAL version (never "hyperreal" / "otherworldly"). It must NOT be a barren flat plain or a bare silhouette — give it shape, layers and natural texture (trees, water, rock detail, snow, foliage) the night light can pick out.

━━━ AXIS-CLEAN — LAND ONLY ━━━

Describe ONLY the landscape geology + natural surface detail. NO sky, NO stars, NO moon, NO Milky Way, NO aurora, NO time of day, NO weather, NO lighting words, NO colors-of-light. (Snow / water / forest / rock as PHYSICAL features is fine — just never how they're lit.)

━━━ ABSOLUTELY BANNED ━━━

- NO people, hikers, figures, tents, campsites
- NO buildings, cabins, roads, fences, bridges, ruins, docks, trails/paths
- NO tourist viewpoint / landmark names ("Half Dome", "Tunnel View", "X Overlook/Point/View") — describe the GEOLOGY in prose
- NO sky / lighting / weather / color-of-light words
- NO "hyperreal" / "otherworldly" / "alien" / "fantasy" / "glowing" / "neon"

━━━ OUTPUT FORMAT ━━━

JSON array of STRINGS, each 16-30 words. Lead with the landform; pack in 2-3 concrete natural details that give it depth.`;

// Per-biome phases. Balanced so mountains never dominate and desert / tropical /
// forest each get real share. Lakes minimized; NO terraced rice paddies.
const BIOMES = [
  {
    key: 'desert',
    weight: 20,
    focus: `FEATURED BIOME — DESERT (great dark-sky terrain): span dune seas with knife-sharp crests, banded sandstone canyons + slender hoodoo spires, layered mesas + buttes + natural rock arches, eroded badlands, deep slot canyons, cracked salt flats with distant ranges.
Examples:
- A dune sea of long sculpted sand ridges with knife-sharp crests, ripples raking the lee faces, a darker rock spur breaking the swell of sand
- Layered sandstone mesas and slender hoodoo spires above a cracked-and-cobbled wash, scattered sage and juniper clinging to the ledges
- A natural sandstone arch spanning a side-canyon, banded vermilion walls and a braided trickle on the floor between rounded boulders`,
  },
  {
    key: 'tropical',
    weight: 18,
    focus: `FEATURED BIOME — TROPICAL: span palm-fringed beaches + coves, turquoise lagoons ringed by reef and dark headlands, jungle river clearings + emerald gorges, tropical volcanic coasts of black sand and lava rock, mangrove channels, a tropical waterfall into a jungle pool.
Examples:
- A palm-fringed cove, smooth dark lava rocks at the surf line, leaning coconut palms framing a curve of pale sand and still shallow water
- A tropical lagoon ringed by jagged jungle headlands, a calm turquoise basin, a thread of waterfall slipping down a fern-draped cliff at the back
- A jungle river bend below dense canopy, broad-leafed foliage crowding the banks, mossy boulders and a sandbar at the curve`,
  },
  {
    key: 'forest',
    weight: 18,
    focus: `FEATURED BIOME — FOREST (temperate / boreal): span an open meadow clearing ringed by tall conifers, a redwood / sequoia grove of giant trunks, an autumn hardwood valley in gold and rust, a pine forest above a grassy basin, mossy old-growth with ferns and fallen logs, a forest-edged stream.
Examples:
- A grassy clearing ringed by tall dark spruce, a few granite boulders in the meadow, the forest wall layering back into deeper ranks of trees
- A grove of immense redwood trunks rising from a fern-and-sorrel floor, shafts of space between the columns receding into soft depth
- An autumn hardwood valley in gold and rust, a clear shallow stream winding the floor over pale gravel, scattered birch among the maples`,
  },
  {
    key: 'mountains',
    weight: 16,
    focus: `FEATURED BIOME — MOUNTAINS (dramatic, NOT lake-centric): span a sharp pyramidal peak above a ridgeline, a granite cirque amphitheatre with talus fans, a glaciated summit ringed by snow couloirs, a high alpine valley between steep walls, a knife-edge arête, a snow-streaked massif.
Examples:
- A sharp pyramidal granite peak rising above layered ridgelines, snow streaking its couloirs, talus fans sweeping down to a high meadow
- A glaciated cirque ringed by jagged spires, a talus-strewn basin below, hanging snowfields clinging beneath the headwall
- A high alpine valley between steep rock walls, a braided meltwater stream on the gravel floor, scattered larch on the lower slopes`,
  },
  {
    key: 'coastal',
    weight: 16,
    focus: `FEATURED BIOME — COASTAL / SEA (non-tropical): span rugged basalt sea cliffs + offshore stacks, a fjord wall plunging to a dark inlet, a rocky headland with surf-worn arches, a wild cobble or black-sand beach below cliffs, tide-carved coastal shelves.
Examples:
- Basalt sea stacks standing off a dark headland, surf-worn arches, a curving cobble beach below sheer cliffs draped in coastal grass
- A fjord wall of dark striated rock plunging to a still inlet, a thin waterfall threading the face, a narrow boulder shore at the waterline
- A rugged headland of layered sea cliffs, offshore pinnacles catching the swell, a wild black-sand beach in the cove below`,
  },
  {
    key: 'water-and-other',
    weight: 12,
    focus: `FEATURED BIOME — LAKES + OTHER DRAMATIC (use sparingly — only ~half reflective lakes): a FEW reflective mountain lakes / alpine tarns with a boulder shore, plus volcanic fields of glossy black lava and cinder cones, blue-white glacier icefalls between rock walls, forested limestone karst pinnacles from a river bend, a tall waterfall gorge.
Examples:
- A glassy alpine tarn cradled in a granite basin, a boulder-strewn shore, scattered larch, jagged ridgelines rising beyond the water
- A volcanic field of glossy black lava flows and low cinder cones, a steaming fumarole vent, sparse hardy grass in the cracks
- Forested limestone karst pinnacles rising from a slow river bend, dense greenery clinging to the towers, a gravel bar at the curve`,
  },
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 2654435761) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

(async () => {
  const sumW = BIOMES.reduce((s, b) => s + b.weight, 0);
  const merged = [];
  for (const biome of BIOMES) {
    const count = Math.max(1, Math.round((biome.weight / sumW) * TOTAL));
    const tmp = path.join(TMP_DIR, `.tmp_landscape_${biome.key}.json`);
    console.log(`\n=== biome ${biome.key}: ${count} ===`);
    await generatePool({
      outPath: path.relative(process.cwd(), tmp),
      total: count,
      batch: 12,
      append: false,
      metaPrompt: (n) =>
        `${BASE}\n\n${biome.focus}\n\nGenerate ${n} entries of THIS biome ONLY. JSON array of strings.`,
    });
    merged.push(...JSON.parse(fs.readFileSync(tmp, 'utf8')));
    fs.unlinkSync(tmp);
  }
  shuffle(merged);
  fs.writeFileSync(path.resolve(process.cwd(), OUT), JSON.stringify(merged, null, 2));
  console.log(`\n✅ landscape: ${merged.length} entries written (balanced biomes)`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

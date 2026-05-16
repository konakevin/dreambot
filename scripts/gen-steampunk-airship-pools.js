#!/usr/bin/env node
/**
 * Generator for SteamBot airship-skies path-bespoke pools:
 *   - AIRSHIP_SKY_LAYER (atmospheric backdrop — clouds / sunsets / storms)
 *   - AIRSHIP_SURPRISE_ELEMENT (secondary subjects — distant vessels,
 *     mooring spires, sky-creatures, lighthouse-rocks)
 *   - AIRSHIP_PHENOMENON (70%-gated drama — lightning, meteors, sky-eddies)
 *
 * Usage: node scripts/gen-steampunk-airship-pools.js --pool sky_layer --count 30
 *        node scripts/gen-steampunk-airship-pools.js --pool surprise_element --target 100
 *        node scripts/gen-steampunk-airship-pools.js --pool phenomenon --target 50
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const POOL = args.pool;
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

if (!POOL) {
  console.error('Usage: --pool {sky_layer|surprise_element|phenomenon} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  sky_layer: 'steampunk_airship_sky_layer.json',
  surprise_element: 'steampunk_airship_surprise_element.json',
  phenomenon: 'steampunk_airship_phenomenon.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  sky_layer: `Generate atmospheric SKY LAYER descriptions for a steampunk airship scene. Each is ONE comma-separated line, 20-35 words, describing a sky/atmosphere that wraps around an airship — the BACKDROP, NOT the vessel itself.

The sky is half the painting. Each entry must paint a multi-tier atmospheric backdrop.

Variety mandate (rotate across batch):
- ~20% storm fronts (thunderhead anvils / lightning-veined clouds / rain-shafts)
- ~20% golden-hour sunsets (copper-amber-rose gradients / sun-shafts piercing cloud-banks)
- ~15% dawn (cool-blue-to-amber transition / sun cresting horizon)
- ~15% high cloud-sea (above the clouds at altitude / endless rolling cloudtops)
- ~10% twin-moon nights (twin moons casting silver light / starfield)
- ~10% aurora (green-violet ribbons / magnetic-storm shimmer)
- ~10% dramatic weather (cyclone eyes / hailstorm walls / sun-pillar / fog banks)

Each entry has:
- Atmospheric layer (specific cloud type, sky color, weather phenomenon)
- Light quality (color temperature, direction, breaking-through quality)
- Depth (foreground sky-atmosphere → midground cloud layers → distant horizon)

GOOD examples:
- Thunderhead anvil-clouds rising five miles into copper-tinted dusk, lightning forking between layers, golden sun-shafts piercing the storm's western flank
- Rolling cloud-sea endless beneath the vessel at altitude, golden-hour sun setting the upper layer ablaze, deep-purple gloom below where the world drops away
- Twin moons climbing a velvet-black eastern sky, silver light raking across rolling silver-grey cloudtops, scattered diamond starfield arcing overhead
- Aurora ribbons of emerald-and-violet shimmering across northern sky, magnetic-storm static crackling, deep cobalt night stretching to horizon
- Cyclone eye opening calm circle of clear dawn-blue above churning storm wall, sun-pillar piercing through, lightning silent in distant cumulus

ABSOLUTE BANS:
- ground / city / harbor as primary subject (this is JUST the sky)
- vessel description (no airships in this slot)
- characters / figures

Output: ONE sky layer per line. No numbering. No quotes.`,

  surprise_element: `Generate SURPRISE ELEMENT descriptions for a steampunk airship scene — small secondary subjects placed at midground or deep distance that add story to the frame. Each is ONE comma-separated line, 15-25 words.

These are scale-provers and story-amplifiers — NEVER eclipsing the hero airship, NEVER foreground.

Variety mandate:
- ~25% distant vessel (lone packet-ship / gun-ship silhouette / fleet on horizon / mooring vessel)
- ~20% sky-island / floating rock (small inhabited island / cliff-rock / sky-stone)
- ~15% mooring infrastructure (spire / docking tower / signal-mast / lighthouse-rock)
- ~10% sky-creatures (migrating sky-whales / brass sky-rays / cloud-leviathans / mechanical birds)
- ~10% atmospheric debris (wreckage / cargo balloon adrift / debris field / spent flares)
- ~10% weather elements (rain-shafts / sun-pillars / lightning-veins as scale)
- ~10% celestial (distant moons / stars / passing comets)

Each entry is one specific atmospheric detail that implies a wider world.

GOOD examples:
- Distant gun-ship silhouette riding the storm-front several miles off, copper running-lights barely visible
- Brass mooring spire rising from sky-island in mid-distance, ribbon flags whipping in evening wind
- Migrating sky-whale pod cruising the deep distance, brass-and-leather rigging glinting on lead bull
- Wrecked cargo balloon adrift in the deep distance, envelope shredded, basket trailing rope
- Lighthouse-rock jutting from cloud-sea, lantern blazing amber against gathering twilight

ABSOLUTE BANS:
- the hero vessel itself (this is SECONDARY only)
- ground / city / human figures
- foreground placement

Output: ONE element per line. No numbering. No quotes.`,

  phenomenon: `Generate dramatic ATMOSPHERIC PHENOMENA for a steampunk airship scene — dynamic sky-events that amplify the drama when rolled. Each is ONE comma-separated line, 20-35 words.

These are 70%-gated drama events — sometimes the sky is just beautiful, sometimes it's ALIVE with phenomenon.

Variety mandate:
- ~25% lightning events (forking lightning between cloud-layers / ball lightning / storm-arc)
- ~20% meteor / fireball / falling star
- ~15% sky-eddies / cyclone-eyes / vortex / waterspout
- ~10% magnetic storm / aurora burst / pulse
- ~10% sun-pillar / glory / rainbow-arc (rare optical phenomena)
- ~10% volcanic / ash plume from below
- ~10% rare phenomena (sprite-lightning / blue-jet / corona discharge / ice-halo)

Each describes the phenomenon dramatically with motion + scale + visible effect.

GOOD examples:
- Massive lightning bolt forks between thunderhead layers, blue-white arc illuminating the storm's flank for one frozen instant
- Meteor trail blazing across northern sky, white-hot core trailing copper sparks, vapor-tail unraveling in slow plume
- Sky-eddy spiraling beneath the vessel, cloud-vortex churning slowly, glimpse of dark ocean revealed at the eye
- Aurora burst shimmering green-violet curtain across upper sky, magnetic-storm static crackling, brass instruments going wild
- Sun-pillar of vertical light spearing from horizon to zenith, golden column piercing thin morning mist

ABSOLUTE BANS:
- vessel description / character description
- ground / city events
- mundane atmospheric details (this is DRAMATIC only)

Output: ONE phenomenon per line. No numbering. No quotes.`,
};

const RECIPE = RECIPES[POOL];
if (!RECIPE) {
  console.error('Unknown pool:', POOL);
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 4)
    .join('|');
}

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} entries now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`[${POOL}] appending: existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
    return;
  }
  const batch = await generateBatch(COUNT);
  const sigs = new Set();
  const deduped = batch.filter((b) => {
    const sig = signatureOf(b);
    if (sigs.has(sig)) return false;
    sigs.add(sig);
    return true;
  });
  fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
  console.log(`[${POOL}] wrote ${deduped.length} entries`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

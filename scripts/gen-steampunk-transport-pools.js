#!/usr/bin/env node
/**
 * Generator for SteamBot steam-transport path-bespoke pools:
 *   - STEAMPUNK_TRANSPORT_TERRAIN_DRAMA (dramatic geography that amplifies)
 *   - STEAMPUNK_TRANSPORT_SURPRISE (secondary subjects)
 *   - STEAMPUNK_TRANSPORT_PHENOMENON (50%-gated atmospheric drama)
 *
 * Usage: node scripts/gen-steampunk-transport-pools.js --pool terrain --count 30
 *        node scripts/gen-steampunk-transport-pools.js --pool surprise --target 100
 *        node scripts/gen-steampunk-transport-pools.js --pool phenomenon --target 50
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
  console.error('Usage: --pool {terrain|surprise|phenomenon} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  terrain: 'steampunk_transport_terrain_drama.json',
  surprise: 'steampunk_transport_surprise.json',
  phenomenon: 'steampunk_transport_phenomenon.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  terrain: `Generate TERRAIN DRAMA descriptions for a steampunk transport scene. Each is ONE comma-separated line, 25-40 words, describing the DRAMATIC GEOGRAPHY that amplifies a vehicle's journey.

The terrain is what makes a vehicle scene EPIC. A train on flat track is boring — a train crossing a canyon-bridge in a thunderstorm is unforgettable. This slot describes the LANDSCAPE the vehicle is conquering.

Variety mandate (rotate widely):
- ~15% canyon / chasm crossings (iron-bridge over thousand-foot drop / suspension cable over abyss / arched-stone viaduct)
- ~15% mountain pass / alpine (ice-glacier route / cliff-cut switchback / snow-line pass / avalanche-shed tunnel)
- ~10% desert / dune (Saharan dune-field at sunset / Arizona-coded badlands / Mongolian steppe)
- ~10% sea / coastal (storm-tossed waves / fog-blind reef-route / coastal cliff-rail / ice-floe sea-lane)
- ~10% underwater / deep-sea (abyssal trench / bioluminescent reef / kelp forest cathedral / glacial under-ice)
- ~10% jungle / tropical (vine-shrouded ruins / river-rapid through gorge / mangrove swamp / volcanic-island route)
- ~10% urban / city outskirts (elevated rail through fog-bound city / dockyard / bridge-network across districts)
- ~10% high-altitude / sky (above-the-clouds rail / spire-mounted track / mountaintop terminus)
- ~5% subterranean (deep-mine shaft / underground river / catacomb passage / lava-cave route)
- ~5% rare/exotic (frozen waterfall / methane-lake skiff / sky-island bridge / time-warped landscape)

Each entry has:
- The TERRAIN TYPE (canyon / mountain / sea / etc.)
- The DRAMATIC FEATURE (storm / chasm / glacier / lava / depth / etc.)
- WHERE the vehicle traverses it (across / through / over / under / along)
- ATMOSPHERIC quality (weather / time-of-day / haze / darkness)
- DEPTH layering hint (foreground tactile → midground scale → deep-distance horizon)

GOOD examples:
- Iron-trussed suspension bridge spanning a thousand-foot chasm in driving rain, lightning forking the storm-cloud sky, dark river churning far below
- Glacial pass between knife-edge peaks, snow-line at sunset turning the ice-walls coral and rose, avalanche-shed roof half-collapsed in the foreground
- Abyssal trench at three-thousand fathoms, bioluminescent jellyfish drifting in slow constellations, the dark immensity stretching beyond the headlamp's reach
- Mongolian steppe at golden hour, endless rolling grasslands receding to misty horizon, scattered yurts barely visible in the distance
- Volcanic-island route at twilight, lava-fountains erupting from the caldera, ash-fall drifting like black snow across the deck
- Foggy elevated-rail through a brick-and-iron Victorian city, gaslamps below piercing the murk in soft amber pools

ABSOLUTE BANS:
- the vehicle itself (this slot is TERRAIN only — vehicle is in another slot)
- flat / boring / undramatic geography (always epic / always conquering something)
- modern infrastructure (no highways, no skyscrapers, no jet trails)

Output: ONE terrain drama per line. No numbering. No quotes.`,

  surprise: `Generate SURPRISE ELEMENT descriptions for a steampunk transport scene. Each is ONE comma-separated line, 15-25 words, describing a small secondary subject at midground or deep distance that adds story.

These are scale-provers and story-amplifiers — NEVER eclipsing the vehicle or terrain.

Variety mandate:
- ~20% second vehicle (distant locomotive on parallel rail / passing dirigible / boat far below)
- ~15% mechanical wildlife (clockwork-bird flock crossing tracks / brass-fish school under sub / mech-deer leaping)
- ~15% signal infrastructure (signal-tower / lighthouse rock / beacon-station / mooring-spire)
- ~10% crew detail (small figure on observation deck / engineer leaning out cab / lookout in crow's-nest)
- ~10% atmospheric detail (sun-shaft piercing storm / steam-burst from distant chimney / lightning-arc in distance)
- ~10% architectural ruin (vine-covered temple / abandoned station / wrecked sister-vehicle / collapsed bridge)
- ~10% natural wildlife (eagle on cliff / whale breaching far off / herd of mountain goats / sky-pirate ship)
- ~10% cargo / load detail (passenger silhouettes / freight cars trailing / mooring lines / luggage piled)

GOOD examples:
- Distant second locomotive on a parallel track curving away into mountain-pass, its smoke-plume rising vertical in calm air
- Mechanical bird-flock of brass falcons crossing the vehicle's path in V-formation, copper wings catching the light
- Lighthouse-rock jutting from sea-mist on the starboard quarter, lantern blazing amber across the storm-tossed waves
- Tiny crew silhouette on the upper observation deck, brass-and-leather coat, surveying the chasm with a spyglass
- Sun-shaft piercing through a gap in the storm-clouds, golden column illuminating the distant horizon

ABSOLUTE BANS:
- the main vehicle or main terrain (SECONDARY only)
- foreground placement (midground or deep distance)
- modern objects

Output: ONE surprise per line. No numbering. No quotes.`,

  phenomenon: `Generate ATMOSPHERIC PHENOMENON descriptions for a steampunk transport scene — dramatic events that fire 50% of the time, amplifying the journey's drama. Each is ONE comma-separated line, 20-35 words.

These are atmospheric / weather / cosmic / mechanical-malfunction events. NEVER combat / violence / gore — drama is environmental.

Variety mandate:
- ~20% storm events (lightning forking / thunderhead rolling in / hurricane-front approaching / blizzard-wall)
- ~15% mechanical drama (steam-vent rupturing / overpressure release / wheel-spark cascade / boiler-glow visible)
- ~10% celestial (meteor trail across the sky / comet / aurora borealis ribbon / triple-moonrise)
- ~10% atmospheric optical (rainbow-arc / sun-pillar / glory / fog-bow / mirage shimmer)
- ~10% volcanic / geological (lava-fountain erupting in distance / earthquake-shudder / geyser-burst / rockfall)
- ~10% animal swarm (bird-migration overhead / whale-pod surfacing / fish-school visible / migrating herd)
- ~10% weather extreme (whirlwind / waterspout / dust-devil / squall-line / hailstorm)
- ~10% rare wonder (bioluminescent algae-bloom / aurora over ice / methane-flare horizon / sky-eddy)
- ~5% mystical (will-o-wisps / aurora's-edge / ghost-light / faerie-fire on the rails)

GOOD examples:
- Massive lightning fork between two storm-anvil clouds, blue-white arc illuminating the bridge for one frozen instant
- Steam-vent on the locomotive's flank ruptures in a great white plume, spray crystallizing instantly in the cold mountain air
- Meteor trail blazing across the night sky overhead, copper-orange streak fading slowly behind the vehicle
- Triple-moonrise on the eastern horizon, three silver discs ascending in close formation, light raking the dune-field
- Volcanic eruption in the deep distance, lava-fountain pumping incandescent against the dusk sky, ash-fall beginning
- Aurora borealis curtain shimmering green-violet across the polar night sky, ice-shelf glowing eerily

ABSOLUTE BANS:
- combat / violence / fighting / explosion-from-attack
- the vehicle or terrain themselves (this AMPLIFIES, not replaces)
- modern events

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

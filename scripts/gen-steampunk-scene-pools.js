#!/usr/bin/env node
/**
 * Generator for SteamBot steampunk-scene path-bespoke pools:
 *   - STEAMPUNK_SCENE_SURPRISE_ELEMENT (secondary subjects adding story)
 *   - STEAMPUNK_SCENE_EVENT (40%-gated atmospheric drama events)
 *
 * Usage: node scripts/gen-steampunk-scene-pools.js --pool surprise_element --count 30
 *        node scripts/gen-steampunk-scene-pools.js --pool event --target 50
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
  console.error('Usage: --pool {surprise_element|event} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  surprise_element: 'steampunk_scene_surprise_element.json',
  event: 'steampunk_scene_event.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  surprise_element: `Generate SURPRISE ELEMENT descriptions for a steampunk character-in-scene. Each is ONE comma-separated line, 15-25 words, describing a small secondary subject placed at midground or deep distance that adds story to a Victorian-industrial scene.

These are scale-provers and story-amplifiers — NEVER eclipsing the character or the landscape, NEVER foreground.

Variety mandate (rotate widely):
- ~20% distant airship / dirigible / sky-vessel passing overhead
- ~15% mechanical creature in the distance (brass falcon perched / clockwork hound / brass mouse on a beam)
- ~15% small mechanical contraption in midground (pneumatic delivery tube / brass automaton-servant / clockwork lamplighter)
- ~10% distant figure (brass-armored sentry / silhouetted scholar / distant inventor in cape)
- ~10% atmospheric debris (steam clouds rising from vent / scrap of newspaper drifting / candlelit window across alley)
- ~10% signaling element (lit beacon / brass signal-mirror / telegraph clatter / lantern swinging)
- ~10% weather / particulate detail (rain-shaft / sun-pillar / fog-bank rolling)
- ~10% architectural detail (gargoyle in upper corner / stained-glass dome glimpsed / ornate clocktower far off)

GOOD examples:
- Distant brass dirigible passing slowly across deep distance, running-lights glowing amber against twilight sky
- Mechanical brass owl perched on a far-corner iron beam, glowing copper eyes watching, motionless
- Pneumatic delivery-tube curving overhead through brick wall, brass capsule whooshing through with a soft hiss
- Tiny brass automaton-servant carrying a tea tray along a distant balcony, copper limbs ticking
- Sun-pillar of vertical light spearing down through a high glass dome in the deep distance
- Distant lamplighter on stilt-legs of brass machinery lighting gas-lamps along a far avenue

ABSOLUTE BANS:
- the main character or main landscape (this is SECONDARY only)
- foreground placement (this is midground or deep distance)
- modern objects (no LED, no plastic, no electronics)

Output: ONE element per line. No numbering. No quotes.`,

  event: `Generate STORY EVENT descriptions for a steampunk scene — atmospheric drama events that charge the frame with narrative when rolled. Each is ONE comma-separated line, 25-40 words.

These are 40%-gated atmospheric drama events — NEVER combat, NEVER violence, NEVER battle. The event is something HAPPENING in the world that adds story / wonder / scale.

Variety mandate:
- ~20% atmospheric phenomenon (steam-burst / aurora-shimmer / sun-pillar / pressure-burst / clockwork-storm)
- ~15% mechanical event (giant clockwork mechanism rotating / gear-tower starting up / brass piston firing in sequence)
- ~15% transportation event (airship docking in distance / locomotive arriving with steam-billow / dirigible-fleet passing)
- ~10% architectural event (drawbridge slowly rising / observatory dome rotating / clocktower chiming with visible mechanism)
- ~10% animal-creature event (mechanical bird-migration overhead / brass-fish swimming through canal / clockwork-cat slinking past)
- ~10% lighting event (gaslamp-lighting cascade rippling across the city / sun-burst through gear-window / lightning-arc from Tesla-coil)
- ~10% atmospheric weather (rain beginning to fall / fog rolling in / steam-mist condensing)
- ~10% rare wonder events (sky-eddy revealing the world below / inverted-rainbow / ash-fall from distant foundry-eruption)

Each describes the event dramatically with motion + scale + visible effect.

GOOD examples:
- Massive clockwork tower-mechanism rotating slowly in the deep distance, exposed gears the size of houses turning in synchronized procession
- Brass dirigible docking at a distant mooring spire, copper mooring lines snapping taut, vapor venting in white plumes
- Sun-pillar of vertical golden light piercing through a high glass dome, dust motes spiraling within the beam
- Locomotive arriving at a distant cathedral-station platform, steam billowing white against the iron-and-glass roof
- Cascade of gaslamps lighting in sequence down a winding cobblestone avenue, amber pools rippling forward at dusk
- Mechanical migration of brass-and-copper birds passing overhead in V-formation, gears clicking in unison

ABSOLUTE BANS:
- combat / violence / fighting / battle / explosion-from-attack
- the character themselves (event is in the WORLD around them)
- modern events (no LED, no plastic, no electronics)

Output: ONE event per line. No numbering. No quotes.`,
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

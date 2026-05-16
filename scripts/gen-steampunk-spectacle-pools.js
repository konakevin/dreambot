#!/usr/bin/env node
/**
 * Generator for SteamBot steampunk-spectacle path-bespoke pools:
 *   - STEAMPUNK_SPECTACLE_CROWD (crowd-detail textures)
 *   - STEAMPUNK_SPECTACLE_SURPRISE (secondary subjects)
 *   - STEAMPUNK_SPECTACLE_ESCALATION (40%-gated dramatic escalations)
 *
 * Usage: node scripts/gen-steampunk-spectacle-pools.js --pool crowd --count 30
 *        node scripts/gen-steampunk-spectacle-pools.js --pool surprise --target 100
 *        node scripts/gen-steampunk-spectacle-pools.js --pool escalation --target 50
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
  console.error('Usage: --pool {crowd|surprise|escalation} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  crowd: 'steampunk_spectacle_crowd.json',
  surprise: 'steampunk_spectacle_surprise.json',
  escalation: 'steampunk_spectacle_escalation.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  crowd: `Generate CROWD DETAIL descriptions for a Victorian-industrial steampunk spectacle scene. Each is ONE comma-separated line, 20-35 words, describing the HUMAN-ENERGY TEXTURE of the crowd at a grand event.

The crowd is the human canvas of the spectacle — specific clothing details, mixed Victorian society, multi-tier compositions, packed energy.

Variety mandate (rotate widely):
- ~20% upper-class top-hat-and-corset crowd (aristocrats / financiers / society ladies in tiered seats / balcony boxes)
- ~20% mixed working-class throng (laborers in canvas-and-leather / mechanics in oil-stained aprons / urchins / dock-workers)
- ~15% goggle-wearing inventor crowd (engineers / scientists / academics in brass-rim glasses / magnifying loupes)
- ~10% military / uniformed crowd (officers in epaulettes / cadets / brass-buttoned guards)
- ~10% mixed-society multi-tier (balconies of toffs above, crowd of workers below, vendors moving through)
- ~10% performance-audience (rapt attention, opera-glasses raised, hush of anticipation)
- ~10% protest / uprising (banners raised, fists shaken, makeshift signs of brass and canvas)
- ~5% celebration / festival (confetti / paper streamers / colored smoke / waving flags)

Each entry has:
- The crowd's COMPOSITION (mix of social classes / specific roles)
- VISIBLE clothing details (top-hats / corsets / goggles / waistcoats / parasols / aprons / uniforms)
- ENERGY description (rapt / restless / cheering / silent / surging forward)
- SPATIAL arrangement (packed in balconies / spread across plaza / multi-tier / fan-shaped around event)

GOOD examples:
- Sea of black top-hats and parasols filling the plaza floor, balconies of corseted society ladies tiered above, brass opera-glasses raised in unison toward the central event
- Mixed crowd of canvas-aproned workmen and brass-goggled engineers packed shoulder-to-shoulder, faces uplifted in rapt attention, oil-stained hands gripping caps
- Multi-tier amphitheater filled to capacity — uniformed military officers in front rows, civilian society in middle balconies, working-class crowd in upper galleries
- Riot of working-class protesters surging forward with brass-handled banners raised, faces fierce, mismatched uniforms of strike-committee badges and labor-aprons
- Hushed audience of academics in brass-rimmed spectacles and embroidered waistcoats, taking copious notes on copper-bound ledgers, opera-glasses ready

ABSOLUTE BANS:
- the main event itself (this slot is the CROWD only)
- modern objects (no smartphones, no LEDs)
- gore / violence / individual injury

Output: ONE crowd detail per line. No numbering. No quotes.`,

  surprise: `Generate SURPRISE ELEMENT descriptions for a steampunk spectacle scene. Each is ONE comma-separated line, 15-25 words, describing a small secondary detail at midground or deep distance that adds story.

These are scale-provers and story-amplifiers — NEVER eclipsing the event or crowd.

Variety mandate (rotate widely):
- ~20% media/witness (press photographer with brass camera / sketch-artist on rooftop / journalists with copper notepads)
- ~15% transportation arrival (distant airship docking / locomotive pulling in / carriages disgorging passengers)
- ~10% security / officials (mounted officers at perimeter / brass-helmeted guards on rooftops)
- ~10% mechanical witness (brass automaton-servant carrying refreshment / clockwork-pigeon delivering message / automated cart vendor)
- ~10% signaling (lit flare / signal mirror flashing / pneumatic-tube message)
- ~10% atmospheric (sun-shaft piercing roof / smoke from distant chimney / steam-burst rising)
- ~10% vendor / opportunist (street-vendor pushing cart / urchin pickpocket weaving / dog-handler with brass-collared hound)
- ~10% architectural (gargoyle peering down / clocktower beyond / arched gateway framing distant view)
- ~5% rare phenomenon (mechanical bird flock overhead / brass-bound pet / escaped circus-automaton)

GOOD examples:
- Press photographer crouched on the gallery rail, brass-and-mahogany camera angled down at the crowd, plate-flash ready
- Distant brass dirigible docking at the mooring spire visible through high windows, copper mooring lines tightening
- Brass automaton-servant weaving through the crowd carrying a silver tray of champagne flutes, copper limbs ticking
- Sun-shaft piercing the iron-and-glass roof high overhead, dust motes spiraling within the column of golden light
- Mounted military officer on a tall horse at the plaza perimeter, brass-buttoned uniform crisp, watchful gaze

ABSOLUTE BANS:
- the main event or main crowd (SECONDARY only)
- foreground placement (midground or deep distance)
- modern objects

Output: ONE surprise element per line. No numbering. No quotes.`,

  escalation: `Generate ESCALATION descriptions for a steampunk spectacle scene — dramatic intensifications that fire 40% of the time, amplifying the event with heightened drama. Each is ONE comma-separated line, 25-40 words.

These are atmospheric / mechanical / social drama events — NEVER mass violence, NEVER gore. The event ESCALATES into something dramatic.

Variety mandate:
- ~20% mechanical malfunction-spectacle (machine starts malfunctioning dramatically / Tesla coil throwing wild arcs / boiler venting massive steam)
- ~15% surprise arrival (uninvited dignitary's airship descending / royal-carriage arriving with fanfare / mysterious cloaked figure cutting through)
- ~15% audience reaction shift (gasps rippling through balconies / standing ovation cascading / scandalized hush sweeping like a wave)
- ~10% atmospheric drama (sun breaking through clouds dramatically / sudden rain beginning / lightning forking distant)
- ~10% animal/automaton chaos (a brass-automaton breaking ranks and dancing / escaped mechanical bird-flock startling / circus-bear's chains snapping)
- ~10% performer drama (singer hitting impossible note / acrobat mid-flip / orator climbing onto podium)
- ~10% mechanical reveal (curtain rising / hidden contraption descending from ceiling / floor opening to reveal massive mechanism)
- ~5% rare wonder (sky-eddy opening above / aurora suddenly visible / clockwork-flock formation)
- ~5% protest spike (banner unfurling unexpectedly / lone voice rising over the crowd / scattered cheers building)

Each describes the escalation dramatically with motion + visible effect + crowd reaction.

GOOD examples:
- Massive Tesla coil center-stage suddenly throwing wild electric arcs in every direction, crowd recoiling, brass safety-cages flashing blue-white
- Royal dirigible descending unexpectedly from above, copper mooring lines dropping to the plaza, crowd parting in waves, anthem beginning
- Gasps ripple through the balconies and cascade down to the main floor, opera glasses snapping up, hush sweeping like a wave
- Sudden lightning fork outside cracks through the iron-and-glass roof, blue-white flash illuminating every face for one frozen instant
- Hidden contraption descending from ceiling unfurling brass-and-canvas wings, crowd's collective intake of breath audible

ABSOLUTE BANS:
- mass violence / blood / gore / actual harm
- modern events / objects
- the main event itself (this AMPLIFIES, not replaces)

Output: ONE escalation per line. No numbering. No quotes.`,
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

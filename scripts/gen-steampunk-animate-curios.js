#!/usr/bin/env node
/**
 * Generator for STEAMPUNK_ANIMATE_CURIOS pool — strict-mandate replacement
 * for the existing mixed STEAMPUNK_CURIOS pool. Curios MUST be little
 * steampunk robots that mimic real living things OR novel mechanical-
 * organism designs, caught in a moment of motion / alive-looking. NEVER
 * jewelry, NEVER crowns, NEVER clocks-as-subjects, NEVER static-decorative.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/steampunk_animate_curios.json');
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !['brass', 'copper', 'mechanical', 'clockwork'].includes(w))
    .slice(0, 4)
    .join('|');
}

const RECIPE = `Generate ANIMATE STEAMPUNK CURIO descriptions for SteamBot — each entry is a single fantastical steampunk ROBOT that is ALIVE in motion. Each is ONE comma-separated line, 30-50 words.

CRITICAL — each curio MUST be ONE of:
1. A mechanical-robot mimicking a real living thing (animal, insect, sea creature, bird, plant-creature) — caught mid-action
2. A novel mechanical organism with original creature-design (chimera / impossible-anatomy / abstract-animate-form) — caught mid-action

ALWAYS in a moment of MOTION — never static-decorative. The robot is mid-step, mid-flutter, mid-feeding, mid-stalking, mid-curling-up, mid-spreading-wings, mid-grasping-prey, mid-peering-around. ALIVE-looking. The viewer feels it could move at any second.

ABSOLUTE BANS — DO NOT WRITE ANY OF THESE:
- NO crown / tiara / coronet / royal regalia
- NO jewelry / brooch / pendant / necklace / earring / ring / bracelet / locket
- NO Faberge eggs / decorative-eggs / fancy-eggs as primary subject
- NO clocks / chronographs / pocket-watches / wristwatches as primary subject
- NO static dioramas inside something else (no "inside a glass globe" / "inside a music box" framings)
- NO monocles / cuff-links / signet rings / cameos
- NO scrolls / books / quills / inkwells / writing instruments
- NO ceremonial cups / chalices / decorative vases
- NO weapons (no guns / swords / pistols / blades)

VARIETY MANDATE — distribute across batch:
- ~25% animal mimics (mechanical fox / brass falcon / copper red panda / clockwork octopus / brass crocodile / mechanical wolf / brass deer / etc.)
- ~25% insect/arachnid mimics (mechanical scarab / brass beetle / clockwork dragonfly / copper spider / mechanical butterfly / mechanical mantis / etc.)
- ~15% bird mimics (mechanical hummingbird / brass owl / clockwork heron / brass crow / etc.)
- ~10% sea-creature mimics (mechanical seahorse / brass nautilus that walks / clockwork eel / mechanical jellyfish that floats)
- ~10% plant-creature hybrids (mechanical venus-flytrap / brass-leafed sapling that walks / clockwork mushroom that breathes)
- ~10% novel mechanical organisms (impossible chimeras / abstract living machines / never-existed creatures)
- ~5% small mammal mimics (mechanical mouse / brass squirrel / copper hare)

Each entry has:
- The ROBOT IDENTITY (specific creature it mimics OR novel design)
- The MATERIALS (brass / copper / bronze / oiled-wood / steel — Victorian-industrial; NEVER plastic / silicone / modern)
- The ACTION (specific verb: stalking / fluttering / feeding / curling-up / spreading-wings / pouncing / peering / climbing / breathing)
- ALIVE-LOOKING DETAILS (glowing-amber-eyes / chest-panel-breathing-with-bellows / articulated-joints visibly moving / fur-or-feather-effect on the metal)
- Scale (small-creature-sized: mouse-to-fox-sized typically, occasional larger like wolf-sized)

GOOD examples (note: animate + creature + motion + materials):
- Brass falcon the size of a real bird, mid-launch from a perch, wings half-spread with articulated copper feathers fanning, glowing amber eye-jewels fixed on prey, hinged chest revealing pulsing spring-bellows of breath
- Mechanical fox the size of a real kit, brass-and-copper body in a stalking crouch with one paw raised mid-step, tail counter-balanced, gear-eyes narrowed, articulated muzzle drawn into a hunting snarl
- Clockwork dragonfly with paper-thin brass wings beating in a visible blur, copper-segmented thorax catching the light, hinged abdomen curving downward, eye-cabochons of black tourmaline tracking an unseen target
- Mechanical octopus of brass-and-bronze, all eight articulated arms in mid-curl as if grasping invisible prey, central glass-dome head revealing pulsing copper-coil heart, suction-cups along the underside individually hinged
- Novel mechanical organism — a brass-and-copper "lantern-snail" the size of a melon with translucent amber glass shell lit from within, articulated mantle slowly extending, two stalk-eyes of green-glass swiveling independently
- Clockwork hummingbird mid-hover before a brass-and-glass flower, wings beating in a visible motion-blur, copper throat-feathers catching dawn light, hinged beak poised in feeding position, internal gear-mechanism visibly spinning
- Brass scarab with iridescent enamel wing-cases beginning to lift, six articulated legs frozen mid-step, glowing amber eye-jewels facing the viewer, clockwork mandibles parted slightly as if about to speak

Output: ONE animate curio per line. No numbering. No quotes. No commentary.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 5000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} animate steampunk curios now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 30 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`appending: existing ${existing.length} — target ${TARGET}`);
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
  console.log(`Wrote ${deduped.length} entries to ${OUT}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

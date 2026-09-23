#!/usr/bin/env node
/**
 * Generate the FaeBot `autumn-seed-gathering` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the 9.7k-line shared
 * gen-faebot-pool.js) so this path build never contends with another agent on
 * that file — the acorn-boat-regatta / star-charting / honey-harvest
 * precedent. Infrastructure (signatureOf / dedupe / target-loop / numbered-list
 * parse / timestamped backup) is lifted verbatim from
 * gen-faebot-honey-pools.js so the pool files come out byte-compatible with
 * every other FaeBot seed JSON.
 *
 * THE PATH: fae working the autumn seed fall — catching, wrangling and hauling
 * the seeds that trees and weeds FLING INTO THE AIR. The hero is SEED
 * DISPERSAL PHYSICS: things that spin, sail, bolt, spring and CLING.
 *
 * ── THE GAP, MEASURED ACROSS EVERY FAEBOT SEED FILE (not assumed) ───────────
 *   FaeBot has written the word "seed" 1,013 times and "autumn" 627 times, so
 *   the obvious conclusion is that this path is already built. It is not, and
 *   the audit is the reason the path is worth building:
 *     • "dandelion" 109 hits — 95 of them AMBIENT GARNISH, and always in the
 *       same register: "drifting dandelion-seeds floating lazily through the
 *       mid-tier air", "one dandelion seed drifting across the whole still
 *       pool". The rest are a DWELLING (a seed-pod house shaped like a
 *       dandelion puff, `fae_villages`) or a creature name.
 *     • "thistledown" 55 hits — 100% ambient weather, every single one slow
 *       and windless: "drifting soft thistledown floating through still air in
 *       slow soft descent".
 *     • "samara" 11 hits — every one a HOUSE built inside a giant winged seed,
 *       or a garland worn on the shoulders. None is a seed in flight.
 *     • "milkweed" 18 hits — 16 are "spun milkweed floss" as a GARMENT
 *       MATERIAL (it has become the bot's default fae fabric: 6 hits in
 *       honey_harvester, 4 in starchart_astronomer). One pod is an arcade.
 *     • "burr" 4 hits — 2 are chestnut-burr BARK TEXTURE, 1 an animal
 *       grooming itself, 1 burrs caught in hair as decoration.
 *   So: FaeBot has shown seeds a thousand times as HOUSES, CLOTH and
 *   WALLPAPER, and has never once shown one LET GO. Nothing in this world has
 *   ever moved fast, and nobody has ever chased anything.
 *
 *   ⚠️ AND THE AUDIT NAMES THE PATH'S BIGGEST VOCABULARY RISK. The bot's
 *   existing seed register is "drifting / floating / lazily / gently / slow
 *   soft descent / still air" — so if these recipes reach for the natural
 *   words, the path becomes `enchanted_vista_weather` with a fae standing in
 *   it, which is the sober-render failure. Hence the MOTION LAW below: that
 *   whole vocabulary is banned outright and every verb is wind-driven.
 *
 * ── THE JARGON AUDIT, RUN BEFORE ANY POOL (playbook 28 + 47) ────────────────
 *   Lesson 47: run the layperson check on the PATH'S OWN TITLE first, because
 *   that word rides every prompt. Every result below is encoded as a ban.
 *     • "harvest"    → a wheat field, or a person in a white suit. Banned; it
 *                      lives only in the path key. (Same finding as
 *                      honey-harvest, independently re-derived.)
 *     • "gathering"  → A SOCIAL CROWD. This bot's own `fairy-swarm` pool is
 *                      literally built on `gathering_event`, so the collision
 *                      is live in FaeBot's vocabulary: "gathering" renders a
 *                      group of fae standing around, which is the exact
 *                      static failure this path exists to avoid. Hard ban.
 *     • "samara"     → NO LAYPERSON PRIOR AT ALL, so it collapses to a nearest
 *                      centroid (the KODAMA trap). Banned. The Flux-facing
 *                      form is "a winged maple seed", "a papery blade with a
 *                      fat nut at one end".
 *     • "maple key"  → A DOOR KEY. Banned.
 *     • "helicopter" → AN AIRCRAFT. This is the single most tempting word on
 *                      the whole path ("samaras spinning down like
 *                      helicopters") and it would render a literal aircraft in
 *                      a fae forest. Banned, with propeller / rotor / blade /
 *                      whirligig / pinwheel / turbine.
 *     • "parachute"  → A LITERAL PARACHUTE AND A SKYDIVER. The second most
 *                      tempting word. Banned; say "a crown of white down on a
 *                      thin stalk", and the fae HANGING off one is written as
 *                      a body action, never as a named parachute.
 *     • "clock"      → dandelion "clock" is the correct English name and a
 *                      clock face is one of Flux's hardest text priors
 *                      (playbook 12 measured numerals arriving on any dial no
 *                      matter how the clause is worded). Hard ban.
 *     • "floss"      → DENTAL FLOSS / candy floss. Banned as the hero noun;
 *                      the seed silk is "white silk" or "down". (It survives
 *                      nowhere in these pools, which also stops this path's
 *                      fae looking like honey-harvest's fae — see the costume
 *                      law.)
 *     • "packet" / "envelope" / "sachet" → a paper packet with a printed
 *                      label, and BrickBot measured "envelope" rendering a
 *                      carpet of literal paper mail envelopes in 2 of 5
 *                      renders. Deleted entirely, with the whole label class.
 *     • "pappus" · "achene" · "dehiscence" · "anemochory" · "dispersal" →
 *                      no prior, no picture. Banned.
 *     • "catkin"     → a cat. Banned.
 *     • "sow" / "sowing" / "seeding" / "broadcast" → farming, and "broadcast"
 *                      is a radio. Banned.
 *   The Flux-facing nouns are: seed · seed head · pod · dandelion head ·
 *   thistledown · white down · white silk · a winged maple seed · a hooked
 *   seed-ball · a rattling dry head.
 *
 * ── THE SEVEN TRAPS THESE RECIPES EXIST TO DEFEAT ───────────────────────────
 *
 *   1. THE NAKED-PUTTO PRIOR, which has already cost this bot a whole path and
 *      is the single most expensive known failure on FaeBot.
 *      acorn-boat-regatta got 5 of 6 final-round renders back as nude,
 *      wingless, faceless cherub dolls against a prompt naming petal-silk
 *      tunics, pointed ears and iridescent wings in every one. "Tiny" or
 *      "palm-sized" on a humanoid IS the prior, and at 1-2% of frame there is
 *      no resolution for cloth. star-charting beat it 0 of 26 and
 *      honey-harvest 6 of 6 FIRST TRY with the fix encoded in FIGURE_LAW: ONE
 *      fae LARGE and NEAR, ADULT proportions stated as BODY PLAN, a real
 *      designed costume, ears and wings named, and tiny / palm-sized / doll /
 *      child / bare banned outright.
 *
 *   2. ⭐⭐ THE MODEL ADDS BUT DOES NOT SUBTRACT — the newest measured law in
 *      the fleet and the one most specific to THIS path. Measured on FarmBot
 *      2026-09-23 with a true in-sentence control: one clause, both halves in
 *      the same sentence, same position, same prompt. "Woolly cuffs still at
 *      the ankles" (ADDITIVE) rendered 6 of 6 every round; "no fluff on the
 *      body anywhere" (SUBTRACTIVE) rendered 1. You cannot remove an expected
 *      feature from a strong prior by describing its absence.
 *      This path is made of absences. A seed head AFTER it has let go, a
 *      burst pod, a stripped stalk are all defined by what has GONE, and every
 *      one of those phrasings will render FULL. So ADDITIVE_LAW below requires
 *      a POSITIVE OBJECT that happens to lack the feature: not "a bare seed
 *      head" but "a seed head down to its woody knob with three last tufts
 *      still stuck on"; not "an empty pod" but "a pod split along one seam
 *      with its two halves curled back like a little boat".
 *
 *   3. SEED SCALE, and it is the reverse of the usual problem. The FarmBot bee
 *      finding transfers as a MECHANISM, not as a smallness rule — read this
 *      before editing SCALE_LAW, because the naive port deletes the best thing
 *      in the path. These fae are the size of a MOUSE (~70mm), so every real
 *      measurement of a real autumn seed scales up into something monumental
 *      and PHYSICALLY HONEST: a maple seed (~35mm) is as long as the fae's
 *      ARM; a milkweed pod (~100mm) is TALLER THAN SHE IS; a dandelion head
 *      (~40mm across) is as wide as she is tall. That is not a giant-prop
 *      defect, it is the premise. What transfers exactly:
 *        (a) SIZE TRACKS THE COUNT, NOT ANY SIZE WORD. "Three bees, each no
 *            bigger than a fingernail" gave BIRD-SIZED bees; "about a dozen"
 *            and "eighty or more" gave correct ones, because Flux gives each
 *            named subject a share of the frame. So every entry that puts
 *            seeds in the air states a real count, floor THIRTY, and a hundred
 *            or more for the small white tufts.
 *        (b) NO LONE SEED. A single subject has nothing to compete with and
 *            expands to fill its attention share. A hero seed is always ONE
 *            PICKED OUT OF a stated mass, never one seed alone.
 *        (c) THE RULER IS WELDED. An off-camera ruler (a fingernail, a coin)
 *            buys nothing and a free-floating in-frame one inflates too ("no
 *            bigger than a clover floret" gave a fist-sized clover AND
 *            bird-sized bees). This path has exactly three legal rulers, all
 *            welded to the fae's own body: her HEAD, her ARM, her CUPPED
 *            HANDS.
 *        (d) NO DETAIL EXEMPTION. The one you describe most is the one that
 *            comes out biggest — anatomical close-up beat a correct ruler
 *            every time, at ~3 giant bees per 6 renders, and stripping the
 *            exemption took them 3 of 5 to 0 of 6.
 *
 *   4. A WINDY OPEN-AIR PATH WITH SEEDS DRIFTING IS THE PUREST STOCK-PHOTO
 *      VISTA PRIOR THERE IS, and this is the path's `orchid-cloud-forest`
 *      moment: the premise itself imports the frame it must avoid. The crop
 *      clause alone does NOT beat a vista prior (measured on star-charting:
 *      the crop law reached 6 of 6 prompts every round and rendered in roughly
 *      6 of 22). What decides it is WHAT KIND OF THING the near structure is,
 *      and FRAMING_LAW encodes the measured split: a thing whose whole outline
 *      could be drawn renders as that whole object with the figures shrunk to
 *      passengers, while a thing that is PART OF A LARGER BODY renders as a
 *      near surface.
 *      ⚠️ THE PATH-SPECIFIC BITE: a dandelion, a thistle, a whole plant are
 *      all the BAD CLASS — "a dandelion" renders a botanical photograph. So
 *      the near structure is always a STALK or a BOUGH that RUNS OUT OF FRAME,
 *      and a head is only ever named as a head ON such a stalk, cropped.
 *
 *   5. READABLE TEXT — low risk, handled by DELETION. There are no signs or
 *      charts in this world and the one live risk is the SEED PACKET, which is
 *      a paper rectangle with printed words and is Flux's most available image
 *      for "gathered seeds". The whole packet / envelope / label / jar class is
 *      deleted from every layer, and seeds are carried only in fae vessels —
 *      and on this path those vessels are LIDDED, NETTED or WEIGHTED, because
 *      the comedy of the job is storing something that wants to fly away.
 *
 *   6. THE SOBER RENDER, which outranks every defect (the motto). Three
 *      levers, all measured elsewhere: the DELIGHT_LAW in every pool, a CHARM
 *      LAW written into every content pool rather than given its own axis
 *      (mushroom-apothecary proved the law beats the slot), and committed
 *      BACKLIGHT in autumn_light — down and silk and papery wings are
 *      FIBROUS and TRANSLUCENT, so a backlit tuft is a ring of white fire and
 *      backlit silk is a column of light. That is not decoration, it is the
 *      premise.
 *
 *   7. ⚠️ THE MODEL FACT THIS PATH IS DESIGNED AROUND. flux-1.1-pro is the
 *      only shippable model on FaeBot (23 of 23 delivered, zero E005, no
 *      signatures; the whole flux-2 family hits a content-filter wall on this
 *      bot's close-adult-fae content — star-charting 3 of 13, honey-harvest 20
 *      retries for 4 deliveries, flux-2-flex 1 hard fail in 2). And
 *      flux-1.1-pro has one measured weakness: IT DISCARDS SMALL HAND-HELD
 *      OBJECTS (star-charting's reading instrument rendered 0 of 22;
 *      honey-harvest's six-sided wax cups 2 of 6). So nothing load-bearing on
 *      this path is a small hand tool. Every premise element is LARGE by
 *      construction — an arm-length winged seed, a head-sized tuft, a pod
 *      taller than the fae, and her whole body committed to an action. The
 *      nets, sacks and pails are deliberately kept in the wardrobe menu and
 *      the world's-own-words block, NOT promoted to an axis. Do not "fix" a
 *      weak render by making a tool the hero; that is the one move this model
 *      is measured to ignore.
 *
 * CROSS-AXIS DESIGN (playbook 16 — a prose compatibility clause loses to a
 *   pool pick, so make it structural; there are ZERO tag filters on this path,
 *   so every pool must compose with every other by construction):
 *     • `seed_stand` owns the NEAR STRUCTURE and the crop. Every entry is a
 *       MIXED autumn stand (its own dominant stalk or bough plus other dry
 *       stems crowding in), which is what an autumn hedge-bank actually is and
 *       which dissolves every species contradiction: any source and any flight
 *       compose with any stand with no filter.
 *     • `seed_source` is written STAND-NEUTRAL: it may name only the pod or
 *       head itself, its own stem, the seeds in or on it, and a pair of hands.
 *       Never the footing, never the drop, never a light, never a garment.
 *     • `seed_work` is written SITE-NEUTRAL: only the fae's own bodies, the
 *       seeds, the air and wind, the stem or stalk underfoot, its rim, the drop
 *       beyond it, and a generically-named vessel or net.
 *   Verified by a pool sweep and a local dry-run over 40 composed briefs, not
 *   by prose.
 *
 * GENDER: the template is deliberately PRONOUN-FREE ("the fae"), and each
 *   gatherer entry carries its own gender through its pronoun, build, face and
 *   hair. The gender-lock lesson only bites when a hard-gendered TEMPLATE
 *   fights mixed seeds, so this needs no separate male path.
 *
 * Usage:
 *   node scripts/gen-seeds/faebot/gen-autumn-seed-pools.js \
 *     --pool faebot_seedfall_stand --target 25
 *
 * Output: scripts/bots/faebot/seeds/<pool>.json
 */

const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..', '..');
const { SONNET } = require(path.join(REPO, 'scripts', 'lib', 'models'));

function readEnvFile() {
  try {
    const lines = fs.readFileSync(path.join(REPO, '.env.local'), 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// SHARED LAWS — repeated verbatim into every recipe that could name the thing
// the law governs. Playbook lesson 44: a law omitted from ONE axis is the axis
// that breaks it, and satellite axes inherit vocabulary from the EXAMPLES you
// write, so every example below uses generic anchors.
// ─────────────────────────────────────────────────────────────

const DELIGHT_LAW = `⚠️ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER. This is DreamBot: the render exists to DELIGHT. An entry that is correct, clean and SOBER is a MISS, not a pass. Every entry must either show something a viewer has NEVER SEEN, or take the obvious version and REDRESS it as something more interesting. Ask of every entry: is this the obvious version of this idea, or the surprising one? Write the surprising one. "A fairy standing in autumn leaves" is the obvious version and it is banned outright.

⚠️ THE FEELING OF THIS PATH IS THAT THE WIND IS WINNING. This is not a calm autumn stroll and it is not a tidy chore. The fae are trying to catch, hold and carry things that are actively getting away from them — seeds that spin, sail, bolt, spring, stick fast and escape. Everything in this world wants to be somewhere else, and the job is half-lost at any given moment. Write toward a rodeo, not a picnic: nerve, haste, improvisation, comedy, and something already sailing off out of reach.

⚠️ ONE CHARM DETAIL PER ENTRY — one small clever thing the eye finds on second look, specific to THAT entry and no other (one boot already lost and sailing away on its own, a woven sack with a river pebble on the lid to stop it blowing off, a hooked seed-ball stuck to somebody's hair with a leaf and a beetle already attached to it, a whole armful of white down escaping upward in a slow column). Never a generic flourish.

⚠️ VIVID IS LITERAL — saturated committed AUTUMN colour. Russet, ember-orange, gold, amber, ochre, rose-gold, copper, plum, cream, bone-white, teal, indigo, emerald. Never muted, never washed-out, never tasteful-grey, never brown-on-brown, and never the words dark, dim, gloomy, murky, drab or dull.

⚠️ ADVENTUROUS BEATS STATIC — mid-action over posed, always. Somebody is running, reaching, hauling, hanging on, ducking, grabbing, losing their grip, or has just been knocked flat. Comedy is welcome and encouraged.`;

// ⭐ THE NEW MEASURED LAW (FarmBot, 2026-09-23) — and the reason it gets its
// own block on THIS path is that this path is MADE of absences: a head that
// has let go, a pod that has burst, a stalk that has been stripped.
const ADDITIVE_LAW = `⭐⭐ THE ADDITIVE LAW — THE MODEL ADDS BUT IT DOES NOT SUBTRACT. This is measured with a true in-sentence control: one clause, both halves in the same sentence at the same position in the same prompt. The ADDITIVE half — "woolly cuffs still at the ankles" — rendered 6 of 6 in every round. The SUBTRACTIVE half — "no fluff on the body anywhere" — rendered 1. You cannot remove an expected feature from a strong prior by describing its absence, however carefully you word it.

This law matters more on this subject than on any other, because half of what happens here is a thing having LET GO. Every one of these will render FULL, because each one is a description of an absence:
  ✗ "a bare seed head"   ✗ "a stripped stalk"   ✗ "an empty pod"   ✗ "a spent head"
  ✗ "a pod with its seeds all gone"   ✗ "leafless stems"   ✗ "picked clean"   ✗ "nothing left on it"
THE FIX IS TO NAME A POSITIVE OBJECT THAT HAPPENS TO LACK THE FEATURE. Write the thing that IS there:
  ✓ "a seed head down to a bare woody knob with three last tufts still stuck to one side"
  ✓ "a pod split along one seam with its two halves curled back like a little boat"
  ✓ "a stalk carrying a row of split pods, each one a pair of curled papery shells"
  ✓ "a head gone to a ring of white sockets with one tuft caught in it"
  ✓ "a stem ribbed and woody all the way up, its tip a hard knuckle where the head came off"
So: never write what has gone. Always write the shape that is left, as an object with its own material, colour and texture.`;

const MOTION_LAW = `⭐ THE MOTION LAW — and it exists because this bot's EXISTING vocabulary is the enemy here. FaeBot has already written seeds into 1,013 pool entries and every single one is passive garnish in the same register: "drifting dandelion-seeds floating lazily through the mid-tier air", "soft thistledown floating through still air in slow soft descent". That is ambient wallpaper, and a fae standing in front of it is the sober render this path exists to beat.

So THE WIND IS ALWAYS DOING SOMETHING and every seed is under way. BANNED WORDS, all of them: drifting · drift · floating · float · afloat · lazily · languid · unhurried · slowly · slow · gentle · gently · softly · soft descent · still air · motionless · hovering · suspended · hanging in the air · wafting · dreamily · serene · tranquil · placid · calm.
THE VERBS OF THIS PATH, and you use them: bolting · sailing · streaming · pouring · spinning · whirling down · tearing past · racing · whipping · skidding · tumbling · cartwheeling · flinging · springing · snapping open · bursting · escaping · hauling · clinging · snagging · catching · plucking · grabbing · dodging · ducking · scrambling. Say WHICH WAY the air is going and what it is doing to things: a gust that lays the whole stand over at once, a steady shove that streams everything one way, an updraught taking a whole column of white straight up, a sudden squall, air gone visible with the stuff in it.`;

const FAE_CRAFT_LAW = `⚠️ THE FAE-CRAFT LAW. This is a timeless fae world, centuries before our own. EVERY object and garment is fae-made from what the woodland gave: twig, leaf, petal, bark, nutshell, moss, lichen, grass cord, reed, straw, rush, seed, pine resin, wax, feather, down, dew, river pebble, snail shell, thorn, cork bark, amber.

⚠️ THE MODERN-NOUN TEST — apply it to EVERY noun you write: what is the most famous image of this word? If that image is modern, agricultural, industrial or human-scale, the word is BANNED and you recast the thing in fae-craft terms. This is not a style preference: a modern noun overrides every fae qualifier around it and Flux renders the modern thing at full human size. A fae "wedding" once rendered a full-size modern bride with the fairies as decoration.

⚠️ THE BANNED VOCABULARY OF THIS PATH IN FULL, and this is the most important block in the recipe, because most of these words are CORRECT and therefore tempting. Every one summons a different object:
  • "harvest" · "harvesting" · "crop" · "yield" · "farm" · "farmer" · "orchard" · "field" · "sow" · "sowing" · "seeding" · "broadcast" · "granary" · "silo" · "threshing" · "winnowing" — a wheat field or an agricultural scene, and "broadcast" is a radio.
  • "gathering" as a NOUN — A SOCIAL CROWD. This bot's own fairy-swarm path is built on a "gathering event" pool, so the collision is live in FaeBot's own vocabulary and it renders a group of fae standing about, which is the exact static failure this path exists to avoid. Say what the fae are DOING instead.
  • "samara" · "maple key" · "key" — "samara" has no layperson image at all so it collapses to a nearest centroid, and "key" is a door key. Write "a winged maple seed", "a papery blade with a fat nut at one end", "a twin-winged seed".
  • "helicopter" · "propeller" · "rotor" · "blade" (as a machine part) · "whirligig" · "pinwheel" · "turbine" · "windmill" · "glider" · "kite" — machines and aircraft, every one. "Spinning down like a helicopter" is the most tempting sentence available on this path and it renders an actual aircraft. Say "spinning flat as it comes down", "spinning on its own wing".
  • "parachute" · "parachutist" · "skydiver" · "paraglider" · "balloon" — a literal parachute canopy and a person in a harness. The white crown on a dandelion seed is "a crown of fine white down on a thin stalk" and a fae hanging off one is written as a BODY ACTION, never as a named parachute.
  • "clock" — "a dandelion clock" is the correct English name and a clock face is one of the hardest text priors there is; a dial arrives carrying numerals no matter how the clause is worded. Write "a dandelion head".
  • "floss" · "dental" · "candy floss" · "cotton candy" · "cotton wool" — write "white silk", "white down", "thistledown", "a crown of down".
  • "packet" · "seed packet" · "envelope" · "sachet" · "paper bag" · "label" · "tag" · "jar" · "bottle" · "tin" · "crate" — a paper rectangle with printed words on it. One bot measured "envelope" rendering a carpet of literal paper mail envelopes in 2 of 5 renders.
  • "pappus" · "achene" · "dehiscence" · "dispersal" · "anemochory" · "germination" · "propagate" · "specimen" · "botanical" — no picture at all, or a museum drawer.
  • "catkin" — a cat. "spider" · "spider-silk" · "spiderweb" · "cobweb" · "gossamer" · "web" — a web invites Flux to render the spider, and a large spider on a beauty-first fae path fails the bar. For fine strands write "a hair-fine grass fibre", "a thread of moss-cord", "a split reed fibre".
  • "seed-pod home" · "pod dwelling" · "seed-pod house" · door · window · hut · cottage · tethered by vines — this bot's fae_villages pool is full of HOUSES built inside giant seed pods, and that is a completely different path. Every pod here is a pod, growing on its own stem.
  • RECAST INSTEAD, and these are the proven forms: a dandelion head as wide across as the fae is tall · a crown of fine white down on a thin stalk · thistledown coming off in handfuls · a winged maple seed as long as her arm, a papery blade with a fat nut at one end · a pod split along one seam with its halves curled back · a slow column of white silk lifting out of a pod · a hooked seed-ball bristling all over, stuck fast to everything · a dry head with slits in its top that rattles when it is shaken · a woven-grass sack with its mouth pulled shut on a cord · a net of woven grass stretched on a bent hazel hoop · a folded-leaf pail with a leaf lashed over the top · a half nutshell with a river pebble laid on its lid.`;

const SCALE_LAW = `⭐ THE SCALE LADDER OF THIS WORLD — learn it before writing anything, because it IS the picture, and it is PHYSICALLY HONEST. These fae are the size of a MOUSE, so every real measurement of a real autumn seed scales up into something monumental:
  • the fae — the size of a mouse, and she is painted LARGE and NEAR
  • one seed tuft (the seed plus its crown of white down) — about as big across as the fae's own HEAD
  • one winged maple seed — as long as the fae's own ARM: a papery blade with a fat bead of a nut at one end
  • one hooked seed-ball — about as big as her HEAD, and bristling all over
  • one pod — TALLER THAN THE FAE HERSELF, split open along a seam like a little boat
  • one dandelion head still whole — as wide across as the fae is TALL, a globe of a hundred tufts
  • the dry stalk it all stands on — THICKER THAN HER WRIST, and it runs out of the frame
Every size in every entry comes off this ladder, stated against the fae's own body, never against anything off camera.

⚠️ NOTE ON WHAT SIZE IS CORRECT HERE, so nobody "fixes" this downward: a seed the size of the fae's head is not a giant-prop defect, it is the premise and it is the best thing in the path — these are people wrangling cargo their own size. What is forbidden is a seed BIGGER THAN THE FAE (except a whole pod, which is genuinely taller than she is), or one so big it stops reading as a seed.

⚠️ THE SCALE LAW — these parts are MEASURED on another bot over 18 renders, and they are the difference between a sky full of seeds and three absurd floating props.

  (a) SIZE TRACKS THE COUNT, NOT ANY SIZE WORD YOU WRITE. "Three bees, each no bigger than a fingernail" produced BIRD-SIZED bees, while "about a dozen" and "eighty or more" produced correct ones. Flux gives each named subject a share of the frame, so THREE of a thing means three BIG things. Every entry that puts seeds in the air states a real count: the floor is THIRTY, and for the small white tufts it is A HUNDRED — "a hundred tufts at once", "two hundred", "the whole air full of them", "thirty winged seeds coming down together".

  (b) ⭐ NO LONE SEED, EVER. A single named subject has nothing to compete with and expands to fill its attention share. If one seed matters — she is hanging off it, riding it, ducking it, wrestling it — it is ONE PICKED OUT OF A STATED MASS ("one of a hundred", "out of the stream of them"), never one seed by itself in the air.

  (c) THE RULER IS IN FRAME AND WELDED TO HER BODY. An off-camera comparison (a fingernail, a thumb, a coin, a mouse) buys nothing, and a free-floating in-frame ruler inflates too — "no bigger than a single clover floret" produced a fist-sized clover AND bird-sized bees. This path has exactly THREE legal rulers and every entry that names seeds uses one: "about as big across as the fae's own head", "as long as her arm", "filling her cupped hands".

  (d) ⭐ NO SEED GETS A DETAIL EXEMPTION, AND HERE IS WHY, so this survives editing: THE ONE YOU DESCRIBE MOST IS THE ONE THAT COMES OUT BIGGEST. Detail and size are the same dial. Measured: 20 of 30 entries stated a dozen-plus AND welded a ruler and THEN added "the nearest showing a furry amber-and-umber thorax in close detail" — and the anatomical close-up beat the ruler every time, at about three giant subjects per six renders. Stripping the exemption took them 3 of 5 to 0 of 6. So every seed in your entry is the SAME shape at the ruler's size, including the nearest. Describe the MASS (its shape, its direction, what it is doing) and you may describe one seed's MOTION or what a fae is doing WITH it — but never one seed's own anatomy, close-up, markings or paragraph. The phrases "the nearest showing", "in close detail", "picked out in detail", "rendered as carefully as" are FORBIDDEN.`;

const FRAMING_LAW = `⚠️ THE FRAMING LAW — it is not a camera instruction, it is a rule about WHAT KIND OF THING you are allowed to name. Measured over 22 renders on a sibling path: a stated crop reached 6 of 6 prompts every round and only rendered about 6 times, because the KIND of object decided every single frame.

  • A thing whose WHOLE OUTLINE COULD BE DRAWN — a dandelion, a thistle, a whole plant, a whole tree, a seed case, a boulder, a log lying on the ground — renders as THAT WHOLE OBJECT seen from outside, with the figures shrunk to passengers on it. A "dandelion" on its own renders a botanical photograph.
  • A thing that is PART OF A LARGER BODY and CANNOT be seen whole — a great dry stalk going up out of the top of the frame, a low bough running out of frame both ways, a bank of tangled stems climbing out of frame, a split trunk with its walls standing either side, a root mass — renders as a NEAR SURFACE with the figures large on it.
  • So every entry's near structure is a STALK, a STEM-THICKET, a BOUGH, a TRUNK or a ROOT BANK that FILLS ONE SIDE OF THE PICTURE AND RUNS OUT OF FRAME. A head, a pod or a seed-bunch is only ever named as something growing ON such a structure, at hand's reach, cropped by the frame — never as a whole plant standing in the open.
  • The drop or the distance beyond it is ONE THIN BAND along a border — far autumn canopy, mist, treetops, a haze of more stems — and nothing more.

  ⚠️ THIS PATH'S OWN WORST PRIOR: an open windy place with seeds in the air is the most-photographed image in this whole subject, and it is a wide golden field at sunset with soft floating specks. That frame is banned by construction. BANNED WORDS, every one of which renders it: meadow · field · pasture · grassland · prairie · moor · heath · hillside · hilltop · slope · clearing (as the whole frame) · open country · countryside · vista · panorama · sweeping view · overlook · valley below · rolling hills · layered hills · the world spread out below · miles of forest · horizon · horizon line · skyline · sunset · sunrise · golden hour · aerial · bird's-eye · plan view · from above looking down · wide shot · establishing shot · the whole plant · the whole tree · seen from a distance.`;

const FIGURE_LAW = `⚠️ EVERY FIGURE IS AN ADULT FAE, AND YOU MUST SAY SO — this is the hardest rule here and it has already cost this bot a whole path. An unstated small winged figure renders as a NAKED BABY CHERUB, because that is the nearest famous image, and words like "tiny" and "palm-sized" are exactly what summon it. A sibling path got 5 of 6 renders back as nude, wingless, faceless cherub dolls against a prompt that named petal-silk tunics, pointed ears and iridescent wings on every one. So:
  • ADULT PROPORTIONS, stated as BODY PLAN, never as an age word: long-limbed, slender, narrow-shouldered, a long neck, an adult's long legs, a grown face with real cheekbones and a real jaw. Roughly half the entries are women and half men, carried by the pronoun and by hair, build and face.
  • SCALE IS STATED ONLY AS "the size of a mouse" or by a welded in-frame ruler — never by the words tiny, little or palm-sized.
  • FULLY CLOTHED, in a real designed COSTUME that a costume designer made for this job — layered, tailored, built to stand out. Everyday plainness is a FAILED entry.
  • ALWAYS: pointed ears, real hair described by colour and how it is worn, and WINGS named by their colour and texture (moth-furred, dragonfly-clear, veined like a leaf, dusted like a wing scale).
  • NEVER these words: tiny · little · palm-sized · thumb-sized · doll · doll-like · child · childlike · baby · infant · toddler · cherub · putto · chubby · plump · round-faced · bare · nude · naked · topless · unclothed · wingless · winged baby.
  Animals in frame are ONE whole recognisable real creature each — a goldfinch, a jay, a dormouse, a squirrel, a moth, a beetle, a snail, a shrew — with real animal anatomy, never standing on two legs, never dressed, never given a human face.`;

const NO_TEXT_LAW = `⚠️ NO READABLE TEXT ANYWHERE. Flux renders lettering as gibberish and gibberish is a hard fail. On this path there is exactly ONE live risk and it is handled by DELETION, not by description: the most available image for "gathered seeds" is A PAPER SEED PACKET WITH PRINTED WORDS ON IT. A surface whose SHAPE is itself a writing surface cannot be made safe by describing it — calling a thing "blank" or "plain" is a negation CLIP cannot use, while naming the noun puts the shape in the picture.
  • So these objects do not exist in this world at all: packet · seed packet · envelope · sachet · paper bag · paper · card · label · tag · sticker · placard · sign · signboard · notice · plaque · nameplate · banner · slate · page · book · scroll · parchment · chart · map · diagram · ledger · jar · bottle · tin · crate.
  • Seeds are carried in FAE VESSELS ONLY, and on this path they are LIDDED, NETTED or WEIGHTED, because storing something that wants to fly away is the comedy of the job: a woven-grass sack with its mouth pulled shut on a cord · a net of woven grass on a bent hazel hoop · a folded-leaf pail with a leaf lashed over the top · a half nutshell with a river pebble laid on its lid · a hollow reed stoppered with pine resin · a snail shell · a cupped bark scoop · a basket with a flat stone on it.
  • BANNED WORDS: text · lettering · letters · word · words · writing · written · inscription · inscribed · script · character · characters · mark · marks · marking · markings · marked · glyph · sigil · rune · runic · symbol · stamped · engraved · etched · notation · number · numeral · digit · title · name · named on · labelling · recording · panel · panels · drawn on · painted symbol · pictogram · emblem · heraldic · crest.
  • Every flat surface in an entry must positively CARRY something instead of being called plain, because an undescribed flat surface is the one Flux covers in pseudo-lettering: a sack side carries its own coarse weave and a bulge of down pushing out through it · a basket lid carries a river pebble and a fallen leaf · a papery wing carries its own fanned veins · bark carries lichen in rosettes and a caught tuft · a leaf carries its veins and a bead of dew.`;

const POSITIVE_LAW = `⚠️ POSITIVE PHRASING ONLY. Describe what IS present. The words "no", "not", "without", "never", "nothing", "lacking", "empty of", "free of", "devoid" and "absent" must not appear anywhere in an entry — a negation is echoed straight into the render prompt and CLIP cannot negate it.

⚠️ ONE AXIS PER POOL. Stay strictly inside this axis. Do not describe the palette or what the light is doing unless this pool IS the light pool. Do not name a camera position, a lens, a viewer or a shot.`;

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — autumn-seed-gathering (7 axes, all generated)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // SEED STAND — THE STAGE. Leads with the NEAR STRUCTURE's
  // defining mass (playbook 4: the first-named-noun law applies
  // INSIDE a seed), and it is the whole defence against this
  // path's stock-photo vista prior (playbook 35 + 47). Every
  // entry is a MIXED stand, which is what makes every other
  // pool compose with it without a tag filter.
  // ════════════════════════════════════════════════════════
  faebot_seedfall_stand: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — THE PLACE, AT THE END OF THE YEAR, WHERE EVERYTHING IS LETTING GO AT ONCE. Each entry is ONE stand, 34-48 words. It is a STAGE with a floor and a wall of stems, not a view.

WHAT THIS POOL OWNS: the NEAR STRUCTURE and its mass, the other dry stems crowding in around it, WHERE the heads and pods stand relative to the fae, the surface the fae work from, the one thin band of distance, and the texture of stem and bark at hand's reach. One clause at most says what kind of seed grows there — another pool owns the pod's own detail, so do NOT describe a pod's seams, its contents or its colour here.

${FRAMING_LAW}

EVERY ENTRY MUST OBEY ALL FIVE:
  (a) OPEN with the near structure's defining mass and material — a dry stalk thicker than the fae's wrist going up out of the top of the frame, a low bough running out of frame both ways, a bank of tangled stems climbing out of frame — and say it FILLS ONE SIDE of the picture and RUNS OUT OF FRAME,
  (b) say it is a MIXED autumn stand: other dry stems, ribbed stalks, rattling heads or seed-bunches crowd in close around the main one, several kinds together, the way a hedge-bank at the end of the year actually is,
  (c) name WHERE the seed heads or pods stand relative to the fae — at her shoulder, overhead like lamps on their stalks, at head height along the bough, in a row up the stalk above her, hanging down within reach,
  (d) name the FOOTING the fae work from — a bent-over stalk lying flat as a walkway, a fork where two stems cross, a woody knuckle on the bough, a mat of fallen leaves packed between stems, a flat-topped stump, a loop of grass cord tied off as a handhold, a bough's bark shelf,
  (e) describe the TEXTURE at hand's reach, in detail nobody could see from across a valley — stems ribbed and grooved deep enough to grip, dry papery bracts still clinging along a stalk, bark furrows packed with caught white down, lichen in rosettes the size of a fingernail, a run of old sap gone amber and hard, a stem's hollow snapped end. And the drop or distance beyond is ONE THIN BAND along a border.

${ADDITIVE_LAW}
In THIS pool that matters most for the stems: never "bare stalks" or "leafless stems". Write the shape that IS there — "stalks ribbed and woody all the way up, each tipped with a hard knuckle where a head came off", "a row of split pods up one stem, each a pair of curled papery shells".

THE STAND MENU — every one of these is part of something bigger. Draw on these and invent well beyond them: a dry stalk thicker than the fae's wrist going up out of the top of the frame with its heads out overhead like lamps · a low maple bough running out of frame both ways with bunches of twin-winged seeds hanging down within reach · a bank of tangled stems climbing out of frame on one side where the earth has washed out · a thistle stalk grooved like a column filling one side, its heads breaking open in a row up it · a stand of ribbed stems so close they make a corridor of wall on one side · a great stalk snapped halfway and hanging down bent, making a ramp · the crossing of two fallen stalks lying over each other as a walkway · a hedge-bank of stems and burred heads pressing in from one side with a mat of leaves underfoot · a pod-bearing stalk leaning right over under the weight, its top out of frame · the fork of a low bough where a squirrel's caught tufts have gone in a drift · a rush bed of hollow stems standing thick, rattling, one bent into an arch · the hollow snapped end of a huge stem as a mouth to stand in.

${DELIGHT_LAW}

${MOTION_LAW}
In THIS pool that means: say what the wind is doing TO THE STAND — laid half over in one direction, stems bent and springing back, heads shaking, the whole bank moving one way — but the seeds in the air belong to another pool, so mention them in one short clause at most.

${FAE_CRAFT_LAW}

${SCALE_LAW}
In THIS pool, seeds in the air appear at most as one short clause with a stated count — no single seed described.

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns THE STAND ONLY. Do not describe the light, the palette, the fae, their costume, what they are doing, or a pod's own seams and contents.`,
    touchpoints: [
      "A dry stalk thicker than the fae's wrist goes up out of the top of the frame and fills one side, its rattling heads out overhead like lamps on their own stems, more ribbed stalks and burred heads crowding in close behind it, a bent-over stalk lying flat below as a walkway, deep grooves in the stem packed with caught white down, one thin band of russet canopy far off.",
      'A low maple bough runs out of frame both ways across the near picture with bunches of twin-winged seeds hanging down within reach, dry stems of three other kinds pressing up around it from below, a woody knuckle on the bough worn flat as standing room, bark furrows deep enough to grip with lichen rosettes the size of a fingernail along them, a thin band of gold treetops beyond.',
      'A bank of tangled stems climbs out of frame on one side where the earth has washed away, ribbed stalks and rattling heads laid half over one way by the wind, a mat of packed fallen leaves underfoot between them, roots coming through the bank in loops to hold, old sap gone amber and hard down one stem, one thin band of mist below.',
      'A thistle stalk grooved like a column fills the whole right of the picture and rises out of the top, its heads breaking open in a row up it at shoulder height and overhead, more stalks behind it tipped with hard knuckles where heads came off, a fork where two stems cross as a seat, dry papery bracts still clinging all down the stalk, a thin band of far stems hazing out.',
      'A great stem snapped halfway hangs bent right over and runs out of the bottom of the frame as a ramp, its hollow broken end a mouth wide enough to stand in, a whole stand of unbroken stems crowding close behind it with pods up them in rows, the snapped fibres splayed out pale and stringy, leaves drifted deep in the angle, a thin band of copper canopy beyond.',
      'A rush bed of hollow stems stands thick and close on one side and out of the top of the frame, rattling against each other, one stem bent right over into an arch to climb, ribbed stalks and split shells among them, a flat-topped stump between as a floor, grit and broken bract in every seam, a thin band of teal water-haze low down.',
    ],
    instructions: `Each entry is ONE stand in 34-48 words. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 48. MANDATORY — (a) OPEN with the near structure's defining mass and say it fills one side and runs out of frame, (b) other dry stems of several kinds crowding in, (c) where the heads or pods stand relative to the fae, (d) the footing, (e) the texture at hand's reach plus the distance as ONE thin band. Never a whole plant, never a panorama word, never "bare" or "leafless" stems. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ★ SEED SOURCE — the MECHANISM up close: the pod or head
  // itself and HOW IT LETS GO. The material money shot, and the
  // thing nobody has been shown at this size. This is where the
  // ADDITIVE LAW does its heaviest lifting, because every state
  // of a source AFTER release is an absence.
  // Written STAND-NEUTRAL so it composes with all 25 stands.
  // ════════════════════════════════════════════════════════
  faebot_seedfall_source: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — THE THING THE SEEDS COME OUT OF, UP CLOSE, AND HOW IT LETS GO. Each entry is ONE state of one pod, head or seed-bunch, 30-44 words. This is the material money shot and the mechanism nobody has actually been shown at this size: a seed head is a MACHINE for throwing its children as far as possible, and at fae scale you can see how it works.

WHAT THIS POOL OWNS: the pod or head's own SHAPE and MATERIAL, the seam or slit or socket it lets go through, the seeds still packed in or hooked on, and what a pair of hands is doing to it. Another pool owns the stand, so do NOT describe the stalk it grows on beyond its own stem, the footing, the drop, the light or a garment.

⚠️ THE MECHANISM LAW — this is the whole axis. Every entry says HOW THIS ONE LETS GO, as a physical mechanism you can see:
  • A SEAM THAT SPLITS: a pod opening along one seam, its two halves curling back like a little boat, packed white silk standing up out of it
  • A SPRING UNDER TENSION: a fat green pod swollen tight, its seams already lifting, ready to go off at a touch — and the same pod after, its shell coiled into a tight spiral
  • A GLOBE OF TUFTS: a head a hundred tufts thick, each seed on its own thin stalk under a crown of fine white down, packed so close the globe is solid
  • A SOCKET RING: a head down to a pale pitted ring of sockets, woody and neat as a honeycomb, with one tuft still caught in it
  • A SHAKER: a dry head, hard and ribbed, with slits opened in its top, that rattles and pours when it is tipped
  • HOOKS: a seed-ball bristling all over with fine hooks, every hook curled at its tip, gripping whatever touched it last
  • A HANGING BUNCH: a bunch of twin-winged seeds hanging in pairs from one stem, each a papery blade with a fat bead of a nut at one end, the whole bunch clattering
  • A BURST AND A DRIFT: a shell wide open with a slow column of white still lifting out of it faster than anybody can bag it

${ADDITIVE_LAW}
⚠️ THIS POOL IS WHERE THAT LAW LIVES OR DIES, because most states here happen AFTER something has gone. Every single one must be written as the positive object that is LEFT: a ring of pale sockets, a pair of curled papery shells, a coiled spring of a shell, a woody knob with three tufts still stuck on, a hard ribbed head with slits in its top. If you catch yourself writing "empty", "bare", "spent", "stripped" or "all gone", you have written an entry that will render FULL — rewrite it as a shape.

⚠️ THE TRANSLUCENCY LAW, because this is the second thing nobody has seen: DOWN AND SILK AND PAPERY WINGS ARE FIBROUS AND TRANSLUCENT. Say what light does to them — a crown of down going to a ring of white fire with the light behind it, a column of silk lifting out of a shell lit through like smoke, a papery wing glowing tan and rose with its veins standing dark through it, a whole globe of tufts lit into one soft sphere.

${DELIGHT_LAW}

${SCALE_LAW}
The sizes that matter in THIS pool: one tuft about as big across as the fae's own head · one winged seed as long as her arm · one hooked seed-ball as big as her head · one pod taller than she is · one whole dandelion head as wide across as she is tall.

${FAE_CRAFT_LAW}

${MOTION_LAW}
In THIS pool that means: the seeds leaving are under way, never adrift — pouring, lifting, streaming, springing, clattering, escaping.

${FIGURE_LAW}
A figure appears here only as a pair of hands doing one thing to the pod or head, one clause at most, because another pool owns the fae herself.

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns THE POD OR HEAD ONLY. Do not describe the stand, the footing, the drop, the fae's costume, or the direction and colour of the light beyond what it does passing through down, silk and papery wings.`,
    touchpoints: [
      "A pod taller than the fae split along one seam, its two halves curled right back like a little boat, packed white silk standing up out of it in a solid block and already lifting off the top in a slow column, one half's inner face smooth and pearl-pale.",
      'A dandelion head as wide across as the fae is tall, a hundred tufts thick and still solid, each seed on its own thin stalk under a crown of fine white down, the whole globe lit through from behind into one soft sphere of white fire, two hands closing on the near side of it.',
      'A head down to a pale pitted ring of sockets, woody and neat and regular, with one last tuft still caught in it at an angle, the ring itself catching a bright rim of light and the stem below it ribbed hard and green.',
      'A fat pod swollen tight as a spring with its seams already lifting along both sides, and beside it on the same stem the shell of one that has gone, coiled into a tight papery spiral with a seed still stuck in the coil.',
      "A bunch of twin-winged seeds hangs in pairs from one stem, each blade as long as the fae's arm, papery tan with its veins standing dark through it where the light comes through, the fat bead of a nut at every base, the whole bunch clattering together.",
      'A hard ribbed head with three slits opened along its top, tipped right over by two hands so the seeds pour out of the slits in a fast stream, the head itself dry and grooved and the colour of old bone.',
    ],
    instructions: `Each entry is ONE state of one pod, head or seed-bunch in 30-44 words. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 44. MANDATORY — (a) the pod or head's own shape and material, (b) HOW IT LETS GO, as a visible mechanism (a split seam, a spring, a socket ring, slits, hooks, a hanging bunch), (c) what the light does passing through the down, silk or papery wing, (d) one clever charm detail. Every state written as the POSITIVE SHAPE THAT IS LEFT, never as what has gone. Never "samara", "maple key", "helicopter", "parachute" or "clock". Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ★ SEED FLIGHT — THE AIR. The differentiator axis: no other
  // FaeBot path can show this. Carries the COUNT LAW (the scale
  // defence) and the WIND, which is why there is no separate
  // `air` axis — you cannot render wind, you render what it does
  // to things, so the wind lives here and costs no order item.
  // ════════════════════════════════════════════════════════
  faebot_seedfall_flight: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — THE AIR FULL OF SEEDS UNDER WAY. Each entry is ONE state of the air, 26-40 words. THIS IS THE AXIS THE WHOLE PATH EXISTS FOR, and it is the one thing no other picture in this world has ever shown: seeds actually MOVING, and the different ways they do it.

${MOTION_LAW}

WHAT THIS POOL OWNS: HOW MANY seeds are in the air, HOW BIG they are (by a ruler welded to the fae's body), WHAT KIND they are, HOW EACH KIND MOVES, and WHICH WAY THE WIND IS TAKING THEM. Nothing else.

⚠️ THE FOUR FLIGHTS, and each one moves completely differently. Every entry commits to one or two of them and says what that motion LOOKS like:
  • THE SAILORS — seeds under a crown of white down, each about as big across as the fae's head. They do not fall; they go UP, sideways, and away, a hundred at once, streaming one way on a shove of air, going over in a mass, riding an updraught straight up in a slow column.
  • THE SPINNERS — winged seeds as long as the fae's arm. They spin flat and fast on their own wing as they come down, thirty at once, whirling past at head height, skidding sideways on a gust, cutting down through the frame like thrown blades.
  • THE BOLTERS — pods that go off. A seam lets go and flings its seeds hard and flat, all at once, faster than the eye, a spray of them across the picture, a shell coiling itself up behind them.
  • THE CLINGERS — hooked seed-balls the size of the fae's head. These do not fly at all: they hitch. They are stuck fast to cloth, fur, hair and wings, in threes and fours, hooks dug right in, and they come off only with somebody's whole weight behind the pull.

⚠️ AND SAY WHAT THE AIR ITSELF IS DOING, because the wind is only visible in what it carries: a steady shove streaming everything one way in parallel · a gust that lays the stand over and throws the whole lot up at once · an updraught taking a column straight up out of frame · air gone thick and visible with the stuff in it · a lull where the whole mass is still going one way but level · a squall coming in that has already flipped everything over.

${DELIGHT_LAW}
For this pool specifically, THE WIND IS WINNING and the air should look like a job going wrong: more of it escaping than caught, a whole armful gone up at once, the mass pouring past faster than anybody can work.

${SCALE_LAW}

${ADDITIVE_LAW}
In THIS pool that means: never describe air that has "no seeds left in it" or a stand "stripped of its down". Describe the mass that IS there and which way it is going.

${FIGURE_LAW}
A figure appears here only as a body the mass is going past, around or into, one clause at most.

${FAE_CRAFT_LAW}

${FRAMING_LAW}
In THIS pool that means: the seeds go OUT OF FRAME rather than off toward a distance, and you never name a view, a horizon, a field or anything spread out below.

${POSITIVE_LAW}
This pool owns THE SEEDS IN THE AIR ONLY. Do not describe the stand, a pod's own seams, the fae's costume, the light or the palette.`,
    touchpoints: [
      "Two hundred white tufts stream past all one way on a steady shove of air, each crown about as big across as the fae's own head, every one the same, the whole mass going over level and out of frame in parallel.",
      "Thirty winged seeds come down together, spinning flat and fast on their own wings, each blade as long as the fae's arm, all the same, cutting through the picture at head height and skidding sideways where the air shifts.",
      'A gust lays the whole stand over at once and throws a hundred tufts up together, all of them turning as they go, each the same size as the next, the air gone thick and visible with them.',
      "An updraught takes a slow column of white straight up out of the top of the frame, four hundred of them deep, each one the same crown about as wide as the fae's head, the column twisting as it climbs.",
      "A pod lets go and flings a spray of flat seeds hard across the picture all at once, thirty of them in one line, each about as long as the fae's finger, while a hundred tufts from further back stream the other way behind them.",
      "Three hooked seed-balls, each about as big as the fae's head and bristling all over, are stuck fast in cloth and wing and hair with their hooks dug right in, while two hundred white tufts pour past behind them.",
    ],
    instructions: `Each entry is ONE state of the air in 26-40 words. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 40. MANDATORY — (a) a stated count, floor THIRTY and A HUNDRED for the white tufts, (b) one welded in-frame ruler against the fae's head, arm or cupped hands, (c) a statement that every seed of a kind is the same size, (d) WHICH KIND and HOW IT MOVES, committing to one or two of the four flights, (e) what the air itself is doing. FORBIDDEN: any single seed given its own anatomy or close-up; a lone seed in the air; a count under thirty; an off-camera ruler; and every one of the banned motion words (drifting, floating, lazily, slowly, gently, softly, still air, hovering, suspended, wafting). Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ★ SEED WORK — THE BEAT, merged with the figure into one
  // action-first output-order item. honey-harvest measured this
  // exactly: a beat at output-order item 3 landed at 48-58% of
  // the emitted prompt (playbook 43's dead zone) and rendered
  // 0 of 6; merging it with the fae into one action-first phrase
  // and putting the VERB in front of the prefix took it to 6/6.
  // Names its ACTOR in the first five words (playbook 25).
  // Written SITE-NEUTRAL (playbook 16, structurally).
  // ════════════════════════════════════════════════════════
  faebot_seedfall_work: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — WHAT IS HAPPENING RIGHT NOW. Each entry is ONE beat, mid-action, 22-36 words. This is the axis that makes the picture a STORY instead of a display, and the feeling to write toward is a rodeo: these are people trying to catch, hold and carry cargo their own size that is actively getting away from them on the wind.

⭐ NAME YOUR ACTOR IN THE FIRST FIVE WORDS. Measured on another bot: "a cup held out from the next deck" drew a giant disembodied hand and forearm, duplicated at two scales. So every entry opens with a whole named figure — "the near fae", "she", "he", or "a second grown fae close beside her" — never with a bare hand, arm or gesture.

⭐ THE NEUTRALITY LAW (load-bearing — it is what makes every beat fit every stand). A beat may refer ONLY to: the fae's own bodies and limbs, the seeds and the down and the pods as unnamed-species things ("a tuft", "a winged seed", "a hooked ball", "the down", "a pod", "a head"), the wind and the air, the stem or stalk underfoot, its rim or edge, the drop beyond it, and a generically-named vessel or net ("a sack", "a net", "a pail", "a shell"). It must NEVER name a specific plant species, a specific tree, a garment, a colour, a light, a time of day or a place — those belong to other axes and naming one here would contradict whatever they rolled.

⚠️ ONE OR TWO FIGURES, BOTH LARGE AND NEAR. This picture has ONE hero fae painted big in the foreground, and a beat may add a SECOND grown fae close beside her, also large. It may never call for a crowd, a line, a team of many, or figures in the distance — another pool owns the ones further back.

THE BEAT MENU — draw on these and invent well beyond them, and prefer the surprising one: hanging off a sailing tuft by both hands with her boots kicked right up, going wherever it goes · running flat out underneath one with a net held up over her head · ducking hard as a winged seed spins past at head height, hair flying · riding a winged seed down with her wings shut and both arms wrapped round its blade, leaning to steer · with both arms round a whole armful of down that is escaping upward faster than she can hold it · bracing one boot on a second fae's back and hauling a hooked ball out of her wing with both hands · flicking a swollen pod with one fingertip and taking the whole spray of it straight in the face · sitting on a sack to hold the lid down while it bucks under her · shaking a rattling head upside down over a cupped leaf with both hands and her whole shoulders in it · thrown flat on her back by a gust with the air above her solid white · holding the mouth of a sack shut with both fists while it fills and swells · picking hooked balls off a second fae one at a time and lobbing them away over the edge · caught mid-leap after a tuft with one hand out and nothing under her yet · wrapped in a whole drift of down to the shoulders, only her face and one arm out of it · hauling a loaded sack along a stem with a cord over one shoulder, leaning right into it · grabbing a second fae's ankle as the wind takes her, both of them stretched out flat · climbing a stem hand over hand with a full net swinging from her teeth · spitting out a mouthful of down mid-sentence while still holding on to something · stamping a lid down onto a pail with one boot while the down pushes out at every edge · reaching right out over the drop after something already gone.

${DELIGHT_LAW}
For this pool specifically: the body must be doing something a viewer can read instantly and would not have thought of. A figure simply standing and looking is a FAILED entry. Effort, haste, nerve, improvisation, comedy, total absorption and outright failure are all welcome — a beat where the seed WINS is one of the best available.

${MOTION_LAW}

${ADDITIVE_LAW}
In THIS pool that means: never write a beat around something being "gone" or a hand being "empty" — write the shape of the body and what it is on, holding or reaching for.

⚠️ SHORT LAWS, because this axis must not duplicate the others: if you mention seeds in the air, say many of them and give no single seed extra detail. Never name a view, a horizon, a field or anything below except "the drop". Every figure is a grown adult fae, fully clothed, wings and pointed ears — never tiny, little, palm-sized, doll-like, a child, a cherub, or bare.

${POSITIVE_LAW}
This pool owns THE ACTION ONLY.`,
    touchpoints: [
      'The near fae hangs off a sailing tuft by both hands with her boots kicked right up behind her, going wherever it takes her, her whole body stretched out long.',
      'She runs flat out underneath one with a net held up over her head in both hands, head tilted right back, watching it and not the ground.',
      'He has both arms round a whole armful of down that is escaping upward faster than he can hold it, his chin buried in it and his wings beating.',
      "She braces one boot on a second grown fae's back and hauls a hooked ball out of her wing with both hands and her whole weight, both of them leaning opposite ways.",
      'He flicks a swollen pod with one fingertip and takes the entire spray of it straight in the face, eyes shut, hand still out.',
      'She sits square on a bucking sack to hold its lid down, both boots braced and both fists gripping the rim, plainly losing.',
    ],
    instructions: `Each entry is ONE mid-action beat in 22-36 words. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 36. MANDATORY — (a) a whole named figure in the first five words, (b) refers to nothing but the fae's bodies, the seeds and down and pods as unnamed-species things, the wind, the stem underfoot, its rim, the drop and a generically-named vessel or net, (c) instantly readable and not the obvious version, (d) mid-action, never posed, (e) one or two figures at most, both close and large. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // GATHERER — the ONE fae who is LARGE and NEAR. The whole
  // defence against the naked-putto trap. Appearance + costume
  // ONLY: the action is a separate axis so a costume entry can
  // never dictate a pose (the SteamBot captain-coat lock).
  // ⚠️ DELIBERATELY DIFFERENTIATED from its two siblings: the
  // audit found "spun milkweed floss" in 6 honey_harvester and 4
  // starchart_astronomer entries — it has become the bot's
  // default fae fabric, so it is BANNED here. This path's
  // wardrobe idea is its own: cloth chosen to SHED BURRS.
  // ════════════════════════════════════════════════════════
  faebot_seedfall_gatherer: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — THE ONE FAE PAINTED LARGE AND NEAR. Each entry is ONE adult fae, described as appearance and COSTUME only, 34-48 words. This figure is painted big in the foreground at full detail, so every word of cloth and hair and face actually renders.

${FIGURE_LAW}

⭐ THE COSTUME IDEA OF THIS PATH, AND IT BELONGS TO NO OTHER — CLOTH CHOSEN TO BEAT THE SEEDS. Working the seed fall means two things are against you: hooked balls that grip anything with a nap, and down that sticks to everything and gets in your mouth. So this wardrobe is DESIGNED for it, and that is what tells the story:
  • SMOOTH, TIGHT, SLICK OUTER LAYERS that a hook cannot grip — oiled leaf-cloth, waxed leaf scales lapped like tiles, polished bark plate, tight-woven rush, burnished beetle-shell panels, a hard-glazed petal cape, smooth-corded grass twill
  • THINGS THAT SHUT — a hood drawn tight and tied under the chin, a deep collar turned up over the mouth and nose, cuffs strapped shut at the wrist, high boots laced to the knee, a scarf wound twice across the face, close goggles of polished amber discs bound with cord
  • ONE THING THAT BELONGS TO THE JOB hung at the belt or over the shoulder — a woven-grass sack rolled at the hip, a bent hazel hoop with its net furled, a folded-leaf pail hooked on, a coil of grass cord over one shoulder, a flat blade of shell for cutting stems, a comb of thorns for raking down out of cloth, a pebble on a thong as a weight
  • AND THE JOKE IS AVAILABLE AND WELCOME: one fae in the softest, nappiest, most beautiful thing she owns, absolutely furred over with caught down and hooked balls from the knees up.
  Materials BANNED on this path, because its two sibling paths have already used them into the ground and this fae must not look like theirs: spun milkweed floss, felted down as an outer layer, quilted moss-velvet, owl-down trim. Down and fur may appear ONLY as the joke above — a fae who chose wrong.

VARIETY LAW — across the pool vary: build (rangy, compact, broad-shouldered, willowy), hair (colour, and how it is worn for a job in a wind — pinned up out of the way, braided down and bound, cropped, wound in a cloth, tied back hard with cord), face (cheekbones, jaw, brows, a long nose, a wide mouth, laugh-lines), wing type (moth-furred, dragonfly-clear, leaf-veined, scale-dusted, narrow and swift, broad and soft) and outfit silhouette (long coat, short jerkin, hooded cape, wrapped shawl, sleeveless over layers, strapped tunic). Roughly half women, half men. Skin tones range across the fae's own natural palette — warm umber, birch-pale, russet, olive-fair, deep bronze, ash-fair — described as tone only, never by any real-world nationality.
COLOUR IS SATURATED AND AUTUMN-CHOSEN: ember-orange, russet, gold, ochre, plum, copper, cream, bone-white, teal, indigo, emerald.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}

${ADDITIVE_LAW}
In THIS pool that means: never describe a garment by what it lacks. "Smooth waxed leaf-cloth lapped like tiles" is the shape; "cloth with no nap for a hook to catch" is an absence and it will render a fuzzy coat.

${NO_TEXT_LAW}
Nothing on the costume carries a picture or a symbol: a garment is made interesting by its CUT, its LAYERS, its COLOUR, its trim and its texture.

${POSITIVE_LAW}
This pool owns THE FAE'S APPEARANCE AND COSTUME ONLY. Do not describe what she is doing, her pose, the stand, the seeds, the wind, the light or the palette of the scene.`,
    touchpoints: [
      'A rangy grown fae with a long jaw and heavy dark brows, ash-blond hair cropped short and pushed back, pointed ears, moth-furred wings in grey and cream folded high behind him, in a long coat of oiled leaf-cloth the colour of ember-orange with its deep collar turned up over his mouth, cuffs strapped shut, a woven-grass sack rolled at the hip.',
      'A willowy grown fae, long-necked and narrow-shouldered with high cheekbones and a wide mouth, warm umber skin, copper hair braided tight and bound with cord, pointed ears, dragonfly-clear wings shot with teal, in a jerkin of waxed leaf scales lapped like tiles over a long cream underlayer, high bark boots laced to the knee, a bent hazel hoop with its net furled over one shoulder.',
      'A compact grown fae with a broad flat nose and deep laugh-lines, birch-pale skin, russet hair wound up hard in a teal cloth, pointed ears, leaf-veined wings in rust and gold, in a hooded cape of polished bark plate drawn tight and tied under the chin over an indigo tunic, close goggles of polished amber discs pushed up on her forehead.',
      'A broad-shouldered grown fae with a strong straight nose and a short beard, deep bronze skin, black hair tied back hard with grass cord, pointed ears, scale-dusted wings in bronze and green, in a strapped tunic of burnished beetle-shell panels over gold tight-woven rush sleeves, a coil of grass cord across his chest, a flat shell blade at the belt.',
      'A tall grown fae with a fine-boned face and a small chin, olive-fair skin, silver-white hair pinned up in a knot with three thorns, pointed ears, narrow swift wings clear as glass with plum-dark veins, in a hard-glazed petal cape in plum over a smooth teal grass-twill bodice, a rush scarf wound twice across her face and pulled down under her chin.',
      'A slight grown fae with a long nose and steady grey eyes, ash-fair skin, mousy hair cut bluntly at the jaw, pointed ears, broad soft wings furred like a moth in cream and rust, in the softest nappiest gold velvet-moss coat she owns and absolutely furred over with caught white down and three hooked balls from the knees up.',
    ],
    instructions: `Each entry is ONE adult fae in 34-48 words, appearance and costume only. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 48. MANDATORY — (a) adult body plan stated physically, (b) face, (c) hair colour and how it is worn, (d) pointed ears, (e) wings by colour and texture, (f) a layered tailored invented costume in saturated autumn colours, built from SMOOTH SLICK materials a hook cannot grip, (g) one thing that shuts, and one item that belongs to the job. At most two entries in twenty-five may be the joke version (the softest nappiest coat, furred over with caught down and hooked balls). Never spun milkweed floss, felted down, quilted moss-velvet or owl-down trim. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ★ AUTUMN LIGHT — owns the palette. Down, silk and papery
  // wings are FIBROUS and TRANSLUCENT, so this axis commits to a
  // DIRECTION: the light comes from behind or through, and the
  // entry names what it passes through and what it lands on.
  // Two named colours per entry is the measured anti-monochrome
  // lever. And it is doing a second job on this path: FaeBot's
  // bot-wide suffix pushes green ("green-mana lineage", "dreamy
  // dappled light"), so the AUTUMN palette has to be carried by
  // a pool that reaches the prompt, not left to the wrapper.
  // ════════════════════════════════════════════════════════
  faebot_seedfall_light: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — WHAT THE LIGHT IS DOING. Each entry is ONE committed lighting state, 24-38 words. It owns the entire palette of the picture, and its job is the thing that makes this path worth building: DOWN, SILK AND PAPERY SEED WINGS ARE FIBROUS AND TRANSLUCENT, so light coming from BEHIND them turns a crown of down into a ring of white fire and a column of silk into a column of light.

THE THREE LAWS OF THIS AXIS:
  (a) COMMIT TO ONE DIRECTION AND SAY IT, AND IT IS USUALLY FROM BEHIND. A hard low shaft coming in through a gap in the stems from behind the seeds in the air · the canopy above lit so the light comes down through it · one narrow shaft through a gap striking the drifting mass edge-on · late almost-level autumn sun coming in under the canopy from one side · the sky beyond the stand gone bright so everything nearer reads against it. Never "ambient", never "soft even light", never a light with no stated source or side.
  (b) SAY WHAT IT PASSES THROUGH AND WHAT IT LANDS ON. Light is a glow, a patch, a pool, a streak or a rim ON a real thing, never a free-floating mood. Through: a crown of white down, a column of silk, a papery seed wing, a sheet of russet leaf, the hollow of a stem, a fae's own wing. Onto: a ribbed stem, a shoulder and the side of a jaw, the coarse weave of a sack, a caught tuft on bark, the mat of leaves underfoot, the rim of the footing.
  (c) TWO NAMED SATURATED COLOURS THAT GENUINELY DIFFER, and at least one of them warm. THE PALETTE OF THIS PATH IS AUTUMN and it must be carried here: ember-orange against deep emerald shade · russet and gold against teal · rose-gold against indigo · ochre and copper against blue-grey · amber against plum shade · bone-white and gold against dark green. The words dark, dim, gloomy, murky, drab, dull, washed-out and grey are banned. Never one single hue over everything, and never brown on brown.

THE LIGHT MENU — draw on these and invent well beyond them: a hard low shaft through a gap in the stems from behind the mass so every crown of down burns as a ring of white fire against deep emerald shade · the whole canopy overhead lit hot russet and gold so the scene stands in warm reflected colour with teal shade underneath · one narrow shaft striking a column of silk so it lights straight through like smoke while everything around it stays cool · late almost-level sun from one side putting a gold rim on every papery wing in the air and a long ember stripe down a ribbed stem · the sky beyond the stand gone bright bone-white so the stems, the seeds and the fae all read as warm shapes against it · light coming down through a sheet of russet leaf so the whole underside of the scene is lit copper · a low shaft catching only the down caught on bark and cloth so the fae is outlined in a hundred small bright points · one burning patch of gold thrown onto the mat of leaves underfoot with the rest in cool blue shade · the air gone thick and gold with the stuff in it so the light arrives grainy and the far stems haze out rose · rain just stopped and every wet stem throwing back one hard bright highlight against saturated green · the light coming through a fae's own wing so it glows amber with its veins dark through it · a squall's cloud edge letting one sheet of copper light in low under it while the rest goes indigo.

${DELIGHT_LAW}

${FRAMING_LAW}
In THIS pool that means: the light may be described arriving through stems, leaves, a gap or past a bough, and you may say the sky beyond is bright — but never describe a view, a distance, a horizon, a field or anything spread out below, and never a sunset or a golden hour.

${SCALE_LAW}
In THIS pool, seeds appear at most as a lit edge on a stated mass of them — no single seed described.

${MOTION_LAW}

${POSITIVE_LAW}
This pool owns THE LIGHT AND THE PALETTE ONLY. Do not describe the stand's shape, a pod's seams, the fae, their costume or what anybody is doing.`,
    touchpoints: [
      'A hard low shaft comes in through a gap in the stems from behind the mass, so every crown of white down burns as a ring of fire against deep emerald shade, and one ribbed stem throws back a long bright streak.',
      'The whole canopy overhead is lit hot russet and gold, so the scene stands in warm reflected colour with cool teal shade underneath, and the coarse weave of a sack glows ochre where it catches it.',
      'One narrow shaft strikes a rising column of silk so it lights straight through like smoke, rose-gold and grainy, while everything around it stays cool blue-grey and hard-edged.',
      'Late almost-level sun from one side puts a hot gold rim on every papery wing in the air and lays a long ember stripe down a ribbed stem, everything out of its reach going deep indigo.',
      'The sky beyond the stand has gone bright bone-white, so the stems and the seeds and a shoulder all read as warm russet shapes against it, with one patch of gold on the leaves underfoot.',
      'A low shaft catches only the down caught on bark and cloth, so a jaw and a shoulder are outlined in a hundred small bright points of white against plum shade.',
    ],
    instructions: `Each entry is ONE committed lighting state in 24-38 words. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 38. MANDATORY — (a) ONE stated direction and source, usually from behind, (b) what the light passes THROUGH and the exact surface it lands on, (c) TWO named saturated colours that genuinely differ, at least one warm, from the AUTUMN palette, (d) one clever charm detail. Zero "dark" vocabulary, zero ambient light, zero view or horizon words, zero sunset or golden hour. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // BYSTANDER — (gated ~0.5) the second little story, smaller
  // and further back. star-charting's `company` axis and
  // honey-harvest's `onlooker`, both of which worked: this is
  // where the comedy lives, and the hero-protection clause is
  // what keeps the near fae the hero.
  // The animals here are chosen for the subject: a goldfinch
  // EATS thistle seed, a jay and a dormouse are burying and
  // hoarding — real competitors for the same cargo.
  // ════════════════════════════════════════════════════════
  faebot_seedfall_bystander: {
    format: 'simple',
    theme: `FAEBOT AUTUMN SEEDFALL — THE SECOND LITTLE STORY, SMALLER AND FURTHER BACK. Each entry is ONE companion, animal or small group beyond the near fae, 22-36 words. The near fae stays the hero of the picture, so everything here is SMALLER and set BEHIND or further along.

THE HERO-PROTECTION LAW — every entry states that this is smaller and further off than the near fae: further along the same stem, back at the rim, out on the bough behind, down in the tangle below, already on the way down, coming up from underneath. ONE animal, or two or three fae at most. They must be doing something the eye reads as a second little story inside the picture.

⭐ THE COMPETITORS. The best animals on this path are not spectators, they are RIVALS FOR THE SAME CARGO, and a viewer who knows that gets a second joke: a goldfinch hanging upside down off a head eating the seed straight out of it · a jay with its beak already full · a dormouse with both cheeks packed out solid, unable to shut its mouth · a squirrel out on the bough behind with one seed in its paws and eight more stuffed in · a shrew going through the drift of down underfoot on business of its own · a beetle walking off with a single seed bigger than it is. Real animal anatomy, never standing on two legs, never dressed, never a human face.

${DELIGHT_LAW}
For this pool specifically, COMEDY IS THE POINT and it is what will make a viewer smile at the second thing they notice. Draw on these and invent well beyond them: a goldfinch further along the stem hanging upside down off a head, eating the crop the fae came for · two of them back at the rim arguing about which way the wind is going, both pointing different ways · one already on the way down with a sack bigger than she is, bumping every step · a dormouse asleep in a drift of down behind, entirely buried but for its tail · three of them hauling on a cord from below with only heads and shoulders over the rim, the last one sitting down on the job · one flat on her back further along with a full sack across her chest, finished · one wrapped to the eyes and still absolutely furred over with caught down · a fae further off holding a net out in completely the wrong direction, watching the wrong seed · two of them further back sharing one enormous seed and not helping at all · one halfway up the stem behind with a cord in her teeth, climbing · a line of them along the rim all leaning out at once, the end one holding the next one's hood · a jay landing on the stem behind with its beak already full, plainly a thief · one who has climbed higher than anybody needed to purely to be higher · a snail crossing behind at its own pace with a seed stuck to its shell.

${FIGURE_LAW}
These figures are further off, so their faces stay readable but simple, while their clothes, ears and wings still read clearly — layered fae-craft cloth in saturated autumn colour, pointed ears, wings visible.

${FAE_CRAFT_LAW}

${SCALE_LAW}
In THIS pool, seeds appear at most as one short clause about a stated mass of them around the figure — no single seed described, except one being carried or eaten, whose size is given against the figure's own body.

${MOTION_LAW}

${ADDITIVE_LAW}

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns THE OTHER FIGURES ONLY. Do not describe the light, the palette, the stand's overall shape, a pod's own seams, or the near fae herself.`,
    touchpoints: [
      'Further along the same stem, a goldfinch hangs upside down off a head and eats the seed straight out of it, entirely unbothered, exactly the crop the fae came for.',
      'Back at the rim, two of them in ember-orange and teal argue about which way the wind is going, both pointing different ways with whole arms, while a third leans past them looking up.',
      'Already on the way down the stem behind, one of them descends with a bulging sack bigger than she is, letting it bump down every ridge ahead of her.',
      'Down in the tangle below, three of them haul on a grass cord with only heads and shoulders showing over the rim, all leaning back in a row, the last one sitting down on the job.',
      'Out on the bough behind, a squirrel holds one seed in both paws with eight more already stuffed in its cheeks, its tail up over its back.',
      'Further off along the stem, a fae in russet holds a net out in completely the wrong direction, watching one seed while a hundred go past the other way.',
    ],
    instructions: `Each entry is ONE companion, animal or small group in 22-36 words. HARD RULE ON LENGTH: count the words and reject your own entry if it runs over 36. MANDATORY — (a) stated as smaller and further off than the near fae, (b) one whole animal OR two or three fae at most, (c) a second little story the eye reads on second look, (d) for fae, their clothes, ears and wings named. Roughly a third of the entries are animals, and prefer a RIVAL for the same cargo over a spectator. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(
    `No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`
  );
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["'`]+|["'`]+$/g, '').trim())
    .filter((e) => e.length >= 20 && e.length <= 1200);
  if (cleaned.length === 0) throw new Error('no numbered entries parsed');
  return cleaned;
}

const STOP = new Set([
  'the',
  'and',
  'with',
  'from',
  'into',
  'that',
  'this',
  'over',
  'under',
  'onto',
  'across',
  'their',
  'while',
  'every',
  'still',
  'against',
  'picture',
  'frame',
]);

function signatureOf(entry) {
  const words = String(entry)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w));
  const uniq = [...new Set(words)].slice(0, 12).sort();
  return uniq.join('|');
}

function titleOf(entry) {
  const dashIdx = String(entry).indexOf('—');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(REPO, 'scripts/bots/faebot/seeds', `${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  console.log(
    `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
  );
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(30, Math.ceil(stillNeeded * 1.4));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();

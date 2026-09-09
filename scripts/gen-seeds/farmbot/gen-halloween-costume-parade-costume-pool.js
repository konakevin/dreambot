#!/usr/bin/env node
/**
 * FarmBot — halloween_costume_parade_costume bespoke pool
 * ("Halloween Costume Parade" seasonal path, farmbot.seasonalPaths.halloween).
 *
 * Path-bespoke (not a shared cross-path pool) — a WEARER-AGNOSTIC costume
 * description, no subject noun at all ("a soft round pumpkin costume...",
 * never "a child wearing a pumpkin costume..."). The path template drops
 * whichever figure (human character OR farm animal) is filling that cast
 * slot in front of it ("Figure 1 wears: <entry>"), so the same 25 entries
 * work equally well on a person or a costumed goat.
 *
 * CRITICAL identity constraint (Kevin, via the path brief): playful
 * family-friendly Halloween only — costumes stay SIMPLE, CUTE, and
 * instantly recognizable, never elaborate, realistic, or scary. A "ghost"
 * costume is an adorable white sheet with two round eye-holes, not anything
 * remotely unsettling. Positive framing only (describe the costume as
 * cute/playful/simple — never say "not scary").
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_costume_parade_costume.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct, WEARER-AGNOSTIC Halloween costume descriptions for a
cute cozy countryside anime bot's Halloween costume parade. Each entry describes ONLY the costume
itself — no subject noun of any kind (never "a child," "a girl," "a boy," "a critter," "someone," or
any pronoun). Just the costume, so the exact same sentence works equally well dropped after "wearing:"
for a person OR a farm animal.

CRITICAL — SIMPLE, CUTE, INSTANTLY RECOGNIZABLE, NEVER SCARY OR ELABORATE. Every costume must be the
kind of adorable, handmade-feeling costume from a gentle children's picture book, never a realistic or
frightening one. A "ghost" costume is always an adorable plain white bedsheet with two round cutout
eye-holes — nothing tattered, nothing unsettling. A "skeleton" costume is soft rounded glow-paint bone
shapes on a cozy dark outfit, cheerful and cute, never a scary or anatomical skull. Describe every
costume in warm, delighted, positive language (cute, playful, simple, huggable, adorable) — never by
saying what it ISN'T (never write "not scary" or "not gory" or similar).

Draw from and vary this list of costume TYPES across the ${n} entries (repeat a type once or twice
with fresh wording/details if needed to reach the count, but favor covering as many distinct types as
possible): a round pumpkin costume (padded orange body, green felt stem cap), a ghost bedsheet costume
(plain white sheet, two round cutout eye-holes), a pointed witch hat paired with a simple cape, a
patchwork scarecrow costume (straw-stuffed cuffs, a floppy hat, a button nose), a black cat costume
(soft round ears on a headband, a fuzzy tail, painted whisker dots), a little bat costume (soft
rounded wings, small round ears), a round spider costume (soft plush body, extra fuzzy stub legs), an
owl costume (round feathered hood, big soft eye patches), a mummy costume (loosely wrapped soft white
bandage strips over a cozy outfit, cheerful not tattered), a candy-corn costume (striped
orange-yellow-white cone shape), a little vampire costume (a simple short cape with a round collar, no
fangs shown), a bumblebee costume (soft yellow-black stripes, small gauzy wings), a friendly little
dragon costume (soft felt spikes down the back, round wing shapes). Each entry names ONE costume type
and describes its specific look in inviting, tactile detail (fabric, shape, one or two accent details).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A soft round pumpkin costume — a padded orange body, short puffed sleeves, and a little green felt stem cap perched jauntily on top, simple and huggable.", "A plain white ghost-sheet costume with two neat round cutout eye-holes, the soft fabric draping loosely and fluttering playfully with every step."]

🚫 STRICT BANS: NO subject noun or pronoun of any kind (no child/girl/boy/critter/someone/they/it —
just the costume itself), NO elaborate or realistic detail (no genuine gore, blood, tattered fabric,
menacing masks, sharp fangs, hollow eyes, or anything remotely frightening), NO named brands or
licensed characters, NO readable text/labels on the costume, NO "not scary"/"not gory"/negative-framed
phrasing — describe only what the costume cutely and simply IS.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

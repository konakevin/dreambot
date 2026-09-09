#!/usr/bin/env node
/**
 * FarmBot — fall_campfire_evening_detail bespoke pool ("Fall Campfire
 * Evening" SEASONAL path, bot.seasonalPaths.fall — see
 * FARMBOT_PATH_BUILD_STATE.md). The surrounding camp world — everything
 * around the fire itself (seating, blankets, cider, string lights/lanterns,
 * fallen leaves) — kept as its own axis so the fire pool (separate file)
 * stays entirely about the flames/embers themselves.
 *
 * CRITICAL — same dark+light contradictory-pairing ban as the fire and sky
 * pools. String lights/lanterns are a SEPARATE light source from the fire —
 * describe their own glow plainly, never fused with a "dark" word describing
 * the same patch of the frame.
 *
 * Deliberately NO pumpkins/gourds/jack-o-lanterns anywhere in this pool —
 * this path is Fall-general, not Halloween-specific (per the build brief).
 * Fall identity comes from fallen leaves, knit textures, hay-bale seating,
 * and cider instead.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_campfire_evening_detail.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SURROUNDING CAMPFIRE-EVENING DETAIL descriptions
for a cozy countryside anime bot's small autumn campfire scene — the world immediately AROUND
the fire (never the flames themselves, that's a separate axis). Each entry is ONE small physical
detail or a couple combined, described plainly and vividly.

Draw from genuine variety across these categories:

SEATING: a couple of low hay-bale seats set close together near the fire, a rustic split-log
bench, a folded quilt spread over a low wooden bench, a scatter of flat cushions on the ground.

WARMTH ITEMS: soft knit blankets in warm autumn colors draped loosely over a bench or shoulders,
a stack of folded wool blankets sitting ready nearby, a pair of steaming mugs of spiced cider
resting on a low stump or flat stone, a thermos with its cap doubling as a small cup.

LIGHT (separate from the fire): a string of small warm-glowing lantern lights strung between two
fence posts or low tree branches, a single glass-hurricane lantern with a soft candle glow
sitting on a stump nearby, a couple of small paper lanterns hung from a low branch.

FALL TEXTURE: a light scatter of fallen amber and rust leaves across the ground nearby, a small
neat stack of extra firewood logs, a few acorns and pinecones scattered near the fire ring, a
long roasting stick or two leaned against a log within easy reach, a woven picnic basket sitting
nearby with a striped cloth peeking out.

CRITICAL — describe any lantern/string-light glow in PLAIN language only ("a warm, soft glow,"
"small glowing bulbs strung between the posts") — NEVER compare the lights to stars, fireflies,
jewels, or glitter (figurative light-as-object language reliably renders as the literal object
instead — a documented failure mode on this bot).

CRITICAL — NEVER pair "dark," "darkness," or "shadow" with a light-implying word ("glint,"
"sparkle," "shimmer," "luminous," "glow") describing the SAME thing in one phrase. Describe any
dark ground/background plainly and any lantern/string-light glow plainly and SEPARATELY — never
fuse the two into one contradictory phrase (this exact pairing has rendered as a literal glowing
artifact cut into an otherwise normal scene on this bot before).

CRITICAL — describe a cluster of similar small objects (a row of lantern-string bulbs, a scatter
of leaves, a pile of acorns) HOLISTICALLY as one arrangement, never with an individual per-object
action verb or personality for any single piece.

CRITICAL — this is a PLACE/PROP description with NO people in it at all, not even implied ones
(no figures, hands, faces-as-subject, or anyone shown using/holding the item).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A string of small warm-glowing lantern lights is strung loosely between two low fence posts just behind the fire ring, each bulb glowing soft and steady in the evening air.", "A couple of steaming mugs of spiced cider rest on a flat stone near the fire, wisps of fragrant steam curling gently upward into the cool night."]

🚫 STRICT BANS: NO named people/implied people (figures/hands/faces-as-subject/anyone
holding-using), NO readable text/signage/lettering, NO brand names, NO photographer/camera-brand
names, NO pumpkins/gourds/jack-o-lanterns/costumes/anything Halloween-specific (this is
Fall-general, not Halloween), NO metaphorical light-as-object language, NO pairing of
dark/darkness/shadow with a light-implying word describing the same thing, NO per-object
personification within a cluster of similar items.

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

#!/usr/bin/env node
/**
 * FarmBot — halloween_barn_party_activity bespoke pool ("Halloween Barn
 * Party" seasonal path, farmbot-halloween-barn-party, 2026-09-09).
 *
 * SEASONAL path (bot.seasonalPaths.halloween). Path-bespoke pool — what a
 * character is doing at the barn party. Checked the shared farmbot_activity.json
 * directly first (per FARMBOT_PATH_BUILD_STATE.md's "verify against the
 * actual JSON" lesson) — it has zero Halloween/party-specific entries
 * (apple-bobbing, cider, costuming an animal, jack-o-lantern carving), so a
 * bespoke pool is genuinely needed rather than tag-filtering the shared one.
 *
 * Matches the shared ACTIVITY pool's own established phrasing convention
 * exactly (verified against farmbot_activity.json): present-participle,
 * verb-first, NO noun subject at all ("Hanging freshly washed linens...",
 * "Crouching low among the strawberry plants...") — only used when a
 * character is present (this pool is meaningless without one, same
 * conditional-pick rule as every other ACTIVITY-style pool in this bot).
 *
 * Several entries deliberately involve costuming or interacting with an
 * animal (tying a bandana on a goat, guiding a pony's tiny hat into place)
 * to tie the CHARACTER and COSTUMED_ANIMALS axes together into one cohesive
 * moment rather than two disconnected picks.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_barn_party_activity.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HALLOWEEN BARN PARTY ACTIVITY phrases for a cozy
countryside bot — a single character caught mid-moment enjoying a cheerful Halloween party inside a
decorated barn. Match this EXACT phrasing convention: PRESENT-PARTICIPLE, VERB-FIRST, with NO noun
subject at all — do not write "she is," "a girl," "someone," or any noun before the verb; start every
entry directly with the -ing verb, exactly like these real examples from this bot's existing activity
pool: "Hanging freshly washed linens on a line, smoothing each fold with a gentle pat before letting the
breeze take over." / "Crouching low among the strawberry plants, lifting a ripe berry by its stem and
dropping it soft into a waiting bowl." / "Drawing a wide brush through a pony's mane in long, unhurried
strokes, the animal standing calm and still."

CRITICAL — CHEERFUL, PLAYFUL, FAMILY-FRIENDLY HALLOWEEN PARTY ONLY. Every action here is joyful, silly,
warm, and utterly wholesome — a kids'-party-style Halloween celebration, never anything unsettling.

Draw from genuine barn-party moments (vary widely): reaching into the apple-bobbing tub for a floating
apple, sipping warm cider from a mug with both hands wrapped around it, taking a happy bite of a caramel
apple on a stick, carefully setting a lit jack-o-lantern onto a hay bale and admiring its grin, tying a
small pumpkin-print bandana around a goat's neck, gently guiding a tiny witch hat onto a pony's head,
perched on a hay bale swinging legs happily while snacking on candy corn, stacking a small pyramid of
mini pumpkins on the treats table, twirling happily near the hay bales to music, reaching up to hang one
more paper bat garland from a beam, clapping along with rosy cheeks and a wide grin, carefully carving a
simple grinning face into a small pumpkin with a butter knife, cupping both hands around a mug of hot
cider and blowing gently to cool it, offering a slice of apple to a curious goat.

Vary the specific action, the object involved, and the small physical detail that makes it feel alive
(a stray hay wisp, a smear of cider, a wobble of balance) — never repeat the same action twice.

CRITICAL — no age or gender noun of any kind (no "she," "he," "girl," "boy," "child," "kid," "person," or
similar) — the phrase must work as a pure verb-led action with no subject named at all, since a character
description is combined with this text separately at render time.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-30 words each.

Examples:
["Reaching into the apple-bobbing tub, teeth playfully bared, hair damp at the ends from a near-miss.",
"Tying a small pumpkin-print bandana around a goat's neck, both hands steady and gentle as it wriggles
happily.", "Perched on a hay bale, swinging legs happily while snacking on a handful of candy corn."]

🚫 STRICT BANS: NO age or gender noun of any kind (she/he/girl/boy/child/kid/person/lady/gentleman), NO
named people, NO word "scary" or "spooky" anywhere, NO readable text/signage/lettering, NO brand names,
NO photographer/camera-brand names — every phrase is a pure present-participle verb-first action with no
subject noun, matching the shared activity pool's exact convention.

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

#!/usr/bin/env node
/**
 * FarmBot — halloween_trick_or_treating_treat_container bespoke pool
 * ("Trick-or-Treating" SEASONAL path, bot.seasonalPaths.halloween,
 * 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — the KEY PROP that makes this
 * path distinct from its two Halloween siblings (farmbot-halloween-barn-
 * party, farmbot-halloween-costume-parade): the treat bag / basket / pumpkin
 * pail the trick-or-treater carries and is actively collecting/showing off
 * candy in. Described alone as a HELD OBJECT, no wearer/holder mentioned —
 * the path template layers it into the trick-or-treater's own hands.
 *
 * Guards baked in:
 *   - signage/label-concept hallucination trap — explicit ban on any
 *     lettering, numbers, or brand-like print on the container
 *   - implied-person-language ban (banHumanLanguage catches explicit
 *     man/woman/boy/girl words; this pool describes only the object, never
 *     a holder, so the filter should have nothing to catch, safety net only)
 *   - "playful, never real horror" identity constraint — cheerful pumpkin/
 *     candy imagery only, never anything unsettling
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_trick_or_treating_treat_container.json'),
    total: 120,
    batch: 20,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a CHARMING HALLOWEEN TREAT CONTAINER —
a trick-or-treat bag, basket, or pumpkin pail — for a cozy countryside anime farm bot's playful
"trick-or-treating" scene. Each entry describes ONLY the container ITEM itself, held or carried, with
NO holder mentioned (no hands, no wearer, no age/gender words) — the calling code layers this
description into the trick-or-treater's own grip separately. The container is ALWAYS the grammatical
subject named FIRST in the sentence.

Vary widely across a range of charming container types: a small round pumpkin-shaped plastic pail
with a black loop handle and a simple friendly carved-face print, a woven wicker basket lined with a
gingham cloth, a patchwork cloth drawstring sack cinched with a knotted rope tie, a tin pail with a
rope handle and a few painted autumn leaves, a canvas tote bag with a simple stitched pumpkin-shaped
patch (no words), a straw basket with a curved wooden handle, a felt jack-o-lantern-shaped bucket
with a wide friendly grin, a quilted fabric bag with an appliquéd bat or star shape, a small woven
basket with an autumn-leaf garland tied around the rim, a paper trick-or-treat bag with a simple
printed pumpkin silhouette (no words). Vary how full it is: some brimming generously with a colorful
jumble of wrapped candies catching the light, some holding just a few pieces so far, some empty and
ready at the very start of the outing. Vary the angle/moment: held out toward a candy bowl, tipped
slightly to show its contents, swinging gently at one's side.

CRITICAL — describe the candy itself in plain, cheerful, literal terms only (a colorful jumble of
foil-wrapped candies, small paper-wrapped sweets, a mix of bright wrapped treats) — NEVER a
metaphorical object-noun standing in for light or sparkle (no "jewels of candy," "coins of
sweetness," or similar), since figurative object language can render as the literal metaphor-object
instead of candy.

CRITICAL — do NOT describe any lettering, numbers, readable words, or brand-like print anywhere on
the container, even a blank or implied one — the CONCEPT of a printed label invites hallucinated
readable text on a render even when told "no text." A simple printed pumpkin/bat/star SILHOUETTE
shape (no words) is fine.

CRITICAL — this is a PLAYFUL, CUTE Halloween scene, never real horror — no unsettling imagery, no
scary faces on the container, only cheerful, friendly, rounded shapes and warm colors.

CRITICAL — this is an OBJECT description with NO person in it at all, not even implied ones. Do NOT
mention hands, fingers, a holder, someone/anyone doing something, or any other word implying a
person is present. The container being held out, tipped, or swinging should read as caught in that
moment on its own — the calling code adds the person separately.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-30 words each.

Examples:
["A small round pumpkin-shaped plastic pail with a sturdy black loop handle and a simple friendly
carved-face print, brimming with a colorful jumble of foil-wrapped candies caught mid-tip toward a
waiting bowl.", "A patchwork cloth drawstring sack cinched with a knotted rope tie, swinging gently,
just a few bright wrapped sweets visible peeking over the loosened opening."]

🚫 STRICT BANS: NO holder/hands/person described in any way, NO readable text/lettering/numbers/
brand names of any kind, NO scary or unsettling container designs, NO metaphorical light/sparkle-
as-object language, NO photographer/camera-brand names.

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

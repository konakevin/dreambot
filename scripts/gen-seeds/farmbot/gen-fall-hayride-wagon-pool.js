#!/usr/bin/env node
/**
 * FarmBot — fall_hayride_wagon bespoke pool ("Fall Hayride" SEASONAL path,
 * bot.seasonalPaths.fall, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * HERO axis: the wooden hay wagon + its draft horse + the piled hay itself,
 * described alone with NO character in the frame (a character, when rolled,
 * is layered on top at the path-file level via pools.pickCharacter(), same
 * pattern as HARVEST_FESTIVAL_PLACE/ORCHARD_AFTERNOON_PLACE/SUGARCANE_FIELD_PLACE).
 * Required directly from its JSON in the path file, NOT added to pools.js
 * (shared file — other seasonal-path agents are building sibling paths
 * concurrently right now, see FARMBOT_PATH_BUILD_STATE.md's coordination note).
 *
 * CONCEPT (Kevin's brief, verbatim intent): a charming hay wagon ride through
 * autumn fields — a wooden wagon pulled by a draft horse (or parked with the
 * horse resting nearby), piled with fresh hay. This is Fall-GENERAL, not
 * Halloween — no pumpkins-as-jack-o-lanterns, no costumes, no spooky anything,
 * just warm harvest-season charm. MUST be genuinely distinct from
 * harvest-festival.js (decorated festival grounds, hay bales/pumpkins/apple-
 * picking/scarecrows/hay-bale maze) and autumn-village-market.js (market-stall
 * goods) — THIS path's hero content is specifically THE WAGON ITSELF, in
 * motion or paused, never a festival backdrop or market stall.
 *
 * MOTION VARIETY (Kevin's explicit brief): roughly HALF the entries describe
 * the wagon actually rolling/in motion through the fields (wheels turning,
 * horse walking steadily, hay shifting gently with the movement), and the
 * other half describe it paused for a moment (loading hay, the horse resting,
 * a brief stop) — for framing variety, matching the chibi-halloween-cozy
 * precedent's "motion state baked into the pool entry itself" pattern rather
 * than a separate boolean roll.
 *
 * Guards baked in from prior FarmBot lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd/person-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added below; this pool has ZERO people in it, character is layered
 *     on separately in the path template)
 *   - "horse keeper" occupational-noun trap: NEVER compound an occupational
 *     or role word directly against "horse" (no "wagon driver," "cart horse,"
 *     "horse handler," "hay hand") — describe the draft horse using plain
 *     breed/anatomy/harness vocabulary only (broad flank, feathered fetlocks,
 *     harness straps, a calm patient gaze), since an animal-name-adjacent-to-
 *     role-noun pattern risks Flux reading it as describing a character's own
 *     anatomy rather than an occupation or relationship
 *   - metaphorical-light-language trap ("coins of afternoon light" rendered
 *     as literal gold coins) — literal light-language-only rule
 *   - per-object-personification trap (round river stones read as
 *     personified faces when framed with individual per-object action verbs)
 *     — explicit holistic-collection rule for the piled hay / straw
 *   - dark+light contradictory-pairing trap ("a dark glint of water" escalated
 *     by Sonnet into a literal glowing light source with visible stars cut
 *     into a daytime scene) — explicit ban below
 *   - signage/label-concept hallucination trap — explicit ban below
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_hayride_wagon.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a charming WOODEN HAY WAGON pulled by
(or parked beside) a DRAFT HORSE, piled with fresh golden hay, for a cozy countryside anime farm bot's
autumn hayride scene. The wagon and its horse are ALWAYS the grammatical subject named FIRST in the
sentence — this is the HERO of the shot, described alone with NO people in it at all (a character is
added separately, later, by the calling code — never mention a rider, driver, or any person).

THE WAGON: an old-fashioned, hand-built wooden hay wagon — weathered wood-plank sides, large wooden or
iron-rimmed wheels, a simple wooden bench or flat platform bed, low wooden side-rails. It is heaped
generously with loose golden hay, some strands trailing loosely over the edge. Charming, personal-scale,
handcrafted — never an industrial farm vehicle, never a modern trailer, never anything metal/mechanized.

THE DRAFT HORSE: a sturdy, gentle draft horse in simple leather harness, calm and patient, a broad
flank, a thick mane, feathered fetlocks (fluffy hair around the lower legs) — describe using plain
breed/anatomy/harness vocabulary only. NEVER compound an occupational or role word directly against
"horse" (no "cart horse," "wagon horse," "draft-horse handler," "hay hand" — plain "a draft horse" or
"the horse" is fine on its own).

CRITICAL — MOTION VARIETY: write roughly HALF the entries with the wagon actually IN MOTION, rolling
along a dirt farm lane or through cut fields — wheels turning, the horse walking at a steady unhurried
pace, loose hay strands lifting and shifting gently with the movement, wheel ruts trailing behind in the
dirt. Write the other HALF PAUSED for a moment — the wagon stopped and at rest, the horse standing
still (in harness, resting, or grazing calmly just beside the wagon), fresh hay being loaded onto the
pile, or simply a quiet held moment mid-ride. Vary which physical detail leads (the wheels, the harness,
the piled hay, the horse's face, the wagon's worn wood grain) and the viewpoint (low and close along the
wagon's side, from just behind following the ride, a three-quarter view of horse and wagon together).

CRITICAL — describe the piled hay HOLISTICALLY as one loose golden mass or drift — plain physical
description only (strands catching light, a soft uneven mound, wisps trailing over the wagon's edge),
never an individual per-object action verb or personality given to any single strand or wisp.

CRITICAL — describe light in plain, literal terms only (a warm glow, sunlight catching the hay, a soft
shimmer on the horse's coat) — NEVER a metaphorical object-noun standing in for light (no "coins of
light," "threads of gold," "ribbons of sun," or similar), since figurative light language can render as
the literal object instead.

CRITICAL — never pair "dark," "darkness," or "shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing — that contradictory pairing has rendered as a
literal glowing light source or a starry-night patch cut into an otherwise daytime scene. Describe any
shadowed area plainly with no light-word attached (a cool shaded patch beneath the wagon bed is fine on
its own).

CRITICAL — do NOT describe any sign, plaque, marker, brand mark, or any kind of lettered/numbered
surface anywhere on the wagon, even a blank one — the CONCEPT of a label invites hallucinated readable
text on a render even when told "no text." Plain weathered wood is fine.

CRITICAL — this is a PLACE/OBJECT description with NO people in it at all, not even implied ones. Do
NOT mention: a rider, driver, figures, crowd, hands, someone/anyone doing something, or any other word
implying a person is present or was recently present. The wagon being loaded or paused mid-ride should
read as if caught in that moment on its own, not narrated as someone's action.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A weathered wooden hay wagon rolls steadily along a dirt farm lane, its large wheels turning smoothly
through soft ruts, loose golden hay piled high and trailing wisps over the low side-rails, a sturdy
draft horse walking ahead at an easy, unhurried pace.", "The hay wagon stands paused at the field's
edge, wheels still, its draft horse resting quietly in harness beside it, a fresh mound of golden hay
heaped loosely across the wooden bed, warm afternoon light catching the straw."]

🚫 STRICT BANS: NO named people/characters, NO implied people (rider/driver/figures/crowd/hands/
footprints), NO readable text/signage/lettering/numbers/brand marks/plaques of any kind, NO photographer/
camera-brand names, NO industrial/modern-mechanized vehicle language, NO occupational or role word
compounded directly against "horse" (no "cart horse," "wagon horse," "horse handler"), NO metaphorical
light-as-object language, NO per-object personification within the piled hay, NO pairing of dark/
darkness/shadow with a light-implying word describing the same thing, NO Halloween/costume/jack-o-lantern/
carved-pumpkin content (this is a general-fall path, not Halloween).

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

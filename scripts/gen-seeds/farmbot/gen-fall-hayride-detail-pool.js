#!/usr/bin/env node
/**
 * FarmBot — fall_hayride_detail bespoke pool ("Fall Hayride" SEASONAL path,
 * bot.seasonalPaths.fall, 2026-09-09).
 *
 * Path-bespoke — ONE small, optional charming touch riding along with the
 * hayride (a basket of apples tucked in the hay, a knit blanket, a jug of
 * cider) — deliberately kept OPTIONAL in the path template (~50% of renders),
 * same rationale as chibi-halloween-cozy.js's ACCESSORY axis: a mandatory
 * signature prop homogenizes every render into "the same one wagon." Never
 * an animal (ANIMAL_COMPANIONS/AMBIENT_LIFE already own that axis via
 * pools.pickPureSceneLife — keeping this pool prop-only avoids doubling up).
 *
 * MUST be genuinely distinct from harvest-festival.js's decor/festival props
 * and autumn-village-market.js's market goods — this pool is specifically a
 * small thing riding ALONG WITH the wagon itself, not festival decoration or
 * goods for sale.
 *
 * Guards baked in from prior FarmBot lessons: signage/label-concept
 * hallucination trap (explicit ban below — a strong risk for any "jug"/
 * "basket"/"crate" prop), implied-crowd-language ban, metaphorical-light
 * trap, per-object-personification trap, dark+light contradictory pairing.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_hayride_detail.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of ONE small, charming object riding along
with (tucked into the hay, resting against the wagon side, or hung from the wagon frame) a hay wagon on
a cozy countryside anime farm bot's autumn hayride scene. The object is ALWAYS the grammatical subject
named first. NO people, NO wagon full-description, NO horse — just the ONE small object itself, briefly
placed in relation to the wagon or the hay (e.g. "tucked into the hay," "resting against the wagon's
side rail," "hanging from the wagon's frame").

VARY across genuinely different small objects: a woven basket brimming with just-picked red apples, a
folded knit or plaid blanket draped over a mound of hay, a wooden jug or a few plain glass jars (for
warm cider, unlabeled), a resting garden rake or pitchfork leaned against the wagon's side, a coil of
rope, a small wicker crate of plain uncarved pumpkins or gourds (harvest cargo only, never carved, never
a jack-o-lantern), a scattering of fallen autumn leaves caught in the straw, a folded burlap sack, a
pair of worn leather work gloves resting on the wagon's edge, an unlit iron lantern (hung but not
glowing — daytime scene) with plain glass panes, a small tin water can, a wide-brimmed straw hat resting
on the hay.

CRITICAL — describe light in plain, literal terms only if mentioned — NEVER a metaphorical object-noun
standing in for light.

CRITICAL — never pair "dark," "darkness," or "shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing. If describing an unlit lantern, keep it plainly
unlit — no glow, no flicker, no light of any kind coming from it (it's daytime and it isn't burning).

CRITICAL — describe a cluster of similar small objects (apples in the basket, jars, pumpkins in the
crate) HOLISTICALLY as one arrangement — plain physical description only, never an individual
per-object action verb or personality for any single piece.

CRITICAL — do NOT describe any sign, plaque, price tag, label, marker, or any kind of lettered/numbered
surface on or near the object, even a blank one — the CONCEPT of a label invites hallucinated readable
text on a render even when told "no text." Plain unmarked jars, crates, and baskets are fine.

CRITICAL — this is an OBJECT description with NO people in it at all, not even implied ones. Do NOT
mention: a rider, hands placing it, figures, someone/anyone, or any word implying a person is present or
was recently present — the object should read as simply riding along, already in place.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-30 words each.

Examples:
["A woven basket brimming with just-picked red apples sits tucked snugly into the piled hay near the
wagon's front rail.", "A folded plaid wool blanket lies draped loosely over a mound of golden hay,
its edge trailing softly against the wagon's worn wood."]

🚫 STRICT BANS: NO named people/characters, NO implied people (rider/hands/figures/someone), NO full
wagon or horse re-description (mention them only briefly as a placement anchor, e.g. "against the
wagon's side"), NO readable text/signage/lettering/numbers/price tags/labels of any kind, NO brand
names, NO photographer/camera-brand names, NO metaphorical light-as-object language, NO per-object
personification within a cluster, NO pairing of dark/darkness/shadow with a light-implying word
describing the same thing, NO lit/glowing lantern or flame of any kind (daytime scene only), NO carved
pumpkins/jack-o-lanterns/Halloween/costume content of any kind (this is a general-fall path, not
Halloween).

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

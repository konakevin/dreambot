#!/usr/bin/env node
/**
 * FarmBot — waterfall_glade_activity bespoke pool ("Waterfall Glade" path).
 *
 * Path-bespoke ACTIVITY set — the shared farmbot_activity.json pool has no
 * genuine waterfall/wading content (its 'leisure' entries assume hay/
 * rafters, a porch step, a generic shallow stream — none fit a waterfall
 * pool specifically), so this path needs its own, same reasoning as
 * fishing-dock.js's FISHING_DOCK_ACTIVITIES and flower-shop.js's
 * FLOWER_SHOP_ACTIVITIES. Built as a FULL 120-entry pool (not a small
 * inline array) per the current fleet convention of full-depth seeding on
 * new content.
 *
 * Phrased EXACTLY like the shared ACTIVITY pool's convention — a gerund-led
 * phrase with NO subject noun at all (never "she wades," always "Wading...")
 * — this is what makes it safe to drop into a template that only fires this
 * axis when a character is already present elsewhere in the prompt.
 *
 * Only actions that make sense at a SMALL, personal-scale waterfall/pool:
 * wading, sitting at the edge, splashing, cupping water, skipping stones,
 * watching/admiring. No swimming laps, no diving, no anything that implies
 * a large body of water.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_waterfall_glade_activity.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct gentle, cozy ACTIONS a character could be doing at a
small, personal-scale countryside waterfall and its clear pool, for a cute cozy countryside anime
bot. Every entry is a SINGLE ACTION PHRASE written as a present-participle ("-ing") phrase with NO
subject noun at all — never write "she wades" or "the girl sits," always start directly with the
gerund, e.g. "Wading ankle-deep into the clear, cool pool, ..." This exact phrasing convention
matters: the action must read naturally when a character description is placed immediately before
it in a longer scene description.

Draw from (and vary freely beyond) this range: wading ankle- or knee-deep into the shallow edge of
the pool, sitting on a smooth flat stone at the water's edge with feet dangling in the current,
cupping both hands to scoop up a palmful of clear water, splashing playfully at the pool's edge,
skipping a flat stone across the still water, trailing fingertips through the water while seated on
a mossy rock, leaning close to watch the cascade tumble over the rocks, reaching out to touch the
falling water where it's gentlest, sitting cross-legged on the bank just watching the water and
listening to it, wringing out the hem of a soaked sleeve after wading in too deep, balancing
carefully across a row of flat stepping-stones, crouching at the water's edge to watch a dragonfly
land nearby, drying bare feet in a patch of warm sun on a flat rock, tucking flowers picked from
the bank into loose hair while sitting by the pool, filling a small jar or canteen with clear water
from the pool, laughing quietly at a sudden cold splash, resting with both palms flat on a
sun-warmed stone, tilting the head back to feel the light mist drifting off the falls.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. Each entry 15-30 words, a
single flowing action phrase starting with a gerund, no subject noun.

Examples:
["Wading ankle-deep into the clear, cool pool at the base of the falls, arms held loosely out for
balance on the smooth pebbled bottom.", "Sitting cross-legged on a sun-warmed flat stone at the
water's edge, both hands resting palm-down on the cool stone, simply watching the cascade fall."]

🚫 STRICT BANS: NO subject nouns of any kind (no "she," "he," "the character," "a girl," "a boy," a
name, or any noun standing in for a person — the phrase must start directly with the -ing verb), NO
swimming laps or diving (this is a shallow personal-scale pool, wading and sitting only), NO
implied danger (no "slipping," "falling in," "losing footing"), NO readable text/signage, NO
food/eating content (that's a different axis), NO explicit gender-identifying nouns, NO age
framing (child/teen/elderly language).

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

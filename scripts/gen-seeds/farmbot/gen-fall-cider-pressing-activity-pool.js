#!/usr/bin/env node
/**
 * FarmBot — fall_cider_pressing_activity bespoke pool ("Fall Cider
 * Pressing" SEASONAL path). See gen-fall-cider-pressing-press-pool.js
 * header for the full path concept + sibling-path distinction notes.
 *
 * Character-only axis — the actual cider-pressing chore in progress. Unlike
 * the other 3 axes in this path, these entries ARE phrased as human actions
 * with an implied subject (same convention as the shared farmbot_activity
 * pool and fishing-dock.js's FISHING_DOCK_ACTIVITIES) — only picked when a
 * character is present in the template.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_cider_pressing_activity.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct CIDER-PRESSING CHORE ACTION descriptions for a cozy
countryside anime bot — a small family farm's own hand-cranked cider press, one specific action mid-
gesture. Each entry is phrased as an ACTION VERB PHRASE with an IMPLIED subject (their hands, a slow
turn, a steady grip) — the same convention as "Hanging freshly washed linens on a line, smoothing
each fold with a gentle pat" or "Crouching low among the strawberry plants, lifting a ripe berry by
its stem." Do NOT use any explicit age or gender noun (no "a woman turns the crank," no "a boy
loads apples") — only implied-subject action phrasing, matching the examples exactly in structure.

CRITICAL — EVERY SINGLE ENTRY, with NO exceptions, MUST explicitly name the press apparatus itself
somewhere in its own sentence — the word "press," or one of its named physical parts ("spout,"
"crank," "screw," "basket," "feed opening," "press's wooden base/frame/platform"). This is the single
most important rule: an activity happening physically AT or WITH the press is the whole point of this
pool, so even an action like corking a jug or tasting cider must be anchored to the press by literally
naming it or a part of it in the same sentence (e.g. "corking a full jug fresh from the press's
spout," "tasting a cupful of cider drawn straight from the press," "carrying a full jug away from the
press's base toward a waiting crate") — never an activity phrased so generically it could be read as
happening somewhere else in the farmyard, away from the press. Vary which specific cider-pressing
moment leads each entry: cranking the press's heavy wooden handle in slow, steady turns, loading a
basketful of apples into the press's slatted basket, holding a jug or bucket steady beneath the
press's spout to catch the streaming cider, corking a full jug fresh from the press's spout with both
hands, ladling fresh cider from the press's own catch-bucket into a waiting jar, tasting a small
cupful of cider drawn straight from the press with a satisfied pause, wiping cider from the press's
wooden base or frame with a cloth, stacking a crate of full jars right beside the press, tipping a
basket of whole apples into the press's feed opening, brushing a stray fallen leaf off a sleeve while
still standing at the press, sorting apples by color into two baskets set at the foot of the press
before loading them in, carrying a full jug away from the press's spout toward a waiting crate.

CRITICAL — describe only the ACTION and the immediate physical detail of the gesture (hands, grip,
posture, the object being handled) — never a full outfit/wardrobe description (that's handled
elsewhere) and never a face/age/gender descriptor.

CRITICAL — do NOT mention hay bales, corn stalks, a corn maze, scarecrows, pumpkins, jack-o-lanterns,
costumes, or any Halloween/spooky content.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["Cranking the press's heavy wooden handle in slow, steady turns, both hands wrapped firmly around
the worn grip as the screw eases lower into the basket.", "Holding a wide glass jug steady beneath
the spout, watching the last golden stream of cider settle and slow to a gentle trickle."]

Before you finalize your answer, re-read every single entry and confirm it literally contains one of:
press / spout / crank / screw / basket / feed opening / press's base / press's frame / press's
platform. Any entry that does not is invalid — rewrite it so it does before outputting.

🚫 STRICT BANS: NO explicit age or gender noun (woman/man/boy/girl/person/etc.), NO named people/
characters, NO full outfit/wardrobe description, NO hay bales/corn stalks/corn maze/scarecrows/
pumpkins/jack-o-lanterns/costumes/spooky content, NO readable text/signage, NO entry missing an
explicit press/spout/crank/screw/basket/feed-opening anchor.

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

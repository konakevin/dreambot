#!/usr/bin/env node
/**
 * FarmBot — fall_campfire_evening_fire bespoke pool ("Fall Campfire Evening"
 * SEASONAL path, bot.seasonalPaths.fall — see FARMBOT_PATH_BUILD_STATE.md
 * architecture notes and scripts/lib/botSeasonal.js).
 *
 * Path-bespoke (not a shared cross-path pool) — this is the path's HERO axis,
 * always present, and per the maxTokens content-ordering rule
 * (FARMBOT_PATH_BUILD_STATE.md, callClaude's fixed maxTokens: 400) it goes
 * FIRST in the template so it survives Sonnet's brief-writing regardless of
 * whatever else stacks after it.
 *
 * CRITICAL — this is a SMALL, MODEST, COZY-SCALE campfire, never a large
 * bonfire. Every entry must describe a small ring of stones/fire pit with
 * gentle, contained flames — never "roaring," "blazing," "towering," or
 * "bonfire."
 *
 * CRITICAL — the dark+light contradictory-pairing bug (found 2026-09-09 on
 * fishing-dock, documented in FARMBOT_PATH_BUILD_STATE.md): NEVER pair
 * "dark"/"darkness"/"shadow" with a light-implying word ("glint," "sparkle,"
 * "shimmer," "luminous," "glow") describing the SAME thing. This pool
 * describes fire/embers in plain, single-register glow language only.
 *
 * CRITICAL — metaphorical light-as-object language trap (orchard-afternoon's
 * "coins of light" bug, and this path's own special risk per the build
 * brief): NEVER compare embers/sparks to stars, fireflies, jewels, coins, or
 * confetti. Describe them as plain physical embers/sparks only.
 *
 * CRITICAL — per-object personification: describe a cluster of embers/sparks
 * HOLISTICALLY (rising together, drifting up) never with individual
 * per-ember action verbs or personality.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_campfire_evening_fire.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a SMALL, MODEST, INTIMATE
CAMPFIRE for a cozy countryside anime bot's autumn-evening scene. The campfire itself is the
absolute HERO of the shot — always the grammatical subject named first in the sentence.

CRITICAL SCALE RULE — this is a small, cozy, contained fire, never a bonfire: a modest ring of
stacked stones or a simple small fire pit, holding a gentle, contained cluster of flames just
tall enough to warm a few hands nearby. NEVER use "roaring," "blazing," "towering," "raging,"
"bonfire," or "huge" — every entry must read as SMALL and COZY-SCALE, not a large or dramatic
fire.

Lean into rich physical detail: small orange-gold flames licking gently around a few split
logs, a soft crackle and pop as a log settles, faint curls of pale woodsmoke rising and
drifting apart into the night air, a bed of glowing orange-red embers pulsing warm beneath the
flames, the fire's warm orange-amber glow washing softly across nearby faces/hands/blanket
edges/tree bark/fallen leaves (describe what the glow touches, not the glow as an object),
one or two split logs leaned ready at the fire's edge, a small ring of stones or simple metal
fire pit holding it all contained, the occasional soft pop and drift of a single ember rising
and fading into the dark air above. Vary the exact framing (close on the flames themselves,
a wider view of the whole small fire pit and its stone ring, a view across the fire toward
whatever it lights) and the exact stage of the fire (freshly built and catching, fully settled
into a steady gentle burn, burning low and mostly embers).

CRITICAL — describe the fire's own warm glow in PLAIN language only ("the fire's warm orange
glow," "firelight flickering softly across," "a warm amber light spilling from the flames") —
NEVER compare embers, sparks, or the fire's light to stars, fireflies, jewels, coins, glitter,
or confetti (figurative light-as-object language reliably renders as the LITERAL object instead
of the light it was meant to evoke — a documented failure mode on this bot).

CRITICAL — NEVER pair "dark," "darkness," or "shadow" with a light-implying word ("glint,"
"sparkle," "shimmer," "luminous," "glow") describing the SAME thing in one phrase (e.g. "the
darkness given a warm glow," "a shadowy sparkle"). This exact contradictory pairing has rendered
as a literal glowing light-source artifact cut into an otherwise normal scene on this bot before.
Describe the fire's glow plainly and describe any dark/night backdrop plainly and SEPARATELY —
never combine the two words into one phrase about the same patch of the frame.

CRITICAL — describe a cluster of embers or sparks HOLISTICALLY as one glowing bed or gentle
drift, never with an individual per-ember action verb or personality (no "each ember dances" or
similar personifying phrasing for any single spark).

CRITICAL — this describes only the fire/fire-pit itself, with NO people in it at all, not even
implied ones (no figures, hands reaching toward it, faces lit by it as the sentence subject,
or anyone tending it) — the campfire stands on its own as a small, complete, glowing world.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A small ring of stacked grey stones holds a modest, gently crackling fire, orange-gold flames licking low around two split logs, a soft curl of pale woodsmoke drifting straight up into the still night air.", "A bed of glowing orange-red embers pulses warm beneath a few last low flames, the fire settled and steady, its gentle amber glow spilling softly outward across the darkened grass just beyond the stone ring."]

🚫 STRICT BANS: NO large/roaring/blazing/towering/bonfire-scale fire, NO named people/implied
people (figures/hands/faces-as-subject/someone tending it), NO readable text/signage, NO brand
names, NO photographer/camera-brand names, NO metaphorical light-as-object language (stars,
fireflies, jewels, coins, glitter), NO pairing of dark/darkness/shadow with a light-implying word
describing the same thing, NO per-object personification of individual embers/sparks.

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

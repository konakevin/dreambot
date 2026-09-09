#!/usr/bin/env node
/**
 * FarmBot — halloween_trick_or_treating_doorway bespoke pool ("Trick-or-
 * Treating" SEASONAL path, bot.seasonalPaths.halloween, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * HERO axis: the decorated farmhouse doorway/porch itself, OR a decorated
 * garden path strung between farm buildings — described alone with NO
 * people in it at all (the trick-or-treater, when present, is layered on
 * top at the path-file level, same pattern as HARVEST_FESTIVAL_PLACE/
 * WOODLAND_WALK_PLACE/FISHING_DOCK_PLACE). Required directly from its JSON
 * in the path file, NOT added to pools.js (shared file — sibling seasonal-
 * path agents are building farmbot-halloween-barn-party and
 * farmbot-halloween-costume-parade concurrently, see
 * FARMBOT_PATH_BUILD_STATE.md's coordination note).
 *
 * CONCEPT: the DOOR-TO-DOOR / TREAT-COLLECTING narrative specifically — a
 * decorated farmhouse door or porch, a carved jack-o-lantern, string lights,
 * a bowl of candy waiting on the doorstep, warm porch light — OR a decorated
 * garden path lined with jack-o-lanterns strung between farmhouse buildings/
 * cottages, the classic route between houses. Genuinely distinct from two
 * sibling paths: farmbot-halloween-barn-party (an indoor/barn celebration
 * scene) and farmbot-halloween-costume-parade (a walking showcase/procession
 * scene) — THIS pool's hero content is specifically the THRESHOLD/DOORSTEP
 * or the BETWEEN-HOUSES PATH, always featuring a carved jack-o-lantern and a
 * bowl of candy already set out (so the calling code never needs to render a
 * second "door-answerer" character — the trick-or-treater takes candy from
 * the waiting bowl, sidestepping any awkward implied-second-figure problem).
 *
 * Guards baked in from FarmBot's accumulated lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd/person-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added below; this pool has ZERO people in it, the trick-or-treater
 *     is layered on separately in the path template)
 *   - signage/label-concept hallucination trap — explicit ban on ANY
 *     readable sign, welcome mat text, banner, nameplate, or lettered/
 *     numbered surface, even a blank one (the CONCEPT of a label invites
 *     hallucinated readable text even when told "no text")
 *   - metaphorical-light-language trap ("coins of afternoon light" rendered
 *     as literal gold coins) — literal light-language-only rule
 *   - dark+light contradictory-pairing trap ("a dark glint of water"
 *     escalated by Sonnet into a literal glowing light source with visible
 *     stars cut into a daytime scene) — explicit ban below, doubly important
 *     here since this scene is deliberately set at dusk/early evening with
 *     both porch-light glow AND encroaching evening darkness in the same shot
 *   - per-object-personification trap (round river stones read as
 *     personified faces when framed with individual per-object action
 *     verbs) — explicit holistic-collection rule for any cluster of similar
 *     small objects (multiple jack-o-lanterns, strings of lights)
 *   - "playful, never real horror" identity constraint — every jack-o-
 *     lantern is grinning/friendly/cheerful, never a menacing or scary
 *     carved expression; nothing genuinely eerie or unsettling anywhere
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_trick_or_treating_doorway.json'),
    total: 120,
    batch: 20,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a DECORATED HALLOWEEN DOORWAY/PORCH or
a DECORATED GARDEN PATH BETWEEN FARM BUILDINGS, for a cozy countryside anime farm bot's playful
"trick-or-treating" scene. The doorway/porch (or path) is ALWAYS the grammatical subject named FIRST
in the sentence — this is the HERO of the shot, described alone with NO people in it at all (the
trick-or-treater is added separately, later, by the calling code — never mention a homeowner, a
door-answerer, a visitor, or any person).

Write roughly TWO-THIRDS of the entries as a DECORATED FARMHOUSE DOOR OR PORCH: a charming wooden
farmhouse or cottage door (round-topped, painted a cheerful color, sometimes with a small round
window), flanked or topped by ONE OR TWO carved jack-o-lanterns with big friendly grinning faces
glowing warmly from within, strings of warm bulb lights looped along the porch eaves or railing,
small pumpkins and gourds arranged along the steps, a wicker or ceramic bowl already set out and
brimming with colorful wrapped candies waiting right on the doorstep or a small table beside the
door, soft golden porch-light spilling out through the doorway or from a nearby lantern. Vary which
detail leads (the glowing jack-o-lantern, the string lights, the candy bowl, the door itself), the
door's color and shape, and how many pumpkins/gourds are arranged.

Write the other ONE-THIRD as a DECORATED GARDEN PATH BETWEEN FARM BUILDINGS: a winding path or
lane connecting one cozy farmhouse/cottage to the next, lined on both sides with a row of small
glowing jack-o-lanterns set on the ground or low fence posts, strings of warm lights strung overhead
between porch posts or along a fence, warm lit windows glowing here and there in the farmhouse walls
further down the path, fallen autumn leaves scattered underfoot. This is the between-houses route a
trick-or-treater walks along.

CRITICAL — every jack-o-lantern is warm, cheerful, and FRIENDLY: a big round grinning or gently
smiling carved face, never a menacing, angry, fanged, or scary expression. This is a playful, joyful
Halloween scene, never spooky or unsettling in any way.

CRITICAL — this scene is set at DUSK or EARLY EVENING, with warm porch/lantern/string-light glow
against a softly darkening sky. Never pair "dark," "darkness," or "shadow" with a light-implying word
("glint," "sparkle," "shimmer," "luminous," "glow") describing the SAME thing (e.g. "the darkening sky
given a luminous glow") — that contradictory pairing has rendered as a literal glowing beam or a
starry-night patch cut awkwardly into an otherwise dusk scene. Describe the darkening evening sky
plainly on its own (a deepening blue-violet sky, dusky lavender light fading toward the horizon) and
the warm glow sources plainly on their own (a jack-o-lantern's warm glow, strings of lights glowing
softly) — never fused into one contradictory phrase.

CRITICAL — describe a cluster of similar small objects (multiple jack-o-lanterns, a string of lights,
a row of pumpkins) HOLISTICALLY as one arrangement or group — plain physical description only, never
an individual per-object action verb or personality given to any single item in the cluster (no "each
jack-o-lantern seems to wink" or similar personifying phrasing for any one item).

CRITICAL — describe light in plain, literal terms only (a warm glow, soft golden light spilling out,
lights glowing warmly, candlelight flickering inside a jack-o-lantern) — NEVER a metaphorical
object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered gems of glow,"
or similar), since figurative light language can render as the literal object instead.

CRITICAL — do NOT describe any welcome sign, doormat with a message, banner, nameplate, plaque,
chalkboard, or any kind of lettered/numbered/readable surface anywhere in the scene, even a blank
or implied one — the CONCEPT of a label or sign invites hallucinated readable text on a render even
when told "no text." A plain doormat with no message, or a plain unmarked door, is fine.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, a homeowner, a door-answerer, visitors, hands, someone/anyone doing
something, footprints (implies a walker just left), or any other word implying a person is present
or was recently present. A bowl of candy already set out, or a door standing ajar, is fine (an
object/state left in place) — do not describe anyone having just set it there or opened it.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A round-topped cottage door painted a cheerful cranberry red stands flanked by two grinning
jack-o-lanterns glowing warm amber from within, strings of soft bulb lights looped along the porch
railing, a wicker bowl brimming with colorful wrapped candies waiting on the top step in the fading
dusky light.", "A winding garden path connects one cozy farmhouse to the next, lined on both sides
with a row of small glowing jack-o-lanterns set along low fence posts, strings of warm lights strung
overhead between them, fallen golden leaves scattered underfoot as the sky deepens toward violet
overhead."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/homeowner/visitor/
hands/footprints), NO readable text/signage/welcome-mat-message/banner/nameplate/plaque of any kind,
NO brand names, NO photographer/camera-brand names, NO menacing/angry/scary jack-o-lantern
expressions, NO real horror/gore/genuinely-scary imagery of any kind, NO bare/undecorated door or
path lacking jack-o-lantern/light/candy-bowl detail, NO metaphorical light-as-object language, NO
per-object personification within a cluster of similar items, NO pairing of dark/darkness/shadow
with a light-implying word describing the same thing.

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

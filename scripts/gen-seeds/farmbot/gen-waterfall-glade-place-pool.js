#!/usr/bin/env node
/**
 * FarmBot — waterfall_glade_place bespoke pool ("Waterfall Glade" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE, WOODLAND_WALK_PLACE,
 * LAKESIDE_RIVERSIDE_PLACE, FISHING_DOCK_PLACE. This is the FIRST waterfall
 * content anywhere in FarmBot — Kevin's original 17-section creative-
 * direction brief (section 2, "THE WORLD") explicitly listed waterfalls
 * among the world locations alongside forests/lakes/rivers, but a full grep
 * of every seed pool found zero waterfall content — this pool closes that
 * gap.
 *
 * CRITICAL distinction from every existing water-adjacent path — the hero
 * here is the FALLING/CASCADING WATER ITSELF, not just another body of
 * water:
 *   - POND_PLACE (summer-evening-by-the-pond) — a small, STILL pond.
 *   - LAKESIDE_RIVERSIDE_PLACE (lakeside-riverside-moment) — wide OPEN,
 *     still-ish water, far shoreline.
 *   - FISHING_DOCK_PLACE (fishing-dock) — the DOCK STRUCTURE is the hero,
 *     water is secondary/background.
 *   - THIS pool (waterfall-glade) — MOVING water is the hero: a gentle
 *     cascade tumbling over mossy rocks into a small, clear pool below.
 *
 * SCALE (Kevin's brief, "personal in scale"): always a SMALL, intimate,
 * countryside-scale waterfall a person could wade right up to — never a
 * huge, dramatic, Niagara-scale feature. This is the single most important
 * calibration in this pool: every entry must read as gentle/small/tucked-
 * away, never towering/thundering/monumental.
 *
 * GENTLE MAGIC (section 14) — a waterfall pairs naturally with FarmBot's
 * subtle magical-realism register (rainbow mist, a soft glow in the spray),
 * so entries may lean lightly toward that — but per section 14's own rule
 * this must stay SUBTLE and grounded, never epic-fantasy (no glowing
 * portals, no floating rocks, no fantasy creatures).
 *
 * Guards baked in from FARMBOT_PATH_BUILD_STATE.md's hard-won lessons:
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but not "figures"/"hands"/"someone")
 *   - metaphorical-light-language trap ("coins of light" → literal coins
 *     rendered on an orchard-afternoon render) — literal light-language only
 *   - per-object-agency-framing trap (round river stones read as
 *     personified faces on lakeside-riverside-moment) — describe any
 *     cluster of similar small objects (smooth stones, ferns) holistically
 *   - dark+light contradictory-pairing trap (fishing-dock: "a dark glint of
 *     water" → Sonnet escalated to a literal glowing beam + starry patch
 *     sliced into a daytime scene) — this is a LIVE RISK here specifically,
 *     since water spray + light effects (mist, rainbow, glow) is exactly
 *     the content class that trips it. Explicit ban included.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_waterfall_glade_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, MAGICAL-FEELING COUNTRYSIDE WATERFALL
descriptions for a cozy countryside anime bot — a small waterfall glade as a rich, living little
world of its own, entirely through its physical details. The waterfall or its pool is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — SCALE: this is always a SMALL, PERSONAL, intimate countryside waterfall — a gentle
cascade a person could walk right up to and wade into, never a huge, towering, thundering, or
dramatic Niagara-scale feature. Think a modest stream tumbling a few feet over a mossy rock ledge
into a clear pool below, tucked into a quiet fold of the countryside — never vast, never epic,
never monumental.

Lean into these hero details, mixing and varying which ones lead each entry: a gentle cascade of
clear water tumbling over moss-covered rocks and smooth stone ledges, a small clear pool at the
base with sunlight reaching all the way to a pebbled or sandy bottom, smooth flat stones scattered
at the water's edge perfect for sitting on, soft ferns and small wildflowers growing thick along
the mossy banks, a light drifting mist rising where the water meets the pool below, a faint rainbow
sometimes catching in that mist where the light strikes it just right, dragonflies hovering low
over the still water at the pool's edge, water striders skating across the calm surface, smooth
pebbles visible beneath the clear water, overhanging leafy branches framing the cascade, a fallen
log or a ring of flat stepping-stones crossing the pool's shallow end, dappled sunlight filtering
down through the surrounding trees onto the water. Vary time of day (soft morning mist, bright
midday sun on the water, golden late-afternoon light through the spray, soft dusk), viewpoint
(close on the cascade itself, a wider view of the whole pool and its mossy banks, low at the
water's edge looking up at the falling water), season-neutral greenery, and which physical detail
leads each entry.

CRITICAL — describe a cluster of similar small objects (a scatter of smooth stones, a row of
stepping-stones, a cluster of ferns) HOLISTICALLY as one arrangement or group — plain physical
description only, never an individual per-object action verb or personality given to any single
piece (no "each stone seems to hum" or similar personifying phrasing for any one item in a
cluster).

CRITICAL — describe light, mist, and any rainbow effect in plain, literal terms only (a soft mist,
a faint rainbow catching in the spray, sunlight glinting off the water, a gentle glow where the
light strikes the falling water) — NEVER a metaphorical object-noun standing in for light or water
(no "curtain of diamonds," "ribbons of silver," "confetti of light," "scattered gems," or similar),
since figurative light language reliably renders as the literal object instead of light.

CRITICAL — never pair "dark"/"darkness"/"shadow" with a light-implying word like "glint," "sparkle,"
"shimmer," "luminous," or "glow" describing the SAME thing in the same phrase (e.g. "the dark pool
given a luminous sparkle," "shadowed water catching a shimmering glint"). This exact contradictory
pairing is a documented trap: Sonnet's brief-to-prompt rewrite tends to escalate it into a literal
glowing light source or a starry night-sky patch cut into what should be one continuous daytime
scene. Describe any shaded or shadowed patch of rock or water plainly, with no light-word attached
in the same breath (e.g. "a shaded pocket beneath the ledge where the rock stays cool and mossy").

CRITICAL — keep the "gentle magic" touches (mist, a faint rainbow, a soft glow in the spray)
SUBTLE and grounded in real physics — this is a real, physical countryside waterfall with one small
touch of everyday wonder, never a glowing portal, never floating rocks or lights, never a fantasy
creature, never anything that reads as epic fantasy magic. At most 1 in 4 entries should mention the
rainbow-in-mist detail at all — the rest should be purely physical description (rocks, water, moss,
ferns, stones) with no magic-adjacent language.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A gentle cascade of clear water tumbles a few feet over a moss-covered rock ledge into a small,
sun-warmed pool below, smooth flat stones scattered along the mossy bank and a dragonfly hovering
low over the still, pebble-bottomed water.", "A small clear pool sits tucked beneath a low waterfall,
soft ferns and wildflowers crowding the mossy banks on every side, a light mist drifting up where
the water meets the surface and catching a faint rainbow in the bright midday sun."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers
of any kind, NO brand names, NO photographer/camera-brand names, NO bare/empty waterfall lacking
a specific rock/moss/water/stone/plant detail, NO huge/towering/thundering/dramatic/Niagara-scale
imagery (always small and personal in scale), NO metaphorical light-as-object language, NO
per-object personification within a cluster of similar items, NO dark+light contradictory pairing
in the same phrase, NO epic-fantasy magic (glowing portals, floating rocks/lights, fantasy
creatures — at most a faint, physically-grounded rainbow in the mist), NO wide-still-lake framing
(that belongs to lakeside-riverside-moment), NO small backyard-pond-with-lily-pads framing (that
belongs to summer-evening-by-the-pond), NO dock/wooden-structure-as-hero framing (that belongs to
fishing-dock) — the FALLING, MOVING water itself must always be present and be the hero.

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

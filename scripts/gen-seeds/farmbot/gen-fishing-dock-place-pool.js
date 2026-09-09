#!/usr/bin/env node
/**
 * FarmBot — fishing_dock_place bespoke pool ("Fishing Dock" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE, VILLAGE_STREET_PLACE,
 * LAKESIDE_RIVERSIDE_PLACE, ARTISAN_WORKSHOP_PLACE, COZY_INN_INTERIOR_PLACE.
 *
 * CRITICAL distinction from the two existing water-adjacent paths — the hero
 * here is the DOCK STRUCTURE ITSELF, not the body of water:
 *   - POND_PLACE (summer-evening-by-the-pond) — the small, intimate POND is
 *     the hero (lily pads, stepping stones, a tucked-away backyard-scale
 *     pool).
 *   - LAKESIDE_RIVERSIDE_PLACE (lakeside-riverside-moment) — the WIDE OPEN
 *     WATER is the hero (a far shoreline, a long view, a broad lake or
 *     flowing river).
 *   - THIS pool (fishing-dock) — a small WOODEN DOCK STRUCTURE is the hero:
 *     weathered grey planks, a coiled rope on a post or cleat, a fishing rod
 *     leaning against a post, a bucket, a mooring post/piling, maybe a
 *     moored rowboat tied alongside. The water is glimpsed AROUND and BELOW
 *     the dock as secondary background, never described as the wide subject
 *     of the shot the way the lakeside pool's entries are.
 *
 * Guards baked in from today's lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added to the meta-prompt itself, same as village-street-wandering)
 *   - metaphorical-light-language trap ("coins of light" → literal coins on
 *     an orchard-afternoon render) — explicit literal-light-language rule
 *   - per-object-agency-framing trap (round river stones read as personified
 *     faces on lakeside-riverside-moment when framed with individual
 *     per-object action verbs) — explicit holistic-collection rule for any
 *     cluster of similar small objects (planks, pilings, coiled rope loops)
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fishing_dock_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL WOODEN FISHING DOCK descriptions for a cozy
countryside anime bot — a small weathered wooden dock as a rich, living little world of its own,
entirely through its physical details. The dock itself (or one specific part of it — the planks,
a mooring post, the end of the dock) is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — the DOCK STRUCTURE ITSELF is the hero of the shot, NOT the body of water. This is a
SMALL, humble, weathered wooden dock — not a wide lake vista and not a grand marina. Lean into
DOCK-STRUCTURE-hero imagery: sun-bleached and weathered grey-brown wooden planks (some warped,
some patched, gaps between boards), a coiled length of rope looped neatly over a worn wooden
mooring post or iron cleat, a bamboo or wooden fishing rod propped and leaning against a post or
railing, a battered tin or wooden bucket sitting on the boards (sometimes empty, sometimes with
a little water in it), a small weathered rowboat moored alongside and bumping gently against the
dock, a low wooden railing or single simple piling at the dock's edge, a tackle box sitting open
on the planks, a woven fishing net draped over a post to dry, a rusty old lantern hook, a stack of
life-worn wooden crab or lobster traps, a frayed life ring hung on a post, weathered rope fenders
hanging along the edge, moss or lichen creeping up a piling, small gaps between boards showing
calm water below, water lapping gently against the pilings at the edges of the frame (kept
secondary — a background detail, never the described subject of the sentence the way a lake or
river would be). A heron standing statue-still at the dock's edge or a duck or two paddling near
the pilings is a welcome touch of stillness/wildlife-neutral detail, described as part of the dock
scene rather than as the hero. Vary time of day (misty dawn, bright midday, golden late-afternoon,
soft dusk), viewpoint (looking down the full length of the dock, close on one weathered plank-and-
post corner, from the far end looking back toward shore), and which physical dock detail leads.

CRITICAL — describe a cluster of similar small objects (a stack of planks, a row of pilings, coils
of rope) HOLISTICALLY as one arrangement or group — plain physical description only, never an
individual per-object action verb or personality given to any single piece (no "each plank seems
to creak" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, soft light spilling across a surface, sunlight glinting off the water) — NEVER
a metaphorical object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered
gems of sun," or similar), since figurative light language can render as the literal object instead.

CRITICAL — never pair "dark"/"darkness"/"shadow" with a light-implying word like "glint,"
"sparkle," "shimmer," "luminous," or "glow" describing the SAME thing (e.g. "a dark glint of water,"
"the darkness given a gentle luminous sparkle"). That contradictory pairing is exactly the kind of
phrase Sonnet's brief-to-prompt rewrite tends to escalate into a literal glowing light source or
starry night-sky patch cut into an otherwise daytime scene (a real bug, seen on this exact pool: "a
dark glint of water" became "the darkness beneath given a gentle luminous sparkle," which rendered
as a glowing vertical beam with visible stars slicing through a foggy daytime dock scene — a
literal split-frame day/night artifact). Describe any gap, shadow, or dark patch of water plainly
(e.g. "a narrow gap between two boards showing calm water below") with no light-word attached.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word implying
a person is present or was recently present. A propped fishing rod or a resting bucket is fine (an
object left in place) — do not describe anyone having just set it down.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Weathered grey-brown planks stretch out over the calm water, sun-bleached and warped with age, a coiled length of rope looped neatly over a worn wooden mooring post near the near end in the soft morning light.", "A small wooden rowboat sits moored alongside the dock's edge, bumping gently against a padded rope fender, a bamboo fishing rod leaning against the nearest post beside a battered tin bucket left on the sun-warmed boards."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers
of any kind, NO brand names, NO photographer/camera-brand names, NO bare/empty dock lacking plank/
rope/post/bucket/rod detail, NO metaphorical light-as-object language, NO per-object personification
within a cluster of similar items, NO wide-lake-vista or far-shoreline framing (that belongs to
lakeside-riverside-moment — keep the water secondary and close, never the wide open described
subject), NO small backyard-pond framing with lily pads or stepping stones (that belongs to
summer-evening-by-the-pond).

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

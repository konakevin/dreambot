#!/usr/bin/env node
/**
 * FarmBot — sugarcane_field_place bespoke pool ("Sugarcane Field" path,
 * Phase 4: Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as PINEAPPLE_FIELD_PLACE, MANGO_ORCHARD_PLACE,
 * BANANA_GROVE_PLACE. Required directly from its JSON in the path file, NOT
 * added to pools.js (shared file — other agents may be touching shared pool
 * files concurrently, see FARMBOT_PATH_BUILD_STATE.md's Phase 4 coordination
 * note).
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, Phase 4 kickoff): "the
 * important thing is that it still feels like a charming FARM since this is
 * FarmBot, just a tropical farm." This must read as a small, CULTIVATED,
 * HAND-TENDED sugarcane field a family or small crew works by hand — NOT an
 * industrial plantation, NOT gritty/realistic agriculture, NOT a wild jungle.
 * Sugarcane carries real-world associations with large-scale industrial
 * monoculture and harsh plantation labor that this bot must never evoke —
 * this meta-prompt bans that register explicitly (industrial/plantation-
 * labor-camp/heavy-machinery language) with the same weight it bans
 * jungle/wild framing, and keeps the field at cheerful, personal, small-crew
 * scale throughout (cheerful order, never industrial or wild).
 *
 * SPECIAL SCALE RISK FOR THIS PATH (flagged explicitly by the build brief):
 * sugarcane grows TALL — well above head height — which makes "character
 * dwarfed by towering rows" an easy trap for Sonnet to fall into on its own,
 * independent of any pool bug. This meta-prompt keeps the CANE's height
 * grounded and approachable (tall, upright, reaching well overhead — never
 * "towering," "looming," or framed as dwarfing/diminishing anything) and the
 * path file itself (sugarcane-field.js) adds an explicit positive
 * scale/proximity instruction so a character reads as IN the field among
 * approachable rows, never a tiny speck lost beneath an overwhelming canopy
 * (same fix woodland-walk.js and pineapple/mango/banana already apply for
 * their own bespoke hero settings).
 *
 * Guards baked in from prior lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added to the meta-prompt itself)
 *   - metaphorical-light-language trap ("coins of light" rendered as literal
 *     gold coins on an orchard-afternoon render) — explicit literal-light-
 *     language-only rule
 *   - per-object-personification trap (round river stones read as
 *     personified faces on lakeside-riverside-moment when framed with
 *     individual per-object action verbs) — explicit holistic-collection
 *     rule for any cluster of similar small objects (cane stalks in a row,
 *     bundled cut cane, jars at a stand)
 *   - signage/label-concept hallucination trap (a garden-vegetable pool's
 *     "wooden plant labels" produced literal hallucinated numerals on the
 *     stakes) — explicit ban on any label/marker/tag/sign/price-board/menu
 *     CONCEPT, not just literal "sign" wording (this matters extra here
 *     since a roadside cane-stand is an explicit brief element and an easy
 *     place for a "menu board" to sneak in)
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_sugarcane_field_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, CULTIVATED, HAND-TENDED TROPICAL SUGARCANE
FIELD descriptions for a cozy countryside anime farm bot — a hand-tended sugarcane field as a rich,
living little world of its own, entirely through its physical details. The field itself (or one
specific part of it — a row, a section near the fence, the path between rows) is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — this is a real WORKING FARM FIELD, the tropical cousin of every other cozy field this
bot has, NOT an industrial plantation, NOT a gritty/realistic-agriculture scene, and NOT a wild
jungle. Every entry must read as neat, tended, and personal/small-crew scale, with cheerful order
throughout: TALL, UPRIGHT ROWS of segmented cane stalks (golden-green to soft purplish-green,
jointed stems, long thin blade-like leaves fanning and rustling from the top of each stalk) planted
in straight or gently curving lines, a well-worn dirt path running between the rows wide enough to
walk down, a curved cane-cutting knife resting against a low wooden fence post, a cart or
wheelbarrow loaded with freshly cut lengths of cane stacked neatly, woven baskets sitting full or
half-full at a row's end, a low wooden or woven fence marking the field's edge. A handful of entries
(not all) may include a small, simple roadside cane-stand: a plain wooden counter, a hand-cranked
juice press, a stack of clean glass jars or cups — nothing more elaborate. The field is SMALL and
INTIMATE in scale — you can see its far edge, and a nearby farmhouse roofline or a line of a few
distant coconut palms marking the boundary is fine as a backdrop, but the field itself is always the
tidy, orderly, CULTIVATED hero, never a dense, overgrown, or wild space, and never a vast industrial
monoculture worked by machinery. Vary time of day within a warm tropical window (bright high sun,
hazy warm late-afternoon glow, soft golden late light), viewpoint (looking straight down one row, a
wide view across several rows toward the field's edge, close on one bundle of cut cane, from the
row's end looking toward the fence and cart), and which physical detail leads.

CRITICAL — SCALE: sugarcane grows tall, well above head height, and that is a genuine, charming part
of its identity — describe the rows as tall, upright, reaching well overhead, with leaves rustling
high above. But keep this grounded and approachable, never described as "towering," "looming," or
in any way emphasizing an overwhelming, dwarfing, or diminishing scale. This is a friendly, walkable,
human-scale field a family tends by hand, not a colossal or endless expanse.

TROPICAL ATMOSPHERE — since this pool carries its own weather (no separate season/weather pick is
used with this path), bake warm, humid, tropical atmosphere directly into every entry: thick warm
sunlight, a faint shimmer of heat haze above the soil, humid air, the drone of unseen insects,
sun-bleached leaf tips catching the light, a rustle implied through visual cues (leaves fanned and
catching a breeze) rather than stated as sound.

CRITICAL — describe a cluster of similar small objects (a row of cane stalks, a bundle of cut cane,
a stack of jars at the stand) HOLISTICALLY as one arrangement or group — plain physical description
only, never an individual per-object action verb or personality given to any single piece (no "each
stalk seems to lean forward" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, sunlight glinting off waxy leaves, a shimmer of heat above the rows) — NEVER a
metaphorical object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered
gems of sun," or similar), since figurative light language can render as the literal object instead.

CRITICAL — do NOT describe any plant label, marker, tag, stake-sign, price board, menu, or any kind
of lettered/numbered surface at the roadside stand or anywhere else, even a blank one — the CONCEPT
of a label or board invites hallucinated readable text on a render even when told "no text." A plain
wooden counter, unmarked jars, cups, or crates are fine — anything framed as a LABEL, MARKER, PRICE
BOARD, or MENU for identifying a row, plant, or price is not.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word implying
a person is present or was recently present. A resting knife, basket, or cart is fine (an object left
in place) — do not describe anyone having just set it down.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Tall, upright rows of segmented sugarcane stalks stand in neat lines under bright tropical sun,
their long thin leaves fanning and catching the light high overhead, a curved cane-cutting knife
resting against a low fence post at the row's end.", "A well-worn dirt path runs straight between
two rows of golden-green cane, a wheelbarrow loaded with freshly cut lengths waiting at the near
edge, warm late-afternoon light glinting off the waxy stalks."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers/
price boards/menus/plant labels/row markers of any kind, NO brand names, NO photographer/camera-
brand names, NO jungle/rainforest/wild/untamed/wilderness/overgrown language of any kind, NO
industrial/plantation-labor-camp framing, NO heavy machinery, harvesters, trucks, or industrial
equipment of any kind, NO thick undergrowth, NO exploration/expedition/trekking energy, NO
"towering"/"looming"/dwarfing-scale language, NO bare/empty field lacking row/cane/tool detail, NO
metaphorical light-as-object language, NO per-object personification within a cluster of similar
items, NO specific building as the hero (a distant rooftop or a few boundary palm trees glimpsed at
the edge is fine, a barn or house up close is not).

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

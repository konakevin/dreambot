#!/usr/bin/env node
/**
 * FarmBot — duck-pond path (Place, full depth, REWORK 2026-09-09).
 *
 * FULL CONTENT REWORK (not a fresh throwaway — Kevin: "can you try and
 * iterate on duck pond, see if you can get it to show ducks or just cute
 * pond scenes? frogs/ducks/birds... or farm animals grazing next to it").
 * The original pool (see git history) was generated with an explicit
 * "roughly HALF Japanese garden-pond style (koi, stone lantern, curved
 * wooden bridge, maple trees)" instruction — a sibling QA pass found the
 * live pool was only ~12% genuinely duck-focused, 45% drifted into
 * Japanese koi-garden/zen-garden imagery, ZERO entries mentioned feeding,
 * and the old grammar rule ("the POND is always the subject named first;
 * a duck/goose/koi may appear only in a TRAILING clause") structurally
 * prevented animals from ever being the hero. All three root causes fixed
 * here:
 *   1. Koi/Japanese-garden register dropped ENTIRELY — this is FarmBot's
 *      Hay-Day-cozy-anime world, not an iyashikei koi-pond bot. Zero
 *      koi/lantern/curved-bridge/bamboo/cherry-blossom/zen language.
 *   2. Grammar flipped: the ANIMAL (or animals) is now the subject named
 *      FIRST in every entry — the pond/water is the setting, described
 *      alongside or just after. This path's differentiator from FarmBot's
 *      own summer-evening-by-the-pond.js (pond-as-hero, intimate setting +
 *      character) is precisely that: duck-pond's hero is the ANIMAL LIFE
 *      AT the pond, not the pond itself.
 *   3. Added a genuine "feeding the ducks" variant (Kevin's own original
 *      creative-brief content, never built) as its OWN small pool —
 *      phrased with an IMPLIED human hand/palm/basket (same convention as
 *      farmbot_activity.json's implied-subject ACTIVITY entries) so it
 *      pairs naturally with a picked CHARACTER block in the path template
 *      without ever naming "man/woman/person" (banHumanLanguage-safe).
 *
 * Two recipes, 120 entries total (fleet holiday-pool-depth precedent, not
 * MVP-25 — this is a rework of already-tested content, not a new build):
 *   - farmbot_duck_pond_scenes.json (100) — animal-hero pond-life scenes,
 *     NO human/character content at all (works standalone in a
 *     no-character render, or alongside a silent character).
 *   - farmbot_duck_pond_feeding.json (20) — the feeding-the-ducks variant,
 *     implied-hand action only, always paired with a character in the
 *     path template.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

// Standing hard rules baked into BOTH recipes (CLAUDE.md + this session's
// documented bug list — see BOT_SCENE_QUALITY_PLAYBOOK.md / shared-blocks.js):
const STANDING_BANS = `
━━━ STANDING HARD BANS (apply to every single entry, no exceptions) ━━━
- NEVER write a negation ("no X", "without X", "nothing beyond") — Flux's
  CLIP/T5 conditioning doesn't process negation; naming a noun even to ban
  it puts that noun's token in the prompt and Flux renders it anyway.
  Describe only what IS there.
- NEVER pair "dark"/"darkness"/"shadow" with a light-word ("glint",
  "sparkle", "shimmer", "luminous", "glow") describing the SAME thing (e.g.
  "a dark glint of water" or "darkness given a luminous sparkle") — this
  produces a literal glowing-beam / split day-night artifact on render, a
  confirmed repeated bug. Pick one register: either plain calm water, or a
  clean light description — never both stacked on the same detail.
- NEVER any race/ethnicity/nationality word or skin-tone exclusion.
- NEVER a readable sign, label, number, or lettering of any kind.
- NEVER name a photographer, camera brand, or real studio/brand.
- NEVER a bare/empty composition — every entry surrounds its animal subject
  with real plant/water detail (reeds, cattails, lily pads, grass, a low
  wooden fence or dock) so it never reads as a blank backdrop.
- NEVER describe a cluster of similar creatures (a row of ducklings, a
  group of frogs) with an individual per-creature action verb for each one
  — describe the group/cluster holistically (e.g. "a row of ducklings
  paddles behind their mother" not "each duckling squeaks and paddles on
  its own").
- This is a WESTERN farm-countryside pond, never a Japanese garden: NEVER
  use "koi", "stone lantern", "curved wooden bridge", "zen", "bonsai",
  "bamboo", "cherry blossom", "Japanese maple", or "paper lantern". Ordinary
  Western trees (willow, oak, maple with normal green or autumn-colored
  leaves) are fine; the arched red-lacquer/curved-bridge + stone-lantern
  register specifically is banned.
25-40 words each. Output ONLY a JSON array of ${'${n}'} strings, no
preamble, no numbering.`;

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_duck_pond_scenes.json'),
    total: 100,
    batch: 20,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FARM-POND ANIMAL-LIFE scene
descriptions for a cozy farm-life bot. This is "the duck pond" path — a
gently cozy Western farm pond or creek where the whole point of the shot is
the animal life living at its edge. UNLIKE a generic pond-mood pool: the
ANIMAL (or animals) is ALWAYS the grammatical SUBJECT named FIRST in the
sentence — never a trailing afterthought. The pond, its water, reflections,
reeds, lily pads, and banks are the SETTING, described alongside or right
after the animal, richly enough that the place still feels lush and
specific, but the animal is always what the sentence opens on and centers.

Across the ${n} entries, aim for roughly this mix (vary freely within each
category — species, pose, time of day, season, weather, angle):
- ~25%: ADULT DUCKS — mallards, white farm ducks, wood ducks, geese —
  swimming, dabbling, preening, drifting, tipping to feed underwater.
- ~20%: DUCKLINGS IN A ROW — a small fluffy brood paddling single-file
  behind their mother, or a gosling trailing a parent, tiny wakes fanning
  out behind them.
- ~15%: FROGS ON LILY PADS — perched, croaking, mid-leap, sunning
  themselves at the water's edge.
- ~15%: SMALL BIRDS AT THE WATER'S EDGE — finches, sparrows, a swallow
  dipping low over the surface, a robin at the reed-line.
- ~20%: FARM ANIMALS GRAZING OR DRINKING AT THE POND EDGE — a lamb, a
  goat kid, a calf, or a pony dipping its head to drink or grazing the
  grassy bank just beside the water.
- ~5%: a MIXED moment — two of the above sharing the same pond edge (e.g.
  ducks gliding past while a goat drinks at the bank).

Setting language draws from: a round farm pond or a gently moving creek,
reed-lined or cattail-fringed banks, lily pads and white or yellow water
blossoms, a low weathered wooden fence, a small wooden dock or a rustic
footbridge, mossy stepping stones, clover and wildflowers at the bank,
willow or oak branches trailing overhead. Vary time of day (dawn, bright
midday, golden hour, soft overcast, misty morning, a gentle rain, dusk,
even a moonlit or firefly-lit evening) and season (spring/summer greenery
most often; a colorful-leaved autumn pond or a frost-jeweled winter edge
sometimes) — keep a genuine mix of warm AND cool/grey/rainy light, not
every entry golden and sunny.

Examples: ["A row of six fluffy yellow ducklings paddles single-file behind their mother across a round farm pond, tiny ripples fanning out from their webbed feet as soft morning light glazes the reed-lined bank.", "A woolly lamb dips its head to drink at the shallow edge of a farm pond, its reflection trembling beside a cluster of white water lilies and a low weathered wooden fence.", "A plump green frog perches on a broad lily pad at the pond's edge, throat pulsing in a quiet croak while cattails sway and the still water holds a pale grey reflection of an overcast sky."]
${STANDING_BANS.replace('${n}', String(n))}`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_duck_pond_feeding.json'),
    total: 20,
    batch: 20,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct "FEEDING THE DUCKS" scene
descriptions for a cozy farm-life bot's duck-pond path (this is content
straight from the bot's own creative brief, never built before). Each
entry shows a handful of feed being offered to ducks at a Western farm
pond, with EAGER, VISIBLE duck response as the hero action — bills
dipping, wings flapping in excitement, a small flotilla paddling quickly
toward the food, ripples crisscrossing the water.

CRITICAL: do NOT name a person (no "man"/"woman"/"boy"/"girl"/"child"/
"person"/"someone"). Instead use an IMPLIED human presence only — an open
palm, an outstretched hand, fingers scattering feed, a basket held at the
water's edge — the same convention this bot's ACTIVITY pool already uses
for human-implied action. The FEED itself can be breadcrumbs, cracked
corn, or seed scattered from a small basket or cupped palm.

Setting language matches the bot's Western farm pond: reed-lined or
cattail-fringed banks, lily pads, a low wooden fence, a small wooden dock,
grassy bank, willow branches. Vary time of day and light (golden hour,
bright midday, soft overcast, a misty morning), and vary WHICH birds
gather — mostly ducks, but a goose or a gosling joining in sometimes.

Examples: ["A handful of breadcrumbs scatters across a pond's glassy surface, drawing a small flotilla of ducks paddling quickly toward the widening ripples, wings flapping in eager anticipation near the reed-lined bank.", "An open palm tips a scoop of cracked corn toward the water's edge, where a cluster of ducks and one bold gosling crowd close, bills dipping eagerly among the scattered feed and lily pads.", "A wicker basket rests open on the grassy bank as fingers scatter seed across the shallows, a paddling of ducks hurrying eagerly across the pond, wakes crisscrossing the golden-lit water."]
${STANDING_BANS.replace('${n}', String(n))}`,
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

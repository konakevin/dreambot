/**
 * FarmBot — seasonal-festival (Phase 3, THE LAST PATH of the 22-path roster,
 * 2026-09-09).
 *
 * A ROTATING bespoke pool of 8 distinct festival concepts, 2 per season:
 *   spring: flower-festival, cherry-blossom-picnic
 *   summer: strawberry-festival, firefly-evening
 *   autumn: pumpkin-festival, lantern-festival
 *   winter: winter-market, gingerbread-snowman (baking + snowman building)
 * One concept is rolled per render (uniform 1-in-8); the bespoke
 * `farmbot_seasonal_festival_place.json` pool (57 entries, tagged
 * `[season, concept-key]`) is filtered to exactly that concept and supplies
 * the hero-of-the-shot setting. See gen-seasonal-festival-place-pool.js for
 * the 8 per-concept generation recipes + the shared ban block (implied-
 * crowd / metaphorical-light / per-object-personification / signage-concept
 * bans, all baked in per FARMBOT_PATH_BUILD_STATE.md's "Lessons found").
 *
 * Deliberately kept distinct from 3 neighboring paths (Kevin's brief):
 *   - harvest-festival owns hay-bale/corn-maze/apple-orchard harvest
 *     imagery — pumpkin-festival and lantern-festival lean into festival
 *     GAMES/DECORATIONS/a carving CONTEST instead (banned at the seed-gen
 *     level, not just here).
 *   - autumn-village-market owns market-stall-goods-for-sale imagery — every
 *     concept here (including winter-market) is framed as a CELEBRATION
 *     (games, decorations, treats enjoyed, not sold) — also banned at the
 *     seed-gen level.
 *   - picnic-in-the-meadow owns the generic picnic-blanket-in-a-meadow scene
 *     — cherry-blossom-picnic anchors hard on the blossoming cherry trees /
 *     drifting petals as the hero visual; the picnic blanket is only ever a
 *     small secondary accent in the bespoke pool's own entries.
 *
 * ⭐ CROSS-CUTTING maxTokens lesson (FARMBOT_PATH_BUILD_STATE.md): this
 * path's content is unusually dense (8 festival concepts' worth of texture
 * behind one path), so the bespoke FESTIVAL block is placed FIRST in the
 * template, ahead of even the character section — the two prior bugs this
 * lesson fixed (rainy-farmhouse-morning's missing rain, barn-animal-
 * shelter-interior's zero animals) were both content that appeared LATE in
 * a dense brief getting thinned/dropped by Sonnet's fixed maxTokens
 * brief-writing call.
 *
 * ACTIVITY design note: rather than tag-filtering the SHARED `pools.ACTIVITY`
 * pool (which risks the documented "tags don't know what's physically
 * compatible" bug — a stream-side or hay-drift action rolled for a winter
 * market or a lantern-lit courtyard would be setting-incompatible), this
 * path hand-authors 3 short activity variants PER CONCEPT below
 * (CONCEPT_ACTIVITY), each written to fit that concept's setting exactly.
 * Full-bespoke, not shared — matches the fleet-wide "never share pools/axes"
 * rule for anything genuinely concept-specific.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-seasonal-festival-place-pool.js
const SEASONAL_FESTIVAL_PLACE = require('../seeds/farmbot_seasonal_festival_place.json');

const CONCEPTS = [
  { key: 'flower-festival', season: 'spring', heading: 'THE SPRING FLOWER FESTIVAL', display: 'spring flower festival' },
  { key: 'cherry-blossom-picnic', season: 'spring', heading: 'THE CHERRY BLOSSOM PICNIC', display: 'cherry blossom picnic beneath the blossoming trees' },
  { key: 'strawberry-festival', season: 'summer', heading: 'THE SUMMER STRAWBERRY FESTIVAL', display: 'summer strawberry festival' },
  { key: 'firefly-evening', season: 'summer', heading: 'THE FIREFLY EVENING', display: 'summer firefly evening' },
  { key: 'pumpkin-festival', season: 'autumn', heading: 'THE AUTUMN PUMPKIN FESTIVAL', display: 'autumn pumpkin festival' },
  { key: 'lantern-festival', season: 'autumn', heading: 'THE AUTUMN LANTERN FESTIVAL', display: 'autumn lantern festival' },
  { key: 'winter-market', season: 'winter', heading: 'THE WINTER MARKET', display: 'winter market festival' },
  {
    key: 'gingerbread-snowman',
    season: 'winter',
    heading: 'THE GINGERBREAD & SNOWMAN WINTER DAY',
    display: 'cozy winter gingerbread-baking-and-snowman-building day',
  },
];

// Hand-authored, concept-specific human actions (implied-subject phrasing,
// same style as pools.ACTIVITY) — see file header for why this is bespoke
// rather than tag-filtered from the shared pool.
const CONCEPT_ACTIVITY = {
  'flower-festival': [
    'kneels beside the flower-crown table, weaving fresh blossoms and ribbon into a delicate wreath',
    'reaches up to loop one more garland of blossoms over the archway, petals drifting loose with the motion',
    'cradles an armful of freshly cut flowers, pausing to breathe in their scent before setting them down',
  ],
  'cherry-blossom-picnic': [
    'reaches up on tiptoe, fingers just brushing a low branch to catch one drifting cherry blossom petal',
    'settles onto the spread blanket beneath the blossoms, tilting a face upward to watch the petals fall',
    'pours tea from a small pot, a stray petal settling softly into the cup as it fills',
  ],
  'strawberry-festival': [
    'holds up a skewer of glazed strawberries, admiring it in the sunlight before taking a happy bite',
    'aims carefully at the ring-toss target, tongue caught between teeth in concentration',
    'balances a slice of strawberry shortcake on a plate, licking a smear of cream from one finger',
  ],
  'firefly-evening': [
    'cups both hands gently around a single glowing firefly, watching its light pulse between careful fingers',
    'lies back on the spread blanket, one arm raised lazily to watch fireflies drift past overhead',
    'holds an empty glass jar up toward the darkening sky, waiting patiently and hopefully for a firefly to land nearby',
  ],
  'pumpkin-festival': [
    'leans over the carving table, carefully pressing a small knife into a jack-o-lantern face',
    'lines up a toss at the ring-toss booth, one eye closed in concentration',
    'hoists a small prize pumpkin proudly overhead with both arms',
  ],
  'lantern-festival': [
    'reaches up on tiptoe to hang a freshly finished paper lantern from a low branch',
    'kneels at the lantern-making table, carefully folding a sheet of colored paper into shape',
    'cups a freshly lit lantern gently in both hands, admiring its glow before letting it join the others',
  ],
  'winter-market': [
    'wraps both hands around a steaming mug, breath misting in the cold festival air',
    'glides carefully across the little ice rink, arms held out for balance',
    'warms both hands over the barrel bonfire, cheeks pink from the cold',
  ],
  'gingerbread-snowman': [
    'presses a row of candy buttons carefully into a gingerbread house wall',
    'pats a fresh layer of snow onto the half-built snowman with both mittened hands',
    'pipes a careful line of icing along a gingerbread rooftop, tongue caught between teeth in concentration',
  ],
};

// ⭐ Round-3 QA finding: the seed-gen-time "STRICT BANS" in
// gen-seasonal-festival-place-pool.js only govern Sonnet's POOL-WRITING
// call — they never reach the separate brief-writing Sonnet call that turns
// this template into the final Flux prompt. A pumpkin-festival round-3
// render invented "round hay bales" scattered around the festival field
// entirely on its own (generic autumn-festival association), even though
// NO pool entry, activity, weather, or camera pick mentioned hay anywhere —
// confirmed by full-text search of the actual ai_prompt. Since this
// template IS read and interpreted by that brief-writing Sonnet call
// (unlike shared-blocks.js's FARMBOT_COZY_NEUTRAL, which bypasses Sonnet
// and lands straight in the final CLIP-facing Flux prompt), an instruction
// HERE reaches Sonnet as intended and works — added a short per-concept
// guard note below, inserted right after the place block (early, matching
// the maxTokens lesson). BUT a first draft phrased it as "do not include
// X," and the very next round showed Sonnet satisfying that instruction by
// echoing a literal negation clause into its OWN Flux-facing output ("no
// hay bales, no corn stalks, no scarecrow") — that particular render came
// out clean, but a negated noun sitting in the FINAL prompt is still a
// known risk one level downstream (CLIP/T5 conditioning doesn't process
// negation — the token lands in the embedding regardless, see the
// CLAUDE.md hard rule and shared-blocks.js's own history of this exact
// failure mode). Rewritten below as pure POSITIVE redirection (describing
// what the ground/scene IS) so Sonnet never has a banned noun to forward.
const CONCEPT_GUARD = {
  'pumpkin-festival':
    "This scene's grounds are simple open grass or packed earth, dressed only with the carving table, bunting, and game booths already described above — every pumpkin here belongs to the contest and the games, being played and enjoyed, not laid out on a stall for purchase.",
  'lantern-festival':
    'Any land beyond the lanterns themselves is simple open grass, garden, or sky — the strings of lanterns and their warm light are the decoration filling this scene.',
  'winter-market':
    'Every stall, wreath, and light described above is here purely for the festival atmosphere, warmth, and fun of the celebration — a place to gather and enjoy the evening together.',
  'cherry-blossom-picnic':
    'The blossoming cherry trees are the star of this shot — the picnic blanket and basket stay a small, quiet accent tucked beneath them.',
};

// CAMERA_COMPOSITION carries latent physical-setting assumptions even though
// the pool is untagged (fishing-dock lesson) — this path spans 8 wildly
// different settings, so exclude entries assuming a farmhouse window, a barn
// doorway, a village street/rooftop, or a character rendered tiny in an open
// field (woodland-walk lesson), none of which fit a festival setting.
const CAMERA_SAFE = pools.CAMERA_COMPOSITION.filter((e) => {
  const t = (typeof e === 'string' ? e : e.description).toLowerCase();
  return !/farmhouse window|barn doorway|village|rendered tiny|tiny within/.test(t);
});

module.exports = ({ sharedDNA, picker }) => {
  // QA-only override (inert in production — nothing sets this env var during
  // normal bot runs): lets a test batch force a specific concept so all 8
  // rotating concepts can be reliably sampled for review instead of relying
  // on random draws to eventually cover all 8.
  const forced = process.env.SEASONAL_FESTIVAL_FORCE_CONCEPT;
  const concept = forced
    ? CONCEPTS.find((c) => c.key === forced) || CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)]
    : CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];

  const place = picker.pickWithRecency(
    SEASONAL_FESTIVAL_PLACE.filter((e) => e.tags.includes(concept.season) && e.tags.includes(concept.key)).map(
      (e) => e.description
    ),
    'seasonal_festival_place'
  );

  // "Sometimes no human" rule + festival communal-gathering allowance
  // (mirrors harvest-festival's headcount roll). Rebalanced 2026-09-09 to
  // the bot-wide 60/40 character/pure-scene split: 43% one character, 17%
  // two characters, 40% no human at all.
  const roll = Math.random();
  const headcount = roll < 0.43 ? 1 : roll < 0.6 ? 2 : 0;

  const characterA =
    headcount >= 1 ? pools.pickCharacter(picker, ['farm', 'leisure'], 'seasonal_festival_character_a') : null;
  const characterB =
    headcount >= 2 ? pools.pickCharacter(picker, ['farm', 'leisure'], 'seasonal_festival_character_b') : null;

  const activity =
    headcount >= 1
      ? picker.pickWithRecency(CONCEPT_ACTIVITY[concept.key], 'seasonal_festival_activity')
      : null;

  // NOTE: deliberately does NOT pull pools.SEASON (round-2 QA finding, see
  // FARMBOT_PATH_BUILD_STATE.md-style lesson below) — mirrors
  // orchard-afternoon's own precedent of not duplicating an axis the bespoke
  // pool already owns. Round-2 QA caught pools.SEASON's autumn entries
  // independently mentioning "hay bales" / "hay-dotted field," which leaked
  // straight into a lantern-festival render's background despite this
  // concept's own bespoke pool explicitly banning hay-bale imagery to stay
  // distinct from harvest-festival — a shared axis silently re-introducing
  // banned content, the same "tags don't know what's compatible" class of
  // bug as byTags leaks elsewhere in this bot. The bespoke place pool
  // already carries each concept's season identity strongly (blossoms,
  // fireflies, pumpkins/lanterns, snow) — pulling SEASON on top added no
  // signal and only risked contradiction.
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, [concept.season]),
    'seasonal_festival_weather'
  );
  const camera = picker.pickWithRecency(
    CAMERA_SAFE.map((e) => (typeof e === 'string' ? e : e.description)),
    'seasonal_festival_camera'
  );

  const animalChance = headcount === 0 ? 0.75 : 0.4;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal =
    headcount === 0
      ? pools.pickPureSceneLife(picker, {
          animalPool,
          animalChance,
          // winter-market / gingerbread-snowman are winter-locked — opt into
          // the winter-only ambient entries and strip the warm-season ones
          // (bees/butterflies/cherry blossoms) so a snowy festival never
          // draws either mismatch.
          ambientTags: concept.season === 'winter' ? ['outdoor', 'winter'] : ['outdoor'],
          excludeAmbientTags: concept.season === 'winter' ? ['warm'] : undefined,
          axisPrefix: 'seasonal_festival',
        })
      : Math.random() < animalChance
        ? picker.pickWithRecency(animalPool, 'seasonal_festival_animal')
        : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'seasonal_festival_magic')
      : null;

  const guard = CONCEPT_GUARD[concept.key];

  // ⭐ Round-3 QA finding: a legitimately 'medium'-tagged ANIMAL_COMPANIONS
  // entry ("Four piglets tumbling around a mud puddle — two wrestling...")
  // is unusually verbose (individual personality/action per animal) and, on
  // a no-character render, out-competed the bespoke festival place block for
  // prominence — Sonnet put the piglets "in the foreground" and the
  // rose-wreathed fence "in the mid-ground" with "a soft pastoral blur"
  // background treatment, visually demoting the flower-festival hero to an
  // afterthought. Not a tag bug (the pick correctly honored the
  // low/medium-only filter) — a content-balance issue on no-character
  // renders specifically, where nothing else anchors the frame against a
  // rich animal entry. Fixed below by explicitly telling Sonnet the animal
  // must stay a small supporting detail, never scaled up or elaborately
  // posed enough to outweigh the festival decorations.
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ ${concept.heading} (the hero of the shot) ━━━
${place}
${guard ? `${guard}\n` : ''}${
  characterA
    ? `\n━━━ THE CELEBRANTS ━━━\n${characterA}\n${characterB || ''}\n`
    : ''
}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ AN ANIMAL AT THE FESTIVAL ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  characterA
    ? `render a joyful, warm ${concept.display} moment — the celebrants and the fully
decorated festival setting rendered with equal loving richness, never a bare backdrop. Every
face in the frame, human and animal alike, stays clearly separate and fully legible — each face
keeps its own open space with a visible gap of air between it and any other face, so every
expression reads clean and unambiguous.`
    : `no human figure anywhere in the frame — this is a joyful, cozy ${concept.display} still-life
moment, fully decorated and glowing, ready for the celebration. The festival setting carries the
whole scene as its clear main subject, rendered with rich loving detail, never plain or empty —
every decoration described above stays sharp, prominent, and in full loving detail, never
softened into a background blur.${animal ? ' Any animal present appears as a small, charming detail living happily within this decorated setting — never scaled up or so elaborately posed that it outweighs or crowds out the festival decorations themselves. If it is a real animal it reads as a naturally distinct creature with open air around it; if it is a small insect, bird, or floating detail instead, it stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};

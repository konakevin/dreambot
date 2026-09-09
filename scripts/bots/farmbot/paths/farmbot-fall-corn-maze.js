/**
 * FarmBot — farmbot-fall-corn-maze (SEASONAL path, Fall, 2026-09-09).
 *
 * ⚠️ ARCHITECTURALLY DIFFERENT from FarmBot's normal 30-path rotation. This
 * path is NOT added to `bot.paths[]` — it lives in a separate
 * `bot.seasonalPaths.fall` array (scripts/lib/botSeasonal.js) and is only
 * ever drawn during the Fall holiday calendar window, on its own persisted
 * seasonal shuffle-bag, entirely excluded from the normal path cycle.
 * Precedent + exact mechanism: scripts/bots/chibibot/paths/chibi-halloween-
 * cozy.js (a seasonal path built the same way, self-contained, own bespoke
 * pools). Whoever registers this path adds it to
 * scripts/bots/farmbot/index.js's `pathBuilders` map AND a new
 * `seasonalPaths: { fall: ['farmbot-fall-corn-maze', ...] }` block — see the
 * exact lines in the build report. Never add it to `paths[]`.
 *
 * CONCEPT: a charming hand-cut corn maze on the farm — tall corn stalk
 * walls forming winding paths, a character (or nobody) wandering through,
 * a small unlettered wooden arrow marker at a fork, warm string lights or
 * small lanterns marking the way at dusk, autumn leaves scattered
 * underfoot. General FALL/harvest-season charm — explicitly NOT a
 * Halloween path (no jack-o-lanterns, no costumes, no spooky content); the
 * "Fall" calendar window (per botSeasonal.js's holidays table) already
 * excludes Halloween-specific imagery by design, and every bespoke pool's
 * own gen-script meta-prompt bans it again at the source as a second layer.
 *
 * DIFFERENTIATOR FROM harvest-festival.js's HARVEST_FESTIVAL_PLACE POOL
 * (read that file's own doc comment first — it explicitly already covers a
 * "hay-bale maze" and "corn maze entrance / corn-stalk archway" as ONE OF
 * SEVERAL decorative festival-ground elements viewed as a wide outside
 * tableau). This path is instead 100% dedicated to the WANDERING/GETTING-
 * LOST/DISCOVERY experience of actually being INSIDE the maze corridors —
 * winding paths, forks, bends, dead ends, small clearings — never a wide
 * outside view of the whole layout and never a festival-grounds
 * establishing shot (hay bales/wheelbarrows/wagon/scarecrow all explicitly
 * banned at the bespoke pool's own gen-script level, see
 * gen-fall-corn-maze-corridor-pool.js). The maze-corridor axis is the hero
 * and is named FIRST in the template below, per the ⭐ CROSS-CUTTING
 * maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md (Sonnet's brief-writing
 * call has a fixed maxTokens:400 and content late in a dense brief gets
 * thinned/dropped first).
 *
 * FOUR bespoke pools (own gen scripts, own JSON — NOT added to pools.js,
 * shared file other agents are editing concurrently), each
 * scripts/gen-seeds/farmbot/gen-fall-corn-maze-<axis>-pool.js:
 *   1. MAZE_CORRIDOR   (always, hero)      — the maze's physical winding-
 *                                            path architecture, from within.
 *   2. WANDER_ACTIVITY (character only)    — specific wandering/discovery
 *                                            gestures (only meaningful with
 *                                            an implied human subject, same
 *                                            convention as the shared
 *                                            ACTIVITY pool).
 *   3. MAZE_ATMOSPHERE (always)            — daytime + dusk light,
 *                                            including the string-lights/
 *                                            lanterns-marking-the-path beat
 *                                            — every entry describes lights
 *                                            PLAINLY, dark+light
 *                                            contradictory-pairing ban baked
 *                                            in at the gen-script source
 *                                            (this exact bug rendered as a
 *                                            literal glowing artifact on a
 *                                            different FarmBot path
 *                                            tonight).
 *   4. MAZE_DETAIL     (always)            — one small charming found
 *                                            object at a turn/fork (an
 *                                            unlettered wooden arrow
 *                                            marker, a tied bundle of dried
 *                                            corn husks, a few whole
 *                                            uncarved gourds, a basket of
 *                                            gathered leaves) — the
 *                                            signage-hallucination risk on
 *                                            the arrow-marker concept is
 *                                            neutralized at the source by
 *                                            baking "no lettering, no
 *                                            carved marks, no numbers"
 *                                            directly into every marker
 *                                            entry's own text, not just the
 *                                            pool-wide suffix.
 *
 * Skips the shared SEASON and WEATHER_ATMOSPHERE pools entirely — both
 * pools' entries describe a DIFFERENT whole landscape (orchard lane,
 * lakeside reeds, a lamb meadow) or a time-of-day/light framing that would
 * compete/contradict the bespoke MAZE_ATMOSPHERE pool's own dedicated
 * daytime+dusk light content (which already carries the Fall feel
 * directly) — same reasoning as garden-vegetable-patch-tending.js /
 * tropical-flower-garden.js skipping one or both for the same class of
 * reason.
 *
 * ARCHETYPE_INCOMPATIBLE: `pools.pickCharacter(picker, ['farm','leisure'])`
 * is a documented near-NO-OP (nearly every CHARACTER_ARCHETYPE entry
 * carries 'ANY') — reused tropical-flower-garden.js's exact proven filter
 * (excludes baker/café/shopkeeper/weaver/potter/carpenter/fisher/innkeeper
 * occupational props that would look like a physical mismatch on someone
 * casually wandering a corn maze) via a local pickMazeCharacter() built
 * from pools.js's exported pieces — no pools.js edit.
 *
 * CAMERA_COMPOSITION manually filtered (untagged pool) to drop: (a) every
 * documented phrasing of the "character tiny/dwarfed in a sweeping/sky-
 * dominating landscape" bug (CLAUDE.md hard rule — a LIVE RISK for this
 * path specifically given the tall corn walls), (b) back-turned/rear-view/
 * over-the-shoulder framings, (c) village/rooftop/interior/window/doorway
 * framings that are a physical-setting mismatch for an open-air maze
 * corridor. Verified the shared pool (109 entries as of this build) still
 * contains un-scrubbed instances of (a) and (c) despite the documented
 * source-level fix — the fix only stopped NEW generation, it did not
 * retroactively clean the existing pool, so the manual filter here is load-
 * bearing, not defensive-only.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-fall-corn-maze-corridor-pool.js
// scripts/gen-seeds/farmbot/gen-fall-corn-maze-wander-activity-pool.js
// scripts/gen-seeds/farmbot/gen-fall-corn-maze-atmosphere-pool.js
// scripts/gen-seeds/farmbot/gen-fall-corn-maze-detail-pool.js
const MAZE_CORRIDOR = require('../seeds/farmbot_fall_corn_maze_corridor.json');
const WANDER_ACTIVITY = require('../seeds/farmbot_fall_corn_maze_wander_activity.json');
const MAZE_ATMOSPHERE = require('../seeds/farmbot_fall_corn_maze_atmosphere.json');
const MAZE_DETAIL = require('../seeds/farmbot_fall_corn_maze_detail.json');

// Manual archetype filter — see header note above. Identical proven regex
// to tropical-flower-garden.js's ARCHETYPE_INCOMPATIBLE (same source pool,
// same class of occupational-prop mismatch for a casual open-air leisure
// scene). Excludes bakery/café serving props, a shopkeeper's ledger/
// measuring tape, a weaver's shuttle/loom, a potter's clay-smudged apron/
// kiln, a carpenter's tool belt/saw, a fisher's net/lure/anchor charm, an
// innkeeper's bell/mug charm — keeps gardener, flower-seller, herbalist,
// generic farm girl/boy, shepherd, and settled-traveler archetypes, all of
// which read naturally wandering a corn maze.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|café|cafe|coffee|dish towel|teacup|tray|shopkeeper|measuring tape|ledger|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|anchor charm|shell pendant|\blure\b|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm)\b/i;
const MAZE_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered MAZE_ARCHETYPES above — see header note.
// Uses only pools.js's exported pieces, no pools.js edit.
function pickMazeCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(MAZE_ARCHETYPES, `${axisPrefix}_archetype`);
  const gender = pools.genderOf(archetype) || 'ANY';
  const hairstyle = picker.pickWithRecency(pools.byTags(pools.HAIRSTYLE, [gender]), `${axisPrefix}_hairstyle`);
  const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), `${axisPrefix}_hair_color`);
  const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), `${axisPrefix}_eye_color`);
  const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), `${axisPrefix}_skin_tone`);
  return `${archetype.description}
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}`;
}

// Manual content filter (CAMERA_COMPOSITION is untagged) — see header note.
// Drops every documented phrasing of the dwarfing bug, back-turned framings,
// and village/rooftop/interior/window/doorway physical-setting mismatches.
const CAMERA_INCOMPATIBLE =
  /\b(tiny|dwarf\w*|sweeping|sky dominating|over-the-shoulder|rear view|back turned|facing away|village|rooftops?|interior|window|doorway)\b/i;
const MAZE_CAMERA = pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e));

module.exports = ({ sharedDNA, picker }) => {
  // Standardized "sometimes no human" rule (Kevin 2026-09-09): flat 60/40
  // character/pure-scene split across FarmBot.
  const includeCharacter = Math.random() < 0.6;

  const corridor = picker.pickWithRecency(MAZE_CORRIDOR, 'fall_corn_maze_corridor');

  const character = includeCharacter ? pickMazeCharacter(picker, 'fall_corn_maze_character') : null;

  // Only meaningful when a character is present (implied human subject,
  // same convention as the shared ACTIVITY pool).
  const wanderActivity = includeCharacter
    ? picker.pickWithRecency(WANDER_ACTIVITY, 'fall_corn_maze_wander_activity')
    : null;

  const atmosphere = picker.pickWithRecency(MAZE_ATMOSPHERE, 'fall_corn_maze_atmosphere');
  const detail = picker.pickWithRecency(MAZE_DETAIL, 'fall_corn_maze_detail');
  const camera = picker.pickWithRecency(MAZE_CAMERA, 'fall_corn_maze_camera');

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'fall_corn_maze_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'fall_corn_maze',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'fall_corn_maze_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CORN MAZE (the hero of the shot) ━━━
${corridor}
This is a genuine walk-through maze experience — the close, winding, wall-of-
tall-corn feeling of actually being inside one stretch of it, never a wide
outside view of the whole maze layout and never a festival-grounds
establishing shot with hay bales or a wagon in frame.
${
  character
    ? `\n━━━ THE WANDERER ━━━\n${character}\n\n━━━ WHAT THEY'RE DOING (caught mid-moment, exploring/discovering the maze) ━━━\n${wanderActivity}\n`
    : ''
}
━━━ ATMOSPHERE & LIGHT ━━━
${atmosphere}
${detail ? `\n━━━ A SMALL FOUND DETAIL AT THIS TURN ━━━\n${detail}\n` : ''}
${animal ? `━━━ ANIMAL COMPANY ━━━\n${animal}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, playful fall-corn-maze wandering moment — the winding
maze corridor and the wanderer rendered with equal loving richness, caught
genuinely mid-exploration (peering, pausing, discovering), never a static
posed portrait staring at the camera. Every face in the frame, human and
animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, quietly
inviting corn-maze corridor moment carried entirely by the winding path,
tall rustling corn walls, and the found detail tucked at this turn, ready
for someone to wander through, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} this is general Fall/harvest-season charm — no jack-o-lanterns or carved
pumpkin faces, no costumes, no spooky content — just warm autumn wandering
and discovery. no text, no words, no letters, no numbers, no watermarks,
gallery quality`;
};

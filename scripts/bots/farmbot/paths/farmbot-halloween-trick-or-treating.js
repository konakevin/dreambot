/**
 * FarmBot — farmbot-halloween-trick-or-treating (SEASONAL, Halloween-window
 * only, 2026-09-09). Lives ONLY in bot.seasonalPaths.halloween — NEVER add
 * this key to bot.paths[] (the normal shuffle-bag would then draw it in
 * July). See scripts/lib/botSeasonal.js for the gate mechanism and
 * FARMBOT_PATH_BUILD_STATE.md for the full seasonal-push architecture note.
 *
 * CONCEPT (Kevin's brief, verbatim intent): "for halloween we could add a
 * 'trick-or-treating' one? where we have characters or even animals dressed
 * up in costumes?" — the DOOR-TO-DOOR / TREAT-COLLECTING narrative
 * specifically: a costumed trick-or-treater (human child, OR a costumed
 * animal companion, OR a human WITH a costumed animal companion tagging
 * along) holding/carrying a treat bag/basket/pumpkin pail, arriving at a
 * decorated farmhouse doorway (carved jack-o-lantern, string lights, a bowl
 * of candy already waiting on the doorstep) — OR walking a decorated garden
 * path strung with jack-o-lanterns between farm buildings. The classic warm,
 * joyful "receiving candy" moment. PLAYFUL FAMILY-FRIENDLY HALLOWEEN ONLY —
 * never real horror, gore, or genuine scares (standing bot-wide constraint).
 *
 * Kept genuinely distinct from two sibling Halloween paths (built
 * concurrently by other agents, see FARMBOT_PATH_BUILD_STATE.md's
 * coordination note):
 *   - farmbot-halloween-barn-party — an indoor/barn celebration scene.
 *   - farmbot-halloween-costume-parade — a walking costume SHOWCASE/
 *     procession scene (costumes are the point; no door, no candy).
 *   This path's identity is specifically the THRESHOLD/DOORSTEP or the
 *   between-houses PATH, with a treat bag/pail as a REQUIRED key prop and a
 *   decorated doorway (or path) as the fixed setting — never a party, never
 *   a runway-style parade.
 *
 * Avoids rendering a second "door-answerer" character entirely (sidesteps
 * an awkward implied-extra-figure problem and any camera confusion about
 * whose POV is being shown): the bespoke DOORWAY pool always describes a
 * bowl of candy already set out and waiting, so the trick-or-treater takes
 * candy from the waiting bowl rather than receiving it from an unseen hand.
 *
 * 3 bespoke pools (own gen scripts + own JSON, isolated per the multi-agent
 * fan-out contract — NOT added to pools.js):
 *   scripts/gen-seeds/farmbot/gen-halloween-trick-or-treating-doorway-pool.js
 *     → farmbot_halloween_trick_or_treating_doorway.json (place, HERO)
 *   scripts/gen-seeds/farmbot/gen-halloween-trick-or-treating-costume-pool.js
 *     → farmbot_halloween_trick_or_treating_costume.json (costume ITEM only,
 *       layered OVER either a human child or a costumed animal companion —
 *       shared by both branches)
 *   scripts/gen-seeds/farmbot/gen-halloween-trick-or-treating-treat-container-pool.js
 *     → farmbot_halloween_trick_or_treating_treat_container.json (held
 *       object only, the REQUIRED distinguishing prop vs. the two siblings)
 * Plus 2 short hand-authored inline lists (no gen script needed, matching
 * the "a handful of options doesn't need a generated pool" precedent from
 * chibi-halloween-outing.js's LIGHTING_TIME): FIGURE (base human
 * trick-or-treater phrasing) and ATMOSPHERE (dusk-through-early-evening
 * register only — hand-written specifically to avoid ever pairing a
 * dark/shadow word with a light/glow word describing the same thing, the
 * live dark+light contradictory-pairing bug documented on fishing-dock).
 *
 * CHARACTER LOGIC (per the standing 60/40 bot-wide split, Kevin 2026-09-09):
 *   includeCharacter = Math.random() < 0.6.
 *   - Human branch: a simple custom figure + atomic appearance axes
 *     (hair-color/eye-color/skin-tone via the shared pools), NOT
 *     pools.pickCharacter()'s CHARACTER_ARCHETYPE — every archetype entry
 *     describes an occupational OUTFIT (farm girl's apron, baker's smock),
 *     which would visually fight the costume that's actually worn on top;
 *     the costume itself fully replaces the "what are they wearing" slot.
 *     HAIRSTYLE deliberately dropped (round-1 QA fix, see below) — most
 *     costume entries describe a snug hood/headpiece, so a specific
 *     hairstyle pick risks visually contradicting the hood; hair color is
 *     kept as a short "wisps visible at the hood's edge" clause instead.
 *     Occasionally (35%) also brings along a costumed animal companion.
 *   - No-character branch: primarily (65%) a costumed ANIMAL companion
 *     trotting up to the doorway on its own (per the brief's "even animals
 *     dressed up in costumes" and this path's task brief's explicit
 *     guidance to prefer this over generic ambient life for an inherently
 *     trick-or-treating concept) — falls back (35%) to
 *     pools.pickPureSceneLife() (guaranteed non-null: a plain low-density
 *     ANIMAL_COMPANIONS pick or an AMBIENT_LIFE pick) so the fully-empty
 *     branch is never a bare, lifeless doorway.
 *
 * Camera: pools.CAMERA_COMPOSITION manually filtered to drop any residual
 * dwarfing/scale-dissolving entries (11 of 109 still carry "tiny within a
 * sweeping landscape"-style language predating the source-level fix
 * documented in FARMBOT_PATH_BUILD_STATE.md's "back-turned character" +
 * "always sunny" section — the over-the-shoulder/rear-view entries were
 * already fully removed at the source, but the dwarfing ones from an
 * earlier scale-up round were not retroactively purged). Plus an explicit
 * forward-facing composition instruction in the closing paragraph, since an
 * "approaching a door" concept is a natural trap for a walking-away/
 * back-turned framing.
 *
 * ⭐ ROUND-1 QA FIX (maxTokens budget-starvation, 2026-09-09): all 5 round-1
 * test renders' stored `ai_prompt` came back truncated mid-sentence against
 * the fixed `maxTokens: 400` Sonnet call (botEngine.js callClaude) — the
 * template originally stacked DOORWAY (hero place, ~40-word bespoke entry)
 * BEFORE THE CAST, and asked for 4 full appearance axes (hairstyle/hair-
 * color/eye-color/skin-tone) plus costume plus treat-container plus an
 * optional pet, with no length guidance. Two concrete failures confirmed via
 * DB `ai_prompt`: one human-branch render was cut off mid-clause right as it
 * transitioned into describing the costume ("...Over their," — the costume
 * clause never appeared at all, the single most identity-defining content in
 * this whole path); one no-character ambient-branch render was cut off with
 * ZERO animal/life content anywhere in the visible text (the exact
 * papaya-guava-orchard "guaranteed pick doesn't survive the brief" failure
 * mode). Fixed by: (1) moving THE CAST block ahead of THE DOORWAY in the
 * template (costume/treat-container/guaranteed-life now read before Sonnet's
 * budget is spent describing the setting), (2) dropping the HAIRSTYLE axis
 * entirely (see above), (3) adding an explicit plain-language length/
 * trim-priority instruction (matching chibi-halloween-outing.js's proven
 * pattern, FarmBot-safe cooperative wording — never "NON-NEGOTIABLE/
 * AUTHORITY/OVERRIDES", see shared-blocks.js's lookOverride() hard lesson),
 * and (4) repeating the guaranteed ambient-life content a second time,
 * verbatim, in the closing paragraph (matching the proven papaya-guava-
 * orchard fix). Re-verified clean on round 2 — see the tracker.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, sibling seasonal-path agents are editing concurrently). See the
// gen-seeds scripts named in the header comment above.
const DOORWAY = require('../seeds/farmbot_halloween_trick_or_treating_doorway.json');
const COSTUME = require('../seeds/farmbot_halloween_trick_or_treating_costume.json');
const TREAT_CONTAINER = require('../seeds/farmbot_halloween_trick_or_treating_treat_container.json');

// Short hand-authored base phrasing for the human trick-or-treater — a
// handful of options doesn't need a generated pool (chibi-halloween-outing.js
// LIGHTING_TIME precedent). No occupational/outfit language here — the
// costume IS the outfit.
const FIGURE = [
  'a small, delighted child',
  'a cheerful young villager',
  'an eager little trick-or-treater',
  'a bright-eyed farm kid',
  'a giggly little visitor from a nearby cottage',
  'a bundled-up little trick-or-treater',
];

// Small mundane, pettable animal species suitable for a soft layered
// costume (no exotic/large farm animals — a costumed goose or cow risks an
// awkward anatomy fit for the layered-piece costume design).
const ANIMAL_SPECIES = [
  'a small tabby cat',
  'a fluffy little dog',
  'a floppy-eared rabbit',
  'a waddling duckling',
  'a small brown goat kid',
  'a woolly little lamb',
  'a plump orange kitten',
  'a scruffy little terrier pup',
];

// Dusk-through-early-evening register ONLY, hand-written specifically to
// never pair a dark/shadow word with a light/glow word describing the SAME
// thing (the documented fishing-dock contradictory-pairing bug) — this path
// inherently mixes a darkening evening sky with warm porch/jack-o-lantern
// glow in the same shot, so this axis carries real live risk and is kept
// short + hand-verified rather than Sonnet-generated.
const ATMOSPHERE = [
  'Soft blue-violet dusk settling over the farmyard, the first few stars just appearing, porch lights and jack-o-lanterns glowing warm against the cooling evening sky.',
  'Deepening early-evening light, a dusky lavender sky fading toward the horizon, warm golden glow spilling from windows and lanterns nearby.',
  'A clear indigo evening sky overhead, a full harvest moon rising softly, strings of warm bulb lights glowing steadily along the path.',
  'Late-afternoon light turning gently toward dusk, long soft shadows stretching across the yard, the air crisp with the first chill of an autumn evening.',
  'A misty, cool early evening settling in, gentle grey-blue light, warm lantern glow pooling invitingly on the ground nearby.',
  'Soft amber sunset light lingering just above the treeline, the sky streaked rose and gold, warm porch light beginning to glow as evening approaches.',
  'A calm, clear evening sky deepening toward violet-blue, warm light flickering steadily and cheerfully from within nearby jack-o-lanterns.',
  'Gentle overcast dusk, soft diffused light with a cool blue-grey cast, warm lights glowing cheerfully against the muted evening color.',
];

// CAMERA_COMPOSITION manually filtered — drop residual dwarfing/scale-
// dissolving entries (see header comment). The over-the-shoulder/rear-view
// entries are already fully removed at the shared-pool source, so this
// filter is a defensive top-up, not a duplicate of that fix.
const CAMERA_SAFE = pools.CAMERA_COMPOSITION.filter(
  (c) => !/tiny|dwarf|expansive|endlessly|shoulder|rear view|from behind|back turned|facing away/i.test(c)
);

module.exports = ({ sharedDNA, picker }) => {
  const includeCharacter = Math.random() < 0.6;

  let castBlock = null;
  let momentLine;
  // Only the ambient (no human, no costumed animal) branch sets this — the
  // guaranteed pickPureSceneLife() content, repeated verbatim in the closing
  // paragraph so it survives even if THE CAST section itself gets trimmed
  // (papaya-guava-orchard fix — a front-loaded mention alone isn't enough).
  let guaranteedLifeRepeat = '';

  if (includeCharacter) {
    const figure = picker.pickWithRecency(FIGURE, 'tot_figure');
    const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), 'tot_hair_color');
    const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), 'tot_eye_color');
    const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), 'tot_skin_tone');
    const costume = picker.pickWithRecency(COSTUME, 'tot_costume');
    const treatContainer = picker.pickWithRecency(TREAT_CONTAINER, 'tot_treat_container');

    // Occasionally a costumed animal companion tags along too (Kevin's
    // brief: "characters or even animals dressed up in costumes" — a
    // human WITH a costumed pet is a valid third variant). Kept as short as
    // possible — it's the first thing to drop if the prompt runs long.
    const hasPetCompanion = Math.random() < 0.35;
    const petLine = hasPetCompanion
      ? ` Also joined by ${picker.pickWithRecency(ANIMAL_SPECIES, 'tot_pet_species')} in a small matching costume.`
      : '';

    // Costume + treat container FIRST (this path's two REQUIRED, identity-
    // defining details) — appearance detail (each pool entry is a FULL
    // descriptive sentence, not a bare adjective — matches pools.js's own
    // pickCharacter() line shape, NOT a spliced-together clause) comes
    // last, so it's what gets trimmed first if the prompt runs long.
    castBlock = `${figure} wearing this Halloween costume, layered over their own body, face and hands left clearly visible: ${costume}
Holding this treat container: ${treatContainer}
Skin: ${skinTone}
Eyes: ${eyeColor}
Hair (a few wisps visible at the edge of the costume hood): ${hairColor}${petLine}`;

    momentLine = `${figure} in a playful Halloween costume, holding a treat container, arriving at a warmly decorated doorway glowing with a jack-o-lantern and string lights — the joyful, classic moment of trick-or-treating.`;
  } else {
    const costumedAnimalChance = 0.65;
    if (Math.random() < costumedAnimalChance) {
      const species = picker.pickWithRecency(ANIMAL_SPECIES, 'tot_animal_species');
      const animalCostume = picker.pickWithRecency(COSTUME, 'tot_animal_costume');
      castBlock = `${species} trotting right up to the doorway on its own, wearing this Halloween costume layered over its own fur, its own ears, paws, and tail clearly visible: ${animalCostume}
No human figure anywhere in the frame.`;
      momentLine = `${species} in a playful Halloween costume trotting right up to a warmly decorated doorway glowing with a jack-o-lantern and string lights — a charming trick-or-treating moment, no human figure anywhere in the frame.`;
    } else {
      const life = pools.pickPureSceneLife(picker, {
        animalPool: pools.byTags(pools.ANIMAL_COMPANIONS, ['low']),
        animalChance: 0.5,
        ambientTags: ['outdoor'],
        axisPrefix: 'tot',
      });
      castBlock = `${life}
This is REQUIRED, concrete, clearly-visible content, not just background mood — it must actually appear in the render. No human figure anywhere in the frame.`;
      momentLine = `A warmly decorated doorway glowing with a jack-o-lantern and string lights, no human figure anywhere in the frame — instead: ${life}`;
      guaranteedLifeRepeat = ` The scene is enlivened by this, clearly and prominently visible, not just implied: ${life}`;
    }
  }

  const doorway = picker.pickWithRecency(DOORWAY, 'tot_doorway');
  const atmosphere = picker.pickWithRecency(ATMOSPHERE, 'tot_atmosphere');
  const camera = picker.pickWithRecency(CAMERA_SAFE, 'tot_camera');

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}You are writing a HALLOWEEN "trick-or-treating" scene for FarmBot's cozy countryside world — the classic warm, joyful moment of a costumed trick-or-treater collecting candy at a decorated doorway (or walking a decorated path between farm buildings). PLAYFUL, FAMILY-FRIENDLY HALLOWEEN ONLY: grinning jack-o-lanterns, warm porch glow, candy, cute costumes — never real horror, gore, or anything genuinely scary or unsettling.

Please write ONE flowing, efficient Flux prompt, roughly 150-200 words — keep it tight so every element below survives intact. If you need to shorten anything, shorten the atmosphere/camera description first; never drop or shorten the costume, the treat container, or the required animal/life detail below.

━━━ THE MOMENT (essential — read and keep this first) ━━━
${momentLine}

━━━ THE CAST (essential — describe this in full) ━━━
${castBlock}

━━━ THE DECORATED DOORWAY OR PATH (the setting — describe efficiently, a few phrases, not an exhaustive inventory) ━━━
${doorway}

━━━ ATMOSPHERE + CAMERA ━━━
${atmosphere}
${camera}
The trick-or-treater (human or animal) is captured facing toward the camera — arriving at, standing at, or turned to happily show off their costume and treat haul — as if seen from the doorway's own point of view. NEVER shown from behind, over-the-shoulder, walking away, or with their back to the viewer.

Render a warm, joyful trick-or-treating moment — the decorated doorway (or path) and whoever is collecting treats there rendered with equal loving richness, never a bare backdrop.${guaranteedLifeRepeat} No welcome sign, banner, doormat message, or any readable text or lettering anywhere in the frame. Every face in the shot, human and animal alike, stays clearly separate and fully legible, with a visible gap of open air between any two faces. no text, no words, no watermarks, gallery quality`;
};

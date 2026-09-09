/**
 * FarmBot — farmbot-fall-cider-pressing (SEASONAL path, Fall, 2026-09-09).
 *
 * ⚠️ ARCHITECTURALLY DIFFERENT FROM FARMBOT'S NORMAL 30 PATHS — this is a
 * SEASONAL path, drawn only during the Fall calendar window via the shared
 * `botSeasonal.js` mechanism, from a SEPARATE `bot.seasonalPaths.fall` array
 * that is NEVER mixed into the normal `bot.paths[]` shuffle-bag rotation
 * (see FARMBOT_PATH_BUILD_STATE.md's seasonal-path section, and
 * chibi-halloween-cozy.js for the precedent this mirrors). This file is
 * SELF-CONTAINED — its own bespoke pools, its own path-local helpers — and
 * does not touch pools.js/index.js (other agents are building sibling
 * seasonal paths concurrently; the orchestrator merges `seasonalPaths.fall`
 * centrally once every Fall path is done).
 *
 * CONCEPT: a charming Fall/autumn scene built around a small family farm's
 * own HAND-CRANKED WOODEN CIDER PRESS — the press apparatus itself is the
 * hero prop/activity, always described first (per the ⭐ CROSS-CUTTING
 * maxTokens lesson: botEngine.js callClaude has a fixed maxTokens:400, so
 * content late in a dense brief gets dropped/thinned first). Warm harvest-
 * season charm only — falling leaves, crisp fall air, cozy sweaters, cider
 * jugs and jars, bushels of apples. This is Fall-GENERAL, not Halloween:
 * NO pumpkins-as-jack-o-lanterns, NO costumes, NO spooky content anywhere.
 *
 * Kept deliberately DISTINCT from FarmBot's existing normal-rotation autumn
 * paths (do not duplicate their hero content):
 *   - harvest-festival — hay bales, corn stalks/maze, scarecrows, pumpkins,
 *     a festival-celebration mood. None of that appears here.
 *   - autumn-village-market — market-stall goods arranged FOR SALE. This
 *     path is a small family farm's own harvest, pressed and enjoyed at
 *     home — never a stall, display, or sale framing.
 *   - orchard-afternoon — rows of fruit trees as the hero. This path's hero
 *     is the PRESS APPARATUS ITSELF; at most one single incidental tree may
 *     appear for shade, never rows of trees as the subject.
 *
 * AXES (4, all bespoke/generated pools — see scripts/gen-seeds/farmbot/
 * gen-fall-cider-pressing-<axis>-pool.js):
 *   1. CIDER_PRESS      (always, FIRST) — the press apparatus, the money
 *                                          shot / hero of the whole scene.
 *   2. HARVEST           (always, SECOND) — apples/baskets/crates/jugs/jars
 *                                          clustered around the press.
 *   3. ATMOSPHERE         (always) — the small farmyard nook + Fall light/
 *                                    leaves/air the press stands in.
 *   4. ACTIVITY   (character-only) — the specific cider-pressing chore
 *                                    moment (crank/load/catch/cork/etc.).
 *
 * "Sometimes no human" rule, bot-wide standard: includeCharacter =
 * Math.random() < 0.6. No-character branch guarantees ambient life via
 * pools.pickPureSceneLife (ambientTags: ['outdoor'] — this is an outdoor
 * path; AMBIENT_LIFE's 'winter'-tagged entries don't carry 'outdoor' so a
 * plain ['outdoor'] filter never pulls them in — no excludeAmbientTags
 * needed for a non-winter-locked Fall path).
 *
 * CHARACTER_ARCHETYPE: proactively filtered via a manual
 * ARCHETYPE_INCOMPATIBLE regex (same pattern as tropical-flower-garden.js's
 * pickGardenCharacter()) — `filterByTags(CHARACTER_ARCHETYPE, ['farm',
 * 'leisure'])` is a near no-op (nearly every entry in the 116-entry pool
 * carries 'ANY' and passes regardless), which would otherwise let a baker's
 * flour-dusted apron, a shopkeeper's ledger/measuring tape, a weaver's
 * shuttle, a potter's kiln-smudged apron, a carpenter's tool belt, a
 * fisher's net, or an innkeeper's mug charm leak into a cider-pressing
 * scene as an occupational-prop mismatch. Excluded those occupations;
 * 63 of 116 archetypes survive (generic farm girl/boy, gardener, shepherd,
 * flower seller, herbalist, settled traveler — plenty for MVP variety).
 *
 * CAMERA_COMPOSITION is manually filtered — this is an OUTDOOR-ONLY,
 * intimate hero-object-focused path (a small farmyard nook, not a wide
 * vista), so drop: farmhouse-window/barn-doorway/village/cottage/hedgerow/
 * rooftop/cozy-interior framings (physical-setting mismatch — the scene
 * never goes indoors or into a village) AND every phrasing of the
 * documented "character tiny/dwarfed within a sweeping/rolling landscape"
 * bug (tiny/dwarfed/sky dominating/sweeping/rolling/nestled small/
 * establishing shot/vast/enormous/expansive) — confirmed via a direct scan
 * of the live 109-entry pool that ~70 entries still carry this language
 * despite the 2026-09-09 source-level fix (that fix only stopped NEW
 * entries, it didn't retroactively clean the existing pool). 39 of 109
 * entries survive (medium framing / close-up / low-angle / foreground-
 * foliage framings) — exactly the intimate, close scope this hero-object
 * path wants.
 *
 * No shared SEASON pool pull (this path IS the season — the bespoke
 * ATMOSPHERE pool hard-codes Fall light/leaves/air directly, avoiding any
 * risk of SEASON rolling something contradictory). No shared
 * WEATHER_ATMOSPHERE pull either, for the same reason — full creative
 * control over the exact cider-pressing-charm atmosphere in one dedicated
 * bespoke pool. No shared ACTIVITY pull — its entries have no cider-
 * pressing-specific content at all; a small bespoke ACTIVITY pool fills
 * that role authentically instead, same fallback pattern as
 * fishing-dock.js's FISHING_DOCK_ACTIVITIES.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, sibling seasonal-path agents are building concurrently). See:
// scripts/gen-seeds/farmbot/gen-fall-cider-pressing-press-pool.js
// scripts/gen-seeds/farmbot/gen-fall-cider-pressing-harvest-pool.js
// scripts/gen-seeds/farmbot/gen-fall-cider-pressing-atmosphere-pool.js
// scripts/gen-seeds/farmbot/gen-fall-cider-pressing-activity-pool.js
const CIDER_PRESS = require('../seeds/farmbot_fall_cider_pressing_press.json');
const HARVEST = require('../seeds/farmbot_fall_cider_pressing_harvest.json');
const ATMOSPHERE = require('../seeds/farmbot_fall_cider_pressing_atmosphere.json');
const ACTIVITY = require('../seeds/farmbot_fall_cider_pressing_activity.json');

// Manual archetype filter — see header note above. Excludes occupation
// archetypes carrying props/tools genuinely incompatible with hand-pressing
// cider on a family farm: bakery/café serving props, a shopkeeper's
// ledger/measuring tape, a weaver's shuttle/loom, a potter's clay-smudged
// apron/kiln, a carpenter's tool belt/saw, a fisher's net/lure/anchor
// charm, an innkeeper's bell/mug charm. Keeps gardener, flower-seller,
// herbalist, generic farm girl/boy, shepherd, and settled-traveler
// archetypes, all of which read naturally at a cider press.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|café|cafe|coffee|dish towel|teacup|tray|shopkeeper|measuring tape|ledger|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|anchor charm|shell pendant|\blure\b|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm|flower seller|pressed blossom)\b/i;
const CIDER_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered CIDER_ARCHETYPES above instead of the raw
// pool — see header note. Uses only pools.js's exported pieces, no pools.js
// edit (same pattern as tropical-flower-garden.js's pickGardenCharacter()).
function pickCiderCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(CIDER_ARCHETYPES, `${axisPrefix}_archetype`);
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

// Manual content filter (CAMERA_COMPOSITION is untagged) — see header note
// above. Drops farmhouse-window/barn-doorway/village/cottage/hedgerow/
// rooftop/cozy-interior framings (setting mismatch for this outdoor-only
// intimate farmyard-nook path) PLUS every phrasing of the documented
// "character tiny/dwarfed within a sweeping/rolling landscape" bug.
const CAMERA_INCOMPATIBLE =
  /\b(farmhouse window|barn doorway|village|cottages?|rooftops?|hedgerows?|cozy interior|cosy interior|tiny|dwarfed|sky dominating|sweeping|rolling|nestled small|establishing shot|vast|enormous|expansive)\b/i;
const CIDER_CAMERA = pools.CAMERA_COMPOSITION.filter((c) => !CAMERA_INCOMPATIBLE.test(c));

module.exports = ({ sharedDNA, picker }) => {
  // Bot-wide standardized "sometimes no human" rule (Kevin 2026-09-09,
  // flat 60/40 character/pure-scene split) — an empty press mid-drip with a
  // basket of apples nearby is just as charming as a figure cranking it.
  const includeCharacter = Math.random() < 0.6;

  const press = picker.pickWithRecency(CIDER_PRESS, 'cider_pressing_press');
  const harvest = picker.pickWithRecency(HARVEST, 'cider_pressing_harvest');

  const character = includeCharacter ? pickCiderCharacter(picker, 'cider_pressing_character') : null;

  // ACTIVITY entries are phrased as human actions with an implied
  // subject — only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(ACTIVITY, 'cider_pressing_activity')
    : null;

  const atmosphere = picker.pickWithRecency(ATMOSPHERE, 'cider_pressing_atmosphere');
  const camera = picker.pickWithRecency(CIDER_CAMERA, 'cider_pressing_camera');

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'cider_pressing_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'cider_pressing',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'cider_pressing_magic')
      : null;

  // ⭐ CROSS-CUTTING maxTokens lesson (FARMBOT_PATH_BUILD_STATE.md): round-1
  // QA on this exact path found the guaranteed pickPureSceneLife() pick
  // (a calf) survive only as a stray look-register eye-clause ("big gentle
  // sparkling cute anime eyes on the drowsy calf") while the rest of
  // Sonnet's output truncated mid-word before the closing reinforcement
  // ever printed — the calf never actually appeared in the rendered image.
  // Fixed the same way papaya-guava-orchard.js and barn-animal-shelter-
  // interior.js fixed the identical bug: (1) moved the ANIMAL/AMBIENT-LIFE
  // block up to right after THE HARVEST (ahead of even THE CHARACTER), (2)
  // strengthened the no-character guarantee to explicit "required, must
  // actually appear" language, and (3) repeat the exact picked content a
  // second time, verbatim, in the closing reinforcement line for the
  // no-character branch instead of only a generic "any animal present"
  // pointer.
  //
  // ⭐ SECOND HARDENING PASS (post-merge review): a sibling agent's OWN path
  // (farmbot-halloween-barn-party) was initially mis-flagged as evidence of
  // a bug in THIS path — confirmed via the render's stored recipe.path that
  // it was a different path entirely, and this path's own 10 QA renders
  // (across 2 rounds, both with-character and no-character) all showed the
  // press correctly present with zero Halloween iconography. Still, the
  // underlying risk class is real and generic (Sonnet can invent a whole
  // unrelated scene and drop the named hero — the same mechanism as the
  // documented "horse keeper" Sonnet-invention lesson), so hardened
  // proactively rather than waiting for it to actually manifest here:
  // (1) 84 of 120 ACTIVITY entries were found to never name the press
  //     apparatus itself (corking/ladling/tasting/carrying-only phrasing) —
  //     the source gen script's meta-prompt now REQUIRES every entry to
  //     literally anchor to press/spout/crank/screw/basket/feed-opening;
  //     the pool was filtered down to the 36 already-compliant entries and
  //     topped back up to 120 with the strengthened prompt.
  // (2) Added an explicit "press must physically appear" reinforcement
  //     directly under the hero block itself (not just the closing line) —
  //     defense in depth, mirroring the animal-presence fix.
  // (3) Replaced the negation-based "never Halloween — no jack-o-lanterns,
  //     no costumes, no spooky content" closing line (a CLAUDE.md violation
  //     — Flux/Sonnet don't process negation reliably, and naming a noun
  //     even to ban it puts that token in the prompt) with a POSITIVE-ONLY
  //     calendar/decor-completeness statement placed early (right after the
  //     hero+harvest block, not buried at the end) — describes exactly what
  //     IS in the scene (an ordinary early/mid-autumn work day, decorated by
  //     nothing but the harvest itself) rather than naming Halloween
  //     iconography to forbid it.
  const heroReinforcement = `The cider press itself — its wooden frame, basket, and spout — must be
clearly, physically visible and unmistakably the centerpiece of the shot,
regardless of which moment or activity is shown; it is never merely implied,
left out of frame, or replaced by a different scene.`;
  const notHalloweenLine = `This is an ordinary early-to-mid-autumn work day
on the farm, weeks before any holiday. The only decoration anywhere in the
frame is what the harvest itself naturally provides — apples, cider jugs and
jars, fallen leaves — the farmyard is otherwise plain and unadorned exactly
as on any normal working day, and everyone present wears simple, ordinary,
everyday clothing suited to the season.`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CIDER PRESS (the hero of the shot — essential, read first) ━━━
${press}
${heroReinforcement}
━━━ THE HARVEST GATHERED AROUND IT ━━━
${harvest}
${notHalloweenLine}
${
  animal
    ? `\n━━━ ${character ? 'ANIMAL COMPANY' : 'LIVING PRESENCE (required — must actually appear in the render, not just background mood)'} ━━━\n${animal}\n`
    : ''
}${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ THE FARMYARD NOOK & FALL ATMOSPHERE ━━━
${atmosphere}
${
  character
    ? 'Bundled comfortably for the crisp Fall day in a cozy knit sweater or a warm scarf, fitting the season naturally.\n'
    : ''
}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried Fall cider-pressing moment on a small family farm
— the cider press, the gathered harvest, and the character rendered with
equal loving richness, never a bare or empty composition. The cider press
is required, must actually and plainly appear in the render exactly as
described above, and stays the clear centerpiece of the frame. Every face
in the frame, human and animal alike, stays clearly separate and fully
legible, each keeping its own open space with a visible gap of air between
it and any other face.`
    : `no human figure anywhere in the frame — this is a warm, unhurried Fall
still-life moment on a small family farm carried entirely by the cider
press, the gathered harvest around it, and whatever wildlife shares the
scene, every detail rendered with equal loving richness, never a bare or
empty composition. The cider press is required, must actually and plainly
appear in the render exactly as described above, and stays the clear
centerpiece of the frame.${animal ? ` The living presence named above (${animal}) is not optional background mood — it must actually, plainly appear in the render, a real naturally distinct creature with open air around it and no invented face or cartoon expression drawn onto anything else in the scene.` : ''}`
} no text, no words, no watermarks, gallery quality`;
};

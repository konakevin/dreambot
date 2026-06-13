/**
 * DragonBot — shared prose blocks.
 *
 * High-fantasy magical worlds. LOTR / GoT / Harry-Potter / Elden-Ring /
 * Witcher / Warhammer-concept-art energy. Landscape is the flagship path.
 * Every render: RICH magical feeling, theatrical lighting, mythic production.
 * Characters by role only.
 */

const PROMPT_PREFIX =
  'epic fantasy concept art, painterly movie-poster illustration, magical atmosphere, theatrical lighting, LOTR-GoT-Harry-Potter production quality, mythic grandeur';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

// gpt-image-2 medium directive (routed via mediumByModel in index.js).
// GPT-Image-2 reads "painterly movie-poster illustration" + "concept art"
// + the dragon-scene path's 5 painter name-drops as "go full abstract
// painterly plate" and drops the dragon / fantasy subject. Positive-only,
// no name-drops, no negation cascade. Mirrors mystical-mermaid b0776fb9.
const GPT_CLEAN =
  'Cinematic epic-fantasy illustration, clean editorial-poster render with clearly readable creatures, figures, castles, and sweeping fantasy landscapes, rich jewel-tone palette with atmospheric depth, mythic high-fantasy register';

const EPIC_FANTASY_BLOCK = `━━━ EPIC FANTASY AESTHETIC (NON-NEGOTIABLE) ━━━

Concept-art movie-still quality — every render could be a chapter-opener painting in an illustrated edition of a great fantasy novel, never cartoon, never cheap-stock-fantasy.`;

const MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK = `━━━ MAGIC IS EVERYWHERE ━━━

Every render has rich magical feeling — theatrical lighting, mystical atmosphere, arcane energy integrated; the ordinary is never drawn, only the mythic.`;

const PAINTERLY_ILLUSTRATION_BLOCK = `━━━ PAINTERLY ILLUSTRATION ONLY ━━━

Painterly illustration with visible brushwork and warm-handmade quality — fantasy-novel-cover or concept-art-book style, never cheap-CGI.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY ━━━

Describe characters by archetype (hooded wizard, elf ranger, dwarf smith, mage mid-ritual) — NEVER named IP characters; use our own mythic archetypes.`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC COMPOSITION ━━━

Framing, lighting, and depth chosen for MOVIE-SHOT quality — every frame could be a still from a great fantasy epic.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — EPIC FANTASY EDITION ━━━

Wall-poster quality — the kind of image a fantasy reader would frame, with dense detail, impossible atmospheric stacking, and masterful composition.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — EPIC FANTASY AMPLIFICATION ━━━

Stack mythic scale + dramatic lighting + multiple atmospheric layers + architectural wonder + magical phenomena + cinematic depth until it looks like the BEST frame in the movie.`;

const ARCANE_MAXIMALISM_BLOCK = `━━━ ARCANE MAXIMALISM (magic-moment path only) ━━━

Magic scenes are LAYERED — 4-5 magical elements stacked per render. Hero artifact / phenomenon + orbiting glyphs + rising light + ritual architecture + atmospheric response (dust suspended, time frozen, light bending, stone breathing). Setting is never neutral — it RESPONDS to the magic. Never simple-object-on-altar. Always a charged moment mid-cast.`;

const WARM_QUIET_MAGIC_BLOCK = `━━━ WARM QUIET MAGIC (cozy-arcane path only) ━━━

Tame peaceful magic. PLACES + ATMOSPHERE + magical wildlife at rest. Inhabited: Hobbiton-hearth / elven-tea-garden / wizard-rainy-library / tavern-in-snow / witch-herb-cottage. Natural: glowing-moss creek / fae-glen / sprite-cave / sleeping-unicorn meadow / fire-moth stump. Magical critters at rest welcome. NEVER dramatic action, NEVER battle — warm + tame + quiet magic.`;

// BLOWN-UP LANDSCAPE mandate — for landscape / lotr-landscape / dragon-lore
// scene-only paths. The point is OVER THE TOP AI-RENDER CRAZY visuals.
// Never settle for "here's a building" or "here's a vista."
const BLOWN_UP_LANDSCAPE_BLOCK = `━━━ BLOWN UP — AI-CRAZY LANDSCAPE (NON-NEGOTIABLE, OVER THE TOP) ━━━

IMPOSSIBLE, JAW-DROPPING, OVER-THE-TOP visuals — never "here's a pic of a castle." Stack 5+ of these so every frame is a stop-and-stare masterpiece:

- IMPOSSIBLE GEOMETRY (≥1): floating islands with waterfalls into the void / cathedral-mountains of spires / a sky-piercing tree taller than mountains
- MULTIPLE LIGHT SOURCES (≥3): god-rays through clouds / impossible-color aurora / multiple moons or suns / bioluminescent glow from below
- LIVING SKY (≥1): spell-storm with lightning-flashing runes / drifting petals-embers-snow across the scene / pillars of light descending
- DENSE FOREGROUND: ferns, flowers, mossy boulders, roots in tactile micro-detail anchoring the frame
- SATURATED IMPOSSIBLE COLOR: multiple saturated colors coexisting (violet sunset + emerald aurora + cyan glowing moss). CRANK EVERYTHING TO 11
- ATMOSPHERIC PARTICLES: drifting pollen, sparks, embers, motes, ash — the air itself is ALIVE`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  GPT_CLEAN,
  EPIC_FANTASY_BLOCK,
  MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK,
  PAINTERLY_ILLUSTRATION_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  ARCANE_MAXIMALISM_BLOCK,
  WARM_QUIET_MAGIC_BLOCK,
  BLOWN_UP_LANDSCAPE_BLOCK,
};

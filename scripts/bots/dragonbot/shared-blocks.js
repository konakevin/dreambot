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

LOTR / Game-of-Thrones / Harry-Potter film-still energy. Concept-art movie quality — think Peter Jackson / John Howe / Alan Lee / Frank Frazetta / Iain McCaig visual DNA. Warhammer-painterly-scale mythic. Never cartoon, never generic-RPG-art, never cheap-stock-fantasy. Every render could be a chapter-opener painting in an illustrated edition of a great fantasy novel.`;

const MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK = `━━━ MAGIC IS EVERYWHERE ━━━

Every render — regardless of path — has rich magical feeling. Theatrical lighting. Mystical atmosphere. Arcane energy integrated. Even landscape-path castles feel charged with presence. Dragons, magic, and wonder are baseline. The ordinary is never drawn; only the mythic.`;

const PAINTERLY_ILLUSTRATION_BLOCK = `━━━ PAINTERLY ILLUSTRATION ONLY ━━━

Canvas / watercolor / illustration / pencil aesthetic ONLY. NEVER photoreal, NEVER 3D-render, NEVER cheap-CGI. Brushwork visible, painterly edges, warm-handmade quality. Fantasy-novel-cover style or concept-art-book style.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY ━━━

Describe characters by archetype: "hooded wizard", "elf ranger in cloak", "dwarf smith at forge", "mage mid-ritual", "young paladin at altar", "crone-witch in herb-cottage". NEVER named IP characters — no "Gandalf", no "Aragorn", no "Harry Potter", no "Geralt", no "Daenerys". Our own mythic archetypes.`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC COMPOSITION ━━━

Framing, lighting, and depth chosen for MOVIE-SHOT quality. Wide establishing vistas, tight character moments, dramatic low-angle hero shots, impossible aerial sweeps. Every frame could be a still from a great fantasy epic.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — EPIC FANTASY EDITION ━━━

Book-cover / concept-art-painting / Peter-Jackson-preproduction × 10. Wall-poster quality. The kind of image a fantasy reader would frame. Dense detail, impossible atmospheric stacking, masterful composition.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — EPIC FANTASY AMPLIFICATION ━━━

Epic-fantasy is the canvas, not the ceiling. Stack: mythic scale + dramatic lighting + multiple atmospheric layers + architectural wonder + magical phenomena + cinematic depth. If it looks like a fantasy poster, dial it up until it looks like the BEST frame in the movie. Peter-Jackson-concept-art-book × 10.`;

const ARCANE_MAXIMALISM_BLOCK = `━━━ ARCANE MAXIMALISM (magic-moment path only) ━━━

Magic scenes are LAYERED — 4-5 magical elements stacked per render. Hero artifact / phenomenon + orbiting glyphs + rising light + ritual architecture + atmospheric response (dust suspended, time frozen, light bending, stone breathing). Setting is never neutral — it RESPONDS to the magic. Never simple-object-on-altar. Always a charged moment mid-cast.`;

const WARM_QUIET_MAGIC_BLOCK = `━━━ WARM QUIET MAGIC (cozy-arcane path only) ━━━

Tame peaceful magic. PLACES + ATMOSPHERE + magical wildlife at rest. Inhabited: Hobbiton-hearth / elven-tea-garden / wizard-rainy-library / tavern-in-snow / witch-herb-cottage. Natural: glowing-moss creek / fae-glen / sprite-cave / sleeping-unicorn meadow / fire-moth stump. Magical critters at rest welcome. NEVER dramatic action, NEVER battle — warm + tame + quiet magic.`;

// BLOWN-UP LANDSCAPE mandate — for landscape / lotr-landscape / dragon-lore
// scene-only paths. The point is OVER THE TOP AI-RENDER CRAZY visuals.
// Never settle for "here's a building" or "here's a vista."
const BLOWN_UP_LANDSCAPE_BLOCK = `━━━ BLOWN UP — AI-CRAZY LANDSCAPE (NON-NEGOTIABLE, OVER THE TOP) ━━━

This is an AI render. The point is IMPOSSIBLE, JAW-DROPPING, OVER-THE-TOP visuals — never "here's a pic of a castle." Stack 5+ of these EPIC LANDSCAPE FEATURES per render so every frame is a stop-and-stare masterpiece:

EPIC SCALE / IMPOSSIBLE GEOMETRY (mandatory ≥1):
- Massive floating islands suspended in the sky, waterfalls cascading off their edges into the void below
- Cathedral-mountains carved into towering spires with thousands of windows lit from within
- A colossal ancient dragon-skeleton mountain with vines and ruins growing through its ribs
- A sky-piercing tree taller than mountains, branches lit from within
- A continent-spanning canyon cracked open to reveal a glowing world below
- A frozen tidal wave the size of a city wall, suspended forever
- An infinite staircase carved into a cliff disappearing into clouds
- A city-scale crystal jutting from the earth, refracting light into rainbow shafts
- Concentric ring-mountains around a central spell-circle valley

MULTIPLE STACKED LIGHT SOURCES (mandatory ≥3 in same frame):
- Massive god-rays piercing through dramatic clouds
- Magical aurora rippling across the sky in impossible colors (violet / emerald / rose-magenta)
- Multiple moons / suns visible at once (twin suns, three moons, eclipsed sun-and-moon)
- Bioluminescent moss / lichen / fungi glowing from below
- Distant city lights or magical fires dotting the horizon
- Crackling magical lightning between distant peaks
- Floating glowing wisps / orbs suspended throughout the air at scale
- Lava-crack-lines glowing through cracked stone

LIVING SKY / MAGICAL WEATHER (mandatory ≥1):
- An aurora-storm with magical lightning in the distance
- Floating petals / leaves / embers / snowflakes drifting across the entire scene
- A spell-storm rotating slowly over the horizon, runes lightning-flashing inside it
- Migrating cloud-leviathans (whales / dragons / serpentine creatures) drifting across the sky
- An eclipsed sun bleeding rays of light around the moon
- Pillars of light descending from the heavens onto the landscape
- Ash from a distant volcano / glowing snow / phosphorescent rain

DENSE FOREGROUND DETAIL (mandatory): every plant, every rock, every dewdrop, every leaf rendered. Ferns / flowers / mossy boulders / gnarled roots / fallen logs in tactile detail anchoring the foreground. The foreground should be ALIVE with specific micro-detail.

SATURATED IMPOSSIBLE COLOR — multiple saturated colors coexisting in the frame at once (violet sunset + emerald aurora + amber lightning + rose-magenta clouds + cyan glowing moss). Heaven-tier saturation — never restrained, never tasteful-quiet. CRANK EVERYTHING TO 11.

ATMOSPHERIC PARTICLES THICK IN THE FRAME: drifting magical pollen, sparks, embers, glowing motes, snow, petals, ash, spell-particles. The air itself should be ALIVE.`;

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

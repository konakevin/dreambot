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

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  EPIC_FANTASY_BLOCK,
  MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK,
  PAINTERLY_ILLUSTRATION_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  ARCANE_MAXIMALISM_BLOCK,
  WARM_QUIET_MAGIC_BLOCK,
};

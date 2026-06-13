/**
 * ChibiBot — shared prose blocks.
 *
 * 2026-05-07: Toy-photography paths (plushie-life, dollhouse-life) moved to
 * ToyBot. ChibiBot is now a single visual register: hyper-cute 3D character
 * render — designer-collectible / Pop-Mart-vinyl-toy CGI quality. Every path
 * uses chibibot_render medium.
 *
 * Pure CUTE + COZY + CUDDLY. Big-eyed glossy character renders, not painted.
 * No humans. Pets/creatures peripheral, going about cozy-life.
 */

// 2026-06-02 cruft-audit micro-strip — dropped `hyper-detailed` (AI-photo
// tell tech-spec); rest of the polish anchors carry the work.
const PROMPT_PREFIX =
  '3D CGI render, designer collectible quality, glossy dewy surfaces with subsurface scattering, frame-worthy magical wallpaper composition';

// 2026-06-02 — dropped tech-spec `hyper detailed`.
const PROMPT_SUFFIX = 'no text, no words, no watermarks, masterpiece quality';

const CUTE_CUDDLY_COZY_BLOCK = `Wholesome cute + cuddly + cozy — AWWW + "I want to hug it". Big eyes, soft shapes; nothing dark or menacing. Light matches the scene naturally (rainy = soft grey, sunset = golden, night = moonlit), never forced bright.`;

const STYLIZED_NOT_PHOTOREAL_BLOCK = `Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register — glossy subsurface-scattering materials, crisp clean form language, dewy highlights; never photoreal, documentary, or flat illustration. Creatures get chibi proportions (oversized head, massive glassy eyes, tiny stubby body); the same glossy CGI register applies to scenery, architecture, and props. Let the MEDIUM tag control the specific render style.`;

const NO_DARK_NO_INTENSE_BLOCK = `No menace, horror, or uncanny-creepy — safe, kind, gentle. Light is honest to the time of day, never forced bright.`;

const NO_PEOPLE_BLOCK = `No humans, faces, or hands — every subject is a creature (real-exaggerated or fantasy-cute). Reimagine any human concept with the creature doing it instead.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `Wall-poster CUTE-beautiful (not GlowBot-dramatic) — balanced, charming, rendered with love.`;

const BLOW_IT_UP_BLOCK = `Stack cuteness appropriate to the subject: glossy dewy surfaces, warm glow, sparkles, layered atmospheric charm, a few adorable micro-details (tiny mushrooms, floating hearts, fairy-lights). When a character is present add massive multi-catchlight eyes + fluffy textures + blush cheeks; when the subject is scenery/village/interior add dense magical detail, glowing windows, and blooming flora. Obsessive detail in service of wholesome delight.`;

// CHIBI_RENDER_MEDIUM — hyper-cute 3D character render, Pop-Mart designer-vinyl
// collectible register. Sharp + glossy + rendered.
// 2026-06-05 cruft-strip down to positive identity anchors only (~270 chars,
// playbook target ≤250). Dropped: duplicate "3D CGI render" overlap with
// PROMPT_PREFIX, tech-spec ("Octane / Redshift quality"), travel-mag
// ("gallery-print poster composition"), the WORLD-diorama language that
// told Flux to render an entire environment/village/multi-character scene
// regardless of path intent, the hard-locked warm-amber+teal+peach palette
// + "volumetric warm god-rays" that overrode every time-of-day axis, and
// the bot-wide "WHEN MULTIPLE CHARACTERS ARE PRESENT (pair/trio) GROUP
// COMPOSITION" mandate that compounded with CHIBI_CHARACTER_COUNT_BLOCK
// + per-path templates to push every render to 3+ creatures.
// Kept: Pop Mart designer-vinyl collectible identity / glossy-dewy
// subsurface-scatter / crisp form language / chibi proportions when a
// creature subject is present. Palette + composition + creature-count
// now owned by the path axes (time-of-day / setting / creature slots).
const CHIBI_RENDER_MEDIUM =
  'Polished 3D CGI designer-collectible vinyl render, Pop Mart designer-toy register, glossy dewy subsurface-scattering materials, ultra-clean crisp form language; creature subjects rendered with chibi proportions — oversized head, massive glassy multi-catchlight eyes, soft stubby body';

// CHIBI_CREATURE_MEDIUM — the EXACT medium text (verbatim from the recipe of
// Kevin's hearted 2026-05-07 reference renders, recovered from the DB since
// it predates the dream_mediums rewrite). This is the pre-drift version that
// produced the ornate, jewel-eyed, single-hero creatures: it says the
// designer-vinyl register is "applied to whatever the scene is" and
// explicitly "When a creature/character IS the subject, render with chibi
// proportions — oversized head, massive glassy reflective multi-catchlight
// eyes" — i.e. it PERMITS a single ornate hero creature, unlike the current
// CHIBI_RENDER_MEDIUM which forces "NOT a single hero figurine / group
// composition". Used ONLY by the creature-world path (mediumStyles override).
// Material + rendering "secret sauce" ONLY (per Kevin's style-layer spec) —
// deliberately NO locked environment / weather / palette / time-of-day, so the
// path's environment + weather + lighting axes drive scene VARIETY (the
// references had varied detailed scenes, not all warm flower gardens).
// CHIBI_CREATURE_MEDIUM — the EXACT medium from the approved cw-clean batch
// ("wow you've actually done it"), recovered verbatim from a posted render's
// frozen prompt. Ornate luxury-collectible creature + lush glowing dreamworld
// environment. This is the locked, approved version — do not re-edit without
// rendering against the references first.
const CHIBI_CREATURE_MEDIUM =
  'ultra-detailed designer-toy aesthetic, a SINGLE luxury collectible-figurine creature, ornate fantasy craftsmanship with intricate embossed surface detailing, delicate gold filigree and gemstone inlays, premium resin-vinyl texture, highly stylized chibi proportions, ENORMOUS glossy liquid-glass eyes with multi-layer translucent irises, reflective wet-eye shader, glowing inner refractions and cinematic catchlights, soft subsurface scattering, ultra-fine micro-engraved skin and feathered fur microtextures, porcelain-resin ornamental finish, whimsical fantasy realism, nestled in a lush richly-layered magical environment — abundant jewel-tone flowers and flora crowding the foreground, a deep atmospheric background receding into dreamy bokeh strung with glowing fairy-lights and floating luminous particles, rich saturated jewel-tone color grading (teal, magenta, gold, violet, rose), volumetric god-rays and dreamy ambient bloom, cinematic depth with creamy layered bokeh, octane / Unreal Engine 5 cinematic render, high-end collectible-toy photography, hyper-detailed stylized realism, the creature in crisp focus inside its glowing lush dreamworld, immersive magical atmosphere, premium pop-designer collectible vibe, masterpiece quality';

// COZY_INDOOR_CLUTTER_BLOCK — borrowed from DragonBot's cozy-arcane "OPULENT
// MAGICAL CLUTTER" forcing function. The "STACK AT LEAST 6 categories" mandate
// is the secret weapon that makes DragonBot cozy-arcane renders feel
// jam-packed-find-new-details. Adapted to cozy-domestic categories.
const COZY_INDOOR_CLUTTER_BLOCK = `Densely lived-in — stack at least 6 categories of cozy-domestic detail across the frame (never sparse): stacked books + reading things, trailing plants in copper pots, rumpled knit textiles, a steaming teapot/mug, food left on surfaces, warm lamps + candles, music/art-in-progress, framed mementos, windowsill clutter, ivy creeping in, worn patina'd furniture. Every surface has stuff on it; light pools across many interesting objects, not bare wood — the viewer keeps finding new details.`;

// COZY_VILLAGE_CLUTTER_BLOCK — same forcing function at village scale.
const COZY_VILLAGE_CLUTTER_BLOCK = `Densely lived-in village — stack at least 6 categories of village-life detail across the frame (never a sparse postcard): weathered stone/timber architecture, warm-glow windows, overflowing flower-boxes + climbing roses, laundry on lines, market crates + swinging shop signs, propped tools/bicycle/wheelbarrow, café evidence, worn cobblestone paths, strung bunting + lanterns, ivy reclaiming walls, a well/bridge/mailbox. Every doorway and window shows evidence of routine — the viewer keeps finding new details.`;

// ─── Pixar-style aliases (verbatim from main, pre-2026-05-07 rewrite) ───
// Used by the chibibot_pixar medium for 50/50 stylistic rotation alongside
// the new chibibot_render medium. chibibot/index.js swaps these in via
// promptPrefixByMedium + a buildBrief post-processor.

const PROMPT_PREFIX_PIXAR =
  'cozy bedroom-poster quality, stylized cute cuddly artwork, adorable, big-eyed, soft shapes';

const STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR = `Soft illustrative render only — never photoreal. Exaggerated proportions (big head, big eyes, soft round limbs), warm painted textures, clean edges, dreamy color grading. Let the MEDIUM tag control the specific art style.`;

const BLOW_IT_UP_BLOCK_PIXAR = `Stack cuteness: big dewy eyes, fluffy texture, blush cheeks, sparkles, warm glow, a few adorable micro-details (tiny mushrooms, floating hearts). Obsessive detail in service of wholesome delight.`;

// 2026-06-02 cruft-audit strip — dropped 3-stack NOT tail (NOT 2005-era
// CGI / NOT plasticky / NOT photoreal) + travel-mag `wallpaper-poster`.
// The "modern Pixar Disney DreamWorks polish / current-decade animation
// movie still" positive anchors carry the modern-feature-film register.
const CHIBI_PIXAR_MEDIUM =
  'modern Pixar Disney DreamWorks 3D animated feature-film polish, current-decade animation movie still quality, soft subsurface scattering on every fluffy texture, volumetric warm god-rays cutting through magical atmosphere, shallow depth of field with creamy painterly bokeh, saturated jewel-tone palette (warm amber + emerald + teal + peach + magenta), lush magical detail in every corner, gallery-print poster composition';

// CHIBI_CHARACTER_COUNT_BLOCK — only injected for chibibot_render renders
// (via the buildBrief dispatcher). Tells Sonnet to vary character count 1–3
// per render so the Pop-Mart-vinyl renders aren't all solo portraits. Pixar
// renders skip this — they already multi-character naturally via the
// original shared blocks.
const CHIBI_CHARACTER_COUNT_BLOCK = `Vary the creature count, don't default to solo: ~50% solo hero, ~30% a pair in a cozy relational moment, ~20% an intimate trio. Multiple creatures are together for a reason — touching, close, or sharing an activity, not a crowd; a companion may be a different species for charm. Pick the count fresh for THIS render. If the seed names no creature at all (pure architecture/landscape), keep it creature-free — don't force-add.`;

// Clean-render medium for gpt-image-2 + nano-banana (routed via
// cleanMediumByModel in index.js) — keeps these models from reading the bot's
// CGI/polish anchors as "go abstract". Light genre tag, positive-only.
const GPT_CLEAN =
  'Clean cute chibi character illustration, crisp render with clearly readable big-eyed rounded characters and cozy scenes, soft pastel palette, warm gentle lighting, designer-collectible register';

// CHIBI_NEUTRAL — the "looks" medium (2026-06-07). Locks ChibiBot's IDENTITY
// (an adorable chibi CREATURE — never a human — at chibi proportions) but DROPS
// the fixed Pop-Mart-vinyl render-style lock. The specific animation style /
// rendering medium / finish / palette is set by the rolled sharedDNA.lookRegister
// tokens that lead the prompt (Pixar / DreamWorks / Disney-CG / Ghibli / storybook
// / etc.). HARD creatures-only + chibi-proportion locks are load-bearing here:
// the film looks (Pixar/Disney/Tangled/Frozen) carry strong human-child/princess
// priors and non-chibi proportion priors, and ChibiBot has a documented
// human-children purge — so this fragment must out-vote those. Used by the
// look-enabled paths (mediumByPath in index.js); creature-world keeps its
// hearted chibibot_creature medium. Mirrors YumBot's YUMBOT_FOOD_NEUTRAL.
// COMPOSITION-NEUTRAL on purpose (2026-06-07 fix): ChibiBot is HYBRID —
// creature-led paths (a creature IS the subject) AND scene-led paths (a
// village / landscape / interior is the hero, with chibi creatures in it). An
// earlier version opened "The subject is a CHIBI CREATURE…", which front-loaded
// creature-as-subject and collapsed the village/landscape paths into a single
// creature close-up. So this fragment locks creatures-only + chibi proportions
// + no-humans but DEFERS the subject/composition to the scene description.
const CHIBI_NEUTRAL =
  'Every figure in frame is an adorable chibi CREATURE — a real animal or a cute fantasy critter — at chibi proportions (oversized round head, big sparkling eyes), NEVER a human or human child. Keep the composition the scene below describes — a hero creature OR a village / landscape / interior populated by chibi creatures. The animation style, rendering medium, finish, and palette are set by the look-register tokens that lead the prompt.';

module.exports = {
  GPT_CLEAN,
  CHIBI_NEUTRAL,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CUTE_CUDDLY_COZY_BLOCK,
  STYLIZED_NOT_PHOTOREAL_BLOCK,
  NO_DARK_NO_INTENSE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  CHIBI_RENDER_MEDIUM,
  CHIBI_CREATURE_MEDIUM,
  COZY_INDOOR_CLUTTER_BLOCK,
  COZY_VILLAGE_CLUTTER_BLOCK,
  // Pixar aliases
  PROMPT_PREFIX_PIXAR,
  STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR,
  BLOW_IT_UP_BLOCK_PIXAR,
  CHIBI_PIXAR_MEDIUM,
  // chibibot_render-only injection
  CHIBI_CHARACTER_COUNT_BLOCK,
};

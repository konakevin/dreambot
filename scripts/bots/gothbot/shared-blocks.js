/**
 * GothBot — shared prose blocks.
 *
 * Hauntingly beautiful dark fantasy. Castlevania / Bloodborne / Dark-Souls /
 * Elden-Ring / Tim-Burton / Crimson-Peak / Berserk / gothic-fairy-tale.
 * Elegant darkness — unsettling but gorgeous. Deep purples + crimsons +
 * midnight blacks + ornate gothic detail + chiaroscuro. Characters by role.
 */

const PROMPT_PREFIX =
  'hauntingly beautiful dark fantasy illustration, Castlevania-Bloodborne-Crimson-Peak aesthetic, elegant gothic darkness, painterly chiaroscuro, ornate gothic detail, darkly romantic atmosphere';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const ELEGANT_DARKNESS_BLOCK = `━━━ ELEGANT DARKNESS — NON-NEGOTIABLE ━━━

Hauntingly BEAUTIFUL. Never ugly, never gory, never cheap-horror. Castlevania-game-art / Bloodborne / Crimson-Peak / Tim-Burton / Berserk production quality. Darkly romantic OR classically gothic. Unsettling + gorgeous. Dread + beauty together. Stack of ornate detail: wrought iron, velvet fabric, stained glass, crimson accents, candle-glow, moonlight, chiaroscuro.`;

const NO_JACK_SKELLINGTON_BLOCK = `━━━ NO JACK SKELLINGTON / NIGHTMARE BEFORE CHRISTMAS ━━━

These phrases are banned at the engine level — but also never render in a way that resembles them. No skeletal ringleader imagery, no Halloween-town aesthetic, no pumpkin-king references. Our gothic is darker + more elegant + more mature.`;

const NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK = `━━━ NO BLOOD, NO GORE, NO CLOWNS ━━━

Never visceral. Never clown-horror. Never splattered-blood horror. Our darkness is ATMOSPHERIC — dread through fog, shadow, chiaroscuro, unsettling composition, gothic architecture. Mist over cemetery. Candle in empty hallway. Bloodstain hinted in stained glass, not splattered. Elegance always wins over shock.`;

const PAINTERLY_ILLUSTRATION_BLOCK = `━━━ PAINTERLY GOTHIC ILLUSTRATION ━━━

Canvas / anime / comics / illustration / pencil aesthetic. Rich ornate painterly detail. Chiaroscuro-driven. Never photoreal, never 3D-render. Concept-art-book polish.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY ━━━

Describe by archetype: "knight in crimson ballroom", "cursed priest at altar", "hooded blood-hunter", "veiled gothic bride", "young vampire-noble", "witch-grandma at apothecary". NEVER named IP characters — no "Dracula", no "Simon Belmont", no "Alucard", no "Lady Dimitrescu", no "Hellsing".`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC GOTHIC COMPOSITION ━━━

Dramatic angle choices. Shadowed foreground, lit mid-ground. Single light-source key lighting. Mist / fog / candle-glow anchors. Concept-art poster quality.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION (character paths) ━━━

When rendering a character: she/he stands ALONE. No second figure, no male-female duo, no catwalk couple-pose. Solo hero framing — like an album-cover or a Castlevania character portrait. Viewer faces the subject directly.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ HAUNTINGLY BEAUTIFUL ━━━

Book-cover / concept-art quality. Wall-poster worthy. Gorgeous in its darkness — the kind of image a gothic-aesthetic fan frames above their altar.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — GOTHIC AMPLIFICATION ━━━

Gothic darkness is the canvas, not the ceiling. Stack: chiaroscuro contrast + ornate architectural detail + mystical atmospheric dread + candle/moon/stained-glass lighting + velvet/iron/lace textures + crimson accents + visible fog/rain/mist. Castlevania production-art × 10. Every frame should be frame-worthy gothic poster art.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  ELEGANT_DARKNESS_BLOCK,
  NO_JACK_SKELLINGTON_BLOCK,
  NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK,
  PAINTERLY_ILLUSTRATION_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
  SOLO_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};

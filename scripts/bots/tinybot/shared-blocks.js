/**
 * TinyBot — shared prose blocks.
 *
 * Clever + cute + "WHOA look at THAT" miniature magic. Tilt-shift / extreme
 * macro / dollhouse-scale obsessive-detail. Every render makes viewer
 * stop + lean in + smile + look twice.
 */

const PROMPT_PREFIX =
  'ultra-detailed miniature diorama photography, tabletop model world, tilt-shift macro lens, extreme shallow depth of field, dollhouse-scale, handcrafted tiny props, miniature set dressing, realistic modelmaking textures, visible tiny imperfections';

const PROMPT_SUFFIX = 'miniature tabletop diorama model, tilt-shift shallow depth of field, macro lens close-up, tiny handcrafted props, visible miniature scale, no text, no words, no watermarks';

const TILT_SHIFT_MINIATURE_BLOCK = `━━━ TILT-SHIFT MINIATURE AESTHETIC (NON-NEGOTIABLE — THIS IS THE MOST IMPORTANT RULE) ━━━

This MUST look like a TABLETOP MODEL / DIORAMA photographed with a MACRO LENS. NOT a real full-scale scene. NEVER a normal photograph of a real place. The viewer must IMMEDIATELY know this is miniature — visible table edge or surface beneath, extreme shallow depth-of-field with foreground and background blur, tiny handcrafted imperfections (brush strokes, glue marks, visible seams, painted surfaces, miniature fabric fibers). Scale anchors required: props must look thumb-sized, furniture matchbox-scale, buildings palm-sized. If it could be mistaken for a real full-scale photo, you have FAILED.`;

const OBSESSIVE_MICRO_DETAIL_BLOCK = `━━━ OBSESSIVE MICRO DETAIL ━━━

Every tiny detail countable. Individual leaves, individual books on shelves, individual pastries in cases. Stare-for-5-minutes quality — viewer finds new tiny things every look. Surface density is the signature — never sparse.`;

const CLEVER_CUTE_WHOA_BLOCK = `━━━ CLEVER + CUTE + WHOA ━━━

Stop + lean in + smile + look twice. The render must produce ALL of: clever composition + cute subject + surprising scale-play + cozy-when-appropriate. Never just pretty-miniatures — always with a moment of "wait, what?" or "OH that's adorable."`;

const NO_HUMANS_BLOCK = `━━━ NO HUMANS (except peripheral distant silhouettes) ━━━

No identifiable humans in frame. Miniature WORLDS are the subject. Tiny creatures (lizards, frogs, beetles, snails, butterflies, pixies, fae, ants) OK in terrarium/macro paths. NEVER human figures as subject.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — MINIATURE EDITION ━━━

Snow-globe-world quality × 10. The kind of image you want to shrink down and live inside. Wall-poster gorgeous. Tilt-shift + macro + obsessive detail + warm palette.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MINIATURE AMPLIFICATION ━━━

Miniature magic is the canvas, not the ceiling. Stack: obsessive micro-detail + tilt-shift-blur-gradient + warm-palette + countable elements + clever juxtaposition + surprising scale + cozy homey quality. If viewer doesn't want to shrink down and live in it, dial up.`;

const TINY_COZY_WARMTH_BLOCK = `━━━ TINY COZY WARMTH (tiny-cozy path only) ━━━

Warm + inviting + homey + lived-in. Dollhouse-scale homes that feel actually inhabited — books mid-read, tea still-warm-on-counter, blanket-wrinkled-on-couch, cat-curled-on-rug. Soft warm amber/honey palette. Viewer wants to shrink down and LIVE there.`;

const CONTAINED_WORLD_SURREAL_BLOCK = `━━━ CONTAINED WORLD SURREAL (contained-worlds path only) ━━━

Loose "container" definition: classic glass terrariums OK, but also teacups, eggshells, books, kettles, lunchboxes, perfume-bottles, music-boxes, croissants, clam-shells. Surreal-tiny juxtapositions welcome (tiny climbers on croissant, picnic on open book, beach on clam-shell). Cute + clever energy. NEVER sci-fi, NEVER dark, NEVER horror.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  TILT_SHIFT_MINIATURE_BLOCK,
  OBSESSIVE_MICRO_DETAIL_BLOCK,
  CLEVER_CUTE_WHOA_BLOCK,
  NO_HUMANS_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  TINY_COZY_WARMTH_BLOCK,
  CONTAINED_WORLD_SURREAL_BLOCK,
};

/**
 * CoquetteBot coquette-portrait path — painterly oil-painting showcase of
 * beautiful women in ornate coquette fashion. Pre-Raphaelite / classical
 * painting energy. Hardcoded canvas/oil medium. Deduped women across
 * hair, skin tone, ethnicity, and garment.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const garment = picker.pickWithRecency(pools.COUTURE_GOWNS, 'portrait_gown');
  const hair = picker.pickWithRecency(pools.PRINCESS_HAIR, 'portrait_hair');
  const woman = picker.pickWithRecency(pools.PORTRAIT_WOMEN, 'portrait_woman');
  const scene = picker.pickWithRecency(pools.COUTURE_SCENES, 'portrait_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a classical portrait painter writing ONE scene description for a PAINTERLY OIL PAINTING of a beautiful young woman in ornate coquette fashion. Pre-Raphaelite, John William Waterhouse, classical romanticism energy. Rich oil-on-canvas textures, visible brushstrokes, luminous skin, fabric that glows. This is a PAINTING, not an illustration — thick paint, gallery-quality, museum-worthy. NOT photorealistic. Every render should make girls say "I WANT that dress" / "she's so pretty" / "wow." Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_MALE_FIGURES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ OIL PAINTING MEDIUM (THIS PATH ONLY — NON-NEGOTIABLE) ━━━

This is a CLASSICAL OIL PAINTING. Rich oil-on-canvas texture, visible impasto brushstrokes on fabric and flowers, luminous glazed skin tones, chiaroscuro lighting on silk and lace. Think Pre-Raphaelite Brotherhood meets coquette — Waterhouse's Lady of Shalott but in a pink ballgown. Every garment painted with obsessive textile detail — you can see the weave of the lace, the sheen of the satin, the crush of the velvet. Gallery-worthy, frame-ready.

━━━ THE WOMAN ━━━
${woman}

━━━ HER HAIR ━━━
${hair}

━━━ THE GARMENT (focal — painted with obsessive detail) ━━━
${garment}

━━━ THE SETTING ━━━
${scene}

━━━ LIGHTING ━━━
Classical portrait lighting — Rembrandt-soft with warm golden undertones filtered through coquette pink. Luminous skin, glowing fabric, soft atmospheric depth. ${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Classical portrait composition — mid-close to three-quarter frame. She is the painting's subject, alone, regal and romantic. The garment is the FOCAL POINT — painted with obsessive detail, every fold and texture rendered. Setting enhances but never competes. She is NOT posing for a camera — she exists in the painting, caught in a quiet moment. Oil painting, visible brushstrokes, canvas texture, gallery quality.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

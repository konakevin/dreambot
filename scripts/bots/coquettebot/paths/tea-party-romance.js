/**
 * CoquetteBot tea-party-romance — tiered trays, vintage china, lace
 * tablecloths, garden settings, strawberries + champagne, macarons on
 * porcelain. Outdoor picnic energy blended in. No people.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TEA_PARTY_SCENES, 'tea_party');
  const accessory = picker.pickWithRecency(pools.CUTE_ACCESSORIES, 'cute_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing a TEA PARTY ROMANCE scene for CoquetteBot — an impossibly romantic tea party or garden picnic. Vintage china, tiered trays of petit fours, lace tablecloth, rose arrangements, strawberries in cream, champagne in crystal. Outdoor garden or sunlit conservatory. No people visible. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO HUMANS ━━━
No figures. Objects set for two — but nobody has arrived yet. The anticipation of a romantic afternoon.

━━━ THE TEA PARTY SCENE ━━━
${scene}

━━━ DETAIL ELEMENT ━━━
${accessory}

━━━ LIGHTING ━━━
${lighting}

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
Tabletop or garden-level frame. Food and china as focal point — tiered trays, teapots, delicate cups. Flowers woven through everything. Lace, linen, porcelain textures. Garden backdrop — wisteria, roses, hedgerows. Dappled sunlight through leaves. The viewer wants to sit down and never leave.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

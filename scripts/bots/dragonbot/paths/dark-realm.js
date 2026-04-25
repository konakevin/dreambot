const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.DARK_REALM_SCENES, 'dark_realm_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-fantasy concept-art painter writing DARK REALM scenes for DragonBot — corrupted wastelands, necromancer kingdoms, fallen empires, cursed lands. Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo energy. Beautiful but MENACING. The land itself feels hostile, wrong, corrupted. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DARK REALM ━━━
${scene}

━━━ LIGHTING (ominous / sickly / volcanic / moonlit) ━━━
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
Wide or mid-wide establishing shots of corrupted landscapes. The land is the villain — twisted trees, poisoned rivers, crumbling dark citadels, ashen skies, cursed architecture. Characters optional and small against the hostile terrain. Beautiful in a terrible way — concept art you'd hang on your wall even though it's menacing. Dark Souls bonfire-glow-in-the-dark energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

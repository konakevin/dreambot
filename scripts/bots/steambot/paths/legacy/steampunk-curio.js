/**
 * SteamBot steampunk-curio path — single fantastical object as the hero.
 *
 * Cabinet-of-curiosity / Sotheby's-catalog-of-impossible-artifacts energy.
 * One ornate steampunk object presented in museum-display framing. NOT
 * clock-dominant, varied across creature/alchemy/jewelry/weapon/plant/etc.
 * Replaces the deleted contraption path.
 */
const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const curio = picker.pickWithRecency(pools.STEAMPUNK_CURIOS, 'steampunk_curio');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a museum-catalog photographer writing CURIO descriptions for SteamBot. ONE single fantastical steampunk object as the hero — Sotheby's-impossible-artifacts framing. The OBJECT is the subject. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

━━━ THE CURIO (this is the object, render with obsessive detail) ━━━
${curio}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
The OBJECT fills 50-70% of the frame, presented as the subject of a museum catalog photograph or auction-house portrait. Display surface (velvet / mahogany / brass cradle / glass bell-jar) anchors it. Background slightly out of focus with rich bokeh — gas-lamp bokeh, faint workshop suggestion, deep velvet curtain, or shelved cabinet of curiosities behind it. The object is lit reverently. Macro-closeup level of detail — every brass rivet, every gear tooth, every gem facet rendered crisp.

━━━ HARD BANS ━━━
- NO human characters in the frame (object is the hero, no figures behind it)
- NO collection of objects — render ONE specific curio
- NO clocks as the primary subject (clocks may appear as a small detail only)
- NO wide environment shot — this is a CLOSEUP of the artifact

━━━ STRUCTURE (write in this order) ━━━
[the object — the exact curio above, leading with its identity], [its key mechanical / decorative detail], [the display surface or container], [lighting on the object — how brass-glow / gaslight / forge-light catches its surface], [atmosphere + background suggestion], [color palette]

Output ONLY the 50-80 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
};

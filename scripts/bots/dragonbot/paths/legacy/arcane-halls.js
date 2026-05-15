const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ARCANE_HALLS, 'arcane_hall');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing ARCANE HALLS scenes for DragonBot — grand, intricate, awe-inspiring magical architecture that exists in the SAME epic high-fantasy world as our dragons and landscapes. Cathedral-scale interiors, vast magical spaces, ancient halls of power. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS ━━━
Pure environment. No people, no creatures. The space tells the story.

━━━ ARCANE OVERLOAD — BUZZING WITH MAGIC (NON-NEGOTIABLE, OVER THE TOP) ━━━
This is an AI-RENDERED FANTASY MASTERPIECE — the point is OVER THE TOP. The hall is HUMMING with active magic, not "magical-themed decor". Stack 6+ of these magical phenomena visible simultaneously in every frame:

- FLOATING RUNES orbiting in slow constellation around pillars / pedestals / suspended overhead
- LARGE SPELL-CIRCLES inscribed in glowing runes on the floor, pulsing
- LEVITATING BOOKS / TOMES drifting through the air, pages turning on their own
- ACTIVE PORTAL — a shimmering archway tear-in-reality with glowing rim, swirling light inside, suggesting another world beyond
- CRACKLING ARC-LIGHTNING dancing between conduit-pillars / between crystals / through suspended energy-globes
- GLOWING CRYSTALS in clusters on pedestals, walls, floors, casting colored light
- ENERGY BEAMS — vertical / horizontal / diagonal beams of pure magic visible through the air
- MULTI-COLORED MAGICAL FLAMES burning in braziers — green / blue / violet / silver / white-fire-of-magic
- CONJURED WEATHER INSIDE THE HALL — drifting starfield ceiling, indoor mist, glowing snow, suspended thunderhead
- ENCHANTED FOUNTAINS pouring liquid light upward instead of down
- ASTRAL ORRERIES with planets and moons orbiting in golden arcs above the floor
- HOLOGRAPHIC MAPS of distant lands floating mid-air
- GLOWING POLLEN / MAGIC DUST / SPARKLES filling every shaft of light, thick as a blizzard
- IMPOSSIBLE GEOMETRY — staircases that bend wrong, archways that lead into stars, infinite mirror-halls
- LIVING ARCANE TATTOOS on the walls themselves moving slowly

MULTIPLE STACKED LIGHT SOURCES (mandatory ≥3): god-rays through stained-glass windows + glowing floor-runes lighting from below + floating spell-orbs casting colored halos + ambient magic-haze + crackling arc-lightning highlights + glowing crystal clusters. The hall should glow from MULTIPLE COMPETING SOURCES at once.

SATURATED IMPOSSIBLE COLOR — violet / azure / emerald / amber / rose-magenta / shimmer-gold all coexisting in the frame. Heaven-tier saturation. Never restrained, never tasteful-quiet. CRANK EVERYTHING TO 11.

━━━ THE COZY ARCANE SPACE ━━━
${setting}

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
These spaces are GRAND and INTRICATE — not small cottages. Think cathedral-scale wizard libraries, dragon treasure vaults with crackling hearths, massive elven observatories carved into cliff faces, ancient alchemist towers with centuries of accumulated detail. Every surface is rich with texture — worn stone, aged wood, glowing runes, stacked books, hanging herbs, dripping candles, magical artifacts. Warm light pools against deep shadow. The space should feel LIVED IN for centuries. Depth and layering — foreground objects, midground architecture, background details receding into warm shadow.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

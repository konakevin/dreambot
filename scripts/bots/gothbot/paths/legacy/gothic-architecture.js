/**
 * GothBot gothic-architecture path — STRUCTURES ARE THE HERO.
 * Pure gothic castle/cathedral/abbey/bridge/crypt/conservatory renders
 * with extreme ornate detail + inner dark-magic light. No humans as
 * primary subject; accent creatures (crow/bat/gargoyle/distant-hooded-figure)
 * allowed only as small atmospheric detail.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const structure = picker.pickWithRecency(pools.GOTHIC_STRUCTURES, 'gothic_structure');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic-architecture concept-art painter writing a STRUCTURE-AS-HERO scene for GothBot. The building is the star. Humans/figures are NOT primary subjects — only tiny accent creatures (crow, bat, gargoyle, distant-hooded-silhouette) allowed at detail scale. Dark-magic light from within the structure illuminates the scene. Output wraps with style prefix + suffix.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) centered on the gothic structure below. Output ONLY the middle scene description.

━━━ THE CORE RULE — STRUCTURE IS THE HERO ━━━
The gothic building DOMINATES the frame (80%+ visual weight). The landscape around it supports, doesn't compete. Ornate architectural detail everywhere — flying buttresses, rose-windows, pointed spires, pinnacles, crockets, tracery, wrought-iron, stone angels, gargoyles, grotesques, bat-motif finials, dragon-head water-spouts, vaulted arches, carved stonework. Hyper-detailed gothic-horror architecture porn.

━━━ INNER DARK-MAGIC LIGHT (MANDATORY) ━━━
The structure is LIT FROM WITHIN — light leaks through windows / rose-windows / cracks / doorways. Source is dark magic / candles / witch-fire / fel-green / sapphire-necromantic / violet-spell / alchemist-gold / amber / blacklight — NEVER sunlight, NEVER exterior illumination as primary.

━━━ ACCENT CREATURES (OPTIONAL, SMALL DETAIL ONLY) ━━━
Tiny atmospheric accents welcome: a crow on a gargoyle ledge, a bat-swarm from a bell-tower, a distant gargoyle silhouette, a hooded silhouette on distant stairs, a wolf in the courtyard, a pale-ghost wisp past a window. NEVER a primary subject — they enhance, don't compete.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE GOTHIC STRUCTURE (hero of the frame) ━━━
${structure}

━━━ LIGHTING (ambient / weather lighting outside the structure) ━━━
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
The structure fills the frame. Camera angles vary widely — low-angle looking up at towering architecture, high-angle looking down on courtyards, eye-level frontal establishing shot, over-the-hill approach, across-the-moat, through-gate perspective. Inner dark-magic light glows through windows/rose-windows/cracks. Ornate gothic detail everywhere. Extreme gothic tilt.

━━━ HARD BANS ━━━
- NO human as primary subject (accent creatures only)
- NO red-red-red monochrome — Nightshade palette
- NO blood-moon dominating sky
- NO pentagrams / satanic iconography
- NO generic "castle silhouette on cliff" — SHOW the architectural detail
- NO interior shots — exterior-dominant architecture only

Output ONLY the 60-90 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ markers, no **bold**, no "render as" suffix.`;
};

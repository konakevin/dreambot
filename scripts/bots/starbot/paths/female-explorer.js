const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.FEMALE_EXPLORERS, 'female_explorer');
  const outfit = picker.pickWithRecency(pools.SCI_FI_FEMALE_OUTFITS, 'sci_fi_female_outfit');
  const action = picker.pickWithRecency(pools.SCI_FI_ACTIONS, 'sci_fi_action');
  const landscape = picker.pickWithRecency(pools.ALIEN_LANDSCAPES, 'alien_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi concept-art painter writing an EXPLORER scene for StarBot — a single stunning character in a jaw-dropping alien environment. Output wraps with style prefix + suffix.

━━━ GENDER LOCK (NON-NEGOTIABLE) ━━━
This character is a BEAUTIFUL WOMAN. Render her as unambiguously feminine — gorgeous face, feminine body, ornate detailed suit/armor.

━━━ CRITICAL — MATCH THE POOLS ━━━
The character, outfit, action, and environment below each define something specific. Render THOSE specific elements faithfully. Do NOT default to:
- the same "sun-scorched vacuum-chapped" skin on every explorer (some are fresh, some are clean, some are alien-adapted)
- teal-and-orange lighting on every scene
- nebula backdrop behind every character (match the ENVIRONMENT pool entry)
- the same three-quarter-angle mid-shot every time — vary the framing

━━━ THE EXPLORER ━━━
${character}

━━━ HER OUTFIT ━━━
${outfit}

━━━ THE ACTION (what she is doing RIGHT NOW) ━━━
${action}

━━━ THE ENVIRONMENT ━━━
${landscape}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ENVIRONMENT GEAR (NON-NEGOTIABLE) ━━━
She is OUTDOORS on an alien world. She MUST have visible environmental protection — helmet with visor, breathing mask, rebreather, sealed EVA hood, or atmospheric filter. No one breathes alien atmosphere unprotected.

━━━ COMPOSITION ━━━
ONE character, no companions. GROUNDED — feet on the ground, no floating. CANDID — caught mid-action, not posing for camera. We see her face and expression — three-quarter angle or side profile. NEVER from behind, NEVER walking directly toward camera. The environment stretches vast behind her. Full-body or wide mid-shot. Depth — foreground detail, midground character, background alien landscape.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

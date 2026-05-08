const pools = require('../pools');
const blocks = require('../shared-blocks');

/**
 * toybox-chaos — the only ToyBot path with NO single-medium lock.
 * Multiple toy types (LEGO + plush + action-figure + Hot-Wheels + Barbie + mech etc.)
 * coexist in one scene at their REAL-WORLD scale on a real-world surface
 * (kid's bedroom floor, coffee table, playmat, garage floor, picnic blanket).
 *
 * The scale anchor is non-negotiable: every toy is its actual physical size,
 * exactly as it would appear if a kid dumped a toybox on the floor.
 */
module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TOYBOX_CHAOS_SCENES, 'toybox_chaos_scene');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a kid's-bedroom-floor war-photographer writing TOYBOX-CHAOS scenes for ToyBot. The toybox just got dumped — LEGO minifigs, action-figures, plush teddies, Hot-Wheels cars, Barbies, GI-Joes, army-men, mech-toys all coexisting in one insane scene on a real-world surface. The chaos IS the story. Mixed-medium toy-universe ensemble. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

━━━ TOYBOX-CHAOS RULES — NON-NEGOTIABLE ━━━
This path mixes multiple toy types in ONE scene. Specifically allowed: LEGO minifigs (visible studs, blocky limbs), 3.75-inch action-figures (joint-articulation), plush teddies / stuffed animals (fabric texture, button eyes), Hot-Wheels die-cast cars (chrome, oversized wheels), Barbie fashion-dolls (11.5-inch, molded hair), green army-men (single-pose, oval-base), mech-toys (chrome, transformation seams), Sylvanian-style flocked-animal figurines.

ABSOLUTE SCALE RULE — every toy is photographed at its ACTUAL real-world size on a real-world surface (kid's bedroom floor, coffee-table, playmat, garage floor, picnic blanket). A 4-inch action-figure stands next to a 1.5-inch Hot-Wheels car next to a 12-inch plush teddy next to a Lego minifig — exactly as they would on a real floor. NEVER scale toys up or down to match each other. The size mismatch IS THE POINT.

ABSOLUTE SETTING RULE — backdrop is a REAL human-world surface, NOT a fantasy world. Carpet, hardwood, blanket, table, rug, garage floor. Real household objects scaled up by toy-eye-view become epic terrain (book-stack mountain, coffee-mug fortress, slipper-bridge, pencil-canyon, sock-pile mountain).

NEVER unify the toys' art style — each toy is rendered in its OWN native medium (LEGO stays LEGO, plush stays plush, mech stays chrome). The visual chaos is the bot's signature.

━━━ THE TOYBOX-CHAOS SCENE ━━━
${scene}

${blocks.worldStagingSection({ renderMode: sharedDNA.renderMode, scenario, staging: sharedDNA.staging })}
━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${blocks.storyCastSection(sharedDNA.renderMode)}



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
Toy-eye-level macro frame on a real-world surface. Multiple toy types of OBVIOUSLY DIFFERENT real-world scales coexisting in the same scene. Mid-action narrative — interaction across toy-tribes (LEGO knight raiding plush picnic, Hot-Wheels cutting through army-men trench, mech defending a tea-party, Barbie leading a charge). Practical bedroom / coffee-table / floor lighting with golden-hour warmth or lamp-glow.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

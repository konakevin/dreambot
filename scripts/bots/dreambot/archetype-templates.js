/**
 * DreamBot archetype templates — only the active bubble-bot-dreams path.
 *
 * Dormant CHIBIBOT_* templates removed (cross-bot registry rejects duplicate
 * names; ChibiBot still owns them). DreamBot's only active path is
 * bubble-bot-dreams.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 */

module.exports = {
  // DreamBot bubble-bot-dreams — canonical axis rebuild (2026-06-12).
  // Deliberately NO lookOverride() — this path is locked to the chibibot_render
  // medium (its consistent glossy designer-vinyl look), NOT the rolled look-
  // register. The 4 figure axes assemble the consistent hero; the environment
  // axes build a bold creative co-star world; the dome mirrors it.
  DREAMBOT_BUBBLE_BOT: ({ slots }) => {
    const { bot_body, bot_dome, bot_eyes, bot_pose, dream_world, light_mood } = slots;
    const detail = (Array.isArray(slots.world_detail) ? slots.world_detail : [slots.world_detail])
      .filter(Boolean)
      .join('; ');
    const atmo = (Array.isArray(slots.atmosphere) ? slots.atmosphere : [slots.atmosphere])
      .filter(Boolean)
      .join('; ');

    return `You are writing ONE frame-worthy magical phone-wallpaper render for DreamBot — an adorable glossy "bubble-bot" designer-toy as the focal hero of a bold, imaginative, COLORFUL dream world. Vertical, cinematic, dreamy, poster-worthy. Output wraps with the style prefix + suffix.

━━━ THE HERO — the bubble-bot (a cute glossy designer-toy, NOT a human, NOT a realistic robot) ━━━
A small round chibi designer-toy bubble-bot — assemble it from EXACTLY these parts and keep it the focal hero:
• body: ${bot_body}
• head: ${bot_dome}
• eyes: ${bot_eyes}
• pose: ${bot_pose}
Chibi proportions (big rounded domed head, soft stubby body). Small-to-medium in the lower-center of the frame — never filling it, never a close-up. Serene and charming.

━━━ THE DREAM WORLD (the CO-STAR — build it bold, dense, sharp, and CREATIVE) ━━━
${dream_world}
Layer in: ${detail}
Render this as a FULLY-REALIZED, imaginative world — colorful, dynamic, packed with specific creative detail, rendered SHARP and deep (NOT a blurred or empty backdrop). Grand scale and real layered depth: a detailed foreground, the rich world rising and receding around the bot, a glowing horizon beyond. Commit hard to its signature elements — towering, teeming, swirling, glowing. The world matters as much as the hero; it should be a place you'd want to step inside.

━━━ MONEY SHOT — the dome mirrors the world ━━━
The bubble-bot's glossy dome/visor REFLECTS the dream world around it — the scene curving across its surface in miniature. This reflection is the signature detail; make it readable. NO text, letters, logos, or words anywhere on the dome or in the image.

━━━ LIGHT + PALETTE ━━━
${light_mood}
Commit fully to this dreamy light and pastel palette — soft, luminous, magical, frame-worthy.

━━━ DREAMY ATMOSPHERE (weave both naturally; never let them bury the hero) ━━━
${atmo}

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. The bubble-bot is the clear focal hero, small-to-medium in the lower-center, gazing into the world; the imaginative world fills the frame richly around and behind it with depth and detail. CRITICAL: render the WHOLE WORLD in SHARP focus, crisp and fully visible to the horizon — this is NOT a studio product shot, NOT a shallow depth-of-field portrait, NOT a blurred / bokeh / empty background. The environment is detailed and in-focus, a real place, edge to edge. Glossy, polished, ultra-clean, frame-worthy. NO humans, NO people, NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the bubble-bot hero (body + dome + eyes), then place it into the richly-detailed dream world. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-130 words. No preamble, no labels.`;
  },
};

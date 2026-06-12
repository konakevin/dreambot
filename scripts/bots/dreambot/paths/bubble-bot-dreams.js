/**
 * ChibiBot bubble-bot-dreams path (2026-06-12).
 *
 * Kevin's reference: glossy iridescent "bubble-bot" designer-toy chibi (a cute
 * cyber-creature with a translucent rainbow bubble-dome head + big reflective
 * eyes) in dreamy, frame-worthy magical-wallpaper scenes — sunset-ocean was the
 * reference vibe, but the scene axis goes WIDE: cosmic, candy-land, cloud
 * kingdom, underwater bubble-city, rainbow road, crystal grotto, etc. All sorts
 * of fun, dreamy, crazy worlds — same character, same glossy iridescent
 * Pop-Mart-vinyl material, same dreamy atmosphere.
 *
 * Non-look path (like creature-world): locked to the chibibot_render medium
 * (the glossy designer-vinyl register) + flux-1.1-pro-ultra, EXCLUDED from the
 * look-rotation so every render stays this consistent bubble-bot dream look.
 *
 * Axes: subject (the bubble-bot) + scene (the dream world) + mood
 * (light/palette) + atmosphere x2 (bubbles / sparkles / reflective-floor stack).
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.BUBBLE_BOT_SUBJECT, 'bubble_bot_subject');
  const scene = picker.pickWithRecency(pools.BUBBLE_BOT_SCENE, 'bubble_bot_scene');
  const mood = picker.pickWithRecency(pools.BUBBLE_BOT_MOOD, 'bubble_bot_mood');
  const atmo1 = picker.pickWithRecency(pools.BUBBLE_BOT_ATMOSPHERE, 'bubble_bot_atmosphere');
  let atmo2 = picker.pickWithRecency(pools.BUBBLE_BOT_ATMOSPHERE, 'bubble_bot_atmosphere');
  if (atmo2 === atmo1) atmo2 = picker.pickWithRecency(pools.BUBBLE_BOT_ATMOSPHERE, 'bubble_bot_atmosphere');

  return `You are writing ONE frame-worthy magical-wallpaper render for ChibiBot — an adorable glossy "bubble-bot" in a dreamy, fantastical world. Phone-wallpaper quality, vertical, cinematic and dreamy. Output wraps with the style prefix + suffix.

━━━ THE HERO — the bubble-bot (a cute glossy designer-toy, NOT a human) ━━━
${subject}

This is a small, adorable DESIGNER-TOY character — glossy pearl vinyl body with subsurface scattering, a signature TRANSLUCENT IRIDESCENT BUBBLE / DOME / VISOR head with rainbow thin-film refraction, and BIG glossy reflective multi-catchlight eyes that mirror the scene. Cute, serene, charming. It is the heart of the image — small-to-medium in frame, never filling it; the dreamy world breathes around it. NEVER a human, NEVER a person, NEVER a realistic robot — a soft, kawaii collectible bubble-bot.

━━━ THE DREAM WORLD (the bot is inside this — render it richly) ━━━
${scene}

A fun, dreamy, fantastical scene rendered with depth and wonder — the kind of magical place you'd want as your wallpaper. Give it real spatial depth (foreground / the bot / a glowing horizon or backdrop fading into soft dreamy distance).

━━━ LIGHT + PALETTE (mood) ━━━
${mood}

Commit fully to this dreamy light and pastel palette — soft, luminous, magical, frame-worthy.

━━━ DREAMY ATMOSPHERE (layer both, woven naturally) ━━━
• ${atmo1}
• ${atmo2}

These iridescent, sparkly, dreamy touches fill the air and make it feel magical — but keep the bubble-bot the clear hero; let the atmosphere frame it, never bury it.

━━━ COMPOSITION ━━━
Vertical phone-wallpaper framing. The bubble-bot sits/stands serenely, small-to-medium in the lower-center, gazing into the dreamy scene. Lots of soft luminous negative space and a glowing dreamy horizon. Glossy, polished, ultra-clean, frame-worthy magical-wallpaper composition. No text, no words, no watermarks, no humans.`;
};

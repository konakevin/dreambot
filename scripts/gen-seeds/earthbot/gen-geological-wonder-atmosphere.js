#!/usr/bin/env node
/**
 * EarthBot geological-wonder — ATMOSPHERE axis.
 *
 * Atmospheric texture that makes the light visible — mist swirling,
 * steam billows, dust beams in sunlight, crystal air, faint haze.
 *
 * R0 = 40.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/geological_wonder_atmosphere.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERE entries for EarthBot geological-wonder. Each entry describes ONE specific atmospheric texture — the medium that makes the light VISIBLE in the scene. Mist, steam, dust beams, crystal air, haze, snow, vapor.

━━━ THE BAR — ATMOSPHERE MAKES THE LIGHT VISIBLE ━━━

Atmosphere is what gives geological photography its DEPTH. Without it, light is invisible. With it, dust beams ignite into shafts, mist swirls through caves, steam billows from geysers, haze layers separate distant ridges. Each entry names ONE atmospheric texture.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one atmospheric description, 14-26 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **AN ATMOSPHERIC TEXTURE** (the medium itself):
   - mist swirling through the chamber
   - steam billowing from below
   - dust beams catching light in volumetric shafts
   - crystal-clear dry air (no haze, sharp edges everywhere)
   - faint atmospheric haze layering distant ridges in soft blue tones
   - icy fog drifting low across the formation
   - swirling sand grains catching low sun
   - rising water vapor coiling slowly upward
   - thin smoke-haze from a distant vent
   - cold breath-fog clouding the air
   - heavy mineral-mist hanging dense low
   - moving wisps of cloud lapping at the formation

2. **HOW IT INTERACTS WITH LIGHT** (most entries include this — what the atmosphere DOES to the light):
   - "catching light in volumetric beams"
   - "illuminated from above where rays penetrate"
   - "glowing where sun touches"
   - "scattering sun into visible shafts"
   - "creating layered depth between foreground and distance"
   - "rim-lit by golden light"

━━━ HARD BANS ━━━

NEVER include:
- Specific subject content (no "cave with mist" / "geyser steam" — subject axis owns the feature)
- Specific lighting words (no "godrays piercing through" — lighting axis owns light)
- Mineral colors (no "amethyst-purple haze" — mineral_color axis)
- Focal anchor elements (no "tree silhouetted in mist" — focal_anchor axis)
- Humans / animals
- Sci-fi / fantasy
- Storm rain / dark gloom (no heavy weather here — that's phenomenon axis)

━━━ EXAMPLES ━━━

✓ "Mist swirling slowly through the chamber, catching light in soft volumetric beams where sun-shafts enter"

✓ "Steam billowing upward in dense rolling columns, illuminated from above where light penetrates the rising vapor"

✓ "Dust beams catching low sun in volumetric shafts, the entire scene laced with visible beams of illuminated dust"

✓ "Crystal-clear dry desert air, no haze, every formation edge tack-sharp out to the horizon"

✓ "Faint atmospheric haze layering distant ridges in soft blue tones, creating depth between foreground and background"

✓ "Icy fog drifting low across the formation, lapping at the base in slow-moving wisps catching cold light"

✓ "Swirling sand grains catching low sun in golden flickers, the air itself glittering across the scene"

✓ "Rising water vapor coiling slowly upward from terraced pools, illuminated where it catches angled light"

✓ "Thin smoke-haze drifting across the scene from a distant vent, scattering sunlight into soft glow"

✓ "Cold breath-fog clouding the air close to the formation, illuminated white where it catches the light"

✓ "Heavy mineral-mist hanging dense and low in the chamber, illuminated where sun-shafts penetrate the wet air"

✓ "Moving wisps of cloud lapping at the upper formation, golden light rim-lighting the cloud edges"

✓ "Snow dust swirling lightly in the air, catching low sun in golden glittering flickers across the scene"

✓ "Crystal air with bright crisp visibility, no haze anywhere, perfect transparency from foreground to distant horizon"

✓ "Drifting mist softly catching low golden light, glowing warm against the cool shadow of the formation"

✗ BAD — names subject: "Mist swirling through a crystal cave" (BANNED — generic only)
✗ BAD — names light: "Mist with godrays piercing through" (BANNED — lighting axis owns light)
✗ BAD — mineral color: "Violet-mist drifting" (BANNED — mineral_color axis)

━━━ DISTRIBUTION ━━━

Mix across entries:
- ~25% mist (swirling / drifting / hanging)
- ~20% steam billowing
- ~20% dust beams in light
- ~15% crystal-clear / no haze
- ~10% faint atmospheric haze in distance
- ~10% snow / ice / fog (cold conditions)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Atmospheric texture + interaction with light. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

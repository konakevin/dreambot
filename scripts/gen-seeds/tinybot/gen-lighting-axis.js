#!/usr/bin/env node
/**
 * LIGHTING axis pool — 30 entries.
 *
 * Replaces the role of tilt_shift_lighting (which biased ALL renders toward
 * warm-amber-honey-glow) with radical palette variety. The TILT-SHIFT
 * identity is locked by the prompt prefix and TILT_SHIFT_MINIATURE_BLOCK
 * — this axis is purely about COLOR/QUALITY of light, not the lens.
 *
 * Each entry: 8-18 words. One specific lighting situation with palette cue.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 30;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/tinybot/seeds/lighting_axis.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 15),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-OVERRIDE descriptions for TinyBot — radical palette variety to break Flux's warm-cozy default.

Each entry: 8-18 words. One specific lighting situation with EXPLICIT PALETTE that bends Flux to a different corner of the color spectrum.

━━━ CATEGORIES (span ALL — NEVER cluster on warm-amber) ━━━
- HARD MIDDAY SUN (high noon, white bleached daylight, short sharp shadows, washed saturation)
- BLUE HOUR (post-sunset deep blue palette, no warm key, all cool tones)
- MOONLIGHT (silver-blue-white nocturnal palette, soft contrast, cool only)
- OVERCAST GREY (flat soft daylight, zero shadow contrast, muted desaturation)
- MONOCHROME NOIR (high-contrast black-and-white, hard single-source shadows)
- NEON PALETTE (electric magenta + cyan, no warm tones, pitch-black negative space)
- SODIUM STREETLAMP (orange-amber sodium-vapor only, deep blue shadows everywhere else)
- BIOLUMINESCENT (cyan-green glow on all surfaces, aquarium feel, no warm fill)
- LIGHTNING-FLASH (instant freeze in stark blue-white, electric cast, sharp edge shadows)
- CANDLELIT ONLY (single warm flicker source, deep velvety dark surrounding)
- AURORA-LIT (green-pink polar aurora colors washing the entire scene)
- SUNSET BLOOD-RED (saturated red-orange dominating, magenta sky, warm hot)
- HIGH-KEY WHITE (everything bathed in soft pure white, dissolving into pale, dreamlike)
- LOW-KEY DARK (mostly black frame with single small bright element, mystery)
- COLD DAWN (pale blue-pink before sunrise, frost-tinted, cool quiet)
- MAGIC-HOUR PURPLE (twilight violet-pink dominant, cool magic mood)
- SPOTLIGHT ON DARK (theatrical single beam, everything else void)
- SUBMERGED (caustic light wobbles through water, blue-green refraction)
- CHIAROSCURO (Caravaggio-style raking light, half-frame in shadow, hard direction)
- SILHOUETTE-BACKLIT (subject black against bright sky, rim-glow only)
- FOGGY MILK-WHITE (everything desaturated to soft grey-white, fog as the light)
- INFRARED-FALSE-COLOR (impossible pink foliage, cyan sky, surreal palette)
- CROSSPROCESSED VINTAGE (yellow-green shadows, magenta highlights, off-color cast)
- EMERGENCY RED (all-red emergency lighting, hard shadows, monochromatic)
- VOLUMETRIC SHAFTS (god-rays cutting through dust, dramatic depth)
- IRIDESCENT HOLOGRAPHIC (rainbow oil-slick sheen, shifting prismatic, unreal)

━━━ FORMAT ━━━
"{LIGHTING TYPE}, {PALETTE CUE — explicit colors}, {SHADOW BEHAVIOR — hard / soft / monochrome / wash}"

Examples:
- "Hard high-noon sun, white-bleached daylight with short sharp black shadows, washed-clean saturation, no warm cast"
- "Cyan-green bioluminescent glow on all surfaces, aquarium-feel cool palette, NO warm counter-light anywhere"
- "Single candle flicker source, deep velvety black surrounding, only one tiny pool of warm yellow visible"
- "Lightning-flash freeze, stark blue-white instant illumination, every shadow razor-sharp, electric tension"
- "Sodium-vapor streetlamps, orange-amber pools on cobblestones, everything between in deep cobalt-blue dark"
- "Cold pre-dawn pale-blue-pink, frost-tinted air, low quiet contrast, no warm tones present"
- "Monochrome noir, hard single-source raking light, half the frame in solid black shadow"

━━━ HARD RULES ━━━
- The point of this pool is VARIETY — NEVER write more than 2 entries with "warm" or "amber" or "honey" or "golden" anywhere.
- Most entries should explicitly say "NO warm" or "cool only" or "monochromatic" to push Flux out of its default.
- NEVER mention tilt-shift, miniature, scale (those are added by the prompt prefix).
- The lighting OVERRIDES the scene's default mood — even a cozy cottage scene should obey "hard midday sun" or "lightning flash" if the axis says so.
- Span ALL 26 categories. Don't cluster.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

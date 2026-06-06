#!/usr/bin/env node
/**
 * BLOOMBOT_DREAMSCAPE_ATMOSPHERIC_HALO — surreal sky/light atmospheric
 * conditions that violate physics. Magritte sun-disk, aurora curtains
 * with no latitude justification, dual light-sources, octagonal aperture
 * in the sky, double-shadows, suspended petal-ceiling, etc.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_dreamscape_atmospheric_halo.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERIC HALO entries for BloomBot's dreamscape path — surreal sky / light / atmospheric conditions that VIOLATE physics or natural rules but read as beautifully painted, dreamlike, not glitchy. Each entry is one descriptive line, 35-55 words, starting with a CAPS NAME, em-dash, then body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC impossible light/atmosphere condition that paints a dreamscape. Think Magritte / Dali / De Chirico / Roger Dean — physics broken cleanly, never chaotically. Single floating sun in a pewter sky. Aurora where none should exist. Two simultaneous suns. Light flowing horizontally. An aperture in the sky pouring light. Frozen petal-ceilings. The condition is the dream's "weather".

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"MAGRITTE EVENING-SUN — a single amber sun-disk suspended motionless at horizon-height in an otherwise featureless pewter sky, casting impossible warm gold across every surface with no atmospheric scattering"
"AURORA-DREAMSCAPE CURTAIN — a slow diagonal curtain of acid-green and deep violet folding across the sky, no latitude could justify it, its cold luminescence painting every surface below"
"DUAL LIGHT-SOURCE CONTRADICTION — a warm copper sun positioned at the zenith and a cold silver moon at the opposite horizon, both fully illuminating simultaneously, every surface receiving two complete light-passes"
"APERTURE-IN-AIR WARM-POUR — a perfect octagonal aperture hovering in the center of a blue-grey sky, warm amber light pouring downward through it as through a celestial lens"
"IMPOSSIBLE DOUBLE-SHADOW — every element in the dreamscape casting two distinct shadows, one rose-gold edged trailing east, one deep-cobalt edged trailing west, no single light-source"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~4 IMPOSSIBLE-SUN (single floating disk, painted-flat sun, dual suns, eclipse-corona always-visible, sun in wrong sky color)
- ~3 IMPOSSIBLE-MOON (giant moon at zenith, moon-and-sun together, blood-moon in daylight, moon-with-rings)
- ~3 AURORA / SKY-RIBBON (low-latitude aurora, indoor aurora, aurora at noon, painted ribbons frozen mid-sky)
- ~3 IMPOSSIBLE-LIGHT-DIRECTION (horizontal light, upward shadows, dual-shadow contradiction, sourceless ambient glow)
- ~3 APERTURE / WINDOW-IN-AIR (octagonal aperture, oculus in cloud, painted picture-frame as light source, doorway hovering in sky)
- ~3 SUSPENDED-MATTER-CEILING (petal-ceiling, leaf-canopy floating with no trees, suspended-water sheet, frozen rainfall mid-air, glass-shard cloud)
- ~3 CONSTELLATION / CELESTIAL-MAP (bloom-constellation in deep sky, geometric star-grid, painted-constellation lines, planet-string across horizon)
- ~3 GRADIENT-IMPOSSIBILITY (color-graded sky horizontal stripes, sky split into halves by hard line, gradient-mirror sky-and-ground)
- ~3 HALO / RING-IN-AIR (sun-pillar painted vertical, ring around the zenith, lunar-corona stack, light-corona around foreground object)
- ~3 WEATHER-IMPOSSIBILITY (rain that falls upward, snow that hangs still, fog with sharp horizontal edge, contained storm-cell hovering)
- ~3 LIGHT-SUBSTANCE (light pooling on ground like water, beam thick enough to touch, light flowing along channels, glowing fog with object-density)
- ~2 OUTERSPACE-IMPOSSIBLE (planet hanging close, ringed planet in zenith, nebula visible through daylight)
- ~3 LUMINOUS-FLORA-SKY (bloom-galaxy spiral, petal-aurora, glowing-spore haze sky, bloom-meteor streak)

━━━ BANS ━━━
- NO sci-fi / cyberpunk / neon / laser / hologram register.
- NO sloppy chaos — every impossibility must be GEOMETRICALLY clean and painterly.
- NO bare "magical light" — name the SPECIFIC impossible condition.
- NO photographer-name drops.
- NO mention of "dreamy" or "ethereal" as a stand-in for the rule-break.

━━━ FORMAT ━━━
Each entry: 35-55 words. Format: "NAME CAPS — body text naming the specific impossibility + where it sits in the frame + how it lights the dreamscape below".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

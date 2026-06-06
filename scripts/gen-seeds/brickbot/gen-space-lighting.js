#!/usr/bin/env node
/**
 * BRICKBOT_SPACE_LIGHTING — space brick MOC lighting (cool/violet-weighted).
 * Audit 2026-06-05: 98 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_space_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's space path — LEGO Space MOC photography. Each entry: ONE sentence, 25-40 words, naming light source + direction + color quality (cool/violet/trans-amber/trans-cyan weighted) + how it touches the brick build.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (binary-star backlight / cockpit instrument trans-amber underlit / deep-space starlight-only / nebula trans-magenta backwash / planet-shine reflective / hangar-fluorescent / EVA-helmet visor / etc.) PLUS direction PLUS color PLUS how it touches the brick ship/figure.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 STELLAR / SUN: binary-star backlight, lone-sun frontlit, supernova flash, stellar wind
- ~5 PLANET-SHINE / REFLECTIVE: planet-shine ambient, gas-giant glow, lava-world bottom-glow
- ~4 COCKPIT-INSTRUMENT: trans-amber underglow on pilot, trans-cyan HUD glow
- ~4 HANGAR / BAY: cool-white floods, sodium-amber pools, fluorescent grid
- ~3 EVA-HELMET / SUIT: visor inner-reflection, helmet-glow ring
- ~3 NEBULA BACKWASH: trans-magenta + trans-cyan diffuse ambient
- ~3 DEEP-SPACE STAR-FIELD: faint blue-black starfield only, barely defined
- ~3 ENGINE-EXHAUST: trans-orange backwash from ship's own engines
- ~3 WEAPON / THRUSTER CHARGE: trans-cyan + trans-purple pre-fire glow
- ~3 LASER / BEAM CROSSING: trans-yellow + trans-green beam slicing
- ~2 BLACK-HOLE ACCRETION: trans-blue + trans-purple disc-glow
- ~2 ALIEN-WORLD HORIZON: alien-color sunrise (trans-cyan or trans-green sun)
- ~2 BIOLUMINESCENT-ALIEN: trans-green organic glow
- ~1 PLASMA-FIELD: trans-pink + trans-cyan static
- ~1 LIGHTSPEED-JUMP: streaks of trans-white + trans-blue
- ~1 ECLIPSE shadow

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"BINARY-STAR BACKLIGHT COOL-AMBER — two distant suns casting overlapping cool-blue and warm-amber from opposite directions, sharp dual-tone shadow splits across hull-plates"
"DEEP-SPACE STARLIGHT-ONLY BLUEBLACK — no proximate source, faint blue-black starfield ambient only, surfaces barely defined, extremely dim cool-blue contour-light"
"COCKPIT INSTRUMENT TRANS-AMBER UNDERLIT — warm-amber instrument-panel glow rising upward from below, dramatic underlit chiaroscuro, deep shadow on upper helmet rim"

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs
- NO photographer name-drops
- NO mood-only ("epic lighting")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

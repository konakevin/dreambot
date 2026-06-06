#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_LIGHTING — pastel/sparkle/sweet lighting for ultra-cute brick
 * dioramas. Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's girly path — pastel-cute / candy-pink / sparkle-twinkle LEGO MOC dioramas (candy castles, boutiques, unicorns, mermaids, ice-cream parlors). Each entry is ONE sentence, 25-40 words, naming light source / direction / color quality + how it falls across the brick.

━━━ THE BAR ━━━
Every entry names a SPECIFIC light source (pastel-glow, sparkle-twinkle, fairy-light strings, vanity-bulb halo, sunrise pink, candy-store window-glow, etc.) PLUS direction PLUS color quality (rose-pink, lavender, peach, mint, butter-yellow) PLUS how it touches the pastel brick (warm peach pools on sand-pink plates, lavender shadows, etc.). EVERY entry must read sweet-whimsical-pastel.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 PASTEL DIFFUSE-GLOW: soft rose / peach / lavender / mint diffuse wash everywhere
- ~4 SPARKLE-TWINKLE: bulb-string fairy-lights, glitter-pinprick, trans-pink starlight points
- ~4 VANITY / BOUTIQUE WINDOW-GLOW: warm bulb-halo around a vanity mirror, boutique window-strip casting yellow into pastel street
- ~3 SUNRISE / PASTEL-DAWN: low pink-amber gilding the candy-castle, peach across mint plates
- ~3 SUNSET / GOLDEN-CANDY: late warm gold-pink raking across the parlor, long sweet shadows
- ~3 MOONLIT / NIGHT-PASTEL: silver-lavender moon over the sleeping candy-village, trans-pink night-glow on roofs
- ~3 SPOTLIGHT / STAGE: spotlight-bulb on a ballet-stage, pink trans-spot on the mini-doll
- ~2 RAINBOW LIGHT-PRISM through trans-elements casting many trans-color reflections
- ~2 STAR-LIGHT / CONSTELLATION strings — tiny trans-yellow + trans-cyan point-lights overhead
- ~2 UNDERWATER / MERMAID trans-cyan caustic-pink: dappled trans-aqua + trans-pink light through plate-water
- ~1 ICE-CREAM PARLOR fluorescent neon-pink + mint
- ~1 BAKERY KITCHEN: warm oven-glow + dust of trans-yellow flour-light particles
- ~1 SLUMBER-PARTY FAIRY-LIGHT cluster: warm low globe-string across a tabletop scene

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Soft pastel-glow, a wide diffuse rose-tinted wash from above bathing every brick-face and stud-top in a gentle dreamy pink, the sweetest storybook fill."
"Sparkle-twinkle, tiny warm bulb-point strings draped low casting golden pinprick glows across trans-pink and trans-lavender elements, a magical twinkling ambient."
"Vanity bulb-halo, a warm peach-yellow glow ringing the mini-doll's mirror, soft directional fill from the side, deeper pink shadow falling onto sand-cream cabinet plates."

━━━ BANS ━━━
- NO masculine vocab
- NO photoreal vocab
- NO harsh / military / grim language ("harsh", "grim", "dark")
- NO photographer name-drops
- NO mood-only ("cinematic") — name source + direction + color

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

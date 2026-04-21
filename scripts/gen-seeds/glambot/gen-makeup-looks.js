#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/makeup_looks.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MAKEUP LOOK descriptions for GlamBot's makeup-closeup path — specific editorial makeup treatments. MAKEUP IS THE ART. Viral TikTok + high-fashion editorial.

Each entry: 10-20 words. One specific makeup look with detail.

━━━ CATEGORIES ━━━
- Graphic liner (sharp geometric liner, double-wing, floating crease)
- Crystal gems (scattered crystals on cheek/brow/temple)
- Holographic highlights (iridescent cheekbone-high-shine)
- Editorial color-block (two-tone eyelid, primary-color lip)
- Viral TikTok looks (cherry-lip gradient, blush-over-eyelid)
- Glitter-drenched (entire lid in gold/silver glitter)
- Metallic lid (chrome liquid-metal lid)
- Negative-space liner (white gaps in black liner)
- Underline-liner (liner below eye, bright color)
- Freckle-heavy (painted freckles)
- Gloss-overload (lips + eyelid + cheek all glossy)
- Ombre-lip (light to dark gradient)
- Matte-nude skin (editorial clean base)
- Rainbow liner (gradient across lid)
- Rhinestone-brow (gems along brow bone)
- Pearl-tear-drop (pearls under eye)
- Foil-metallic (gold foil applied to eyelid)
- Halo-eye (concentrated shadow with highlight center)
- Cut-crease (sharp cut between lid + crease)
- Tribal-graphic painted across face
- Ombre-blush (cheek to nose gradient)
- Neon-eye (fluorescent pigment lid)
- Smokey-black (classic smokey max)
- Glass-skin finish (ultra-dewy glow)
- Sunburn-blush (placed high and pink)
- Vampire-lip (dark blood-red matte)
- Electric-blue liner
- Purple-smoke eye
- White-lash full-face (white mascara)
- Bronze-warm monochromatic
- 60s-graphic (Twiggy-style bottom-lash liner)
- Cleopatra-black (heavy kohl + gold)
- Geisha-white (white base + red lip)
- Body-gem scatter (gems on collarbone + face)
- Mirror-gloss (reflective metallic cheekbone)
- Mohawk-eyebrow (brushed-up graphic brow)
- Painted-lip-shape (lips painted as different shape)
- Rainbow lashes (multi-color mascara)
- Sequin-covered lid (tiny sequins glued)
- Wet-look eye (glossy watery lid)
- Tear-line-liner (liner along wet tear-duct)
- Multi-toned freckle art
- Chromatic-lip (multi-color gradient)
- Artistic scrawl (lipstick lines drawn on face)

━━━ RULES ━━━
- Editorial / high-fashion / viral aesthetic
- Makeup IS the art — elaborate + detailed
- Named specific looks

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

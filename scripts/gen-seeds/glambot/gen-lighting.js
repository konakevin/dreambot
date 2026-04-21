#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for GlamBot — high-fashion editorial lighting treatments.

Each entry: 10-20 words. One specific editorial lighting treatment.

━━━ CATEGORIES ━━━
- Hard-strobe (sharp flash, high-contrast shadows)
- Butterfly-beauty (key-light directly above, soft-shadow under nose)
- Rembrandt lighting (triangle light under eye on shadow-side)
- Backlit silhouette (figure against bright background)
- Rim-light (hair + edge glow from behind)
- Jewel-gel lighting (colored-gels casting jewel-tone)
- Split lighting (half face lit, half shadow)
- Clamshell beauty (soft fill + key for glowing skin)
- Neon-sign-reflected (neon-glow bouncing off face)
- Street-lamp warm single-source
- Rain-backlit dramatic
- Studio-strobe-gun visible in frame
- Backlit-smoke drama
- Low-key-single-source (one harsh key only)
- High-key-everything-bright (no shadow)
- Colored-gel RGB mixed (multi-colored)
- Silver-umbrella soft-overhead
- Beauty-dish diffused
- Ring-light halo catchlight
- Natural-window directional
- Golden-hour backlit-hair rim
- Blue-hour twilight cool
- Sodium-vapor street warm-orange
- Mercury-vapor cool industrial
- Disco-ball scatter-spots
- Projector-pattern on face (gobo)
- Mirror-reflected bounce
- Hair-light only (face in shadow)
- Undercast light from below (horror-glam)
- Dramatic-side harsh
- Editorial-flat overall
- Contour-shadow sculpted
- Top-light-harsh deep-shadows
- Floating-paper-lanterns warm
- Stage-spotlight single
- Neon-red-and-blue mixed
- Cop-car-flash red-blue alternating
- Sunburst-through-blinds stripes
- Fire-light warm from below
- Lava-glow underlight
- Flashlight-held close-proximity
- Theatrical proscenium-arch
- Photo-booth fluorescent
- Candle-single-source intimate

━━━ RULES ━━━
- Fashion / editorial / beauty-shoot lighting
- Named specific techniques

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

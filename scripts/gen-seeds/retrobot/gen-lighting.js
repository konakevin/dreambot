#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/lighting.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for RetroBot — the specific quality of light from 1975-1995 scenes. These get layered into scene descriptions to set the lighting mood.

Each entry: 8-16 words. One specific lighting condition or quality.

━━━ CATEGORIES ━━━
- Golden hour (late afternoon amber through venetian blinds, warm stripe patterns)
- CRT glow (TV-blue in dark room, green terminal phosphor, warm cathode flicker)
- Incandescent warmth (table lamp with shade, bare bulb in closet, warm yellow)
- Neon signs (buzzing motel vacancy, arcade entrance glow, diner open sign)
- Fluorescent hum (mall hallway, school corridor, convenience store flat white)
- Christmas lights (big bulb multicolor, icicle lights on eaves, tree glow)
- Lava lamp glow (orange-red ambient, slow wax shadows on wall)
- Porch light at night (yellow bug bulb, moths circling, warm cone on steps)
- Sunrise through curtains (pale gold on bedroom carpet, dust motes lit up)
- Sunset through windshield (highway orange, dashboard silhouette, visor shadow)
- Campfire / firepit (orange flicker, long shadows, ember glow)
- Streetlight sodium (orange-yellow pools on wet pavement, buzzing hum)
- Movie projector beam (dust particles in light cone, flickering frame edges)
- Flashlight under blanket (warm circle on fabric ceiling, batteries dimming)
- Storm light (grey-green pre-tornado sky, rain on window prism, lightning flash)
- Arcade blacklight (purple UV glow, neon carpet patterns, glowing whites)

━━━ RULES ━━━
- Purely descriptive — light quality and color only
- Must feel analog — no LED, no modern light sources
- Lighting should match naturally to its scene context

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

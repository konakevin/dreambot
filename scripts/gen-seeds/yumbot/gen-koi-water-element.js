#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_water_element.json',
  total: 50,
  batch: 18,
  metaPrompt: (n) => `Write ${n} FEATURED WATER ELEMENT descriptions for a kawaii Japanese koi-pond scene. Each entry is ONE specific wow-detail centered in/on the pond water.

Each entry: 12-22 words. ONE specific water element.

DO write:
- A giant glowing pink lotus-blossom in full bloom floating at the center
- A cluster of floating paper-lotus-lanterns glowing warmly on the water
- A magnificent crystal-clear lotus-flower with glowing pearl center
- A floating wooden paper-crane glowing softly amid lily-pads
- A tiered floating-lantern cluster in glass-globe form
- A magical lotus-pearl in the cup of a giant open lotus-bloom
- A small glowing-coral-pillar rising from the pond water
- A magical-lily-pad with a glowing crystal centerpiece
- A floating wooden boat with paper-lanterns lit on board
- A glowing-koi-fountain spouting water back into the pond
- A floating-paper-lantern shaped like a giant smiling-koi
- A magical glowing pearl-cluster floating on the water
- A miniature floating shrine on the pond with paper-lanterns
- A giant pink lotus-bloom with golden-glow at its heart
- A floating glass-orb with a tiny pagoda-figurine inside
- A magical rainbow-koi-glow pulsing softly under the water
- A wooden floating-table with tea-set and warm lantern
- A blooming lotus-cascade with petals drifting open mid-bloom
- A floating pearl-and-crystal-cluster sparkling on the water
- A magical translucent-lily-pad with bioluminescent veins glowing

DO NOT write:
- Foreground creatures (separate axis)
- Backdrop / surrounding Japanese garden (separate axis)
- Modern objects

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

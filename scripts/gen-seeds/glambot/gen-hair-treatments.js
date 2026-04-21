#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/hair_treatments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} HAIR TREATMENT descriptions for GlamBot's hair-moment path — bold editorial hair styles. Hair IS the art. Architectural / liquid / braided-crown / color-block.

Each entry: 10-20 words. One specific bold hair treatment.

━━━ CATEGORIES ━━━
- Architectural updo (sculptural geometric twist)
- Rainbow-gradient braids (pink-to-blue waist-length braids)
- Liquid-hair sculpture (impossibly-smooth flowing form)
- Impossible volume (massive-sphere afro)
- Color-blocked structural bob (half-pink half-black sharp line)
- Spiral-cone updo (rising tower)
- Mermaid-wave waist-length (deep-wave crimped)
- Baby-braid crown (multi-tiny-braids across head)
- Half-shaved punk side + long on top
- Wet-look slicked-back sculptural
- Multi-colored balayage waves
- Bubble-ponytail (sectioned with bands)
- French-twist with huge diamond pin
- Bantu-knot crown (multiple small knots)
- Micro-braids floor-length
- Box-braids cascading with beads
- Locs wrapped in gold-threads
- Pixie-cut dyed platinum
- Blunt-fringe bob lacquered
- Swept-back geometric wave
- Candy-floss-pink massive afro
- Silver-shimmer long waves
- Emerald-green lacquered bob
- Pearl-adorned updo
- Crystal-woven braids
- Smoke-effect hair (blurred edges)
- Feathered-tiered mullet editorial
- Neon-green buzzed-side long-on-top
- Two-braid pig-tails ultra-long
- Top-knot with pencil-stuck through
- Beehive massive with jewels
- Water-fall braids multiple
- Headdress-integrated braids
- Peacock-tail hair cascading colors
- Pompadour massive
- Low-bun sleek with crystal pin
- Chignon with feathers
- Halo-braid crown
- Side-swept asymmetric long
- Wet-beach-texture tousled natural
- Straight-down-to-floor sleek
- 70s-flick-out shag
- 80s-crimped volume
- Ice-queen silver-white blown-back
- Corkscrew curls massive
- Finger-wave Art-Deco
- Smooth-sleek low-pony
- Half-up-half-down crown-braid
- Rockabilly pompadour + pin-curls

━━━ RULES ━━━
- Hair IS the art
- Bold / editorial / architectural / sculptural
- Fashion-editorial aesthetic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

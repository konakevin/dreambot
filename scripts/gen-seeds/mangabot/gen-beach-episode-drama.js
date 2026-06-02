#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BEACH-EPISODE DRAMA entries — 40%-gated bright vacation events around her. Subtle visible focal point.

Each 12-20 words. Drama + summer-bright aesthetic + frame placement.

VARIETY:
- 22% PASSING-SEA-BIRD (single seagull diving past at midground / pelican gliding across frame / tern hovering above wave / albatross cresting overhead)
- 18% ROLLING-WAVE-CURL (cresting-wave curling at midground spray / barrel-wave rising / shore-break collapsing with foam / glassy-wave peeling)
- 14% DISTANT-FIREWORKS (single firework bursting at deep distance over bay / pink hanabi-burst above water / sparkler-trail in deep distance)
- 10% SUDDEN-RAINSHOWER (light rain-shower at midground over water / passing-rain-curtain at distance / brief sun-shower with rainbow / drizzle on calm water)
- 8% CRAB-EMERGENCE (tiny crab emerging from sand-hole at her feet / ghost-crab scuttling sideways into frame / hermit-crab popping head out)
- 8% LANTERN-RELEASE (paper-lantern lifting at deep distance over bay / lantern-string lighting up overhead at midground / floating-lantern on water releasing)
- 6% RAINBOW (rainbow-arc forming overhead after sun-shower / spray-rainbow at midground / pastel-arc at deep distance over bay)
- 4% SHOOTING-STAR/METEOR (single shooting-star streak at deep distance dusk / meteor-trail above ocean / faint comet at distance)
- 4% SUDDEN-SCHOOL-OF-FISH (silver fish-school flashing past in shallow water at midground / small school surfacing / minnows scattering)
- 4% UNEXPECTED-SUN-BURST (sun breaking through cloud-bank with rays touching water / sudden gold-spray at midground / lens-flare sun-burst)
- 2% LITTLE-KID-CHASE (tiny child chasing seagull at deep distance / small group of kids mid-jump-laugh at midground)

DO write:
- Single seagull diving past at midground catching sun-glare, wings spread bright-white
- Cresting wave curling at midground with spray-arc, sun-light backlighting foam
- Single pink hanabi-firework bursting at deep distance over bay, water reflecting
- Light rain-shower at midground over water with rainbow forming at edge
- Tiny crab emerging from sand-hole at her feet, claw-up curious
- Paper-lantern lifting at deep distance over bay, single warm-amber glow
- Rainbow-arc forming overhead after sun-shower, colors saturated bright
- Single shooting-star streak at deep distance dusk-sky, faint silver trail
- Silver fish-school flashing past in shallow water at midground, scales glinting
- Sun breaking through cloud-bank with gold-rays touching wave-tops at midground
- Tiny child chasing seagull at deep distance, both mid-arc joy

DO NOT: drama positioning her back-to-camera. Drama she's facing-away-to-admire. Combat / storm / shark-fin / capsizing / drowning / dangerous. Cheesecake-implied. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

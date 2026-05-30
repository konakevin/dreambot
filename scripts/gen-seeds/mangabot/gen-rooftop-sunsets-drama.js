#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_drama.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ROOFTOP-SUNSETS DRAMA entries — 40%-gated subtle events at rooftop, NEVER positioning character back-to-camera.

Each 12-20 words. Event + sunset aesthetic + frame placement.

VARIETY:
- 22% SUNSET-PHENOMENON (sunset cracking through clouds with golden-pink rays / orange-pumpkin sky deepening / sun-disc visible above buildings)
- 14% URBAN-NEON-EMERGENCE (first neon-signs turning on / billboards lighting up / streetlamp-cascade)
- 12% BIRDS/JETS (flock of birds gliding past midground / passing-jet contrail / hot-air-balloon overhead)
- 10% RAIN-START (first-raindrops on rooftop-concrete / sudden-mist rolling in / sprinkle starting)
- 10% PETAL-CASCADE (cherry-petals lifting from below / autumn-leaves cyclone / blowing-confetti at midground)
- 8% LIGHTNING-DISTANT (distant lightning-strike at horizon / heat-lightning behind buildings / storm-clouds approaching)
- 8% SOUND-MOMENT (school-bell ringing / festival-firework bursting / temple-bell tolling)
- 6% FIREFLY/MOTH (fireflies emerging at twilight / moth circling lantern / dragonfly hovering)
- 6% FROM-AFAR (figure waving from another rooftop / kid playing in alley below / friend calling from below)
- 4% TRANSFORMATION-LIGHT (golden-to-blue hour shift catching her / first-stars appearing / aurora-impossibility)

DO write:
- Sunset cracking through clouds with golden-pink rays striking her shoulders, peach-glow on cheek
- First neon-signs turning on in distant buildings behind her, blue-pink glow pulsing softly
- Flock of birds gliding past midground silhouettes against orange sky
- First-raindrops on rooftop-concrete beside her with darker patches blooming
- Distant lightning-strike at horizon flashing white through clouds

DO NOT: drama positioning her back-to-camera. Drama she's FACING AWAY to admire. Combat. Photoreal.

Drama enhances rooftop atmosphere. She's INSIDE it engaged, NOT staring out at it.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

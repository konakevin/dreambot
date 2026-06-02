#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROMANCE-SETTING entries — tender places where character is engaged. Cherry-blossom-rich contexts.

Each 14-22 words. Setting + tactile foreground + midground + engagement-context.

VARIETY:
- 18% SAKURA-PARK (cherry-blossom park with bench + petals close / hanami picnic-blanket area / sakura-tunnel path / cherry-tree grove)
- 14% SCHOOL-CAMPUS-SPRING (school courtyard with sakura / class-rooftop with petals drifting / library-window with cherry-branch / hallway with cherry through window)
- 12% SHRINE-PATH (shrine path with sakura overhead / shrine-stairs with petals fallen / shrine-bench with cherry-shade)
- 10% RAINY-ROMANTIC (rainy umbrella-shelter with sakura / cafe-window with rain + sakura / bus-stop with petals + rain)
- 10% RIVER/CANAL (canal-side path with sakura overhead / river-bridge with petal-cascade / boat-dock with cherry-trees)
- 8% TEAHOUSE/CAFE (sakura-themed cafe interior with petal-prints / window-seat at cafe with cherry view / matcha-house with petal-art)
- 8% LETTER-DESK (desk-by-window with sakura branch in vase / writing-station with sakura through window / dorm-room with cherry-tree outside)
- 6% TRAIN/STATION (train-platform with sakura on tracks / station with cherry-trees / train-window with sakura blurred past)
- 6% PERFORMER-VENUE (concert-hall with sakura through window / practice-room with cherry-branch / outdoor-stage with sakura backdrop)
- 4% BRIDGE (small bridge under cherry-canopy / arched bridge over canal with sakura / footbridge with petals fallen)
- 4% ROOFTOP-SPRING (small rooftop with sakura in pot / school-rooftop with cherry visible / apartment-balcony with cherry-tree)

DO write:
- Sakura-park bench with petal-cluster close foreground, blossom-tunnel midground, lantern-lit path beyond — she sits ON bench mid-write
- School courtyard at golden-hour with cherry-petals drifting close, classroom-windows midground, school-clock beyond — he stands AT base of tree mid-offer-flower
- Shrine path with petal-strewn stone-stairs close, torii-gate midground, sacred-grove beyond — she crouches ON step mid-catch-petal
- Rainy umbrella-shelter at park with petal-pool puddle close, sakura midground, drenched path beyond — they sit ON bench mid-tender-moment
- Canal-side path with cherry-overhang close, mirror-water midground, distant bridge beyond — she walks UNDER blossoms mid-stride toward camera

DO NOT: "standing at edge looking out at distant cherry-grove" — back-to-camera trap. Photoreal cinematography.

Every setting affords ENGAGED-WITH-tender-moment.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

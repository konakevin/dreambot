#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROOFTOP-SETTING entries — rooftop contexts where character is ENGAGED with foreground/midground, NOT staring at city-vista.

Each 14-22 words. Setting + tactile foreground rooftop-prop + midground depth + character ENGAGED.

VARIETY:
- 18% SCHOOL-ROOFTOP (school-rooftop with chain-link fence + lunch-spread / club-rooftop with bag + notebooks)
- 16% APARTMENT-ROOFTOP (apartment-roof with laundry-line + plants / small-apartment roof with chair + table)
- 12% RESTAURANT-ROOF (rooftop-grill with skewers / sushi-rooftop with cutting-board / izakaya-roof with sake-spread)
- 10% OFFICE-ROOFTOP (office-roof with bench + coffee / corporate-roof with smoke-area / break-area with vending-machine)
- 10% LOVE-HOTEL-ROOF (rooftop-bar with drinks / neon-lit rooftop-cafe / cozy rooftop-club)
- 8% ABANDONED-ROOFTOP (overgrown rooftop with plants growing / abandoned-water-tank rooftop / cracked-tile roof with weeds)
- 6% ROOFTOP-GARDEN (rooftop-garden with herbs + planters / vegetable-roof with tomatoes / flower-roof with blooms)
- 6% MUSIC-PRACTICE (rooftop with amp + guitar / rooftop with piano / band-practice rooftop with mics)
- 6% PHOTO-STUDIO-ROOF (rooftop with tripod + lights / photo-setup with reflectors / camera-rooftop with gear)
- 4% HOSPITAL-ROOFTOP (hospital-roof with helicopter-pad / clinic-roof with bench / medical-roof with break-chairs)
- 4% TEMPLE-ROOFTOP (shrine-rooftop with bell / temple-roof with prayer-banners / tower-roof with view-platform)

DO write:
- School-rooftop with chain-link fence and lunch-spread close foreground, water-tank midground, city in deep distance — she sits ON rooftop mid-bite
- Apartment-roof with laundry-line + flapping sheets close foreground, plant-pots midground, neighborhood beyond — she stands AT line mid-pin-laundry
- Restaurant rooftop-grill with skewers + tongs close foreground, smoke from grill midground, alley below — he stands AT grill mid-flip
- Office-roof with bench + coffee close foreground, AC-units midground, skyline-blur beyond — she sits ON bench mid-read
- Music-rehearsal rooftop with amp + guitar close foreground, microphone-stand midground, city-blur beyond — he stands AT amp mid-strum

DO NOT: "standing at edge of rooftop looking out over city" — explicit back-to-camera trap. "Gazing at sunset horizon." Photoreal.

City is BACKDROP. Character ENGAGED at rooftop with prop AT HAND.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

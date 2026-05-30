#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_setting.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC SETTING entries — overgrown / decayed / nature-reclaimed civilization locations where wanderer is ENGAGED with foreground prop, NOT silhouette-staring-at-vista.

Each 14-22 words. Setting + tactile foreground ruin-prop + midground depth + character ENGAGED at foreground.

VARIETY (genre-faithful):
- 14% OVERGROWN-SUBWAY (vine-cracked subway-platform with rusted-rails / moss-flooded tunnel with track-bed / fungus-bloomed concourse)
- 12% VINE-CRACKED-HIGHWAY (root-ruptured asphalt with abandoned-car / kudzu-swallowed overpass / weed-split expressway)
- 10% MOSSY-CONVENIENCE-STORE (vine-covered konbini with skewed-sign / moss-shelved 7-eleven-ruin / fern-grown vending-machine cluster)
- 10% SHATTERED-SHOPPING-ARCADE (collapsed shōtengai with banner-tatters / glass-strewn arcade with vines / mossy-pachinko ruin)
- 10% DROWNED-TOKYO (Yokohama-Kaidashi flood — lapping tide on submerged shrine / drowned-traffic-light just above waterline / flooded ginza intersection)
- 8% ABANDONED-BULLET-TRAIN-STATION (Trigun-coded — sand-buried shinkansen platform / dune-engulfed train-station / rusted-rail in desert-wasteland)
- 8% COLLAPSED-OBSERVATORY (Girls-Last-Tour-coded — tilted radio-dish with kid sheltering beneath / cracked-dome telescope ruin / wind-whistling antenna-array)
- 8% DESERT-GARAGE (Trigun-desert mechanic's-shed with skeleton-engine / sun-bleached gas-station with rusted-pump / sandblasted highway-diner ruin)
- 6% ANCIENT-MECH-BONES (Made-in-Abyss / Nausicaä-coded — moss-covered giant-robot torso / collapsed mecha-leg overgrown / rusted ohmu-shell)
- 6% FROZEN-OVERGROWN-CITY-GRID (Girls-Last-Tour winter — snow-dusted concrete grid / ice-glazed apartment-block / frozen-canal between ruins)
- 4% SUNKEN-RUIN (Made-in-Abyss vertical-pit — moss-stair descending into chasm / vine-rope bridge over ravine / dripping-stalactite cavern with ruin)
- 4% LIGHTHOUSE-OR-SIGNAL-TOWER (cracked-lighthouse with broken-lamp / radio-tower with fluttering pennants / fire-tower ruin)

DO write:
- Vine-cracked subway-platform with rusted-rails close foreground, fern-cluster midground, dim-tunnel beyond — she crouches AT rails mid-prying-panel
- Root-ruptured highway-asphalt with abandoned-car close foreground, kudzu-overpass midground, ruined skyline far — he kneels AT car mid-siphon
- Mossy konbini-counter with rusted-register close foreground, vine-shelved aisle midground, shattered-window beyond — she stands AT counter mid-rummage
- Sand-buried shinkansen-platform with rusted-rail close foreground, dune-swallowed train-car midground, desert beyond — he sits ON rail mid-canteen-sip
- Lapping-tide on submerged shrine with torii-half-underwater close foreground, drifting-boat midground, drowned-tokyo beyond — she stands AT torii mid-tying-rope
- Moss-covered giant-robot-arm close foreground, fern-grown-torso midground, jungle-canopy beyond — he climbs ON arm mid-engraving-mark

DO NOT: "lone silhouette on hill looking at ruined city" — back-to-camera trap. "Standing at edge of cliff gazing at horizon." Combat. Zombies. Blood. Horror. Photoreal.

Wanderer is ENGAGED with foreground ruin-prop. Ruined vista is BACKDROP behind them, never the target of their gaze.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

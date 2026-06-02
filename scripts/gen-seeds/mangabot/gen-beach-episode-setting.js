#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BEACH-EPISODE SETTING entries — bright joyful summer vacation contexts. K-On!/Free!/Lucky-Star tropical-paradise / Japanese-coast aesthetic.

Each 14-22 words. Setting + tactile foreground + midground + engagement-context (character clearly DOING something).

⚠️ Anti-back-to-camera: NEVER "standing at shoreline looking out at ocean" — character is engaged IN the scene facing camera or sideways.

VARIETY:
- 16% JAPANESE-COAST (Enoshima beach with vending-machines + lifeguard-tower / Okinawa white-sand cove with shisa-statue / Kamakura-coast with surfers + torii-on-rock)
- 14% TROPICAL-PARADISE (palm-grove with hammock + coconuts / Okinawan reef with palms + outrigger / lagoon with tiki-bar / coconut-tree cluster shading)
- 12% POOL-SIDE (school pool with lane-ropes + diving-board / hotel-pool with parasols + loungers / public pool with slide / outdoor onsen-style pool)
- 10% WOODEN-BOARDWALK (boardwalk with food-stalls + bunting / pier-walk with vending / promenade with ice-cream-cart)
- 10% TIDE-POOLS (rocky tide-pool with sea-stars / volcanic-rock tide-shelf with crabs / coral-pool with anemones)
- 8% BOAT-SIDE (small fishing-boat tied to dock / kayak pulled up on sand / pedal-boat moored / dragon-boat at pier)
- 8% PARASOL-CLUSTER (umbrella-row on beach with towels / candy-stripe parasol-grid / family beach-tent cluster)
- 6% VENDOR-STALL (shaved-ice cart on sand / yakisoba-truck with bunting / coconut-vendor under palm / shave-ice stand with menu)
- 6% CLIFF-OVERLOOK (cliff with wooden-stairs down to beach / lookout-deck with railing / tide-watching gazebo over sand)
- 6% FESTIVAL-FIREWORKS (beach-festival evening with lanterns + fireworks above water / hanabi-night with stalls / bonfire-circle on sand)
- 4% CAVE/COVE (sea-cave entrance with light-shaft / hidden cove with private-rock-arch / grotto-pool with palms above)

DO write:
- Enoshima beach with vending-machine close foreground, lifeguard-tower midground, distant pier with surfers — she crouches AT sand mid-bucket-fill
- Okinawan white-sand cove with shisa-statue close, palm-cluster midground, turquoise reef beyond — he kneels ON sand mid-shell-collect
- School pool deck with lane-rope close, diving-board midground, distant fence + sky — she stands AT pool-edge mid-cheer-for-friend
- Wooden boardwalk with food-stall foreground, bunting midground, beach beyond with surfers — he leans AT stall-counter mid-order
- Tide-pool with sea-star close foreground, rocks midground, distant ocean — she squats ON rock mid-point-at-pool
- Small fishing-boat tied to dock with rope-pile close, dock-planks midground, harbor beyond — they sit ON edge mid-laugh
- Parasol-cluster on beach with towel-detail close, parasol-grid midground, surf beyond — she lounges ON towel mid-read-manga
- Shaved-ice cart with syrup-bottles close foreground, awning midground, beach beyond — he stands AT counter mid-receive-cone
- Cliff-overlook with wooden-railing close, switchback-stairs midground, beach below — she leans ON railing facing camera mid-laugh
- Beach-festival evening with lantern-row close, food-stalls midground, fireworks above water — they walk TOWARD camera mid-stride-grin
- Sea-cave entrance with light-shaft beam close, wet-rock midground, ocean beyond — he wades AT cave-mouth facing viewer mid-wave
- Hotel-pool with float-rings close, parasols midground, palm-cluster beyond — she sits ON lounger mid-laugh-with-friend
- Hidden cove with rock-arch close, shallow pool midground, ocean horizon — he crouches NEAR tide-line mid-point-at-fish
- Hanabi-night beach with lantern-string close, stall-rows midground, fireworks above bay — she stands AT vendor mid-receive-takoyaki

DO NOT: "standing at edge looking out at distant ocean" — back-to-camera trap. Moody. Romantic-pining. Photoreal cinematography. Cheesecake-coded "secluded beach with one girl in bikini." Multiple per entry.

Every setting affords ENGAGED-WITH joyful-vacation-moment.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

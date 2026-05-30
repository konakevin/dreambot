#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_accessory.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC ACCESSORY entries — objects the wanderer is using/carrying. Anchors them ENGAGED in the ruined world (not silhouette-staring-at-vista).

Each 10-18 words. Object + use-detail. Must imply forward-facing engagement.

VARIETY:
- 16% SCAVENGED-FOOD-CONTAINER (battered tin-can mid-eat / canteen mid-sip / foraged-berries in palm / ration-bar mid-bite)
- 14% TOOL/IMPLEMENT (wrench mid-turn on engine / hammer mid-strike / pry-bar mid-leverage / knife mid-carve)
- 12% NAVIGATION (compass open in palm with finger pointing / folded-map across knee / spyglass mid-peer at midground)
- 10% LIGHT-SOURCE (oil-lantern held aloft / torch-mid-light with match / handheld-flare burning / candle-jar)
- 10% MUSIC/COMFORT (harmonica mid-blow with cupped hands / paperback-novel open mid-page / small music-box winding / locket open in palm)
- 8% PET-ANIMAL (mechanical-dog at side / small lizard on shoulder / scout-drone hovering at ear / cat curled in coat-fold)
- 8% WEAPON-AT-REST (revolver in holster with hand resting on grip / rifle slung across back / staff leaned against knee — NOT brandished, NOT firing)
- 6% MEDICAL-KIT (bandage mid-wrap on own arm / tincture-vial mid-pour / herb-bundle in hand)
- 6% RADIO/COMM (handheld-radio mid-listen / antenna-rig with dial / signal-flare-gun held down at side)
- 6% MAP-DRAFTING (sketchbook with pencil mid-stroke / chart-roll mid-measure / quadrant-tool mid-sight)
- 4% MOTORBIKE-OR-CART (handlebar-grip mid-pause / cart-handle mid-pull / bike-saddlebag mid-rummage)

DO write:
- Battered tin-can of beans held warm in both hands, faint steam-curl rising
- Brass-edged compass open flat on palm, finger pointing past viewer's shoulder
- Worn paperback novel open mid-page, finger marking spot, sun-shaft on text
- Hand-cranked oil-lantern held aloft at chest, warm-amber pooling on face
- Harmonica cupped in both hands mid-blow, cheeks puffed, eyes half-closed in focus
- Mechanical-dog companion at side, dimly-blinking optic looking up at wanderer
- Revolver in worn holster with one hand resting on grip — NOT drawn, NOT firing

DO NOT: weapons-mid-fire / dramatic-combat / brandishing-rifles / multiple per entry / horror.

Object MUST anchor character ENGAGED, NOT staring at distant horizon.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

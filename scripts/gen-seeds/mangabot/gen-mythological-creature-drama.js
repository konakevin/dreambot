#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} DRAMA entries for a MangaBot mythological-creature keyframe. SCENE-LED conditional layer (fired at 50%) — each entry names ONE BIG YOKAI-BEAT that elevates the frame to story-moment. Mononoke / Spirited-Away climax-register. Loud not quiet.

⚠️ CRITICAL: Japanese-yokai-mythology beats only. NEVER western dragon-slaying / unicorn-purification / Greek-thunder. NEVER WESTERN. Use authentic: transformation, fox-fire-burst, dragon-spiral, yokai-procession, shrine-bell-tolling, sigil-ignites, spirit-doubles-emerge, possession-moment, summoning, exorcism-via-ofuda.

Each entry: 12-22 words. ONE big narrative beat tied to a yokai species or shinto act.

DRAMA VARIETY (big yokai-mythology beats):
- The kitsune mid-transformation, body splitting into nine separate fox-fire flames
- A fox-fire burst exploding outward from the kitsune's spread tails, light flooding the bamboo
- The dragon-god mid-spiral, body coiling tighter around the shrine pillar, mist condensing
- A yokai-procession passing along the foxfire-lit lane behind the hero, ghostly silhouettes
- A shrine-bell tolling, the brass-ripple visible distorting air, the yokai mid-reaction
- A sigil-circle igniting beneath the floating tengu, glyphs flaring white-hot in mid-rotation
- Spirit-doubles emerging from the rokurokubi's stretched neck, transparent echo-bodies fanning
- The oni mid-roar, thunder-aura bursting from the chest, iron-club raised above head
- The yuki-onna's breath condensing into a wave of frost that crystallizes mid-air
- A namahage mid-stride bursting through a shoji screen, paper-shreds suspended
- The amabie mid-prophecy, mouth open, mist pouring outward in a condensed cloud
- The bake-neko mid-leap with paper-lantern flame trailing as a comet-tail
- The ryujin mid-emergence from a waterfall basin, mist exploding outward as it rises
- An ofuda paper-charm catching fire at the witness's hand, white sutra-flame consuming it
- The inugami mid-possession-flash, shadow-tendrils reaching toward an unseen target
- A tanuki mid-shape-shift caught at the exact seam, body half-fox half-human in still
- The kappa rising up from the river-bed mid-emergence, water-curtain breaking around it
- The hyakume's clustered eyes all opening at once, glowing wave-pulse across the body
- The yamabushi-tengu mid-conch-horn-blast, sonic-ripple distorting mist outward
- The karakasa-obake hopping mid-air, paper-umbrella body spinning, tongue lolling sideways
- The kitsune mid-laugh, fox-fire jetting from open jaws, sparks raining downward
- A nure-onna mid-rear, snake-coil tightening, river-water cascading from the spine
- The oni mid-club-swing, kanabo arcing through the air, indigo flame trailing
- A shrine-gate (torii) splitting at the lintel as the yokai pushes through, vermilion-wood fragmenting
- The tengu mid-wing-spread, black-feathered wings unfurling to fill the upper third of the frame

DO write:
- The kitsune mid-transformation, body splitting into nine separate fox-fire flames in mid-spread
- A fox-fire burst exploding outward from the kitsune's spread tails, blue-orange flooding the bamboo
- The dragon-god mid-spiral, body coiling tighter around the vermilion shrine pillar
- A yokai-procession passing along the foxfire-lit lane behind, ghostly silhouettes mid-march
- The oni mid-roar, thunder-aura bursting from the chest, iron-club raised above the head
- An ofuda paper-charm catching fire mid-air, white sutra-flame consuming the shide-paper
- The tengu mid-wing-spread, black-feathered wings unfurling to fill the upper third of frame

DO NOT write:
- Western mythology drama (dragon-slaying / unicorn-purification / Greek lightning-bolt)
- Quiet narrative beats (surprise pool handles those)
- Hero-human dramatic actions (the hero is the YOKAI)
- Modern action drama (gunfire / car-chase)
- Multi-beat sequences (pick ONE moment)
- Generic "magic" without yokai specificity

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

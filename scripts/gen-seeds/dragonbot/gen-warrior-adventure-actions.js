#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_adventure_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ADVENTURING / TRAVELING action entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (12-22 words) describing a CANDID moment of a warrior on the move — hiking, traveling, exploring a town, sitting in a tavern, breaking camp, scouting, gearing up, social candid, peaceful in-world life.

ABSOLUTELY NO BATTLE SCENES. NO COMBAT. NO MID-STRIKE. NO DYING / DEAD / WOUNDED. NO VIOLENCE. NO BLOOD.

These are quiet "between adventures" moments — the warrior is alive, capable, and we caught them mid-life. Suitable for both male and female warriors.

━━━ ACTION CATEGORIES (enforce variety across ${n}) ━━━

HIKING / TRAVELING (5-6) — on the road / in the wild:
- cresting a mountain ridge at dawn, breath visible, gazing at the valley below
- wading across a shallow stream with boots laced high and a walking-stick for balance
- pausing on a forest trail to drink from a leather waterskin, sun dappling through canopy
- climbing a rope ladder up a cliffside, focused on the next handhold
- fording a snowy mountain pass with cloak drawn tight, footprints behind in fresh powder
- standing at a crossroads signpost, reading carved directions in three languages

TOWN / VILLAGE CANDID (4-5) — passing through civilization:
- walking down a cobblestone street past torch-lit shop windows at dusk
- standing at a market stall examining a hand-forged knife, weighing it for balance
- pausing in front of a town fountain at midday, water sparkling in sun
- sitting on a low stone wall at the edge of a village square, watching life pass
- crossing an arched bridge over a canal, distant temple-bells ringing

TAVERN / INN (4-5) — social candid moments:
- leaning against a tavern doorframe, surveying the warm interior before stepping in
- sitting alone at a corner table by the fireplace, cradling a clay mug
- standing at a bar counter speaking quietly to the keeper, one elbow on polished wood
- seated at a long oak table eating a hot meal, satchel slung over the chair-back
- by the hearth pulling off worn boots, steam rising from drying cloak

SCOUTING / OBSERVING (3-4) — the warrior surveys the world:
- crouched low at the edge of a treeline scanning the open field beyond
- standing on a rocky outcrop using a brass spyglass, hand shading the eye
- kneeling to examine fresh tracks pressed into riverbank mud, fingers brushing the print
- pausing on a high pass to look back the way they came, wind in cloak

CAMP / BREAK (3-4) — making or breaking camp:
- crouched by a small campfire feeding it twigs, sparks rising into night
- packing a bedroll by morning light, breath visible in cool air
- sitting cross-legged sharpening a blade with slow careful strokes by firelight
- tending to a saddled horse at dawn, brushing dust off its flank

CRAFTING / TENDING (3-4) — quiet adventurer work:
- mending a tear in a leather pauldron with needle and waxed thread
- restringing a longbow at a wooden bench, full concentration on the gut-string
- studying an unrolled map on a low table, finger tracing a route in candle-light
- writing in a leather-bound journal at a small wooden desk, ink-pot at hand

━━━ RULES ━━━
- Each entry is a CANDID, PEACEFUL moment — adventure-life, not war-life
- 12-22 words — vivid, paintable, specific
- ABSOLUTELY NO battle / combat / dying / wounded / mid-strike / weapon-aimed-at-foe
- Weapons can be HOLSTERED, sheathed, slung, or being maintained — never IN USE
- The warrior is ALIVE and CAPABLE — caught mid-action of normal life
- Suitable for BOTH male and female warriors (gender-neutral phrasing)
- Variety across all 6 categories above mandatory
- Pleasant / curious / contemplative / focused emotional tone — never violent

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

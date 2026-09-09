#!/usr/bin/env node
/**
 * FarmBot — harvest-time path (Moment, MVP-25).
 *
 * The activity/mood of harvest — crates, baskets, gathered crops. No
 * deliberate humans on this path (place/activity-evidence only, no figure).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_harvest_time_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HARVEST-TIME scene descriptions for a cozy
farm-life bot — the ACTIVITY and evidence of harvest, without a person in
frame (a freshly-loaded cart, a pile of gathered crops, tools left mid-task
— the harvest feeling captured through its traces, not a harvester). Blend
TWO inspirations: (A) Hay Day-style farm-sim harvest iconography — a
wheelbarrow heaped with pumpkins, a cart loaded with hay bales, baskets
overflowing with just-picked apples or corn, a pitchfork leaning against a
haystack — and (B) cozy iyashikei slice-of-life mood — the particular
golden light of a harvest afternoon, dust motes over a hay bale, the
satisfying abundance of a full crate.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare or empty
composition. SURROUND the hero cart/basket/crate/pile with rich
environmental detail (the field or orchard it sits in, climbing vines or
wildflowers nearby, tall golden grass, a tree in autumn color) PLUS at
least one small whimsical, fun detail that makes the moment feel enchanted
— dust motes caught glowing in a sunbeam, a ladybug on a leaf, a single
perfect dewdrop, fallen petals scattered across the harvest, a spiderweb
strung between crates. Never describe just the bare pile alone — always
give it a lush, detailed, whimsical setting. Vary: crop type, season
(always harvest-adjacent — late summer through autumn), time of day,
weather, angle. CRITICAL: the CART, BASKET, CRATE, or PILE of harvested
goods must ALWAYS be the grammatical subject named FIRST in the sentence.
25-40 words each. Examples:
["A wooden wheelbarrow tips over with freshly picked pumpkins in every shade of orange, wildflowers blooming at its wheels, straw scattered in the low golden light of late afternoon as dust motes drift and glow.", "A hay cart sits piled high beside a hedge heavy with autumn berries, loose golden strands drifting free in the breeze, a spiderweb strung between two bales catching the last warm light of the day."]

🚫 STRICT BANS: NO named people/characters, NO animals, NO readable text or
signage, NO brand names, NO photographer/camera-brand names, NO bare/empty
compositions lacking surrounding plant detail.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

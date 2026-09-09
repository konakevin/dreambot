#!/usr/bin/env node
/**
 * FarmBot — red-barn path (Place, MVP-25).
 *
 * A red barn, exterior and/or interior, as the hero of the shot. Blends
 * Hay Day-style farm-sim iconography (the barn as a game landmark, tidy and
 * inviting) with cozy-anime slice-of-life register (dust motes in light,
 * quiet stillness, warm hay-dust smell implied visually). Animals may appear
 * incidentally (a cat on a hay bale, chickens near the door) but the BARN is
 * always the hero — never let an incidental animal upstage it.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_red_barn_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct RED BARN scene descriptions for a cozy farm-life bot.
The barn is ALWAYS the hero of the shot — vary the angle, time of day, and
detail, but never let anything else dominate the frame. Blend TWO
inspirations: (A) Hay Day-style farm-sim iconography — a tidy, inviting red
barn with white trim, big sliding doors, a hay loft, a weathervane, a silo
just visible nearby — and (B) cozy "iyashikei" slice-of-life anime mood —
dust motes drifting through a shaft of light, warm hay-dust stillness, worn
wood textures, the particular quiet of an empty barn at midday or the golden
hush of one at dusk. Vary: exterior (doors open/closed, different times of
day, different weather) AND interior (hay loft, tools on the wall, a ladder,
light through gaps in the boards). An animal MAY appear incidentally (a barn
cat dozing on a hay bale, chickens near the threshold) in roughly a third of
entries — never the hero, always secondary. CRITICAL: the BARN (or a barn
detail — its doors, its light, its walls) must ALWAYS be the grammatical
subject named FIRST in the sentence; an incidental animal may appear ONLY in
a trailing clause ("...a barn cat dozing nearby"), NEVER as the sentence's
opening subject ("Two chickens do X" is banned even if the barn is named
later) — Flux's attention locks onto whichever noun is named first, so
leading with an animal renders it as the hero regardless of intent.

CRITICAL: the barn must never stand bare or alone. Every entry ALSO lushly
SURROUNDS the barn with rich plant/garden detail at its base or along its
walls (climbing roses or ivy up a wall, a flower bed along the foundation,
tall wildflowers or grass brushing the doors, a vegetable patch nearby) PLUS
one small whimsical, fun detail (a string of fairy lights along the eaves,
a weathervane catching the light, a cluster of pumpkins by the door, a
swallow's nest under the eave) — the setting is just as much a star of the
shot as the barn itself, never a stark or empty composition. 25-40
words each, warm and inviting light implied. Examples:
["A red barn's broad doors thrown open at midday, dust motes drifting through a wide shaft of golden light, climbing roses framing the doorway and a worn ladder leaning against the hay loft.", "The barn's hay loft window glows amber at dusk, wild sunflowers nodding along its foundation, a barn cat curled asleep on a nearby bale of hay beneath a string of fairy lights."]

🚫 STRICT BANS: NO named people/characters, NO hero animal (incidental only,
per above), NO brand names, NO readable text, NO photographer/camera-brand
names, NO scary/abandoned/decrepit framing — this barn is loved and lived-in,
NO bare/empty compositions lacking surrounding plant detail.

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

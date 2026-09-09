#!/usr/bin/env node
/**
 * FarmBot — chicken-coop path (Place, MVP-25).
 *
 * The coop structure itself as the hero — a Hay Day staple building.
 * Hens may appear incidentally but the COOP/structure stays the hero,
 * same first-named-noun discipline as red-barn.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_chicken_coop_scenes.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct CHICKEN COOP scene descriptions for a cozy
farm-life bot. The coop structure itself — its little house, its fenced
run, its ramp — is ALWAYS the hero of the shot. Blend TWO inspirations:
(A) Hay Day-style farm-sim iconography — a tidy little coop with a pitched
roof and a small ramp, a fenced run scattered with straw, a row of nesting
boxes, a scattering of feed on the ground — and (B) cozy iyashikei
slice-of-life mood — soft morning light through chicken wire, dust motes,
the particular quiet hush of a coop at dawn before the day starts. Vary:
time of day, season, weather, angle (straight-on the little house, close
on the fenced run, looking through the wire). A hen or a small handful of
hens MAY appear incidentally (near the ramp, pecking at scattered feed) in
roughly a third of entries — never the hero, always secondary. CRITICAL:
the COOP (or a coop detail — its roof, its ramp, its fence) must ALWAYS be
the grammatical subject named FIRST in the sentence; an incidental hen may
appear ONLY in a trailing clause, NEVER as the sentence's opening subject.
20-35 words each. Examples:
["A tidy little coop with a pitched red roof sits behind its fenced run, morning light slanting through the chicken wire and scattering feed across the straw-covered ground.", "The coop's small wooden ramp leads down into a sunlit run, a hen pecking quietly near the base in the warm afternoon glow."]

🚫 STRICT BANS: NO named people/characters, NO hero animal (incidental
only, per above), NO readable text or signage, NO brand names, NO
photographer/camera-brand names.

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

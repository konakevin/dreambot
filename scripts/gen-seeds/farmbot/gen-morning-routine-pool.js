#!/usr/bin/env node
/**
 * FarmBot — morning-routine path (Moment, MVP-25).
 *
 * The quiet start of the day on the farm. Blends Hay Day's "opening up shop"
 * energy (unlocking the stand, first deliveries) with cozy-anime's dawn
 * stillness (mist, dew, first light). NO animals at all — three other
 * paths already cover animal content; this is a pure atmosphere/place
 * study (see the multi-round QA history in FARMBOT_PATH_BUILD_STATE.md).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_morning_routine_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct MORNING-ON-THE-FARM scene descriptions for a cozy
farm-life bot — the quiet, hopeful start of the day. This path is about
STRUCTURE, LIGHT, and WEATHER only — NO farm stand or shop (a separate path
already covers that, and "stand/shop" language tends to pull in unwanted
signage), NO animals of any kind (three separate paths already cover animal
content — this one is a pure atmosphere/place study). Blend TWO
inspirations: (A) Hay Day-style farm-sim energy — a fresh delivery crate
waiting at a gate, dew-damp crops ready for harvest, a loaded cart, an
unlatched garden gate — and (B) cozy "iyashikei" slice-of-life anime dawn
mood — thin mist, dew, the particular pale gold of first light, an open
window letting in cool morning air.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare or empty
composition. Anchor "morning" with a CONCRETE, physically-specific detail
(dew beaded in visible individual droplets on a NAMED object — a spiderweb,
a cabbage leaf, a fence rail; mist as a physical veil draped over a named
structure; the sun as a low visible disc) — a vague mood word like
"hushed" gets compressed away when the brief is rewritten, a concrete thing
survives. Then lushly SURROUND that anchor with rich plant/garden detail
(flowering vines, tall dew-silvered grass, a blooming hedge, moss) PLUS one
small whimsical, fun detail that makes the moment feel enchanted — a
spiderweb strung with dew like tiny jewels, a single perfect flower just
opening, sunbeams breaking through mist in visible shafts, a butterfly
still asleep on a leaf. Every entry needs BOTH the concrete anchor AND the
lush whimsical detail, never mood language alone and never a bare
composition. 25-40 words each. Examples:
["Thin mist drapes low over the crop rows, dew beading in bright individual drops on every leaf like scattered tiny jewels, a low golden sun just clearing a distant hedge heavy with wild roses.", "A cool dawn breeze stirs the curtains of an open farmhouse window, dew-silvered grass and blooming lavender stretching to a garden gate where a fresh delivery crate waits, a butterfly still asleep on the sill."]

🚫 STRICT BANS: NO named people/characters, NO animals of any kind (this
path is place/atmosphere only), NO farm stand or shop or any signage/price
tags/chalkboards, NO brand names, NO readable text, NO photographer/camera-
brand names, NO mood-only sentences lacking a concrete visual anchor, NO
bare/empty compositions lacking surrounding plant detail.

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

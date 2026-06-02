#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_hairstyles.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HAIRSTYLE entries for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (10-22 words) describing the EXACT hairstyle — including the Victorian / mechanical / aviation / forge-context details that make it unmistakably steampunk.

This pool composes with separate hair-color/skin/eyes/makeup/wardrobe pools.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- PINNED UP / VICTORIAN UPDO (5-6) — pinned high with brass clips and a stray loose strand, Gibson-girl roll secured with copper pins and a small geared comb, Edwardian sweep pinned with a brass dragonfly clip, intricate updo with brass hairpins and a tiny working clockwork ornament, low chignon held with crossed brass needles, half-up Victorian fall pinned with a tarnished silver butterfly
- BRAIDED / WORK-PRACTICAL (4-5) — thick rope-braid down one shoulder with brass cuffs along its length, two tight braids tucked into the collar of a leather flight jacket, single thick plait with grease-blackened ribbon woven through, fishtail braid with copper wire wound at the end, work-tight braid pinned out of the way for the forge
- LOOSE / WIND-CAUGHT (4-5) — long hair caught wild in airship wind tangling around brass goggles, loose waves blown back from forge-heat curling at the temples, undone curls escaping a half-failed updo, tousled long hair with a few stray strands stuck to a sweat-damp brow, salt-tangled long hair from too many days on a sky-deck
- SHORT / CROPPED / EDGED (3-4) — sharp Victorian bob with a coal-soot fringe, short pixie-cut with a brass-shaved undercut, jaw-length asymmetrical bob from a guild reform school, choppy short cut singed unevenly from a recent boiler accident
- ELABORATE / DRESSED (4-5) — corseted-back chignon with a brass-and-gear hairpiece, victorian top-knot with a peacock-feather aviator-style accent, small fascinator with brass mesh and clockwork-tiny-bird perched on it, tall pinned-up updo with fingerless brass-mesh net catching loose strands, full Victorian dressed-hair with brass tea-roses pinned in

━━━ RULES ━━━
- Each entry is a VIVID hairstyle with a STEAMPUNK-WORLD detail (brass pin, clockwork comb, goggle-tangle, forge-curl, soot-fringe, etc.)
- Style-diverse — do NOT cluster on pinned-updo or wind-caught. Hit every tier
- Practical for the archetype she might be (mechanic = work-tight, captain = wind-caught, noblewoman = elaborate)
- No modern hair (no balayage, no beach-waves alone, no bun-and-glasses)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/female_explorer_hairstyles.json',
  total: 50,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HAIRSTYLE entries for StarBot's female-explorer path. Each entry is a SHORT phrase (10-22 words) describing the EXACT hairstyle for a sci-fi space-explorer woman — practical for EVA helmets, often tied for zero-gravity, sometimes augmented with cybernetic implants visible at the scalp.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- TIED-BACK / EVA-PRACTICAL (5-6) — tight low-tail bound with a chrome ring for helmet-clearance, slick bun pinned with a small comm-implant visible at the crown, fishtail braid pulled forward over an EVA collar, double space-pilot braids tucked into a flight-suit collar, single thick rope-braid with steel-ring bindings
- AUGMENTED / IMPLANT-VISIBLE (5-6) — half-shaved scalp showing a glowing chrome neural-port, cybernetic plates visible behind the ear with hair flowing over them, undercut with a chrome jack glowing at the base of the skull, single shaved temple showing a small bio-monitor light, full mohawk-spine of remaining hair after cyber-augment surgery
- WIND-CAUGHT / LOOSE (4-5) — long hair caught wild in alien-atmosphere wind tangled around a comm-headset, loose waves blown back from a viewport-stand, undone curls escaping a half-failed flight-bun, tousled long hair with a few stray strands stuck to a sweat-damp brow from atmospheric entry, salt-tangled long hair from a planetary ocean dive
- SHORT / CROPPED (4-5) — sharp pilot-bob with a battle-cut fringe, pixie-cut close at the sides, jaw-length asymmetrical bob from a recent EVA-mishap, choppy short cut singed unevenly from a plasma-incident, undercut with a topknot
- ELABORATE / CULTURAL (3-4) — intricate braided crown from her home-planet tradition, pinned-up updo with chrome-and-jade hairpieces, formal expedition-leader's chignon with metal-thread woven through, elaborate moon-priestess braids with bone-and-crystal bindings

━━━ RULES ━━━
- Each entry is a VIVID hairstyle with a SCI-FI-WORLD detail (chrome-ring, comm-implant, EVA-helmet, glowing-jack, plasma-burn, etc.)
- Style-diverse — do NOT cluster on tied-back. Hit every tier
- Practical for EVA / cockpit / planetary work OR signature for explorer identity
- No modern hair (no balayage, no beach-waves alone)
- Specific to FEMALE explorers

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

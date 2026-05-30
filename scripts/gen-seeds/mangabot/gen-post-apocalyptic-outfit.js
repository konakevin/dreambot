#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_outfit.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC OUTFIT entries — scavenged, patched, modest clothing for wanderer in ruined-Japan / desert-wasteland. Trigun / Made-in-Abyss / Girls-Last-Tour register.

Each 16-26 words. Outfit + material + scavenged/repaired detail. ANTI-cheesecake — fully covered, utilitarian.

VARIETY:
- 18% PATCHED-CLOAK-OR-CAPE (oilcloth-cape mended with twine / heavy wool-cloak with multiple patches / poncho stitched from tarp)
- 16% PIECEWORK-JACKET (scavenger-jacket of mismatched panels / leather-patched flight-jacket / canvas-coat with utility-pockets)
- 14% UTILITY-WRAP-AND-BELTS (rough linen tunic with leather utility-belt / wrap-vest over long-sleeve / kimono-style wrap-shirt with cinched cord)
- 12% FACE-MASK-OR-GOGGLES (dust-bandana over nose-mouth / aviator-goggles pushed to brow / respirator-half-mask)
- 10% MECHANIC-COVERALL (grease-stained coveralls with rolled sleeves / canvas-jumpsuit cinched at waist / patched workpants + suspenders)
- 10% MONK-ROBE (worn brown traveling-robe with rope-belt / faded-grey kasaya over leggings / patched samue with straw-sandals)
- 8% DESERT-DRIFTER (long duster-coat over wrap-pants / poncho with leather-vest / sand-yellow longcoat)
- 6% MILITARY-SURPLUS (faded fatigues with name-tape removed / surplus-jacket with patches torn off / ammo-belt-but-rusted)
- 4% LAYERED-WINTER (heavy quilted-coat with fur-trim / multi-layer wool / scarf-wrapped torso)
- 2% YUKATA-PATCHED (patched yukata over leggings + boots — fall-of-Japan hybrid)

DO write:
- Patched oilcloth-cape over canvas tunic, leather utility-belt with pouches, scuffed wrap-boots
- Scavenger-jacket of mismatched leather and canvas panels, rolled-cuff trousers, ankle-wrap boots
- Linen tunic with leather utility-belt and dust-bandana at neck, patched cargo-trousers
- Grease-stained coveralls with rolled sleeves, tool-belt at hip, dust-goggles pushed up on brow
- Worn brown traveling-robe with rope-belt and straw-sandals, walking-staff
- Sand-yellow longcoat over wrap-pants, leather-vest, scarf-wrapped neck

DO NOT: "form-fitting" / "low-cut" / "cleavage" / "sultry" / "torn-revealing" / multiple per entry. ALWAYS modest + covered.

Scavenged + lived-in + practical.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

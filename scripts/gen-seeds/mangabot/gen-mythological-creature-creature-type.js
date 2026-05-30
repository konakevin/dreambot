#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_creature_type.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} CREATURE-TYPE entries for a MangaBot mythological-creature keyframe. SCENE-LED — the YOKAI is HERO and OCCUPIES 40-70% of the frame. Each entry names a SPECIFIC JAPANESE MYTHOLOGICAL BEING — its species + its iconic visual identifiers (tails, horns, eyes, scale, mask, color). Mononoke / Spirited-Away / Mushishi / Kakuriyo / xxxHolic register.

⚠️ CRITICAL: ONLY JAPANESE MYTHOLOGY. NEVER western dragon / European fairy / unicorn / pegasus / phoenix / griffin / Cthulhu / Greek goddess / mermaid / werewolf. NEVER WESTERN MYTHOLOGY EVER. Only authentic yokai lineage.

Each entry: 12-22 words. Names ONE specific yokai species + its key iconography (tails-count, horn-count, mask, fur-color, eye-glow). The creature MUST be hero-sized (named "massive", "towering", "looming", "hero-sized", "filling the frame", "looming over the scene").

YOKAI LINEAGE (pick across these — never reuse):
- Nine-tailed kitsune (kyubi) with cream-white fur, fox-fire wreathing nine fanned tails
- Tengu mountain-king with long red nose, black wings, geta-clogs, yamabushi robes
- Ryujin dragon-god, long serpentine body, antlered head, blue-green scales, pearl-clutching claws
- Yuki-onna snow-spirit, pale-blue skin, white kimono, black hair against snow-storm
- Nekomata two-tail-cat, massive feline body, forked-tail aura, golden eyes burning
- Kappa river-imp, green scaled child-form, dish-of-water atop head, beaked face
- Oni horned-demon, red or blue skin, two iron horns, tiger-stripe loincloth, iron club
- Tanuki shape-shifter, raccoon-dog form mid-transformation into human, leaf on head
- Amabie sea-prophet, three-legged scaled body, beaked face, long flowing hair
- Karakasa-obake umbrella-spirit, one-eye, one-leg, paper-umbrella body with tongue lolling
- Nure-onna serpent-woman, woman-head atop massive coiled snake-body, river-soaked hair
- Rokurokubi long-neck yokai, kimono-clad woman whose neck stretches impossibly through the room
- Yamabushi-tengu mountain-monk, crow-beaked face, yamabushi headgear, staff in hand
- Inugami dog-spirit, towering wolf-form, white fur, glowing eyes, possessing-shadow
- Bake-neko ghost-cat, massive feline upright on hind legs, oversized tail, lantern in paw
- Hyakume hundred-eyes yokai, hulking dark mass covered in glowing eyes blinking in unison
- Namahage demon-visitor, ogre-mask, straw cape, knife in hand, mid-stride
- Tofu-kozo small youkai, child-yokai carrying a glowing tofu-plate, oversized head, mushroom-hat
- Dorotabo mud-spirit, one-eyed one-armed swamp-figure rising from rice-paddy mud
- Hone-onna skeleton-woman, kimono-clad skeletal yokai, paper-lantern in bony hand

DO write (every entry sized to HERO scale, named yokai species, iconography baked):
- A massive nine-tailed kitsune with cream-white fur, nine fox-fire-wreathed tails fanned behind it
- A towering tengu mountain-king with long red nose, black-feathered wings, yamabushi robes flowing
- A hero-sized ryujin dragon-god, blue-green serpentine body coiling, antlered head crested with mist
- A looming yuki-onna with pale-blue skin and white kimono, black hair streaming against blizzard
- A massive nekomata two-tail-cat with forked tail-aura, golden burning eyes, looming over rooftops
- A hulking oni demon with red skin, two iron horns, tiger-stripe loincloth, iron kanabo club shouldered
- A towering kappa river-imp with green scaled child-form, water-dish atop head, beaked face glistening

DO NOT write:
- ANY western mythology — European dragon, unicorn, phoenix, griffin, mermaid, fairy, vampire, werewolf
- ANY Greek / Norse / Egyptian gods
- Cthulhu / Lovecraftian creatures
- Tiny / distant / background-creature framings (creature MUST be hero-sized)
- Hero-human-character entries (the hero is the YOKAI not a human)
- Modern monsters (Godzilla / kaiju — different register)
- Generic "demon" / "spirit" without specific yokai naming
- Multiple yokai per entry (pick ONE species)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

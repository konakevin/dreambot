#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cute_creatures_unified.json',
  total: 400,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CUTE-CREATURE entries for ChibiBot's unified critter pool — a tagged, multi-biome roster of adorable real animals and fantasy critters that ALL paths across ChibiBot will pull from. Each entry has BIOME TAGS so paths can filter to creatures that fit their setting.

ChibiBot is CREATURES ONLY — adorable animals and fantasy critters. NO humans of any kind (no children, no adults, no people).

━━━ OUTPUT FORMAT (JSON OBJECTS, NOT STRINGS) ━━━

Each entry MUST be an object:
{
  "tags": ["LAND", "FANTASY"],
  "description": "Baby dragon kit: tiny iridescent green scales, oversized dewy eyes, single curled tail-flame, blushing cheeks, sitting on hind legs with paws together"
}

The "tags" array uses ONE OR MORE of these exact biome tags:
- LAND  — temperate forest / meadow / mountain / cottage habitats (foxes, bunnies, deer, squirrels, etc.)
- MARINE  — underwater / coral / kelp / deep-sea / surface-water (fish, octopus, dolphins, etc.)
- ARCTIC  — snow / ice / polar / tundra (penguins, seals, snowy owls, polar bears, arctic fox, etc.)
- JUNGLE  — tropical rainforest / canopy / amazon (parrots, monkeys, sloths, jaguars, frogs, etc.)
- BIRD  — flying creatures (any bird — owls, robins, hummingbirds, finches, ducks, etc.)
- FANTASY  — non-real creatures (dragons, fairies, unicorns, pegasi, gryphons, phoenixes, kitsune, tanuki, alebrije, faun, sprites, etc.)
- ANY  — fits ANY biome (some magical-realm creatures get ANY)

Multi-tag rules:
- Land animals get [LAND]
- Marine animals get [MARINE]
- Arctic animals get [ARCTIC] (and sometimes [MARINE] if they swim — like seals)
- Penguins get [ARCTIC, BIRD] or [BIRD, ARCTIC]
- Snowy owl gets [ARCTIC, BIRD]
- Frogs get [LAND] (or [JUNGLE] if tropical)
- Dragons get [FANTASY, LAND] (or [FANTASY, MARINE] for sea-dragons)
- Fairies / sprites get [FANTASY, ANY] (tiny winged critters, NOT human — render as cute big-eyed fae-creatures with leaf/petal/insect-wing bodies)
- Mermaid-creatures (sea-spirits, ningyo fish-creatures) get [FANTASY, MARINE] — fish/creature bodies, NOT human girls
- Cloud-creatures / spirit-foxes / dreamcatcher-mice get [FANTASY, ANY]

━━━ DISTRIBUTION FOR THIS BATCH OF ${n} ━━━

Aim for roughly:
- 22% LAND temperate mammals (foxes, bunnies, hedgehogs, deer, squirrels, pandas, raccoons, otters, sloths, chipmunks, badgers, mice, kittens, puppies, hamsters)
- 13% BIRD + REPTILE + AMPHIBIAN (owls, robins, hummingbirds, ducklings, baby parrots, songbirds, frogs, turtles, baby geckos, salamanders)
- 13% MARINE (clownfish, dolphins, whales, sea-turtles, octopus, jellies, seahorses, sea-stars, manta-rays, crabs)
- 9% ARCTIC (polar bear cubs, snow leopards, arctic fox, snowy owls, baby seals, baby walrus, penguin chicks, baby reindeer)
- 9% JUNGLE (tree frogs, baby parrots, baby sloths, baby monkeys, baby capybaras, jungle birds, baby jaguars)
- 26% FANTASY (baby dragons of every color, tiny winged FAIRIES + flower-sprites + leaf-pixies, mini unicorns, baby pegasi, baby gryphons, baby phoenixes, baby kitsune with glowing tail-tips, baby tanuki, baby alebrije, faun-cubs, baby kelpie, sea-dragons, yokai-kits, baby wyverns, mushroom-sprites, acorn-imps)
- 8% MAGICAL-REALM (spirit-fox with glowing nose, cloud-bunny, dreamcatcher-mouse with woven-feather tail, star-cat with cosmic markings, moonstone-deer, paper-lantern-fae, will-o-wisp critter)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- ONE creature only (NOT a pair — pair-bonding happens at path level)
- 20-35 word description of the SINGLE creature: species + signature visual features + chibi-styling cues (oversized eyes, blushing cheeks, soft fluffy textures, big head, tiny body, single pose detail)
- For FAIRY / SPRITE entries: render as a CUTE non-human fae-CREATURE — tiny round body, oversized dewy eyes, insect/leaf/petal wings, antennae or blossom-crown — NOT a human child with wings. Think "big-eyed pixie-bug" not "little girl"
- Picture-able as one mental still frame
- Adds variety to the pool (not duplicating top species)

━━━ HARD BANS ━━━

- NO HUMANS of any kind — no children, no kids, no babies (human), no adults, no people, no human faces, no human hands. ChibiBot renders CREATURES ONLY. Fairies/sprites must read as cute fae-CREATURES, never as human children with wings.
- NO pairs / "TWO creatures" / "PAIR of" entries (pair-bonding is path-level)
- NO scary / monstrous / threatening (no zombies, no demons, no nightmare-fuel)
- NO realistic / documentary descriptions — everything chibi-styled
- NO sexualized or romanticized depictions
- NO predator-prey violence
- NO western-only fantasy bias — include Asian (kitsune, tanuki, kappa, baku), Mexican (alebrije), Andean (chinchilla-spirit), Polynesian (manaia-spirit), African (anansi), Norse (huldra-kit as a fuzzy forest-CREATURE), Slavic (domovoi-puppy) — but always rendered as cute / wholesome non-human critters
- NO repeated entries — each must add a UNIQUE creature concept

━━━ DEDUP ━━━

Dedup by: species + signature feature. "baby fox kit with white-tipped ears" and "fox cub with snowy-white ear tips" are duplicates. "baby fox kit" and "baby red panda" are distinct.

━━━ OUTPUT ━━━

JSON array of ${n} objects exactly matching the schema { "tags": [...], "description": "..." }. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

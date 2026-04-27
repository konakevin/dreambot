#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/races.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} FANTASY RACE descriptions for SirenBot — a high-fantasy warrior bot. Each entry is a fantasy species/race with specific visible identifying features. Main diversity axis.

Each entry: 15-30 words. Names the race + specific visible features (ears / skin / horns / scales / wings / tusks / tails / eye type / body quirk) so Flux renders the race unmistakably.

━━━ CATEGORIES TO MIX ━━━

**Elven variants:**
- High elven, wood elven, drow / dark elf, sun elf, shadow elf, sea elf, moon elf, pixie / sprite, fey wild-elf, half-elf with distinct heritage

**Orcish / brutish:**
- Green orc, red orc, half-orc, ogre-kin, goliath, minotaur, cyclopean giant, fomorian, troll

**Infernal / demonic:**
- Tiefling (red / purple / blue variants), succubus / incubus, fiend-blooded, imp-kin, hellforged knight, devil-pacted

**Undead / necromantic:**
- Death-knight, lich, revenant, vampire, dhampir, banshee, wraith-touched, ghoul, zombie lord

**Draconic / scaled:**
- Half-dragon (chromatic or metallic), dragonborn, kobold, naga, lamia, wyvern-kin, drake-bred

**Feywild / nature:**
- Nymph, dryad, fairy, satyr, faun, centaur, ent-kin, pixie, awakened plant-person, fungus-folk

**Aquatic / avian:**
- Merfolk, triton, sea-hag, harpy, aarakocra, bird-folk, siren, loxodon

**Magical / constructed:**
- Crystal-being, living-stone golem-woman, warforged, plant-person, starfolk, clockwork-soul, reforged hollow

**Mundane-but-mythic:**
- Heroic human (specific culture — nordic / polynesian / moorish / samurai-world / etc.), dwarf (mountain / hill / duergar), halfling / hobbit-kin, gnome (forest / rock / deep)

━━━ RULES ━━━
- Every entry identifies the race AND 1-2 specific visible features
- Wide range — no two entries identical
- Works for BOTH male and female (this is a shared race axis)

━━━ BANNED ━━━
- Generic "elf" without specificity — always name specific features
- "posing" / "modeling"
- Specific scenes / settings (that's separate)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

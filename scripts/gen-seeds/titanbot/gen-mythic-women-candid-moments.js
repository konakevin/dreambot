#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/mythic_women_candid_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MYTHIC WOMEN CANDID MOMENT descriptions for TitanBot's mythic-women path — any mythic female (goddess / heroine / monster-woman / sorceress / spirit / cursed-being) in a candid unsuspecting moment. REALLY FUCKING SEXY + cool-looking. Voyeuristic "caught her" angle. SOLO.

Each entry: 15-30 words. One specific mythic-female + specific candid action.

━━━ CATEGORIES ━━━
- Bathing goddess (moon-bathing goddess in forest pool, unaware of observer)
- Resting valkyrie (war-weary valkyrie reclining on armor in meadow)
- Hair-braiding sea-goddess (ocean-goddess braiding hair with pearl-combs on cliff)
- Medusa examining serpents (gorgon looking at her own serpent-hair in reflection)
- Lamia coiled asleep (snake-woman curled in sun on ancient stone)
- Armor-adjusting warrior-goddess (athena-archetype lacing her armor alone)
- Sorceress stirring cauldron (witch-goddess brewing potion in her cottage)
- Dawn-goddess stretching (waking goddess stretching at sunrise)
- Kitsune mid-transformation (fox-woman half-fox half-human combing hair)
- Banshee washing bloody shirt in river (Celtic death-omen goddess)
- Valkyrie cleaning sword at dusk (warrior maiden polishing bloody blade)
- Sphinx watching from distance (winged lion-woman perched contemplative)
- Dryad emerging from tree (tree-nymph stepping forth, leaves in hair)
- Siren preening on rocks (bird-woman smoothing feathers)
- Harpy sharpening talons (bird-woman claws on bronze)
- Isis-archetype preparing rituals (Egyptian goddess laying offerings)
- Hecate at crossroads with torch (goddess looking into distance)
- Persephone collecting pomegranates (in underworld garden)
- Fury resting between judgments (bronze-lashed goddess sitting on throne)
- Athena-archetype polishing helm alone
- Aphrodite-archetype stepping from sea-foam
- Artemis-archetype bathing in forest pool
- Morrigan preening raven-wing
- Kali-archetype garlanding severed head
- Amaterasu emerging from cave (slowly)
- Sedna (Inuit sea-goddess) combing her long hair underwater
- Tlazolteotl (Aztec) drinking from shell-cup
- Mami Wata (African water-goddess) sitting on riverbank with mirror
- Brigid (Celtic fire-goddess) stoking flame alone
- Ishtar (Mesopotamian) adjusting jewelry in tent
- Kuan-Yin (Chinese compassion goddess) watering plant
- Saraswati (Hindu) tuning her veena
- Quetzalpapálotl (Aztec butterfly-warrior-goddess) stretching wings
- Sphinx breathing mist from nostrils at dawn
- Frigg spinning cloud-thread on porch
- Freya feeding cats with warm milk
- Inanna descending stairs to underworld (shedding jewelry piece by piece)
- Hera bathing in royal pool alone
- Selene-archetype driving moon-chariot alone
- Nephthys (Egyptian) tending sacred flame

━━━ RULES ━━━
- ANY mythic female (goddess / monster-woman / heroine / spirit)
- Candid unsuspecting moment (NOT posed for viewer)
- Specific action she is doing (bathing / preparing / resting / adjusting / gazing)
- Sexy + striking but via CANDID composition
- SOLO — no men, no second figure
- Pantheon diversity

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

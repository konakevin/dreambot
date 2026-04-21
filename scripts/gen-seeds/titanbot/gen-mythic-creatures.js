#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/mythic_creatures.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MYTHIC CREATURE descriptions for TitanBot's mythic-creature path — GNARLY visceral mythic creatures. Multi-elemental Hydras, stone-cracking Medusas, barnacle-krakens. NEVER cute — always ancient + powerful + gnarly. Bloodborne-meets-myth energy.

Each entry: 15-30 words. One specific mythic creature with gnarly distinguishing features.

━━━ CATEGORIES ━━━
- Hydra (seven-headed, each head elementally different — fire/ice/poison, regenerating)
- Medusa (stone-cracking snake-haired gorgon with bronze scales, petrifying gaze)
- Minotaur (bronze-fused labyrinth-beast with worn armor, massive bull-horned)
- Kraken (barnacle-covered tentacled leviathan from deep)
- Chimera (lion-goat-serpent hybrid, breathing fire, patchwork pelt)
- Cerberus (three-headed underworld hound with dripping jaws)
- Sphinx (winged lion-woman with riddle-eyes, ancient stone-perched)
- Manticore (lion-body scorpion-tail human-face, barbed projectiles)
- Basilisk (serpent-king with golden crown, petrifying eye)
- Leviathan (sea-beast with armored scales, ancient deep-ocean)
- Jörmungandr (world-serpent encircling earth, venom-drooling)
- Fenris (giant bound wolf straining chains, glowing eyes)
- Garuda (eagle-man divine mount, massive wings, serpent-devouring)
- Naga (multi-headed cobra-deity, jeweled hood)
- Dragon-eastern (serpentine nine-section, cloud-swimming whiskered)
- Dragon-western (western wyrm, four-legged, hoard-guardian)
- Phoenix (ember-ash-regenerating, fire-spreading wings)
- Yamata-no-Orochi (eight-headed eight-tailed Japanese serpent)
- Qilin (Chinese chimera-unicorn with dragon-head deer-body)
- Baku (dream-eating chimera with elephant trunk)
- Tengu (mountain-spirit with crow-wings, long-nosed mask)
- Oni (horned demon with iron-club, tiger-loincloth)
- Nue (chimera-yokai with monkey-face tiger-body snake-tail)
- Tsuchigumo (giant earth-spider with demonic face)
- Thunder-bird (massive lightning-eagle, storm-wings)
- Grendel-archetype (monstrous mere-dwelling giant)
- Cyclops (single-eyed giant in volcanic forge)
- Wendigo (emaciated antlered starvation-spirit)
- Sirens (bird-woman hybrids on rocks, song-luring)
- Scylla (six-headed dog-tentacled sea-monster)
- Fury (winged avenger with serpent-hair, bronze-lashes)
- Lamia (half-woman half-snake, cursed sorceress)
- Piasa-bird (Native American sky-dragon with human-face)
- Anansi (trickster-spider deity from Yoruba)
- Tiamat (primordial sea-dragon goddess)
- Typhon (hundred-headed monster of storms)

━━━ RULES ━━━
- GNARLY, visceral, ancient + powerful
- Never cute — darkly-beautiful horror
- Include distinguishing iconic features
- Pantheon-diverse

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

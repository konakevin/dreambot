#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/action_figure_battles.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} ACTION FIGURE BATTLE descriptions for ToyBot's action-figure path — 80s/90s action-figure cinematic dioramas with toy-scale drama. Joint-articulation visible + explosion effects.

Each entry: 15-30 words. One specific action-figure battle scene.

━━━ CATEGORIES ━━━
- Robot battle mid-explosion (two mechs grappling)
- Barbarian siege (action-figure warrior at castle-wall)
- Space-marine moonbase defense
- Ninja rooftop battle at night
- Kaiju-city-destruction action-figure in mini-city
- GI-Joe-style military strike
- He-Man-style fantasy battle
- Transformer mid-transformation
- Action-hero at explosion-wall
- Dinosaur-vs-commandos action-scene
- Pirate action-figure on action-ship
- Cowboy action-figure at showdown
- Space commander at bridge
- Martial-arts master mid-kick
- Cyborg vs zombies
- Motorcycle chase action-figures
- Mountain-climber stranded
- Deep-sea-diver with shark
- Firefighter rescuing child-figure
- Boxer mid-knockout
- Wrestler mid-slam
- Gladiator mid-combat
- Viking-raider on longship
- Samurai mid-sword-draw
- Medieval-knight vs dragon-figure
- Space-pilot in cockpit action
- Tank-commander mid-firing
- Sniper on rooftop
- Parachute-trooper mid-drop
- Cold-war spy action scene
- Jungle-commando in bush
- Treasure-hunter with torch
- Gladiator-arena action
- Street-fighter back-alley
- Cyberpunk bounty-hunter
- Post-apocalyptic warrior
- Alien-trooper mid-battle
- Demon-slayer vs horned-figure
- Ghost-buster with proton-pack action
- Space-marine vs alien-xenomorph
- Dragon-rider action-figure
- Wasteland-raider on dirt-bike
- Dinosaur-rider caveman
- Jungle-archer in tree
- Monster-hunter vs wolf
- Wrestler-vs-luchador tag-team

━━━ RULES ━━━
- 80s/90s action-figure aesthetic (articulation, plastic, painted)
- Mid-action cinematic moment
- Practical-set with dramatic lighting
- Explosion / smoke / debris effects encouraged

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

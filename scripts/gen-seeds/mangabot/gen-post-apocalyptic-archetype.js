#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_archetype.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC ARCHETYPE entries — who's surviving in the ruined world. Trigun / Made-in-Abyss / Girls-Last-Tour / Yokohama-Kaidashi register.

Each 12-22 words. Role + reason-in-ruins + tone. Quiet melancholy + bittersweet hope, NOT grimdark.

VARIETY (both genders represented):
- 16% LONE-WANDERER (drifter with bedroll / scavenger with sack / map-charter with compass) — mixed gender
- 14% MESSENGER-COURIER (motorbike-rider with cargo-strap / postal-runner with satchel / radio-relay carrier) — mixed
- 12% FORMER-SOLDIER (deserter-soldier with patched-uniform / ex-pilot with helmet / retired-marine) — mixed
- 10% SCAVENGER-MECHANIC (parts-scavenger with toolbelt / engine-fixer with goggles / salvage-diver)
- 10% MONK-SURVIVOR (wandering-monk with rosary / shrine-keeper with broom / hermit with prayer-beads)
- 8% ORPHAN-WITH-PET-ROBOT (kid with companion-bot / teen with mechanical-dog / young scavenger with drone-friend)
- 8% MAP-CARTOGRAPHER (sketching ruins on parchment / chart-maker with quadrant / surveyor with theodolite)
- 6% GUNSLINGER-DRIFTER (revolver-holster wanderer / rifle-slung scout / pistol-belted ranger) — Trigun coded
- 6% MEDIC-HEALER (field-medic with kit / herbalist with pouch / nurse-wanderer with bandages)
- 4% BARD-MUSICIAN (lone harmonica-player / guitar-strapped wanderer / shamisen-traveler)
- 4% RESEARCHER (pre-fall historian with notebook / archaeologist of own age / library-keeper)
- 2% YOUNG-PAIR (two-person camp duo, NOT solo)

DO write:
- Lone wanderer with bedroll and tin-cup, register: weary-hopeful
- Motorbike-courier with cargo-strap and goggles, register: focused-pragmatic
- Former-soldier with patched-uniform jacket and rifle-slung, register: quiet-haunted
- Wandering-monk with rosary and worn-staff, register: peaceful-watchful
- Young orphan-scavenger with mechanical-dog companion, register: curious-resilient
- Gunslinger drifter with revolver-holster and dust-coat, register: laconic-protective

DO NOT: zombies / corpses / blood / horror / multiple per entry / cheesecake.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

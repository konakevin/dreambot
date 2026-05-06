#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_subjects.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SQUAD descriptions for MechBot's power-armor-infantry path. Each describes a squad of 2-5 humans in heavy exosuit armor, 14-22 words.

Each entry: squad size + role + armor archetype + faction signature + signature load-out.

━━━ NON-NEGOTIABLE — SQUAD ━━━
2-5 figures per entry. NEVER solo. Squad is the subject — the unit, not an individual.

━━━ ROLE / SQUAD-TYPE VARIETY ━━━
- Drop troopers (orbital/atmospheric insertion, paratrooper kits)
- Heavy weapons squad (LMGs, autocannons, missile launchers)
- Breach team (close-quarters, riot shields, shotguns/SMGs)
- Marines (mid-weight, balanced, frontline)
- Scouts/reconnaissance (lighter armor, ghillie/camo)
- Special ops (matte-black, helmet-cams, sound suppressors)
- Power-armor cavalry (riding hover-bikes / mech-walker mounts)
- Mercenary crew (mismatched colors, unit patches improvised)
- Alien-militia auxiliaries (alien physiology under modified human armor)
- Veteran rangers (worn armor, kill markings, scarred plates)

━━━ ARMOR ARCHETYPES ━━━
- Halo MJOLNIR-style sleek combat armor
- 40K Space Marine bulk (huge pauldrons, gothic profile)
- Edge of Tomorrow grunt-frame (industrial-utilitarian)
- Avatar AMP-suit (skeletal exo, pilot caged inside)
- Starship Troopers heavy-marine (chunky pre-modern industrial)

━━━ EXAMPLES (write fresh) ━━━
- "Four-soldier breach team in olive Stryker-Class power armor, lead trooper with riot shield, three with shotguns at the ready"
- "Three-marine heavy-weapons element in graphite plate, autocannon gunner braced, ammo-bearer feeding belt, spotter behind"
- "Five drop troopers in slate exo-armor, helmets matte with battle scars, jump-jets venting steam, drop pods open behind"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: squad role + armor archetype + signature loadout (weapon class).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

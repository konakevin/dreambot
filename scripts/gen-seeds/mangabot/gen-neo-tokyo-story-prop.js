#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_story_prop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} STORY-PROP entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is a FOREGROUND NARRATIVE-IMPLYING OBJECT — the lived-in story layer. Cyberpunk-coded. Makes the viewer wonder "what happened here?"

Each entry: 12-22 words. ONE specific prop with material-truth detail (sparks / smoke / wet-glow / wear / spill).

CYBERPUNK PROP CATEGORIES:
- COMBAT AFTERMATH (no gore — spent shell-casings, dropped weapon, broken visor)
- DROPPED / ABANDONED (umbrella, cyber-deck, briefcase, helmet, dataslate)
- SPILLED / LEAKING (energy-drink can, ramen bowl, coolant from cyber-arm)
- SMOLDERING / SPARKING (broken neon-sign, fallen drone, electrical fault, kicked-over heater)
- TECH FRAGMENT (broken cyber-implant, cracked visor, fried circuit-board)
- RAIN-LOGGED (wet newspaper with kanji headline, soaked photograph, drenched cigarette pack)
- IDENTIFIED-LITTER (dropped meishi business-card, scattered ramen-coupons, lost wallet-chip)
- MEDICAL / RIPPERDOC (used cyber-stim injector, bloody bandage, discarded surgical glove)
- NEON CASUALTY (kicked-over hostess-photo plaque, broken pachinko-coupon, smashed neon-tube)
- BIKE / VEHICLE (motorcycle helmet rolling, fallen handlebar, sparking exhaust)

DO write:
- Smoldering noodle bowl knocked sideways on wet asphalt, broth pooling, steam-curl rising into neon air
- Dropped umbrella half-folded in a puddle, the figure who dropped it no longer in frame
- Smoking cyber-pistol on wet pavement, shell-casings catching pink neon reflection
- Abandoned briefcase tipped sideways, datachips spilling across the rain-slick sidewalk
- Sparking fallen neon-sign on the curb, cables still arcing, glow flickering across the wet street
- Broken motorcycle helmet rolling at the edge of a puddle, owner's location unknown
- Spilled energy-drink can leaking electric-blue fluid onto the asphalt, label kanji blurred
- Glowing data-chip dropped face-up on the ground, status-light pulsing in distress
- Shattered cyber-visor on the gutter, fractured display still scrolling kanji error-text
- Discarded surgical glove and used cyber-stim injector by a ripperdoc-back-alley door

DO NOT write:
- Gore / blood (no bodies — implied violence only via objects)
- Multiple props per entry — ONE specific prop
- Modern non-cyberpunk objects (regular phone, normal car-key)
- Architectural / signage / tech-furniture (those are separate axes)
- Living creatures (animals belong to background_detail)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

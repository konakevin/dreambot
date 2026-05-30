#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_foreground_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} FOREGROUND-ELEMENT entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names ONE specific JAPANESE shrine / temple / nature element that sits in the immediate FOREGROUND of the frame, providing depth-layer and cultural anchoring. The element brackets / frames the yokai hero behind it.

⚠️ CRITICAL: Japanese sacred/cultural objects ONLY. NEVER western crosses / chalices / books / candles in Gothic style. NEVER WESTERN. Use authentic: torii / shimenawa / ofuda / shumoku / kanzashi / shide / komainu / ema-board / persimmon / wisteria / cypress-branch.

Each entry: 12-22 words. ONE foreground element + ONE material/texture detail. Must read as IN FRONT of the creature, partial frame (left edge / right edge / brackets the bottom).

FOREGROUND VARIETY (Japanese sacred / temple / nature objects):
- A vermilion torii pillar bracketing the left edge, lacquer chipped at the base
- A shrine bell (shumoku) hanging in the upper-right corner, brass dulled with patina
- A persimmon offering placed on a stone-step, orange-fruit bright against weathered grey
- A cedar branch hanging from the upper-frame, needles catching firelight
- A fallen ofuda paper-charm in the immediate-foreground, sutra-ink visible at the edge
- A candle-pile at the shrine-base, wax pooled into the stone joints
- A shimenawa rope hanging across the upper frame, paper-shide tassels swinging
- A wisteria-veil draping the upper-frame, purple cascades brushing the lintel
- A stone komainu lion-statue partially blocking the foreground, weathered moss in cracks
- An ema-board with prayer-ink hanging from a cypress beam, foreground-right
- A persimmon-laden branch hanging from the upper frame, fruit weighted heavy
- A cypress beam crossing the foreground diagonally, wood-grain visible
- A stack of stone-jizo statues in the foreground-left, weathered faces moss-stained
- A bonsai-pine on a stepped stand, foreground-right corner, needles catching mist
- A clay roof-tile fallen in the foreground, kawara-grey weathered with dew
- A paper-lantern hanging in the upper-frame, the yokai visible past its glow
- A bamboo stalk crossing the foreground vertically, joints lacquered with dew
- An incense-burner with smoke curling in the foreground-right, brass-belly dulled
- A shimenawa post wrapped with rope in the foreground-left, paper-shide dangling
- A wooden Buddha-statue at the foreground-edge, gold-leaf chipped at the cheek
- A torii-arch lintel cutting across the upper-third, vermilion paint flaking
- A shrine-step weathered grey, moss in the joints, the creature looming behind
- A kakejiku scroll hanging in the foreground-right, ink-brush calligraphy visible
- A clay tea-bowl placed at the shrine-step, foreground-center, half-filled with water
- A bundle of sticks wrapped with shimenawa in the foreground-left, paper-charms tied

DO write (Japanese cultural object + texture, partial-foreground framing):
- A vermilion torii pillar bracketing the left edge of frame, lacquer chipped at the base
- A shimenawa rope hanging across the upper frame, paper-shide tassels swinging in mist
- A stone komainu lion-statue partially blocking the foreground, weathered moss in the cracks
- A wisteria-veil draping the upper-frame, purple cascades brushing the lintel above the yokai
- A persimmon-laden branch hanging from the upper frame, fruit weighted heavy, the creature behind
- A paper-lantern hanging in the upper-frame, the yokai visible past its warm-orange glow
- A bundle of sticks wrapped with shimenawa in the foreground-left, paper-charms tied at the joints

DO NOT write:
- Western religious objects (cross / chalice / Gothic candelabra)
- Generic "tree branch" without Japanese cultural specificity
- Modern objects (vending-machine / power-cable — different paths)
- Objects covering the WHOLE frame (must be partial — yokai visible behind/past)
- Hero-human figures
- Multi-element dumps (pick ONE foreground element)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

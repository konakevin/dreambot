#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_story_prop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} STORY PROP entries for a MangaBot samurai-era keyframe. Each entry is a FOREGROUND/MIDGROUND NARRATIVE-IMPLYING OBJECT that makes the viewer wonder "what happened here?" — the lived-in story layer that distinguishes a poster-grade keyframe from a clean-but-bland render.

Each entry: 12-22 words. ONE specific prop with material-truth detail (smoke / charring / mud / weathered material / patina / wear).

PROP CATEGORIES to vary across the 50:
- BURNING / SMOLDERING (something on fire or just burned out — smoke implies action)
- BROKEN / FALLEN (weapons, banners, equipment damaged in combat or storm)
- ABANDONED / INTERRUPTED (objects left mid-use — tea, ration, scroll, sandals)
- COMBAT AFTERMATH (no gore — arrows, broken weapons, dropped helmets, torn fabric)
- TRAVELER'S RESIDUE (campfire ashes, walking-staff, water-gourd, traveling-bag)
- CEREMONY / RITUAL (incense stick, prayer-paper, offering-bowl, fallen prayer-beads)
- WEATHERED FRAGMENT (broken stone-lantern piece, weathered shrine plaque, mossy fragment)
- LIVED-IN DOMESTIC (laundry-line, drying-rack, fish-trap, wooden bucket — implies habitation)

DO write (examples — vary widely):
- A broken wagon-cart tipped on its side, one wheel still burning, dark smoke trailing into the wind
- A fallen clan banner half-buried in muddy ground, tattered red-and-white fabric still bearing the family crest
- A smoldering campfire ringed by river-stones, half-eaten rice-ball and tea-cup beside it
- A katana stuck blade-down in the earth, hilt up like a grave marker, weathered cord-wrap
- Scattered torn scrolls fluttering across the path, ink-blots staining the rice-paper
- An overturned palanquin with shredded silk-curtains and broken bamboo poles
- An abandoned tea-set on a flat stone, still-steaming kettle and tipped-over cup
- A discarded straw-sandal half-sunk in the muddy path, the matching one still attached to a fleeing footprint
- A row of arrow shafts embedded in a wooden post, fletching still vibrating, splintered wood radiating out
- A fallen helmet with the family crest, dented and rolled to rest beside the path
- A smoldering paper-lantern crushed underfoot, embers still glowing inside the broken frame
- A samurai's straw-cape lying torn on a stone, weighted by his katana-saya laid carefully across it
- A bamboo water-flask leaking onto the dust, the figure who dropped it no longer in frame
- A small wooden offering-bowl knocked sideways at a shrine, rice-grains scattered toward the altar
- A snapped-off naginata blade lying in autumn leaves, the wooden haft splintered

DO NOT write:
- Gore / blood (no bodies, no severed limbs — implied violence only via objects)
- Multiple props per entry — ONE specific prop only
- Modern objects (cars, electronics, paved streets)
- Architectural elements (those belong to the architectural_anchor axis — props are SMALLER, foreground)
- Living animals as props (creatures belong to background_detail)
- Wide setting descriptions (just the prop + its material truth)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange underwater cinematic grade, deep shadows',
  dark: 'deep abyssal blue, oil-black shadows, single light-shaft',
  cozy: 'warm sunlit-shallow palette, honey-warm tropical',
  epic: 'dramatic sunbeam god-rays, heroic saturated reef',
  nostalgic: 'faded sepia-underwater, muted warm marine',
  psychedelic: 'impossible neon marine hues, bioluminescent explosion',
  peaceful: 'soft diffuse pale-blue, gentle sunlit sea',
  whimsical: 'buoyant saturated reef pastels, playful marine',
  ethereal: 'pearl-white ocean mist, opalescent jellyfish glow',
  arcane: 'deep violet abyss, emerald bioluminescence, mystical',
  ancient: 'weathered bronze wreck, faded patina, deep-sea ancient',
  enchanted: 'soft magical marine glow, sparkle-particle dreamy',
  fierce: 'stark crimson-coral-and-obsidian, savage deep',
  coquette: 'rose-coral pink reef, cream sand (soft ocean)',
  voltage: 'electric-blue bioluminescence, neon plankton arcs',
  nightshade: 'deep violet midnight ocean, silver moonlit',
  macabre: 'inked abyssal black, blood-red anglerfish dread',
  shimmer: 'shimmering silver sea, iridescent fish scales',
  surreal: 'impossible ocean color pairings, hallucinatory marine',
};

module.exports = {
  REEF_SCENES: load('reef_scenes'),
  DEEP_CREATURES: load('deep_creatures'),
  MARINE_PORTRAIT_SUBJECTS: load('marine_portrait_subjects'),
  UNDERWATER_ENVIRONMENTS: load('underwater_environments'),
  AFTER_DARK_OCEAN_SCENES: load('after_dark_ocean_scenes'),
  OCEAN_ATMOSPHERES: load('ocean_atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};

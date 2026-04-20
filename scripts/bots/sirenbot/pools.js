/**
 * SirenBot — hand-curated + Sonnet-seeded axis pools.
 * Small / stable axes inline; 50-entry pools loaded from seeds/*.json.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

// ─────────────────────────────────────────────────────────────
// HAND-CURATED — small, stable axes
// ─────────────────────────────────────────────────────────────

// RACES — the main character-identity axis. Wide fantasy spectrum.
const RACES = [
  // Elven variants
  'high elven — tall, graceful, pointed ears, almond eyes, pale luminous skin with golden undertones',
  'drow / dark elf — pointed ears, midnight-blue or charcoal skin, silver-white hair, silver eyes',
  'wood elf — forest-green or bronze skin, amber eyes, leaf-wreathed hair, feral grace',
  'wild fey / pixie — small wings, iridescent skin, magical glow, feral primal features',
  // Orcish / brutish
  'green-skinned orc — tusks, heavy brow, muscular, wild braids, bone-and-leather adornments',
  'red-skinned orc — crimson or clay-red skin, tusks, scar lines, tribal warpaint',
  'half-orc — mottled green-brown skin, partial tusks, heavy brow but softer features',
  'goliath — massive stone-gray skin with runic markings across body, bald or braided',
  'minotaur — bull head with massive horns, hooves, furry legs, muscular human torso',
  // Infernal / demonic
  'tiefling — crimson or violet skin, spiraling horns, pointed tail, glowing eyes, sharp teeth',
  'succubus / incubus — leathery bat wings, horns, tail with arrowhead tip, supernatural beauty',
  'fire-blooded tiefling — skin that glows with embers beneath, smoke rising from hair',
  'undead knight — pale or ashen skin, sunken eyes with glowing pinpricks, grave-wrappings beneath armor',
  'lich — skeletal or mummified, glowing-eye sockets, shrouded in arcane fog',
  // Draconic / scaled
  'half-dragon — iridescent dragon scales across limbs and face, dragon eyes, small horn crowns',
  'dragonborn warrior — full scaled snout-head, tail, clawed hands, dragon heritage unmistakable',
  'naga / lamia — serpentine body below the hips, scales, forked tongue, venomous elegance',
  'kobold — small scaled humanoid, draconic crest, golden or copper scales',
  // Feywild / nature
  'nymph / dryad — bark-patterned skin, leaves or flowers growing from hair, forest-green eyes',
  'fairy — tiny gossamer wings, luminescent skin, glowing patterns across face',
  'satyr / faun — goat legs with hooves, horns, humanoid torso, wild hair',
  'centaur — horse body below the waist, human torso above, muscular combination',
  // Aquatic / avian
  'merfolk — fish tail below waist, scales dusting arms and face, iridescent skin',
  'harpy — feathered arm-wings, bird talons, plumage in hair, sharp avian features',
  'aarakocra / bird-folk — full avian head, feather-covered body, taloned hands',
  // Other
  'half-giant — 8-foot frame, massive proportions but still fantasy-beautiful / handsome',
  'dwarf — short and broad, braided beards/hair, stone-hardy, runic tattoos',
  'gnome — small stature, bright eyes, whimsical features, magic-touched',
  'goblin princess / noble goblin — green skin, large pointed ears, regal fantasy-goblin glamour',
  'human — mythic-beautiful human, but made distinct via ornate fantasy detail (not default / plain)',
  'plant-person / awakened vine — body woven of living vines + flowers, emerald skin, bloom-crown',
  'crystalline being — body of living quartz or obsidian, glowing inner fire',
];

// SCENE_PALETTES — overall image color mood. Critical anti-cluster axis.
const SCENE_PALETTES = [
  'golden-hour amber and copper tones against deep umber shadows — classic high fantasy warmth',
  'moonlit cool blues and silvers with frost-white highlights — cold ethereal',
  'blood-red crimson and oxblood against midnight black — brutal dramatic',
  'forest emerald greens with gold dappled light through canopy — druidic',
  'arcane violets and deep purples with magenta accent sparks — sorcerous',
  'desert ochres and sunbaked gold with turquoise sky — ancient sunscorched',
  'stormy gunmetal grays with lightning-white accents and violet clouds — tempest',
  'frost-white and pale cerulean with silver highlights — frozen tundra',
  'infernal oranges and ember-reds with black smoke — hellscape',
  'pastel dreamscape — rose gold, mint, lavender, iridescent — fey realm',
  'bioluminescent underwater blues and teals with white glow — deep sea',
  'autumn russet and gold with fallen-leaf browns — harvest season',
  'bone-white and ashen gray with single crimson accent — deathrealm',
  'aurora-borealis greens, pinks, violets against starfield — celestial',
  'volcanic black obsidian with molten-orange cracks — forge realm',
  'misty grayscale with a single burst of color — painterly spot',
  'sun-bleached marble whites with gold leaf accents — divine',
  'toxic swamp greens and sickly yellows — fetid bog',
  'candlelit warm tavern amber and leather browns — intimate keep',
  'ancient parchment sepia and ink blacks — storybook',
];

// ATMOSPHERIC EFFECTS — always-present magical texture layer.
const MAGICAL_ATMOSPHERES = [
  'glowing runes floating in the air around them',
  'drifting arcane embers like fireflies',
  'mist coiling around their feet like living thing',
  'petals or leaves suspended mid-fall frozen in time',
  'tiny motes of pure light drifting through the scene',
  'faint aurora of magical energy haloing their body',
  'snow suspended in the air, refusing to fall',
  'crackling lightning threads in the air nearby',
  'wisps of spirit-energy curling from weapon or hand',
  'dust motes catching shafts of divine light',
  'drifting glowing insects or will-o-wisps',
  'faint shimmer of protective ward visible in air',
];

module.exports = {
  RACES,
  SCENE_PALETTES,
  MAGICAL_ATMOSPHERES,
  // Sonnet-seeded pools (loaded from seeds/)
  get FEMALE_POSES() { return load('female_poses'); },
  get MALE_POSES() { return load('male_poses'); },
  get FEMALE_ACTIONS() { return load('female_actions'); },
  get MALE_ACTIONS() { return load('male_actions'); },
  get EXPRESSIONS() { return load('expressions'); },
  get ACCESSORIES_FEMALE() { return load('accessories_female'); },
  get ACCESSORIES_MALE() { return load('accessories_male'); },
  get WEAPONS() { return load('weapons'); },
  get SETTINGS() { return load('settings'); },
  get FACIAL_FEATURES() { return load('facial_features'); },
  get SEDUCTIVE_MOMENTS() { return load('seductive_moments'); },
};

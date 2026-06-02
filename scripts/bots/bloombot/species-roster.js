/**
 * BloomBot species roster — programmatic regional flora.
 *
 * 10 regions. Each render rolls one region (via picker.pickWithRecency on
 * REGION_KEYS_GENERAL or locked to 'tropical' for the tropical-paradise
 * path). Sonnet receives the region's species list and is instructed to
 * pick 3-4 species that fit the rolled palette. This decouples species
 * variety from species clumping — Sonnet can't default to roses everywhere
 * because roses don't appear in 6 of 10 regions.
 *
 * Adding a region: append to REGIONS + REGION_KEYS_GENERAL. No other code
 * change needed.
 */

const REGIONS = {
  african: {
    label: 'African',
    species: [
      'king protea',
      'leucospermum pincushion',
      "leonotis (lion's tail)",
      'agapanthus',
      'gazania',
      'watsonia',
      'fynbos heathers',
      'bird-of-paradise (strelitzia)',
      'nerine',
      'gloriosa lily',
      'flame lily',
      'freesia',
      'hesperantha',
    ],
  },
  asian: {
    label: 'East Asian',
    species: [
      'cherry blossom (sakura)',
      'plum blossom',
      'wisteria',
      'tree peony',
      'camellia',
      'magnolia',
      'sacred lotus',
      'water lily',
      'rhododendron',
      'azalea',
      'chrysanthemum',
      'gardenia',
      'jasmine',
      'torch ginger',
      'ginger lily',
      'bauhinia (Hong Kong orchid tree)',
    ],
  },
  australian: {
    label: 'Australian',
    species: [
      'kangaroo paw',
      'banksia',
      'waratah',
      'eucalyptus blossoms',
      'grevillea',
      'bottlebrush (callistemon)',
      'flannel flower',
      "Sturt's desert pea",
      'boronia',
      'hakea',
    ],
  },
  southAmerican: {
    label: 'South American',
    species: [
      'passion flower (passiflora)',
      'heliconia',
      'bromeliad bloom',
      'fuchsia',
      'mandevilla',
      'calla lily',
      'anthurium',
      "brugmansia (angel's trumpet)",
      'lapacho/ipê',
      'ceibo',
      'Victoria amazonica giant water lily',
      'jacaranda blossoms',
    ],
  },
  northAmericanNative: {
    label: 'North American native',
    species: [
      'black-eyed susan',
      'purple coneflower (echinacea)',
      'Indian paintbrush',
      'lupine',
      'California poppy',
      'columbine',
      'cardinal flower',
      'Joe-Pye weed',
      'Texas bluebonnet',
      'desert marigold',
      'ocotillo bloom',
      'saguaro flower',
      'prickly pear blossom',
      'yucca bloom',
      'fireweed',
      'evening primrose',
      'trillium',
    ],
  },
  europeanAlpine: {
    label: 'European alpine + woodland',
    species: [
      'bluebell',
      'primrose',
      'foxglove',
      'cyclamen',
      'hellebore',
      'wood anemone',
      'gentian',
      'edelweiss',
      'forget-me-not',
      'glacier lily',
      'snowdrop',
      'crocus',
      'oxlip',
      'lily-of-the-valley',
    ],
  },
  centralAsianMiddleEastern: {
    label: 'Central Asian + Middle Eastern',
    species: [
      'wild Turkish/Iranian tulip',
      'iris germanica',
      'fritillaria imperialis (crown imperial)',
      'allium giganteum',
      'peacock anemone',
      'scilla',
      'muscari grape hyacinth',
      'dahlia (decorative + cactus + pompon)',
      'parrot tulip',
      'Rembrandt tulip',
    ],
  },
  desert: {
    label: 'Desert bloom',
    species: [
      'saguaro flower',
      'prickly pear blossom',
      'agave bloom stalks',
      'ocotillo',
      'desert marigold',
      'desert sand verbena',
      'chuparosa',
      'desert globemallow',
      'palo verde blossoms',
      'barrel cactus bloom',
      'hedgehog cactus bloom',
    ],
  },
  aquatic: {
    label: 'Aquatic + semi-aquatic',
    species: [
      'sacred lotus',
      'Victoria amazonica giant water lily',
      'water hyacinth',
      'water iris',
      'sweet flag',
      'marsh marigold',
      'spider lily',
      'papyrus flower',
      'pickerelweed',
    ],
  },
  rareExotic: {
    label: 'Rare exotic',
    species: [
      'ghost orchid',
      'jade vine (electric-blue strongylodon)',
      'blue Himalayan poppy (meconopsis)',
      'titan arum',
      'night-blooming cereus',
      'queen of the andes (puya)',
      'monkey-face orchid',
      'bee orchid',
      'dove orchid',
      'chenille plant',
      'corpse flower',
      'moonflower (datura)',
    ],
  },
};

const REGION_KEYS_GENERAL = [
  'african',
  'asian',
  'australian',
  'southAmerican',
  'northAmericanNative',
  'europeanAlpine',
  'centralAsianMiddleEastern',
  'desert',
  'aquatic',
  'rareExotic',
];

// Tropical pool for the tropical-paradise path. Kept separate so the path
// stays locked to tropical regardless of the general rotation.
const TROPICAL = {
  label: 'Tropical',
  species: [
    'plumeria (frangipani)',
    'hibiscus rosa-sinensis',
    'torch ginger',
    'ginger lily',
    'jade vine (Strongylodon)',
    'heliconia',
    'ixora',
    'bauhinia',
    'vanda orchid',
    'cattleya orchid',
    'dendrobium orchid',
    'flame-of-the-forest',
    'jacaranda',
    'bird-of-paradise (strelitzia)',
    'ohia lehua',
    'pikake jasmine',
    'chenille plant',
  ],
};

function regionRosterPrompt(key) {
  const r = key === 'tropical' ? TROPICAL : REGIONS[key];
  if (!r) throw new Error(`BloomBot: unknown region "${key}"`);
  return `${r.label} flora — choose 3-4 specific species from this regional roster that match the palette colors:\n${r.species.map((s) => `  • ${s}`).join('\n')}`;
}

module.exports = {
  REGIONS,
  REGION_KEYS_GENERAL,
  TROPICAL,
  regionRosterPrompt,
};

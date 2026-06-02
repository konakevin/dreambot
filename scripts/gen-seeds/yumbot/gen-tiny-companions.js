#!/usr/bin/env node
/**
 * YumBot TINY_COMPANIONS — ~50-entry pool of cute peripheral creatures that
 * inhabit YumBot scenes alongside the food-creatures.
 *
 * Tag dimensions:
 *   TYPE:    BIRD / RABBIT / FROG / BUTTERFLY / FAIRY / FISH / INSECT /
 *            MAMMAL / MAGICAL_ORB / MOCHI_BLOB / REPTILE
 *   HABITAT: WATER / FOREST / FESTIVAL / SKY / CANDY / TEA_PARTY / PICNIC /
 *            COTTAGECORE / RAINBOW_DREAMSCAPE / UNIVERSAL / CAFE
 *
 * Companions appear AROUND the food — never as the hero — supporting the
 * cute density of the scene. Kawaii proportions, glossy pearlescent finish.
 */

const fs = require('fs');

const COMPANIONS = [
  // === BUTTERFLIES (sky / picnic / universal — works everywhere outdoor) ===
  {
    d: 'A tiny pastel-pink butterfly with closed-arc eyes, mid-flight, soft glittering wings',
    t: ['BUTTERFLY', 'SKY', 'PICNIC', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE', 'UNIVERSAL'],
  },
  {
    d: 'A pearl-blue butterfly with translucent wings catching warm pastel light, resting on a petal',
    t: ['BUTTERFLY', 'SKY', 'PICNIC', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A pastel-mint swallowtail butterfly with iridescent wing-tips and tiny kawaii face',
    t: ['BUTTERFLY', 'SKY', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A trio of pastel-lavender butterflies fluttering in a tight cluster around a flower',
    t: ['BUTTERFLY', 'SKY', 'PICNIC', 'RAINBOW_DREAMSCAPE'],
  },

  // === RABBITS / BUNNIES (forest / picnic / cottagecore) ===
  {
    d: 'A tiny pastel-pink bunny mid-hop, ears tilted, fluffy cotton-puff tail visible',
    t: ['RABBIT', 'MAMMAL', 'FOREST', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A pearl-cream bunny nibbling a tiny pastel-strawberry, dimpled blush cheeks',
    t: ['RABBIT', 'MAMMAL', 'FOREST', 'COTTAGECORE', 'PICNIC'],
  },
  {
    d: 'A small pastel-lavender bunny sitting on a mossy stone, eyes half-closed in contentment',
    t: ['RABBIT', 'MAMMAL', 'FOREST', 'COTTAGECORE'],
  },
  {
    d: 'A pastel-mint bunny with wildflower-crown on head, paws crossed in front',
    t: ['RABBIT', 'MAMMAL', 'COTTAGECORE', 'PICNIC', 'TEA_PARTY'],
  },

  // === FROGS (water / cottagecore) ===
  {
    d: 'A tiny pastel-green frog sitting on a lily-pad with a closed-arc smile and pearl-cheeks',
    t: ['FROG', 'AMPHIBIAN', 'WATER', 'COTTAGECORE', 'FOREST'],
  },
  {
    d: 'A pastel-mint frog mid-jump between two lily-pads, dewdrops trailing',
    t: ['FROG', 'AMPHIBIAN', 'WATER', 'COTTAGECORE'],
  },
  {
    d: 'A pastel-blue tree-frog clinging to a mossy branch, oversized eyes, blush cheeks',
    t: ['FROG', 'AMPHIBIAN', 'FOREST', 'COTTAGECORE'],
  },

  // === BIRDS (sky / forest / festival) ===
  {
    d: 'A pastel-pink sparrow with a tiny ribbon-tied scarf, perched and chirping',
    t: ['BIRD', 'SKY', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A pearl-blue songbird mid-flight, wings spread, leaving a sparkle-trail behind',
    t: ['BIRD', 'SKY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A tiny pastel-yellow finch on a cherry-blossom branch, head tilted curiously',
    t: ['BIRD', 'SKY', 'COTTAGECORE', 'PICNIC'],
  },
  {
    d: 'A pastel-cream owl with closed sleepy eyes, perched on a low branch',
    t: ['BIRD', 'SKY', 'COTTAGECORE', 'FOREST'],
  },

  // === FIREFLIES / GLOW-BUGS (festival / forest / candy / dreamscape) ===
  {
    d: 'A cluster of tiny golden-glow fireflies drifting through twilight air',
    t: ['INSECT', 'FAIRY', 'SKY', 'FOREST', 'FESTIVAL', 'COTTAGECORE'],
  },
  {
    d: 'A single warm-amber firefly mid-flight with a soft glow halo around it',
    t: ['INSECT', 'FAIRY', 'SKY', 'FOREST', 'FESTIVAL', 'COTTAGECORE'],
  },
  {
    d: 'A pastel-violet glow-bug pulsing with iridescent shimmer at twilight',
    t: ['INSECT', 'FAIRY', 'FOREST', 'FESTIVAL', 'COTTAGECORE'],
  },

  // === DRAGONFLIES (water / festival) ===
  {
    d: 'A pastel-iridescent dragonfly hovering above a stream, wings catching rainbow light',
    t: ['INSECT', 'WATER', 'FOREST', 'FESTIVAL', 'COTTAGECORE'],
  },
  {
    d: 'A tiny pearl-blue damselfly resting on a reed, wings folded back',
    t: ['INSECT', 'WATER', 'COTTAGECORE'],
  },

  // === AXOLOTLS / WATER-CREATURES (water) ===
  {
    d: 'A smiling pastel-pink axolotl peeking out from behind a pebble in a stream',
    t: ['FISH', 'AMPHIBIAN', 'WATER', 'COTTAGECORE'],
  },
  {
    d: 'A tiny school of pastel-iridescent fish swimming through a clear pastel-blue pond',
    t: ['FISH', 'WATER'],
  },
  {
    d: 'A pastel-koi-fish gliding through shimmering water with red-and-white markings',
    t: ['FISH', 'WATER', 'FESTIVAL'],
  },
  {
    d: 'A kawaii pastel-tadpole with closed-arc eyes wiggling in shallow water',
    t: ['AMPHIBIAN', 'WATER', 'COTTAGECORE'],
  },

  // === MOCHI-BLOBS / KAWAII-CREATURES (universal — works in any scene) ===
  {
    d: 'A pastel-pink mochi-blob creature with closed-arc eyes and dimpled blush, hopping shyly',
    t: ['MOCHI_BLOB', 'UNIVERSAL', 'CAFE', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A pastel-mint mochi-blob with tiny stub-legs, taking little wobbling steps',
    t: ['MOCHI_BLOB', 'UNIVERSAL', 'CAFE', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A trio of small mochi-blob creatures in pink, yellow, blue — clustered like marshmallows',
    t: ['MOCHI_BLOB', 'UNIVERSAL', 'CANDY_FANTASY', 'TEA_PARTY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A round mochi-bear with bear-ear-bumps and closed-arc-smile, sitting up',
    t: ['MOCHI_BLOB', 'MAMMAL', 'UNIVERSAL', 'CAFE', 'COTTAGECORE', 'TEA_PARTY'],
  },

  // === FAIRY-ORBS / WISPS / MAGICAL-SPIRITS (festival / dreamscape) ===
  {
    d: 'A tiny glowing fairy-orb drifting through the air with a soft sparkle-trail',
    t: ['FAIRY', 'MAGICAL_ORB', 'SKY', 'FESTIVAL', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A pastel-rainbow wisp curling like a ribbon through the air',
    t: ['FAIRY', 'MAGICAL_ORB', 'SKY', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A cluster of three glowing sparkle-spirits hovering in a soft constellation',
    t: ['FAIRY', 'MAGICAL_ORB', 'SKY', 'FESTIVAL', 'RAINBOW_DREAMSCAPE'],
  },

  // === HEDGEHOGS / SMALL FOREST MAMMALS ===
  {
    d: 'A tiny pastel-cream hedgehog with soft spines, sniffing a wildflower',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE', 'PICNIC'],
  },
  {
    d: 'A pastel-pink hedgehog curled into a soft ball on a mossy patch',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE'],
  },

  // === MICE / SMALL RODENTS ===
  {
    d: 'A tiny pastel-cream mouse holding a single rose-petal like a cape',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE', 'PICNIC'],
  },
  {
    d: 'A pastel-grey field-mouse peeking out from behind a mushroom-cluster',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE'],
  },
  {
    d: 'A tiny hamster-creature with cheek-pouches stuffed, dimpled blush',
    t: ['MAMMAL', 'CAFE', 'COTTAGECORE', 'UNIVERSAL'],
  },

  // === KITTENS / CATS ===
  {
    d: 'A small pastel-pink kitten mid-stretch with paws extended, eyes half-closed',
    t: ['MAMMAL', 'CAFE', 'TEA_PARTY', 'COTTAGECORE', 'UNIVERSAL'],
  },
  {
    d: 'A pastel-cream kitten curled up sleeping in a tiny basket, tail wrapped',
    t: ['MAMMAL', 'CAFE', 'COTTAGECORE', 'TEA_PARTY'],
  },

  // === STAR / CLOUD CREATURES (magical) ===
  {
    d: 'A tiny fallen-star with kawaii face and dimpled blush, glowing soft yellow',
    t: ['MAGICAL_ORB', 'SKY', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'],
  },
  {
    d: 'A small cloud-creature with closed-arc eyes, dragging a soft rain-curtain',
    t: ['MAGICAL_ORB', 'SKY', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY'],
  },
  {
    d: 'A pastel-rainbow-arc-creature with a tiny smiling face on the arc, drifting',
    t: ['MAGICAL_ORB', 'SKY', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'],
  },

  // === DEER / FOX-KIT (forest / cottagecore) ===
  {
    d: 'A pastel-cream baby deer with white-spotted back, peeking from behind a fern',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE'],
  },
  {
    d: 'A tiny pastel-orange fox-kit curled with its bushy tail wrapped around itself',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE'],
  },
  {
    d: 'A pastel-mint baby-deer with floral-crown on antler-nubs, gentle expression',
    t: ['MAMMAL', 'FOREST', 'COTTAGECORE', 'COTTAGECORE'],
  },

  // === SNAILS / SMALL CRITTERS (cottagecore) ===
  {
    d: 'A tiny pastel-pink snail with a swirled iridescent shell, leaving a sparkle-trail',
    t: ['INSECT', 'FOREST', 'COTTAGECORE'],
  },
  {
    d: 'A pastel-mint snail with a flower growing out of its shell, smiling gently',
    t: ['INSECT', 'FOREST', 'COTTAGECORE'],
  },

  // === BEES / LADYBUGS / OTHER INSECTS ===
  {
    d: 'A tiny pastel-yellow bumblebee with iridescent wings, mid-flight near a flower',
    t: ['INSECT', 'SKY', 'COTTAGECORE', 'PICNIC'],
  },
  {
    d: 'A pastel-pink ladybug with white-spotted back, walking on a leaf',
    t: ['INSECT', 'COTTAGECORE', 'PICNIC', 'FOREST'],
  },
  {
    d: 'A pastel-iridescent moth at twilight, soft wing-dust trailing behind',
    t: ['INSECT', 'SKY', 'FESTIVAL', 'COTTAGECORE'],
  },

  // === CANDY-FANTASY UNIQUE COMPANIONS ===
  {
    d: 'A tiny gummy-bear creature with translucent jelly-body, hopping on candy-pebbles',
    t: ['MAGICAL_ORB', 'CANDY_FANTASY', 'UNIVERSAL'],
  },
  {
    d: 'A small candy-cane-striped creature shaped like a snake, slithering past',
    t: ['REPTILE', 'CANDY_FANTASY'],
  },
  {
    d: 'A pastel-marshmallow-bunny with sugar-crystal-sparkle fur',
    t: ['RABBIT', 'MAMMAL', 'CANDY_FANTASY', 'COTTAGECORE'],
  },

  // === FESTIVAL UNIQUE ===
  {
    d: 'A tiny paper-lantern-fairy with a glowing red-and-gold body, hovering at twilight',
    t: ['FAIRY', 'MAGICAL_ORB', 'FESTIVAL', 'SKY'],
  },
  {
    d: 'A pastel-koi-fish gliding under festival-paper-lanterns reflected in water',
    t: ['FISH', 'WATER', 'FESTIVAL'],
  },

  // === CAFE / TEA_PARTY UNIQUE ===
  {
    d: 'A tiny porcelain-teacup-fairy with butterfly-wings made of porcelain shards, hovering',
    t: ['FAIRY', 'MAGICAL_ORB', 'TEA_PARTY', 'CAFE'],
  },
  {
    d: 'A small kawaii-puppy with floppy ears, sitting attentively on a cafe-stool',
    t: ['MAMMAL', 'CAFE', 'COTTAGECORE'],
  },
];

const VALID_TYPES = new Set([
  'BIRD',
  'RABBIT',
  'FROG',
  'BUTTERFLY',
  'FAIRY',
  'FISH',
  'INSECT',
  'MAMMAL',
  'MAGICAL_ORB',
  'MOCHI_BLOB',
  'REPTILE',
  'AMPHIBIAN',
]);
const VALID_HABITATS = new Set([
  'WATER',
  'FOREST',
  'FESTIVAL',
  'SKY',
  'CANDY',
  'TEA_PARTY',
  'PICNIC',
  'COTTAGECORE',
  'RAINBOW_DREAMSCAPE',
  'UNIVERSAL',
  'CAFE',
  'CANDY_FANTASY',
]);

let errors = 0;
COMPANIONS.forEach((c, i) => {
  const types = c.t.filter((t) => VALID_TYPES.has(t));
  const habs = c.t.filter((t) => VALID_HABITATS.has(t));
  const unknown = c.t.filter((t) => !VALID_TYPES.has(t) && !VALID_HABITATS.has(t));
  if (types.length < 1) {
    console.error(`#${i + 1}: expected 1+ TYPE, got 0`);
    errors++;
  }
  if (habs.length < 1) {
    console.error(`#${i + 1}: expected 1+ HABITAT, got 0`);
    errors++;
  }
  if (unknown.length) {
    console.error(`#${i + 1}: unknown tags: ${unknown.join(',')}`);
    errors++;
  }
});
if (errors) {
  console.error(`${errors} validation errors. Aborting.`);
  process.exit(1);
}

const out = COMPANIONS.map((c) => ({ description: c.d, tags: c.t }));
fs.writeFileSync('scripts/bots/yumbot/seeds/tiny_companions.json', JSON.stringify(out, null, 2));
console.log(`✓ Wrote ${out.length} entries to scripts/bots/yumbot/seeds/tiny_companions.json`);

/**
 * Playful dual-character SCENARIOS — goofy / tongue-in-cheek SITUATIONS for
 * unconventional couple photos. The fun lives in the ENVIRONMENT + situation,
 * NOT in the pose and NOT in COSTUMES — the couple stays as THEMSELVES in
 * normal, scene-appropriate clothes; they just happen to be in an absurd/fun
 * setting. So the couple still renders side-by-side, waist-up, faces big and to
 * camera (no hood/mask/face-paint obscuring the head), and the swap stays clean.
 * These strings feed the slot pipeline as the scene anchor (userPlace) ONLY — NOT
 * the wardrobe (so nothing costumes them); the pipeline's locked framing + normal
 * wardrobe do the rest.
 *
 * NIGHTLY-only lever (auto-rolled scenes). Create users supply their own scene.
 * MVP-25 → render-test → scale. (2026-06-16)
 */
export const DUAL_SCENARIOS_PLAYFUL: string[] = [
  'riding on top of a giant inflatable rubber duck floating on a bright pool',
  'sitting in the middle of a big pile of wriggling puppies',
  'being photobombed by a grinning llama leaning in from the side',
  'on a tandem bicycle built for two with a basket of baguettes in front',
  'standing behind a glittery game-show podium with a spinning prize wheel',
  'standing waist-deep in a giant colorful ball pit',
  'in a room completely overflowing with floating colorful balloons',
  'next to a comically oversized prop donut taller than they are',
  'surrounded by a curious flock of pink flamingos',
  'caught in a sudden burst of confetti mid-celebration',
  'standing in a field of giant sunflowers towering high above them',
  'leaning over an aquarium tank edge as a friendly dolphin splashes them',
  'riding a hayride wagon piled high with pumpkins',
  'surrounded by a swarm of bright butterflies in a glass conservatory',
  'in front of a glowing wall of vintage arcade machines',
  'floating on a giant inflatable flamingo on a calm lake',
  'with a tiny donkey nuzzling in between them on a sunny farm',
  'at a festival surrounded by huge floating soap bubbles',
  'in a cozy retro diner booth with an enormous towering milkshake between them',
  'standing proudly beside a lopsided snowman they clearly just built',
  'riding a carousel, each on a brightly painted horse side by side',
  'inside a giant pillow fort strung with warm fairy lights',
  'at a county fair in front of a wall of giant stuffed-animal prizes',
  'beneath an enormous rainbow-striped hot air balloon about to lift off',
  'on a porch swing being swarmed by a dozen friendly kittens',
];

/** Pick a random playful scenario. */
export function pickPlayfulScenario(): string {
  return DUAL_SCENARIOS_PLAYFUL[Math.floor(Math.random() * DUAL_SCENARIOS_PLAYFUL.length)];
}

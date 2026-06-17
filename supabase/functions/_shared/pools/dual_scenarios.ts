/**
 * Playful dual-character SCENARIOS — goofy / tongue-in-cheek SITUATIONS for
 * unconventional couple photos. The fun lives entirely in the scene + wardrobe +
 * props, NOT in the pose — so the couple still renders side-by-side, waist-up,
 * faces big and to camera, and the face swap stays clean. These strings feed the
 * slot pipeline as the scene anchor (userPlace) + wardrobe hint; the pipeline's
 * locked framing does the rest.
 *
 * Primarily a NIGHTLY lever (auto-rolled scenes). Create users supply their own
 * scene, so they get the playful POSE pool + their own creativity. MVP-25 →
 * render-test → scale. (2026-06-16)
 */
export const DUAL_SCENARIOS_PLAYFUL: string[] = [
  'wearing matching head-to-toe dinosaur onesies',
  'perched on a giant inflatable rubber duck floating on a bright pool',
  'as an 80s prom king and queen in front of a cheesy laser-grid photo backdrop',
  'sitting in the middle of a big pile of wriggling puppies',
  'as a caped superhero duo posing on a rooftop at golden dusk',
  'dressed as astronauts planting a flag on a cheerfully fake painted moon set',
  'as old-timey traveling circus performers in bold striped costumes',
  'being photobombed by a grinning llama leaning in from the side',
  'as wizards in tall pointy hats mid-dramatic spell with floating sparkles',
  'wearing matching ugly Christmas sweaters beside a tinsel-loaded tree',
  'as a 1950s diner waiter and waitress holding tall milkshakes',
  'at a renaissance faire, one in shiny knight armor and one in a friendly dragon costume',
  'as competitive synchronized swimmers in swim caps and nose clips',
  'in oversized novelty foam cowboy hats at a kitschy western saloon',
  'as mad scientists in lab coats surrounded by bubbling colorful beakers',
  'straddling a tandem bicycle built for two with a basket of baguettes',
  'as face-painted superfans with giant foam fingers in stadium stands',
  'dressed as a giant hot dog and a bottle of mustard at a backyard cookout',
  'as 70s disco dancers in sequined outfits under a glittering mirror ball',
  'in full banana costumes standing in a grocery-store produce aisle',
  'as cheerful pirates with eye patches and a parrot perched nearby',
  'dressed as a fuzzy bumblebee and a big flower in a sunny cartoonish garden',
  'as game-show contestants behind a glittery podium with a spinning prize wheel',
  'zipped into inflatable T-rex costumes in a city park',
  'as superheroes-in-training in slightly-too-big capes in a comic-book city',
];

/** Pick a random playful scenario. */
export function pickPlayfulScenario(): string {
  return DUAL_SCENARIOS_PLAYFUL[Math.floor(Math.random() * DUAL_SCENARIOS_PLAYFUL.length)];
}

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
  'with a tiny donkey standing in the gap between them on a sunny farm',
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

/**
 * Elegant dual-character SCENARIOS — pretty, dressed-up couple scenes (NOT
 * vacation-postcard). The couple is DRESSED UP in formal/elegant attire in a
 * beautiful setting. Unlike the playful pool, these DO set the wardrobe (`attire`
 * → slot pipeline wardrobeAnchor) — but it's tasteful real clothing (suit + gown),
 * never a costume, and never anything that hoods/obscures the face. `scene` →
 * userPlace. Same locked framing keeps them side-by-side, faces big + to camera.
 *
 * NIGHTLY-only lever. MVP-25 → render-test → scale. (2026-06-16)
 */
export interface ElegantScenario {
  scene: string;
  attire: string;
}

export const DUAL_SCENARIOS_ELEGANT: ElegantScenario[] = [
  {
    scene: 'a Tuscan villa balcony overlooking rolling vineyards at golden sunset',
    attire: 'elegant formal evening wear — a tailored suit and a flowing floor-length gown',
  },
  {
    scene: 'a lush rose garden in full bloom with soft afternoon light',
    attire: 'refined garden-party attire — a crisp blazer and an elegant midi dress',
  },
  {
    scene: 'an upscale candlelit restaurant with white tablecloths and warm low light',
    attire: 'smart dinner-date attire — a sharp dark suit and a chic cocktail dress',
  },
  {
    scene: 'a grand marble staircase in an opulent chandelier-lit ballroom',
    attire: 'black-tie formal — a classic tuxedo and a sparkling evening gown',
  },
  {
    scene: 'a rooftop terrace at night with glittering city lights below',
    attire: 'sleek night-out attire — a fitted suit and a satin slip dress',
  },
  {
    scene: 'the deck of a yacht on calm water at dusk',
    attire: 'nautical-chic formal — a navy blazer with crisp trousers and a breezy elegant dress',
  },
  {
    scene: 'a grand opera-house lobby with tall chandeliers and red velvet',
    attire: 'black-tie — a tuxedo and a glamorous floor-length gown',
  },
  {
    scene: 'a vineyard terrace at dusk strung with warm cafe lights',
    attire: 'smart-casual elegant — a sport coat and a silk wrap dress',
  },
  {
    scene: 'a Parisian café terrace in golden-hour light',
    attire: 'chic Parisian attire — a tailored coat and an elegant belted dress',
  },
  {
    scene: 'a snowy château courtyard glowing in winter evening light',
    attire: 'elegant winter formal — a sharp overcoat and a velvet gown with a faux-fur wrap',
  },
  {
    scene: 'a glass botanical greenhouse full of orchids',
    attire: 'light summer formal — a linen suit and a flowing floral gown',
  },
  {
    scene: 'a moonlit pier reaching over calm glassy water',
    attire: 'evening formal — a dinner jacket and a flowing evening gown',
  },
  {
    scene: 'a historic library with tall shelves and warm reading lamps',
    attire: 'sophisticated formal — a three-piece suit and a refined long dress',
  },
  {
    scene: 'a lavender field at sunset in Provence',
    attire: 'soft elegant attire — tailored separates and a graceful pastel gown',
  },
  {
    scene: 'a sleek modern art gallery with soft spotlights',
    attire: 'modern formal — a slim minimalist suit and a sleek column dress',
  },
  {
    scene: 'a cobblestone European old-town square at blue hour',
    attire: 'refined evening attire — a smart overcoat and a chic cocktail dress',
  },
  {
    scene: 'a cliffside terrace high above the ocean at sunset',
    attire: 'summer formal — a light suit and a flowing chiffon gown',
  },
  {
    scene: 'a candlelit wine cellar with warm arched brickwork',
    attire: 'rich formal — a dark elegant suit and a deep jewel-tone gown',
  },
  {
    scene: 'a flower-draped garden gazebo in soft romantic light',
    attire: 'romantic formal — a pastel suit and a delicate lace dress',
  },
  {
    scene: 'a grand hotel rooftop at twilight with skyline views',
    attire: 'cocktail-formal — a tailored suit and a shimmering evening dress',
  },
  {
    scene: 'a string-lit Italian courtyard restaurant in the evening',
    attire: 'relaxed elegant — a fine blazer and a flowing summer gown',
  },
  {
    scene: 'a manor-estate lawn set for a refined garden party',
    attire: 'garden-formal — a seersucker suit and an elegant garden dress',
  },
  {
    scene: 'a theater grand foyer with sweeping staircases and gold trim',
    attire: 'red-carpet formal — a classic tuxedo and a glamorous gown',
  },
  {
    scene: 'a peaceful koi-pond garden with a little arched bridge at golden hour',
    attire: 'elegant attire — a soft tailored suit and a graceful long dress',
  },
  {
    scene: 'a fireside lounge in a grand lodge with leather and warm light',
    attire: 'cozy formal — a tweed jacket and an elegant evening dress',
  },
];

/** Pick a random elegant (dressed-up) scenario + its attire. */
export function pickElegantScenario(): ElegantScenario {
  return DUAL_SCENARIOS_ELEGANT[Math.floor(Math.random() * DUAL_SCENARIOS_ELEGANT.length)];
}

/**
 * Lighting-quality axis for the special (goofy/elegant) scene paths. These are
 * LIGHT QUALITIES (not times of day), so they complement any scene + any built-in
 * time without contradicting it — one more variety lever on top of the fresh
 * Sonnet scene/wardrobe/mood/props, the random pose, the rotating model/medium/
 * vibe, and the random Flux seed, so the same scenario never renders the same twice.
 */
export const SPECIAL_SCENE_LIGHTING: string[] = [
  'warm golden cinematic light',
  'soft natural daylight',
  'moody atmospheric low light',
  'bright clean airy light',
  'dramatic backlit rim light',
  'gentle diffused overcast light',
  'rich saturated sunset glow',
  'cool elegant blue-hour light',
  'warm candlelit ambiance',
  'crisp clear midday light',
];

export function pickSpecialLighting(): string {
  return SPECIAL_SCENE_LIGHTING[Math.floor(Math.random() * SPECIAL_SCENE_LIGHTING.length)];
}

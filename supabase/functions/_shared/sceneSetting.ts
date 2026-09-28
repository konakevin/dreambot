/**
 * SCENE SETTING — what kind of place a dream is set in, so the outfit fits it (CREATE_OUTFIT_PLAN.md, phase 9).
 *
 * Kevin, 2026-09-28: "the nightly/create engines like to add weird clothes to people in renders - it will add a
 * colored cuff to their pants, overly formal outfits at the beach". Root cause: the phase 8 fashion roll picked a
 * named look (disco, regency, mermaid, Parisian) knowing only the cast's genders, never the place. On michele's
 * feed "At the Beach!" came back in sequins and platform heels, whale-watching in long gloves, a golf tournament
 * in a rolled "mermaid" look, Chinatown and a movie theater in matching berets.
 *
 * July's engine got this right with one sentence: "wardrobe MUST be what real people actually wear at <place>".
 * This module is that sentence made concrete and testable: a small SETTING vocabulary, a pure classifier from the
 * words and location data already in hand, and one authored line per setting saying what stylish people really
 * wear there. The fashion roll filters its looks by setting (outfitPlan.ts) and the brief prints the line.
 *
 * Authored tables only, table-tested in __tests__/lib/sceneSetting.test.ts. No model call.
 */

export type Setting =
  | 'beach'
  | 'city'
  | 'evening'
  | 'indoor'
  | 'outdoors'
  | 'snow'
  | 'sport'
  | 'fantasy'
  | 'unknown';

export const SETTINGS: readonly Setting[] = [
  'beach',
  'city',
  'evening',
  'indoor',
  'outdoors',
  'snow',
  'sport',
  'fantasy',
  'unknown',
];

/**
 * Keyword tables, in PRIORITY order: the first setting whose words appear wins. The order is "the setting with
 * the strongest dress code first": snow gear and sports kit are what people actually wear there, a fantasy
 * world dresses in its own costume, a beach outranks the city it sits in ("Myrtle Beach", "Miami Beach"), an
 * evening venue outranks the neighbourhood it is in.
 *
 * Nouns and activities only. Adjectives like "magical" or "tropical" are deliberately left out of fantasy and
 * beach where they would misfire ("a magical evening in Paris").
 */
const SETTING_WORDS: readonly (readonly [Exclude<Setting, 'unknown'>, RegExp])[] = [
  [
    'snow',
    /\b(ski(s|ing|er|ers)?|snowboard(s|ing|er|ers)?|snow(y|fall|man|men|ball|balls|shoe|shoes)?|slopes?|apr[eè]s[- ]ski|igloos?|ice[- ]skat(e|es|ing)|sledd?(e|ing)|toboggan(ing)?|blizzard|chalets?)\b/i,
  ],
  [
    'sport',
    /\b(golf(ing|er|ers)?|tennis|pickleball|stadium|ballpark|super ?bowl|world series|(football|baseball|basketball|soccer|hockey) (game|match)|race ?track|racetrack|nascar|formula (one|1)|marathon|gym|workout|yoga|pilates|crossfit|boxing (match|ring)|volleyball)\b/i,
  ],
  [
    'fantasy',
    /\b(dragons?|fair(y|ies)|fairy ?tale|elves|elven|wizards?|witch(es)?|sorcer(er|ess)|spaceships?|starships?|space ?stations?|alien planets?|planets?|galax(y|ies)|outer space|atlantis|narnia|hogwarts|middle[- ]earth|unicorns?|fantasy|enchanted (forest|kingdom|castle|garden)|underwater kingdom)\b/i,
  ],
  [
    'beach',
    /\b(beach(es)?|shore(line)?|seaside|surf(ing|er|ers)?|boardwalk|pool ?side|swimming pools?|pool party|lagoons?|islands?|coves?|reefs?|snorkel(ing|ling)?|scuba|whales?|dolphins?|yachts?|sail(ing|boat|boats)|catamaran|cruise|luau|tiki|cabana|oceanfront|by the (sea|ocean)|hawaii|maui|oahu|kauai|cancun|bahamas|caribbean|bali|maldives|fiji|tahiti|bora bora|key west|malibu)\b/i,
  ],
  [
    'outdoors',
    /\b(hik(e|es|ing|er|ers)|trails?|trailhead|camp(ing|site|sites|fire|fires)|forests?|woods|woodlands?|jungles?|rainforests?|mountains?|peaks?|summit|alpine|canyons?|caves?|caverns?|waterfalls?|deserts?|dunes?|meadows?|prairie|savann?ah?|safari|national park|yosemite|yellowstone|grand canyon|zion|countryside|vineyards?|farms?|ranch|wilderness|swamp|marsh|river(side)?|lake(side|shore)?|fishing|kayak(ing)?|canoe(ing)?|horseback|rodeo|picnic|orchard|pumpkin patch|glamping)\b/i,
  ],
  [
    'evening',
    /\b(gala|ball ?room|masquerade|opera|ballet|symphony|wedding|prom|cocktails?|fine dining|steakhouse|restaurant|dinner party|date night|casino|vegas|red carpet|premiere|awards?|oscars|met gala|rooftop bar|night ?club|speakeasy|jazz club|kentucky derby|derby|black[- ]tie|soir[eé]e|banquet|(?<!movie )theat(er|re)s?)\b/i,
  ],
  [
    'indoor',
    /\b(movie theat(er|re)s?|cinemas?|the movies|bowling|arcade|museums?|galler(y|ies)|librar(y|ies)|bookshops?|bookstores?|caf[eé]s?|coffee shops?|bakery|kitchen|living room|bedroom|at home|office|classroom|bars?|pubs?|brewery|karaoke|escape room|aquarium|spa|piano bar|dueling pianos|game night|sleepover)\b/i,
  ],
  [
    'city',
    /\b(city|downtown|streets?|avenue|boulevard|shopping|shops|boutiques?|markets?|bazaar|chinatown|little italy|times square|broadway|soho|neighbou?rhood|plaza|piazza|town square|landmarks?|skyline|rooftop|sightseeing|touring|new york|nyc|paris|london|tokyo|rome|barcelona|san francisco|chicago|los angeles|hollywood|nashville|new orleans|amsterdam|venice)\b/i,
  ],
];

/** The first setting whose words appear in any of `texts`, in priority order; 'unknown' when none do. */
export function settingFromText(...texts: (string | null | undefined)[]): Setting {
  const joined = texts.filter((t): t is string => typeof t === 'string' && t.length > 0).join(' ');
  if (!joined) return 'unknown';
  for (const [setting, re] of SETTING_WORDS) {
    if (re.test(joined)) return setting;
  }
  return 'unknown';
}

/**
 * Nightly locations: `location_cards.biome` (or `resolveBiomeFromTags`) → setting. Authored over the LIVE biome
 * values (2026-09-28), including the bespoke ones BIOME_AXES does not key (luxury, wild_west, tropical_island...).
 */
const BIOME_SETTING: Readonly<Record<string, Setting>> = {
  urban_city: 'city',
  mediterranean: 'city',
  temperate_coastal: 'beach',
  tropical_coastal: 'beach',
  mediterranean_coastal: 'beach',
  tropical_island: 'beach',
  tropical_caribbean: 'beach',
  tropical: 'beach',
  fjord_coastal: 'outdoors',
  tropical_monsoon: 'outdoors',
  alpine_mountain: 'outdoors',
  desert_arid: 'outdoors',
  red_rock_canyon: 'outdoors',
  wetland_jungle: 'outdoors',
  temperate_forest: 'outdoors',
  grassland_savanna: 'outdoors',
  volcanic_geothermal: 'outdoors',
  ancient_ruins: 'outdoors',
  wild_west: 'outdoors',
  temperate_varied: 'outdoors',
  temperate_maritime: 'outdoors',
  zen_garden: 'outdoors',
  alpine_snow: 'snow',
  arctic_polar: 'snow',
  interior_intimate: 'indoor',
  luxury: 'evening',
  gothic_historic: 'fantasy',
  gothic_haunted: 'fantasy',
  fantasy_imagined: 'fantasy',
  aquatic_underwater: 'fantasy',
  scifi_cosmic: 'fantasy',
  scifi_space: 'fantasy',
  prehistoric: 'fantasy',
};

/** Tag fallback for a card whose biome is missing or unmapped. Prefixes (`biome:`, `theme:`) are ignored. */
const TAG_SETTING: readonly (readonly [string, Setting])[] = [
  ['space', 'fantasy'],
  ['fantasy', 'fantasy'],
  ['surreal', 'fantasy'],
  ['gothic', 'fantasy'],
  ['underwater', 'fantasy'],
  ['snow', 'snow'],
  ['coastal', 'beach'],
  ['tropical', 'beach'],
  ['interior', 'indoor'],
  ['cozy', 'indoor'],
  ['urban', 'city'],
  ['theme_park', 'city'],
  ['mountain', 'outdoors'],
  ['forest', 'outdoors'],
  ['desert', 'outdoors'],
  ['nature', 'outdoors'],
  ['underground', 'outdoors'],
];

/** A nightly location's setting: imagined places are fantasy; else the biome; else the tags; else unknown. */
export function settingFromLocation(loc: {
  biome?: string | null;
  tags?: readonly string[] | null;
  imagined?: boolean;
}): Setting {
  if (loc.imagined) return 'fantasy';
  if (loc.biome && BIOME_SETTING[loc.biome]) return BIOME_SETTING[loc.biome];
  const tags = new Set(
    (loc.tags ?? []).map((t) => (t.includes(':') ? t.slice(t.indexOf(':') + 1) : t).toLowerCase())
  );
  for (const [tag, setting] of TAG_SETTING) {
    if (tags.has(tag)) return setting;
  }
  return 'unknown';
}

/** Nightly scenario rows: a category that fixes the setting outright (the rest read the row's scene text). */
const CATEGORY_SETTING: readonly (readonly [RegExp, Setting])[] = [
  [/^(water_bliss|tropical_adventure|underwater_wonders)$/, 'beach'],
  [/^winter_wonder$/, 'snow'],
  [/^sports_glory$/, 'sport'],
  [/^(expedition|extreme_sports)$/, 'outdoors'],
  [/^(ballroom|gatsby|victorian)/, 'evening'],
  [/^street_cool$/, 'city'],
];

export function settingFromCategory(category: string | null | undefined): Setting | null {
  if (!category) return null;
  for (const [re, setting] of CATEGORY_SETTING) {
    if (re.test(category)) return setting;
  }
  return null;
}

/**
 * What stylish people really wear in each setting: July's "what real people actually wear there", elevated.
 * Printed in the wardrobe brief when scene fit is on. Never a PLAIN_CLOTHES word and never a face occluder
 * (locked by tests), so the line itself can never trip the validator. No hats either: the first lab round
 * (2026-09-28) lost a Hawaii couple's swap to a panama hat shading his face (identity 0.223), and brims were
 * already a phase 8 watch item. A look that names a hat still can; this line never adds one.
 */
export const SETTING_DRESS: Readonly<Record<Setting, string | null>> = {
  beach:
    'at the beach people wear swimwear, a sarong or a sheer cover-up, a sundress or a flowing maxi dress, linen shirts, tailored shorts and sandals',
  sport:
    "at a sports venue people wear the sport's own smart kit or stylish spectator clothes (golf: a polo or fine knit with a pleated skirt or tailored shorts; tennis whites; the team's colours at a game)",
  snow: 'in the snow people wear real snow gear made beautiful: a fitted ski suit or a shell jacket with snow trousers, a knit beanie worn high on the head, insulated boots',
  outdoors:
    'outdoors people wear real outdoor clothes made beautiful: a field jacket or light layers, sturdy trousers or shorts, boots or trail shoes',
  evening:
    'for an evening out people dress up: a cocktail dress or a gown, a sharp suit or a dinner jacket, heels or polished shoes',
  city: 'in the city people wear smart, stylish clothes made for walking around: a great dress or skirt, tailored trousers, a statement jacket, good shoes',
  indoor:
    'indoors people wear relaxed but put-together clothes that suit the room: a pretty dress, a fine-knit top, tailored trousers, clean shoes',
  fantasy: 'in an imagined world people wear costume true to that world',
  unknown: null,
};

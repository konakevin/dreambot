/**
 * OUTFIT PLAN — who wears which colour, silhouette and pattern (CREATE_OUTFIT_PLAN.md, phase 1).
 *
 * Kevin, 2026-09-23: "can we make each person wear only their own colour, or even mismatched colors and
 * patterns/fabrics … we can have matchy like that, i like it, but can we also have the post by koi?"
 *
 * WHY THIS EXISTS. The Create couple brief handed Sonnet ONE two-colour palette and ONE cut, and asked it to
 * "SPLIT it between them". It mirrored instead: 62% of production couples wore BOTH colours each (her navy
 * jacket over crimson trousers, his crimson jacket over navy trousers), in the same silhouette, all solid.
 * Asking harder does not fix a model that rhymes — so here CODE decides the split and Sonnet only dresses
 * each person in what it was given (the house rule: the varying element comes from authored pools, never
 * from the model).
 *
 * THREE INDEPENDENT ROLLS per render (Kevin: "we can always mix and match"):
 *   - colour: coordinated (one palette, one colour each, never swapped) | independent (each person their
 *     own palette from different colour families — koi's look)
 *   - silhouette: shared | separate. A silhouette NEVER changes the garment type: the scene sets that for
 *     both people (Kevin: "two women in a formal scene and one gets a dress and the other a jacket, that's
 *     weird"). It only changes how that garment is cut.
 *   - pattern: per person, one of the authored patterns or solid.
 *
 * THE USER WINS. A garment the user named is theirs; a colour they named is theirs; a garment whose colours
 * are implied (a team jersey, a brand, a uniform) keeps its own colours and gets no roll; a user colour in a
 * patterned roll keeps the colour and takes our pattern as TRIM only (Kevin's call).
 *
 * Pure and rng-injected: every rule below is a table test in __tests__/lib/outfitPlan.test.ts. Nothing
 * imports this until the Create wiring phase, and that wiring is behind engine_config switches that
 * default OFF, so shipping this file changes no live render.
 */

// ── Colour families ──────────────────────────────────────────────────────

export type ColourFamily =
  | 'red'
  | 'pink'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'earth'
  | 'neutral';

export interface PaletteColour {
  name: string;
  family: ColourFamily;
}

/** One authored pair. In a coordinated couple each person gets ONE of the two; in an independent couple (and
 *  solo) one person wears the whole pair, leading with one and accenting with the other. */
export interface PalettePair {
  a: PaletteColour;
  b: PaletteColour;
}

const c = (name: string, family: ColourFamily): PaletteColour => ({ name, family });

/**
 * COLOUR AGAINST COLOUR, balanced across families (the lesson of two passes on WARDROBE_PALETTES: a pool that
 * is half orange, or where every entry quietly carries a grey, is indistinguishable from no pool). Neutrals
 * appear only in the two deliberately monochrome pairs. No garment, no material, no finish that implies a
 * fabric: the garment and its fabric come from the scene. Locked by tests.
 */
export const PAIRED_PALETTES: readonly PalettePair[] = [
  { a: c('cobalt blue', 'blue'), b: c('warm terracotta', 'orange') },
  { a: c('deep teal', 'teal'), b: c('acid yellow', 'yellow') },
  { a: c('ice blue', 'blue'), b: c('soft coral', 'pink') },
  { a: c('navy', 'blue'), b: c('mustard', 'yellow') },
  { a: c('forest green', 'green'), b: c('burnt orange', 'orange') },
  { a: c('sage green', 'green'), b: c('dusty rose', 'pink') },
  { a: c('deep plum', 'purple'), b: c('emerald', 'green') },
  { a: c('violet', 'purple'), b: c('saffron', 'yellow') },
  { a: c('lilac', 'purple'), b: c('moss green', 'green') },
  { a: c('crimson', 'red'), b: c('deep navy', 'blue') },
  { a: c('blush pink', 'pink'), b: c('cornflower blue', 'blue') },
  { a: c('coral', 'pink'), b: c('turquoise', 'teal') },
  { a: c('burnt orange', 'orange'), b: c('petrol blue', 'teal') },
  { a: c('ochre', 'yellow'), b: c('plum', 'purple') },
  { a: c('rust', 'orange'), b: c('teal', 'teal') },
  { a: c('oxblood', 'red'), b: c('antique gold', 'yellow') },
  { a: c('magenta', 'pink'), b: c('deep pine green', 'green') },
  { a: c('scarlet', 'red'), b: c('sky blue', 'blue') },
  { a: c('tangerine', 'orange'), b: c('lavender', 'purple') },
  { a: c('sunflower yellow', 'yellow'), b: c('royal purple', 'purple') },
  { a: c('mint green', 'green'), b: c('raspberry', 'pink') },
  { a: c('camel', 'earth'), b: c('cobalt blue', 'blue') },
  { a: c('chocolate brown', 'earth'), b: c('powder pink', 'pink') },
  // TONAL: one family, light to deep.
  { a: c('pale ice blue', 'blue'), b: c('midnight blue', 'blue') },
  { a: c('rose', 'pink'), b: c('deep oxblood', 'red') },
  // MONOCHROME: deliberately few. A real look, never the default.
  { a: c('glossy jet black', 'neutral'), b: c('porcelain white', 'neutral') },
  { a: c('storm grey', 'neutral'), b: c('electric chartreuse', 'green') },
];

/**
 * SILHOUETTES — how the garment is CUT, never what it is. A gown can be sleek or flowing; a snow shell can be
 * cropped or long-line; a suit can be sharp or relaxed. Unlike WARDROBE_CUTS this pool carries no utility
 * hardware and nothing about hoods (a "hood framing the face" is one word away from the occlusion rule), so
 * every entry reads right in a ballroom AND on a mountain.
 */
export const OUTFIT_SILHOUETTES: readonly string[] = [
  'sleek and close-fitting, cut sharp to the body',
  'soft, fluid and draped, moving with the body',
  'structured, with strong shoulders and a defined waist',
  'oversized and relaxed, with generous volume',
  'long and lean, with an elongated line',
  'cropped and high-waisted, a short top half over a long lower half',
  'retro 1970s proportions, wide and bold',
  'an asymmetric line with one deliberately off-centre detail',
  'full and flared, with volume below the waist',
  'tailored and precise, with crisp clean lines',
];

/**
 * SILHOUETTES V2 (phase 8, 2026-09-26) — used only while the garment roll is on. Measured on three accounts'
 * last ~30 dreams: 28% of women's outfits were wide-leg trousers, palazzos or flares and the rest leaned to
 * trouser suits. Four of the ten V1 cuts are VOLUME ("oversized and relaxed", "retro 1970s, wide and bold",
 * "fluid and draped", "full and flared") and two are SUITING ("strong shoulders", "tailored"): on a woman
 * whose garment nobody picked, Sonnet reads volume as palazzo pants and shoulders as a pantsuit. V2 drops the
 * two widest, softens the other two, and adds two cuts that read on a dress, a skirt or a jumpsuit.
 * Same contract as V1: no garment, no material, no hood, no PLAIN_CLOTHES word (locked by tests).
 */
export const OUTFIT_SILHOUETTES_V2: readonly string[] = [
  'sleek and close-fitting, cut sharp to the body',
  'soft and fluid, moving with the body',
  'structured, with a defined waist',
  'long and lean, with an elongated line',
  'cropped and high-waisted, a short top half over a long lower half',
  'an asymmetric line with one deliberately off-centre detail',
  'full and flared, with volume below the waist',
  'tailored and precise, with crisp clean lines',
  'wrapped and belted at the waist',
  'layered, with one contrasting piece over another',
];

/** Cuts that turn trousers into palazzos or flares: never paired with a trousers family. */
const NOT_FOR_TROUSERS: ReadonlySet<string> = new Set([
  'soft and fluid, moving with the body',
  'full and flared, with volume below the waist',
  'cropped and high-waisted, a short top half over a long lower half',
]);

/**
 * GARMENT FAMILIES (phase 8, 2026-09-26) — the one axis no pool used to vary. Colour, cut and pattern were
 * authored; the garment was "whatever the scene calls for", and when the scene called for nothing in
 * particular (a beach bar, a piano duel, a museum courtyard) Sonnet dressed women in its one default: wide-leg
 * trousers, a silk blouse and a blazer (Kevin: "big flowy pants", "a disposition to show women in pantsuits").
 * The house rule applies: the varying element comes from an authored pool, never from the model.
 *
 * Women only (men were never the complaint). Rolled only when nobody in the render has a garment or costume
 * the user asked for, and two women in one render share one family (Kevin: the scene sets ONE garment type
 * for the pair). The brief keeps an escape hatch: gear the activity needs (swimwear, snow gear, a ballgown at
 * a ball) wins. Never "wide-leg", "palazzo" or "suit", never a PLAIN_CLOTHES word (locked by tests). Weights
 * are engine_config.outfit_garment_weights, keyed by `key`.
 */
export interface GarmentFamily {
  key: string;
  text: string;
  /** The family has trouser legs (trousers, a jumpsuit): the widening cuts are skipped. A rolled jumpsuit
   *  with "cropped and high-waisted" came back "high-waisted wide-leg jumpsuit" in the harness. */
  trousers: boolean;
}
export const WOMEN_GARMENT_FAMILIES: readonly GarmentFamily[] = [
  { key: 'dress', text: 'a dress', trousers: false },
  { key: 'skirt', text: 'a skirt with a statement top', trousers: false },
  { key: 'jumpsuit', text: 'a jumpsuit or playsuit', trousers: true },
  { key: 'shorts', text: 'shorts with a statement top', trousers: false },
  {
    key: 'trousers',
    text: 'slim or straight-leg trousers with a statement top',
    trousers: true,
  },
  { key: 'coat_over_dress', text: 'a coat or jacket worn over a dress', trousers: false },
];
export const DEFAULT_GARMENT_WEIGHTS: Readonly<Record<string, number>> = {
  dress: 30,
  skirt: 20,
  jumpsuit: 10,
  shorts: 10,
  trousers: 15,
  coat_over_dress: 15,
};

/** A weights map from config: known keys only, non-negative numbers. Missing keys take the default; an
 *  all-zero or unreadable map falls back to the defaults (never to a uniform roll). */
export function normalizeGarmentWeights(raw: unknown): Record<string, number> {
  const out: Record<string, number> = { ...DEFAULT_GARMENT_WEIGHTS };
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const r = raw as Record<string, unknown>;
  for (const f of WOMEN_GARMENT_FAMILIES) {
    const v = Number(r[f.key]);
    if (r[f.key] !== undefined && Number.isFinite(v)) out[f.key] = Math.max(0, v);
  }
  return Object.values(out).some((v) => v > 0) ? out : { ...DEFAULT_GARMENT_WEIGHTS };
}

/** One weighted pick from the women's garment families. Exactly one rng call. */
export function rollGarmentFamily(
  weights: Readonly<Record<string, number>> = DEFAULT_GARMENT_WEIGHTS,
  rng: () => number = Math.random
): GarmentFamily {
  const w = normalizeGarmentWeights(weights);
  const total = WOMEN_GARMENT_FAMILIES.reduce((s, f) => s + (w[f.key] ?? 0), 0);
  let at = rng() * total;
  for (const f of WOMEN_GARMENT_FAMILIES) {
    at -= w[f.key] ?? 0;
    if (at < 0) return f;
  }
  return WOMEN_GARMENT_FAMILIES[0];
}

/**
 * FASHION LOOKS (phase 8, 2026-09-27). Kevin: "we should add some really fun fashion styles in these, people
 * like seeing themselves in different outfits - especially girls." A garment family alone ("a skirt with a
 * statement top") still leaves the STYLE to Sonnet, which rhymes; a named look is the fun part — boho, 60s mod,
 * Y2K, western glam, mermaid shimmer — and it varies the render the way a costume designer would.
 *
 * Authored, like every varying element. Each look is signature DETAILS (texture, trim, accessories, shoes),
 * colour-free so the palette roll still colours it (locked by tests), no face occluder, no PLAIN_CLOTHES word.
 * A women's look lists the garment families it reads right on (a pleated tennis skirt is never rolled onto a
 * jumpsuit). Men get their own pool; a couple shares one theme half the time (same key in both pools) —
 * Kevin on matching: "we can have matchy like that, i like it", and on mixing: "we can always mix and match".
 */
export interface FashionLook {
  key: string;
  text: string;
  /** Women only: the garment families this look suits (WOMEN_GARMENT_FAMILIES keys). */
  families?: readonly string[];
}
export const WOMEN_FASHION_LOOKS: readonly FashionLook[] = [
  {
    key: 'boho',
    text: 'boho: embroidery, a little fringe or crochet, layered bangles and rings',
    families: ['dress', 'skirt', 'shorts'],
  },
  {
    key: 'mod',
    text: '1960s mod: bold graphic lines, a short hemline, go-go boots',
    families: ['dress', 'skirt', 'coat_over_dress'],
  },
  {
    key: 'disco',
    text: '1970s disco: shimmer and sequins, a dramatic collar, platform heels',
    families: ['jumpsuit', 'dress'],
  },
  {
    key: 'y2k',
    text: 'Y2K: shimmery fabric, a tiny shoulder bag, butterfly hair clips',
    families: ['skirt', 'dress', 'shorts'],
  },
  {
    key: 'old_money',
    text: 'old-money elegance: a fine-knit twinset, a pearl necklace, polished loafers',
    families: ['skirt', 'trousers', 'coat_over_dress'],
  },
  {
    key: 'parisian',
    text: 'Parisian chic: a beret, a neat silk neck scarf, ballet flats',
    families: ['dress', 'skirt', 'trousers', 'coat_over_dress'],
  },
  {
    key: 'cottagecore',
    text: 'cottagecore: puff sleeves, lace trim, a woven basket bag',
    families: ['dress', 'skirt'],
  },
  {
    key: 'dark_academia',
    text: 'dark academia: tweed textures, a pleated skirt, loafers and knee socks',
    families: ['skirt'],
  },
  {
    key: 'western',
    text: 'western glam: fringed suede, a statement belt buckle, cowboy boots',
    families: ['dress', 'skirt', 'shorts', 'jumpsuit'],
  },
  {
    key: 'balletcore',
    text: 'balletcore: a wrap top, soft tulle, satin ribbon ties',
    families: ['skirt', 'dress'],
  },
  {
    key: 'resort',
    text: 'resort glamour: a wide-brim hat, statement earrings, strappy sandals',
    families: ['dress', 'jumpsuit', 'shorts', 'skirt'],
  },
  {
    key: 'pinup',
    text: 'retro pin-up: a sweetheart neckline, a cinched waist, a silk scarf tied in the hair',
    families: ['dress', 'skirt', 'shorts'],
  },
  {
    key: 'rocker',
    text: 'rock-and-roll: a cropped leather jacket, studded details, ankle boots',
    families: ['dress', 'skirt', 'shorts', 'trousers'],
  },
  {
    key: 'gothic',
    text: 'gothic romance: lace, velvet, a corset bodice',
    families: ['dress', 'skirt'],
  },
  {
    key: 'deco',
    text: 'art-deco glamour: beading, fringe, a long strand of pearls',
    families: ['dress', 'jumpsuit'],
  },
  {
    key: 'sporty',
    text: 'sporty-chic: a cropped varsity jacket, a pleated tennis skirt, crisp trainers',
    families: ['skirt'],
  },
  {
    key: 'fairycore',
    text: 'fairycore: sheer layered fabric, delicate floral embroidery, a touch of glitter',
    families: ['dress', 'skirt'],
  },
  {
    key: 'safari',
    text: 'safari chic: a belted waist, utility pockets, a woven sun hat',
    families: ['dress', 'shorts', 'jumpsuit', 'trousers'],
  },
  {
    key: 'nautical',
    text: 'nautical: brass buttons, a sailor collar, rope-braided details',
    families: ['dress', 'shorts', 'trousers', 'skirt'],
  },
  {
    key: 'glam_rock',
    text: 'glam rock: metallic fabric, bold jewellery, platform boots',
    families: ['jumpsuit', 'trousers', 'dress'],
  },
  {
    key: 'preppy',
    text: 'preppy: a cable knit over the shoulders, a headband, loafers',
    families: ['skirt', 'shorts', 'dress'],
  },
  {
    key: 'couture',
    text: 'haute couture: one sculptural statement piece, dramatic volume in one place',
    families: ['dress', 'jumpsuit', 'coat_over_dress'],
  },
  {
    key: 'coastal',
    text: 'coastal elegance: soft linen layers, a straw hat, espadrilles',
    families: ['dress', 'trousers', 'skirt'],
  },
  {
    key: 'kpop',
    text: 'K-pop stage style: a cropped jacket, layered chains, platform boots',
    families: ['skirt', 'shorts', 'trousers'],
  },
  {
    key: 'regency',
    text: 'regency romance: an empire waist, puff sleeves, long gloves',
    families: ['dress', 'coat_over_dress'],
  },
  {
    key: 'fifties',
    text: '1950s: a full circle skirt, a fitted bodice, a neat neck scarf',
    families: ['skirt', 'dress'],
  },
  {
    key: 'street',
    text: 'street style: a cropped statement jacket, chunky boots, layered necklaces',
    families: ['shorts', 'skirt', 'trousers'],
  },
  {
    key: 'mermaid',
    text: 'mermaid shimmer: iridescent scale-like sequins, a fishtail hem',
    families: ['dress', 'skirt'],
  },
];
export const MEN_FASHION_LOOKS: readonly FashionLook[] = [
  { key: 'old_money', text: 'old-money: a fine-knit polo, tailored trousers, polished loafers' },
  { key: 'disco', text: '1970s: a wide-collared shirt, flared trousers, a chunky belt' },
  { key: 'western', text: 'western: a pearl-snap shirt, a statement belt buckle, cowboy boots' },
  { key: 'rocker', text: 'rock-and-roll: a leather jacket, studded details, boots' },
  {
    key: 'safari',
    text: 'safari explorer: a utility shirt with pockets, a canvas hat, a belted waist',
  },
  { key: 'dapper', text: 'dapper 1920s: braces, a flat cap, rolled shirtsleeves' },
  { key: 'resort', text: 'resort style: a camp-collar shirt, tailored shorts, loafers' },
  { key: 'dark_academia', text: 'dark academia: tweed textures, a roll-neck, brogues' },
  {
    key: 'nautical',
    text: 'nautical: a double-breasted jacket with brass buttons, rope-braided details',
  },
  { key: 'mod', text: '1960s mod: a slim suit, a skinny tie, polished boots' },
  { key: 'street', text: 'street style: a bomber jacket, layered chains, chunky boots' },
  { key: 'glam_rock', text: 'glam rock: a metallic jacket, bold rings, platform boots' },
  { key: 'preppy', text: 'preppy: a crested blazer, a knit tied over the shoulders, loafers' },
  { key: 'gothic', text: 'gothic romance: a velvet frock coat, lace cuffs' },
  { key: 'deco', text: 'art-deco glamour: a sharp dinner jacket, a silk pocket square' },
  { key: 'kpop', text: 'K-pop stage style: a cropped jacket, layered chains, sleek boots' },
  { key: 'coastal', text: 'coastal: soft linen layers, a straw hat, espadrilles' },
  { key: 'parisian', text: 'Parisian chic: a beret, a neat neck scarf, a belted trench coat' },
  { key: 'regency', text: 'regency romance: a tailcoat, a cravat, tall boots' },
  { key: 'sporty', text: 'sporty-chic: a varsity jacket, a crisp polo, clean trainers' },
];

/** What the fashion roll gives one person: a woman gets a garment family AND a look; a man, a look. */
export interface FashionPick {
  family: GarmentFamily | null;
  look: FashionLook;
}

/**
 * The fashion roll for one render (phase 8). `genders` by role; a person with no known gender gets nothing.
 * Two women share ONE garment family (Kevin: the scene sets one garment type for the pair); a couple shares
 * one THEME half the time when both pools have that look. Pure and rng-injected.
 */
export function rollFashion(
  roles: readonly string[],
  genders: Readonly<Record<string, 'male' | 'female' | null | undefined>>,
  weights: Readonly<Record<string, number>> = DEFAULT_GARMENT_WEIGHTS,
  rng: () => number = Math.random
): (FashionPick | null)[] {
  const out: (FashionPick | null)[] = roles.map(() => null);
  let family: GarmentFamily | null = null;
  let firstKey: string | null = null;
  const themed = roles.length === 2 && rng() < 0.5;
  roles.forEach((role, i) => {
    const g = genders[role];
    if (g !== 'female' && g !== 'male') return;
    let pool: readonly FashionLook[];
    let fam: GarmentFamily | null = null;
    if (g === 'female') {
      family = family ?? rollGarmentFamily(weights, rng);
      fam = family;
      pool = WOMEN_FASHION_LOOKS.filter((l) => !l.families || l.families.includes(fam!.key));
    } else {
      pool = MEN_FASHION_LOOKS;
    }
    const match = themed && firstKey ? pool.find((l) => l.key === firstKey) : undefined;
    const look = match ?? pick(pool, rng);
    if (firstKey === null) firstKey = look.key;
    out[i] = { family: fam, look };
  });
  return out;
}

/** Garments whose colour IS their material (phase 8): Kevin's "sleek and revealing armor" came back in a
 *  rolled blush pink. Our colour goes on as ONE accent (a cloak, a sash, a trim), never the whole piece.
 *  Deliberately narrow: a tux, a gown or a kimono still takes our colour (Kevin: "no exceptions list"). */
export const MATERIAL_COLOURED =
  /\b(armou?r(ed)?|chain ?mail|mail shirt|plate mail|breastplates?|cuirass(es)?|pauldrons?|gauntlets?|hauberks?)\b/i;

/** Fit words in a user's STYLE: when present the style sets the cut, so no silhouette is rolled over it. */
export const FIT_WORDS =
  /\b(sleek|fitted|form[- ]?fitting|figure[- ]hugging|body[- ]hugging|curve[- ]hugging|skin[- ]?tight|tight|bodycon|revealing|skimpy|flowy|flowing|loose|baggy|oversized|slim)\b/i;

/** PATTERNS — koi's gingham and tropical print. Pattern shape only: no colour (the person's palette colours
 *  it) and no garment. How it is applied (a print where the garment can carry one, a trim where it cannot) is
 *  added where the plan is written into the brief, so a wetsuit or chef's whites never get a literal floral. */
export const WARDROBE_PATTERNS: readonly string[] = [
  'a bold tropical-leaf print',
  'a crisp gingham check',
  'a scattered floral print',
  'fine pinstripes',
  'bold wide stripes',
  'a windowpane check',
  'playful polka dots',
  'a graphic geometric print',
  'colour-blocked panels',
  'a paisley print',
  'a houndstooth check',
  'a leopard-spot print',
];

// ── The user's own words ─────────────────────────────────────────────────

/** What the user asked one person to wear (from the outfit extractor). Every field is the user's own words. */
export interface UserOutfitSpec {
  garment: string | null;
  colour: string | null;
  /** The garment carries its own colours: a team jersey, a brand, a uniform, a period costume. */
  colourImplied: boolean;
  pattern: string | null;
  /** Costume read (phase 8): the character or costume the user cast this person as ("Celtic bowhuntress",
   *  "pirates"). Absent when the costume read is off. */
  costume?: string | null;
  /** Costume read (phase 8): how the user wants the outfit to look or fit ("sexy, sleek and deadly"). */
  style?: string | null;
  /** Costume read (phase 8): the outfit's colour is its material (armor, or a costume with no garment named):
   *  our colour becomes one accent, with no pattern. */
  materialColour?: boolean;
}

const COLOUR_WORDS: readonly [ColourFamily, RegExp][] = [
  ['red', /\b(red|scarlet|crimson|cherry|ruby|burgundy|maroon|oxblood|wine)\b/i],
  ['pink', /\b(pink|blush|rose|fuchsia|magenta|coral|raspberry|salmon)\b/i],
  ['orange', /\b(orange|tangerine|rust|terracotta|copper|peach|apricot)\b/i],
  ['yellow', /\b(yellow|gold|golden|mustard|lemon|canary|saffron|ochre|butter)\b/i],
  ['teal', /\b(teal|turquoise|aqua|petrol)\b/i],
  ['green', /\b(green|emerald|sage|olive|mint|lime|forest|jade|moss|chartreuse)\b/i],
  ['blue', /\b(blue|navy|cobalt|sky|azure|cornflower|indigo|sapphire)\b/i],
  ['purple', /\b(purple|violet|lilac|lavender|plum|mauve|amethyst)\b/i],
  ['earth', /\b(brown|tan|camel|chocolate|beige|khaki|taupe|caramel)\b/i],
  ['neutral', /\b(black|white|grey|gray|silver|cream|ivory|charcoal)\b/i],
];

/** Every family a user-typed colour names ("purple and gold" → purple + yellow); [] when none we know. */
export function colourFamiliesOf(text: string | null | undefined): ColourFamily[] {
  if (!text) return [];
  return COLOUR_WORDS.filter(([, re]) => re.test(text)).map(([family]) => family);
}

/** The first family a colour names, or null. */
export function colourFamilyOf(text: string | null | undefined): ColourFamily | null {
  const all = colourFamiliesOf(text);
  return all.length ? all[0] : null;
}

// ── The plan ─────────────────────────────────────────────────────────────

export interface OutfitRollConfig {
  /** % of couples whose colours are independent (the rest coordinated). */
  independentPct: number;
  /** % of couples with a different silhouette each (the rest share one). */
  separateCutPct: number;
  /** % chance, per person, of a pattern (the rest solid). */
  patternPct: number;
  /** Phase 8: roll a garment family for women nobody dressed, and use OUTFIT_SILHOUETTES_V2. Absent/false =
   *  the plan (and its rng sequence) exactly as before. */
  garmentRoll?: boolean;
  /** Weights for WOMEN_GARMENT_FAMILIES (engine_config.outfit_garment_weights). */
  garmentWeights?: Readonly<Record<string, number>>;
  /** Cast gender by role; read only by the garment roll. */
  genders?: Readonly<Record<string, 'male' | 'female' | null | undefined>>;
}

export const DEFAULT_OUTFIT_ROLLS: OutfitRollConfig = {
  independentPct: 50,
  separateCutPct: 50,
  patternPct: 50,
};

export interface OutfitColour {
  lead: string;
  accent: string | null;
}

export interface PersonOutfitPlan {
  role: string;
  /** The user's garment words, locked. null = the scene decides. */
  garment: string | null;
  /** null when the garment's own colours are implied. For 'material', `lead` is the one accent colour. */
  colour: OutfitColour | null;
  colourSource: 'roll' | 'user' | 'implied' | 'material';
  /** Phase 8: the user's costume/character words ("Celtic bowhuntress"), locked. */
  costume?: string | null;
  /** Phase 8: the user's style words ("sleek and deadly"), printed as asked. */
  style?: string | null;
  /** Phase 8: the rolled garment family for a woman nobody dressed ("a skirt with a statement top"). */
  garmentFamily?: string | null;
  /** Phase 8: the rolled fashion look for anyone nobody dressed ("boho: embroidery, ..."), and its key. */
  look?: string | null;
  lookKey?: string | null;
  /** The partner's rolled colours: this person must not wear them (the mirror fix). */
  avoidColours: string[];
  pattern: string | null;
  patternSource: 'roll' | 'user' | null;
  /** A user-coloured item in a patterned roll: the pattern goes on as trim, the colour stays theirs. */
  patternAsTrim: boolean;
  silhouette: string;
}

export interface OutfitPlan {
  colourMode: 'coordinated' | 'independent' | 'solo';
  cutMode: 'shared' | 'separate' | 'solo';
  people: PersonOutfitPlan[];
}

const pct = (n: number): number => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0)) / 100;
function pick<T>(pool: readonly T[], rng: () => number): T {
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
}
function pickOther<T>(pool: readonly T[], not: T, rng: () => number): T {
  const rest = pool.filter((x) => x !== not);
  return rest.length ? pick(rest, rng) : not;
}
const familiesOf = (p: PalettePair): ColourFamily[] => [p.a.family, p.b.family];

/**
 * Roll a plan for one render. `roles` is the cast in any order (the caller maps role → side after its own
 * left/right flip); `spec` is the user's request keyed by role.
 */
export function planOutfits(
  roles: readonly string[],
  cfg: OutfitRollConfig = DEFAULT_OUTFIT_ROLLS,
  spec: Readonly<Record<string, UserOutfitSpec | undefined>> = {},
  rng: () => number = Math.random
): OutfitPlan {
  if (roles.length < 1 || roles.length > 2) {
    throw new Error(`planOutfits needs 1 or 2 people, got ${roles.length}`);
  }
  const solo = roles.length === 1;
  const userSpec = (role: string): UserOutfitSpec | undefined => spec[role];
  const userColourLocked = (role: string): boolean => {
    const s = userSpec(role);
    return !!s && (!!s.colour || s.colourImplied);
  };

  // Families the user already claimed: nobody we colour may land in them (so "a red bikini" is not stood
  // next to our crimson unless the user asked for both).
  const lockedFamilies = new Set<ColourFamily>();
  for (const r of roles) {
    for (const f of colourFamiliesOf(userSpec(r) ? userSpec(r)!.colour : null))
      lockedFamilies.add(f);
  }
  const clearOf = (families: ColourFamily[]) => families.every((f) => !lockedFamilies.has(f));

  // ── colour ──
  const colourMode: OutfitPlan['colourMode'] = solo
    ? 'solo'
    : rng() < pct(cfg.independentPct)
      ? 'independent'
      : 'coordinated';
  const rolled: (OutfitColour | null)[] = roles.map(() => null);
  if (colourMode === 'coordinated') {
    const open = roles.map((r) => !userColourLocked(r));
    // One person locked by the user: the pair must have at least one half outside the user's family, so the
    // other person never lands in it.
    const pool = PAIRED_PALETTES.filter((p) =>
      open[0] !== open[1]
        ? !lockedFamilies.has(p.a.family) || !lockedFamilies.has(p.b.family)
        : true
    );
    const pair = pick(pool.length ? pool : PAIRED_PALETTES, rng);
    const flip = rng() < 0.5;
    let first = flip ? pair.b : pair.a;
    let second = flip ? pair.a : pair.b;
    // One person locked by the user: give the other whichever half of the pair clears the user's family.
    if (open[0] && !open[1] && lockedFamilies.has(first.family)) [first, second] = [second, first];
    if (!open[0] && open[1] && lockedFamilies.has(second.family)) [first, second] = [second, first];
    rolled[0] = { lead: first.name, accent: null };
    rolled[1] = { lead: second.name, accent: null };
  } else {
    // solo or independent: each person wears a whole pair, lead + accent.
    const taken: ColourFamily[] = [];
    for (let i = 0; i < roles.length; i++) {
      if (userColourLocked(roles[i])) continue;
      const pool = PAIRED_PALETTES.filter(
        (p) => clearOf(familiesOf(p)) && familiesOf(p).every((f) => !taken.includes(f))
      );
      const pair = pick(pool.length ? pool : PAIRED_PALETTES, rng);
      const flip = rng() < 0.5;
      rolled[i] = {
        lead: (flip ? pair.b : pair.a).name,
        accent: (flip ? pair.a : pair.b).name,
      };
      taken.push(...familiesOf(pair));
    }
  }

  // ── garment family + fashion look (phase 8) ──
  // Anyone nobody dressed gets an authored look; women also get a garment family, two women share one.
  // Skipped outright when anyone in the render has a garment, costume or style the user asked for: their words set
  // the look for the whole render (a rolled "shorts" next to the user's "tux" would be wrong). Off → no rng
  // call, the old sequence exactly.
  let fashion: (FashionPick | null)[] = roles.map(() => null);
  if (cfg.garmentRoll) {
    // A user STYLE counts too: "80's clothes" / "dressed up to the nines" read as style, and a rolled K-pop
    // look on top of the user's 80s came back in the harness (their words set the look for the render).
    const userDressed = roles.some((r) => {
      const s = userSpec(r);
      return !!s && ((!!s.garment && !isGenericGarment(s.garment)) || !!s.costume || !!s.style);
    });
    if (!userDressed && cfg.genders) {
      fashion = rollFashion(roles, cfg.genders, cfg.garmentWeights ?? DEFAULT_GARMENT_WEIGHTS, rng);
    }
  }
  const families: (GarmentFamily | null)[] = fashion.map((f) => (f ? f.family : null));

  // ── silhouette ──
  const cutMode: OutfitPlan['cutMode'] = solo
    ? 'solo'
    : rng() < pct(cfg.separateCutPct)
      ? 'separate'
      : 'shared';
  const cutPool = cfg.garmentRoll ? OUTFIT_SILHOUETTES_V2 : OUTFIT_SILHOUETTES;
  const safeFor = (fam: GarmentFamily | null): readonly string[] =>
    fam && fam.trousers ? cutPool.filter((c) => !NOT_FOR_TROUSERS.has(c)) : cutPool;
  // A shared cut must suit both people; a separate second cut only its own wearer.
  const firstPool =
    cutMode === 'separate'
      ? safeFor(families[0])
      : safeFor(families.find((f) => !!f && f.trousers) ?? null);
  const firstCut = pick(firstPool, rng);
  const cuts =
    cutMode === 'separate'
      ? [firstCut, pickOther(safeFor(families[1]), firstCut, rng)]
      : [firstCut, firstCut];

  // ── pattern + the user's words ──
  const people: PersonOutfitPlan[] = [];
  let firstPattern: string | null = null;
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    const s = userSpec(role);
    const implied = !!s && s.colourImplied && !s.colour;
    const userColour = s && s.colour ? s.colour : null;
    // Phase 8: armor (or a costume with no garment named) keeps its own materials; ours is one accent.
    const material = !!s && !!s.materialColour && !implied && !userColour;

    let pattern: string | null = null;
    let patternSource: PersonOutfitPlan['patternSource'] = null;
    if (s && s.pattern) {
      pattern = s.pattern;
      patternSource = 'user';
    } else if (!implied && !material && rng() < pct(cfg.patternPct)) {
      pattern = firstPattern
        ? pickOther(WARDROBE_PATTERNS, firstPattern, rng)
        : pick(WARDROBE_PATTERNS, rng);
      patternSource = 'roll';
    }
    if (pattern && firstPattern === null) firstPattern = pattern;

    const rolledColour = rolled[i];
    people.push({
      role,
      garment: s && s.garment ? s.garment : null,
      colour: implied
        ? null
        : userColour
          ? { lead: userColour, accent: null }
          : material && rolledColour
            ? { lead: rolledColour.lead, accent: null }
            : rolledColour,
      colourSource: implied ? 'implied' : userColour ? 'user' : material ? 'material' : 'roll',
      avoidColours: [],
      pattern,
      patternSource,
      patternAsTrim: !!userColour && patternSource === 'roll',
      silhouette: cuts[i],
      // Phase 8 fields: present only when there is something to carry, so a plan without them is unchanged.
      ...(s && s.costume ? { costume: s.costume } : {}),
      ...(s && s.style ? { style: s.style } : {}),
      ...(families[i] ? { garmentFamily: families[i]!.text } : {}),
      ...(fashion[i] ? { look: fashion[i]!.look.text, lookKey: fashion[i]!.look.key } : {}),
    });
  }
  // The mirror fix: a person we coloured must not wear what their partner ACTUALLY wears (rolled or asked for).
  if (!solo) {
    for (let i = 0; i < 2; i++) {
      const me = people[i];
      const partner = people[1 - i].colour;
      if (me.colourSource === 'roll' && partner) {
        me.avoidColours = [partner.lead, ...(partner.accent ? [partner.accent] : [])].filter(
          (name) => !(me.colour && (name === me.colour.lead || name === me.colour.accent))
        );
      }
    }
  }
  return { colourMode, cutMode, people };
}

// ── Writing the plan into the brief (phase 3) ───────────────────────────
//
// Everything below is text and checks for the character slot brief. It lives here, not in
// characterSlotPrompt.ts, so that file can import it without an import cycle.

export interface OutfitSide {
  role: string;
  /** 'LEFT' | 'RIGHT' for a couple, 'THE PERSON' solo. */
  label: string;
  gender: 'male' | 'female' | null;
}

const noun = (g: OutfitSide['gender']): string =>
  g === 'female' ? 'the woman' : g === 'male' ? 'the man' : 'this person';

/** How a pattern is worn: a print where the garment can carry one, a trim where it cannot (so a wetsuit or
 *  chef's whites never get a literal floral). */
const PATTERN_HOW =
  'as a print where the garment can carry one, otherwise as a trim or accent piece';

/** The thing being worn, for the colour line: the user's garment, else their costume. */
const wornNoun = (p: PersonOutfitPlan): string =>
  p.garment && !isGenericGarment(p.garment) ? 'garment' : p.costume ? 'costume' : 'garment';

function colourLine(p: PersonOutfitPlan, partnerLabel: string | null): string {
  if (p.colourSource === 'implied')
    return `Colour: the ${wornNoun(p)}'s own known colours. Do not recolour it.`;
  if (!p.colour) return '';
  if (p.colourSource === 'material') {
    return `Colour: the ${wornNoun(p)}'s own materials and tones, with ${p.colour.lead} as ONE accent piece (a cloak, a sash or a trim). Do not recolour the whole outfit.`;
  }
  if (p.colourSource === 'user') return `Colour: ${p.colour.lead}, exactly as asked.`;
  const avoid =
    p.avoidColours.length && partnerLabel
      ? ` NEVER wear ${p.avoidColours.join(' or ')} (${partnerLabel}'s colour${p.avoidColours.length > 1 ? 's' : ''}).`
      : '';
  return p.colour.accent
    ? `Colour: lead with ${p.colour.lead}, accent with ${p.colour.accent}.${avoid}`
    : `Colour: ${p.colour.lead} is their colour; build the outfit in it and its tones, with at most small neutral basics.${avoid}`;
}

function patternLine(p: PersonOutfitPlan): string {
  if (p.patternSource === 'user' && p.pattern) return `Pattern: "${p.pattern}", exactly as asked.`;
  if (p.pattern && p.patternAsTrim) return `Trim: ${p.pattern}, as a trim or accent only.`;
  if (p.pattern) return `Pattern: ${p.pattern}, ${PATTERN_HOW}.`;
  if (p.colourSource === 'implied' || p.colourSource === 'material') return '';
  return 'Pattern: none, solid colour.';
}

/** The gear escape hatch for a rolled garment family: the activity's real kit always wins. */
export const GARMENT_GEAR_WINS =
  'If the activity has its own clothing (hiking or sports kit, swimwear in the water, snow gear on the slopes, riding kit on a horse, a uniform, a ballgown at a ball), that wins and this line is ignored.';

/** One line per person for the WARDROBE section. `sides` is the cast in slot order (LEFT, RIGHT). */
export function renderOutfitPlanLines(plan: OutfitPlan, sides: readonly OutfitSide[]): string {
  const byRole = new Map(plan.people.map((p) => [p.role, p]));
  return sides
    .map((side, i) => {
      const p = byRole.get(side.role);
      if (!p) return '';
      const partner = sides.length === 2 ? sides[1 - i].label : null;
      const parts: string[] = [];
      const namedGarment = !!p.garment && !isGenericGarment(p.garment);
      if (p.costume) {
        parts.push(
          `dressed as the user asked: "${p.costume}". Name it in the outfit and build the real costume that character wears, in its own materials, and make it look great.`
        );
      }
      if (namedGarment) {
        parts.push(`wears the user's own request, "${p.garment}". Keep those words.`);
      }
      if (p.garmentFamily) parts.push(`Garment: ${p.garmentFamily}, layered for the weather.`);
      if (p.look) parts.push(`Look: ${p.look}.`);
      if (p.garmentFamily || p.look) parts.push(GARMENT_GEAR_WINS);
      if (p.style)
        parts.push(`Style: "${p.style}", exactly as asked; the cut and fit must show it.`);
      parts.push(colourLine(p, partner));
      // A garment the user named keeps its own shape: our silhouette turned "a pink bikini" into bikini-top-
      // and-shorts on a real render (2026-09-23). Colour and pattern are ours to add; the cut is theirs.
      // Phase 8: so does a costume ("a Celtic bowhuntress" came back as a rolled "fluid and draped" toga), and
      // so does a style that names the fit ("sleek", "revealing").
      // A rolled look carries its own shape (a fishtail hem, an empire waist), so no cut is rolled over it.
      const ownCut =
        namedGarment || !!p.costume || !!p.look || (!!p.style && FIT_WORDS.test(p.style));
      if (!ownCut) parts.push(`Silhouette: ${p.silhouette}.`);
      parts.push(patternLine(p));
      return `- ${side.label} (${noun(side.gender)}): ${parts.filter(Boolean).join(' ')}`;
    })
    .filter(Boolean)
    .join('\n');
}

/** One brief line for a fashion pick (nightly, phase 8): "- LEFT (the woman): Garment: a dress, layered for
 *  the weather. Look: boho: ...". Same words renderOutfitPlanLines uses for Create. */
export function renderFashionLine(side: OutfitSide, pick: FashionPick): string {
  const parts: string[] = [];
  if (pick.family) parts.push(`Garment: ${pick.family.text}, layered for the weather.`);
  parts.push(`Look: ${pick.look.text}.`);
  return `- ${side.label} (${noun(side.gender)}): ${parts.join(' ')}`;
}

/**
 * SLIM A ROLLED GARMENT (phase 8). Sonnet's women default is wide-leg / palazzo trousers, and it reached for them
 * even with a rolled "slim or straight-leg trousers" or "jumpsuit" family: 4 of 25 rolled nightly women in the
 * QA dry run. So on a person whose garment WE rolled, code slims them. Never run on a user's own garment (a
 * user garment turns the roll off, so there is nothing to call this on).
 */
export function slimWideLegs(text: string): { text: string; changed: boolean } {
  let changed = false;
  const hit =
    (to: string) =>
    (...m: string[]): string => {
      changed = true;
      return to.replace('$1', m[1] ?? '');
    };
  const out = text
    .replace(/\bpalazzo (trousers|pants|jumpsuit|suit)\b/gi, hit('slim $1'))
    .replace(/\bpalazzos?\b/gi, hit('slim trousers'))
    .replace(/\bculottes\b/gi, hit('slim trousers'))
    .replace(/\bflared (trousers|pants|jumpsuit)\b/gi, hit('slim $1'))
    .replace(/\b(?:extra[- ])?wide[- ]leg(?:ged)?\b/gi, hit('slim'))
    .replace(/\bslim(?:,)? slim\b/gi, 'slim');
  return { text: out, changed };
}

/** Log stamps for a plan rolled with the garment axis on (phase 8): the V2 cuts, and each woman's family. */
export function garmentRollStamps(plan: OutfitPlan): string[] {
  const out = ['outfit_cuts:v2'];
  for (const p of plan.people) {
    if (p.garmentFamily) {
      const f = WOMEN_GARMENT_FAMILIES.find((x) => x.text === p.garmentFamily);
      out.push(`outfit_garment:${p.role}:${f ? f.key : 'custom'}`);
    }
    if (p.lookKey) out.push(`outfit_look:${p.role}:${p.lookKey}`);
  }
  return out;
}

/** True when any person wears something the user asked for (the brief then lets that win over its own
 *  "never everyday basics" and traveler rules). */
export function planHasUserGarment(plan: OutfitPlan): boolean {
  return plan.people.some((p) => !!p.garment || !!p.costume);
}

// ── Checking Sonnet kept the user's words ────────────────────────────────

const GARMENT_EQUIV: readonly string[][] = [
  ['t-shirt', 'tshirt', 't shirt', 'tee'],
  ['tux', 'tuxedo'],
  ['jeans', 'denim'],
  ['sweater', 'jumper', 'knit', 'pullover'],
  ['hoodie', 'hooded'],
  ['trousers', 'pants', 'slacks'],
  ['sneaker', 'trainer'],
  ['swimsuit', 'swimwear', 'one-piece', 'bathing suit'],
  ['spacesuit', 'space suit', 'pressure suit'],
  ['dress', 'gown', 'frock'],
  ['shorts', 'trunks', 'boardshorts', 'board shorts'],
  ['armor', 'armour', 'armored', 'armoured'],
];
const PATTERN_EQUIV: readonly string[][] = [
  ['flower', 'floral', 'botanical', 'hibiscus', 'blossom'],
  ['stripe', 'striped', 'pinstripe'],
  ['check', 'checked', 'plaid', 'tartan', 'gingham'],
  ['polka', 'dot', 'spotted'],
  ['hawaiian', 'tropical', 'aloha'],
  ['leopard', 'animal print', 'cheetah'],
];
const BASIC_COLOUR = /^(red|pink|orange|yellow|green|blue|purple|brown|black|white|grey|gray)$/i;
const GENERIC_HEAD = /^(outfits?|clothes|clothing|costumes?|attire|looks?|gear|wear)$/i;
const FILLER = new Set([
  'the',
  'and',
  'with',
  'some',
  'very',
  'fancy',
  'sexy',
  'sleek',
  'looking',
  'cute',
  'nice',
]);

/** Singular stem: dresses → dress, boxes → box, hats → hat, jeans → jean; never "shoes" → "sho". */
const stem = (w: string): string => {
  const l = w.toLowerCase();
  if (/(ss|us|is)$/.test(l)) return l;
  if (/(sses|xes|ches|shes)$/.test(l)) return l.slice(0, -2);
  return l.replace(/s$/, '');
};
function mentions(text: string, word: string, equiv: readonly string[][]): boolean {
  const t = text.toLowerCase();
  const s = stem(word);
  if (s.length >= 3 && t.includes(s)) return true;
  const group = equiv.find((g) => g.some((x) => stem(x) === s || x === word.toLowerCase()));
  return !!group && group.some((x) => t.includes(stem(x)));
}
const contentWords = (phrase: string): string[] =>
  phrase.split(/[^A-Za-z0-9'-]+/).filter((w) => w.length >= 3 && !FILLER.has(w.toLowerCase()));

/** Head nouns of each garment in a request: "jeans and t-shirts" → [jeans, t-shirts]; "dresses with banners"
 *  → [dresses] (a "with" clause is a detail, not a garment). */
function garmentHeads(garment: string): string[][] {
  return garment
    .split(/\s*(?:,|\band\b|&|\bplus\b)\s*/i)
    .map((seg) => seg.split(/\bwith\b/i)[0].trim())
    .filter(Boolean)
    .map((seg) => {
      const words = contentWords(seg);
      if (!words.length) return [];
      const head = words[words.length - 1];
      // "Detroit lions cheerleading outfit": the head is generic, so any real word of it counts. A segment of
      // ONLY generic words ("clothes") names nothing checkable.
      if (!GENERIC_HEAD.test(head)) return [head];
      return words.slice(0, -1).filter((w) => !GENERIC_HEAD.test(w));
    })
    .filter((alts) => alts.length > 0);
}

/** A garment made only of generic words ("clothes", "an outfit") names nothing to keep or write in. */
export function isGenericGarment(garment: string | null): boolean {
  return !!garment && contentWords(garment).every((w) => GENERIC_HEAD.test(w));
}

/** What the user asked this person to wear that `wardrobe` dropped. Empty = kept. */
export function missingUserOutfit(wardrobe: string, p: PersonOutfitPlan): string[] {
  const missing: string[] = [];
  if (p.garment) {
    for (const alts of garmentHeads(p.garment)) {
      if (!alts.some((w) => mentions(wardrobe, w, GARMENT_EQUIV)))
        missing.push(`"${alts[alts.length - 1]}"`);
    }
  }
  if (p.colourSource === 'user' && p.colour) {
    const words = contentWords(p.colour.lead).filter((w) => colourFamiliesOf(w).length > 0);
    const worn = colourFamiliesOf(wardrobe);
    for (const w of words.length ? words : contentWords(p.colour.lead)) {
      const named = new RegExp(`\\b${w.replace(/[^a-z0-9-]/gi, '')}`, 'i').test(wardrobe);
      // A BASIC colour word is a family ("green" is honoured by emerald); a shade the user chose ("navy",
      // "emerald") must be named.
      const family = BASIC_COLOUR.test(w) ? colourFamiliesOf(w)[0] : null;
      if (!named && !(family && worn.includes(family))) missing.push(`"${w}"`);
    }
  }
  if (p.patternSource === 'user' && p.pattern) {
    const words = contentWords(p.pattern);
    if (words.length && !words.some((w) => mentions(wardrobe, w, PATTERN_EQUIV))) {
      missing.push(`"${words[words.length - 1]}"`);
    }
  }
  // Phase 8: a costume is kept when ANY of its real words is (Sonnet writes "huntress" for "bowhuntress",
  // "Celtic" for the whole phrase). Style is printed, never locked: "to the nines" is a look, not a word.
  if (p.costume) {
    const words = contentWords(p.costume).filter((w) => !GENERIC_HEAD.test(w));
    const hit = words.some(
      (w) =>
        mentions(wardrobe, w, GARMENT_EQUIV) ||
        (w.length > 6 && wardrobe.toLowerCase().includes(w.toLowerCase().slice(-6)))
    );
    if (words.length && !hit) missing.push(`"${words[words.length - 1]}"`);
  }
  return missing;
}

/** The user's request as a wardrobe string, for when Sonnet drops it twice: plain but exactly what they
 *  asked for (plus the planned trim). */
export function userOutfitPhrase(p: PersonOutfitPlan): string | null {
  const garmentWords = p.garment && !isGenericGarment(p.garment) ? p.garment : null;
  // Phase 8: a costume with no garment named is written in as the costume itself.
  const costumeWords = !garmentWords && p.costume ? `${p.costume} costume` : null;
  if (!garmentWords && !costumeWords && p.colourSource !== 'user' && p.patternSource !== 'user')
    return null;
  const colour = p.colourSource === 'user' && p.colour ? `${p.colour.lead} ` : '';
  const garment = garmentWords ?? costumeWords ?? 'outfit';
  const pattern =
    p.patternSource === 'user' && p.pattern
      ? /^with\b/i.test(p.pattern)
        ? ` ${p.pattern}`
        : ` in ${p.pattern}`
      : '';
  const trim = p.patternAsTrim && p.pattern ? `, with ${p.pattern} trim` : '';
  return `${colour}${garment}${pattern}${trim}`;
}

/** Words the user asked this person to wear: exempt from the plain-clothes ban on their wardrobe field
 *  ("jeans and t-shirts" is a request to honor, not a lapse to fix). */
export function userOutfitAllowlist(p: PersonOutfitPlan): string[] {
  return [p.garment, p.colourSource === 'user' && p.colour ? p.colour.lead : null, p.pattern]
    .filter((x): x is string => !!x)
    .map((x) => x.toLowerCase());
}

/** Is a plain-clothes word covered by something the user asked for? */
export function allowedByUser(word: string, allow: readonly string[]): boolean {
  return allow.some((phrase) => mentions(phrase, word, GARMENT_EQUIV));
}

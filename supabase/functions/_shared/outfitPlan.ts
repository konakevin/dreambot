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
}

const COLOUR_WORDS: ReadonlyArray<[ColourFamily, RegExp]> = [
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
  /** null when the garment's own colours are implied. */
  colour: OutfitColour | null;
  colourSource: 'roll' | 'user' | 'implied';
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
  const rolled: Array<OutfitColour | null> = roles.map(() => null);
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

  // ── silhouette ──
  const cutMode: OutfitPlan['cutMode'] = solo
    ? 'solo'
    : rng() < pct(cfg.separateCutPct)
      ? 'separate'
      : 'shared';
  const firstCut = pick(OUTFIT_SILHOUETTES, rng);
  const cuts =
    cutMode === 'separate'
      ? [firstCut, pickOther(OUTFIT_SILHOUETTES, firstCut, rng)]
      : [firstCut, firstCut];

  // ── pattern + the user's words ──
  const people: PersonOutfitPlan[] = [];
  let firstPattern: string | null = null;
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    const s = userSpec(role);
    const implied = !!s && s.colourImplied && !s.colour;
    const userColour = s && s.colour ? s.colour : null;

    let pattern: string | null = null;
    let patternSource: PersonOutfitPlan['patternSource'] = null;
    if (s && s.pattern) {
      pattern = s.pattern;
      patternSource = 'user';
    } else if (!implied && rng() < pct(cfg.patternPct)) {
      pattern = firstPattern
        ? pickOther(WARDROBE_PATTERNS, firstPattern, rng)
        : pick(WARDROBE_PATTERNS, rng);
      patternSource = 'roll';
    }
    if (pattern && firstPattern === null) firstPattern = pattern;

    people.push({
      role,
      garment: s && s.garment ? s.garment : null,
      colour: implied ? null : userColour ? { lead: userColour, accent: null } : rolled[i],
      colourSource: implied ? 'implied' : userColour ? 'user' : 'roll',
      avoidColours: [],
      pattern,
      patternSource,
      patternAsTrim: !!userColour && patternSource === 'roll',
      silhouette: cuts[i],
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

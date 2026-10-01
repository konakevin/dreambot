/**
 * COSTUME CARDS (Kevin 2026-09-30): a card whose theme IS its costume (the Wild West, a gladiator arena, a vampire
 * castle) dresses the cast from its own `biome_config.WARDROBE`, as imagined worlds always have.
 *
 * Real places keep the traveler rule and never see their WARDROBE: on a real culture the list holds national dress,
 * and dressing a cast in it made them read as that ethnicity (RACE_FIDELITY_PLAN.md, the "white +1 looks Chinese"
 * bug). That guard also stripped the costumes from cards that are a period or a genre rather than a culture, so their
 * casts wore the setting's generic looks (a utility jumpsuit in a frontier rail town). `biome_config.costume = true`
 * opts such a card in; it is never set on a culture card (China, Japan, India). It changes the wardrobe only: the
 * imagined-world medium ban and the outfit setting stay keyed to `imagined`.
 */

export interface WardrobeModeInput {
  /** biome_config.imagined, or one of the always-imagined biomes. */
  imagined: boolean;
  /** biome_config.costume as stored (only `true` counts). */
  costumeFlag: unknown;
  /** QA request flag force_costume: true / false overrides the card, null follows it. */
  forceCostume: boolean | null;
  /** The card has a non-empty WARDROBE pool. */
  hasWardrobe: boolean;
}

export interface WardrobeMode {
  /** Dress the cast from the card's WARDROBE (the on-location anchor) instead of the rolled outfit plan. */
  useLocationWardrobe: boolean;
  /** In-world attire: the traveler rule ("contemporary travel wear, never a culture's dress") is off. */
  inWorldAttire: boolean;
  /** This render took the costume path (a real-place card dressed from its own WARDROBE): stamp it. */
  costume: boolean;
}

export function locationWardrobeMode(i: WardrobeModeInput): WardrobeMode {
  const costume = !i.imagined && i.hasWardrobe && (i.forceCostume ?? i.costumeFlag === true);
  const inWorldAttire = i.imagined || costume;
  return { useLocationWardrobe: inWorldAttire && i.hasWardrobe, inWorldAttire, costume };
}

/**
 * GENDERED WARDROBES (Kevin 2026-10-01, CARD_WARDROBE_GENDER_PLAN.md): the shared WARDROBE lists were written "for
 * both genders" and leaned feminine, so a man drew "a floor-length translucent organza robe over a jeweled bodysuit"
 * and rendered in a sheer robe. A man draws from WARDROBE_MEN and a woman from WARDROBE_WOMEN, each falling back to
 * WARDROBE when the card has no list of its own; anyone else (a pet, an unknown gender) draws from WARDROBE.
 */
export interface GenderedWardrobeLists {
  WARDROBE?: unknown;
  WARDROBE_MEN?: unknown;
  WARDROBE_WOMEN?: unknown;
}
export type WardrobeGender = 'male' | 'female' | null;

function entries(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : [];
}

export function wardrobeListFor(cfg: GenderedWardrobeLists, gender: WardrobeGender): string[] {
  const shared = entries(cfg.WARDROBE);
  const own =
    gender === 'male'
      ? entries(cfg.WARDROBE_MEN)
      : gender === 'female'
        ? entries(cfg.WARDROBE_WOMEN)
        : [];
  return own.length ? own : shared;
}

/** One anchor per person, each from their own list; two people drawing from one list get different entries. */
export function pickWardrobeAnchors(
  cfg: GenderedWardrobeLists,
  genders: ReadonlyArray<WardrobeGender>,
  rng: () => number = Math.random
): Array<string | null> {
  const taken: string[] = [];
  return genders.map((g) => {
    const list = wardrobeListFor(cfg, g);
    if (!list.length) return null;
    const free = list.filter((x) => !taken.includes(x));
    const pool = free.length ? free : list;
    const pick = pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
    taken.push(pick);
    return pick;
  });
}

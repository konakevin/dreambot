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

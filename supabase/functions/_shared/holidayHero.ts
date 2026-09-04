// holidayHero.ts — pure math for the day-of HERO dream (HOLIDAY_DREAMS_PLAN.md §13,
// migration 457). NO I/O: everything is deterministic given its inputs so it is fully
// unit-testable (the loader lives in pools/holidayHeroLoader.ts).
//
// The hero is ONE curated recipe per (holiday, surface, register). Personalization comes
// from three sources, in order of how much they change the picture:
//   1. their face (+ their +1's) — the render's job;
//   2. the REGISTER (cozy vs eerie) from the Vibe Profile Cute↔Terrifying slider;
//   3. AXES: `{palette}` / `{flourish}` / `{role}` / `{time}` placeholders in the recipe,
//      each filled by a hash of (user, holiday, year) → stable per user, evenly spread
//      across users, different again next year. No two heroes read as clones.

export type HeroSurface = 'couple' | 'male' | 'female';
export type HeroRegister = 'cozy' | 'eerie' | 'default';

export interface HolidayHeroRow {
  holiday: string;
  surface: HeroSurface;
  register: HeroRegister;
  attire: string;
  scene: string;
  mediumKey?: string | null;
  mediumBan?: string | null;
  posePool?: string | null;
  /** axis name → candidate phrases. Empty = the recipe renders verbatim. */
  axes: Record<string, string[]>;
}

export interface FilledHero {
  attire: string;
  scene: string;
  /** axis → the phrase chosen for this user (for forensics / QA captions). */
  picks: Record<string, string>;
}

/**
 * 32-bit FNV-1a with a murmur3 finalizer. Plain FNV-1a's LOW bits are weakly mixed for
 * keys that differ only in a short suffix (`…:role` vs `…:time`), which made axis picks
 * CORRELATED (500 users landed on ~100 of 216 combos). The finalizer scrambles every bit
 * so `% n` for small n is effectively uniform + independent per axis.
 */
export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  // murmur3 fmix32
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

/** The per-user hero seed: same user + same holiday + same year → same hero. */
export function heroSeed(userId: string, holiday: string, year: number): string {
  return `${userId}:${holiday}:${year}`;
}

/**
 * Register from the Vibe Profile Cute↔Terrifying slider (0 = cute, 1 = terrifying;
 * onboarding default 0.3). Below the midpoint → cozy; at/above → eerie. Anything that
 * isn't a finite number (missing profile) → cozy, the warmer default.
 */
export function pickHeroRegister(cuteTerrifying: unknown): 'cozy' | 'eerie' {
  const v =
    typeof cuteTerrifying === 'number' && Number.isFinite(cuteTerrifying) ? cuteTerrifying : 0;
  return v >= 0.5 ? 'eerie' : 'cozy';
}

/** Couple when a dual swap is on the table; otherwise the solo surface by cast gender. */
export function heroSurface(
  isDual: boolean,
  gender: 'male' | 'female' | null | undefined
): HeroSurface {
  if (isDual) return 'couple';
  return gender === 'female' ? 'female' : 'male';
}

/**
 * The best row for a surface + register: exact match → the holiday's 'default'
 * register for that surface → any register for that surface → null (no hero authored;
 * the caller falls back to the everyday holiday pool, never a broken render).
 */
export function pickHeroRow(
  rows: HolidayHeroRow[],
  surface: HeroSurface,
  register: HeroRegister
): HolidayHeroRow | null {
  const forSurface = rows.filter((r) => r.surface === surface);
  return (
    forSurface.find((r) => r.register === register) ??
    forSurface.find((r) => r.register === 'default') ??
    forSurface[0] ??
    null
  );
}

/**
 * Fill every `{axis}` placeholder in attire + scene from the row's axes, one phrase per
 * axis chosen by hash(seed + axis). Placeholders with no axis (or an empty axis) are
 * removed cleanly so a typo never leaks braces into a prompt.
 */
export function fillHeroTemplate(row: HolidayHeroRow, seed: string): FilledHero {
  const picks: Record<string, string> = {};
  for (const axis of Object.keys(row.axes).sort()) {
    const values = (row.axes[axis] ?? []).filter((v) => typeof v === 'string' && v.trim());
    if (values.length === 0) continue;
    picks[axis] = values[fnv1a(`${seed}:${axis}`) % values.length];
  }
  const fill = (text: string) =>
    text
      .replace(/\{([a-z_]+)\}/gi, (_m, axis: string) => picks[axis] ?? '')
      .replace(/\s*,\s*,/g, ',') // ", ," left by an emptied placeholder
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([,.;])/g, '$1')
      .trim();
  return { attire: fill(row.attire), scene: fill(row.scene), picks };
}

/** Map a `holiday_hero_prompts` DB row (snake_case) to the hero shape. */
export function mapHeroRow(r: Record<string, unknown>): HolidayHeroRow {
  const rawAxes = r.axes;
  const axes: Record<string, string[]> = {};
  if (rawAxes && typeof rawAxes === 'object' && !Array.isArray(rawAxes)) {
    for (const [k, v] of Object.entries(rawAxes as Record<string, unknown>)) {
      if (Array.isArray(v)) axes[k] = v.filter((x): x is string => typeof x === 'string');
    }
  }
  return {
    holiday: r.holiday as string,
    surface: r.surface as HeroSurface,
    register: (r.register as HeroRegister) ?? 'default',
    attire: (r.attire as string) ?? '',
    scene: (r.scene as string) ?? '',
    mediumKey: (r.medium_key as string | null | undefined) ?? null,
    mediumBan: (r.medium_ban as string | null | undefined) ?? null,
    posePool: (r.pose_pool as string | null | undefined) ?? null,
    axes,
  };
}

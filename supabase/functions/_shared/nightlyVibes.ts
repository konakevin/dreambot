/**
 * nightlyVibes.ts — the VIBE roll of the nightly style contract (NIGHTLY_VIBES_AUDIT.md §9). Pure, injected rng.
 *
 * A vibe FAMILY is a base vibe (cozy, aurora…); its VERSIONS are rows with version_of = that key, each carrying the
 * same directive but a different accent route (mig 506: __subtle no fragment · __soft fragment after the scene ·
 * __bold fragment early · __wild the first bold draft). The roll is family-first (like looks): pick a family the
 * user has not had in the recency window, then a version within it. Never-empty floor: if fewer than two
 * families survive the recency filter, the whole pool is used.
 */
export type VibePosition = 'early' | 'after_scene';

export interface VibeRow {
  key: string;
  label: string;
  /** version_of ?? key */
  family: string;
  fragment: string | null;
  position: VibePosition | null;
  directive: string;
  faceSwapDirective: string | null;
  active: boolean;
  nightlyPool: boolean;
}

export interface ResolvedVibeChoice {
  vibe: VibeRow;
  family: string;
  /** '' for a base row, else the suffix after '__' (subtle / soft / bold / wild). */
  version: string;
  fragment: string | null;
  position: VibePosition | null;
  source: 'roll' | 'force';
  stamps: string[];
}

export function versionTag(key: string): string {
  const i = key.indexOf('__');
  return i >= 0 ? key.slice(i + 2) : '';
}

export function resolveVibe(input: {
  vibes: readonly VibeRow[];
  recentVibeKeys?: readonly string[];
  recencyWindow?: number;
  forcedVibe?: string | null;
  /** Vibe FAMILIES excluded for this render (the rolled look's banned vibes). A force still wins. */
  excludeFamilies?: readonly string[];
  /** Vibe VERSIONS (subtle / soft / bold / wild) excluded from the roll. A force still wins. */
  excludeVersions?: readonly string[];
  rng?: () => number;
}): ResolvedVibeChoice | null {
  const rng = input.rng ?? Math.random;
  const stamps: string[] = [];
  const active = input.vibes.filter((v) => v.active);
  const familyOf = new Map(active.map((v) => [v.key, v.family]));

  const finish = (vibe: VibeRow, source: 'roll' | 'force'): ResolvedVibeChoice => {
    const version = versionTag(vibe.key);
    stamps.push(`vibe:${vibe.key}`, `vibe_family:${vibe.family}`, `vibe_source:${source}`);
    if (version) stamps.push(`vibe_version:${version}`);
    // A fragment with no position defaults to early (the proven route); no fragment = the mood-only route.
    const position: VibePosition | null = vibe.fragment ? (vibe.position ?? 'early') : null;
    return {
      vibe,
      family: vibe.family,
      version,
      fragment: vibe.fragment,
      position,
      source,
      stamps,
    };
  };

  if (input.forcedVibe) {
    const forced = active.find((v) => v.key === input.forcedVibe);
    if (forced) return finish(forced, 'force');
    stamps.push(`vibe_force_unknown:${input.forcedVibe}`);
  }

  const banned = new Set(input.excludeFamilies ?? []);
  const bannedVersions = new Set(input.excludeVersions ?? []);
  const pool = active.filter(
    (v) => v.nightlyPool && !banned.has(v.family) && !bannedVersions.has(versionTag(v.key))
  );
  if (banned.size > 0) stamps.push(`vibe_bans:${[...banned].join('+')}`);
  if (bannedVersions.size > 0) stamps.push(`vibe_version_bans:${[...bannedVersions].join('+')}`);
  if (pool.length === 0) {
    stamps.push('vibe_pool_empty');
    return null;
  }
  const families = [...new Set(pool.map((v) => v.family))];
  const window = Math.max(0, input.recencyWindow ?? 7);
  const recentFamilies = new Set(
    (input.recentVibeKeys ?? []).slice(0, window).map((k) => familyOf.get(k) ?? k.split('__')[0])
  );
  let candidates = families.filter((f) => !recentFamilies.has(f));
  if (candidates.length < 2) candidates = families;
  const family = candidates[Math.floor(rng() * candidates.length)];
  const versions = pool.filter((v) => v.family === family);
  const vibe = versions[Math.floor(rng() * versions.length)];
  stamps.push(`vibe_pool:${pool.length}/${families.length}`);
  return finish(vibe, 'roll');
}

/** Round 2 of the parity loop (2026-09-12): kawaii__subtle turned a grok soft-brush couple into bobblehead
 *  caricatures. Kawaii is a chibi register by definition — kept for solos, never rolled for a couple
 *  (nightlyStyle.ts passes it as an excluded family for the couple surface). */
export const COUPLE_EXCLUDED_VIBE_FAMILIES: readonly string[] = ['kawaii'];

/** Round 20 of the parity loop (staged 2026-09-13, OFF until its round): Kevin's strikes by vibe VERSION — subtle
 *  6✗/73 (8%) vs soft 3/75 (4%) and bold 1/67 (1.5%). A subtle version carries NO flux fragment (mig 506), so the
 *  render gets no light instruction and reads plain. Excluded from the looks-path roll; a force still reaches it. */
/** Flux-1.1-pro COUPLE guard (parity drill arms F-I, 2026-09-13): a low-light vibe renders both faces small and
 *  under-exposed, so the dual detector cannot split them — night vibes passed the first dual swap 1/10 (10%) on
 *  flux couples vs 16/28 (57%) for brighter ones, while the SAME vibes swap 7/7 on flux SOLOS and 40/40 on
 *  gemini / grok couples. So the ban is per (model x surface), not a vibe retirement: these families still roll on
 *  every solo, every scene, and on gemini / grok couples. Watchlist (one failure or untested, kept in the pool):
 *  macabre, noir, ominous, fog, candlelit. */
export const FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES: readonly string[] = [
  'moonlit',
  'starlit',
  'nightshade',
  'stormlight',
  'dark',
];

export const LOOKS_EXCLUDED_VIBE_VERSIONS: readonly string[] = ['subtle'];

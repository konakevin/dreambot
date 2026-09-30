/**
 * pickerSections.ts — the location picker's TILES (SCENARIO_LOCATION_SCOPE.md, mig 592).
 *
 * Tiles live in the database (`picker_tiles`); a card joins a tile through `location_cards.picker_tile`, so a new
 * tile ships with no app release. If the tile table can't be read (offline, a failed query, an empty table) the
 * picker falls back to FALLBACK_SECTIONS, the 12 tiles this app used to hard-code, grouped by `picker_category`.
 * Pure; locked by __tests__/lib/pickerSections.test.ts.
 */

export type LocationTier = 'real' | 'imagined';

export interface PickerTileRow {
  key: string;
  title: string;
  description: string;
  icon: string;
  tier: string;
  sort_order: number;
  admin_only: boolean;
}

export interface PickerCardRow {
  name: string;
  display_name: string | null;
  picker_category: string | null;
  picker_tile?: string | null;
  admin_only: boolean | null;
}

export interface PickerItem {
  key: string;
  label: string;
  adminOnly?: boolean;
}

export interface PickerSection {
  id: string;
  title: string;
  /** An Ionicons name; the screen swaps an unknown one for a pin. */
  icon: string;
  description: string;
  tier: LocationTier;
  items: PickerItem[];
}

interface FallbackSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  tier: LocationTier;
  /** picker_category values this tile gathers. */
  categories: string[];
}

/** The 12 tiles as hard-coded before mig 592 (2026-08-25 fold of 12 categories; see LOCATION_REORG_PLAN.md). */
export const FALLBACK_SECTIONS: readonly FallbackSection[] = [
  {
    id: 'around_the_world',
    title: 'World Traveler',
    icon: 'earth-outline',
    description: 'Cities, countries, coasts, and the world’s great wonders',
    tier: 'real',
    categories: ['iconic_cities', 'countries_cultures', 'landmarks_wonders', 'coastal_escapes'],
  },
  {
    id: 'tropical_escapes',
    title: 'Tropical Escapes',
    icon: 'sunny-outline',
    description: 'Turquoise lagoons and island paradise',
    tier: 'real',
    categories: ['tropical'],
  },
  {
    id: 'beach_towns',
    title: 'Beach Towns',
    icon: 'umbrella-outline',
    description: 'Boardwalks, beach houses, and sunset shores',
    tier: 'real',
    categories: ['beach_towns'],
  },
  {
    id: 'nature',
    title: 'Nature & Wild',
    icon: 'leaf-outline',
    description: 'Mountains, canyons, and wild landscapes',
    tier: 'real',
    categories: ['epic_nature'],
  },
  {
    id: 'through_time',
    title: 'Through Time',
    icon: 'hourglass-outline',
    description: 'Ancient empires and bygone eras',
    tier: 'real',
    categories: ['through_time'],
  },
  {
    id: 'high_life',
    title: 'Jet Set',
    icon: 'diamond-outline',
    description: 'Superyachts, penthouses, red carpets, and champagne',
    tier: 'real',
    categories: ['high_life'],
  },
  {
    id: 'fantasy',
    title: 'Fantasy',
    icon: 'sparkles-outline',
    description: 'Elven cities, dragon keeps, and candlelit castles',
    tier: 'imagined',
    categories: ['high_fantasy'],
  },
  {
    id: 'gothic',
    title: 'Gothic & Haunted',
    icon: 'moon-outline',
    description: 'Vampire castles, foggy graveyards, haunted halls',
    tier: 'imagined',
    categories: ['gothic_haunted'],
  },
  {
    id: 'whimsical',
    title: 'Whimsical',
    icon: 'flower-outline',
    description: 'Fairy-tale castles, candy lands, and sweet escapes',
    tier: 'imagined',
    categories: ['whimsical_fun'],
  },
  {
    id: 'scifi',
    title: 'Sci-Fi & Space',
    icon: 'planet-outline',
    description: 'Neon megacities, alien worlds, and the stars',
    tier: 'imagined',
    categories: ['scifi_space'],
  },
  {
    id: 'wild_west',
    title: 'Wild West',
    icon: 'flame-outline',
    description: 'Frontier towns, saloons, and desert standoffs',
    tier: 'imagined',
    categories: ['wild_west'],
  },
  {
    id: 'heroes',
    title: 'Action & Adventure',
    icon: 'flash-outline',
    description: 'Superheroes, spies, summits, and stadium glory',
    tier: 'imagined',
    categories: ['heroes_adventure'],
  },
];

const toItem = (c: PickerCardRow): PickerItem => ({
  key: c.name,
  label: c.display_name ?? c.name,
  adminOnly: !!c.admin_only,
});

/**
 * The picker's tiles, in order, each with its cards (in the order given, i.e. picker_sort_order). A tile with no
 * visible cards is dropped. `cards` must already exclude admin-only cards for non-admins (the query does that);
 * admin-only TILES are dropped here for non-admins. Database tiles win when there are any; else the fallback.
 */
export function buildPickerSections(
  cards: readonly PickerCardRow[],
  tiles: readonly PickerTileRow[] | null,
  isAdmin: boolean
): PickerSection[] {
  const visibleTiles = (tiles ?? []).filter((t) => isAdmin || !t.admin_only);
  if (visibleTiles.length > 0) {
    return [...visibleTiles]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((t) => ({
        id: t.key,
        title: t.title,
        icon: t.icon,
        description: t.description,
        tier: t.tier === 'imagined' ? ('imagined' as const) : ('real' as const),
        items: cards.filter((c) => c.picker_tile === t.key).map(toItem),
      }))
      .filter((s) => s.items.length > 0);
  }
  return FALLBACK_SECTIONS.map((m) => ({
    id: m.id,
    title: m.title,
    icon: m.icon,
    description: m.description,
    tier: m.tier,
    items: m.categories.flatMap((cat) =>
      cards.filter((c) => c.picker_category === cat).map(toItem)
    ),
  })).filter((s) => s.items.length > 0);
}

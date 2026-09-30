// Locks the location picker's tiles (mig 592): DB tiles group cards by picker_tile, admin-only tiles stay hidden from
// everyone else, and a missing tile table falls back to the 12 tiles the app used to hard-code.
import {
  buildPickerSections,
  FALLBACK_SECTIONS,
  type PickerCardRow,
  type PickerTileRow,
} from '@/lib/pickerSections';

const card = (
  name: string,
  picker_category: string,
  picker_tile: string | null,
  display_name: string | null = null
): PickerCardRow => ({ name, display_name, picker_category, picker_tile, admin_only: false });

const CARDS: PickerCardRow[] = [
  card('paris', 'iconic_cities', 'europe', 'Paris'),
  card('tokyo', 'iconic_cities', 'asia_pacific', 'Tokyo'),
  card('japan', 'countries_cultures', 'asia_pacific'),
  card('ancient wonders', 'landmarks_wonders', null, 'World Wonders'),
  card('hawaii', 'tropical', 'tropical_escapes', 'Hawaii'),
];

const tile = (
  key: string,
  sort_order: number,
  admin_only = false,
  tier = 'real'
): PickerTileRow => ({
  key,
  title: key,
  description: `${key} tile`,
  icon: 'earth-outline',
  tier,
  sort_order,
  admin_only,
});

describe('buildPickerSections', () => {
  const TILES = [
    tile('asia_pacific', 20),
    tile('europe', 10),
    tile('tropical_escapes', 50),
    tile('just_for_fun', 235, true, 'imagined'),
  ];

  it('groups cards by picker_tile, in tile order, and drops tiles with no cards', () => {
    const s = buildPickerSections(CARDS, TILES, false);
    expect(s.map((x) => x.id)).toEqual(['europe', 'asia_pacific', 'tropical_escapes']);
    expect(s[1].items.map((i) => i.key)).toEqual(['tokyo', 'japan']);
    expect(s[0].items[0]).toEqual({ key: 'paris', label: 'Paris', adminOnly: false });
  });

  it('a card with no tile is not in the picker (World Wonders, replaced by regional cards)', () => {
    const keys = buildPickerSections(CARDS, TILES, false).flatMap((x) => x.items.map((i) => i.key));
    expect(keys).not.toContain('ancient wonders');
  });

  it('admin-only tiles show for admins only', () => {
    const cards = [...CARDS, card('everyday chaos', 'just_for_fun', 'just_for_fun')];
    expect(buildPickerSections(cards, TILES, false).map((x) => x.id)).not.toContain('just_for_fun');
    const admin = buildPickerSections(cards, TILES, true);
    expect(admin.map((x) => x.id)).toContain('just_for_fun');
    expect(admin.find((x) => x.id === 'just_for_fun')?.tier).toBe('imagined');
  });

  it('falls back to the built-in tiles, by picker_category, when the tile table is missing or empty', () => {
    for (const tiles of [null, []]) {
      const s = buildPickerSections(CARDS, tiles, false);
      const world = s.find((x) => x.id === 'around_the_world');
      expect(world?.items.map((i) => i.key)).toEqual([
        'paris',
        'tokyo',
        'japan',
        'ancient wonders',
      ]);
      expect(s.map((x) => x.id)).toEqual(['around_the_world', 'tropical_escapes']);
    }
    expect(FALLBACK_SECTIONS).toHaveLength(12);
  });
});

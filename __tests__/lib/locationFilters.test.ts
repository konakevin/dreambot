/** Location safety net (locationFilters.ts) — 2026-09-13: the imagined-world picker cards must NOT be banned. */
import {
  isBannedLocationName,
  isBannedLocationBiome,
  BANNED_LOCATION_BIOMES,
} from '@engine/locationFilters';

const PICKER_WORLDS = [
  'sci-fi worlds',
  'high fantasy',
  'fairy cottage',
  'princess garden castle',
  'ancient elven city',
  'floating sky islands',
  'dragons keep',
  'rose garden palace',
  'cloud kingdom',
  'crystal caverns',
  'dwarven fortress',
  'enchanted forest',
  'wizard academy',
  'mermaid lagoon',
  'underwater city atlantis',
  'cyberpunk megacity',
  'mars colony',
  'space station',
  'alien planet',
];

describe('location safety net', () => {
  it('every imagined-world picker card is allowed by name', () => {
    for (const n of PICKER_WORLDS) expect(isBannedLocationName(n)).toBe(false);
  });
  it('free-text / trademark junk stays banned', () => {
    for (const n of ['hogwarts', 'disneyland', 'sea world', 'paris cafe', 'gothic realm']) {
      expect(isBannedLocationName(n)).toBe(true);
    }
  });
  it('no live picker biome is refused at card resolution', () => {
    expect(BANNED_LOCATION_BIOMES.size).toBe(0);
    for (const b of ['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater', 'scifi_space']) {
      expect(isBannedLocationBiome(b)).toBe(false);
    }
  });
});

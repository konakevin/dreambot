/**
 * SCENE SETTING (CREATE_OUTFIT_PLAN.md phase 9) — the words and location data a render already has, classified
 * into the kind of place the outfit has to fit. The table cases include michele's feed that exposed the bug
 * (2026-09-28): a beach, a golf tournament, Chinatown, a movie theater.
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  SETTINGS,
  SETTING_DRESS,
  parseOutfitMix,
  resolveNightlySetting,
  rollOutfitMix,
  settingFromCategory,
  settingFromLocation,
  settingFromPlaceName,
  settingFromText,
  type Setting,
} from '@engine/sceneSetting';
import { PLAIN_CLOTHES } from '@engine/characterSlotPrompt';

describe('settingFromText', () => {
  it.each([
    // michele's feed
    ['Nicole and I are in San Francisco Shopping in China Town!', 'city'],
    ['Brittany and I are at the movie Theater.', 'indoor'],
    ['Tiffany and I are at a golf Tournament in Carmel Ca', 'sport'],
    ['Stephanie and I are on the Beach in Hawaii watching Whales', 'beach'],
    ['At the Beach!', 'beach'],
    // the rest of the vocabulary
    ['Show me and Steph snowboarding', 'snow'],
    ['me and my wife at a fancy restaurant for our anniversary', 'evening'],
    ['hiking in Yosemite at sunrise', 'outdoors'],
    ['riding a dragon over the clouds', 'fantasy'],
    ['me and mom drinking margaritas on a Mexican beach', 'beach'],
    ['Myrtle Beach boardwalk at night', 'beach'],
    ['at the Kentucky Derby in big hats', 'evening'],
    ['show us playing dueling pianos', 'indoor'],
    ['a rooftop bar in NYC', 'evening'],
    ['walking through Times Square', 'city'],
    ['exploring a cave with a flashlight', 'outdoors'],
    ['at the opera in Vienna', 'evening'],
    ['at a museum', 'indoor'],
    ['a cozy alpine chalet', 'snow'],
    ['a run down the ski slopes', 'snow'],
    ['snowy slopes above the village', 'snow'],
  ])('%s → %s', (text, setting) => {
    expect(settingFromText(text)).toBe(setting);
  });

  it('a movie theater is indoor, a theater is an evening out', () => {
    expect(settingFromText('at the movie theater')).toBe('indoor');
    expect(settingFromText('a night at the theatre')).toBe('evening');
  });

  it('the strongest dress code wins: snow and sport beat the place they are in', () => {
    expect(settingFromText('skiing in the mountains then a restaurant')).toBe('snow');
    expect(settingFromText('golf on a beach course in Maui')).toBe('sport');
  });

  it('no place words, or nothing at all, is unknown', () => {
    expect(settingFromText('me and my wife dancing')).toBe('unknown');
    expect(settingFromText('', null, undefined)).toBe('unknown');
  });

  it('adjectives do not decide the setting ("a magical evening", "tropical colours")', () => {
    expect(settingFromText('a magical evening together')).toBe('unknown');
  });
});

describe('settingFromLocation (nightly)', () => {
  it.each([
    [{ biome: 'tropical_coastal' }, 'beach'],
    [{ biome: 'urban_city' }, 'city'],
    [{ biome: 'luxury' }, 'evening'],
    [{ biome: 'interior_intimate' }, 'indoor'],
    [{ biome: 'alpine_snow' }, 'snow'],
    [{ biome: 'temperate_forest' }, 'outdoors'],
    [{ biome: 'wild_west' }, 'outdoors'],
    [{ biome: 'scifi_cosmic' }, 'fantasy'],
    [{ biome: 'romantic_countryside' }, 'romantic'],
  ])('%o → %s', (loc, setting) => {
    expect(settingFromLocation(loc)).toBe(setting);
  });

  it('an imagined place is fantasy whatever its biome', () => {
    expect(settingFromLocation({ biome: 'tropical_coastal', imagined: true })).toBe('fantasy');
  });

  it('an unmapped biome falls back to the tags (prefixes ignored), then unknown', () => {
    expect(settingFromLocation({ biome: 'nope', tags: ['biome:coastal', 'mood:cozy'] })).toBe(
      'beach'
    );
    expect(settingFromLocation({ biome: null, tags: ['urban'] })).toBe('city');
    expect(settingFromLocation({ biome: null, tags: [] })).toBe('unknown');
  });
});

describe('settingFromPlaceName (nightly: the landmark says snow or beach)', () => {
  it.each([
    ['1950s americana', 'Miami Beach Ocean Drive Art Deco hotel row', 'beach'],
    ['1950s americana', 'Cannon Beach Haystack Rock at low tide', 'beach'],
    ['new york city', 'Ellis Island ferry dock', null],
    ['new york city', 'Coney Island boardwalk', 'beach'],
    ['aspen', 'a ski lodge at dusk', 'snow'],
    ['paris', 'the Eiffel Tower lawn', null],
    ['1950s americana', 'Zion Canyon Narrows red sandstone walls Utah', 'outdoors'],
    ['1950s americana', 'Carlsbad Caverns Natural Entrance mouth New Mexico', 'outdoors'],
    ['1950s americana', 'Santa Fe Plaza central square New Mexico', null],
    ['1950s americana', 'Multnomah Falls twin-tiered basalt cascade Oregon', 'outdoors'],
    // Phase 2 (2026-09-30): a tropical card's jungle landmark dressed a man in poolside swim shorts.
    ['yucatan', 'Cobá Nohoch Mul pyramid rising above jungle canopy', 'outdoors'],
    ['malibu', 'Malibu Creek gorge basalt columns and swimming hole', 'outdoors'],
    ['kauai', 'Waimea Canyon red ridges', 'outdoors'],
    ['kauai', 'Kalalau Valley from lookout', 'outdoors'],
    ['maui', 'Kaanapali Beach at sunset', 'beach'],
    // A bare "slopes" is not snow (2026-09-30: a Hvar lavender spot dressed a dreamer in a 1970s ski jacket).
    [
      'lavender fields',
      'Hvar town fortress, lavender-covered slopes and ancient stone ramparts',
      null,
    ],
    ['bali', 'Pura Besakih mother temple complex ascending Mount Agung slopes', null],
    ['tokyo', 'Roppongi Sakurazaka cherry tree slope', null],
  ])('%s + %s → %s', (place, anchor, setting) => {
    expect(settingFromPlaceName(place, anchor)).toBe(setting);
  });
});

describe('settingFromCategory (nightly scenario rows)', () => {
  it('categories that fix the place', () => {
    expect(settingFromCategory('water_bliss')).toBe('beach');
    expect(settingFromCategory('winter_wonder')).toBe('snow');
    expect(settingFromCategory('sports_glory')).toBe('sport');
    expect(settingFromCategory('gatsby_party')).toBe('evening');
  });
  it('the rest read the row text instead', () => {
    expect(settingFromCategory('animal_mayhem')).toBeNull();
    expect(settingFromCategory(null)).toBeNull();
  });
});

describe('SETTING_DRESS', () => {
  const OCCLUDER = /\b(sunglasses|masks?|helmets?|goggles|visors?|veils?|hoods?)\b/i;
  it('every setting but unknown says what people wear there', () => {
    for (const s of SETTINGS) {
      if (s === 'unknown') expect(SETTING_DRESS[s]).toBeNull();
      else expect(SETTING_DRESS[s]).toMatch(/\b(wear|dress up)\b/);
    }
  });
  it('never suggests a hat (a brim shades the face the swap needs)', () => {
    for (const s of SETTINGS)
      expect(SETTING_DRESS[s] ?? '').not.toMatch(/\b(hats?|caps?|brims?|panama|fedora)\b/i);
  });

  it('never a plain-clothes word or a face occluder (the line must not trip the validator)', () => {
    for (const s of SETTINGS) {
      const line = SETTING_DRESS[s] ?? '';
      expect(line).not.toMatch(PLAIN_CLOTHES);
      expect(line).not.toMatch(OCCLUDER);
    }
  });
});

describe('new place words (phase 2): Halloween / Fall rows stop falling to unknown', () => {
  it.each([
    ['Brick firehouse garage, converted hearse parked inside', 'indoor'],
    ['Grand monster hotel lobby with coffin luggage carts', 'indoor'],
    ['Cul-de-sac blanketed in fog, abandoned bicycles near glowing jack-o-lanterns', 'city'],
    ['Porch steps crowded with carved pumpkins', 'city'],
    ['A corn maze at dusk with hay bales', 'outdoors'],
    ['Moonlit graveyard with leaning headstones', 'outdoors'],
  ])('%s → %s', (text, setting) => {
    expect(settingFromText(text)).toBe(setting);
  });

  it('the stronger dress codes still win (priority order unchanged)', () => {
    expect(settingFromText('a beach hotel lobby')).toBe('beach');
    expect(settingFromText('a ski chalet hallway')).toBe('snow');
    expect(settingFromText('a gala in the hotel ballroom')).toBe('evening');
  });
});

describe('card outfit mix (mig 611, CARD_OUTFIT_MIX_PLAN.md)', () => {
  const seeded = (seed: number) => {
    let t = seed >>> 0;
    return () => {
      t = (t + 0x6d2b79f5) >>> 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  };
  const never = () => {
    throw new Error('rng used without a mix');
  };

  it('parseOutfitMix keeps real settings with positive weights and drops the rest', () => {
    expect(parseOutfitMix({ beach: 50, romantic: 50 })).toEqual({ beach: 50, romantic: 50 });
    expect(
      parseOutfitMix({ beach: 50, beech: 50, unknown: 10, snow: 0, city: -5, evening: 'x' })
    ).toEqual({ beach: 50 });
    for (const bad of [null, undefined, [], 'beach', 42, {}, { nope: 1 }, { beach: Number.NaN }]) {
      expect(parseOutfitMix(bad)).toBeNull();
    }
  });

  it('rollOutfitMix delivers the configured split', () => {
    const rng = seeded(7);
    const n = 20000;
    const counts: Record<string, number> = {};
    for (let i = 0; i < n; i++) {
      const s = rollOutfitMix({ snow: 60, evening: 40 }, rng);
      counts[s] = (counts[s] ?? 0) + 1;
    }
    expect(counts.snow / n).toBeCloseTo(0.6, 1);
    expect(counts.evening / n).toBeCloseTo(0.4, 1);
    expect(Object.keys(counts).sort()).toEqual(['evening', 'snow']);
  });

  it('without a mix the resolver is exactly the old inline rule, and never rolls', () => {
    const old = (
      fromRow: Setting | null,
      name: 'snow' | 'beach' | 'outdoors' | null,
      loc: Setting
    ) => {
      const byName =
        name === 'outdoors'
          ? loc === 'city' || loc === 'beach' || loc === 'unknown'
            ? 'outdoors'
            : null
          : name;
      return {
        setting: fromRow ?? byName ?? loc,
        source: fromRow ? 'row' : byName ? 'place_name' : 'location',
      };
    };
    for (const fromRow of [null, 'evening', 'beach'] as (Setting | null)[]) {
      for (const name of [null, 'snow', 'beach', 'outdoors'] as const) {
        for (const loc of SETTINGS) {
          const r = resolveNightlySetting({
            fromRow,
            nameSetting: fromRow ? null : name,
            nameText: 'a snowy ski run by the beach',
            locSetting: loc,
            mix: null,
            rng: never,
          });
          const o = old(fromRow, fromRow ? null : name, loc);
          expect({ setting: r.setting, source: r.source }).toEqual(o);
          expect(r.rolled).toBeNull();
          expect(r.cold).toBe(false);
        }
      }
    }
  });

  const SANTORINI = { beach: 50, romantic: 50 };
  const WINTER = { snow: 60, evening: 40 };
  const resolve = (
    mix: Record<string, number>,
    forcePick: 'beach' | 'romantic' | 'snow' | 'evening' | 'city',
    anchor: string,
    locSetting: Setting = 'beach'
  ) =>
    resolveNightlySetting({
      fromRow: null,
      nameSetting: settingFromPlaceName('card', anchor),
      nameText: `card ${anchor}`,
      locSetting,
      mix: parseOutfitMix(mix),
      forcePick,
      rng: seeded(1),
    });

  it('a romantic roll stays romantic at a viewpoint; a beach roll there goes outdoors, as before', () => {
    expect(resolve(SANTORINI, 'romantic', 'Oia caldera lookout at sunset')).toMatchObject({
      setting: 'romantic',
      source: 'card_mix',
      rolled: 'romantic',
    });
    expect(resolve(SANTORINI, 'beach', 'Oia caldera lookout at sunset')).toMatchObject({
      setting: 'outdoors',
      source: 'place_name',
      rolled: 'beach',
    });
  });

  it('a spot that names the beach is beachwear whatever the roll', () => {
    expect(resolve(SANTORINI, 'romantic', 'Perissa black-sand beach')).toMatchObject({
      setting: 'beach',
      source: 'place_name',
    });
  });

  it('formal snowy: scenery snow words keep the formal side and dress it cold; ski words force the gear', () => {
    const formal = resolve(WINTER, 'evening', 'snowy village square with ice lanterns', 'snow');
    expect(formal).toMatchObject({ setting: 'evening', source: 'card_mix', cold: true });
    const ski = resolve(WINTER, 'evening', 'ski slopes above the village', 'snow');
    expect(ski).toMatchObject({ setting: 'snow', source: 'place_name', cold: false });
    expect(resolve(WINTER, 'snow', 'snowy village square', 'snow')).toMatchObject({
      setting: 'snow',
      cold: false,
    });
  });

  it('a card without snow in its mix keeps the old snow-word rule, and a row always wins', () => {
    expect(resolve(SANTORINI, 'romantic', 'a snowy mountain chapel')).toMatchObject({
      setting: 'snow',
      source: 'place_name',
    });
    const row = resolveNightlySetting({
      fromRow: 'evening',
      nameSetting: null,
      nameText: '',
      locSetting: 'beach',
      mix: parseOutfitMix(SANTORINI),
      rng: never,
    });
    expect(row).toEqual({ setting: 'evening', source: 'row', rolled: null, cold: false });
  });

  it("migration 611's mixes are all real settings (a typo would be dropped silently at runtime)", () => {
    const sql = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'migrations', '611_card_outfit_mix.sql'),
      'utf8'
    );
    const mixes = [...sql.matchAll(/\('[^']+',\s*'(\{[^']+\})'\)/g)].map((m) => JSON.parse(m[1]));
    expect(mixes).toHaveLength(11);
    for (const m of mixes) expect(parseOutfitMix(m)).toEqual(m);
  });

  it('nightly-dreams loads the mix with the picker cards and lets the resolver decide', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
      'utf8'
    );
    expect(src).toMatch(/content_kind, couples_ok, outfit_mix'\)/);
    expect(src).toMatch(/resolveNightlySetting\(\{/);
    expect(src).toMatch(/outfit_mix:\$\{resolvedSetting\.rolled\}/);
    expect(src).toMatch(/COLD_HOLIDAYS\.has\(holidayCategory\)\) \|\| mixCold/);
  });
});

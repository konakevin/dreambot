/**
 * SCENE SETTING (CREATE_OUTFIT_PLAN.md phase 9) — the words and location data a render already has, classified
 * into the kind of place the outfit has to fit. The table cases include michele's feed that exposed the bug
 * (2026-09-28): a beach, a golf tournament, Chinatown, a movie theater.
 */
import {
  SETTINGS,
  SETTING_DRESS,
  settingFromCategory,
  settingFromLocation,
  settingFromPlaceName,
  settingFromText,
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
    ['maui', 'Kaanapali Beach at sunset', 'beach'],
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

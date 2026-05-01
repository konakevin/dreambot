import { routeArchetype, resolveObjectForCell } from '@/lib/archetypeRouter';
import type { ResolvedLocationCard, ResolvedObjectCard } from '@/lib/archetypeRouter';
import type { VibeProfile, DreamCastMember } from '@/types/vibeProfile';
import type { ArchetypeRoll, ObjectClass } from '@/types/firstDream';

function makeProfile(cast: DreamCastMember[] = []): VibeProfile {
  return {
    version: 2,
    aesthetics: ['dreamy', 'cozy', 'whimsical'],
    art_styles: ['canvas', 'watercolor'],
    moods: {
      peaceful_chaotic: 0.5,
      cute_terrifying: 0.5,
      minimal_maximal: 0.5,
      realistic_surreal: 0.5,
    },
    dream_seeds: { characters: [], places: [], things: [] },
    dream_cast: cast,
    avoid: [],
  };
}

const SELF: DreamCastMember = {
  role: 'self',
  thumb_url: 'http://example.com/self.jpg',
  description: 'A man with sandy hair',
};
const PLUS_ONE: DreamCastMember = {
  role: 'plus_one',
  thumb_url: 'http://example.com/plus.jpg',
  description: 'A woman with dark hair',
};
const PET: DreamCastMember = {
  role: 'pet',
  thumb_url: 'http://example.com/pet.jpg',
  description: 'A small white dog',
};
const NYC: ResolvedLocationCard = { name: 'new york city', location_class: 'urban' };
const HAWAII: ResolvedLocationCard = { name: 'hawaii', location_class: 'coastal' };
const FOREST: ResolvedLocationCard = { name: 'enchanted forest', location_class: 'forest' };

describe('routeArchetype — persona', () => {
  it('routes to couple when self + plus_one both exist', () => {
    const roll = routeArchetype({
      profile: makeProfile([SELF, PLUS_ONE]),
      selectedLocations: [NYC],
      selectedObjects: [],
    });
    expect(roll.persona).toBe('couple');
    expect(roll.castRoles).toEqual(['self', 'plus_one']);
  });

  it('routes to portrait when only self exists', () => {
    const roll = routeArchetype({
      profile: makeProfile([SELF]),
      selectedLocations: [NYC],
      selectedObjects: [],
    });
    expect(roll.persona).toBe('portrait');
    expect(roll.castRoles).toEqual(['self']);
  });

  it('routes to portrait + plus_one when only plus_one exists (with fallback log)', () => {
    const roll = routeArchetype({
      profile: makeProfile([PLUS_ONE]),
      selectedLocations: [NYC],
      selectedObjects: [],
    });
    expect(roll.persona).toBe('portrait');
    expect(roll.castRoles).toEqual(['plus_one']);
    expect(roll.fallbackReasons).toContain('no_self_using_plus_one');
  });

  it('routes to vista when no cast at all', () => {
    const roll = routeArchetype({
      profile: makeProfile([]),
      selectedLocations: [NYC],
      selectedObjects: [],
    });
    expect(roll.persona).toBe('vista');
    expect(roll.castRoles).toEqual([]);
    expect(roll.fallbackReasons).toContain('no_cast_routing_to_vista');
  });

  it('routes pet-only to vista (pet alone is underwhelming for first dream)', () => {
    const roll = routeArchetype({
      profile: makeProfile([PET]),
      selectedLocations: [NYC],
      selectedObjects: [],
    });
    expect(roll.persona).toBe('vista');
  });

  it('treats cast members without thumb_url or description as not real', () => {
    const stub = { role: 'self' as const };
    const roll = routeArchetype({
      profile: makeProfile([stub as DreamCastMember]),
      selectedLocations: [NYC],
      selectedObjects: [],
    });
    expect(roll.persona).toBe('vista');
  });
});

describe('routeArchetype — location', () => {
  it('uses the first selected location as primary', () => {
    const roll = routeArchetype({
      profile: makeProfile([SELF]),
      selectedLocations: [NYC, HAWAII, FOREST],
      selectedObjects: [],
    });
    expect(roll.primaryLocation).toBe('new york city');
    expect(roll.locationClass).toBe('urban');
  });

  it('falls back to base location_class when none selected', () => {
    const roll = routeArchetype({
      profile: makeProfile([SELF]),
      selectedLocations: [],
      selectedObjects: [],
    });
    expect(roll.locationClass).toBe('base');
    expect(roll.primaryLocation).toBe('');
    expect(roll.fallbackReasons).toContain('no_location_selected');
  });

  it('handles every location class without crashing', () => {
    const classes: { name: string; cls: any }[] = [
      { name: 'urban', cls: 'urban' },
      { name: 'coastal', cls: 'coastal' },
      { name: 'forest', cls: 'forest' },
      { name: 'mountain', cls: 'mountain' },
      { name: 'desert', cls: 'desert' },
      { name: 'interior', cls: 'interior' },
      { name: 'architectural', cls: 'architectural' },
      { name: 'garden', cls: 'garden' },
      { name: 'aquatic', cls: 'aquatic' },
      { name: 'sky_cosmic', cls: 'sky_cosmic' },
    ];
    for (const c of classes) {
      const roll = routeArchetype({
        profile: makeProfile([SELF]),
        selectedLocations: [{ name: c.name, location_class: c.cls }],
        selectedObjects: [],
      });
      expect(roll.locationClass).toBe(c.cls);
    }
  });
});

describe('resolveObjectForCell — object filtering', () => {
  it('returns null when user has no objects', () => {
    const roll: ArchetypeRoll = {
      persona: 'portrait',
      locationClass: 'urban',
      objectClass: null,
      primaryLocation: 'nyc',
      primaryObject: null,
      castRoles: ['self'],
      fallbackReasons: [],
    };
    const out = resolveObjectForCell(roll, [], ['personal', 'magical']);
    expect(out.primaryObject).toBeNull();
    expect(out.objectClass).toBeNull();
  });

  it('returns null when user objects do not match cell allowed_classes', () => {
    const roll: ArchetypeRoll = {
      persona: 'portrait',
      locationClass: 'urban',
      objectClass: null,
      primaryLocation: 'nyc',
      primaryObject: null,
      castRoles: ['self'],
      fallbackReasons: [],
    };
    const userObjs: ResolvedObjectCard[] = [{ name: 'spaceship', object_class: 'vehicle' }];
    const out = resolveObjectForCell(roll, userObjs, ['personal', 'magical']);
    expect(out.primaryObject).toBeNull();
  });

  it('picks first matching object when multiple selected', () => {
    const roll: ArchetypeRoll = {
      persona: 'portrait',
      locationClass: 'urban',
      objectClass: null,
      primaryLocation: 'nyc',
      primaryObject: null,
      castRoles: ['self'],
      fallbackReasons: [],
    };
    const userObjs: ResolvedObjectCard[] = [
      { name: 'spaceship', object_class: 'vehicle' },
      { name: 'guitar', object_class: 'personal' },
      { name: 'wand', object_class: 'magical' },
    ];
    const out = resolveObjectForCell(roll, userObjs, ['personal', 'magical']);
    expect(out.primaryObject).toBe('guitar');
    expect(out.objectClass).toBe('personal');
  });

  it('returns null when cell allows no objects (vista)', () => {
    const roll: ArchetypeRoll = {
      persona: 'vista',
      locationClass: 'mountain',
      objectClass: null,
      primaryLocation: 'swiss alps',
      primaryObject: null,
      castRoles: [],
      fallbackReasons: [],
    };
    const userObjs: ResolvedObjectCard[] = [{ name: 'guitar', object_class: 'personal' }];
    const out = resolveObjectForCell(roll, userObjs, [] as ObjectClass[]);
    expect(out.primaryObject).toBeNull();
  });
});

describe('routeArchetype — full integration', () => {
  it('produces a complete couple-urban-magical roll for a typical heavy-onboarding user', () => {
    const roll = routeArchetype({
      profile: makeProfile([SELF, PLUS_ONE, PET]),
      selectedLocations: [NYC, HAWAII, FOREST],
      selectedObjects: [
        { name: 'wand', object_class: 'magical' },
        { name: 'guitar', object_class: 'personal' },
      ],
    });
    expect(roll.persona).toBe('couple');
    expect(roll.castRoles).toEqual(['self', 'plus_one']);
    expect(roll.locationClass).toBe('urban');
    expect(roll.primaryLocation).toBe('new york city');
    // object resolution deferred until cell is known
    expect(roll.objectClass).toBeNull();
    expect(roll.primaryObject).toBeNull();
  });
});

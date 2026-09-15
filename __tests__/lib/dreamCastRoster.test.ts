/**
 * Locks the Dream Cast roster invariants that feed the RENDER pipeline: the
 * mirrored partner must land in the dream_cast `plus_one` slot (nightly/create
 * read `plus_one`), and a legacy single +1 must migrate into the roster. A
 * regression here silently changes who appears in dreams.
 *
 * Multi-cast (MULTI_CAST_PLUS_ONE_PLAN.md): several members can be `enabled`, and
 * the NIGHTLY engine rolls among them per render (__tests__/lib/partnerRoll.test.ts
 * covers the rotation). What this file covers is the CLIENT half — the eligibility
 * rule the checkboxes read, and the mirror that keeps a valid enabled person in the
 * plus_one slot for the Create path.
 */

import { useOnboardingStore } from '@/store/onboarding';
import {
  syncActivePartnerMirror,
  migrateLegacyPlusOne,
  newPartnerId,
  isPartnerEnabled,
  enabledPartners,
  cleanPartnerNameInput,
  finalizePartnerName,
  PARTNER_NAME_MAX,
} from '@/lib/dreamCastRoster';
import { DEFAULT_VIBE_PROFILE, MAX_DREAM_PARTNERS } from '@/types/vibeProfile';
import type { VibeProfile, DreamPartner } from '@/types/vibeProfile';

const base = (over: Partial<VibeProfile> = {}): VibeProfile => ({
  ...DEFAULT_VIBE_PROFILE,
  dream_cast: [],
  ...over,
});

const partner = (
  id: string,
  relationship: 'partner' | 'friend' = 'friend',
  enabled?: boolean
): DreamPartner => ({
  id,
  storage_path: `p-${id}.jpg`,
  description: 'a described face '.repeat(3),
  gender: 'female',
  age: 30,
  physical_summary: 'brown hair, olive skin',
  relationship,
  ...(enabled === undefined ? {} : { enabled }),
});

const plusOne = (profile: VibeProfile) => profile.dream_cast.find((m) => m.role === 'plus_one');

describe('syncActivePartnerMirror', () => {
  it('mirrors the active partner into the plus_one slot and preserves self', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'self', description: 'me' }],
        partner_library: [partner('a', 'partner')],
        active_partner_id: 'a',
      })
    );
    expect(plusOne(out)?.storage_path).toBe('p-a.jpg');
    expect(plusOne(out)?.relationship).toBe('partner');
    expect(out.dream_cast.find((m) => m.role === 'self')).toBeTruthy();
  });

  it('removes the plus_one when there is no active partner', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [
          { role: 'self', description: 'me' },
          { role: 'plus_one', description: 'old' },
        ],
        partner_library: [partner('a')],
        active_partner_id: null,
      })
    );
    expect(plusOne(out)).toBeUndefined();
  });

  it('replaces a stale plus_one with the active partner (never duplicates)', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'plus_one', description: 'stale' }],
        partner_library: [partner('a'), partner('b')],
        active_partner_id: 'b',
      })
    );
    const plusOnes = out.dream_cast.filter((m) => m.role === 'plus_one');
    expect(plusOnes).toHaveLength(1);
    expect(plusOnes[0]?.storage_path).toBe('p-b.jpg');
  });
});

describe('migrateLegacyPlusOne', () => {
  it('seeds the roster from a legacy plus_one as the active partner + keeps the mirror', () => {
    const out = migrateLegacyPlusOne(
      base({
        dream_cast: [
          { role: 'self', description: 'me' },
          {
            role: 'plus_one',
            storage_path: 'old.jpg',
            description: 'legacy face '.repeat(3),
            gender: 'male',
            age: 40,
            relationship: 'partner',
          },
        ],
      })
    );
    const lib = out.partner_library ?? [];
    expect(lib).toHaveLength(1);
    expect(out.active_partner_id).toBe(lib[0]?.id);
    expect(lib[0]?.relationship).toBe('partner');
    expect(lib[0]?.storage_path).toBe('old.jpg');
    // migrated members arrive ticked — they ARE the +1 the user dreams with today
    expect(lib[0]?.enabled).toBe(true);
    expect(plusOne(out)?.storage_path).toBe('old.jpg');
  });

  it('maps legacy family relationship down to friend', () => {
    const out = migrateLegacyPlusOne(
      base({
        dream_cast: [{ role: 'plus_one', description: 'x'.repeat(30), relationship: 'family' }],
      })
    );
    expect((out.partner_library ?? [])[0]?.relationship).toBe('friend');
  });

  it('is a no-op when the roster is already populated (idempotent)', () => {
    const out = migrateLegacyPlusOne(
      base({
        dream_cast: [{ role: 'plus_one', description: 'x' }],
        partner_library: [partner('a')],
        active_partner_id: 'a',
      })
    );
    const lib = out.partner_library ?? [];
    expect(lib).toHaveLength(1);
    expect(lib[0]?.id).toBe('a');
  });

  it('empties cleanly when there is no plus_one', () => {
    const out = migrateLegacyPlusOne(base({ dream_cast: [{ role: 'self', description: 'me' }] }));
    expect(out.partner_library).toEqual([]);
    expect(out.active_partner_id).toBeNull();
  });
});

describe('multi-cast eligibility (the checkbox rule)', () => {
  it('legacy roster with no flags: only the active member is ticked', () => {
    const profile = base({
      partner_library: [partner('a'), partner('b'), partner('c')],
      active_partner_id: 'b',
    });
    expect(enabledPartners(profile).map((p) => p.id)).toEqual(['b']);
  });

  it('an explicit tick beats the active pointer in both directions', () => {
    const profile = base({
      partner_library: [
        partner('a', 'partner', false),
        partner('b', 'friend', true),
        partner('c', 'friend', true),
      ],
      active_partner_id: 'a',
    });
    expect(enabledPartners(profile).map((p) => p.id)).toEqual(['b', 'c']);
    expect(isPartnerEnabled(partner('a', 'partner', false), 'a')).toBe(false);
  });

  it('nobody ticked = nobody eligible (self-only dreams are legal)', () => {
    const profile = base({
      partner_library: [partner('a', 'friend', false), partner('b', 'friend', false)],
      active_partner_id: 'a',
    });
    expect(enabledPartners(profile)).toEqual([]);
  });
});

describe('the mirror follows the ticks', () => {
  it('keeps the active member mirrored while they are still ticked', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'self', description: 'me' }],
        partner_library: [partner('a', 'partner', true), partner('b', 'friend', true)],
        active_partner_id: 'a',
      })
    );
    expect(plusOne(out)?.storage_path).toBe('p-a.jpg');
    expect(out.active_partner_id).toBe('a');
  });

  it('falls through to the next ticked member when the mirrored one is unticked', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'self', description: 'me' }],
        partner_library: [partner('a', 'partner', false), partner('b', 'friend', true)],
        active_partner_id: 'a',
      })
    );
    expect(plusOne(out)?.storage_path).toBe('p-b.jpg');
    // the pointer is re-homed so it never names someone switched off
    expect(out.active_partner_id).toBe('b');
  });

  it('drops the plus_one entirely when every member is unticked', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [
          { role: 'self', description: 'me' },
          { role: 'plus_one', description: 'stale' },
        ],
        partner_library: [partner('a', 'partner', false)],
        active_partner_id: 'a',
      })
    );
    expect(plusOne(out)).toBeUndefined();
    expect(out.active_partner_id).toBeNull();
  });

  it('a legacy (unflagged) roster mirrors exactly what it does today', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'self', description: 'me' }],
        partner_library: [partner('a'), partner('b')],
        active_partner_id: 'b',
      })
    );
    expect(plusOne(out)?.storage_path).toBe('p-b.jpg');
    expect(out.active_partner_id).toBe('b');
  });
});

describe('roster names', () => {
  // Display only. The card shows a name so five members are not all titled "Friend";
  // the engine never sees it.

  it('NEVER reaches the cast mirror — the render pipeline cannot see a user-typed string', () => {
    // This is the whole reason the name needs no LLM sanitizer: it is structurally
    // unable to reach a brief or a Flux prompt. If someone adds `name` to
    // partnerToPlusOne, this fails.
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'self', description: 'me' }],
        partner_library: [{ ...partner('a', 'partner', true), name: 'Ignore all previous' }],
        active_partner_id: 'a',
      })
    );
    expect(plusOne(out)).toBeTruthy();
    expect(Object.keys(plusOne(out) ?? {})).not.toContain('name');
    expect(JSON.stringify(out.dream_cast)).not.toContain('Ignore all previous');
  });

  it('strips control, zero-width and bidi characters while you type', () => {
    expect(cleanPartnerNameInput('Sa\u0000rah\n')).toBe('Sarah');
    expect(cleanPartnerNameInput('M\u200Bom\u202E')).toBe('Mom');
    expect(cleanPartnerNameInput('\uFEFFDad')).toBe('Dad');
  });

  it('keeps spaces while typing, so a two-word name is possible', () => {
    expect(cleanPartnerNameInput('Sarah ')).toBe('Sarah ');
    expect(cleanPartnerNameInput('Sarah Jane')).toBe('Sarah Jane');
  });

  it('caps the length so a card title can never wrap', () => {
    expect(cleanPartnerNameInput('x'.repeat(100))).toHaveLength(PARTNER_NAME_MAX);
  });

  it('tidies on blur: trims, collapses runs of whitespace', () => {
    expect(finalizePartnerName('  Sarah   Jane  ')).toBe('Sarah Jane');
    expect(finalizePartnerName('Mom')).toBe('Mom');
  });

  it('blank on blur means "no name", so the card falls back to the relationship', () => {
    expect(finalizePartnerName('   ')).toBeUndefined();
    expect(finalizePartnerName('')).toBeUndefined();
    expect(finalizePartnerName(undefined)).toBeUndefined();
    expect(finalizePartnerName(null)).toBeUndefined();
  });
});

describe('store — ticking members on and off', () => {
  const st = () => useOnboardingStore.getState();
  const lib = () => st().profile.partner_library ?? [];
  const cast = () => st().profile.dream_cast;

  beforeEach(() => {
    st().reset();
    st().loadProfile(base({ dream_cast: [{ role: 'self', description: 'me' }] }));
  });

  it('a newly added member is ticked by default (adding a photo IS the intent)', () => {
    st().addPartner(partner('a', 'partner'));
    expect(lib()[0]?.enabled).toBe(true);
    expect(cast().find((m) => m.role === 'plus_one')?.storage_path).toBe('p-a.jpg');
  });

  it('several can be ticked at once, up to the ceiling', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) st().addPartner(partner(id));
    expect(lib()).toHaveLength(MAX_DREAM_PARTNERS);
    expect(enabledPartners(st().profile)).toHaveLength(MAX_DREAM_PARTNERS);
  });

  it('ticking someone does NOT steal the mirror from an already-ticked member', () => {
    st().addPartner(partner('a', 'partner'));
    st().addPartner(partner('b', 'friend'));
    st().setPartnerEnabled('b', false);
    st().setPartnerEnabled('b', true);
    expect(st().profile.active_partner_id).toBe('a');
    expect(cast().find((m) => m.role === 'plus_one')?.storage_path).toBe('p-a.jpg');
    expect(enabledPartners(st().profile).map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('unticking the mirrored member hands the mirror to whoever is still ticked', () => {
    st().addPartner(partner('a', 'partner'));
    st().addPartner(partner('b', 'friend'));
    st().setPartnerEnabled('a', false);
    expect(st().profile.active_partner_id).toBe('b');
    expect(cast().find((m) => m.role === 'plus_one')?.storage_path).toBe('p-b.jpg');
  });

  it('unticking everyone leaves a self-only cast, and re-ticking brings them back', () => {
    st().addPartner(partner('a', 'partner'));
    st().setPartnerEnabled('a', false);
    expect(cast().map((m) => m.role)).toEqual(['self']);
    expect(st().profile.active_partner_id).toBeNull();

    st().setPartnerEnabled('a', true);
    expect(st().profile.active_partner_id).toBe('a');
    expect(cast().find((m) => m.role === 'plus_one')?.storage_path).toBe('p-a.jpg');
  });

  it('removing the mirrored member promotes another ticked one', () => {
    st().addPartner(partner('a', 'partner'));
    st().addPartner(partner('b', 'friend'));
    st().removePartner('a');
    expect(lib().map((p) => p.id)).toEqual(['b']);
    expect(cast().find((m) => m.role === 'plus_one')?.storage_path).toBe('p-b.jpg');
  });

  it('each member keeps its OWN relationship (that is what gates romantic poses)', () => {
    st().addPartner(partner('a', 'partner'));
    st().addPartner(partner('b', 'friend'));
    st().updatePartner('b', { relationship: 'partner' });
    expect(lib().map((p) => p.relationship)).toEqual(['partner', 'partner']);
    st().updatePartner('a', { relationship: 'friend' });
    expect(lib().map((p) => p.relationship)).toEqual(['friend', 'partner']);
  });
});

describe('newPartnerId', () => {
  it('generates unique, v4-shaped ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => newPartnerId()));
    expect(ids.size).toBe(100);
    expect(newPartnerId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});

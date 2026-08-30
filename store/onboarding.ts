import { create } from 'zustand';
import type {
  VibeProfile,
  MoodAxes,
  DreamSeeds,
  DreamCastMember,
  DreamPartner,
} from '@/types/vibeProfile';
import { DEFAULT_VIBE_PROFILE, MAX_DREAM_PARTNERS } from '@/types/vibeProfile';
import { syncActivePartnerMirror, migrateLegacyPlusOne } from '@/lib/dreamCastRoster';

const MAX_SEEDS_PER_CATEGORY = 10;
// Locations are effectively UNCAPPED (2026-06-18, Kevin): the old 10/25 limit had
// no downstream reason — persistence is an unbounded JSONB string array and every
// engine (nightly / scene / first-dream) random-picks ONE place from it. The only
// constraint is UI scroll perf (the picker is a plain ScrollView), so we keep a
// high practical bound rather than truly infinite. Raised 100→300 on 2026-08-29
// when the picker moved to tile-level (whole-category) selection: a single tap can
// add ~38 locations (Around the World), so several tiles could silently hit a
// 100-cap and make a just-tapped tile read as unselected. 300 clears every
// category selected at once.
const MAX_LOCATIONS = 300;

type SeedCategory = keyof DreamSeeds;

interface OnboardingStore {
  step: number;
  setStep: (step: number) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  /** True once the store reflects a deliberate load from the DB (a returning
   *  user editing in Settings) OR a confirmed fresh onboarding session (no
   *  existing recipe). The auto-save refuses to write until this is set, so a
   *  cold-mounted editing screen still holding the empty DEFAULT_VIBE_PROFILE
   *  can never overwrite the user's real recipe. */
  isHydrated: boolean;
  setHydrated: (v: boolean) => void;

  profile: VibeProfile;

  // Personality
  setMoodAxis: (axis: keyof MoodAxes, value: number) => void;

  // Dream seeds (places — `characters` is vestigial; objects/things removed
  // 2026-06-02, see project_objects_removed_2026-06-02 memory)
  addSeed: (category: SeedCategory, value: string) => void;
  removeSeed: (category: SeedCategory, value: string) => void;

  // Dream cast (photo descriptions)
  setCastMember: (member: DreamCastMember) => void;
  removeCastMember: (role: DreamCastMember['role']) => void;

  // Dream Cast roster (Settings — up to 5 loved ones). The ACTIVE partner is
  // mirrored into dream_cast's plus_one slot (see lib/dreamCastRoster.ts), so
  // every setter re-syncs that mirror.
  addPartner: (partner: DreamPartner) => void;
  updatePartner: (id: string, patch: Partial<DreamPartner>) => void;
  removePartner: (id: string) => void;
  setActivePartner: (id: string | null) => void;

  /** Number of cast-photo uploads (storage upload + describe) currently in
   *  flight. The first-dream cutoff (SaveContinueStep) waits for this to reach 0
   *  before enqueuing, so the cast's http thumb_urls are present when the server
   *  builds the face-swap tiers. Without it, a fast user who advances mid-upload
   *  fires the kickoff before the upload lands → buildFirstDreamTiers sees no
   *  usable cast → a scene-only first dream (no face swap). */
  castUploadsInFlight: number;
  beginCastUpload: () => void;
  endCastUpload: () => void;

  // Location toggles (curated picker)
  toggleLocation: (key: string) => void;
  addLocationPack: (keys: string[]) => void;
  toggleAllLocations: (keys: string[]) => void;

  // Avoid list
  addAvoid: (value: string) => void;
  removeAvoid: (value: string) => void;

  // Scroll lock (sliders disable FlatList paging during drag)
  scrollLocked: boolean;
  setScrollLocked: (v: boolean) => void;

  // Hide the pager's chrome (OnboardingHeader). Used by the Reveal step's
  // post-Skip "finished" state so the dream renders fully edge-to-edge
  // with no progress dots competing for attention.
  chromeHidden: boolean;
  setChromeHidden: (v: boolean) => void;

  // First dream is kicked off in the BACKGROUND at the "Save & continue" cutoff
  // step (SaveContinueStep), then awaited at the reveal step — the user picks
  // bots in between. The jobId + status survive navigation here (the job itself
  // lives in dream_jobs, pollable by id from any screen).
  firstDreamJobId: string | null;
  firstDreamStatus: FirstDreamStatus;
  setFirstDreamJobId: (id: string | null) => void;
  setFirstDreamStatus: (s: FirstDreamStatus) => void;

  // Load existing profile for editing
  loadProfile: (profile: VibeProfile) => void;

  reset: () => void;
}

export type FirstDreamStatus =
  | 'idle' // not started
  | 'starting' // kickoff async in flight (describe → save → enqueue)
  | 'enqueued' // jobId obtained, render in progress
  | 'already_claimed' // returning user re-onboarding → skip to feed
  | 'error'; // kickoff failed before enqueue

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),

  isEditing: false,
  setIsEditing: (v) => set({ isEditing: v }),
  isHydrated: false,
  setHydrated: (v) => set({ isHydrated: v }),

  profile: { ...DEFAULT_VIBE_PROFILE },

  setMoodAxis: (axis, value) =>
    set((s) => ({
      profile: { ...s.profile, moods: { ...s.profile.moods, [axis]: clamp(value) } },
    })),

  addSeed: (category, value) =>
    set((s) => {
      const trimmed = value.trim();
      const current = s.profile.dream_seeds[category];
      if (!trimmed || current.length >= MAX_SEEDS_PER_CATEGORY) return s;
      if (current.includes(trimmed)) return s;
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, [category]: [...current, trimmed] },
        },
      };
    }),

  removeSeed: (category, value) =>
    set((s) => ({
      profile: {
        ...s.profile,
        dream_seeds: {
          ...s.profile.dream_seeds,
          [category]: s.profile.dream_seeds[category].filter((t) => t !== value),
        },
      },
    })),

  setCastMember: (member) =>
    set((s) => {
      const filtered = s.profile.dream_cast.filter((m) => m.role !== member.role);
      return { profile: { ...s.profile, dream_cast: [...filtered, member] } };
    }),

  removeCastMember: (role) =>
    set((s) => ({
      profile: { ...s.profile, dream_cast: s.profile.dream_cast.filter((m) => m.role !== role) },
    })),

  addPartner: (partner) =>
    set((s) => {
      const lib = s.profile.partner_library ?? [];
      if (lib.length >= MAX_DREAM_PARTNERS) return s;
      // The first partner added auto-becomes the current Dream Partner.
      const active = s.profile.active_partner_id ?? partner.id;
      return {
        profile: syncActivePartnerMirror({
          ...s.profile,
          partner_library: [...lib, partner],
          active_partner_id: active,
        }),
      };
    }),

  updatePartner: (id, patch) =>
    set((s) => ({
      profile: syncActivePartnerMirror({
        ...s.profile,
        partner_library: (s.profile.partner_library ?? []).map((p) =>
          p.id === id ? { ...p, ...patch } : p
        ),
      }),
    })),

  removePartner: (id) =>
    set((s) => {
      const lib = (s.profile.partner_library ?? []).filter((p) => p.id !== id);
      // Removing the current partner promotes the first remaining one (or none).
      let active = s.profile.active_partner_id ?? null;
      if (active === id) active = lib[0]?.id ?? null;
      return {
        profile: syncActivePartnerMirror({
          ...s.profile,
          partner_library: lib,
          active_partner_id: active,
        }),
      };
    }),

  setActivePartner: (id) =>
    set((s) => ({
      profile: syncActivePartnerMirror({ ...s.profile, active_partner_id: id }),
    })),

  castUploadsInFlight: 0,
  beginCastUpload: () => set((s) => ({ castUploadsInFlight: s.castUploadsInFlight + 1 })),
  endCastUpload: () =>
    set((s) => ({ castUploadsInFlight: Math.max(0, s.castUploadsInFlight - 1) })),

  toggleLocation: (key) =>
    set((s) => ({
      profile: {
        ...s.profile,
        dream_seeds: {
          ...s.profile.dream_seeds,
          places: toggle(s.profile.dream_seeds.places, key),
        },
      },
    })),

  addLocationPack: (keys) =>
    set((s) => {
      const current = s.profile.dream_seeds.places;
      const newKeys = keys.filter((k) => !current.includes(k));
      if (newKeys.length === 0) return s;
      return {
        profile: {
          ...s.profile,
          dream_seeds: {
            ...s.profile.dream_seeds,
            places: [...current, ...newKeys].slice(0, MAX_LOCATIONS),
          },
        },
      };
    }),

  toggleAllLocations: (keys) =>
    set((s) => {
      const current = s.profile.dream_seeds.places;
      const allSelected = keys.every((k) => current.includes(k));
      const newPlaces = allSelected
        ? current.filter((k) => !keys.includes(k))
        : [...current, ...keys.filter((k) => !current.includes(k))].slice(0, MAX_LOCATIONS);
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, places: newPlaces },
        },
      };
    }),

  addAvoid: (value) =>
    set((s) => {
      const trimmed = value.trim().toLowerCase();
      if (!trimmed || s.profile.avoid.includes(trimmed)) return s;
      return { profile: { ...s.profile, avoid: [...s.profile.avoid, trimmed] } };
    }),

  removeAvoid: (value) =>
    set((s) => ({
      profile: { ...s.profile, avoid: s.profile.avoid.filter((v) => v !== value) },
    })),

  scrollLocked: false,
  setScrollLocked: (v) => set({ scrollLocked: v }),

  chromeHidden: false,
  setChromeHidden: (v) => set({ chromeHidden: v }),

  firstDreamJobId: null,
  firstDreamStatus: 'idle',
  setFirstDreamJobId: (id) => set({ firstDreamJobId: id }),
  setFirstDreamStatus: (s) => set({ firstDreamStatus: s }),

  // Normalize over the modern defaults: isVibeProfile only checks version===2,
  // so a FOSSIL recipe (early accounts predate dream_seeds/dream_cast — e.g.
  // @bunny's April-era row, 2026-07-05) loads with those fields missing and
  // every consumer that does profile.dream_cast.find(...) crashes (Edit
  // Profile's embedded DreamCastStep was unusable for her alone). Legacy
  // extra keys ride along harmlessly; the defaults only fill gaps.
  loadProfile: (profile) =>
    set({
      // migrateLegacyPlusOne seeds the roster from a legacy single +1 on first
      // load (idempotent) so returning users see their existing +1 as partner #1.
      profile: migrateLegacyPlusOne({
        ...DEFAULT_VIBE_PROFILE,
        ...profile,
        moods: { ...DEFAULT_VIBE_PROFILE.moods, ...(profile.moods ?? {}) },
        dream_seeds: { ...DEFAULT_VIBE_PROFILE.dream_seeds, ...(profile.dream_seeds ?? {}) },
        dream_cast: profile.dream_cast ?? [],
        partner_library: profile.partner_library ?? [],
        active_partner_id: profile.active_partner_id ?? null,
      }),
      isHydrated: true,
    }),

  reset: () =>
    set({
      step: 1,
      isEditing: false,
      isHydrated: false,
      scrollLocked: false,
      chromeHidden: false,
      firstDreamJobId: null,
      firstDreamStatus: 'idle',
      castUploadsInFlight: 0,
      profile: { ...DEFAULT_VIBE_PROFILE },
    }),
}));

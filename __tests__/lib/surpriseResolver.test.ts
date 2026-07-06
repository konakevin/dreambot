/**
 * Surprise Me resolvers — regression lock for the create-screen "Surprise Me"
 * tokens (2026-07-05: vibe Surprise Me silently rendered cinematic every time,
 * and the raw medium token fell through to canvas, because neither resolver had
 * a branch for it). These tests assert the tokens ROLL from the curated
 * dream_eligible pool, and that a genuinely unknown key still falls back to the
 * stable default (canvas / cinematic).
 */

// dreamStyles.ts calls Deno.env.get() inside getServiceClient(); stub it before import.
(globalThis as unknown as { Deno: unknown }).Deno = {
  env: { get: () => 'stub' },
};

// Seed the DB rows the resolver's cached fetch will "read". One medium + one
// vibe are dream-eligible; the rest are NOT, so a correct surprise roll can
// only ever return the eligible one — making the assertion deterministic.
const MEDIUM_ROWS = [
  { key: 'eligible_medium', is_dream_eligible: true, character_render_mode: 'natural' },
  { key: 'not_eligible_a', is_dream_eligible: false, character_render_mode: 'natural' },
  { key: 'not_eligible_b', is_dream_eligible: false, character_render_mode: 'natural' },
  { key: 'canvas', is_dream_eligible: false, character_render_mode: 'natural' },
];
const VIBE_ROWS = [
  { key: 'eligible_vibe', is_dream_eligible: true },
  { key: 'not_eligible_vibe', is_dream_eligible: false },
  { key: 'cinematic', is_dream_eligible: false },
];

// Chainable, thenable Supabase stub: every builder method returns the builder,
// and awaiting it resolves to the seeded rows for the queried table. Covers
// fetchMediums (.from().select().or()) and fetchVibes (.from().select().eq().order()).
jest.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: () => ({
    from: (table: string) => {
      const data = table === 'dream_mediums' ? MEDIUM_ROWS : VIBE_ROWS;
      const builder: Record<string, unknown> = {};
      for (const m of ['select', 'or', 'eq', 'order']) {
        builder[m] = () => builder;
      }
      builder.then = (resolve: (v: { data: unknown; error: null }) => unknown) =>
        resolve({ data, error: null });
      return builder;
    },
  }),
}));

import { resolveMediumFromDb, resolveVibeFromDb } from '@engine/dreamStyles';

describe('resolveMediumFromDb — Surprise Me', () => {
  it("'surprise_me' rolls from the dream_eligible pool (NOT the canvas fallback)", async () => {
    for (let i = 0; i < 10; i++) {
      const m = await resolveMediumFromDb('surprise_me');
      expect(m.key).toBe('eligible_medium');
    }
  });

  it("'my_mediums' rolls from the dream_eligible pool too", async () => {
    const m = await resolveMediumFromDb('my_mediums');
    expect(m.key).toBe('eligible_medium');
  });

  it('a genuinely unknown key still falls back to the stable canvas default', async () => {
    const m = await resolveMediumFromDb('totally_bogus_key');
    expect(m.key).toBe('canvas');
  });
});

describe('resolveVibeFromDb — Surprise Me', () => {
  it("'surprise_me' rolls from the dream_eligible pool (NOT the cinematic fallback)", async () => {
    for (let i = 0; i < 10; i++) {
      const v = await resolveVibeFromDb('surprise_me');
      expect(v.key).toBe('eligible_vibe');
    }
  });

  it("'my_vibes' rolls from the dream_eligible pool too", async () => {
    const v = await resolveVibeFromDb('my_vibes');
    expect(v.key).toBe('eligible_vibe');
  });

  it('a genuinely unknown key still falls back to the stable cinematic default', async () => {
    const v = await resolveVibeFromDb('totally_bogus_key');
    expect(v.key).toBe('cinematic');
  });
});

-- 371_kawaii_style_to_vibe.sql
--
-- Move "Kawaii" from a Dream Art STYLE (medium) to a Dream-Art-only VIBE, and
-- introduce medium-gated vibes.
--
--   1. Deactivate the kawaii MEDIUM — it's dropped from the Style picker's Dream
--      Art section. Old dreams that reference medium_key='kawaii' are unaffected
--      (get_dream_mediums filters is_active; historical rows keep rendering).
--   2. Reactivate the kawaii VIBE (added deactivated in migration 299) and GATE it
--      to the Dream Art segment via client_meta.medium_segment='art'. It stays
--      is_dream_eligible=false (user-pick-only — never auto-rolled by Surprise Me
--      or nightly), so an out-of-segment application can't happen via a roll; the
--      only way to apply it is an explicit pick, which the client restricts to
--      Dream Art styles (the vibe selector filters by segment + auto-resets on a
--      segment switch — lib/vibeGating.ts).
--
-- NEW ARCHITECTURE — medium-gated vibes: `dream_vibes.client_meta.medium_segment`
--   • 'art'  → offered only when a Dream Art (face_swaps=false) style is selected
--   • 'face' → offered only when a Real Face (face_swaps=true) style is selected
--   • 'all' / unset → offered everywhere (every existing vibe)
-- This is a CLIENT-side UI-selector gate (no schema/RPC change — client_meta
-- already flows through get_dream_vibes). It is NOT a security boundary: a leaked
-- out-of-segment vibe is only a quality mismatch, so client gating is sufficient.
-- A FUTURE dream-eligible gated vibe would additionally need resolveVibeFromDb
-- (_shared/dreamStyles.ts) to filter its random-roll pool by the medium segment.
--
-- Applied live 2026-07-13; this captures it for a fresh DB. Re-runnable.

-- 1. Kawaii style → inactive.
UPDATE public.dream_mediums SET is_active = false WHERE key = 'kawaii';

-- 2. Kawaii vibe → active, Dream-Art-only, still user-pick-only. Merge the gate
--    into client_meta so the existing restyle_fragment is preserved.
UPDATE public.dream_vibes
SET is_active = true,
    is_dream_eligible = false,
    client_meta = COALESCE(client_meta, '{}'::jsonb) || '{"medium_segment":"art"}'::jsonb
WHERE key = 'kawaii';

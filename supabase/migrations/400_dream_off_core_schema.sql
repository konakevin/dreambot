-- 400_dream_off_core_schema.sql (2026-07-26)
--
-- Dream Off — Step 1 of the build (DREAM_OFF_BUILD_PLAN.md §1, migration A3 + the
-- kill-switch). The async party game's CORE MECHANICS schema. Design:
-- DREAM_OFF_PLAN.md. Money tables (pot/ledger/tiers), the shared-surface CHECK
-- widenings (dream_queue/notifications), RPCs, the phase machine, and the cron
-- land in LATER migrations — this one is pure, additive, and INERT on prod:
--   • Every table is BRAND NEW (nothing references them yet) → zero risk to any
--     live path.
--   • The feature is BORN DARK behind engine_config.dream_off_enabled = false.
--   • dream_off_entries + dream_off_votes + dream_off_events get RLS ENABLED with
--     NO policy = deny-all (service role bypasses). This is the BLINDNESS lever:
--     a hostile `curl /rest/v1/dream_off_entries?select=*` returns [], so entry
--     ownership + ballots are unreadable. The ONLY read path (added later) is
--     phase-blinding SECURITY DEFINER RPCs. These tables are deliberately NOT
--     added to the realtime publication for the same reason (a subscription would
--     leak blind rows) — only the `dream_offs` phase row is realtime.
--
-- Re-runnable (IF NOT EXISTS throughout). Apply by hand in the SQL editor.

BEGIN;

-- ── Kill-switch + deadline knob (additive columns on the engine_config singleton) ──
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dream_off_enabled        boolean NOT NULL DEFAULT false,  -- master gate, ships OFF
  ADD COLUMN IF NOT EXISTS dream_off_deadline_hours integer NOT NULL DEFAULT 24;     -- per-phase deadline

-- ── dream_offs: one row per game (the phase state of record) ──────────────────
CREATE TABLE IF NOT EXISTS public.dream_offs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid REFERENCES public.users(id) ON DELETE SET NULL,   -- archive survives owner deletion
  topic             text NOT NULL,
  topic_source      text NOT NULL CHECK (topic_source IN ('pack', 'surprise', 'custom')),
  phase             text NOT NULL DEFAULT 'setup'
                      CHECK (phase IN ('setup', 'submission', 'voting', 'results', 'cancelled', 'no_contest')),
  phase_expires_at  timestamptz,                                           -- deadline; NULL in terminal phases
  tier_key          text NOT NULL DEFAULT 'standard',                      -- frozen model tier (economy)
  invite_code       text NOT NULL UNIQUE,                                  -- ~10-char base32, gen server-side
  invite_revoked_at timestamptz,
  max_players       integer NOT NULL DEFAULT 12 CHECK (max_players BETWEEN 2 AND 50),
  join_approval     boolean NOT NULL DEFAULT false,
  pot_reference     uuid,                                                  -- OPAQUE seam to economy; NO FK
  settings          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
-- Cron hot path: games whose deadline is due.
CREATE INDEX IF NOT EXISTS idx_dream_offs_expiring ON public.dream_offs (phase_expires_at)
  WHERE phase IN ('submission', 'voting') AND phase_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dream_offs_owner ON public.dream_offs (owner_id);

-- ── dream_off_players: membership + per-player state ──────────────────────────
CREATE TABLE IF NOT EXISTS public.dream_off_players (
  game_id      uuid NOT NULL REFERENCES public.dream_offs(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'active'
                 CHECK (status IN ('invited', 'active', 'pending', 'removed', 'left')),
  joined_via   text NOT NULL DEFAULT 'invite' CHECK (joined_via IN ('invite', 'link', 'owner')),
  submitted_at timestamptz,
  voted_at     timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (game_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_dream_off_players_user ON public.dream_off_players (user_id, status);

-- ── dream_off_entries: the blind entries (RLS deny-all) ───────────────────────
CREATE TABLE IF NOT EXISTS public.dream_off_entries (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id              uuid NOT NULL REFERENCES public.dream_offs(id) ON DELETE CASCADE,
  author_id            uuid REFERENCES public.users(id) ON DELETE SET NULL,   -- keep image, drop identity
  author_name_snapshot text NOT NULL,                                         -- frozen (survives SET NULL)
  upload_id            uuid REFERENCES public.uploads(id) ON DELETE SET NULL, -- private-album copy
  game_image_ref       text,                                                  -- permanent game-folder path
  blind_order_seed     integer NOT NULL DEFAULT (floor(random() * 1000000))::integer,
  render_status        text NOT NULL DEFAULT 'pending'
                         CHECK (render_status IN ('pending', 'rendering', 'completed', 'failed')),
  moderation_status    text NOT NULL DEFAULT 'clean' CHECK (moderation_status IN ('clean', 'forfeit_nsfw')),
  payment_reference    uuid,                                                  -- OPAQUE seam to economy
  completed_at         timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_id, author_id)                                                 -- one entry per player
);
CREATE INDEX IF NOT EXISTS idx_dream_off_entries_game ON public.dream_off_entries (game_id);

-- ── dream_off_votes: 2 roses/voter, structurally enforced (RLS deny-all) ──────
CREATE TABLE IF NOT EXISTS public.dream_off_votes (
  game_id    uuid NOT NULL REFERENCES public.dream_offs(id) ON DELETE CASCADE,
  voter_id   uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  entry_id   uuid NOT NULL REFERENCES public.dream_off_entries(id) ON DELETE CASCADE,
  rose_index smallint NOT NULL CHECK (rose_index IN (0, 1)),                 -- PK caps 2 roses/voter
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (game_id, voter_id, rose_index),
  UNIQUE (game_id, voter_id, entry_id)                                       -- no double-voting one entry
);
CREATE INDEX IF NOT EXISTS idx_dream_off_votes_entry ON public.dream_off_votes (entry_id);

-- No self-vote: a CHECK can't cross tables, so a BEFORE-INSERT trigger enforces it
-- (the cast_votes RPC also re-checks — defense in depth).
CREATE OR REPLACE FUNCTION public.dream_off_votes_no_self_vote()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.dream_off_entries e
    WHERE e.id = NEW.entry_id AND e.author_id = NEW.voter_id
  ) THEN
    RAISE EXCEPTION 'dream_off: cannot vote for your own entry';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_dream_off_votes_no_self_vote ON public.dream_off_votes;
CREATE TRIGGER trg_dream_off_votes_no_self_vote
  BEFORE INSERT ON public.dream_off_votes
  FOR EACH ROW EXECUTE FUNCTION public.dream_off_votes_no_self_vote();

-- ── dream_off_events: the activity readout (RLS deny-all; read via RPC) ───────
CREATE TABLE IF NOT EXISTS public.dream_off_events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id             uuid NOT NULL REFERENCES public.dream_offs(id) ON DELETE CASCADE,
  actor_id            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  actor_name_snapshot text,
  kind                text NOT NULL CHECK (kind IN
                        ('created', 'joined', 'left', 'removed', 'submitted', 'voted',
                         'advanced', 'topic_dealt', 'revealed', 'cancelled')),
  created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dream_off_events_game ON public.dream_off_events (game_id, created_at DESC);

-- ── dream_off_superlatives: winner + runner_up + dark_horse (PK stores ties) ──
CREATE TABLE IF NOT EXISTS public.dream_off_superlatives (
  game_id    uuid NOT NULL REFERENCES public.dream_offs(id) ON DELETE CASCADE,
  key        text NOT NULL CHECK (key IN ('winner', 'runner_up', 'dark_horse')),
  entry_id   uuid NOT NULL REFERENCES public.dream_off_entries(id) ON DELETE CASCADE,
  rose_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (game_id, key, entry_id)
);

-- ── dream_off_topics: the Sonnet-authored topic deck (RLS deny-all; read via RPC) ──
CREATE TABLE IF NOT EXISTS public.dream_off_topics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack         text NOT NULL,
  topic_text   text NOT NULL,
  tone         text NOT NULL DEFAULT 'sfw' CHECK (tone IN ('sfw', 'spicy')),
  is_active    boolean NOT NULL DEFAULT true,
  season_start date,
  season_end   date,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dream_off_topics_active ON public.dream_off_topics (pack) WHERE is_active;

-- ── RLS: enable on ALL new tables, NO policies = deny-all (service role bypasses). ──
-- This is the blindness lever + the default-secure posture. Client reads land only
-- through SECURITY DEFINER RPCs (added in a later migration).
ALTER TABLE public.dream_offs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_off_players    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_off_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_off_votes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_off_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_off_superlatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_off_topics     ENABLE ROW LEVEL SECURITY;

-- ── Realtime: ONLY the game row (phase flips). Entries/votes/events NEVER —
-- a subscription on those would stream blind rows to the client. ──────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public' AND tablename = 'dream_offs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.dream_offs;
  END IF;
END;
$$;

COMMIT;

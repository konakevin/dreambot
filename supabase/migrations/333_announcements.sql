-- 333: In-app announcements (ANNOUNCEMENTS_PLAN.md)
--
-- DB-driven announcement takeover: a branded sheet the client renders from
-- these rows, so feature launches / notices are a dashboard INSERT with no
-- client deploy. Seen-state is account-bound (announcement_seen), following
-- the user_first_run precedent, and doubles as a view-rate metric.

-- ── Content ──────────────────────────────────────────────────────────────────

CREATE TABLE public.announcements (
  id          text PRIMARY KEY,              -- slug, e.g. 'gift-sparkles-launch'
  title       text NOT NULL,
  body        text NOT NULL,
  image_url   text,                          -- optional hero image
  cta_label   text,                          -- e.g. 'Send a gift'
  cta_route   text,                          -- nav.push target, e.g. '/sparkleStore'
  style       text NOT NULL DEFAULT 'sheet'
              CHECK (style IN ('sheet', 'banner')),
  audience    text NOT NULL DEFAULT 'all'
              CHECK (audience IN ('all', 'pro', 'free')),
  min_build   int,                           -- hide from clients too old for the feature
  starts_at   timestamptz NOT NULL DEFAULT now(),
  ends_at     timestamptz,                   -- NULL = until deactivated
  priority    int NOT NULL DEFAULT 0,        -- highest active unseen wins
  is_active   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Clients only ever see live announcements; authoring happens via the
-- dashboard (service role bypasses RLS). No client writes.
CREATE POLICY announcements_read ON public.announcements
  FOR SELECT TO authenticated
  USING (is_active AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

GRANT SELECT ON public.announcements TO authenticated;

-- ── Seen tracking ────────────────────────────────────────────────────────────

CREATE TABLE public.announcement_seen (
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  announcement_id text NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  seen_at         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

ALTER TABLE public.announcement_seen ENABLE ROW LEVEL SECURITY;

CREATE POLICY announcement_seen_own_read ON public.announcement_seen
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY announcement_seen_own_insert ON public.announcement_seen
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT ON public.announcement_seen TO authenticated;

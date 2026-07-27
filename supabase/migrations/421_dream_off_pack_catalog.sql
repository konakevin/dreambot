-- 421_dream_off_pack_catalog.sql (2026-07-26)
--
-- Dream Off — the PACK CATALOG (the storefront the create-flow picker renders).
-- Until now a "pack" was just a text value stamped on each dream_off_topics row;
-- there was no DB home for a pack's display metadata (name, emoji, tagline, which
-- categories/season, order). This adds dream_off_packs so the whole storefront is
-- editable REMOTELY from the dashboard with NO client deploy (Kevin, 2026-07-26):
-- rename a pack, swap an emoji, reorder, widen a holiday's season, hide one, all
-- live.
--
-- Season now lives HERE (single source): deal_topic is re-pointed to gate on the
-- catalog's season window instead of the per-topic season columns, so extending
-- "Christmas" in the dashboard immediately lets its topics deal — no reseed.
--
-- 48 packs seeded (14 evergreen base + 34 holiday tone-subpacks across 7 holidays),
-- matching the keys already in dream_off_topics. ON CONFLICT DO NOTHING so a re-run
-- never clobbers a remote edit. Deny-all RLS + a DEFINER read RPC, like the rest of
-- the Dream Off surface. Re-runnable.

BEGIN;

CREATE TABLE IF NOT EXISTS public.dream_off_packs (
  key           text PRIMARY KEY,                 -- matches dream_off_topics.pack
  display_name  text NOT NULL,
  group_key     text,                             -- NULL for base; e.g. 'halloween' groups its tones
  group_label   text,                             -- 'Halloween'
  tone_label    text,                             -- 'Cozy' / 'Trick or Treat' (NULL for base)
  tagline       text,
  emoji         text,
  accent        text,                             -- card accent hex
  has_scene     boolean NOT NULL DEFAULT true,    -- offers a scene (faceless) deck
  has_cast      boolean NOT NULL DEFAULT true,    -- offers a cast (you / you+1) deck
  is_holiday    boolean NOT NULL DEFAULT false,
  season_start  date,                             -- NULL = evergreen
  season_end    date,
  sort_order    int NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dream_off_packs ENABLE ROW LEVEL SECURITY;  -- deny-all; reads via DEFINER RPC

-- ── seed: 14 evergreen base packs ─────────────────────────────────────────────
INSERT INTO public.dream_off_packs
  (key, display_name, tagline, emoji, accent, has_scene, has_cast, is_holiday, sort_order)
VALUES
  ('cute',        'Cute',        'Impossibly adorable everything.',   '🥰', '#F9A8D4', true,  true,  false, 10),
  ('cursed',      'Cursed',      'Delightfully wrong. On purpose.',   '😈', '#7C5CD8', true,  true,  false, 20),
  ('chaotic',     'Chaotic',     'No rules. Maximum nonsense.',       '🤪', '#F97316', true,  true,  false, 30),
  ('epic',        'Epic',        'Turn it up to legendary.',          '⚔️', '#FFB800', true,  true,  false, 40),
  ('glam',        'Glam',        'Full glam, zero chill.',            '💅', '#F472B6', true,  true,  false, 50),
  ('hot_summer',  'Hot Summer',  'Sun, sand, and a little trouble.',  '🌴', '#FB7185', true,  true,  false, 60),
  ('cozy',        'Cozy',        'Warm, soft, and a little sleepy.',  '🧸', '#FBBF77', true,  true,  false, 70),
  ('anime',       'Anime',       'Straight out of the anime.',        '🌸', '#FCA5F5', true,  true,  false, 80),
  ('movies',      'Movies',      'Blockbuster energy.',               '🎬', '#60A5FA', true,  true,  false, 90),
  ('video_games', 'Video Games', 'Pixels, power-ups, boss fights.',   '🎮', '#34D399', true,  true,  false, 100),
  ('scifi',       'Sci-Fi',      'Far-future, deep-space, big ideas.','🚀', '#22D3EE', true,  true,  false, 110),
  ('era',         'Eras',        'Pick a decade and live in it.',     '🕰️', '#A78BFA', true,  true,  false, 120),
  ('worlds',      'Worlds',      'Places that shouldn''t exist.',     '🌍', '#5EEAD4', true,  false, false, 130),
  ('roast',       'Roast',       'Loving jabs only.',                 '🔥', '#EF4444', false, true,  false, 140)
ON CONFLICT (key) DO NOTHING;

-- ── seed: 34 holiday tone-subpacks (all offer scene + cast) ───────────────────
INSERT INTO public.dream_off_packs
  (key, display_name, group_key, group_label, tone_label, tagline, emoji, accent,
   is_holiday, season_start, season_end, sort_order)
VALUES
  -- Halloween
  ('halloween_cute',           'Cute Halloween',      'halloween','Halloween','Cute',          'Spooky but adorable.',            '🎃','#FB923C', true,'2026-09-15','2026-10-31',201),
  ('halloween_cozy',           'Cozy Halloween',      'halloween','Halloween','Cozy',          'Sweaters, candles, gentle spooks.','🎃','#FB923C', true,'2026-09-15','2026-10-31',202),
  ('halloween_funny',          'Funny Halloween',     'halloween','Halloween','Funny',         'Costumes gone hilariously wrong.', '🎃','#FB923C', true,'2026-09-15','2026-10-31',203),
  ('halloween_scary',          'Scary Halloween',     'halloween','Halloween','Scary',         'Actually kind of terrifying.',     '🎃','#FB923C', true,'2026-09-15','2026-10-31',204),
  ('halloween_glam',           'Glam Halloween',      'halloween','Halloween','Glam',          'Haute couture haunt.',             '🎃','#FB923C', true,'2026-09-15','2026-10-31',205),
  ('halloween_spicy',          'Spicy Halloween',     'halloween','Halloween','Spicy',         'A little too tempting.',           '🎃','#FB923C', true,'2026-09-15','2026-10-31',206),
  ('halloween_trick_or_treat', 'Trick or Treat',      'halloween','Halloween','Trick or Treat','Doorbells, candy, chaos.',         '🎃','#FB923C', true,'2026-09-15','2026-10-31',207),
  -- Christmas
  ('christmas_cute',       'Cute Christmas',    'christmas','Christmas','Cute',      'Merry and impossibly cute.',    '🎄','#34D399', true,'2026-12-01','2026-12-26',221),
  ('christmas_cozy',       'Cozy Christmas',    'christmas','Christmas','Cozy',      'Fireplace, cocoa, fuzzy socks.','🎄','#34D399', true,'2026-12-01','2026-12-26',222),
  ('christmas_funny',      'Funny Christmas',   'christmas','Christmas','Funny',     'Holiday mishaps guaranteed.',   '🎄','#34D399', true,'2026-12-01','2026-12-26',223),
  ('christmas_glam',       'Glam Christmas',    'christmas','Christmas','Glam',      'Black-tie by the tree.',        '🎄','#34D399', true,'2026-12-01','2026-12-26',224),
  ('christmas_spicy',      'Spicy Christmas',   'christmas','Christmas','Spicy',     'Naughty-list material.',        '🎄','#34D399', true,'2026-12-01','2026-12-26',225),
  ('christmas_north_pole', 'North Pole',        'christmas','Christmas','North Pole','Straight from Santa''s workshop.','🎄','#34D399', true,'2026-12-01','2026-12-26',226),
  -- New Year's
  ('new_years_cute',  'Cute New Year''s',  'new_years','New Year''s','Cute',  'Confetti and fresh starts.',    '🎉','#FCD34D', true,'2026-12-27','2027-01-02',241),
  ('new_years_cozy',  'Cozy New Year''s',  'new_years','New Year''s','Cozy',  'Quiet countdown, warm blanket.','🎉','#FCD34D', true,'2026-12-27','2027-01-02',242),
  ('new_years_funny', 'Funny New Year''s', 'new_years','New Year''s','Funny', 'Resolutions that won''t last.', '🎉','#FCD34D', true,'2026-12-27','2027-01-02',243),
  ('new_years_glam',  'Glam New Year''s',  'new_years','New Year''s','Glam',  'Midnight in sequins.',          '🎉','#FCD34D', true,'2026-12-27','2027-01-02',244),
  ('new_years_spicy', 'Spicy New Year''s', 'new_years','New Year''s','Spicy', 'Someone to kiss at midnight.',  '🎉','#FCD34D', true,'2026-12-27','2027-01-02',245),
  -- Valentine's
  ('valentines_cute',          'Cute Valentine''s',    'valentines','Valentine''s','Cute',          'Sweet, soft, and smitten.',       '💘','#F472B6', true,'2027-02-07','2027-02-14',261),
  ('valentines_cozy',          'Cozy Valentine''s',    'valentines','Valentine''s','Cozy',          'Slow dance in the kitchen.',      '💘','#F472B6', true,'2027-02-07','2027-02-14',262),
  ('valentines_funny',         'Funny Valentine''s',   'valentines','Valentine''s','Funny',         'Love is ridiculous.',             '💘','#F472B6', true,'2027-02-07','2027-02-14',263),
  ('valentines_glam',          'Glam Valentine''s',    'valentines','Valentine''s','Glam',          'Roses and red-carpet romance.',   '💘','#F472B6', true,'2027-02-07','2027-02-14',264),
  ('valentines_spicy',         'Spicy Valentine''s',   'valentines','Valentine''s','Spicy',         'Turn the heat up.',               '💘','#F472B6', true,'2027-02-07','2027-02-14',265),
  ('valentines_disaster_date', 'Disaster Date',        'valentines','Valentine''s','Disaster Date', 'Everything that can go wrong.',    '💘','#F472B6', true,'2027-02-07','2027-02-14',266),
  -- St. Patrick's
  ('st_patricks_cute',  'Cute St. Patrick''s',  'st_patricks','St. Patrick''s','Cute',  'Lucky and lovable.',           '🍀','#34D399', true,'2027-03-10','2027-03-17',281),
  ('st_patricks_funny', 'Funny St. Patrick''s', 'st_patricks','St. Patrick''s','Funny', 'Green, giddy, and goofy.',     '🍀','#34D399', true,'2027-03-10','2027-03-17',282),
  ('st_patricks_spicy', 'Spicy St. Patrick''s', 'st_patricks','St. Patrick''s','Spicy', 'Feeling extra lucky tonight.', '🍀','#34D399', true,'2027-03-10','2027-03-17',283),
  -- Easter
  ('easter_cute',  'Cute Easter',  'easter','Easter','Cute',  'Bunnies, chicks, pastel everything.','🐣','#FBBF77', true,'2027-03-20','2027-04-05',301),
  ('easter_cozy',  'Cozy Easter',  'easter','Easter','Cozy',  'Spring morning, soft light.',        '🐣','#FBBF77', true,'2027-03-20','2027-04-05',302),
  ('easter_funny', 'Funny Easter', 'easter','Easter','Funny', 'Egg hunts gone sideways.',           '🐣','#FBBF77', true,'2027-03-20','2027-04-05',303),
  -- July 4th
  ('july_4th_cute',  'Cute 4th of July',  'july_4th','4th of July','Cute',  'Star-spangled and sweet.',          '🎆','#60A5FA', true,'2027-06-28','2027-07-04',321),
  ('july_4th_funny', 'Funny 4th of July', 'july_4th','4th of July','Funny', 'BBQ chaos and firework fails.',      '🎆','#60A5FA', true,'2027-06-28','2027-07-04',322),
  ('july_4th_spicy', 'Spicy 4th of July', 'july_4th','4th of July','Spicy', 'Summer nights, fireworks flying.',   '🎆','#60A5FA', true,'2027-06-28','2027-07-04',323),
  ('july_4th_epic',  'Epic 4th of July',  'july_4th','4th of July','Epic',  'America, but make it legendary.',    '🎆','#60A5FA', true,'2027-06-28','2027-07-04',324)
ON CONFLICT (key) DO NOTHING;

-- ── get_dream_off_packs: the picker feed (active + in-season, category-filtered) ──
CREATE OR REPLACE FUNCTION public.get_dream_off_packs(p_category text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF p_category IS NOT NULL AND p_category NOT IN ('scene', 'cast') THEN
    RAISE EXCEPTION 'dream_off: bad category';
  END IF;
  SELECT COALESCE(jsonb_agg(row_to_json(p) ORDER BY p.is_holiday, p.sort_order, p.display_name), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT key, display_name, group_key, group_label, tone_label, tagline, emoji, accent,
           has_scene, has_cast, is_holiday, season_start, season_end, sort_order
    FROM public.dream_off_packs
    WHERE is_active
      AND (p_category IS NULL
           OR (p_category = 'scene' AND has_scene)
           OR (p_category = 'cast'  AND has_cast))
      AND (season_start IS NULL OR current_date >= season_start)
      AND (season_end   IS NULL OR current_date <= season_end)
  ) p;
  RETURN v_result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_dream_off_packs(text) TO authenticated;

-- ── deal_topic v3: gate season on the CATALOG (single remote-editable source) ──
CREATE OR REPLACE FUNCTION public.deal_topic(p_game_id uuid, p_pack text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_category text;
  v_topic text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT pack_category INTO v_category
  FROM public.dream_offs
  WHERE id = p_game_id AND owner_id = v_uid AND phase = 'setup';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'dream_off: not your game, or not in setup';
  END IF;
  -- Draw from an ACTIVE, IN-SEASON pack (per the catalog) that offers this
  -- category. A specific p_pack (pack pick) or any qualifying pack (surprise).
  SELECT t.topic_text INTO v_topic
  FROM public.dream_off_topics t
  JOIN public.dream_off_packs p ON p.key = t.pack
  WHERE t.is_active
    AND t.category = v_category
    AND p.is_active
    AND (v_category = 'scene' AND p.has_scene OR v_category = 'cast' AND p.has_cast)
    AND (p_pack IS NULL OR t.pack = p_pack)
    AND (p.season_start IS NULL OR current_date >= p.season_start)
    AND (p.season_end   IS NULL OR current_date <= p.season_end)
  ORDER BY random()
  LIMIT 1;
  IF v_topic IS NULL THEN RAISE EXCEPTION 'dream_off: no topics available'; END IF;
  UPDATE public.dream_offs
    SET topic = v_topic,
        topic_source = CASE WHEN p_pack IS NULL THEN 'surprise' ELSE 'pack' END,
        updated_at = now()
    WHERE id = p_game_id;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (p_game_id, v_uid, 'topic_dealt');
  RETURN jsonb_build_object('topic', v_topic);
END;
$$;
GRANT EXECUTE ON FUNCTION public.deal_topic(uuid, text) TO authenticated;

COMMIT;

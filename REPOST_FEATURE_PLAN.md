# Repost Feature — Architecture & Implementation Plan

Status: **DESIGN APPROVED — not yet implemented** (2026-06-07)
Owner: Kevin + Claude

A "repost" lets a user resurface someone else's public dream into their own audience — it
shows up in their followers' Following feed like a proxy of their own post, and it feeds
Explore as a discovery signal. Modeled on Instagram/X/TikTok/Bluesky plain-repost.

---

## 0. Decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| **Model** | **Pointer-with-attribution**, NOT a duplicate post | Dominant industry model (IG/X/TikTok/Threads/Bluesky/Pinterest). Engagement stays correct on the original for free; deletion propagates for free; canonical-id makes dedup a `GROUP BY`. Tumblr's duplicate model is the lone counter-example and pays for it with denormalized-engagement pain. |
| **Who can repost** | **Users only.** Bots are repost *targets*, never *actors* | Bots aren't "real" users. Users CAN repost bot dreams from the bots feed/profiles (button renders on bot cards). |
| **Quote-repost** | **v2** — v1 is plain repost only | Quote = a new first-class post object + its own engagement + ranking path. Defer. |
| **Self-repost** | **Disallowed** | Avoids feed clutter / self-reach gaming. Your own posts already reach your followers. |
| **Author opt-out** | **Included** (`users.allow_reposts`, default true) | Standard on IG/TikTok/Threads/Bluesky. Bots always allow. Cheap creator control. |
| **Explore inclusion** | **Yes** | A repost is a strong endorsement signal + a propagation edge (Kevin + research). |
| **Engagement** | Likes/comments/fuses always target the **original** `upload_id` | Pointer model — one source of truth. `repost_count` is the only new metric. |

---

## 1. Research grounding (what informed the design)

- **Pointer-with-attribution is dominant** (IG 2025 native repost, X retweet, TikTok, Threads, Bluesky `app.bsky.feed.repost`, Pinterest). The reshare is a small reference record; feeds hydrate the canonical original and tag it "reposted by X." Tumblr's duplicate-trail model is the outlier and special-cases "attribute all notes to the root post."
- **Engagement consolidates on the original** everywhere except quote-posts.
- **Pointer model makes dedup tractable** — every repost references the same `upload_id`, so Explore dedup + "reposted by N" collapse is a `GROUP BY upload_id`, not perceptual image-matching. Decisive for us.
- **A repost is a ranking signal AND a propagation edge.** X's open-sourced Heavy Ranker weights a predicted retweet **2× a like** (1.0 vs 0.5), below comment/dwell. X's UTEG/GraphJet sources *out-of-network* candidates from "things people you follow engaged with" — that's how a repost becomes distribution. IG treats reshares/sends/saves as its most-valued Explore signals.
- **Dedup is the #1 engineering concern.** Mastodon suppresses a boost if the original is already in your recent feed window (`REBLOG_FALLOFF` ≈ 400 items). Bluesky sorts reposts by `min(created_at, indexed_at)` to block back-dating. X applies an exponential author-diversity discount. Threads shipped without good dedup and got complaints.
- **Cascade papers (SEISMIC KDD'15, Cheng WWW'14, TiDeH ICWSM'16):** early reshare *velocity* is the best virality predictor; cascades age/saturate → boost fast, then decay; weight a resharer by reachable audience, not flat.

Full source list in the research appendix at the bottom.

---

## 2. Current architecture (the integration surface)

- **One feed RPC** `get_feed(p_user_id, p_tab, p_seed, p_cursor_score, p_cursor_id, p_bot_user_id)` with three tabs (migration 219):
  - `forYou` — scored: `EXP(-0.05·hrs)·0.25 + engagement terms + is_following·0.15 + random·0.10 + fresh(<4h)·0.20`. **Weighted engagement = `like + 2·comment + 3·fuse + 2·share + 1.5·save`.**
  - `following` — chronological, follows-only, recency-weighted.
  - `bots` — chronological, `is_bot=true` only.
  - Reads the **`uploads`** table directly. Cursor pagination on `(score, id)`. Per-page `applyDiversity()` in `hooks/useDreamFeed.ts`.
- **`post_shares` is a private DM** ("vibe share") — NOT a reshare. Reposts need their own table. (`uploads.share_count` is the DM count and already feeds scoring at 2×.)
- **`uploads`** has no repost/origin columns. Engagement denormalized: `like_count / comment_count / fuse_count / share_count / save_count / view_count`.
- **`follows(follower_id, following_id)`** — simple adjacency, indexed both ways.
- **`DreamCard`** right-side action rail = 6 icons (visibility, like, comment, save, share-DM, fuse). Room for a 7th. (`components/DreamCard.tsx` ~L476–602.)
- **Notifications**: INSERT a row → `trg_notify_send_push` fires push (migration 196). `type` CHECK currently `('post_comment','comment_reply','comment_mention','post_share')`; `subtype` discriminator exists (migration 206).

---

## 3. Data model

### 3.1 `post_reposts` (new table — pointer records)

```sql
CREATE TABLE public.post_reposts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reposter_id uuid NOT NULL REFERENCES public.users(id)   ON DELETE CASCADE,
  upload_id   uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reposter_id, upload_id)              -- one repost per (user, post); toggle = insert/delete
);
CREATE INDEX idx_post_reposts_reposter ON public.post_reposts (reposter_id, created_at DESC);
CREATE INDEX idx_post_reposts_upload   ON public.post_reposts (upload_id);
```

- `ON DELETE CASCADE` on `upload_id` → when the original is deleted, its reposts vanish. **No "stuck repost" tombstones** (the #1 failure mode of the pointer model — X has it, we avoid it structurally).
- No `note` column in v1 (quote = v2 adds it, or a separate `quote_posts`).

### 3.2 `uploads.repost_count` (denormalized for scoring/display)

```sql
ALTER TABLE public.uploads ADD COLUMN repost_count integer NOT NULL DEFAULT 0;
-- trigger on post_reposts INSERT/DELETE → uploads.repost_count +/- 1 (mirror the like_count trigger)
```

### 3.3 `users.allow_reposts` (opt-out)

```sql
ALTER TABLE public.users ADD COLUMN allow_reposts boolean NOT NULL DEFAULT true;
-- Bots: leave true (always repostable). Surfaced as a profile/privacy toggle for humans.
```

### 3.4 Notifications

```sql
-- extend the type CHECK to include 'post_repost'
-- (DROP + re-add the CHECK constraint; per the playbook's signature-change rule for CHECKs)
```

### 3.5 RLS

- `post_reposts`: publicly readable (feeds read it). INSERT/DELETE gated to `auth.uid() = reposter_id` (mirror `follows`/`post_likes`). A **WITH CHECK / trigger** enforces the integrity rules in §6 (public + not-own + author-allows + reposter-not-bot).

---

## 4. RPCs

### 4.1 `toggle_repost(p_upload_id uuid) RETURNS (reposted boolean, repost_count int)`

`SECURITY DEFINER`. Reposter = `auth.uid()`. Logic:
1. Load the target upload. **Reject** if: not `is_public`; `user_id = auth.uid()` (no self-repost); author `allow_reposts = false`; caller `is_bot = true` (bots never repost).
2. If a `(reposter, upload)` row exists → DELETE (un-repost). Else INSERT.
3. On INSERT, write a `'post_repost'` notification to the original author (skip if author `is_bot`).
4. Return new `(reposted, uploads.repost_count)` for optimistic UI reconciliation.

Rate-limited (per the existing rate-limit insert pattern) to blunt repost-spam.

### 4.2 `get_reposters(p_upload_id uuid, limit, cursor)` 

Paginated reposter list for the long-press "Reposted by" sheet (mirror the likes list). Returns user previews ordered by viewer-affinity then recency.

### 4.3 `get_feed` rewrite — see §5.

---

## 5. Feed integration (the core work)

A feed item becomes **either an original post or a repost-of-a-post**. `get_feed` builds a unified candidate set and scores/dedups over it. The RPC return shape gains:

```
surface_type   text       -- 'original' | 'repost'
reposter_id    uuid        -- null for originals
reposter_name  text        -- attribution label source
reposters_more int         -- N-1 when collapsed ("reposted by A and N others")
reposted_at    timestamptz -- repost time (placement timestamp for repost surfaces)
```

### 5.1 Following tab

Union originals-by-followed + reposts-by-followed, **dedup by `upload_id`**, collapse multi-reposter:

```sql
WITH followed AS (SELECT following_id FROM follows WHERE follower_id = p_user_id),
originals AS (
  SELECT u.id AS upload_id, 'original' AS surface, NULL::uuid AS reposter_id, u.posted_at AS eff_ts
  FROM uploads u
  WHERE u.user_id IN (SELECT following_id FROM followed)
    AND u.is_public AND u.posted_at IS NOT NULL  -- + moderation/block filters
),
reposts AS (
  SELECT r.upload_id, 'repost' AS surface, r.reposter_id, r.created_at AS eff_ts
  FROM post_reposts r
  JOIN uploads u ON u.id = r.upload_id
  WHERE r.reposter_id IN (SELECT following_id FROM followed)
    AND u.is_public                                -- + moderation/block filters
),
unioned AS (SELECT * FROM originals UNION ALL SELECT * FROM reposts),
-- collapse to ONE row per upload_id: keep most-recent surface; aggregate reposters
collapsed AS (
  SELECT DISTINCT ON (upload_id) upload_id, surface, reposter_id, eff_ts,
         (SELECT count(*) FROM reposts r2 WHERE r2.upload_id = unioned.upload_id) AS reposter_total
  FROM unioned
  ORDER BY upload_id, eff_ts DESC          -- newest surface wins placement
)
SELECT ... FROM collapsed JOIN uploads ... ORDER BY eff_ts DESC  -- cursor on (eff_ts, upload_id)
```

- **Dedup**: one card per `upload_id` even if you follow the author *and* reposters, or many reposters (Mastodon `REBLOG_FALLOFF` intent, done set-wise).
- **Collapse**: when surface='repost' and `reposter_total > 1`, render "♻ Reposted by {name} and {N-1} others."
- **Placement timestamp**: the surfacing event's time (repost time for reposts) — so a repost resurfaces the post at repost-time, exactly the "proxy post" behavior. Block back-dating with `eff_ts = min(created_at, now())` if needed (Bluesky `sortAt`).
- **Cursor**: `(eff_ts, upload_id)` — replaces the current `(score,id)` for this tab.

### 5.2 Explore (`forYou`) tab — two mechanisms

**(a) Ranking signal.** Add `repost_count` to weighted engagement. A repost is a strong public endorsement — start at **2.0** (≈ a DM-share, above like 1.0 / save 1.5, below fuse 3.0; consistent with X's repost=2×like), tunable:

```sql
(up.like_count + up.comment_count*2 + up.fuse_count*3
 + up.share_count*2 + up.save_count*1.5 + up.repost_count*2.0)::float AS weighted_engagement
```

**(b) Propagation / candidate generation (the growth engine).** Add an out-of-network candidate source: posts **reposted by people you follow** that you wouldn't otherwise see, with a social-proof boost and attribution. UTEG-style — weight by `#distinct followed-reposters × reposter affinity`:

```sql
social_proof AS (
  SELECT r.upload_id,
         count(DISTINCT r.reposter_id)                          AS followed_reposters,
         max(r.created_at)                                      AS last_reposted_at
  FROM post_reposts r
  WHERE r.reposter_id IN (SELECT following_id FROM followed)
  GROUP BY r.upload_id
)
-- these enter the candidate pool with surface='repost', a social-proof score term, and reposter attribution.
```

- **Dedup**: never show the same `upload_id` twice across the original-candidate pool and the social-proof pool — `GROUP BY upload_id`, prefer the higher-scoring/attributed surface.
- **Author diversity**: keep the existing diversity pass; add X's exponential same-author discount `score·((1-0.25)·0.5^pos + 0.25)` (floor 0.25).
- **Velocity / decay (v1.1 tuning)**: boost by early-repost velocity (SEISMIC), decay as the cascade ages (TiDeH) so a peaked post isn't over-shown. v1 can ship without this.

### 5.3 Bots tab + bot cards

- The **bots tab stays bot-authored originals** (a user's repost of a bot dream surfaces in *that user's* Following/Explore, not the bots tab).
- The **repost button + `repost_count` render on bot cards** (bots feed + each bot's profile) so users can repost bot dreams. No change to the bots candidate query beyond returning `repost_count` + the viewer's `reposted` state.

### 5.4 Profile

- New **"Reposts" tab** on the profile (standard IG/TikTok/Threads pattern) — `post_reposts WHERE reposter_id = profile_user` joined to uploads, reverse-chron. Keeps the main grid = the user's own dreams.

### 5.5 Scale

- v1 = **query-time UNION + cursor pagination**. Bounded candidate sets (follow graph) + the indexes in §3.1 keep this tractable; the pointer model means it's a join, not row duplication.
- If/when the graph or repost volume demands it: move to **fan-out-on-write** (a `feed_entries` table written on repost) or a precomputed social-proof table. Deferred — the pointer model lets us upgrade without changing semantics. Flag in code where the query-time approach is the scaling bottleneck.

---

## 6. Integrity & anti-abuse (research-backed)

- **Public-only**; **no self-repost**; **author opt-out** (`allow_reposts`); **bots never repost** — all enforced in `toggle_repost` + an INSERT trigger/WITH CHECK on `post_reposts`.
- **Cascade-delete** on original removal → no tombstones.
- **Affinity-weighted propagation** (RealGraph intent): a repost from a low-affinity / new / low-overlap account contributes ≈0 to Explore sourcing, so reciprocal-repost rings get little reach *structurally* — no explicit ring-detector needed for v1. Cap reposts-per-reposter per Explore session.
- **Negative feedback dominates**: a hide/report should outweigh many reposts (X: report ≫ retweet).
- **Integrity filter before ranking**: reposted candidates pass the same moderation/block/hidden filters as originals.
- **Rate-limit** the repost action.

---

## 7. UI

- **Rail button (7th icon):** `repeat-outline` (Ionicons — the universal repost double-arrow used by X/Threads/TikTok), with `repost_count` beneath. Filled + accent-green when the viewer has reposted. **Instant optimistic toggle**, no confirm dialog (Bluesky pattern). Long-press → "Reposted by" sheet (mirror the likes long-press). Place after `fuse` (or swap with share-DM ordering — TBD in implementation).
- **Hidden/disabled** when: own post, post not public, or author `allow_reposts = false`.
- **Repost attribution header** on a feed card where `surface='repost'`: a small "♻ Reposted by @{name}{ and N others}" row above the existing author credit; tappable → reposters sheet. The original author stays credited on the card (pointer model).
- **`useToggleRepost`** hook mirroring `useToggleLike` (optimistic + reconcile from `toggle_repost` return). Invalidate feed + profile-reposts query keys.
- **Profile "Reposts" tab.**
- **Settings:** "Allow others to repost my dreams" toggle (writes `users.allow_reposts`).

---

## 8. Notifications

- `'post_repost'` notification to the original author on repost (skip bot authors). Body: "{actor} reposted your dream." Aggregated via the existing `get_inbox` grouping → "{A} and {N} others reposted your dream." Auto-pushes via `trg_notify_send_push`. Reader (`app/inbox.tsx`) routes on the new type.

---

## 9. Rollout (each phase shippable + testable)

1. **Data + RPCs** — `post_reposts`, `repost_count` trigger, `users.allow_reposts`, `'post_repost'` notification type, `toggle_repost()`, `get_reposters()`. Regenerate `types/database.ts`. db-spec tests for the toggle + integrity guards.
2. **UI** — rail button + optimistic `useToggleRepost` + repost-attribution header + the opt-out setting. Works against the new RPCs before feeds change (reposts exist, just not yet surfaced).
3. **Feeds** — `get_feed` rewrite: **Following** (union + dedup + collapse) → **Explore** (signal + social-proof candidates + dedup) → **Bots cards** (return `repost_count` + `reposted`). Profile "Reposts" tab.
4. **Notifications** + inbox aggregation + push copy.
5. **Anti-abuse / ranking tuning** — affinity weighting, session caps, velocity/decay (SEISMIC/TiDeH), diversity discount.
6. **v2 (later):** quote-repost (new post object embedding the original), per-account repost mute, "reposted by N" richer surfaces.

---

## 10. Open items for implementation

- Exact `repost_count` coefficient in Explore (start 2.0, tune empirically — public weights are base-rate-calibrated, not portable).
- Following dedup surface priority when you follow the author AND a reposter (show as original vs as repost) — propose: **original wins** if the original is within the recency window, else show the repost surface.
- Card rail ordering (where the repost icon slots vs share-DM/fuse).
- Whether the Explore social-proof source is gated behind a min-affinity threshold from day one (recommended).

---

## Appendix — research sources

**Product/model:** Instagram native Repost (Techuncode, Buffer, Inro/FilterGrade on recommendation-dedup) · TikTok Repost (Conbersa, CapCut) · X Retweet+Quote (MeetEdgar, Marketing Heaven) · Threads (SearchEngineJournal, Threads official) · Tumblr reblog/NPF trail (Tumblr Engineering "How Reblogs Work") · Bluesky `app.bsky.feed.repost` + `reasonRepost` (docs.bsky.app, atproto discussion #2702) · Pinterest repin (Sprout, WP Tasty).

**Ranking/propagation:** X open-sourced algorithm — Heavy Ranker weights (retweet 1.0 vs fav 0.5), UTEG/GraphJet out-of-network sourcing, author-diversity discount (github.com/twitter/the-algorithm, the-algorithm-ml, awesome-twitter-algo) · Instagram Explore value model + two-tower retrieval + "no same author in sequence" (engineering.fb.com 2023, Mosseri "how Instagram works") · Mastodon `REBLOG_FALLOFF` boost dedup (PR #21532) · Bluesky `sortAt` (atproto/DeepWiki).

**Academic:** SEISMIC (Zhao KDD'15) · TiDeH (Kobayashi ICWSM'16) · "Can Cascades Be Predicted?" (Cheng WWW'14) · "A Survey of Information Cascade Analysis" (Zhou ACM CSUR'21). Net: early reshare velocity is the dominant virality predictor; weight resharers by reachable audience; decay aged cascades.

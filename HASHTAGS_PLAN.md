# Hashtags — research + implementation plan (2026-07-05)

Tappable #hashtags in post captions → a tag page showing all matching public posts. Researched
against the major apps, grounded in current code seams. Status: PLANNED, not built.

## 1. How other apps do it

| App | Tap behavior | Tag page | Extras |
|---|---|---|---|
| Instagram | #tag in caption/comment is a link | Dedicated page: big #tag header, post count, GRID (Top + Recent tabs) | Follow-a-hashtag; tags rank in search with counts |
| TikTok | Same | Tag page with aggregate view count + video grid | Hashtag challenges (their growth engine) |
| X/Twitter | Same | Not a page — a pre-filled SEARCH results view (Top/Latest) | Trending topics |
| Threads | One "topic tag" per post (no # rendering) | Topic feed | Deliberately anti-hashtag-spam |
| Facebook/LinkedIn | Link → feed of posts | Simple reverse-chron feed | Follow-tag on LinkedIn |

**Takeaway:** Kevin's instinct is exactly the convention — tap → a search-like screen headed by the
tag with a grid of matching posts. For a grid-first app the IG shape fits us best: `#tag` header +
post count + PostGrid, reverse-chron v1 (a "Top" tab ranked by likes is a clean v2).

## 2. The DreamBot-specific insight: BOTS SEED THE ECOSYSTEM

Hashtags on a young network die of emptiness — a user taps #dragon and sees 2 posts. We have an
unfair advantage: 18 bots posting 4×/day. Give each bot (or path) 2-3 genre hashtags appended to
its caption (#fantasy #dragons / #cozy #miniature / #ocean #wildlife) and every core tag page is
ALIVE from day one, with fresh content daily. This turns hashtags from a ghost town into a
browsing surface immediately, and user posts join already-warm tags. (Bot captions are currently
`[path] BotName` — the `caption()` hook in each bot module is the seam.)

## 3. Data model (server)

**Join table + write-time extraction** (the classic; ILIKE-at-query-time is unindexable, and an
array+GIN column complicates counts):

```sql
CREATE TABLE public.post_hashtags (
  upload_id  uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  tag        text NOT NULL,            -- normalized: lowercase, no '#'
  created_at timestamptz NOT NULL DEFAULT now(),  -- copy of post time for feed ordering
  PRIMARY KEY (upload_id, tag)
);
CREATE INDEX post_hashtags_tag_idx ON public.post_hashtags (tag, created_at DESC);
```

- `extract_hashtags(text) RETURNS text[]` — SQL fn, regex `#([a-z0-9_]{2,30})` on the lowercased
  caption, dedup. (Caption is already sanitized by the migration-279 trigger before this runs.)
- Trigger on `uploads` INSERT + UPDATE OF caption: diff-sync `post_hashtags` rows (delete stale,
  insert new, created_at = COALESCE(posted_at, now())).
- RPCs (both SECURITY DEFINER, block-aware via `block_exists`, is_public-only):
  - `get_hashtag_posts(p_viewer uuid, p_tag text, p_limit int, p_offset int)` — joins uploads,
    returns the POST_SELECT-compatible shape, reverse-chron.
  - `search_hashtags(p_prefix text, p_limit int)` — tag + post count for search results
    (`WHERE tag LIKE p_prefix || '%' GROUP BY tag ORDER BY count DESC`).
- One-time backfill: `INSERT INTO post_hashtags SELECT id, unnest(extract_hashtags(caption)), ...
  FROM uploads WHERE caption ~ '#'` (idempotent ON CONFLICT DO NOTHING).
- RLS: SELECT for anon+authenticated; no client writes (trigger-only).

## 4. Client

1. **Linkify** — `lib/hashtags.ts`: shared regex + a caption-renderer that splits on
   `/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_.]+)/` and renders both tag + mention links (CommentRow already
   does this split for mentions — extract/share the pattern, and remember the comment-nav lesson:
   **nav.push, never replace**). Apply to the DreamCard caption text (feed + fullscreen); comments
   optionally in v1.1.
2. **Tag page** — `app/hashtag/[tag].tsx`: gradient `#tag` header + "N dreams" count +
   **PostGrid** (already reusable — same tile/album machinery as profiles) fed by
   `useHashtagPosts(tag)` infinite query on the RPC. Back = normal stack pop.
3. **Search integration** — the Top tab IS the search surface (`app/(tabs)/top.tsx`,
   useSearchUsers): add a "Tags" section above user results when the query matches/starts with
   `#`, each row `#tag · N posts` → pushes the tag page.
4. **Compose** — nothing required (users just type # in the caption; the trigger does the rest).
   v2: autocomplete popup while typing # in newPost.
5. **Bots** — per-bot/per-path `captionHashtags` in the bot modules; `caption()` appends
   ` #tag1 #tag2`. One shared helper in botEngine; curated tag vocabulary per bot (playbook gets a
   short section so agents keep tags on-brand).

## 5. Edge cases & safety

- Tag normalization: lowercase, 2-30 chars, `[a-z0-9_]` only (regex enforces; no unicode v1).
- Post goes private / deleted → rows vanish via the trigger diff / ON DELETE CASCADE... note:
  private flip keeps caption, so the tag page RPC MUST filter `is_public` (it does) — optionally
  the trigger could also prune on is_public=false, but filter-at-read is sufficient and keeps
  re-posting cheap.
- Blocked users: RPC filters via block_exists (same as get_inbox migration 305).
- Spam: cap tags per post at parse time (first 10) so a 500-char tag-wall doesn't bloat the table.
- Old app builds: unaffected — captions render as plain text there; the table/trigger are additive.

## 6. Build order + estimate

1. Migration: table + fn + trigger + RPCs + backfill (~1.5h) → Kevin applies → types regen.
2. lib/hashtags + caption linkify + tag page + useHashtagPosts (~2h).
3. Top-tab search section (~1h).
4. Bot captionHashtags + per-bot tag curation (~1h, separate commit; needs Kevin's tag vocabulary
   sign-off per bot).
5. QA: tap-through from feed/fullscreen/comments, pagination, block filtering, backfilled tags.

**Total: roughly a day.** Client pieces ship with the next build; tag pages work immediately for
new/backfilled captions once the migration lands.

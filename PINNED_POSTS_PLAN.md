# Pinned Posts — research + implementation plan (2026-07-05)

Allow users to pin posts to the top of their profile grid. Researched against the major apps,
grounded in the current DreamBot code seams. Status: PLANNED, not built.

## 1. How other apps do it

| App | Limit | Placement | Badge | Notes |
|---|---|---|---|---|
| Instagram | **3** (posts or reels) | Top of profile grid, pin order | 📌 pin glyph top-right of tile | Pinning a 4th → error, must unpin first |
| TikTok | **3** videos | Top of profile grid | "Pinned" label ribbon on tile | Same reject-at-cap behavior |
| X/Twitter | **1** | Above timeline | "Pinned" label | Pinning a new one silently replaces the old |
| Facebook | 1 per profile/page | Top of timeline | "Pinned post" label | |
| LinkedIn | multiple | Separate "Featured" section | n/a | Different pattern (curated shelf, not grid) |

**Takeaway:** the grid-profile convention (IG/TikTok — our exact profile shape) is **3 pins, pin
badge on the tile, pins first then reverse-chron, reject at cap**. X's replace-silently model fits
single-pin timelines, not grids.

## 2. Recommendation for DreamBot

- **Limit 3** (engine-config-tunable: `engine_config.max_pinned_posts`, default 3).
- Pins affect the **profile Posts grid only** — feed/Explore/Top unaffected (IG semantics).
- Pin badge on the grid tile (accent pin glyph, top-left corner — top-right hosts nothing today,
  either works; mirror the existing `isHighlighted` overlay pattern in PostTile).
- At the cap: reject with a friendly alert ("You can pin 3 posts — unpin one first"). v2 option:
  offer "Replace oldest pin" action.
- Only `is_public` posts are pinnable; flipping a pinned post private auto-unpins.
- Works for bot accounts for free (service-role script can pin Kevin's hearted keepers to bot
  profiles — nice curation win, zero extra code).

## 3. Data model (server)

**Column, not a join table:** `uploads.pinned_at timestamptz NULL`. Pinned = `pinned_at IS NOT NULL`.
Ordering falls out of one ORDER BY — which keeps range pagination correct with zero prepend logic:

```sql
ORDER BY pinned_at DESC NULLS LAST, posted_at DESC NULLS LAST
```

Migration (next free number at build time — check, agents are minting numbers daily):

1. `ALTER TABLE public.uploads ADD COLUMN pinned_at timestamptz;`
2. **⚠ COLUMN-GRANT LAW (migration 278):** uploads uses column-level grants — the new column is
   invisible until `GRANT SELECT (pinned_at) ON public.uploads TO anon, authenticated;`
   Deliberately NO client UPDATE grant — writes go through the RPC so the cap is enforced.
3. `CREATE INDEX uploads_pinned_idx ON public.uploads (user_id, pinned_at DESC) WHERE pinned_at IS NOT NULL;`
4. RPCs (SECURITY DEFINER, auth.uid() ownership checks):
   - `pin_post(p_upload_id uuid)` — verify owner + `is_public`; count existing pins
     (`user_id = auth.uid() AND pinned_at IS NOT NULL`); `>= max_pinned_posts` → RAISE
     `pin_limit_reached`; else `SET pinned_at = now()`.
   - `unpin_post(p_upload_id uuid)` — verify owner; `SET pinned_at = NULL`.
5. Trigger: on `uploads` UPDATE, `IF NEW.is_public = false AND NEW.pinned_at IS NOT NULL THEN
   NEW.pinned_at := NULL` (auto-unpin on un-posting). Delete needs nothing (row goes with it).
6. After Kevin applies: regenerate types (`supabase gen types typescript`) — never hand-edit.

## 4. Client changes

- **`lib/mapPost.ts`** — add `pinned_at` to `POST_SELECT` + `DreamPost` (`isPinned` boolean is fine).
- **`hooks/useUserPosts.ts` + `hooks/usePublicProfilePosts.ts`** — add
  `.order('pinned_at', { ascending: false, nullsFirst: false })` BEFORE the existing `posted_at`
  order. Pagination untouched (pins are simply the first rows of the same ordered stream).
- **`components/PostTile.tsx`** — pin badge overlay when `item.pinned_at` (small accent circle +
  Ionicons `pin`, same corner treatment as the isHighlighted ring).
- **Long-press sheet** (the global `handleImageLongPress` flow PostTile already calls) — own posts
  get a "Pin to profile" / "Unpin from profile" row. New `usePinPost` mutation pair: optimistic
  update of the `['userPosts']` infinite-query cache (move/mark the row), invalidate on settle;
  `pin_limit_reached` error → the friendly cap alert.
- **`app/photo/[id]`** album pager — no change (it consumes the same hooks' order).
- Reposts tab unaffected (pins are Posts-grid only).
- Analytics: `post_pinned` / `post_unpinned` capture.

## 5. Edge cases checklist

- Cap enforced server-side only (client alert is UX, not the guard).
- Pinned + made-private → trigger unpins (and the grid query filters `is_public` anyway).
- Blocked-viewer visibility: unchanged (same SELECT path, same RLS).
- A pinned post deleted by moderation: row deleted, nothing dangles.
- Old app builds: unaffected (they don't select the column; ordering change is server-agnostic —
  wait, ordering lives in the CLIENT query here, so old builds simply keep reverse-chron. Fine.)
- Bot pinning script (follow-up): `scripts/pin-bot-posts.js` — service role bypasses the RPC and
  sets `pinned_at` directly on hearted keepers.

## 6. Build order + estimate

1. Migration + RPCs + trigger (~1h) → Kevin applies → types regen.
2. Hooks + mapPost + mutation pair (~1h).
3. Tile badge + long-press rows + cap alert (~1-1.5h).
4. QA on sim: pin/unpin/cap/private-flip/pagination-boundary (pin count > page boundary), own +
   public profile views.

Total: roughly half a day including QA. No app-store dependency beyond the normal next build.

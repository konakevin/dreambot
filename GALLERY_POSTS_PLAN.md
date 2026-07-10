# Gallery Posts (multi-image / carousel) — End-to-End Design

**Status:** design/research, nothing built. Author: Claude, 2026-07-09.

Goal: let a post carry up to **10 images** that the user swipes through horizontally, with a
small dot indicator showing position (Instagram/TikTok carousel). Covers the data model, the
feed card carousel, the create/multi-select/description flow, and every secondary surface.

Naming note: the word "album" is already taken — `hooks/useAlbumPosts.ts` is a *viewer* over a
list of separate single-image posts. This feature is a **gallery post** (one post, many images).

---

## 0. The one decision that changes everything (DECIDE FIRST)

**What are the images the user picks?**

- **Option A — the user's own generated dreams** (multi-select from their dream library). Aligned
  with today's model: every image already lives in the `uploads` bucket with a thumbhash + display
  variant, is already AI-safe, and needs no new moderation. Lowest risk, fastest.
- **Option B — raw photos from the camera roll** (true Instagram-style UGC). This is a **new content
  class** the app has never had: today *every* feed image is AI-generated. It opens a real
  content-safety liability — **there is no image moderation pipeline** (SightEngine was removed;
  `276_server_moderation.sql` is text-only). Shipping raw user photos to a public feed with zero
  nudity/CSAM scanning is a launch blocker, not a detail.

**Recommendation: ship Option A first** (group your own dreams into a carousel), and treat Option B
as a separate, later effort gated on standing up image moderation. Option A delivers the exact UX
Kevin described with none of the safety/upload/thumbhash-on-client work. Everything below is written
so the **rendering + schema are identical for both**; only the *create* screen's image source and
the upload/moderation path differ. If Kevin wants B, the schema and carousel here still stand — we
add a client upload+moderation leg to the create flow.

The rest of this doc assumes the shared parts, and calls out A-vs-B where they diverge.

---

## 1. Data model — child table, cover-image backward-compat

**Principle that shrinks the blast radius to almost nothing: keep `uploads.image_url` as the COVER.**

A post stays one `uploads` row. Its existing scalar image columns (`image_url`,
`image_url_display`, `image_url_hq`, `thumbhash`, `width`, `height`) keep meaning "the cover / first
image." Every current surface that reads them keeps working unchanged (grid tile, inbox thumbnail,
repost card, web og:image, realtime, likes/comments/reposts/saves — all verified to key off
`uploads.id` or the cover scalar). We ADD the extra images in a child table.

### New table `upload_media`
```sql
create table public.upload_media (
  id            uuid primary key default gen_random_uuid(),
  upload_id     uuid not null references public.uploads(id) on delete cascade,
  position      smallint not null,                 -- 0-based order; 0 == cover
  image_url         text not null,
  image_url_display text,
  image_url_hq      text,
  image_url_hq_generated_at timestamptz,
  thumbhash     text,
  width         integer,
  height        integer,
  created_at    timestamptz not null default now(),
  unique (upload_id, position)
);
create index upload_media_upload_idx on public.upload_media (upload_id, position);
alter table public.upload_media enable row level security;
-- Read: same visibility as the parent upload (public feed). Write: owner only.
-- Mirror uploads' policies via an EXISTS on the parent, OR service-role-only writes
-- if the create flow goes through an edge function (see §4).
```
Plus a cheap denormalized flag on `uploads` so any surface can detect "is a gallery" and count
without a join:
```sql
alter table public.uploads add column media_count smallint not null default 1;
```
`media_count = 1` for every existing/single post (default covers the backfill for free).
Gallery posts set it to N.

**Why child table over a `media` JSONB column:** per-image `image_url_hq` (upscale writes back per
image), clean `ORDER BY position`, real FK/cascade, and it sidesteps the 278 column-grant footgun on
`uploads` (JSONB would still need a grant + every insert path updated). The child table needs its own
GRANTs + RLS once, then it's clean.

**GRANT footgun reminder (hard rule):** `upload_media` needs explicit table GRANTs (SELECT to
`anon, authenticated`; INSERT/UPDATE/DELETE to `authenticated` scoped by RLS, or writes via edge
fn as service-role). `uploads.media_count` needs adding to the migration-278 `GRANT UPDATE (...)`
column list (or it's written only server-side). Miss this and the client silently can't read/write it.

### Feed RPC (`get_feed`) — aggregate the media
Add one column to the `RETURNS TABLE` and projection: a `media jsonb` built from a correlated
`json_agg`:
```sql
media => (
  select coalesce(json_agg(json_build_object(
           'url', m.image_url, 'display', m.image_url_display,
           'hq', m.image_url_hq, 'thumbhash', m.thumbhash,
           'width', m.width, 'height', m.height) order by m.position), '[]'::json)
  from public.upload_media m where m.upload_id = up.id
)
```
For single-image posts this returns `[]` and the client falls back to the cover scalar — zero rows
in `upload_media` for legacy posts, so no backfill needed. (`DROP FUNCTION` before `CREATE OR
REPLACE` since the return shape changes — same discipline as migration 352.)

---

## 2. The carousel component (feed card)

Render stack today: `FullScreenFeed` → `VerticalPager` → `FeedCard` → `DreamCard`, and `DreamCard`
renders one `<expo-image>` full-bleed (`contentFit: cover`, thumbhash placeholder, width/height
ignored). We replace that single `<Image>` (DreamCard.tsx ~369-430) with a `<GalleryCarousel>` when
`media.length > 1`, and render the plain single `<Image>` otherwise (no behavior change for the 99%).

`<GalleryCarousel>`:
- Horizontal Reanimated `translateX` pager over the N images, each a full-bleed `<expo-image>` with
  its own thumbhash placeholder. Lazy: mount current ± 1, like VerticalPager already does vertically.
- Prefetch neighbors via `ExpoImage.prefetch` (pattern already in `useDreamFeed.ts:144`).
- Keep `contentFit="cover"` full-bleed to match the existing look; per-image aspect is optional
  polish (width/height are in the media rows if we want letterbox later).

### Gesture strategy (the hard part — verified conflict)
Two gesture layers already fight for the horizontal axis:
- **VerticalPager** owns vertical (`Gesture.Pan().activeOffsetY([-12,12])`) and on the main feed sets
  `failOffsetX([-16,16])` so a horizontal drag *fails the vertical pan* and hands off
  (`horizontalFailOffset={16}`, `null` on detail views).
- **DreamCard** owns **swipe-left-to-profile** (`activeOffsetX(-20)`) + pinch, via `useCardGestures`.
  Right-swipe currently does nothing.

Plan for gallery cards:
1. **Disable swipe-left-to-profile** on gallery cards — the `disableSwipeToProfile` flag already
   exists and threads `FullScreenFeed → DreamCard → useCardGestures`. Set it when `media.length > 1`.
   (Profile is still reachable via the avatar tap.)
2. Keep the vertical pager's `failOffsetX([-16,16])` so a decisive horizontal drag releases the
   vertical pan, then the carousel's own `Gesture.Pan().activeOffsetX([-16,16])` picks it up. Wire
   `requireExternalGestureToFail`/`simultaneousWithExternalGesture` between the carousel pan and the
   pager pan so the vertical pager can't steal an in-progress horizontal swipe.
3. **Rubber-band at both ends** (first image: swipe-right resists; last: swipe-left resists) so an
   edge swipe doesn't dead-end or accidentally trigger vertical/profile nav.
4. Double-tap-to-like stays (it's a `Pressable` tap, arbitrates against pan on movement); single-tap
   still toggles the HUD. A near-stationary swipe-end could misread as a tap — enforce a small
   movement threshold before the carousel consumes, and let taps below it pass to the Pressable.

### Page indicator (dot strip)
The bottom band is dense: `postInfo` (caption/username) is bottom-left with `right:60` reserved, and
the action rail is bottom-right (`right:12`). Put a **centered dot row just ABOVE `postInfo`** (clear
of the right rail), fading with the HUD. N dots, active one wider/brighter; cap the visual at ~10.
Alternative: top-center (that region is clear except the transient model badge). Recommend
above-caption to match Instagram muscle memory.

---

## 3. Profile grid + "is a gallery" badge
`PostTile.tsx` renders one `<Image src={image_url}>` — unchanged (it reads the cover). Add a **stack
badge** (the IG carousel-corner icon) as a sibling absolute `<View>` when `item.media_count > 1`.
**Top-right corner is free** (pin owns top-left, "Public" owns bottom-right). Purely additive; needs
`media_count` threaded onto the grid item type. Tap still opens `/photo/{id}` which renders the same
`DreamCard` carousel.

---

## 4. Create flow — new screen `app/post/new-gallery.tsx`

Reuses a lot; the divergence is the image source (Option A vs B).

**Shared UI:** a selected-images strip (horizontal thumbnails, remove-per-image, count `n/10`), a
`description` `<TextInput>` (reuse newPost's, `maxLength 500`, `moderateText` text gate → writes
`uploads.description`), and a Post button. Reorder in v1 = **selection order** (ship without drag);
add long-press-drag reorder later (no lib installed — build from gesture-handler + reanimated, or add
`react-native-reorderable-list`).

**Option A (own dreams):** the "picker" is a multi-select grid over the user's dream library
(`my-dreams` query already exists). Selected images are **already persisted** (URL, display,
thumbhash, dims all present) — no upload, no thumbhash work. Post = create/reuse one `uploads` row as
the cover (position 0 = first selected), insert `upload_media` rows for positions 0..N-1 (or 1..N-1
if cover stays only on `uploads`), set `media_count`, then the normal publish (`is_public`,
`posted_at`, `description`). All direct-to-PostgREST like today's `newPost.tsx`.

**Option B (camera roll):** `launchImageLibraryAsync({ allowsMultipleSelection: true, selectionLimit:
10 })` (deps installed; multi-select not used anywhere yet). Each image: `normalizeImageToJpeg`
(exists) → upload to a **capped, client-written bucket** (mirror `cast-photos`/`avatars`; NOT the
uncapped server `uploads` bucket) → generate **thumbhash client-side** (the `thumbhash` npm package
IS installed; server-side `thumbhashGen` is edge-only today) → build a display variant client-side.
Then insert cover + `upload_media`. **Plus the moderation blocker:** every image must pass image
moderation before `is_public=true`. Since none exists, Option B needs a moderation edge function
(or a provider) stood up first — this is why Option A ships first.

Because Option B introduces multi-step client upload + moderation, consider routing gallery publish
through a **`create-gallery-post` edge function** (validates ≤10, dedups, writes cover + media +
media_count atomically as service-role, runs moderation for B). Option A can stay direct-PostgREST.

---

## 5. Secondary surfaces (verified blast radius)

**Free (key off `uploads.id`, inherit the gallery automatically):** likes, comments, reposts, saves,
reports, and the realtime uploads subscription (it ignores the row payload, just invalidates cache).
No change.

**Show the cover only unless extended (each reads one `image_url`/variant):**
- **Web `/post/[id]`** (`dreambot-web/app/post/[id]/route.ts`, plain HTML route): `og:image` +
  `twitter:image` + the `<img>` use `post.image_url`. v1: cover for og/twitter; body renders all
  images as a CSS `scroll-snap` row. Extend the `get_shared_post` RPC (app-repo migration) to return
  the media array.
- **Inbox thumbnail** (`get_inbox_*` RPCs return `upload_image_url` scalar) and the **repost feed
  card** — both show the cover. Fine as-is; a small stack badge is optional polish.

**The one structural break — Upscale:** `upscale-image` assumes one `image_url` → one `image_url_hq`
per upload row (`upscale-image/index.ts:110,258`; `upscalePoll.ts`, `UpscaleOverlay.tsx`,
`imageLongPress.ts` all key by upload id). With the child table, `image_url_hq` lives **per
`upload_media` row**, so upscale keys on `(upload_id, position)` = the currently-viewed image. v1:
scope upscale to the **currently-visible** carousel image (pass position), or restrict to the cover
and enable per-image later.

---

## 6. Migration + change checklist (Option A first)

**DB (one migration, Kevin runs it):**
1. `create table upload_media` + index + RLS + GRANTs.
2. `alter table uploads add column media_count smallint not null default 1;` + add to the 278
   `GRANT` list if client-written (else server-only).
3. `DROP FUNCTION get_feed(...)` then `CREATE OR REPLACE` with the `media` json_agg column + grant.
4. Extend `get_shared_post` to return the media array.
5. Regenerate `types/database.ts` after apply (never hand-edit — house rule).

**App client:**
- `lib/mapPost.ts` — map `row.media` into `DreamPostItem` (also finally carry `media_count`); today
  it drops even `width`/`height`.
- `DreamCard.tsx` — `<GalleryCarousel>` when `media.length > 1`, else the current single `<Image>`.
- New `hooks/gestures/useCarouselGesture.ts` + the pager/profile-swipe wiring in `useCardGestures` /
  `VerticalPager` / `FullScreenFeed`.
- `PostTile.tsx` — stack badge when `media_count > 1` (top-right).
- New `app/post/new-gallery.tsx` + a create entry point.
- Upscale: thread the visible position.

**Web (`dreambot-web`):** `post/[id]/route.ts` — media-aware body + cover og:image.

**Tests:** `get_feed` media aggregation dbspec; carousel gesture routing unit test; the `media.length
> 1 ? carousel : image` branch (lock it so single posts never regress into carousel mounting).

---

## 6b. Build status (2026-07-09)
BUILT (migration 356 applied; tsc + jest green):
- Schema: `upload_media`, `uploads.media_count` (trigger-maintained), `engine_config.gallery_max_images`,
  `get_feed.media`, `get_shared_post.media`. `types/database.ts` regenerated (also cleared the audit's
  353/354/355 drift).
- Feed read: `GalleryImage` + `media`/`media_count` on `DreamPostItem`; `mapMedia` handles BOTH the RPC
  jsonb shape and the `upload_media` embed (sorted by position); `POST_SELECT` embeds `upload_media`
  so grid → photo-detail carousels too. Locked by `__tests__/lib/galleryMedia.test.ts`.
- Card: `components/GalleryCarousel.tsx` (horizontal pan claims horizontal only, rubber-bands, windows
  ±1) + dot indicator above the caption; swipe-to-profile auto-disabled on gallery cards.
- Grid: `PostTile` stack badge (top-right) when `media_count > 1`.
- Create: `app/post/new-gallery.tsx` (select own dreams → compose/describe → publish) + `lib/publishGallery.ts`
  (host-private → media rows → publish); entry point = the images icon in the profile top bar.
- Share/save action + share link target the CURRENTLY-VIEWED gallery image (not always the cover).
- Web: `dreambot-web` `/post/[id]` renders a scroll-snap strip + dots; og:image stays the cover.

DEFERRED (documented, not blocking a test):
- **On-demand upscale of a NON-cover gallery image.** The share/save action already targets the visible
  image, and a sub-image with a pre-existing `image_url_hq` (from its source dream) saves HD fine. But
  upscaling a sub-image that has no HQ yet still needs the `upscale-image` edge fn + `upscalePoll` +
  `UpscaleOverlay` to key on `(upload_id, position)` / an `upload_media` row. Not done — too risky to the
  working single-image upscale pipeline to rush. Scoped for a focused follow-up.
- Inbox thumbnail + repost-card stack badge (cosmetic; both correctly show the cover today).
- Drag-to-reorder in the create screen (v1 order = selection order).

## 7. Phased rollout
1. **Schema + feed read** — `upload_media`, `media_count`, `get_feed.media`, mapPost, and the
   carousel rendering behind a feature flag (seed one test gallery by hand → verify swipe, dots,
   gestures, grid badge, likes still work). No create UI yet.
2. **Create (Option A)** — multi-select own dreams, reorder-by-selection, description, publish.
   Ship. This is the full feature for AI-native content.
3. **Web + inbox/repost badges + per-image upscale** — polish the secondary surfaces.
4. **(Later, gated) Option B** — camera-roll UGC: capped bucket, client thumbhash/resize, and the
   image-moderation edge function that must exist before raw photos hit a public feed.

## 8. Decisions (locked 2026-07-09)
- **Source: Own dreams only (Option A).** Multi-select from the user's generated dreams. No camera-roll
  UGC, so no image-moderation work and no new bucket. Option B is explicitly deferred.
- **Immutable** — a gallery is final once posted (matches today's posts). No edit UI.
- **Upscale: current image** — HD upscales whichever carousel image is on screen (keys on
  `upload_id` + `position`; `image_url_hq` lives per `upload_media` row).
- **Cap: `engine_config`-tunable** — `gallery_max_images` (default 10), dashboard-changeable.
- **Single-source** — since Option A only, a gallery is all dreams (mixed is moot until Option B).

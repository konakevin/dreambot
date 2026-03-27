# Comments System — Implementation Plan

> Paste this file back to Claude at the start of a new session and say "implement the comments system from the plan". Everything needed is here.

---

## Design Decisions (already confirmed with Kevin)

- **Two levels max**: top-level comments + one reply level. Replies to replies are blocked at the DB level via trigger.
- **No editing**: comments are immutable. Delete only.
- **Likes on comments**: heart icon, optimistic toggle.
- **Comment count** shown on SwipeCard (home feed) and photo detail footer.
- **Bottom sheet UI**: slides up from bottom, built from scratch with Reanimated 4 + Gesture Handler (already installed). Do NOT add @gorhom/bottom-sheet — it's a native module requiring Xcode rebuild.
- **Pagination**: cursor-based (not offset), 20 comments per page via `useInfiniteQuery`.
- **Replies lazy**: not fetched until user taps "View N replies". Each thread cached independently.

---

## Step 1 — Migration (run in Supabase dashboard SQL editor)

File: `supabase/migrations/012_comments.sql`

```sql
-- ─── 1. Add comment_count to uploads ─────────────────────────────────────────
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS comment_count integer DEFAULT 0 NOT NULL;

-- ─── 2. Comments table ────────────────────────────────────────────────────────
CREATE TABLE public.comments (
  id         uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  upload_id  uuid        NOT NULL REFERENCES public.uploads(id)  ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.users(id)    ON DELETE CASCADE,
  parent_id  uuid        REFERENCES public.comments(id)          ON DELETE CASCADE,
  body       text        NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
  created_at timestamptz DEFAULT now() NOT NULL,
  is_active  boolean     DEFAULT true  NOT NULL,
  reply_count integer    DEFAULT 0     NOT NULL,
  like_count  integer    DEFAULT 0     NOT NULL
);

-- ─── 3. Comment likes (composite PK — no duplicate likes) ─────────────────────
CREATE TABLE public.comment_likes (
  comment_id uuid        NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.users(id)    ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (comment_id, user_id)
);

-- ─── 4. Indexes ───────────────────────────────────────────────────────────────
-- Paginate top-level comments by recency
CREATE INDEX comments_upload_toplevel_idx
  ON public.comments(upload_id, created_at DESC)
  WHERE parent_id IS NULL;

-- Fetch replies per parent
CREATE INDEX comments_parent_id_idx
  ON public.comments(parent_id, created_at ASC)
  WHERE parent_id IS NOT NULL;

-- User's own comments (for delete)
CREATE INDEX comments_user_id_idx ON public.comments(user_id);

-- ─── 5. RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "comment_likes_select" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "comment_likes_insert" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comment_likes_delete" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ─── 6. Trigger: enforce max 2 nesting levels ────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_comment_depth()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.comments
      WHERE id = NEW.parent_id AND parent_id IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Cannot reply to a reply (max 2 levels)';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_comment_depth
  BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.check_comment_depth();

-- ─── 7. Trigger: maintain reply_count on parent comment ──────────────────────
CREATE OR REPLACE FUNCTION public.maintain_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE public.comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE public.comments SET reply_count = GREATEST(0, reply_count - 1) WHERE id = OLD.parent_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_reply_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.maintain_reply_count();

-- ─── 8. Trigger: maintain comment_count on uploads (top-level only) ───────────
CREATE OR REPLACE FUNCTION public.maintain_upload_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NULL THEN
    UPDATE public.uploads SET comment_count = comment_count + 1 WHERE id = NEW.upload_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NULL THEN
    UPDATE public.uploads SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.upload_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_upload_comment_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.maintain_upload_comment_count();

-- ─── 9. Trigger: maintain like_count on comments ─────────────────────────────
CREATE OR REPLACE FUNCTION public.maintain_comment_like_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_comment_like_count
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION public.maintain_comment_like_count();

-- ─── 10. Update get_feed RPC to include comment_count ────────────────────────
-- Must DROP first — Postgres cannot change return type in-place
DROP FUNCTION IF EXISTS public.get_feed(uuid, integer);

CREATE FUNCTION public.get_feed(p_user_id uuid, p_limit integer DEFAULT 50)
RETURNS TABLE(
  id            uuid,
  user_id       uuid,
  categories    text[],
  image_url     text,
  media_type    text,
  thumbnail_url text,
  width         integer,
  height        integer,
  caption       text,
  created_at    timestamptz,
  total_votes   integer,
  rad_votes     integer,
  bad_votes     integer,
  comment_count integer,
  username      text,
  feed_score    double precision
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    up.id,
    up.user_id,
    up.categories,
    up.image_url,
    up.media_type,
    up.thumbnail_url,
    up.width,
    up.height,
    up.caption,
    up.created_at,
    up.total_votes,
    up.rad_votes,
    up.bad_votes,
    up.comment_count,
    u.username,
    (
      COALESCE(up.wilson_score, 0) * 0.6 +
      CASE WHEN follows.following_id IS NOT NULL THEN 0.3 ELSE 0.0 END +
      EXTRACT(EPOCH FROM (now() - up.created_at)) * -0.00001
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows
    ON follows.follower_id = p_user_id
    AND follows.following_id = up.user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;
```

---

## Step 2 — Update `types/database.ts`

Add to the `Tables` block and update `Functions.get_feed`:

```typescript
// Add inside Tables:
comments: {
  Row: {
    id: string;
    upload_id: string;
    user_id: string;
    parent_id: string | null;
    body: string;
    created_at: string;
    is_active: boolean;
    reply_count: number;
    like_count: number;
  };
  Insert: {
    upload_id: string;
    user_id: string;
    parent_id?: string | null;
    body: string;
  };
  Update: {
    is_active?: boolean;
  };
};
comment_likes: {
  Row: {
    comment_id: string;
    user_id: string;
    created_at: string;
  };
  Insert: {
    comment_id: string;
    user_id: string;
  };
  Update: Record<string, never>;
};

// Also add comment_count to uploads.Row:
comment_count: number;   // add this line
```

And in `Functions.get_feed.Returns`, add:
```typescript
comment_count: number;
```

---

## Step 3 — Update existing hooks

### `hooks/usePost.ts`
- Add `comment_count: number` to the `PostDetail` interface
- Add `comment_count` to the `.select(...)` string

### `hooks/useFeed.ts`
- Add `comment_count: number` to the `FeedItem` interface
- The RPC now returns it automatically after the migration

---

## Step 4 — New hooks to create

### `hooks/useComments.ts`
```typescript
// useInfiniteQuery for top-level comments on an upload
// queryKey: ['comments', uploadId]
// Page size: 20
// Cursor: { created_at: string; id: string } | null
// Fetches: comments where upload_id = ? AND parent_id IS NULL
// Joins: users(username, avatar_url)
// Orders: created_at DESC (newest first for standard comment UX)
// Returns: CommentItem[] per page with getNextPageParam
```

Shape of a comment row returned from Supabase:
```typescript
export interface CommentRow {
  id: string;
  upload_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  reply_count: number;
  like_count: number;
  users: { username: string; avatar_url: string | null };
}
```

Cursor-based pagination pattern:
```typescript
const PAGE_SIZE = 20;

async function fetchCommentPage(
  uploadId: string,
  cursor: { created_at: string; id: string } | null,
): Promise<{ rows: CommentRow[]; nextCursor: ... | null }> {
  let q = supabase
    .from('comments')
    .select('*, users(username, avatar_url)')
    .eq('upload_id', uploadId)
    .is('parent_id', null)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) {
    q = q.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
  }

  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as CommentRow[];
  const last = rows[rows.length - 1];
  return {
    rows,
    nextCursor: rows.length < PAGE_SIZE ? null : { created_at: last.created_at, id: last.id },
  };
}

export function useComments(uploadId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', uploadId],
    queryFn: ({ pageParam }) => fetchCommentPage(uploadId, pageParam ?? null),
    initialPageParam: null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: !!uploadId,
    staleTime: 30_000,
  });
}
```

### `hooks/useReplies.ts`
```typescript
// Same pattern as useComments but:
// - filters by parent_id = commentId
// - orders created_at ASC (chronological — replies read top to bottom)
// - queryKey: ['replies', commentId]
// - enabled prop passed in — false until user expands the thread
export function useReplies(commentId: string, enabled: boolean) { ... }
```

### `hooks/useCreateComment.ts`
```typescript
// Handles both top-level (parent_id = null) and replies (parent_id = commentId)
// Optimistic update:
//   - Top-level: prepend to page 0 of ['comments', uploadId]
//   - Reply: prepend to ['replies', commentId] + increment reply_count in ['comments', uploadId] cache
// On error: rollback both
// On success: invalidate ['comments', uploadId] and optionally ['replies', commentId]
//             Also invalidate ['post', uploadId] so comment_count refreshes

interface CreateCommentArgs {
  uploadId: string;
  body: string;
  parentId?: string;  // omit for top-level
}
```

### `hooks/useDeleteComment.ts`
```typescript
// Soft-delete via is_active = false
// Optimistic: remove from whichever cache (comments or replies) the item lives in
// Also decrement reply_count / comment_count in parent caches
// On error: rollback

interface DeleteCommentArgs {
  commentId: string;
  uploadId: string;
  parentId: string | null;
}
```

### `hooks/useCommentLikedIds.ts`
```typescript
// Returns Set<string> of comment IDs liked by the current user
// queryKey: ['commentLikedIds', userId]
// Fetches: comment_likes where user_id = currentUser.id
// staleTime: 60_000

export function useCommentLikedIds(): UseQueryResult<Set<string>>
```

### `hooks/useToggleCommentLike.ts`
```typescript
// Optimistic toggle — same pattern as useToggleFavorite
// Updates ['commentLikedIds', userId] set
// Also updates like_count in ['comments', uploadId] or ['replies', commentId] cache
// On error: rollback

interface ToggleCommentLikeArgs {
  commentId: string;
  uploadId: string;
  parentId: string | null;
  currentlyLiked: boolean;
}
```

---

## Step 5 — Components to create

Directory: `components/comments/`

### `CommentInput.tsx`
```
Props:
  uploadId: string
  replyTarget: { commentId: string; username: string } | null
  onClearReply: () => void
  onSubmit: (body: string) => void   // called after useCreateComment fires

UI:
  - TextInput (multiline, max 500 chars)
  - If replyTarget: show "@username" pill above input with × to clear
  - Send button (disabled if empty, shows ActivityIndicator while mutating)
  - Char counter fades in at 400+
  - KeyboardAvoidingView handled by parent sheet
```

### `ReplyItem.tsx`
```
Props:
  comment: CommentRow
  isLiked: boolean
  onLike: () => void
  onDelete?: () => void   // only shown if comment.user_id === currentUser.id

UI:
  - Slightly indented (paddingLeft: 36)
  - Avatar circle (first letter of username, colored)
  - @username  ·  timestamp (relative: "2h", "3d")
  - Body text
  - Heart icon + like_count | Delete (own comments only)
  - No "reply" button — cannot reply to a reply
```

### `CommentItem.tsx`
```
Props:
  comment: CommentRow
  isLiked: boolean
  onLike: () => void
  onReply: () => void           // sets replyTarget in sheet
  onDelete?: () => void
  uploadId: string

UI:
  - Avatar circle
  - @username  ·  timestamp
  - Body text
  - Heart icon + like_count | Reply | Delete
  - "View N replies ›" button if reply_count > 0 (toggles ReplyList below)
  - ReplyList renders inline below when expanded
```

### `ReplyList.tsx`
```
Props:
  commentId: string
  enabled: boolean   // passed from CommentItem expanded state

UI:
  - Mounts useReplies(commentId, enabled)
  - Shows ActivityIndicator on first load
  - FlatList of ReplyItem
  - "Load more replies" button if hasNextPage
  - Animated height expand (LayoutAnimation or Reanimated)
```

### `CommentList.tsx`
```
Props:
  uploadId: string
  onReply: (target: { commentId: string; username: string }) => void

UI:
  - Uses useComments(uploadId)
  - FlatList with onEndReached → fetchNextPage
  - Each item is CommentItem
  - Empty state: "Be the first to comment"
  - Footer: ActivityIndicator when fetching next page
  - useCommentLikedIds for like state
```

### `CommentSheet.tsx`
```
Props:
  uploadId: string
  visible: boolean
  onClose: () => void

Internal state:
  replyTarget: { commentId: string; username: string } | null

UI/Animation (built with Reanimated + GestureHandler):
  - translateY shared value: 0 = fully open, SHEET_HEIGHT = closed
  - Backdrop: semi-transparent, tap to close
  - Pan gesture on drag handle: drag down past threshold → close
  - Snap points: 60% and 92% of screen height
  - KeyboardAvoidingView wraps content
  - Structure:
      <Animated.View style={[sheet, slideStyle]}>
        <View dragHandle />
        <Text>Comments</Text>
        <CommentList uploadId onReply={setReplyTarget} />
        <CommentInput replyTarget onClearReply onSubmit />
      </Animated.View>

Open animation: translateY from SHEET_HEIGHT → 0, duration 320ms, easing out
Close animation: translateY from 0 → SHEET_HEIGHT, duration 260ms, then call onClose
```

---

## Step 6 — Wire up existing files

### `hooks/usePost.ts`
- Add `comment_count: number` to `PostDetail`
- Add `comment_count` to select string

### `hooks/useFeed.ts`
- Add `comment_count: number` to `FeedItem`

### `app/photo/[id].tsx`
- Import `CommentSheet`
- Add `commentSheetOpen: boolean` state
- In `DetailFooter` metaRow: add comment count tap target between vote count and share button
  - Icon: `chatbubble-outline` from Ionicons
  - Shows `formatCount(p.comment_count)` next to it
  - On press: `setCommentSheetOpen(true)`
- Render `<CommentSheet uploadId={currentId} visible={commentSheetOpen} onClose={() => setCommentSheetOpen(false)} />` in main return
- Pass `comment_count` down to `DetailFooter` (add to `DetailFooterProps`)

### `components/SwipeCard.tsx`
- Import `formatCount`
- In the `metaLeft` row (after the star/vote count): add `·` separator, `chatbubble-outline` icon (size 12), `formatCount(item.comment_count)` text
- Add `comment_count` to `FeedItem` interface (it will be there after useFeed update)
- Tapping comment count on SwipeCard does NOT open sheet — it navigates to `/photo/${item.id}` (detail view already has the sheet). This avoids UX complexity of comments on an auto-dismissing swipe card.

---

## File tree of everything new/changed

```
supabase/migrations/
  012_comments.sql                  ← NEW (run in Supabase dashboard)

types/
  database.ts                       ← add comments, comment_likes, update uploads + get_feed

hooks/
  usePost.ts                        ← add comment_count to PostDetail + select
  useFeed.ts                        ← add comment_count to FeedItem
  useComments.ts                    ← NEW
  useReplies.ts                     ← NEW
  useCreateComment.ts               ← NEW
  useDeleteComment.ts               ← NEW
  useCommentLikedIds.ts             ← NEW
  useToggleCommentLike.ts           ← NEW

components/comments/
  CommentSheet.tsx                  ← NEW
  CommentList.tsx                   ← NEW
  CommentItem.tsx                   ← NEW
  ReplyList.tsx                     ← NEW
  ReplyItem.tsx                     ← NEW
  CommentInput.tsx                  ← NEW

app/photo/[id].tsx                  ← add sheet + comment count in footer
components/SwipeCard.tsx            ← add comment count in metaLeft
```

---

## Key invariants to maintain

1. **Never call `fetchNextPage` while `isFetchingNextPage` is true** — TanStack Query handles this but double-check `onEndReached` guard.
2. **Optimistic comment ID**: use `crypto.randomUUID()` for the temp ID, replace on success via invalidation.
3. **Reply target cleared** on sheet close and after successful submit.
4. **Sheet closes keyboard** before animating closed — call `Keyboard.dismiss()` first in the close handler.
5. **`useReplies` enabled: false by default** — do not change this; it prevents loading all reply threads on mount.
6. **Delete is soft**: set `is_active = false`, filter `WHERE is_active = true` in all queries. Triggers only fire on hard DELETE — for soft delete, decrement counts manually in the mutation (or use a DB trigger on is_active update if preferred).
   - Simpler alternative: use hard DELETE since comments have no moderation queue. Triggers handle all count maintenance automatically. **Recommended.**
7. **`get_feed` must be DROPped before recreating** — already done in migration step 10.

---

## Styling notes

- Follow existing `StyleSheet.create` pattern (these components are in the same StyleSheet-heavy area as photo detail)
- Colors: use `colors.*` from `@/constants/theme`
- Avatar circles: use first letter of username, background color derived from `CATEGORY_COLORS` keyed by first char (or just use `colors.surface` with a border)
- Timestamp: write a small `formatRelativeTime(created_at: string): string` util in `lib/formatRelativeTime.ts` — returns "just now", "2m", "4h", "3d", "Jan 12"
- Like animation: same `withSequence(withTiming(1.3), withTiming(1))` scale punch used elsewhere in the app

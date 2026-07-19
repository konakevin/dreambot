# Bot Path Dark-Launch Plan — shadow-post new paths, visible only to Kevin, then flip live

**Goal (Kevin, 2026-07-16):** iterate NEW bot paths **on their real destination bot** (real config, real
shared-DNA/prefix/medium), posting renders that are **visible only to Kevin** (`SUPREME_ADMIN`), hidden
from the public feed / explore / profile grids — until a path is judged good, then **launch it live** with
one flip. "We can't post experimental iterations for public view."

**TL;DR recommendation:** add a per-upload **`shadow`** state + a per-bot **`shadowPaths[]`** list. Shadow
renders are stamped `is_public=false, is_posted=false, shadow=true` (so every existing public surface hides
them **fail-closed**, zero per-surface edits), and a new **`SUPREME_ADMIN`-gated `get_shadow_feed()` RPC**
surfaces them to Kevin only. Going live = move the path string from `shadowPaths[]` → `paths[]` (+ optional
one-shot promote of the good renders). This keeps the whole loop **in situ on the real bot** — no
byte-identical clone, no reverse-xerox, no separate destination confirmation batch.

---

## Why this exists — the AlphaBot friction it removes

AlphaBot (`ALPHABOT.md`) is today's proving ground: a **private account** (`users.is_public=false`) with
Kevin as its **only follower**; its posts stay `is_public=true`, so RLS mig-116's "followers see a private
account's public posts" gate shows them to Kevin and nobody else. It works, but the loop is heavy:

1. **Byte-identical config clone.** A candidate path's per-path config (medium, models, prefixes,
   polish/chaos/sensory) must be cloned into AlphaBot's module *exactly* from the destination bot — "a path
   proven under the wrong config proves nothing" (`ALPHABOT.md`). Axis names must not collide.
2. **Reverse-xerox promotion.** Going live = physically moving files (`paths/*.js`, `seeds/*.json`, pool
   loaders, gen scripts) into the destination module, re-wiring every per-path map, then running
   `promote-alphabot-renders.js`.
3. **A destination confirmation batch is still required** because "environment nuances (bot-wide prefix,
   shared DNA) can still shift the render" (`ALPHABOT.md` step 6). So AlphaBot never fully proves the path
   in its real home.

Dark-launching **on the real bot** eliminates all three: the path already lives in its destination module
with the real bot-wide prefix + shared DNA, so **what you see in shadow is exactly what posts live**. No
clone, no file-move, no confirmation batch. The cost is a small schema + client addition (below); AlphaBot
is pure script-side. Both can coexist — dark-launch is the lighter path for a bot that already exists.

---

## Load-bearing facts (verified this session, with file:line)

### How a bot post is created + published
- Every bot render inserts an `uploads` row in `postAsBot()` — `scripts/lib/botEngine.js:914–934` — with
  **`is_posted: true` (`:926`)** and **`is_public: true` (`:927`)** *hardcoded, no conditional*. Bots are
  "always-on" public posters; there is no draft/staging state today.
- The **originating path is NOT a column** — it lives inside the `recipe` JSONB (`recipe.path`,
  `scripts/lib/recipeBuilder.js:104`; written at `botEngine.js:931`). Any per-path DB filtering needs a
  real column or a stamped flag (below).

### What makes a path "live" (the rotation gate)
- **The sole gate is membership in the committed `bot.paths[]` array** (`scripts/bots/<bot>/index.js`).
  The dispatcher's shuffle-bag picks only from `bot.paths` (`botEngine.js:1052–1056`); explicit paths are
  rejected if absent (`botEngine.js:1090–1091`, throws). Deactivation = comment the string out of
  `paths[]` (e.g. FaeBot `fae-cottage`, ToyBot `hotwheels-city`). There is **no per-path enabled flag**.
- Consequence: **iter-bot cannot render a path that isn't in `paths[]`** (same validation throws). A
  shadow path therefore needs the render gate widened to `paths[] ∪ shadowPaths[]`.
- `bot_path_cycle` (mig 283) is the persisted shuffle-bag; `source` distinguishes `dispatcher` (persisted
  cycle) from `iter-bot` (in-process, never pollutes production cycle).

### The visibility model — why `is_public=false` alone won't show it to Kevin
- **`get_feed` hard-gates `up.is_public = true` for EVERYONE** (mig 368/352, WHERE `up.is_public = true`),
  with **no admin/owner bypass**. Account privacy is a *separate* gate: `user_id IN public_users OR
  user_id IN (followed)`.
- Profile grid `usePublicProfilePosts.ts:18` → `.eq('is_public', true)`; search `useSearchPosts.ts:22` →
  `.eq('is_public', true)`. Uploads RLS (mig 116) backs these: public account's `is_public=true` posts →
  everyone; private account's `is_public=true` posts → followers only; **owner** (`auth.uid()=user_id`)
  sees all.
- **The trap:** a bot's uploads are owned by the **bot's** `user_id`, not Kevin's. So on a **public** bot,
  an `is_public=false` post is invisible to the public **and to Kevin** (he's not the row owner, and both
  the follower gate and `get_feed` require `is_public=true`). Only the service role can read it. Migration
  308 states this explicitly: "`users.is_public=false` alone is NOT enough… `up.is_public=false` is
  enforced for everyone."
- **Therefore "only visible to me" must come from a dedicated `SUPREME_ADMIN`-gated read path**, not the
  normal feed. `SUPREME_ADMIN_USER_ID = eab700d8-f11a-4f47-a3a1-addda6fb67ec` (`lib/superAdmin.ts:14`),
  precedent: the admin-gated `get_bot_users` bots-pill (mig 339).

---

## Recommended architecture (v1 — manual render loop)

### 1. DB: a `shadow` state on uploads (migration 376 — next free prefix; verify at build time, the tree moves fast)
```sql
ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS shadow boolean NOT NULL DEFAULT false;
-- Fast admin-review lookup, one bot at a time:
CREATE INDEX IF NOT EXISTS idx_uploads_shadow
  ON public.uploads (user_id, posted_at DESC) WHERE shadow = true;
```
Shadow renders are written **`is_public=false, is_posted=false, shadow=true`**. The first two mean **every
existing public surface hides them with zero code changes** (feed, profile, search all already require
`is_public=true`) — this is the fail-closed property we want. `shadow=true` is only the handle the admin
RPC uses to find them.

> **Column-grant footgun (CLAUDE.md hard rule):** `uploads` uses column-level grants. We do **NOT** grant
> `shadow` to `anon/authenticated` — the client never selects it directly; it reaches shadow posts **only**
> through the SECURITY-DEFINER RPC below (which bypasses grants). No `GRANT SELECT (shadow)` needed → the
> column stays invisible to normal clients, which is correct.

### 2. DB: an admin-only read RPC — this is the "only visible to me" path
```sql
CREATE OR REPLACE FUNCTION public.get_shadow_feed(p_bot_user_id uuid DEFAULT NULL, p_limit int DEFAULT 60)
RETURNS SETOF ...  -- same shape the feed/profile client already renders
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT ... FROM public.uploads up
  WHERE up.shadow = true
    AND (p_bot_user_id IS NULL OR up.user_id = p_bot_user_id)
    AND auth.uid() = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'::uuid   -- SUPREME_ADMIN only
  ORDER BY up.posted_at DESC LIMIT p_limit;
$$;
REVOKE ALL ON FUNCTION public.get_shadow_feed(uuid,int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_shadow_feed(uuid,int) TO authenticated;
```
The `auth.uid() = SUPREME_ADMIN` check inside a SECURITY-DEFINER function is the guard (mirrors mig 339 /
185 / 099). Any other caller gets zero rows even though EXECUTE is granted. Returns the `recipe.path` so
the review UI can group + badge by path.

### 3. Script side: a per-bot `shadowPaths[]` + a stamp at insert
- Add `shadowPaths: ['<new-path>']` to `scripts/bots/<bot>/index.js` (alongside `paths[]`). The path lives
  in `pathBuilders` + carries its real per-path config exactly like a live path — because it *is* on the
  real bot.
- **Widen the render gate** (`botEngine.js:1090` + the shuffle-bag source) to allow
  `bot.paths.includes(p) || (bot.shadowPaths||[]).includes(p)`, so `iter-bot --mode <shadow-path> --post`
  renders it. **Keep the public shuffle-bag picking from `bot.paths` only** — the dispatcher must never
  auto-post a shadow path publicly.
- In `postAsBot()` (`botEngine.js:914–934`), when the resolved path ∈ `shadowPaths`, stamp
  `is_public:false, is_posted:false, shadow:true, posted_at: now()` instead of the hardcoded trues.
  (`posted_at` stays set so the review RPC can order by it.)

### 4. Client: an admin-only "Shadow" review surface
Two options (pick in Open Decisions):
- **(A) Inline on the bot's profile** — when `isSupremeAdmin(user.id)`, the bot-profile screen fires an
  extra `get_shadow_feed(botId)` and prepends those tiles with a `SHADOW` badge. Lightest; reuses the grid.
- **(B) A dedicated `/shadow` review screen** (admin-gated route, like `/dreamTest`) listing shadow posts
  grouped by bot + path, with keep/kill affordances. Cleaner for judging a batch.

Either way it's read-through-RPC only; no new public surface, nothing leaks.

### 5. Go-live flip (promotion, one edit + optional render promote)
1. Move the path string `'<new-path>'` from `shadowPaths[]` → `paths[]` in the destination `index.js`
   (scale pools 25→200 first, per the MVP-25 law). Commit. The dispatcher picks it up next cycle. **Done —
   no file moves, no re-wiring, no confirmation batch** (it already rendered under its real config).
2. *(Optional)* Promote the shadow renders Kevin liked to the public feed with a small service-role script
   `scripts/promote-shadow-renders.js --bot <bot> --path <path> [--ids …]` → sets
   `is_public=true, is_posted=true, shadow=false` on the chosen rows (mirrors `promote-alphabot-renders.js`).
   Delete the rest. If you'd rather start the public history clean, skip promotion and just let the live
   path post fresh.

---

## Optional v2 — auto-shadow cadence (long-tail hardening)

The playbook's biggest validation lesson — *"the path looked great in dev but the feed degrades over
time… it's the LONG TAIL, not decay"* — says a curated MVP-25 sample proves the *best* combos; automation
later rolls the *full* combinatorial space and any weak guardrail eventually posts. A manual iter-bot loop
(v1, and AlphaBot) never exercises that tail privately.

**v2:** let the dispatcher auto-post shadow paths **into the shadow lane** at a low cadence (a
`shadow_schedules` row or a `shadow` weight in the existing cycle) so a dark-launched path accumulates real
automated rolls **privately** for days. Kevin reviews the shadow feed and promotes only when the *worst*
observed combo is acceptable — hardening guardrails against the long tail before a single public post. This
is a strict superiority over both AlphaBot and v1 for catching the failures Kevin keeps hitting. Build it
only after v1 is proven.

---

## Alternatives considered (and why v1 wins)

| Approach | "Only Kevin sees it" | On the real bot? | Go-live cost | Verdict |
|---|---|---|---|---|
| **Shadow flag + admin RPC (recommended)** | ✅ admin-gated RPC | ✅ real config/DNA | 1-line array move (+opt. promote) | **Pick this** |
| Keep using AlphaBot | ✅ private acct + follower | ❌ cloned config | clone + reverse-xerox + confirm batch | Fine, but heavy; keep as fallback |
| Per-post `is_public=false` on the real public bot | ❌ **nobody** sees it, incl. Kevin | ✅ | — | **Impossible** (the ownership trap) |
| `shadow=true` but keep `is_public=true` + add `AND NOT shadow` to every surface | ✅ if perfect | ✅ | — | **Rejected — fail-open**; miss one surface (feed/profile/search/web/realtime) → public leak |

The fail-open row is the important rejection: hiding by *adding exclusions* to N surfaces is one forgotten
query away from a public leak. Hiding by `is_public=false` reuses a gate that's already enforced everywhere
(proven by mig 308) — fail-closed by construction.

---

## Safety / hard-rule checklist
- **Fail-closed hiding:** shadow ⇒ `is_public=false` (public surfaces already exclude it). The `shadow`
  flag never *grants* visibility to anyone but the admin RPC.
- **No new client column grant** on `uploads.shadow` (RPC-only access) — respects the mig-278 column-grant
  model; don't `GRANT SELECT (shadow)`.
- **Admin RPC is the only widening** — guarded by `auth.uid() = SUPREME_ADMIN` inside SECURITY DEFINER.
- **Dispatcher never auto-posts shadow paths publicly** — public shuffle-bag stays `bot.paths`-only.
- **Website unaffected** — dreambot-web reads the same Supabase and filters `is_public` / `users.is_public`
  (per its CLAUDE.md); `is_public=false` shadow posts never reach it.
- **`sanitizeUserText` N/A** — no new user-text input surface (bot prompts already sanitized upstream).
- **Add a `verify-shadow-privacy.js`** (mirror `verify-alphabot-privacy.js`): assert anon + a regular
  authenticated user get **zero** rows from `get_shadow_feed` and see no shadow tiles on a bot profile,
  while `SUPREME_ADMIN` sees them. Run after any RLS/feed change.

---

## Open decisions for Kevin
1. **Review UI:** (A) inline `SHADOW`-badged tiles on the bot's own profile (lightest), or (B) a dedicated
   admin `/shadow` review screen grouped by bot+path? *(Recommend A to start.)*
2. **v2 auto-shadow cadence:** build the private auto-rotation long-tail lane now, or ship v1 manual first
   and add it once proven? *(Recommend v1 first.)*
3. **Render promotion on go-live:** carry the liked shadow renders into the public feed
   (`promote-shadow-renders.js`), or always start the live path's public history fresh? *(Recommend
   promote — it's the AlphaBot-parity behavior and preserves your hearted picks.)*
4. **Keep AlphaBot too?** This doesn't retire AlphaBot; it's the lighter in-situ option for paths on bots
   that already exist. Keep AlphaBot for brand-new/uncertain-destination experiments, or consolidate on
   dark-launch? *(Recommend keep both.)*

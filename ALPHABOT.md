# AlphaBot — the private proving ground

**All new bot-path development happens here first** (Kevin, 2026-07-07). A candidate path is
authored under AlphaBot, rendered to AlphaBot's private profile, judged by Kevin in-app, iterated,
and only then promoted into its destination bot. Existing-path regression QA (HTML matrix on a
live bot's current paths) still runs on the live bot as before.

- **Account:** `AlphaBot`, user_id `c6d51068-7592-48a9-895d-9a7a2ebc7aa4`, created by
  `scripts/create-alphabot-account.js` (idempotent).
- **Module:** `scripts/bots/alphabot/` — see the CANDIDATES contract in its `index.js`.
- **No `bot_schedules` row, ever.** The dispatcher can't select it, so it can never auto-post,
  and the never-posted-6h auto-deactivation guard can't touch it. Renders are manual only.

## Privacy model (verified 2026-07-07 — rerun `scripts/verify-alphabot-privacy.js` after any RLS/feed change)

One flag and one row do all the work:

1. `users.is_public = false` — the migration-116 uploads RLS makes a private account's posts
   readable **only by its followers**; `get_feed` has the matching follower gate; `get_bot_users`
   filters private bots; the website filters `users.is_public`.
2. **The only follower is the supreme admin** (Kevin). Seeded by the account script.

Hard rules:
- **NEVER flip AlphaBot's `users.is_public` to true.**
- **NEVER add a `follows` row to AlphaBot for anyone else.**
- **NEVER create a `bot_schedules` row for alphabot.**
- **Hearts are the verdict channel; don't put sensitive notes in comment TEXT** on AlphaBot posts
  (comments/likes tables are world-readable by design; a comment's text is scrapeable by API even
  though the post itself is not).

Client-side seams (all keyed on `PRIVATE_BOT_USERNAMES` in `hooks/useBotUsers.ts`): hidden from
username search (`useSearchUsers`), from mention taps (`lib/mentions.ts`), and from public
following lists (`useFollowingList` — so it doesn't leak via Kevin's profile). The supreme admin's
Bots-page pill is server-gated (migration 339: private bots returned only to the supreme admin,
and only if followed).

Known, accepted edge: `get_public_profile` returns the profile HEADER (username/avatar/bio,
zero posts) to anyone who already has the UUID — but no surface exposes the UUID, and no content
can be read. The bio is written accordingly.

## Current residents — the DreamBot non-robot split (2026-07-07)

Kevin: DreamBot = purely the little bubble-bot robot in different worlds. Everything else moved
here, wholesale (Kevin: "sweep everything non-robot into alphabot"):

- **9 active candidates** (were live on DreamBot): `dreamscape`, `butterfly-realm`,
  `dream-spires`, `far-eden`, `far-eden-soft`, `hidden-conservatory`, `botanical`,
  `pulp-femme`, `pulp-hero` — in `paths[]`, render manually via iter-bot.
- **18 dormant ChibiBot-heritage paths** (villages/creatures/cozy interiors DreamBot inherited in
  its xerox-clone birth) — wired in `pathBuilders`, not in `paths[]`, same dormant state as before.
- The full DreamBot machinery (pools/seeds/shared-blocks/archetypes/rollSharedDNA/buildBrief
  post-processing) came along byte-identical, so these render exactly as they did on DreamBot.
  The 8 non-robot `DREAMBOT_*` archetypes moved to alphabot's registry files (names kept — the
  cross-bot registry rejects duplicates, so they live in exactly ONE module).
- **261 existing renders** moved from DreamBot's profile (caption-matched `[<path>] ChibiBot`);
  DreamBot's public grid is now pure robot. 15 pre-conversion `is_posted=false` relics were left
  on the dreambot account (invisible; playbook-sanctioned).
- Destination per candidate = undecided (`ex-dreambot` in captions/TARGETS); update
  `TARGETS` in `alphabot/index.js` when Kevin assigns one.

## Workflow (per candidate path)

Same playbook loop, private destination:

1. Re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` (standing hard rule), pick the **destination bot**.
2. Author the path under `scripts/bots/alphabot/paths/<path>.js` + seeds (MVP-25, as always).
3. Wire it in `alphabot/index.js` `CANDIDATES` with per-path config **cloned byte-identical from
   the destination bot** (medium, models, prefixes, polish/chaos/sensory settings) — a path
   proven under the wrong config proves nothing. Check axis-name collisions against the
   destination (bot_dedup is keyed per bot+axis).
4. Render: `node scripts/iter-bot.js --bot alphabot --mode <path> --count 5 --label "auto-qa: <path> R<n>" --post`
   — posts land on AlphaBot's private profile; Kevin judges from the feed UI as usual.
5. Iterate to the playbook bar; Kevin verdicts (hearts); scale seeds only after sign-off.

## Promotion checklist (candidate → destination bot)

1. Move files: `paths/<path>.js`, its `seeds/*.json`, `pools.js` loader lines, any
   `gen-seeds/alphabot/gen-*.js` → the destination module (rename dirs as needed).
2. Wire the destination `index.js`: `pathBuilders`, `paths[]`, and every per-path map the
   candidate carried (they're already byte-identical by construction). Copy archetype/template
   defs if the path is declarative.
3. Remove the candidate from `alphabot/index.js` CANDIDATES + `alphabot/pools.js`.
4. Load-check both modules: `node -e "require('./scripts/bots/<dest>'); require('./scripts/bots/alphabot')"`.
5. Move the approved test renders to the destination profile:
   `node scripts/promote-alphabot-renders.js --path <path> --to <dest> [--dry-run]`
   (they become PUBLIC the moment they move — only promote renders worthy of the live feed;
   delete the rest from AlphaBot's profile).
6. Confirmation batch **on the destination** (`iter-bot --bot <dest> --mode <path> --count 5 --post`)
   before the path enters rotation — environment nuances (bot-wide prefix, shared DNA) can still
   shift the render.
7. Update the playbook's per-bot log, `BOTS.md` if the roster changed.

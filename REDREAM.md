# "Dream a twin" — re-running a nightly dream on demand (shipped 2026-09-18; label = Kevin's pick, a twin = same DNA, a different scene)

**What it is.** The owner-only long-press action on a NIGHTLY dream. It re-runs the nightly engine with the same
look, vibe, cast role AND seed pool ("world") as that dream — another scene from the same world — for the base dream price
(`engine_config.base_sparkle_cost`, 1 today). Kevin: "inform them that it will dream another dream like that style
but in a new setting."

**Why it exists.** "Dream this again" reloaded a nightly dream into Create with a look Create cannot render (nightly
looks are not picker mediums), the nightly's empty prompt then took the surprise path, and the user got a
photographic pure scene of somewhere else for a sparkle. Measured 2026-09-18 on Kevin's account. "Dream this again"
stays for CREATE dreams (prompt + medium reload); a nightly dream gets THIS action instead.

## Flow

1. **Sheet** (`lib/imageLongPress.ts` row `redream`, copy in `constants/redream.ts`): "Dream a twin" with the
   subtitle "Same world, new scene · 1 sparkle". Only for the owner, only when the dream's medium is a catalogue
   look (`hooks/useDreamAgain.ts` → `isNightlyLook`, from `get_dream_style_labels`, mig 532 — which also fixed the
   sheet's "Style: … · Vibe: …" labels for nightly looks and nightly-only vibes).
2. **Balance first** (`useSparkleBalance` vs `engine_config.base_sparkle_cost`): short → the sparkle premium gate
   with twin copy ("The twin needs a sparkle" / "You're out of sparkles. Top up and DreamBot will dream the twin
   right now." → Get Sparkles → `/sparkleStore`), no confirm. This is the upsell moment (Kevin 2026-09-18).
3. **Confirm** (`showAlert`): "Dream a twin?" / "Same world, same style, same cast. A brand-new scene." /
   "Dream it · 1 sparkle" | "Not now" (no medium name, no price in the body — the button carries the price).
4. **Enqueue** (`lib/dreamApi.ts enqueueRedream` → `enqueue-dream` with `redream_upload_id`): owner + nightly-look
   checks, cast role from the source's `ai_generation_log.rolled_axes.dreamType` (`_shared/redream.ts
castRoleForDreamType`; pruned log → the engine rolls), `charge_sparkles` (reason `redream`, idempotent on the job
   id; 402 `insufficient_sparkles` is the race backstop), `dream_queue` row `source = 'redream'` (mig 531), weight
   heavy unless the source was a no-cast scene, payload `{ redream: { source_upload_id, look_key, vibe_key,
cast_role } }`, worker kick.
5. **Render** (worker `case 'redream'` → the nightly dispatcher forwards `redream` → `nightly-dreams` merges the pins
   into its pin inputs with `applyRedreamPins` AFTER `isQaRequest` ran on the raw body): `qa_pin_look` (the contract's
   look, engine untouched), `force_vibe`, `force_cast_role`. Stamps: `redream:<source_upload_id>`,
   `look_source:pin:<look>`. `is_qa = false`. Same fallback chain as the nightly.
6. **Loading** (`/dream/loading?watch=<dream_id>`): the Create loading screen watches the queue row and reveals the
   upload. No "nightly is ready" inbox row (the dispatcher returns before the notification insert); the Haiku
   `bot_message` title is kept.
7. **Failure**: dead-letter refunds like create (`deadLetterAftermath`); a redream never gets the nightly goodwill
   credit and skips the Pro/trial `is_dream_eligible` gate (it is paid).

## Verified 2026-09-18 (Kevin's account)

Source: hand-drawn illustration + opulent couple → enqueue 200 in 3 s, rendered in ~90 s on flux-1.1-pro, first-try
couple hold (identity 0.64 / 0.77), same look + vibe on the upload, balance 19799 → 19798, `is_qa` false, zero inbox
rows. Captioned "✨ QA more-like-this" in his Dreams album.

## Rollback

Hide the row: return `onRedream: undefined` at the two call sites (`PostTile.tsx`, `DreamCard.tsx`). The queue
source, the RPC and the render pins are inert without it.

## The sequel's world (same seed pool as the source) — 2026-09-18 late

Kevin: "force the redream to use the same seed pool that the dream they are on did … that way it really is a sequel".
Every nightly upload records `seed_source` (`kind`, `biome`, `scene`, `location`; since tonight also `placeKey`,
`category`, `subTheme` — nightly-dreams `seedSource`). enqueue-dream turns it into `redream.world`
(`_shared/redream.ts worldFromSeedSource` / `worldPins`):

| source kind              | pin                                                                 | what rolls fresh                                               |
| ------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| location                 | `force_place: <location card>`                                      | a NEW iconic spot inside the same card (+ the Option B action) |
| goofy / elegant / active | `force_playful                                                      | elegant                                                        | active`+ the`force*single*\*`twin +`force_scene_category: <category>` | a different scenario row of the same category; the place |
| holiday                  | `force_holiday_scene: <key>` + `force_holiday_sub_theme` when known | a different scene of the same holiday sub-theme; the place     |

Older uploads (before tonight) lack the new fields, so enqueue-dream reverse-looks them up: the spot text →
`location_iconic_spots.location_key`; the scene text → `dual_scenarios` / `single_scenarios` `category` / `sub_theme`
(both tables, dual first). The forced-category branch in nightly-dreams now honours a kind pin (filters the category's
rows to that pool). Cast role comes from `castRoleFromAxes(rolled_axes)` (dreamType → isDualFaceSwap → castRoles),
because `dreamType` is null on ~30% of log rows.

Verified on Kevin's account: location "Breckenridge Main Street" (card `saloon`) → sequel "OK Corral gunfight site,
Tombstone" (same card, same look/vibe, couple held); fall "Arched bridge in university courtyard" (sub-theme
`umbrella_bridge_rain`) → "Limestone footbridge crossing brook" (same sub-theme); elegant (see the re-run below).

## What a sequel can recover, and from where

| input                                               | where it lives                                                                                                                                                                                                           | how far back                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| look, vibe                                          | `uploads.dream_medium` / `dream_vibe`                                                                                                                                                                                    | every dream                                                                                |
| world (kind, biome, scene text, spot text)          | `uploads.seed_source`                                                                                                                                                                                                    | every nightly since 2026-08-31 (2391 uploads, none missing)                                |
| location card, scenario category, holiday sub-theme | `uploads.seed_source` (`placeKey` / `category` / `subTheme`) since 2026-09-18; older dreams reverse-looked-up from the spot / scene text (fails only when that row was reworded or retired → the engine rolls that part) | all                                                                                        |
| cast role                                           | `uploads.seed_source.castRole` since 2026-09-18; before that `ai_generation_log.rolled_axes`                                                                                                                             | log prunes at 30 days → a pre-09-18 dream older than 30 days lets the engine roll the cast |

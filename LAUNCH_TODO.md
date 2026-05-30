# Pre-Launch TODO

Captured from Kevin's brain-dump, 2026-05-29. Groups his items by category for working order; wording preserved. Items pulled into `LAUNCH.md` "shipped" section as they land.

**🤖 = Claude can ship this without Kevin's input** (bugs, infra, mechanical changes, automatable audits). Everything else needs Kevin's design/taste/scope direction.

---

## Bots

- [ ] **YumBot** — single glossy shapes
- [ ] **Finish axes for all bots** (per `BOT_AXIS_REFACTOR_PLAN.md`)
- [ ] **StarBot** — NASA path needs help
- [ ] **StarBot** — exotic-aliens path: "go AI! 11/10"
- [ ] **MangaBot** — audit, correct or rip out problematic paths
- [ ] **FaeBot** — new cozy-fae path: very ornate fae cottage interiors with all the pretty little things a fae would collect; full of details, layers, whimsy
- [x] 🤖 **Audit all mediums + face swap** — could probably automate this with Claude — shipped 2026-05-29 (static + render sweep across all 19 active user-pickable mediums × {self, dual}. DB fixes: hyperreal kontext_directive rewrite + gender-lock paragraph appended to 16 directives + vinyl gender line. Embodied routing fix: animation/pixels/handcrafted flipped to is_character_only=true with HUMAN CHARACTERS mandate prepended — re-verified renders post-fix.)

## Feed, albums & images

- [x] 🤖 Jumping to images in albums is **weird, janky** — shipped 2026-05-29 (PostGrid: animate the badge-tap jump, drop the 300ms dim-spinner overlay that lingered after a synchronous scroll)
- [x] 🤖 Images load **slow** in general — is our infra for image delivery bad? — handled by another agent 2026-05-29
- [x] 🤖 Feeds **stall out** + reach the bottom when there are obviously more posts (~30 in), after navigate/background/return. How do we recover from those stale conditions? — shipped 2026-05-29 (cursor-termination bug; details in commit)
- [x] 🤖 **Remove** the "↑ new posts" pill on **all** feeds — shipped 2026-05-29
- [x] 🤖 Pulling down on any **bot feed** should refresh **all** the bots — shipped 2026-05-29
- [ ] **DreamBot becomes a posting bot** too — aggregates best-of from the other bots. Need an easy way to tap and repost
- [ ] **User reposts** — implement; update feed algorithm: reinsert into followers' feeds? DB join of eligible posts? Look at how other shops do it.

## Render & background reliability

- [x] 🤖 Test **closing / backgrounding the app during render OR upscale** — it needs to succeed and send a push notification — shipped 2026-05-29 (gap audit: render durability already correct via `EdgeRuntime.waitUntil` in generate-dream/restyle-photo/upscale-image; upscale auto-notifies via the `trg_notify_send_push` trigger chain. The missing piece was that user-create dream completion is opt-in via "Queue This", so a user who just hit home mid-render got no push. Added AppState background listener in `app/dream/loading.tsx` that auto-fires `request_dream_notification` (idempotent upsert from migration 195) so backgrounding now auto-enrolls for the push.)

## Reveal & dream creation

- [ ] **Reveal screen** — clean up; add back the carousel with up to three tries (1 + 2 retries). Let the user choose the best to post; let them keep all three.
- [ ] Make sure at least one rendered option is a **landscape they can share** (blown up, share-ready aspect)
- [ ] **Three dreams** on first reveal — showcase different styles
- [ ] **Create screen**: add a rotating set of background images — make it look like a little **DreamBot factory / machine**
- [x] **Generating screen**: make it look **magical** (it IS generating a dream!) — rotating set of really cool magic-looking backgrounds with particles overlaid. Fun moment, not a "bad to wait" moment. — shipped 2026-05-30 ("Workshop" stage in `components/MagicalLoadingStage.tsx`: cosmic gradient + breathing mascot + pulsing radial glow + 14 sparkle particles drifting upward with sine-wave wobble + `Dreaming…` title with sequenced 3-dot animation + a rotating poetic subtitle that cross-fades through 7 phrases every 3.8s. All animations run on the Reanimated worklet thread. Queue This button + face-swap subtip float in a SafeAreaView overlay below it. Stage is intentionally re-usable on the first-dream screen — accepts a mascot URL prop.)
- [ ] Same magical treatment on the **first-dream generating screen** (stage component now exists — wire it into the first-dream loading flow)

## UI / animations / micro-delight

- [ ] **Hearting** — sparkle / confetti burst (like Rad / BeReal). Apply to:
  - dream create screens
  - first-dream screen
- [x] 🤖 **Heart bug** — phantom numbers + janky reflow when the count appears — shipped 2026-05-29 (two fixes: (1) always-render the count + opacity-hide at 0 → no more side-rail reflow; (2) phantom-number audit — `useToggleLike` now also bumps the `useExploreDreams` cache + the `useAlbumStore.posts` Zustand snapshot + the `useFeedStore.pinnedPost`, with matching rollbacks)
- [ ] **Notification icon** when lit is ugly — redesign
- [x] **Profile screens** — restyle more like Instagram / TikTok header-user-info layout — shipped 2026-05-29. Migrations 207 (display_name + bio), 209 (drop dead vibe-peek RPC), 210 (created_at on get_public_profile). New shared `ProfileHeader` component used by own + public profiles, center-aligned hero: avatar → display name → @handle → bio → "Joined Month YYYY" chip → plain-text Posts · Followers · Following stats (each tappable) → Edit Profile / Share (own) or Follow / Message / ⋯ (other) pills → text tabs with accent underline. New Edit Profile screen with inline Dream Cast editor. Sticky compact top bar that collapses on scroll (avatar + @handle fade in past the hero); tapping that area scrolls back to top. Universal-link share URL (`dreambotapp.com/user/<id>`) backed by a public Next.js page with React 19 head-hoisted OG meta. Onboarding mediums + vibes steps removed (Kevin pivoted away from user-curated taste — engine + Create screen own those now); related dead-code sweep deleted vibeEngine.ts, MediumsStep, VibesStep, settings/vibes, settings/art-styles, QuickSettingsSheet, curatedBots.
- [ ] **Toast system** — review how other apps handle "post created" / "file saved"; make ours more on-brand

## Onboarding

- [ ] **Overhaul entire onboarding** — in-app theme + colors; fun and approachable
- [ ] **Final review** — do we keep the **Objects** step?
- [ ] **Welcome email** — explains the app. Replace the in-app tutorial, or both?

## Notifications & messages

- [x] **Clean up notifications and messages** (overall content + UX) — handled by another agent 2026-05-29

## Settings & docs

- [ ] Review settings — what do we actually want to keep? Menu-item naming.
- [ ] **About page** needs rewritten
- [ ] Double-check website links look like our app / styled correctly

## Website

- [ ] **Update the website**
- [ ] Clean up the "while waiting" prompts (dream + upscale)
- [ ] **Fix all styles across all website pages** — no more rainbow Rad/BeReal-style gradients

## Sharing & shareable links

- [x] 🤖 **Image links must work for people with AND without the app** — test this thoroughly — shipped 2026-05-29 (deep-link chain audit: app's `associatedDomains` registered for dreambotapp.com ✓; web `/post/[id]` Server Component rendering correctly ✓; image_url public storage ✓; RLS correctly anon-gates private posts ✓. Fixed: (a) crawler-visible meta tags — Next 15's streamed `generateMetadata` was invisible to iMessage/Twitter/FB/Discord link unfurlers; inlined `<meta>`/`<title>` in the page tree so React 19 hoists them to the initial `<head>` response (34 OG/AL/twitter/apple-itunes tags now land for every crawler UA); (b) AASA route handler — a Next.js Route Handler at `app/.well-known/apple-app-site-association/route.ts` was overriding the public/ static file with the legacy `appID` singular form + only `/post/*`; rewritten to modern `appIDs` array + `/user/*` added, dead public/ dup deleted.)

## Monetization & upsells

- [ ] **Watermark on free downloads?** (decide + ship)
- [ ] Review **all** the ways we upsell people:
  - Trial-expiring reminders
  - Subscription expiring / expired reminders
- [ ] **Clean up purchase screens** — more cute / game-looking. Graphics + stuff; current ones look too serious.

---

## Notes for working through this

- `LAUNCH.md` already tracks the **infrastructure / EAS / App Store** launch checklist — this doc is the **product polish + bug** backlog feeding into the same launch.
- Items that touch the **nightly engine** (cozy-fae path) plug into the per-location biome architecture in `NIGHTLY_DREAM_ARCHITECTURE.md`.
- Bot work hard-rule: re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` before touching any bot path.

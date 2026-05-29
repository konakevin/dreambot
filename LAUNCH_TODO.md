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
- [ ] 🤖 **Audit all mediums + face swap** — could probably automate this with Claude

## Feed, albums & images

- [x] 🤖 Jumping to images in albums is **weird, janky** — shipped 2026-05-29 (PostGrid: animate the badge-tap jump, drop the 300ms dim-spinner overlay that lingered after a synchronous scroll)
- [ ] 🤖 Images load **slow** in general — is our infra for image delivery bad?
- [x] 🤖 Feeds **stall out** + reach the bottom when there are obviously more posts (~30 in), after navigate/background/return. How do we recover from those stale conditions? — shipped 2026-05-29 (cursor-termination bug; details in commit)
- [x] 🤖 **Remove** the "↑ new posts" pill on **all** feeds — shipped 2026-05-29
- [x] 🤖 Pulling down on any **bot feed** should refresh **all** the bots — shipped 2026-05-29
- [ ] **DreamBot becomes a posting bot** too — aggregates best-of from the other bots. Need an easy way to tap and repost
- [ ] **User reposts** — implement; update feed algorithm: reinsert into followers' feeds? DB join of eligible posts? Look at how other shops do it.

## Render & background reliability

- [ ] 🤖 Test **closing / backgrounding the app during render OR upscale** — it needs to succeed and send a push notification

## Reveal & dream creation

- [ ] **Reveal screen** — clean up; add back the carousel with up to three tries (1 + 2 retries). Let the user choose the best to post; let them keep all three.
- [ ] Make sure at least one rendered option is a **landscape they can share** (blown up, share-ready aspect)
- [ ] **Three dreams** on first reveal — showcase different styles
- [ ] **Create screen**: add a rotating set of background images — make it look like a little **DreamBot factory / machine**
- [ ] **Generating screen**: make it look **magical** (it IS generating a dream!) — rotating set of really cool magic-looking backgrounds with particles overlaid. Fun moment, not a "bad to wait" moment.
- [ ] Same magical treatment on the **first-dream generating screen**

## UI / animations / micro-delight

- [ ] **Hearting** — sparkle / confetti burst (like Rad / BeReal). Apply to:
  - dream create screens
  - first-dream screen
- [x] 🤖 **Heart bug** — phantom numbers + janky reflow when the count appears — shipped 2026-05-29 (always-render the count, opacity-hide at 0, so the side rail no longer reflows)
- [ ] **Notification icon** when lit is ugly — redesign
- [ ] **Profile screens** — restyle more like Instagram / TikTok header-user-info layout
- [ ] **Toast system** — review how other apps handle "post created" / "file saved"; make ours more on-brand

## Onboarding

- [ ] **Overhaul entire onboarding** — in-app theme + colors; fun and approachable
- [ ] **Final review** — do we keep the **Objects** step?
- [ ] **Welcome email** — explains the app. Replace the in-app tutorial, or both?

## Notifications & messages

- [ ] **Clean up notifications and messages** (overall content + UX)

## Settings & docs

- [ ] Review settings — what do we actually want to keep? Menu-item naming.
- [ ] **About page** needs rewritten
- [ ] Double-check website links look like our app / styled correctly

## Website

- [ ] **Update the website**
- [ ] Clean up the "while waiting" prompts (dream + upscale)
- [ ] **Fix all styles across all website pages** — no more rainbow Rad/BeReal-style gradients

## Sharing & shareable links

- [ ] 🤖 **Image links must work for people with AND without the app** — test this thoroughly

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

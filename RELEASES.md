# RELEASES.md — the DreamBot release ledger

One row per **shipped** App Store build (the ones submitted for review, not every
TestFlight iteration). This is the human-readable changelog + the map from a git
tag to its EAS build number and commit. Update it as the LAST step of every
release (`scripts/release.sh` prints the reminder).

Tag convention: annotated `v<marketing-version>` on the exact commit the build was
cut from. If one marketing version ships more than one build (a resubmission after
rejection), the extra builds get `v<version>-build<N>` and `v<version>` stays on
the build that was ultimately **approved**. See `RELEASE.md` for the full runbook.

| Tag | Version | Build | Commit | Shipped | ASC status | Notes |
|-----|---------|-------|--------|---------|-----------|-------|
| `v1.0.5` | 1.0.5 | 18 | `3119a43d13` | 2026-07-11 | Uploaded (processing) | Build 18 (builds 16 + 17 submissions cancelled pre-release). Adds over 17: "Medium" → "Style" UI rename (all surfaces), liked posts can never show a blank like count, unified Surprise Me face/art split. Carries everything from 16/17: fatal Create-screen crash fix, onboarding-lockout fix (transient read can't route an established user to onboarding), failed-dream retry reopens in Create prefilled, multi-image album posts + unified posting flow + bulk album edit, per-dream notifications + accurate badge, follow-request accept/deny on profile, Search/Explore exact-tap fix, startup-logo size-pop fix, audit hardening. |
| `v1.0.4` | 1.0.4 | 15 | `2dfa076a78` | 2026-07-10 | Uploaded (processing) | Dream queue enabled in store builds (background-safe renders, caps, retries), provider failover on AI outages + failure observability, comment-sheet keyboard/gesture overhaul + swipe-away keyboard on Create/Edit Profile, postcard nightly captions, goofy scenario categories, action-grounded briefs, BrandSpinner polish. |
| `v1.0.3` | 1.0.3 | 14 | `a314947d39` | 2026-07-09 | Submitted | Home Screen widget, New Scene photo mode (Standard/Ultra tiers), face-swap quality program (restore + identity gate on every swap), action pose/scenario expansion + no-repeat shuffle, feed refresh overhaul (quiet re-tap, brand spinner suite, real reshuffle), production analytics/crash-reporting fix. |
| `v1.0.2` | 1.0.2 | 10 | `987c68c28f` | 2026-07-07 | Submitted | Gift Sparkles, pinned posts, tappable hashtags, Dream this again, dream-notification aggregation + Dreams-tab auto-ack, comment profile taps + @mentions, share-sheet + create-screen polish, cast-photo / pull-to-refresh / album fixes. |
| `v1.0.1` | 1.0.1 | 9 | `805519184c` | 2026-07-05 | Submitted | Followers-list crash fix, block-aware profile counts, Message button removed. |
| `v1.0.0` | 1.0.0 | 8 | `9feb0c4200` | 2026-07-03 | Approved (first release) | First App Store submission. |

<!--
TestFlight / non-shipped production builds (from `eas build:list`, for reference —
NOT tagged): 1.0.0 b7 (canceled), b6, b5, b4, b3, b2 (errored). Only builds that
were submitted for App Store review get a row + a tag above.
-->

## How to add a row

After a build finishes and you submit it in ASC:

1. `eas build:list --platform ios --limit 1` → note the build number + commit.
2. Add a row at the TOP of the table (newest first) with the tag, version, build,
   short commit, date, ASC status (`Submitted` → later `Approved` / `Rejected`),
   and a one-line "what changed".
3. Commit `RELEASES.md` (the release commit or a follow-up — either is fine).

# ASC_AGE_RATING.md — App Store Connect Age Rating reference

What DreamBot actually ships for user-generated content, communication, and
moderation, so the **Age Rating questionnaire** (App Store Connect → App
Information → Age Rating → Edit) can be answered accurately and consistently.

Apple added new social-media / communication questions to the Age Rating flow
(notice "Update Your Age Ratings Responses about Social Media", deadline
2026-09-07). Those questions live **inside the Age Rating editor**, not as a
standalone page. Age Rating is app-level metadata; the editor may be **locked
while a version is In Review** and unlocks once review resolves.

Audit date: 2026-07-11 (against `main`). Re-verify before answering if the app
has materially changed since.

---

## Feature reality (evidence-cited)

| # | Capability | Answer | Evidence |
|---|------------|--------|----------|
| 1 | **User-generated content, shared publicly** (AI dream images + user-written captions/descriptions to a public feed) | **YES** | Dreams are private by default; user posts to make public (`app/post/new.tsx:205,239`; `is_public`/`posted_at` in `supabase/migrations/116_instagram_privacy_refactor.sql`). Public feed = `get_feed` RPC. |
| 2 | **Direct / private messaging between users** (DM, chat) | **NO** | No messages/chat/conversation table exists anywhere in `supabase/migrations/`. `DM_FEATURE_PLAN.md` is an unbuilt plan. "Share to friend" (`hooks/useSendShare.ts`) sends an image only — **no text field**. The inbox (`app/inbox.tsx`) is system notifications, not messaging. |
| 3 | **Public comments** | **YES (public)** | `hooks/useAddComment.ts`, `components/CommentOverlay.tsx`; RLS "Anyone can read comments" (`supabase/migrations/039_comments_and_notifications.sql:225`). |
| 4 | **Social graph** — follows, private accounts + follow requests, likes, reposts, profiles (avatar/bio) | **YES** | `follows`, `follow_requests` (`098_follow_requests.sql`), `likes`, `post_reposts`; `users.is_public`; bio/display name (`207_user_display_name_and_bio.sql`). |
| 5 | **Content moderation** | **PARTIAL** (see below) | report + block + text filter + human review; **no** first-party automated image scanning. |
| 6 | **Age / birthdate collection** | **NO** | Signup = username/email/password only (`app/(auth)/signup.tsx`). No DOB field, no age gate. |
| 7 | **Public web exposure** | **YES** | `dreambotapp.com/post/<id>` renders individual posts publicly with **no login** (dreambot-web plain HTML share route). Share link built at `app/sharePost.tsx:171`. |
| 8 | **IAP / gambling / web browsing** | IAP **YES**; gambling **NO**; arbitrary web browsing **NO** | Sparkles (consumable) + Pro (subscription) via RevenueCat; no wagering/loot-boxes; external links are fixed developer URLs only (no user-supplied WebView). |

---

## Moderation stack (what's actually enforced)

- **Text filter — YES, server-enforced.** DB trigger (`supabase/migrations/276_server_moderation.sql`) on **comments, usernames, display names, bios**; blocks racial/ethnic + homophobic/transphobic slurs and self-harm phrases. Does **not** block ordinary profanity (by design). Cannot be bypassed by a modified client. Client pre-check: `lib/moderation.ts`.
- **Image safety — the IMAGE MODEL's built-in NSFW filter (Flux), NOT a DreamBot scanner.** SightEngine was removed April 2026 (`lib/moderation.ts` header; `moderateImage()` is a no-op PASS). **Answer "no" if asked whether YOU run automated image moderation** — safety here = upstream model filter + user reports + human review.
- **Report — YES**, on posts/comments/users (`lib/reportContent.ts`). Reasons shown to users:
  - Spam or scam
  - Harassment or bullying
  - Nudity or sexual content
  - Violence or hate
  - Something else
- **Block — YES** (`hooks/useBlockUser.ts` → `block_user` RPC; severs follows both ways).
- **Human review — YES.** Admin reviews reports, deletes any post/comment, bans users (`is_admin`; `313_user_ban.sql`; `314_reports_admin_review.sql`). Committed to acting **within 24 hours** (Guideline 1.2).

---

## Recommended questionnaire answers

- **Users can communicate** → **Yes, but PUBLIC ONLY** (comments). No private/direct messaging.
- **User-generated content created/shared publicly** → **Yes** (and viewable by others, incl. on the public web).
- **Controls: report content, block users** → **Yes** to both.
- **Automated content filtering** → **Yes for text** (server-enforced). **No first-party automated image scanning** (rely on the model's NSFW filter + reports + human moderation).
- **Human moderation** → **Yes**, reviewed within 24h.
- **Collect user age** → **No**.

Answer honestly and let ASC compute the rating; do not hand-force it lower. A
public-UGC social app with user communication will very likely compute to
**16+ or 17+** under Apple's new tiers.

---

## Legal age alignment (Terms / Privacy)

- Terms: **"You must be at least 17 years old to use DreamBot."**
- Privacy: **"DreamBot isn't intended for anyone under 17, and we don't knowingly collect their data."**
- Terms "Content Moderation" section already describes report/block + automated word filter + built-in image safety filters + "act within 24 hours" — **consistent** with the shipped moderation stack and with Guideline 1.2.

**Is the 17+ ToS a problem vs. the App Store rating? No.** The ToS minimum age
is a stricter *contractual floor*; the App Store rating is a *content
descriptor*. They need not match. The computed rating will land at/near 17+
anyway, so they'll be consistent. Do **not** answer the questionnaire in a way
that implies a 12+/13+ audience (contradicts the ToS + "under 17" clauses). No
action required for this release; optionally revisit a neutral age screen later
if age-assurance regulation tightens.

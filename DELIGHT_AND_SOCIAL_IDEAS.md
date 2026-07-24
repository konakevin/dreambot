# DreamBot — Delight & Social-Fun Ideas

**Status:** Idea brief / product context (2026-07-24). Output of a 6-agent product deep-dive across
onboarding, create, nightly/retention, social/feed, monetization, and existing personality/bots.
**North star (Kevin, verbatim intent):** this is for **pure joy** — humor and the app's own flavor so
it's "not just another AI image app." NOT upsells, conversion, retention-hacking, or "get the user to
do XYZ." **The test for every idea below: does it make someone laugh, smile, or feel delighted?** If
an idea's real job is to move a metric, it's not here. (See `memory/feedback_delight_pure_joy_not_upsell`.)

Also in scope (Kevin's follow-up): **fun social/multiplayer** — games, contests, playing with your
network — judged the same way (fun to play, not a virality trick).

---

## 0. The app in one breath (context for anyone reading cold)

Three loops:
1. **Build a Vibe Profile** — onboarding: pick places, add your face + a "+1" (Dream Cast), set mood
   sliders. (`app/(onboarding)/`, `components/onboarding/*`)
2. **Dreams get made** — a personalized dream renders overnight while you sleep (nightly, Pro/trial),
   OR you conjure one on-demand (Create: style/medium + vibe + AI model, optionally your face swapped
   in). (`app/(tabs)/create.tsx`, `scripts/nightly-dreams.js`, `supabase/functions/{generate-dream,nightly-dreams}`)
3. **Dreams live in a social feed** — like / comment / repost / follow / share; profiles are albums.
   18 personality "bots" post to the feed 4×/day to keep it alive.
   (`app/(tabs)/index.tsx`, `components/{FullScreenFeed,DreamCard}.tsx`, `scripts/bots/`)

Sparkles = the fuel (create costs 1–5 ✦); Pro unlocks the nightly. Not relevant to most ideas here.

---

## 1. THE core insight

**DreamBot already has a soul — it just never gets to use it.** There's a real character and a warm,
funny voice scattered across the app, mostly sitting idle:

- **The mascot** — a small round bubble-bot with glowing amber eyes; cute + contemplative, not a joke.
  Character bible: `DREAMBOT.md`, `DREAMBOT_CHARACTER.md`, render recipe `DREAMBOT_MASCOT_PROMPTS.md`.
- **5 rotating "painter" variants** on the loading screen (`components/MagicalLoadingStage.tsx`).
- **A genuinely *sad* bot** on the error screen with real pathos ("this dream floated off… he's taking
  it pretty hard") — `components/OopsScreen.tsx`. This is the funniest, most on-brand asset in the app.
- **The nightly "postcard voice"** — every nightly dream gets a Haiku-written little title
  ("Torchlit luau on a Hawaiian beach", "Neon-soaked midnight rooftop"). Poetic, place-led, already
  charming. Generated in `supabase/functions/dream-queue-worker/dispatchers/nightly.ts`.
- **Brand craft** — `BrandSpinner`, `GradientTitle` (violet→pink→teal), `SparkleField`, haptics
  everywhere. The polish is there.

**The single biggest "make it ours" move is to let the bot be alive** — react to you, have opinions,
occasionally be a little unhinged. That's flavor no other AI-image app has.

---

## 2. Dormant / thin primitives worth exploiting (already-built raw material)

- **"Dream Like This" (DLT) is a full remix engine that's feature-flagged OFF** (`DLT_ENABLED=false`).
  Turning it on unlocks telephone / duels / remix-chains for near-free. (`app/dreamLikeThis.tsx`,
  `DLT_FIDELITY_PLAN.md`)
- **Face-swap + Dream Cast (+1)** already puts a chosen person into a scene — the seed of "cast your
  friend into a dream." (`components/onboarding/DreamCastStep.tsx`, `_shared/characterSlotPrompt.ts`)
- **In-app share-to-friends** (multi-select a dream, send to friends in-app) already exists —
  friend-to-friend plumbing is done. (`app/sharePost.tsx`, `hooks/useSendShare.ts`)
- **@mentions render but don't notify anyone** — free connective tissue. (`lib/hashtags.ts`,
  `components/ExpandableDescription.tsx`)
- **Reactions = "like" only.** No way to say "this is horrifying and I love it."
  (`hooks/useToggleLike.ts`, `components/DreamCard.tsx`)
- **18 bots have distinct personalities but never *do* anything toward the user.** (`BOTS.md`,
  `scripts/bots/`)

---

## 3. Solo delight menu (pure joy; tiny → medium builds)

- **A bot with opinions.** The nightly postcard voice already exists — widen its range. Some mornings
  poetic, some mornings a gremlin ("you, but a medieval blacksmith??? incredible"). Same pipe
  (`dispatchers/nightly.ts` Haiku prompt), more personality.
- **The bot reacts to *your* dream.** On the reveal screen, DreamBot peeks at what you made and says
  something — impressed, mildly concerned, or deeply confused. The reaction is the joke.
  (`app/dream/reveal.tsx`)
- **Chaos Mode.** "Surprise Me" cranked to force the weirdest medium+vibe collisions on purpose. The
  delight is "I'd never have picked this and it's amazing/cursed." (`hooks/useDreamCreate.ts` roll logic)
- **Give the sad bot more stage time.** That Oops-screen energy is gold. Empty states, failed dreams,
  empty inbox — let the bot have little feelings about them. (`components/OopsScreen.tsx` as the tone
  template; empty states across `app/`)
- **Reveal fireworks.** A dumb, delightful sparkle-burst when a dream lands — it's a magic moment,
  treat it like one. (`components/SparkleField.tsx` already exists)
- **Easter eggs.** Prompt "dreambot" → it draws itself. Absurdly specific prompts get a bot aside.
  Small winks for the curious.
- **Loading-screen bits.** The painter mascot rotates already — give it one-liners while you wait
  ("mixing the impossible colors…", "arguing with the sky about the sunset…").
  (`components/MagicalLoadingStage.tsx`)

---

## 4. Play-with-friends / games / contests (the killer-app dimension)

Flagged ⭐ = highest fun-per-effort, plumbing mostly exists.

- **⭐ Cast a friend into a dream.** Put your buddy's face on the moon / as a Renaissance king / as a
  sad Victorian ghost. They get a "you've been dreamed" notification — the *reveal* is the punchline.
  Builds on Dream Cast +1 + face-swap.
- **⭐ Dream telephone.** A dream gets remixed down a chain of friends, drifting hilariously from the
  original. This is literally what DLT does — flip it on and chain it.
- **⭐ Dream duels.** Two friends get the same ridiculous prompt; friends/network vote on whose is
  funnier/weirder. Winner gets a stupid trophy and nothing else.
- **Caption contests.** A bot posts something unhinged; everyone races to caption it; funniest floats
  up. (Reuses comments + a light vote.)
- **Co-op dreams.** You pick the place, your friend picks the vibe → one shared dream neither of you
  fully controlled.
- **Themed daily prompt.** "Everyone: your pet as a medieval knight." For a day the feed becomes one
  shared, delightful gallery.
- **Leaderboards you want to *lose*.** Not "most likes" — "Most Cursed Dream of the Week," "Weirdest
  Streak," "Chaos Gremlin." Rankings that are a badge of *dishonor*.
- **Reactions beyond the heart.** 😂 🔥 💀 ✨ — richer, funnier expression than a like.
- **Make @mentions actually notify.** Low-hanging: getting pulled into a friend's dream comment is a
  tiny hit of connection.

---

## 5. Deliberately EXCLUDED (applied the joy filter)

Every agent kept surfacing these; all cut because they exist to move a metric, not to make someone
grin: daily-login streaks-to-retain, badge/achievement systems for engagement, tip-your-favorite-
creator, viral-sparkle-bonuses, referral-for-growth, trial-urgency push sequences, "spend $X unlock
Y", creator monetization, milestone-celebrations-as-conversion. (Sparkles can still be a fun *prize*
inside a game — just never the point.)

> NOTE: A dedicated **Refer-a-Friend** feature is being planned separately (`REFER_A_FRIEND_PLAN.md`)
> at Kevin's explicit request — that one IS an intentional growth feature, scoped on its own terms.

---

## 6. If we build: two starting directions
1. **Living-bot personality** — the reactive voice (nightly range + reveal reactions + sad-bot
   everywhere). Lowest lift, highest "this is *ours*" payoff, touches copy/voice more than schema.
2. **A friends game** — cast-a-friend, telephone, or duels. Bigger build, but the killer-app hook;
   telephone/duels ride the dormant DLT engine.

# DreamBot Dream Pipelines — plain-English guide

A read-along companion to **`pipeline-diagram.html`** (open it in a browser for the visual flowchart).
This explains, in everyday language, exactly how a dream gets made — from a user typing a few words, or a
nightly seed, all the way to a finished image showing up in the app.

> **The one big idea:** there are **two ways a dream gets _started_** (a user makes one, or the nightly
> robot makes one), but they both pour into the **same assembly line** that does the actual work. So most
> of this guide is about that one shared assembly line; the two "start" paths are short.

---

## The cast of characters (so the diagram colors make sense)

- **The app (blue):** the iOS app on the user's phone.
- **Edge Functions (green):** small backend programs that run on Supabase. Think of each as one worker at
  a station. Names you'll see: `enqueue-dream`, `dream-queue-worker`, `generate-dream`, `nightly-dreams`,
  `first-dream-render`, `send-push`.
- **Database tables (purple):** where we write things down. The important one is **`dream_queue`** — a
  to-do list of dreams waiting to be made.
- **Storage (yellow):** where the finished image files live (the "uploads" bucket).
- **External AI (orange):** the outside brains we rent — **Anthropic** (writes the image prompt),
  **Replicate / Gemini / OpenAI** (paint the image), and **Fly.io** (does the face swaps).
- **Mechanisms (gray):** the gears — timers (cron), the recipe steps, the rules.

The trick that makes everything scale: **nobody makes a dream on the spot.** A dream is always *written
onto the `dream_queue` to-do list first*, and a separate worker picks jobs off that list at a safe pace.
That way a flood of requests just makes a longer list — it never overwhelms the painters.

---

## Pipeline 1 — "Create" (a user makes a dream)

This is the interactive, paid path. A user is staring at a loading screen, so speed matters.

1. **User types a blurb** in the Create screen (e.g. "me as a wizard in a storm") and taps go.
2. The app calls the **`enqueue-dream`** worker, which does four quick things:
   - **Checks who they are** (their login token).
   - **Checks they aren't spamming** — no more than 5 dreams in flight at once.
   - **Charges sparkles** (the in-app currency). This is safe to retry — it never double-charges.
   - **Labels the dream "light" or "heavy."** Heavy = it'll need a face swap (those are the expensive,
     slow ones, so we keep a tight limit on them); light = plain text scene.
3. It **writes the dream onto the `dream_queue` to-do list** and instantly hands the app back a `dream_id`
   (in under half a second). The user's loading screen starts **watching that one row** for changes.
4. From here it's the **shared assembly line** (below).

That's it for the "start" — `enqueue-dream` is deliberately fast and dumb. The real work is shared.

---

## Pipeline 2 — "Nightly" (the robot makes everyone a dream while they sleep)

This is the automatic, free, batch path. Pro/trial members get one dream every night.

1. **A timer fires once a day** (a GitHub Actions cron at 8am UTC) and runs a script,
   **`nightly-dreams.js`**.
2. The script **finds every eligible member** (Pro or in-trial), in pages of 1,000 so nobody gets silently
   skipped, and **skips anyone who already got tonight's dream** (so a re-run can't double up).
3. It **writes one dream onto the `dream_queue`** for each of them, all labeled "heavy" (nightly dreams use
   the user's saved cast, so they involve face swaps).
4. From here it's the **same shared assembly line** — the only real difference is *where the prompt comes
   from*: instead of a user's typed words, a nightly dream is **hydrated** from the member's saved
   **recipe** (`user_recipes`) plus a random scene **template** from the `nightly_seeds` pool.

(There's a third tiny variant — the **onboarding "first dream"** — which goes through `first-dream-render`
and tries a few fallback tiers, but it's the same engine underneath.)

---

## The shared assembly line (this is where 90% of the work happens)

Everything above just put a row on the `dream_queue` to-do list. Now the actual making-of-the-dream:

### Step A — The worker picks up the job

- The **`dream-queue-worker`** is the foreman. It wakes up constantly (every minute via a database timer,
  plus an extra nudge the moment a dream is enqueued, plus a reliable 5-minute backstop from GitHub).
- It **claims a batch of jobs off the list** — but only up to a **safe limit per type** (lots of "light"
  dreams at once is fine; "heavy" ones are capped low because they lean on the Fly.io face-swap service).
  This limit is enforced atomically, so even with several workers running at once they can never
  collectively grab too many.
- It hands each claimed job to the right render station and **holds the line open** while it renders
  (this "stay connected until it's done" detail is what makes it reliable).

### Step B — Hydrate the prompt + build the brief

This is where a few words (or a seed) become a rich instruction for the AI:

1. **Resolve the look:** load the chosen *medium* (e.g. watercolor) and *vibe* (mood), the user's saved
   *places* and *cast photos*.
2. **Roll the scene:** an algorithm (`rollDream`) picks the composition — who's in it, where, the framing.
3. **Build a brief:** `recipeBuilder` + the scene engine assemble all of that into a detailed instruction.

### Step C — Sonnet writes the actual image prompt

The brief is sent to **Anthropic's Sonnet model**, which turns it into the final, polished text prompt that
an image model can paint from. We then **sanitize** it (strip anything that would trip a safety filter).

### Step D — Paint the image

1. **Pick the painter:** based on the medium, choose an image model.
2. **Generate:** call **Replicate (Flux)**, **Gemini**, or **OpenAI** — submit the prompt, then poll until
   the image is ready and we get back an image URL. (If the painter is briefly rate-limited, we retry a
   bounded number of times, then give up gracefully.)

### Step E — Swap in the real face (if needed)

- **Dual** (two people, e.g. a couple): sent to the **Fly.io `face-swap-dual`** service, which detects both
  faces and pastes the right person onto each.
- **Single** (one person): done in-process.
- **None** (plain scene, no cast): skipped.

### Step F — Save it

- **Upload the finished image** to Supabase **Storage** (the uploads bucket).
- **Write a database row** (`uploads`) recording the dream, plus an **audit log** (`ai_generation_log`) and
  **stage breadcrumbs** (so if anything failed we know exactly which step died).
- **Mark the job done** (`completeQueueJob`) — set the `dream_queue` row to "completed" and attach the
  image. This is the signal everyone's been waiting for.

---

## Getting it back into the app

- **Create:** the user's loading screen was *watching* their `dream_queue` row in real time. The moment it
  flips to "completed," the screen shows the finished dream. The user can then **Post** it (make it public).
- **Nightly:** there's no one watching live, so instead we generate a little **bot message** (a one-liner
  from Haiku), write a **notification**, and a database trigger fires a **push** (`send-push` → Expo → the
  phone). The user wakes up to "your dream is ready."
- **The feed:** when anyone opens the feed, a database function (`get_feed`) serves the posted, public,
  non-blocked dreams. The actual image files are served straight from Storage as public URLs.

---

## When something goes wrong (the safety nets)

The whole point of the to-do-list design is that failures are contained, not catastrophic:

- **A render fails** → `failQueueJob` retries it a few times with growing delays; if it truly can't render,
  it gives up ("dead-letter"), **refunds the sparkle**, and **notifies** the user.
- **A worker dies mid-render** → "stale recovery" notices the job has been stuck and puts it back on the
  list for another try.
- **The backend's background tasks get dropped by the platform** (this actually happened) → the **5-minute
  GitHub backstop** keeps draining the queue anyway, so dreams still get made.
- **A photo or model is missing** → caught early and dead-lettered fast (no 2-hour stuck loop).
- **Watchers** (monitors + an hourly synthetic "smoke test" dream) shout loudly if the pipeline stalls, and
  every failure is **diagnosable** down to the exact stage that broke (`scripts/check-forensics.js`).

---

## Create vs Nightly at a glance

| | **Create** | **Nightly** |
|---|---|---|
| **What starts it** | user taps "make a dream" | a daily timer (8am UTC) |
| **Where the prompt comes from** | the user's typed words + their vibe profile | the user's saved recipe + a random seed template |
| **Cost** | charges sparkles (and caps spam) | free (a Pro/trial perk) |
| **Feel** | interactive — drains immediately | batch — drains overnight |
| **How they learn it's done** | live loading screen (realtime) | a push notification |
| **Everything in between** | **identical** — same queue, same worker, same engine, same render, same swap, same storage, same safety nets | **identical** |

**Bottom line:** the only real differences are *who kicks it off* and *where the words come from*. From the
`dream_queue` onward, a user's dream and a nightly dream travel the exact same road.

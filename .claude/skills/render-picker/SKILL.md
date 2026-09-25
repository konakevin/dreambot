---
name: render-picker
description: Show Kevin a set of renders/images as a private artifact page where he picks one per group (with optional header-style crop + drag-to-reposition) or votes love / keep / cut on each, and Claude reads his choices straight back from the page's database. Use whenever Kevin wants to choose, grade, or vote on candidates — "show me options", "let me pick", "put these in a picker", "I want to vote on these renders", "html sheet of candidates", bot header/avatar picks, look/vibe/pool QA batches.
---

# render-picker: pick or vote on images in a private page

Kevin built this workflow on 2026-09-24 while choosing a header for each of the 18 bots, and called it "really
convenient". It lets him review a big batch of images on his phone or laptop. He taps to choose or vote, and
every tap saves to the artifact's `db`. Claude then reads the results with `ArtifactData`, so nothing has to be
copied by hand. His "Copy results" button is only a backup.

The original bot-header picker is https://claude.ai/artifact/UWcajVydioHKaV3FMkuAUu. Its final picks are in
the `picks` collection.

## Two modes

| mode | what Kevin does | db doc per group | use for |
|---|---|---|---|
| `pick` | chooses ONE item per group | `{n, uploadId, label, text, focalY, pickedAt}` | headers, avatars, "which of these for X" |
| `vote` | ♥ love / ✓ keep / ✕ cut on EVERY item | `{votes: {"<n>": {v, id}}, updatedAt}` | render QA batches, looks/vibes, pool repair rounds |

Two frame options:
- `frame: "full"` shows each image whole, at its real aspect ratio.
- `frame: "header"` shows each card cropped exactly like the Dreamscape profile header: 390x336 on an iPhone 14, with the eased fade, the avatar, and the name overlay.
  - In pick mode he can drag the picture to set `focalY` (0-100). This value works the same as CSS `object-position` Y.
  - Set `overlay: false` to crop without the name overlay. Set `frameAspect` (height/width) to use a different crop.

## Files (this directory)

- `template.html`: the page. It has one dark theme and renders everything from the embedded JSON. Its db code follows `artifact-capabilities` contract 0.2.58.
- `build.py`: takes a manifest and produces a publishable folder.
  - Downloads with retries, runs 6 at a time, and skips files it already has.
  - Resizes to 560px wide.
  - Measures the REAL aspect ratio of each image.
  - Writes `index.html`, `files.json` and `files-new.json`.

## Workflow

### 1. Collect candidates into a manifest (scratchpad, never the repo)

```json
{
  "title": "Bot Header Casting",            // <title>, 2-4 words, a name not a caption
  "eyebrow": "Dreamscape · Bot headers", "heading": "Pick each bot's header",
  "lead": "One sentence on what he is choosing and what is shown.",
  "mode": "pick",                           // or "vote"
  "frame": "header",                        // or "full"
  "collection": "picks",                    // db collection (default picks / votes)
  "groups": [
    { "key": "farmbot", "name": "FarmBot", "handle": "@farmbot", "subtitle": "optional line",
      "avatarSrc": "https://…/avatars/<id>/avatar.jpg",   // optional
      "items": [
        { "n": 68, "id": "<uploads.id>", "src": "https://…display.jpg or /local/path.jpg",
          "label": "animal-feeding-time", "meta": "2026-09-12",
          "sec": "Round 2 · Space", "secNew": true,   // optional section header; consecutive items group
          "note": "Your saved post" }                  // optional green caption
      ] } ]
}
```

- **Other manifest fields:**
  - Picking between text options (taglines, captions, copy) over the same image: give every item the same `src` and put the words in `text`.
    - `text` shows under the frame in the app's bio style, and the chosen `text` is saved with the pick.
    - `build.py` stores a shared image once.
  - `focalY` on an item sets its starting crop.
  - `"drag": false` turns off repositioning.
  - `"columns": 5` sets the grid width on desktop.
  - The first use of text options was the bot tagline picker, https://claude.ai/artifact/CLS8HF4MeNsxYpvajf5bsh (collection `taglines`).
- **`n` must be unique within a group, forever.** Give each re-roll its own number range (round 1 = 1-150, round 2 = 200s, round 3 = 500+). That way an earlier pick stays valid and the image files never collide.
- **`id` should be the `uploads.id`**, so the result maps straight to a post.
- **Image source:** use `image_url_display`, falling back to `image_url`.
  - Thumbnails (`image_url_thumb`, about 400px) are only for contact sheets.

### 2. Curate (when Kevin asks for "options", not "every render")

- **Rendered batches: show everything.** If the page shows renders Claude just made for Kevin to judge, include every one (memory `feedback_include_all_candidates_never_prefilter`).
- **Picking from a library: curate.** When he asks for "several options from a bot's library", pick them yourself:
  1. Pull every public, active, unquarantined post with the service-role client, paginated (PostgREST caps reads at 1000).
  2. Sample round-robin across paths (path = caption `[path]` or `› path`), newest first, so every path gets a turn.
  3. Download the thumbnails and build numbered contact sheets:
     `montage -label '%t' @list -font /System/Library/Fonts/Supplemental/Arial.ttf -pointsize 15 -fill white -background '#111' -tile 10x -geometry 124x155+3+3 sheet.jpg`
     The explicit `-font` is required on this Mac; without it montage errors out.
  4. Read the sheets **two at a time and write the chosen numbers to a JSON file after each bot**. Image-heavy turns drop older images from context ("[media removed]"), and picks you only held in your head are lost.
  5. Apply the bot's identity rules while picking (`BOT_SCENE_QUALITY_PLAYBOOK.md`). For example: no people on no-human bots, no buildings on EarthBot, no text or signs on YumBot, nothing revealing on GothBot.
  6. For requests like "more X", filter by path groups, then round-robin.
- **Never rank or pick by likes or favorites** (memory `feedback_hearts_are_pointers_not_ratings`).
  - When Kevin says he saved or hearted ONE post, look that one up: `favorites` ordered by `created_at desc`, filtered to his user id.
  - Add it as an item with a `note`, and set his pick for him with `ArtifactData set`.

### 3. Build

```bash
python3 .claude/skills/render-picker/build.py manifest.json <scratchpad>/picker-site
```

It prints the image sizes it found.

**Never assume every image is 768x1344.** On 2026-09-24 the real display files were 768x1344, 768x1376, 752x1344 and 768x1152, even though `uploads.width/height` said 768x1344 for all of them.

### 4. Publish (first time)

Use the `Artifact` tool with these parameters:
- `file_path` = `<site>/index.html`
- `root` = `<site>`
- `files` = the contents of `files.json`
- `capabilities` = `{"db": {}}`
- `icon` = `"gallery"`
- `description` = one sentence

Then run ONE check: an `ArtifactData list` of the collection. It should come back empty or with the seeded docs, which proves the read-back works.

The page is private to Kevin. Declaring `db` also makes it organization-internal.

### 5. Read results

`ArtifactData list` on the collection returns one doc per group.
- **When Kevin pastes "Copy results" text:** treat the paste as his final word, and confirm it matches the db before acting.
- **If he says "hold on":** stop, and don't record anything until he says go.

### 6. Re-roll ("give me more options for X")

1. Sample only posts **not shown before**: keep the ids of each earlier sample and exclude them.
2. Give the new items a new `n` range and a `sec` label (plus `secNew: true`), and put them at the top of the group's items.
3. Rebuild into the SAME site folder.
4. Republish the same `file_path` with `files` = `files-new.json` only.
   - Files you don't pass are kept.
   - Omit `capabilities` so the db declaration carries forward.
   - Omit `icon`.

Kevin's existing picks survive, because the docs are keyed by group and `n` values never repeat.

## Voting on fresh renders (the main future use)

1. Render as usual.
   - Bot tests go out as SHADOW posts (`feedback_always_post_test_renders_not_tmp`).
   - Non-bot QA goes to the private dreams album (`feedback_test_renders_to_private_dreams_album`).
2. Use the resulting `uploads` rows (or local files) as the items.
   - Group by whatever he is judging: path, look, vibe, model, or round.
   - Use `mode: "vote"` and `frame: "full"`.
   - Put the prompt or seed in `label`/`meta` so he can see what produced each image.
3. Read the votes back, then act:
   - **love** = the bar to aim for.
   - **keep** = acceptable.
   - **cut** = a strike (fix the render; never touch poses. Memory `feedback_bookmarks_are_strikes_scrap_look`).
4. Record the tallies wherever that work is tracked, for example `RESEED_STATUS.md` or the playbook.

## Gotchas

- **Supabase storage throttles bursts.** At 24 parallel downloads, about a quarter fail. Keep to 6-8 at a time with retry passes; `build.py` already does this.
- **Keep images under about 20 MB per page.** At 560px and quality 72, each image is roughly 60-80 KB, so 300 images is fine.
- **Artifact limits:** at most 255 entries in `files` per publish. For a bigger first publish, publish in two batches (the second as a republish).
- **Keep `n` numbering consistent.** The page loads `img/<group>/<n>.jpg`, where `<n>` is the plain number with no padding. The display label pads to 3 digits, but file names never do.
- **Data needed to redo a round belongs in the scratchpad**, not the repo: the manifest, the full post dump, and the samples.

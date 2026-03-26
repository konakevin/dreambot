# Video Streaming Options — Rad or Bad

Written: 2026-03-26
Context: 10-second vine-style video clips, Supabase backend, solo dev, limited resources.

---

## The Problem

Getting videos to start playing "instantly" (like Instagram/TikTok) requires:
1. Small file sizes (fast transfer)
2. Correct file format (MP4 with moov atom at the front — enables streaming before full download)
3. CDN edge caching (serve from a node close to the user)
4. Adaptive bitrate (serve lower quality if connection is slow)

Raw iPhone video (10s clip at 1080p) can be 50–80MB. That is the enemy.

---

## 10-Second Duration Limit

**Already implemented correctly.** `videoMaxDuration: 10` in `expo-image-picker` enforces this at the OS level:
- Camera stops recording at 10s
- Library forces the user to trim to 10s

Do NOT use file size as a proxy for duration. A 10s clip can range from 2MB to 80MB depending on source quality.

Optional additional validation: read `asset.duration` from the picker result and reject if > 10s.

---

## Option 1: On-Device Compression (Current / Recommended First Step)

**Library:** `react-native-compressor`

**How it works:** Before uploading, compress the video on the user's device. Targets ~1 Mbps H.264, which is roughly equivalent to YouTube 720p.

**Result:** 10s clip goes from ~50–80MB → ~2–5MB. At 10 Mbps mobile speeds, that's under 1 second to download.

**Cost:** Free.

**Limitations:**
- Compression happens on the user's device (takes a few seconds — show a progress indicator)
- No adaptive bitrate — everyone gets the same quality
- moov atom placement not guaranteed (may not stream before fully downloaded, though at 2–5MB this is barely noticeable)
- No server-side transcoding safety net

**Implementation steps:**
1. `npx expo install react-native-compressor`
2. In `useUpload.ts`, before calling `uploadFile()` for videos, run `Video.compress(uri, { compressionMethod: 'auto', maxSize: 1280 })`
3. Show a compression progress indicator in the upload screen UI
4. Upload the compressed file instead of the original

**Status: Recommended to implement now.**

---

## Option 2: Cloudflare Stream

**Cost:** $5/month flat + $1 per 1,000 minutes stored (~free at current scale)

**How it works:** Upload raw video directly to Cloudflare Stream. They:
- Transcode to HLS (HTTP Live Streaming) with multiple quality levels
- Place moov atom correctly for instant start
- Serve via Cloudflare's global CDN (200+ edge locations)
- Auto-generate thumbnails (can eliminate `expo-video-thumbnails`)
- Return a `playback_url` you store in your database instead of a raw file URL

**Result:** Near-instant playback globally. Adaptive bitrate means users on slow connections get lower quality automatically.

**Limitations:**
- Requires backend upload logic (can't upload directly from client without exposing API keys)
- Needs a Supabase Edge Function or similar to proxy the upload
- Replaces Supabase Storage for video files (images can stay in Supabase Storage)
- `thumbnail_url` generation logic changes (Cloudflare provides it)

**Implementation steps:**
1. Create a Cloudflare account and enable Stream
2. Write a Supabase Edge Function that accepts the video file, forwards it to the Cloudflare Stream API, and returns the `playback_url` and `thumbnail_url`
3. In `useUpload.ts`, for videos: call the Edge Function instead of uploading directly to Supabase Storage
4. Store `playback_url` as `image_url` in the `uploads` table (or add a dedicated `video_url` column)
5. Store Cloudflare's auto-generated thumbnail as `thumbnail_url`
6. In `SwipeCard` and `app/photo/[id].tsx`, use `playback_url` for `VideoView` source

---

## Option 3: Mux

**Cost:** ~$20+/month (based on storage + delivery minutes)

**How it works:** Same concept as Cloudflare Stream — upload raw video, Mux transcodes and serves via CDN. Better developer experience, richer analytics dashboard, more detailed playback metrics.

**When to consider:** When you have enough users that understanding playback quality and buffering rates matters. Mux's analytics are significantly better than Cloudflare Stream's.

**Implementation steps:** Same as Cloudflare Stream — swap the API target.

---

## Prefetching (Future Enhancement)

Once compression or streaming is in place, prefetching is the next lever:
- When a video is visible in the feed, start loading the *next* video in the background
- `expo-video` supports this via creating a `VideoPlayer` instance before the video is on screen
- Only worth doing after file sizes are small (no point prefetching 50MB files)

---

## Decision Matrix

| Option | Cost | Complexity | Quality | When to use |
|--------|------|------------|---------|-------------|
| On-device compression | Free | Low | Good | Now — always do this |
| Cloudflare Stream | ~$5/mo | Medium | Excellent | When you have real users |
| Mux | $20+/mo | Medium | Excellent | When you need analytics |
| Prefetching | Free | Low-Medium | — | After compression is in |

---

## Recommendation

1. **Now:** Add `react-native-compressor` to the upload flow (Option 1). Gets you most of the benefit for free.
2. **After user growth:** Migrate video uploads to Cloudflare Stream (Option 2). Minimal code change, massive quality improvement.
3. **After revenue:** Evaluate Mux if playback analytics become important.

Supabase Storage already sits behind Cloudflare's CDN, so compressed videos uploaded there will be edge-cached after first access — making Option 1 more effective than it might sound.

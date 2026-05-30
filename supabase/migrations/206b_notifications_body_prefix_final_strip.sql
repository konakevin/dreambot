-- Migration 206b: one-shot regex strip of any lingering body prefix.
--
-- Post-206a verification still shows 696 prefixed rows:
--   • 667 dream_generated with body LIKE 'dream:%' (subtype IS NULL)
--   • 29  download_ready / wish / etc with body LIKE '<prefix>:%' (subtype SET)
--
-- The 29 with subtype-set-but-still-prefixed are unreachable by 206/206a's
-- `subtype IS NULL` guards — they're hold-outs from some earlier partial
-- run where subtype landed but the body-strip didn't. The 667 should have
-- been caught by 206a's unguarded dream-strip but weren't (whatever Kevin
-- pasted didn't reach that UPDATE).
--
-- This is a single UPDATE that strips ANY of the 4 legacy prefixes from
-- body regardless of subtype state. Idempotent — the regex won't match a
-- body that's already been stripped.

update public.notifications
   set body = regexp_replace(body, '^(wish|welcome|dream|download):', '')
 where body ~ '^(wish|welcome|dream|download):';

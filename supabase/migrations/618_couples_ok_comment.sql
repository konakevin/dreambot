-- 618: document why the Dreamscapes cards are couples_ok = false, next to the column itself (Kevin 2026-09-30: "make a
-- note in the code about why"). The same note sits on the re-roll in nightly-dreams. Comment only.

COMMENT ON COLUMN public.location_cards.couples_ok IS
  'false = a couple dream never lands here (nightly-dreams re-rolls the place). Set on the Dreamscapes tile (mig 606, 615): an imagined world lives in its backdrop and a couple two-shot squeezes it out (first surreal QA: 3 of 4 couples plain portraits, one lost a face). Kevin: solo and scene-only. Open only after a QA round shows the world behind the pair.';
